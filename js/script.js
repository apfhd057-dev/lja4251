/* ===== FULLPAGE WHEEL SNAP CONTROLLER ===== */
(function(){
  const SECTION_SELECTOR = '#hero,#about,#works,#galleryshowcase,#projects,#box_project,#contact';
  const sections = Array.from(document.querySelectorAll(SECTION_SELECTOR));
  const works = document.querySelector('#works');
  const worksTrack = document.querySelector('#works .horizontal-track');
  const worksDots = Array.from(document.querySelectorAll('#works .dot'));
  const worksMax = Math.max(0, worksDots.length - 1);
  let worksIndex = 0;
  let lock = false;
  let touchStartY = 0;

  function setWorksPanel(i){
    worksIndex = Math.max(0, Math.min(worksMax, i));
    if(worksTrack) worksTrack.style.transform = `translateX(${-worksIndex * 100}vw)`;
    worksDots.forEach((dot, idx) => dot.classList.toggle('on', idx === worksIndex));
  }

  function nearestSectionIndex(){
    const y = window.scrollY;
    let idx = 0;
    let dist = Infinity;
    sections.forEach((sec, i) => {
      const d = Math.abs(sec.offsetTop - y);
      if(d < dist){ dist = d; idx = i; }
    });
    return idx;
  }

  function goToSection(i, instant=false){
    const index = Math.max(0, Math.min(sections.length - 1, i));
    const target = sections[index];
    if(!target) return;
    lock = true;
    window.scrollTo({ top: target.offsetTop, left: 0, behavior: instant ? 'auto' : 'smooth' });
    clearTimeout(window.__liaSnapLock);
    window.__liaSnapLock = setTimeout(() => { lock = false; }, instant ? 80 : 720);
  }

  function move(dir){
    const currentIndex = nearestSectionIndex();
    const current = sections[currentIndex];

    if(current === works && window.innerWidth > 900){
      if(dir > 0 && worksIndex < worksMax){
        setWorksPanel(worksIndex + 1);
        lock = true;
        setTimeout(() => { lock = false; }, 620);
        return;
      }
      if(dir < 0 && worksIndex > 0){
        setWorksPanel(worksIndex - 1);
        lock = true;
        setTimeout(() => { lock = false; }, 620);
        return;
      }
    }

    const nextIndex = currentIndex + dir;
    if(sections[nextIndex] === works){
      setWorksPanel(dir > 0 ? 0 : worksMax);
    }
    goToSection(nextIndex);
  }

  function canControl(){
    return window.innerWidth > 900 && !document.body.classList.contains('project-modal-open');
  }

  window.addEventListener('wheel', function(e){
    if(!canControl()) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if(lock || Math.abs(e.deltaY) < 8) return;
    move(e.deltaY > 0 ? 1 : -1);
  }, {passive:false, capture:true});

  window.addEventListener('touchstart', function(e){
    touchStartY = e.touches[0].clientY;
  }, {passive:true, capture:true});

  window.addEventListener('touchmove', function(e){
    if(!canControl()) return;
    const diff = touchStartY - e.touches[0].clientY;
    if(Math.abs(diff) < 45 || lock) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    move(diff > 0 ? 1 : -1);
  }, {passive:false, capture:true});

  window.addEventListener('resize', () => goToSection(nearestSectionIndex(), true));
  window.addEventListener('load', () => setTimeout(() => goToSection(nearestSectionIndex(), true), 120));
  worksDots.forEach((dot, i) => dot.addEventListener('click', () => setWorksPanel(i)));
  setWorksPanel(0);
})();

