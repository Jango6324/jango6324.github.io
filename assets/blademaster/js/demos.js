function bindSoulSwitch() {
  const button = document.getElementById('soul-switch');
  const labLabel = slicing.el.getAttribute('aria-label');
  const labPanes = slicing.panes;
  const soulPanes = [pane('03-sequential-slicing', 'soul', 'Soul Franka slicing thin pieces')];
  // Use the experiment's responsive grid to reserve its exact space, without loading duplicate media.
  const labGrid = slicing.el.querySelector('.panes');
  const guide = labGrid.cloneNode(false);
  guide.classList.add('soul-layout-guide');
  guide.setAttribute('aria-hidden', 'true');
  for (const labView of labGrid.children) {
    const view = labView.cloneNode(false);
    const video = labView.querySelector('video');
    const box = document.createElement('div');
    box.style.aspectRatio = video.width + ' / ' + video.height;
    view.append(labView.querySelector('.pane-label').cloneNode(true), box);
    guide.append(view);
  }
  // Matched from the knife strokes in the two 30 fps edits.
  const soulTime = labTime => Math.max(0, labTime * .99 - .4);
  const labTime = soulTime => (soulTime + .4) / .99;
  let switching;
  button.hidden = false;
  button.title = 'See this cut with Soul Franka';
  button.addEventListener('click', async () => {
    const toSoul = slicing.panes === labPanes;
    const pendingSwitch = switching?.request === slicing.request ? switching : null;
    const position = pendingSwitch?.labPosition ??
      (toSoul ? slicing.leader.currentTime : labTime(slicing.leader.currentTime));
    const resume = pendingSwitch?.resume ?? (slicing.playing || slicing.pending);
    const userPaused = pendingSwitch ? pendingSwitch.userPaused : slicing.userPaused;
    slicing.pause();
    slicing.set(toSoul ? soulPanes : labPanes);
    if (toSoul) {
      const stage = document.createElement('div');
      stage.className = 'soul-stage';
      const videoGrid = slicing.el.querySelector('.panes');
      videoGrid.replaceWith(stage);
      stage.append(guide, videoGrid);
    }
    slicing.userPaused = true;
    const request = slicing.request;
    switching = {request, labPosition:position, resume, userPaused};
    button.classList.toggle('showing-soul', toSoul);
    slicing.el.setAttribute('aria-label', toSoul ? 'Sequential slicing with Soul Franka' : labLabel);
    button.title = toSoul ? 'Return to the particle and surface views' : 'See this cut with Soul Franka';
    try {
      await slicing.seekTo(toSoul ? soulTime(position) : position);
      if (request !== slicing.request) return;
      slicing.update();
      slicing.userPaused = userPaused;
      if (resume) await slicing.play();
    } catch (error) {
      if (request === slicing.request) slicing.fail(error);
    } finally {
      if (switching?.request === request) switching = null;
    }
  });
}

bindSoulSwitch();

// Additional demonstrations start on demand, and pause when scrolled out of view.
for (const [elementId, scene] of [['mask-demo-player', '11-mask'], ['figure-demo-player', '12-midair']]) {
  const player = new Player(elementId);
  player.set([
    pane(scene, 'stylized', 'Stylized rendering'),
    pane(scene, 'lab', 'BladeMaster simulation')
  ]);
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting && (player.playing || player.pending)) player.pause();
  }).observe(player.el);
}
