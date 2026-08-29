const toggle = document.getElementById('menu-toggle');
const transition = document.querySelector('.page-transition');
const chapterLinks = [...document.querySelectorAll('.menu-link[data-target]')];
const subLinks = [...document.querySelectorAll('.submenu-link[data-subtarget]')];

function syncMenu(){
  document.body.classList.toggle('menu-open', !!toggle?.checked);
}
function closeMenu(){
  if(toggle){
    toggle.checked = false;
    syncMenu();
  }
}
function wipe(){
  if(!transition) return;
  transition.classList.remove('play');
  void transition.offsetWidth;
  transition.classList.add('play');
  setTimeout(()=>transition.classList.remove('play'), 1100);
}

toggle?.addEventListener('change', syncMenu);
document.querySelector('.drawer-backdrop')?.addEventListener('click', closeMenu);
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeMenu();
});
[...chapterLinks, ...subLinks].forEach(a => {
  a.addEventListener('click', () => {
    closeMenu();
    wipe();
  });
});

/* Opening animation.
   Nothing is invisible by default; these classes merely replay a one-shot entrance. */
window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    document.querySelector('.site-header')?.classList.add('header-enter');
    document.querySelector('.opening-frame')?.classList.add('frame-enter');
    document.querySelector('.opening-content')?.classList.add('hero-enter');
    document.querySelector('.scroll-guide')?.classList.add('scroll-enter');
  });
});

if('IntersectionObserver' in window){
  /* Chapter heading */
  const chapterTitleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const chapter = entry.target;
      const number = chapter.querySelector('.chapter-number');
      const title = chapter.querySelector('.prose > h2');
      number?.classList.add('chapter-enter');
      title?.classList.add('chapter-enter');
      chapterTitleObserver.unobserve(chapter);
    });
  }, {threshold:.05, rootMargin:'0px 0px -12% 0px'});
  document.querySelectorAll('.chapter').forEach(el => chapterTitleObserver.observe(el));

  /* Small section headings */
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      entry.target.classList.add('section-enter');
      sectionObserver.unobserve(entry.target);
    });
  }, {threshold:.12, rootMargin:'0px 0px -10% 0px'});
  document.querySelectorAll('.story-section-title').forEach(el => sectionObserver.observe(el));

  /* Body paragraphs — animate in small batches, not every line forever. */
  const lineObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = [...el.parentElement.querySelectorAll('.story-line')];
      const idx = siblings.indexOf(el);
      el.style.animationDelay = `${Math.min((idx % 4) * 70, 210)}ms`;
      el.classList.add('line-enter');
      lineObserver.unobserve(el);
    });
  }, {threshold:.02, rootMargin:'0px 0px -5% 0px'});
  document.querySelectorAll('.story-line').forEach(el => lineObserver.observe(el));

  /* Chapter separator */
  const transObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      entry.target.classList.add('transition-enter');
      transObserver.unobserve(entry.target);
    });
  }, {threshold:.35});
  document.querySelectorAll('.chapter-transition').forEach(el => transObserver.observe(el));

  /* Active major chapter */
  const activeChapterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const id = entry.target.dataset.section;
      chapterLinks.forEach(a => a.classList.toggle('active', a.dataset.target === id));
    });
  }, {rootMargin:'-25% 0px -65% 0px'});
  document.querySelectorAll('.observe-section').forEach(el => activeChapterObserver.observe(el));

  /* Active subsection */
  const activeSubObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const id = entry.target.dataset.subsection;
      subLinks.forEach(a => a.classList.toggle('active', a.dataset.subtarget === id));
    });
  }, {rootMargin:'-18% 0px -72% 0px'});
  document.querySelectorAll('.observe-subsection').forEach(el => activeSubObserver.observe(el));
}