const cursor=document.querySelector('.cursor');if(cursor){document.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});document.querySelectorAll('a,.case-tag,.box,.p-card,.dot').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('big'));el.addEventListener('mouseleave',()=>cursor.classList.remove('big'))});}
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on')})},{threshold:.16});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const gallery=document.querySelector('.gallery-showcase');
const galleryRows=document.querySelectorAll('.gallery-row');
function moveGallery(){
  if(!gallery) return;
  const r=gallery.getBoundingClientRect();
  const progress=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight+r.height)));
  galleryRows.forEach((row,idx)=>{
    const dir=row.classList.contains('row-left')?-1:1;
    const base=idx%2===0?-180:180;
    const scrollMove=(progress-.5)*420*dir;
    row.style.setProperty('--move',`${base+scrollMove}px`);
  });
}
window.addEventListener('scroll',moveGallery,{passive:true});
window.addEventListener('resize',moveGallery);moveGallery();
if(gallery){gallery.addEventListener('mousemove',e=>{const x=(e.clientX/innerWidth-.5)*80;galleryRows.forEach((row,idx)=>{const dir=row.classList.contains('row-left')?-1:1;row.style.translate=`${x*dir}px 0`;});});gallery.addEventListener('mouseleave',()=>galleryRows.forEach(row=>row.style.translate='0 0'));}
document.querySelectorAll('.browser').forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;card.style.transform=`rotateY(${(x/r.width-.5)*-20}deg) rotateX(${(.5-y/r.height)*14}deg) translateY(-8px)`});card.addEventListener('mouseleave',()=>card.style.transform='rotateY(-13deg) rotateX(7deg)')});

(function(){
  const loader = document.getElementById('introLoader');
  const skip = document.getElementById('introSkip');

  function enterSite(){
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    if(loader) loader.classList.add('hide');
  }

  window.addEventListener('load', function(){
    setTimeout(enterSite, 3400);
  });

  if(skip){
    skip.addEventListener('click', enterSite);
  }
})();

/* PROJECTS: 기존 3D 링 구조 유지 + 자동 무한회전 + hover 정지 + 드래그/버튼/dot */
(function(){
  const section = document.querySelector('#projects.carousel-3d');
  const ring = document.getElementById('projectRing');
  if(!section || !ring) return;

  const cards = [...ring.querySelectorAll('.p-card')];
  const prev = section.querySelector('.project-prev');
  const next = section.querySelector('.project-next');
  const dots = [...section.querySelectorAll('.project-dot')];
  const total = cards.length;
  const step = 360 / total;

  let index = 0;
  let timer = null;
  let isPaused = false;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let startIndex = 0;
  let startAngle = 0;
  let downCard = null;

  function normalize(i){
    return ((i % total) + total) % total;
  }

  function render(i, instant=false){
    index = normalize(i);
    const angle = -index * step;
    ring.style.transition = instant ? 'none' : 'transform .9s cubic-bezier(.16,1,.3,1)';
    ring.style.setProperty('--ring-angle', angle + 'deg');
    dots.forEach((dot, idx) => dot.classList.toggle('on', idx === index));
  }

  function go(dir){
    render(index + dir);
    resetAuto();
  }

  function startAuto(){
    stopAuto();
    timer = setInterval(() => {
      if(!isPaused && !isDragging) render(index + 1);
    }, 2200);
  }

  function stopAuto(){
    if(timer){
      clearInterval(timer);
      timer = null;
    }
  }

  function resetAuto(){
    stopAuto();
    if(!isPaused && !isDragging) startAuto();
  }

  prev?.addEventListener('click', (e) => {
    e.preventDefault();
    go(-1);
  });

  next?.addEventListener('click', (e) => {
    e.preventDefault();
    go(1);
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      render(i);
      resetAuto();
    });
  });

  // 마우스를 카드/버튼/dot 위에 올렸을 때만 정지
  const pauseTargets = [ring, prev, next, ...dots].filter(Boolean);
  pauseTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      isPaused = true;
      stopAuto();
    });
    el.addEventListener('mouseleave', () => {
      isPaused = false;
      if(!isDragging) startAuto();
    });
  });

  section.addEventListener('pointerdown', (e) => {
    if(e.target.closest('button')) return;
    downCard = e.target.closest('.p-card');
    isDragging = true;
    isPaused = true;
    stopAuto();
    startX = e.clientX;
    currentX = e.clientX;
    startIndex = index;
    startAngle = -index * step;
    ring.style.transition = 'none';
    section.setPointerCapture?.(e.pointerId);
  });

  section.addEventListener('pointermove', (e) => {
    if(!isDragging) return;
    currentX = e.clientX;
    const diff = currentX - startX;
    ring.style.setProperty('--ring-angle', (startAngle + diff * 0.25) + 'deg');
  });

  function endDrag(e){
    if(!isDragging) return;
    isDragging = false;
    const diff = currentX - startX;
    const moved = Math.round(Math.abs(diff) / 90);

    if(Math.abs(diff) > 45){
      const dir = diff < 0 ? 1 : -1;
      render(startIndex + dir * Math.max(1, moved));
      downCard = null;
      isPaused = false;
      startAuto();
    }else{
      render(startIndex);
      if(downCard && Math.abs(diff) <= 8 && typeof window.openProjectModal === 'function'){
        const cardIndex = cards.indexOf(downCard);
        isPaused = true;
        stopAuto();
        setTimeout(() => window.openProjectModal(cardIndex), 0);
      }else{
        isPaused = false;
        startAuto();
      }
      downCard = null;
    }
    if(e?.pointerId) section.releasePointerCapture?.(e.pointerId);
  }

  section.addEventListener('pointerup', endDrag);
  section.addEventListener('pointercancel', endDrag);
  window.addEventListener('blur', stopAuto);
  window.addEventListener('focus', () => { if(!isPaused && !isDragging) startAuto(); });
  window.addEventListener('projectModalOpen', () => { isPaused = true; stopAuto(); });
  window.addEventListener('projectModalClose', () => { isPaused = false; if(!isDragging) startAuto(); });

  render(0, true);
  setTimeout(startAuto, 700);
})();

