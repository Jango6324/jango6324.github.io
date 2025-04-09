---
permalink: /
title: "About Me"
page_title: "Zhanyu Yang's Homepage"
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<!-- This is an empty line after the front matter -->
Welcome to my homepage! My name is Zhanyu Yang, and I am a third-year PhD student in the Department of Computer Science at Purdue University. I am fortunate to be advised by [Prof. Bedrich Benes](https://www.cs.purdue.edu/homes/bbenes/). My research interests lie in the field of computer graphics, with a particular focus on physical simulation and procedural modeling.

Before joining Purdue, I completed my undergraduate studies at the University of Science and Technology of China (USTC), where I earned a Bachelor of Science degree in Applied & Computational Mathematics. During my time at USTC, I was honored with the Outstanding Undergraduate Student Award and Outstanding Undergraduate Thesis Award. 

## Publications

{% assign publications = site.publications | sort: "date" | reverse %}
{% for post in publications %}
<div style="display: flex; margin-bottom: 30px;">
  <div style="flex: 3; padding-right: 20px;">
    <h3><strong>{{ post.title }}</strong></h3>
    <p>{{ post.excerpt }}</p>
    {% if post.citation %}<p>{{ post.citation }}</p>{% endif %}
    <p>
      {% if post.paperurl %}<a href="{{ post.paperurl }}">Paper</a>{% endif %}
      {% if post.videourl %}{% if post.videourl %} | {% endif %}<a href="{{ post.videourl }}">Video</a>{% endif %}
      {% if post.bibtexurl %}{% if post.paperurl or post.slideurl %} | {% endif %}<a href="{{ post.bibtexurl }}">Bibtex</a>{% endif %}
    </p>
  </div>
  <div style="flex: 2; text-align: center; align-self: center;">
    {% if post.image %}
    <img src="{{ post.image }}" alt="{{ post.title }}" style="max-width: 100%;">
    {% else %}
    <img src="/images/500x300.png" alt="Placeholder" style="max-width: 100%;">
    {% endif %}
  </div>
</div>
<hr>
{% endfor %}

Misc
------
I like sports, especially volleyball and tennis. I was a core member of the USTC volleyball team and participated in multiple Anhui Provincial College Tournaments. In Purdue, I won the champion of Purdue's Indoor Volleyball League for Grad/Fac/Staff.


I also enjoy playing video games. I am a big fan of action games and RPGs such as Monster Hunter and Souls-like games.

<div style="display: flex; justify-content: space-between; margin: 20px 0;">
  <div style="flex: 1; margin-right: 10px; text-align: center;">
    <img src="/images/volleyball.png" alt="Description of image 1" style="max-width: 100%;">

  </div>
  <div style="flex: 1; margin-left: 10px; text-align: center;">
    <img src="/images/daimao.jpg" alt="Description of image 2" style="max-width: 100%;">
    <p><em>Courtesy of Swine, Baidu Tieba</em></p>
  </div>
</div>