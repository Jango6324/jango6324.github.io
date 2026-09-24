/* Web-optimized 30 fps copies retain the reviewed crops and action timing. */
const assetRoot = new URL("../", document.currentScript.src);
const assetUrl = path => new URL(path, assetRoot).href;
const frameDuration = 1 / 30;
const library = new Map(window.CLIP_DATA.map(clip => [clip.id, clip]));
const players = new Set();
const playIcon = '<svg class="play-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5 13 8l-9 5.5z" fill="currentColor"/></svg>';
const pauseIcon = '<svg class="play-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 3v10M11 3v10" stroke="currentColor" stroke-width="2.5"/></svg>';
const replayIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.2 5.9A7 7 0 1 1 3 10M4.2 2v4.5H.5"/></svg>';
const clock = value => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
const pane = (id, windowId, label, ours = false) => {
  const clip = library.get(id);
  const window = clip.windows.find(item => item.id === windowId);
  if (!window) throw new Error(`Missing window: ${id}/${windowId}`);
  return {...window, label, ours};
};

class Player {
  constructor(id) {
    this.el = document.getElementById(id);
    this.videos = [];
    this.version = 0;
    this.seekRevision = 0;
    this.playing = false;
    this.pending = false;
    this.seeking = false;
    players.add(this);
  }
  set(panes, cues = []) {
    const resume = this.playing;
    this.pause();
    this.version++;
    this.seekRevision++;
    this.pending = false;
    this.seeking = false;
    // Release old decoders when changing a scene or representation.
    this.videos.forEach(video => { video.removeAttribute('src'); video.load(); });
    this.panes = panes;
    this.cues = cues;
    this.activeCue = null;
    this.duration = Math.max(...panes.map(item => item.duration_seconds));
    const labels = panes.map(item => item.label).join(' and ');
    this.el.innerHTML = `
      <div class="panes" style="--columns:${panes.length};--pane-columns:${panes.map(item => (item.width/item.height)+'fr').join(' ')}">
        ${panes.map(item => `<div class="video-pane">
          <video muted playsinline preload="none" width="${item.width}" height="${item.height}"
            style="--video-ratio:${item.width}/${item.height}" aria-label="${item.label}"
            poster="${assetUrl(item.poster)}" src="${assetUrl(item.file)}"></video>
          <span class="pane-label ${item.ours ? 'ours' : ''}">${item.label}</span>
        </div>`).join('')}
      </div>
      <div class="player-controls">
        <button class="play-button" type="button" aria-label="Play ${labels}">${playIcon}Play</button>
        <button class="replay-button" type="button" aria-label="Replay ${labels}" title="Replay">${replayIcon}</button>
        <input class="seek" type="range" aria-label="Seek ${labels}" min="0" max="${this.duration}" value="0" step="${frameDuration}">
        <span class="player-time">0:00 / ${clock(this.duration)}</span>
      </div>
      <div class="player-cue" role="status" aria-atomic="true" hidden><span class="cue-description"></span></div>`;
    this.videos = [...this.el.querySelectorAll('video')];
    this.videos.forEach((video, index) => {
      video.addEventListener('waiting', () => {
        if (video.currentTime < this.panes[index].duration_seconds - frameDuration) this.rebuffer();
      });
    });
    this.leader = this.videos[panes.findIndex(item => item.duration_seconds === this.duration)];
    this.button = this.el.querySelector('.play-button');
    this.seek = this.el.querySelector('.seek');
    this.time = this.el.querySelector('.player-time');
    this.cue = this.el.querySelector('.player-cue');
    this.cueDescription = this.cue.querySelector('.cue-description');
    this.measurementRows = [...(this.el.closest('.result-block')?.querySelectorAll('[data-measurement]') || [])];
    this.button.onclick = () => {
      this.userPaused = this.playing || this.pending;
      this.userPaused ? this.pause() : this.play();
    };
    this.el.querySelector('.replay-button').onclick = async () => {
      this.userPaused = false;
      this.pause();
      const version = this.version;
      try { await this.seekTo(0); if (version === this.version) await this.play(); }
      catch (error) { if (version === this.version) this.fail(error); }
    };
    this.seek.oninput = async () => {
      const target = Number(this.seek.value);
      this.userPaused = true;
      this.pause();
      const version = this.version;
      try { await this.seekTo(target); this.update(); }
      catch (error) { if (version === this.version) this.fail(error); }
    };
    this.leader.addEventListener('ended', () => {
      const loop = this.playing && !this.userPaused;
      this.pause(); this.update();
      if (loop) this.play();
    });
    this.update();
    if (resume) this.play();
  }
  async prepare(video) {
    if (video.readyState >= 3) return;
    if (video.preparing) return video.preparing;
    video.preparing = new Promise((resolve, reject) => {
      const clean = () => { video.removeEventListener('canplay', ready); video.removeEventListener('error', error); video.removeEventListener('emptied', error); };
      const ready = () => { clean(); resolve(); };
      const error = () => { clean(); reject(new Error('The video could not be loaded.')); };
      video.addEventListener('canplay', ready, {once:true});
      video.addEventListener('error', error, {once:true});
      video.addEventListener('emptied', error, {once:true});
      // Setting preload is enough to start loading without resetting a live seek.
      video.preload = 'auto';
    });
    // A resolved promise from the first load must not bypass later buffering.
    try { await video.preparing; }
    finally { video.preparing = null; }
  }
  pause() {
    this.request = (this.request || 0) + 1;
    this.playing = false;
    this.pending = false;
    this.videos.forEach(video => { video.pause(); video.playbackRate = 1; });
    if (this.button) { this.button.innerHTML = `${playIcon}Play`; this.button.setAttribute('aria-pressed','false'); }
  }
  rebuffer() {
    if (!this.playing || this.pending || this.seeking) return;
    // Freeze the group as soon as one pane runs out of frames. Resume through
    // the normal readiness/seek path instead of repeatedly seeking that pane.
    this.pause();
    this.play();
  }
  async seekTo(time) {
    const version = this.version;
    const revision = ++this.seekRevision;
    const videos = [...this.videos];
    this.seeking = true;
    try {
      await Promise.all(videos.map(video => this.prepare(video)));
      if (version !== this.version || revision !== this.seekRevision) return;
      await Promise.all(videos.map((video,index) => {
        const target = Math.min(time, this.panes[index].duration_seconds - frameDuration);
        if (Math.abs(video.currentTime - target) < .001 && !video.seeking) return;
        return new Promise(resolve => {
          video.addEventListener('seeked', resolve, {once:true});
          video.currentTime = Math.max(0, target);
        });
      }));
    } finally {
      if (version === this.version && revision === this.seekRevision) this.seeking = false;
    }
  }
  async play() {
    if (this.pending) return;
    players.forEach(other => { if (other !== this) other.pause(); });
    const version = this.version;
    const request = ++this.request;
    this.pending = true;
    this.button.innerHTML = '<span class="play-icon" aria-hidden="true">·</span>Loading';
    try {
      await Promise.all(this.videos.map(video => this.prepare(video)));
      if (version !== this.version || request !== this.request) return;
      const current = this.leader.currentTime >= this.duration - .06 ? 0 : this.leader.currentTime;
      await this.seekTo(current);
      if (version !== this.version || request !== this.request) return;
      await Promise.all(this.videos.map((video,index) => {
        video.lastCorrection = performance.now();
        if (current < this.panes[index].duration_seconds - frameDuration) return video.play();
      }));
      if (version !== this.version || request !== this.request) return;
      this.playing = true;
      this.button.innerHTML = `${pauseIcon}Pause`;
      this.button.setAttribute('aria-pressed','true');
      this.update();
    } catch (error) {
      if (version === this.version && request === this.request) this.fail(error);
    } finally {
      if (version === this.version && request === this.request) this.pending = false;
    }
  }
  fail(error) {
    this.pause();
    this.activeCue = null;
    this.cue.hidden = false;
    this.cueDescription.textContent = 'Video could not be loaded. Please try again.';
    console.error(error);
  }
  update() {
    const current = this.leader.currentTime || 0;
    if (!this.seeking) this.seek.value = current;
    this.seek.style.setProperty('--played',`${100 * current / this.duration}%`);
    this.time.textContent = `${clock(current)} / ${clock(this.duration)}`;
    this.seek.setAttribute('aria-valuetext',`${current.toFixed(1)} of ${this.duration.toFixed(1)} seconds`);
    const cue = this.cues.filter(item => item.start <= current).at(-1);
    // Update the live region only at a stage change, not on every playback tick.
    if (cue !== this.activeCue) {
      this.activeCue = cue;
      this.cue.hidden = !cue;
      this.cueDescription.textContent = cue?.label || '';
      this.measurementRows.forEach(row => row.classList.toggle('is-current',row.dataset.measurement === cue?.measurement));
    }
  }
  tick() {
    if (!this.playing || this.seeking) return;
    const current = this.leader.currentTime;
    if (this.videos.some((video, index) => current < this.panes[index].duration_seconds - frameDuration && video.readyState < 3)) {
      this.rebuffer();
      return;
    }
    const now = performance.now();
    this.videos.forEach((video,index) => {
      if (video === this.leader) return;
      const end = this.panes[index].duration_seconds - frameDuration;
      if (current >= end) {
        video.pause(); video.playbackRate = 1;
        if (Math.abs(video.currentTime - end) > .04 && !video.seeking) video.currentTime = end;
        return;
      }
      if (video.seeking || this.leader.seeking) return;
      const drift = video.currentTime - current;
      const rate = Math.abs(drift) > .06 ? Math.max(.96, Math.min(1.04, 1 - drift * .2)) : 1;
      if (video.playbackRate !== rate) video.playbackRate = rate;
      // Reserve hard seeks for a substantial drift, at most once per two
      // seconds. Small offsets recover smoothly without decoder resets.
      if (Math.abs(drift) > .35 && now - video.lastCorrection >= 2000) {
        video.lastCorrection = now;
        video.currentTime = current;
      }
    });
    this.update();
  }
}