/* PROJECTS card popup: 카드 클릭 시 860px 중앙 팝업 + 내부 스크롤 */
(function(){
  const modal = document.getElementById('projectModal');
  const section = document.querySelector('#projects.carousel-3d');
  if(!modal || !section) return;

  const closeBtn = modal.querySelector('.project-modal-close');
  const kicker = document.getElementById('projectModalKicker');
  const title = document.getElementById('projectModalTitle');
  const visual = document.getElementById('projectModalVisual');
  const visualText = document.getElementById('projectModalVisualText');
  const desc = document.getElementById('projectModalDesc');
  const overview = document.getElementById('projectModalOverview');
  const role = document.getElementById('projectModalRole');
  const tags = document.getElementById('projectModalTags');

  const data = [
    {
      num:'PROJECT 01', title:'SONICAST', c1:'#111111', c2:'#bbbbbb',
      desc:'음향 기술 브랜드의 고급스러운 이미지를 살리기 위해 어두운 무드, 3D 오브제, 스크롤 인터랙션을 중심으로 구성한 인터랙티브 웹 프로젝트입니다.',
      overview:'히어로 영상, 기술 소개, 제품 영역, 브랜드 비전까지 하나의 흐름으로 연결해 사용자가 브랜드의 기술력과 감성을 동시에 느낄 수 있도록 설계했습니다.',
      role:'UX/UI Design · Web Publishing · Motion Direction',
      tags:['HTML','CSS','JavaScript','Interaction','Responsive']
    },
    {
      num:'PROJECT 02', title:'BIOLOGICS', c1:'#2f63ff', c2:'#9ee8ff',
      desc:'글로벌 바이오 기업의 신뢰감과 미래지향성을 표현한 기업형 웹사이트 리뉴얼 프로젝트입니다.',
      overview:'대형 비주얼, 수평 스크롤, 카운트업, ESG 카드 모션 등 기업 사이트에 필요한 정보 구조와 시각적 임팩트를 함께 정리했습니다.',
      role:'UX/UI Design · Publishing · Responsive Layout',
      tags:['Corporate','GSAP','Scroll','UI Design','Publishing']
    },
    {
      num:'PROJECT 03', title:'FOOD UI', c1:'#4e944f', c2:'#d3ffc5',
      desc:'식품/외식 브랜드의 따뜻하고 친근한 이미지를 강조한 브랜드 리뉴얼 UI 프로젝트입니다.',
      overview:'메뉴, 상세 정보, 브랜드 스토리 영역을 직관적으로 구성하고 컬러와 카드 레이아웃으로 부드러운 사용 경험을 만들었습니다.',
      role:'Brand UI · Mobile/Web Layout · Visual Design',
      tags:['Branding','UIUX','Card UI','Mobile','Design']
    },
    {
      num:'PROJECT 04', title:'EVENT', c1:'#ff90b8', c2:'#ffe2ec',
      desc:'프로모션 목적에 맞게 밝고 주목도 높은 톤으로 제작한 이벤트 페이지 디자인입니다.',
      overview:'이벤트 참여 흐름을 짧고 명확하게 정리하고, CTA와 혜택 정보가 자연스럽게 눈에 들어오도록 화면을 구성했습니다.',
      role:'Promotion Design · Landing Page · Publishing',
      tags:['Event','Landing','CTA','Banner','Responsive']
    },
    {
      num:'PROJECT 05', title:'BRAND UI', c1:'#222222', c2:'#b78aff',
      desc:'브랜드의 핵심 무드를 일관된 컴포넌트와 비주얼 시스템으로 정리한 디자인 시스템형 프로젝트입니다.',
      overview:'컬러, 타이포, 버튼, 카드, 섹션 구조를 정리해 여러 페이지에 확장 가능한 UI 규칙을 만들었습니다.',
      role:'Design System · Component UI · Style Guide',
      tags:['Design System','Component','Guide','Figma','UI']
    },
    {
      num:'PROJECT 06', title:'UIUX', c1:'#111111', c2:'#ffffff',
      desc:'사용자 흐름을 분석하고 정보 구조를 재정리한 UX 케이스 스터디 프로젝트입니다.',
      overview:'문제 정의, 사용자 여정, 와이어프레임, 프로토타입 과정을 통해 사용성이 개선되는 흐름을 보여주는 포트폴리오 섹션입니다.',
      role:'UX Research · Wireframe · Prototype · UI Design',
      tags:['UX','Research','Wireframe','Prototype','Case Study']
    }
  ];

  let downX = 0;
  let downY = 0;
  let didMove = false;

  section.querySelectorAll('.p-card').forEach((card, i) => {
    card.style.cursor = 'pointer';
    card.addEventListener('pointerdown', e => {
      downX = e.clientX;
      downY = e.clientY;
      didMove = false;
    });
    card.addEventListener('pointermove', e => {
      if(Math.abs(e.clientX - downX) > 8 || Math.abs(e.clientY - downY) > 8) didMove = true;
    });
    card.addEventListener('click', e => {
      if(didMove) return;
      e.preventDefault();
      e.stopPropagation();
      openModal(i);
    });
  });

  function openModal(i){
    const item = data[i] || data[0];
    kicker.textContent = item.num;
    title.textContent = item.title;
    visualText.textContent = item.title;
    desc.textContent = item.desc;
    overview.textContent = item.overview;
    role.textContent = item.role;
    visual.style.setProperty('--modal-c1', item.c1);
    visual.style.setProperty('--modal-c2', item.c2);
    tags.innerHTML = item.tags.map(tag => `<span>${tag}</span>`).join('');
    modal.classList.add('on');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('project-modal-open');
    window.dispatchEvent(new CustomEvent('projectModalOpen'));
  }

  window.openProjectModal = openModal;

  function closeModal(){
    modal.classList.remove('on');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('project-modal-open');
    window.dispatchEvent(new CustomEvent('projectModalClose'));
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if(e.target === modal) closeModal();
  });
  window.addEventListener('keydown', e => {
    if(e.key === 'Escape' && modal.classList.contains('on')) closeModal();
  });
})();

