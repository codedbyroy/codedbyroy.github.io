(() => {
  const data = window.PORTFOLIO;
  const $ = selector => document.querySelector(selector);
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char =>
    ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[char]);
  const tags = items => items.map(item => `<span class="tag">${escapeHTML(item)}</span>`).join('');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  function setPortrait(selector, source, container) {
    if (!source) return;
    const image = $(selector);
    image.addEventListener('load', () => {
      image.hidden = false;
      image.closest(container).classList.add('has-photo');
    }, {once: true});
    image.src = source;
  }
  const portraits = data.portraits ?? {};
  setPortrait('.hero-photo', portraits.hero, '.portrait-frame');
  setPortrait('.biography-photo', portraits.biography || portraits.hero, '.portrait-reverse');

  if (data.resume) {
    const resume = $('.resume-link');
    resume.href = data.resume;
    resume.hidden = false;
  }

  $('.code-texture').textContent = JSON.stringify({
    name: 'Ankush Roy',
    location: 'Bengaluru, India',
    stack: data.skills.map(group => group.items),
    projects: data.projects.map(({title, description, tech}) => ({title, description, tech}))
  }, null, 2);

  function letters(text, interval, hero = false) {
    return Array.from(text, (char, index) => {
      if (char === ' ') return ' ';
      const angle = hero ? `--ink-angle:${[4, -3, 2, -4, 3][index % 5]}deg` : '';
      const glyph = `<span aria-hidden="true" class="${hero ? 'hero-letter' : 'nav-menu-letter'}" style="--delay:${index * interval}ms;${angle}">${escapeHTML(char)}</span>`;
      return hero ? `<span class="hero-letter-window" style="--delay:${index * interval}ms">${glyph}</span>` : glyph;
    }).join('');
  }

  function createInkCrew(className) {
    const crew = document.createElement('span');
    crew.className = `hero-ink-crew ${className}`;
    crew.innerHTML = '<span class="hero-ink-eyes"><i></i><i></i></span>';
    crew.setAttribute('aria-hidden', 'true');
    return crew;
  }

  function addInkStickers(word, crewClass) {
    word.append(createInkCrew(crewClass));
    for (const [name, symbol] of [['spark', '✦'], ['bolt', 'ϟ'], ['loop', '']]) {
      const sticker = document.createElement('span');
      sticker.className = `ink-sticker ink-sticker-${name}`;
      sticker.textContent = symbol;
      sticker.setAttribute('aria-hidden', 'true');
      word.append(sticker);
    }
  }

  const title = $('#hero-title');
  const heroWords = [...title.querySelectorAll('.hero-word')];
  title.setAttribute('aria-label', heroWords.map(word => word.textContent).join(' '));
  heroWords.forEach((word, index) => {
    const text = word.textContent;
    word.setAttribute('aria-hidden', 'true');
    word.innerHTML = letters(text, 31, true);
    word.style.setProperty('--row-delay', index ? '110ms' : '0ms');
    for (let bunny = 1; bunny <= 4; bunny++) {
      word.append(createInkCrew(`hero-bunny hero-bunny-${bunny}`));
    }
  });

  const heroTitleVisibility = new IntersectionObserver(([entry]) => {
    title.classList.toggle('hero-title-visible', entry.isIntersecting && entry.intersectionRatio >= .2);
  }, {threshold: .2});
  heroTitleVisibility.observe(title);

  const introHeading = $('#about h2');
  const introVisibility = new IntersectionObserver(([entry]) => {
    $('#about').classList.toggle('intro-ink-visible', entry.isIntersecting);
  }, {threshold: .18});
  introVisibility.observe(introHeading);

  function trackInkGaze(heading) {
    const inkCrew = [...heading.querySelectorAll('.hero-ink-crew')];
    heading.addEventListener('pointermove', event => {
      if (reduced.matches || event.pointerType === 'touch') return;
      inkCrew.forEach(member => {
        const rect = member.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        const limit = Math.max(36, Math.hypot(x, y));
        member.style.setProperty('--gaze-x', `${x / limit * 2}px`);
        member.style.setProperty('--gaze-y', `${y / limit * 1.5}px`);
      });
    });
    heading.addEventListener('pointerleave', () => inkCrew.forEach(member => {
      member.style.removeProperty('--gaze-x');
      member.style.removeProperty('--gaze-y');
    }));
  }
  trackInkGaze(title);

  const sectionHeadingVisibility = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('section-ink-visible', entry.isIntersecting && entry.intersectionRatio >= .2);
    });
  }, {threshold: .2});

  document.querySelectorAll('main > section h2, #footer h2').forEach(heading => {
    heading.classList.add('section-ink-heading');
    heading.setAttribute('aria-label', heading.innerText.replace(/\s+/g, ' ').trim());
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    let offset = 0;
    let finalWord;

    for (const node of textNodes) {
      if (node.parentElement.closest('.period')) continue;
      const fragment = document.createDocumentFragment();
      for (const part of node.textContent.split(/(\s+)/)) {
        if (!part || /^\s+$/.test(part)) {
          fragment.append(part);
          continue;
        }
        const word = document.createElement('span');
        word.className = 'section-ink-word';
        word.style.setProperty('--word-delay', `${offset * 25}ms`);
        word.innerHTML = letters(part, 25, true);
        fragment.append(word);
        finalWord = word;
        offset += Array.from(part).length;
      }
      node.replaceWith(fragment);
    }

    if (finalWord) addInkStickers(finalWord, 'section-ink-crew');
    sectionHeadingVisibility.observe(heading);
    trackInkGaze(heading);
  });

  const titleWrap = title.parentElement;
  function fitHeroTitle() {
    title.style.removeProperty('--hero-fit');
    const center = titleWrap.getBoundingClientRect();
    const lines = [...title.querySelectorAll('.hero-line')];
    const lineWidths = lines.map(line => {
      const word = line.querySelector('.hero-word').getBoundingClientRect();
      const bracket = line.querySelector('.hero-bracket').getBoundingClientRect();
      return Math.max(word.width, 2 * Math.max(center.left + center.width / 2 - bracket.left,
        bracket.right - center.left - center.width / 2));
    });
    const ratio = Math.min(1, (center.width - 4) / Math.max(...lineWidths));
    title.style.setProperty('--hero-fit', `${parseFloat(getComputedStyle(title).fontSize) * ratio}px`);
  }
  new ResizeObserver(fitHeroTitle).observe(titleWrap);
  addEventListener('resize', fitHeroTitle);
  document.fonts.ready.then(fitHeroTitle);
  fitHeroTitle();

  function addLinkRolls(container) {
    container.querySelectorAll(
      'a:not(.wave-target, .portrait, .certificate-pdf, :has(> img)), .portrait-caption, .folder-action, .panel-close, .case-project-link, .primary-button'
    ).forEach(label => {
      const viewport = document.createElement('span');
      const track = document.createElement('span');
      viewport.className = 'link-roll-window';
      track.className = 'link-roll-track';
      track.append(...label.childNodes);
      viewport.append(track);
      label.append(viewport);
    });
  }

  $('#skills-grid').innerHTML = data.skills.map(group => `
    <section class="skill-group">
      <h3>${escapeHTML(group.title)}</h3>
      <div class="tags">${tags(group.items)}</div>
    </section>`).join('');

  const certificateViewport = $('#certificate-rail');
  const certificateTrack = $('#certificate-track');
  const certificateBack = $('#certificate-back');
  const certificateNext = $('#certificate-next');
  const certificates = data.certificates.flatMap(group =>
    group.items.map(item => ({...item, category: group.title})));
  certificateTrack.innerHTML = certificates.map((certificate, index) => {
    const title = escapeHTML(certificate.title);
    const preview = certificate.file.replace('/certificates/', '/certificates/previews/').replace(/\.pdf$/, '.webp');
    return `
      <li class="certificate-lanyard" style="--drop: ${[0, 14, 7, 18][index % 4]}px">
        <div class="certificate-hanger">
          <span class="certificate-strap" aria-hidden="true"><i></i></span>
          <div class="certificate-badge">
            <button class="certificate-flip" type="button" aria-label="Flip ${title} badge" aria-pressed="false">
              <span class="certificate-face certificate-front" aria-hidden="true">
                <img src="${escapeHTML(preview)}" alt="" loading="lazy" decoding="async" draggable="false">
                <span class="certificate-title">${title}</span>
                <span class="certificate-meta">${escapeHTML(certificate.date)}</span>
              </span>
              <span class="certificate-face certificate-reverse" aria-hidden="true">
                <span class="certificate-meta">${escapeHTML(certificate.category)}</span>
                <span class="certificate-title">${title}</span>
                <span class="certificate-meta">Infosys Springboard</span>
              </span>
            </button>
            <a class="certificate-pdf text-link" href="${escapeHTML(certificate.file)}" target="_blank" rel="noopener"
              aria-label="Open ${title} certificate PDF" hidden>Open PDF</a>
          </div>
        </div>
      </li>`;
  }).join('');

  let openCertificate;
  let certificatePull;
  const badgeButtons = [...certificateTrack.querySelectorAll('.certificate-flip')];
  function setBadgeFlipped(button, flipped) {
    button.setAttribute('aria-pressed', String(flipped));
    button.closest('.certificate-badge').querySelector('.certificate-pdf').hidden = !flipped;
    openCertificate = flipped ? button : undefined;
  }

  badgeButtons.forEach(button => {
    button.addEventListener('click', event => {
      if (certificatePull?.button === button && certificatePull.moved && event.detail) {
        certificatePull = undefined;
        return;
      }
      const wasOpen = openCertificate === button;
      if (openCertificate) setBadgeFlipped(openCertificate, false);
      if (!wasOpen) setBadgeFlipped(button, true);
    });
    button.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch' || event.button !== 0 || reduced.matches) {
        certificatePull = undefined;
        return;
      }
      certificatePull = {button, id: event.pointerId, y: event.clientY, moved: false};
    });
    button.addEventListener('pointermove', event => {
      if (certificatePull?.id !== event.pointerId || certificatePull.button !== button || !event.buttons) return;
      const distance = event.clientY - certificatePull.y;
      if (!certificatePull.moved && distance < 8) return;
      if (!certificatePull.moved) {
        button.setPointerCapture(event.pointerId);
        certificatePull.moved = true;
      }
      const hanger = button.closest('.certificate-hanger');
      hanger.classList.add('is-pulling');
      hanger.style.setProperty('--pull', `${Math.max(0, Math.min(34, distance * .65))}px`);
    });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      button.addEventListener(type, () => {
        if (certificatePull?.button !== button) return;
        const hanger = button.closest('.certificate-hanger');
        hanger.classList.remove('is-pulling');
        hanger.style.removeProperty('--pull');
        if (type === 'pointercancel') certificatePull = undefined;
      });
    }
  });

  certificateViewport.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !openCertificate) return;
    const button = openCertificate;
    setBadgeFlipped(button, false);
    button.focus({preventScroll: true});
  });
  function updateCertificateControls() {
    const remaining = certificateViewport.scrollWidth - certificateViewport.clientWidth - certificateViewport.scrollLeft;
    certificateBack.disabled = certificateViewport.scrollLeft < 2;
    certificateNext.disabled = remaining < 2;
  }
  function moveCertificates(direction) {
    const item = certificateTrack.firstElementChild;
    const gap = parseFloat(getComputedStyle(certificateTrack).columnGap);
    certificateViewport.scrollBy({left: direction * (item.offsetWidth + gap), behavior: reduced.matches ? 'instant' : 'smooth'});
  }
  certificateBack.addEventListener('click', () => moveCertificates(-1));
  certificateNext.addEventListener('click', () => moveCertificates(1));
  certificateViewport.addEventListener('scroll', updateCertificateControls, {passive: true});
  new ResizeObserver(updateCertificateControls).observe(certificateViewport);

  const grid = $('#project-grid');
  const panel = $('#project-panel');
  const projectCover = project => project.screenshots?.[0] ?? project.preview;
  grid.innerHTML = data.projects.map(project => `
    <button class="folder${project.featured ? ' featured' : ''}" type="button" data-project="${escapeHTML(project.id)}"
      aria-label="View ${escapeHTML(project.title)} project" aria-expanded="false" aria-controls="project-panel">
      <span class="folder-art" aria-hidden="true">
        <span class="sheet"></span><span class="sheet"></span>
        <span class="sheet"><span class="sheet-label">${escapeHTML(project.category)}</span>
          ${projectCover(project) ? `<img class="folder-preview" src="${escapeHTML(projectCover(project).src)}" alt="" loading="lazy">` : '<span class="sheet-lines"></span>'}
        </span>
        <span class="folder-front"><span>${escapeHTML(project.title)}</span><span class="folder-icon">+</span></span>
      </span>
      <span class="folder-meta">${escapeHTML(project.category)}</span>
      <span class="project-status">${escapeHTML(project.status)}</span>
      <span class="folder-short">${escapeHTML(project.short)}</span>
      <span class="folder-action">View project</span>
    </button>`).join('');

  let current = null;
  function closePanel() {
    panel.hidden = true;
    current?.setAttribute('aria-expanded', 'false');
    current?.focus();
    current = null;
  }
  function openProject(button) {
    if (button === current) return closePanel();
    const project = data.projects.find(item => item.id === button.dataset.project);
    const workflow = project.flow?.length ? `<div class="panel-visual" role="group" aria-label="Project workflow">
      ${project.flow.map(step => `<div class="flow-step">${escapeHTML(step)}</div>`).join('')}
    </div>` : '';
    const {width = 1280, height = 2856} = project.screenshotSize ?? {};
    const gallery = project.screenshots?.length ? `
      <div class="case-gallery" aria-label="App screenshots">
        ${project.screenshots.map(shot => `
          <figure class="case-preview">
            <a href="${escapeHTML(shot.src)}" target="_blank" rel="noopener noreferrer"
               aria-label="Open full-size ${escapeHTML(shot.caption)} screenshot">
              <img src="${escapeHTML(shot.src)}" alt="${escapeHTML(shot.alt)}" width="${width}" height="${height}" loading="lazy">
            </a>
            <figcaption>${escapeHTML(shot.caption)}</figcaption>
          </figure>`).join('')}
      </div>` : '';
    const preview = gallery + (project.preview ? `<figure class="case-preview">
      <img src="${escapeHTML(project.preview.src)}" alt="${escapeHTML(project.preview.alt)}">
      <figcaption>${escapeHTML(project.preview.caption)}</figcaption>
    </figure>` : '');
    const roles = project.agentRoles?.length ? `<section class="case-roles">
      <h4>Engineering Room agents</h4>
      <dl>${project.agentRoles.map(agent => `<div>
        <dt><strong>${escapeHTML(agent.name)}</strong><span>${escapeHTML(agent.role)}</span></dt>
        <dd>${escapeHTML(agent.detail)}</dd>
      </div>`).join('')}</dl>
    </section>` : '';
    const example = project.example ? `<section class="case-example">
      <h4>${escapeHTML(project.example.title)}</h4>
      <p>${escapeHTML(project.example.detail)}</p>
      <button class="case-project-link" type="button" data-related-project="${escapeHTML(project.example.projectId)}">${escapeHTML(project.example.linkLabel)}</button>
    </section>` : '';
    const pipelines = project.pipelines?.length ? `<section class="case-pipelines">
      <h4>Other agent workflows</h4>
      <ul>${project.pipelines.map(pipeline => `<li>
        <strong>${escapeHTML(pipeline.title)}</strong><span>${escapeHTML(pipeline.detail)}</span>
      </li>`).join('')}</ul>
    </section>` : '';
    const media = preview + workflow + roles;
    current?.setAttribute('aria-expanded', 'false');
    current = button;
    button.setAttribute('aria-expanded', 'true');
    panel.innerHTML = `
      <div class="panel-top"><span>PROJECT DETAILS / ${escapeHTML(project.category)}</span>
        <button class="panel-close" type="button">Close</button></div>
      <div class="panel-content${media ? '' : ' no-workflow'}">
        ${media ? `<div class="panel-media">${media}</div>` : ''}
        <div>
          <h3>${escapeHTML(project.title)}</h3><div class="project-status">${escapeHTML(project.status)}</div><p>${escapeHTML(project.description)}</p>
          ${project.detail ? `<h4>How it works</h4><p>${escapeHTML(project.detail)}</p>` : ''}
          ${example}${pipelines}
          <div class="tags">${tags(project.tech)}</div>
          <div class="panel-links">
            ${project.github ? `<a href="${escapeHTML(project.github)}" target="_blank" rel="noopener noreferrer">View source</a>` : ''}
            ${project.demo ? `<a href="${escapeHTML(project.demo)}" target="_blank" rel="noopener noreferrer">Live demo</a>` : ''}
          </div>
        </div>
      </div>`;
    addLinkRolls(panel);
    panel.hidden = false;
    const close = panel.querySelector('button');
    close.addEventListener('click', closePanel);
    close.focus({preventScroll: true});
    panel.scrollIntoView({behavior: reduced.matches ? 'instant' : 'smooth', block: 'start'});
  }
  grid.addEventListener('click', event => {
    const button = event.target.closest('.folder');
    if (button) openProject(button);
  });
  panel.addEventListener('click', event => {
    const link = event.target.closest('[data-related-project]');
    if (!link) return;
    const button = grid.querySelector(`[data-project="${CSS.escape(link.dataset.relatedProject)}"]`);
    if (button) openProject(button);
  });

  const reveals = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!reduced.matches) entry.target.classList.add('entered');
      observer.unobserve(entry.target);
    }
  }, {threshold: .12});
  document.querySelectorAll('.skill-group, .folder, .contact-grid')
    .forEach(element => reveals.observe(element));

  const timeline = $('#timeline');
  const timelineTrack = $('.timeline-track');
  const timelineWave = $('.timeline-wave');
  const timelineBack = $('#timeline-back');
  const timelineNext = $('#timeline-next');
  $('.timeline-stages').innerHTML = data.timeline.map(item => `
    <li class="journey-stage${item.future ? ' journey-future' : ''}">
      <div class="journey-meta">${escapeHTML(item.label)}<span>${escapeHTML(item.period)}</span></div>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.details)}</p>
      ${item.future ? '<a class="text-link" href="#contact">Get in touch</a>' : ''}
    </li>`).join('');
  const journeyStages = [...timeline.querySelectorAll('.journey-stage')];
  function updateTimelineControls() {
    const distance = Math.abs(timeline.scrollLeft);
    timelineBack.disabled = distance < 2;
    timelineNext.disabled = distance >= timeline.scrollWidth - timeline.clientWidth - 2;
  }
  function moveTimeline(direction) {
    const gap = parseFloat(getComputedStyle($('.timeline-stages')).columnGap);
    timeline.scrollBy({left: direction * (journeyStages[0].offsetWidth + gap), behavior: reduced.matches ? 'instant' : 'smooth'});
  }
  timelineBack.addEventListener('click', () => moveTimeline(1));
  timelineNext.addEventListener('click', () => moveTimeline(-1));
  timeline.addEventListener('scroll', updateTimelineControls, {passive: true});

  let waveProgress = reduced.matches ? 1 : 0;
  function drawTimelineWave(progress = waveProgress) {
    const width = timelineTrack.clientWidth;
    const height = timelineWave.clientHeight;
    if (!width || !height) return;
    const scale = devicePixelRatio || 1;
    const scaledWidth = Math.round(width * scale);
    const scaledHeight = Math.round(height * scale);
    if (timelineWave.width !== scaledWidth) timelineWave.width = scaledWidth;
    if (timelineWave.height !== scaledHeight) timelineWave.height = scaledHeight;
    const context = timelineWave.getContext('2d');
    if (!context) return;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.clearRect(0, 0, width, height);
    const track = timelineTrack.getBoundingClientRect();
    const centers = journeyStages.map(stage => {
      const rect = stage.getBoundingClientRect();
      return rect.left + rect.width / 2 - track.left;
    });
    const mid = height / 2;
    const amplitude = height * .36;
    const spacing = centers[0] - centers[1];
    const waveY = x => mid + amplitude * Math.sin((centers[0] - x) / spacing * Math.PI);
    const end = width * (1 - progress);
    context.strokeStyle = getComputedStyle(timeline).color;
    context.lineWidth = 1.6;
    context.beginPath();
    context.moveTo(width, waveY(width));
    for (let x = width - 2; x > end; x -= 2) context.lineTo(x, waveY(x));
    context.lineTo(end, waveY(end));
    context.stroke();

    context.fillStyle = context.strokeStyle;
    for (const x of centers) {
      if (x < end) continue;
      context.beginPath();
      context.arc(x, mid, 3.5, 0, Math.PI * 2);
      context.fill();
    }
    if (progress < 1) {
      context.beginPath();
      context.arc(end, waveY(end), 5, 0, Math.PI * 2);
      context.fill();
    }
  }

  new ResizeObserver(() => {
    drawTimelineWave();
    updateTimelineControls();
  }).observe(timeline);
  let timelineVisible = false;
  let waveFrame = 0;

  function resetTimelineWave() {
    cancelAnimationFrame(waveFrame);
    waveFrame = 0;
    waveProgress = reduced.matches ? 1 : 0;
    drawTimelineWave();

    if (!timelineVisible || document.hidden || reduced.matches) return;

    const start = performance.now();
    function animateWave(now) {
      waveProgress = Math.min(1, (now - start) / 3800);
      drawTimelineWave();
      waveFrame = waveProgress < 1 ? requestAnimationFrame(animateWave) : 0;
    }
    waveFrame = requestAnimationFrame(animateWave);
  }

  const timelineObserver = new IntersectionObserver(([entry]) => {
    const visible = entry.isIntersecting && entry.intersectionRatio >= .25;
    if (visible === timelineVisible) return;
    timelineVisible = visible;
    resetTimelineWave();
  }, {threshold: .25});
  timelineObserver.observe(timeline);
  reduced.addEventListener('change', resetTimelineWave);
  document.addEventListener('visibilitychange', resetTimelineWave);

  const menu = $('#nav-menu');
  const menuButton = $('.menu-btn');
  menu.querySelectorAll('a').forEach(link => {
    link.setAttribute('aria-label', link.textContent);
    link.innerHTML = letters(link.textContent, 24);
  });
  addLinkRolls(document);
  menuButton.addEventListener('click', () => {
    menu.showModal();
    menuButton.setAttribute('aria-expanded', 'true');
  });
  menu.addEventListener('close', () => menuButton.setAttribute('aria-expanded', 'false'));
  menu.addEventListener('click', event => {
    if (event.target === menu || event.target.closest('a')) menu.close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.open && current) closePanel();
  });

  const theme = $('.theme-btn');
  function setTheme(value) {
    document.documentElement.dataset.theme = value;
    theme.setAttribute('aria-label', value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    try { localStorage.setItem('ankush-theme', value); } catch {}
  }
  setTheme(document.documentElement.dataset.theme);
  theme.addEventListener('click', () => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    drawTimelineWave();
  });

  const progress = $('.reading-progress');
  const portrait = $('.portrait');
  const portraitOrigin = $('.portrait-origin');
  const portraitDock = $('.portrait-dock');
  const navNameFlip = $('.nav-name-flip');
  const pageSections = [...document.querySelectorAll('main > section[id], #footer')];
  let activeSection;
  let nameAnimation;

  function updateSectionName() {
    const marker = innerHeight * .38;
    const nextSection = pageSections.findLastIndex(section => section.getBoundingClientRect().top <= marker);
    const previousSection = activeSection;
    activeSection = Math.max(0, nextSection);
    if (previousSection === undefined || activeSection === previousSection || reduced.matches) return;

    const turn = activeSection > previousSection ? 360 : -360;
    nameAnimation?.cancel();
    nameAnimation = navNameFlip.animate(
      [{transform: 'rotate(0deg)'}, {transform: `rotate(${turn}deg)`}],
      {duration: 760, easing: 'cubic-bezier(.45, 0, .28, 1)'}
    );
  }

  reduced.addEventListener('change', () => {
    if (reduced.matches) nameAnimation?.cancel();
  });
  let scrollFrame = 0;
  function updateScroll() {
    const total = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${total > 0 ? scrollY / total : 0})`;
    if (!reduced.matches) {
      const origin = portraitOrigin.getBoundingClientRect();
      const dock = portraitDock.getBoundingClientRect();
      const dockY = dock.top + scrollY;
      const finish = Math.max(2, dockY - innerHeight * .58);
      const start = Math.max(0, finish - innerHeight * .65);
      const fraction = Math.min(1, Math.max(0, (scrollY - start) / (finish - start)));
      const travel = fraction * fraction * fraction * (10 + fraction * (-15 + 6 * fraction));
      portrait.style.setProperty('--portrait-x', `${(dock.left - origin.left) * travel}px`);
      portrait.style.setProperty('--portrait-y', `${(dock.top - origin.top) * travel}px`);
      portrait.style.setProperty('--portrait-turn', `${travel * 180}deg`);
      portrait.style.setProperty('--portrait-caption-opacity', String(1 - travel));
    }
    updateSectionName();
    scrollFrame = 0;
  }
  function queueScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }
  addEventListener('scroll', queueScroll, {passive: true});
  addEventListener('resize', queueScroll);
  reduced.addEventListener('change', queueScroll);
  const portraitLayout = new ResizeObserver(queueScroll);
  portraitLayout.observe(portraitOrigin);
  portraitLayout.observe(portraitDock);
  portraitLayout.observe($('#about'));
  document.fonts.ready.then(queueScroll);
  updateScroll();

  const email = $('.email-link').textContent;
  $('.copy-email').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      $('.copy-status').textContent = 'Email copied.';
    } catch {
      $('.copy-status').textContent = 'Select the email address to copy it.';
    }
  });
  document.querySelectorAll('.year').forEach(element => element.textContent = new Date().getFullYear());
  $('#contact-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.get('name')}`);
    const body = encodeURIComponent(`${form.get('message')}\n\nFrom: ${form.get('name')}\nEmail: ${form.get('email')}`);
    location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  });

})();