const banana = new Player('banana-player');
const slicing = new Player('slicing-player');
const scoring = new Player('scoring-player');
const gravity = new Player('gravity-player');
const coupling = new Player('coupling-player');
const cake = new Player('cake-player');
const cressim = new Player('cressim-player');
let bananaId = '01-banana-two-cuts', scoringView = 'mesh', cakeView = 'mesh';

function showBanana() {
  banana.set([pane(bananaId,'particles','Simulated particles'),pane(bananaId,'mesh','Reconstructed surface'),pane(bananaId,'physical','Real robot')]);
}
function showSlicing() {
  slicing.set([
    pane('03-sequential-slicing','particles','Simulated particles'),
    pane('03-sequential-slicing','mesh','Reconstructed surface')
  ]);
}
function showScoring() {
  scoring.set([
    pane('04-tip-scoring',scoringView,'Shallow scoring'),
    pane('05-deep-cuts',scoringView,'Deeper incisions')
  ]);
}
function showCake() {
  cake.set([pane('06-cake-blademaster',cakeView,'BladeMaster'),pane('07-cake-single-field-mpm',cakeView,'Single-field MPM')]);
}
function bindSelection(attribute, callback) {
  const buttons = [...document.querySelectorAll(`[${attribute}]`)];
  buttons.forEach(button => {
    button.onclick = () => {
      if (button.classList.contains('active')) return;
      buttons.forEach(other => {
        const selected = other === button;
        other.classList.toggle('active',selected);
        other.setAttribute(other.getAttribute('role') === 'tab' ? 'aria-selected' : 'aria-pressed',String(selected));
        if (other.getAttribute('role') === 'tab') other.tabIndex = selected ? 0 : -1;
      });
      callback(button.getAttribute(attribute));
    };
    if (button.getAttribute('role') === 'tab') {
      button.onkeydown = event => {
        const vertical = button.parentElement.getAttribute('aria-orientation') === 'vertical' && innerWidth > 760;
        const before = vertical ? 'ArrowUp' : 'ArrowLeft';
        const after = vertical ? 'ArrowDown' : 'ArrowRight';
        if (![before,after,'Home','End'].includes(event.key)) return;
        event.preventDefault();
        let index = buttons.indexOf(button);
        index = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length-1 : (index + (event.key === after ? 1 : -1) + buttons.length) % buttons.length;
        buttons[index].focus(); buttons[index].click();
      };
    }
  });
}