/* BOX PROJECT: 무한 슬라이드 + 드래그 + 클릭 팝업 */
(function(){
  const section = document.querySelector('#box_project');
  const marquee = section?.querySelector('.box-marquee');
  const track = section?.querySelector('.box-track');
  const modal = document.getElementById('boxModal');
  const title = document.getElementById('boxModalTitle');
  const desc = document.getElementById('boxModalDesc');
  const closeBtn = modal?.querySelector('.box-modal-close');

  if(!section || !marquee || !track || !modal || !title || !desc) return;
  if(track.dataset.boxReady === 'true') return;

  const data = {
    'Landing Page': '프로모션, 이벤트, 서비스 소개처럼 사용자의 행동을 유도하는 랜딩페이지 디자인 작업입니다.',
    'Banner': 'SNS, 광고, 이벤트 영역에 활용되는 배너 그래픽 디자인 작업입니다.',
    'Detail Page': '상품의 장점과 정보를 보기 쉽게 정리한 상세페이지 디자인 작업입니다.',
    'Brand UI': '브랜드 분위기에 맞춘 UI 컴포넌트와 화면 디자인 작업입니다.'
  };

  // 원본 카드만 먼저 저장한 뒤 1번만 복제
  const originalCards = Array.from(track.children);
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  let x = 0;
  let speed = 0.8;
  let isDown = false;
  let isHover = false;
  let startX = 0;
  let dragStartX = 0;
  let downCard = null;
  let moved = false;

  function getHalfWidth(){
    return track.scrollWidth / 2;
  }

  function normalizeX(){
    const half = getHalfWidth();
    if(!half) return;
    if(Math.abs(x) >= half) x = 0;
    if(x > 0) x = -half;
  }

  function render(){
    if(!isDown && !isHover){
      x -= speed;
      normalizeX();
    }

    track.style.transform = `translateX(${x}px)`;
    requestAnimationFrame(render);
  }

  function openBoxModal(card){
    const name = card.querySelector('h3')?.textContent.trim() || 'Design Work';

    title.textContent = name;
    desc.textContent = data[name] || '디자인 작업 상세 내용을 보여주는 팝업입니다.';

    modal.classList.add('on');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('project-modal-open');
  }

  function closeBoxModal(){
    modal.classList.remove('on');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('project-modal-open');
  }

  marquee.addEventListener('mouseenter', () => {
    isHover = true;
  });

  marquee.addEventListener('mouseleave', () => {
    isHover = false;
    isDown = false;
    downCard = null;
  });

  marquee.addEventListener('pointerdown', e => {
    const card = e.target.closest('.box');
    if(!card) return;

    isDown = true;
    moved = false;
    downCard = card;
    startX = e.clientX;
    dragStartX = x;
    marquee.setPointerCapture?.(e.pointerId);
  });

  marquee.addEventListener('pointermove', e => {
    if(!isDown) return;

    const diff = e.clientX - startX;
    if(Math.abs(diff) > 8) moved = true;

    x = dragStartX + diff;
    normalizeX();
  });

  marquee.addEventListener('pointerup', e => {
    if(!isDown) return;

    isDown = false;
    marquee.releasePointerCapture?.(e.pointerId);

    if(downCard && !moved){
      e.preventDefault();
      e.stopPropagation();
      openBoxModal(downCard);
    }

    downCard = null;
  });

  marquee.addEventListener('pointercancel', () => {
    isDown = false;
    downCard = null;
  });

  // 혹시 pointerup 클릭이 브라우저에서 누락될 때를 위한 예비 클릭
  track.addEventListener('click', e => {
    const card = e.target.closest('.box');
    if(!card || moved) return;

    e.preventDefault();
    e.stopPropagation();
    openBoxModal(card);
  });

  closeBtn?.addEventListener('click', closeBoxModal);

  modal.addEventListener('click', e => {
    if(e.target === modal) closeBoxModal();
  });

  window.addEventListener('keydown', e => {
    if(e.key === 'Escape' && modal.classList.contains('on')){
      closeBoxModal();
    }
  });

  track.dataset.boxReady = 'true';
  render();
})();

window.addEventListener("scroll",()=>{

});

const hero = document.querySelector('#hero');
const pngFloaters = document.querySelectorAll('#hero .float-png');

if(hero && pngFloaters.length){
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    pngFloaters.forEach((item, i) => {
      const depth = (i + 1) * 6;
      item.style.transform =
        `translate(${x * depth}px, ${y * depth * -1}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    pngFloaters.forEach((item) => {
      item.style.transform = '';
    });
  });
}

const heroDrops = document.querySelectorAll('#hero .float-wrap');

heroDrops.forEach((item) => {
  item.addEventListener('animationend', (e) => {
    if (e.animationName === 'heroDrop') {
      item.classList.add('is-float');
    }
  }, { once: true });
});

/* ===== EDITORIAL SCROLL DETAILS ===== */
(function(){
  const progress = document.querySelector('.scroll-progress i');
  const hero = document.getElementById('hero');
  const solid = document.querySelector('.hero-solid');
  const stroke = document.querySelector('.hero-stroke');

  function updateProgress(){
    if(!progress) return;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    progress.style.transform = `scaleX(${scrollY / max})`;
  }

  addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();

  if(hero && matchMedia('(hover:hover) and (pointer:fine)').matches){
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;

      if(solid) solid.style.transform = `translate3d(${x * 18}px, ${y * 7}px, 0)`;
      if(stroke) stroke.style.transform = `translate3d(${x * -24}px, ${y * -8}px, 0)`;
    });

    hero.addEventListener('mouseleave', () => {
      if(solid) solid.style.transform = 'translate3d(0,0,0)';
      if(stroke) stroke.style.transform = 'translate3d(0,0,0)';
    });
  }
})();




/* =========================================================
   SECTION EDGE INDEX
========================================================= */
(function () {
  const links = [...document.querySelectorAll('.edge-index a')];
  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    entries => {
      const active = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!active) return;

      links.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${active.target.id}`
        );
      });
    },
    {
      threshold: [0.18, 0.35, 0.6],
      rootMargin: '-15% 0px -58% 0px'
    }
  );

  sections.forEach(section => observer.observe(section));

  links.forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
})();