bindSelection('data-banana', value => { bananaId = value; showBanana(); });
bindSelection('data-scoring-view', value => { scoringView = value; showScoring(); });
bindSelection('data-cake-view', value => { cakeView = value; showCake(); });
showBanana(); showSlicing(); showScoring(); showCake();
gravity.set([pane('08-gravity-driven-cutting','higher-sharpness','Higher sharpness'),pane('08-gravity-driven-cutting','lower-sharpness','Lower sharpness')]);
coupling.set([pane('09-two-way-coupling','normal-speed','Normal speed (1×)'),pane('09-two-way-coupling','slow-motion','Slow motion (0.2×)')]);
cressim.set([pane('10-cressim-mpm-comparison','blademaster','BladeMaster',true),pane('10-cressim-mpm-comparison','cressim-mpm','CRESSim-MPM')], [
  {start:0,label:'Two parallel cuts'},
  {start:2.0667,measurement:'gap',label:'First cut at half depth · 0.5 mm-thick blade'},
  {start:5.0667,label:'Completing the second cut'},
  {start:8.9667,measurement:'volume',label:'Middle-piece volume contraction after both cuts'},
  {start:11.9667,label:'Only the left piece receives an initial leftward velocity'}
]);
setInterval(() => players.forEach(player => player.tick()),100);
document.addEventListener('visibilitychange',() => { if (document.hidden) players.forEach(player => player.pause()); });