(() => {
  "use strict";

  const body = document.body;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let initialized = false;

  const addMotion = (element, type, delay = 0, manual = false) => {
    if (!element || element.classList.contains("fx-item")) return;

    element.classList.add("fx-item", `fx-${type}`);
    element.style.setProperty("--fx-delay", `${delay}ms`);

    if (manual) element.dataset.fxManual = "true";
  };

  const addMany = (selector, type, start = 0, step = 0, manual = false) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      addMotion(element, type, start + index * step, manual);
    });
  };

  const show = (element) => {
    if (element) element.classList.add("fx-in");
  };

  function initMotion() {
    if (initialized) return;
    initialized = true;

    /* HERO */
    addMotion(document.querySelector("#hero .hero-top-meta"), "up", 0);
    addMotion(document.querySelector("#hero h1"), "mask", 90);
    addMotion(document.querySelector("#hero .hero-bottom-meta"), "up", 220);
    addMotion(document.querySelector("#hero .hero-scroll"), "up", 340);

    /* ABOUT */
    addMotion(document.querySelector("#about .sub_title"), "left", 0);
    addMotion(document.querySelector("#about h2"), "mask", 70);
    addMotion(document.querySelector("#about > p"), "up", 150);
    addMany("#about .profile-grid > *", "pop", 190, 110);

    /* WORKS — 가로 슬라이드마다 현재 패널만 등장 */
    const casePanels = document.querySelectorAll("#works .case-panel");

    casePanels.forEach((panel) => {
      addMotion(panel.querySelector(".case-text"), "left", 0, true);
      addMotion(panel.querySelector(".case-text h2"), "mask", 70, true);
      panel.querySelectorAll(".case_list li").forEach((item, index) => {
        addMotion(item, "up", 150 + index * 75, true);
      });
      addMotion(panel.querySelector(".case-tag"), "up", 390, true);
      addMotion(panel.querySelector(".device-stage > img"), "right", 110, true);
    });

    /* GALLERY */
    addMotion(document.querySelector("#galleryshowcase .mini"), "left", 0);
    addMotion(document.querySelector("#galleryshowcase h2"), "mask", 70);
    addMotion(document.querySelector("#galleryshowcase .gallery-copy p"), "up", 150);
    addMotion(document.querySelector("#galleryshowcase .gallery-wrapper"), "stage", 190);

    /* DETAIL PAGES */
    addMotion(document.querySelector("#projects h2"), "mask", 0);
    addMotion(document.querySelector("#projects .project-guide"), "up", 110);
    addMotion(document.querySelector("#projects .stage3d"), "stage", 180);
    addMany("#projects .project-btn", "fade", 260, 90);

    /* OTHER DESIGN WORKS */
    addMotion(document.querySelector("#box_project .box-head span"), "left", 0);
    addMotion(document.querySelector("#box_project .box-head h2"), "mask", 70);
    addMotion(document.querySelector("#box_project .box-marquee"), "up", 170);

    /* CONTACT */
    addMotion(document.querySelector("#contact h2"), "mask", 0);
    addMotion(document.querySelector("#contact p"), "up", 170);

    body.classList.add("motion-ready");

    const allItems = Array.from(document.querySelectorAll(".fx-item"));

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      allItems.forEach(show);
      return;
    }

    /* 일반 세로 스크롤 등장 */
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        currentObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    });

    allItems
      .filter((item) => item.dataset.fxManual !== "true")
      .forEach((item) => observer.observe(item));

    /* 가로 WORKS 패널 전환 감지 */
    const panelObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.querySelectorAll('[data-fx-manual="true"]').forEach(show);
      });
    }, {
      threshold: 0.42,
      rootMargin: "0px -10% 0px -10%"
    });

    casePanels.forEach((panel) => panelObserver.observe(panel));
  }

  function waitForExistingLoader() {
    const pageIsReady = () =>
      body.classList.contains("loaded") ||
      !body.classList.contains("loading");

    if (pageIsReady()) {
      requestAnimationFrame(initMotion);
      return;
    }

    const classObserver = new MutationObserver(() => {
      if (!pageIsReady()) return;
      classObserver.disconnect();
      requestAnimationFrame(initMotion);
    });

    classObserver.observe(body, {
      attributes: true,
      attributeFilter: ["class"]
    });

    /* 기존 로더 코드에 문제가 생겨도 콘텐츠는 늦게라도 표시 */
    window.setTimeout(() => {
      classObserver.disconnect();
      initMotion();
    }, 3800);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForExistingLoader, { once: true });
  } else {
    waitForExistingLoader();
  }
})();

/* =========================================================
   MOBILE HAMBURGER NAVIGATION
========================================================= */
(function initMobileMenu() {
  const button = document.querySelector("#header .mobile-menu-btn");
  const menu = document.getElementById("mobileMenu");

  if (!button || !menu || menu.dataset.menuReady === "true") return;

  const links = Array.from(menu.querySelectorAll('a[href^="#"]'));
  let lastFocusedElement = null;

  function setMenuState(isOpen) {
    document.body.classList.toggle("mobile-menu-open", isOpen);
    button.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute(
      "aria-label",
      isOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"
    );
    menu.setAttribute("aria-hidden", String(!isOpen));

    if (isOpen) {
      lastFocusedElement = document.activeElement;
      window.setTimeout(() => links[0]?.focus(), 80);
    } else if (
      lastFocusedElement &&
      typeof lastFocusedElement.focus === "function"
    ) {
      lastFocusedElement.focus();
    }
  }

  function closeMenu() {
    setMenuState(false);
  }

  button.addEventListener("click", function () {
    const isOpen = !document.body.classList.contains("mobile-menu-open");
    setMenuState(isOpen);
  });

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const selector = this.getAttribute("href");
      const target = selector ? document.querySelector(selector) : null;

      if (!target) return;

      event.preventDefault();
      closeMenu();

      window.requestAnimationFrame(function () {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });
  });

  menu.addEventListener("click", function (event) {
    if (event.target === menu) closeMenu();
  });

  window.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      document.body.classList.contains("mobile-menu-open")
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (
      window.innerWidth > 900 &&
      document.body.classList.contains("mobile-menu-open")
    ) {
      closeMenu();
    }
  });

  menu.dataset.menuReady = "true";
})();