banana.el.setAttribute('role','tabpanel');
document.querySelectorAll('[data-banana]').forEach((button,index) => {
  button.id = `banana-tab-${index}`;
  button.setAttribute('aria-controls','banana-player');
  if (button.getAttribute('aria-selected') === 'true') banana.el.setAttribute('aria-labelledby',button.id);
  button.addEventListener('click',() => banana.el.setAttribute('aria-labelledby',button.id));
});

// Let the results move while they are in view; only one synchronized group
// runs at a time. An explicit pause remains respected until the user plays.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const visibility = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => visibility.set(entry.target,entry.intersectionRatio));
    if (document.hidden) return;
    const candidates = [...players].filter(player => (visibility.get(player.el) || 0) > .4);
    candidates.sort((a,b) => Math.abs(a.el.getBoundingClientRect().top + Math.min(a.el.clientHeight,innerHeight)/2-innerHeight/2) - Math.abs(b.el.getBoundingClientRect().top + Math.min(b.el.clientHeight,innerHeight)/2-innerHeight/2));
    const active = candidates[0];
    players.forEach(player => {
      if (player !== active && (player.playing || player.pending) && (visibility.get(player.el)||0) < .15) player.pause();
    });
    if (active && !active.userPaused && !active.playing && !active.pending) active.play();
  }, {threshold:[0,.15,.4,.6,.85,1]});
  players.forEach(player => observer.observe(player.el));
}
document.getElementById('copy-citation').addEventListener('click', async event => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(document.getElementById('bibtex').textContent);
    button.textContent = 'Copied';
    document.getElementById('copy-status').textContent = 'Citation copied to clipboard.';
    setTimeout(() => { button.innerHTML = 'Copy'; },2200);
  } catch {
    document.getElementById('copy-status').textContent = 'Select the citation text to copy it.';
    const range = document.createRange(); range.selectNodeContents(document.getElementById('bibtex'));
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
  }
});
