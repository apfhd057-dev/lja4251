/* ===== FULLPAGE WHEEL SNAP CONTROLLER ===== */
(function(){
  const SECTION_SELECTOR = '#hero,#about,#works,#galleryshowcase,#projects,#box_project,#contact';
  const sections = Array.from(document.querySelectorAll(SECTION_SELECTOR));
  const works = document.querySelector('#works');
  const worksTrack = document.querySelector('#works .horizontal-track');
  const worksDots = Array.from(document.querySelectorAll('#works .dot'));
  const worksPrev = document.querySelector('#works .works-prev');
  const worksNext = document.querySelector('#works .works-next');
  const worksMax = Math.max(0, worksDots.length - 1);
  let worksIndex = 0;
  let lock = false;
  let touchStartY = 0;

  function setWorksPanel(i){
    worksIndex = Math.max(0, Math.min(worksMax, i));

    if(worksTrack){
      worksTrack.style.transform = `translateX(${-worksIndex * 100}vw)`;
    }

    worksDots.forEach((dot, idx) => {
      const isActive = idx === worksIndex;
      dot.classList.toggle('on', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });

    if(worksPrev) worksPrev.disabled = worksIndex === 0;
    if(worksNext) worksNext.disabled = worksIndex === worksMax;
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
  worksDots.forEach((dot, i) => {
    dot.addEventListener('click', () => setWorksPanel(i));
  });

  worksPrev?.addEventListener('click', () => setWorksPanel(worksIndex - 1));
  worksNext?.addEventListener('click', () => setWorksPanel(worksIndex + 1));

  setWorksPanel(0);
})();

const cursor = document.querySelector('.cursor');

if(cursor){
  document.addEventListener('mousemove', e => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  document
    .querySelectorAll('a, .case-tag, .box, .p-card, .dot, .works-prev, .works-next')
    .forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('big'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
    });
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add('on');
  });
}, { threshold: .16 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const gallery = document.querySelector('.gallery-showcase');
const galleryRows = document.querySelectorAll('.gallery-row');

function moveGallery(){
  if(!gallery) return;

  const rect = gallery.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0, (innerHeight - rect.top) / (innerHeight + rect.height)));

  galleryRows.forEach((row, index) => {
    const direction = row.classList.contains('row-left') ? -1 : 1;
    const base = index % 2 === 0 ? -180 : 180;
    const scrollMove = (progress - .5) * 420 * direction;
    row.style.setProperty('--move', `${base + scrollMove}px`);
  });
}

window.addEventListener('scroll', moveGallery, { passive: true });
window.addEventListener('resize', moveGallery);
moveGallery();

if(gallery){
  gallery.addEventListener('mousemove', e => {
    const x = (e.clientX / innerWidth - .5) * 80;

    galleryRows.forEach(row => {
      const direction = row.classList.contains('row-left') ? -1 : 1;
      row.style.translate = `${x * direction}px 0`;
    });
  });

  gallery.addEventListener('mouseleave', () => {
    galleryRows.forEach(row => {
      row.style.translate = '0 0';
    });
  });
}

document.querySelectorAll('.browser').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.transform = `rotateY(${(x / rect.width - .5) * -20}deg) rotateX(${(.5 - y / rect.height) * 14}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(-13deg) rotateX(7deg)';
  });
});

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
  const scrollArea = modal.querySelector('.project-modal-scroll');
  const kicker = document.getElementById('projectModalKicker');
  const title = document.getElementById('projectModalTitle');
  const visual = document.getElementById('projectModalVisual');
  const modalImage = document.getElementById("projectModalImage");
  const desc = document.getElementById('projectModalDesc');
  const overview = document.getElementById('projectModalOverview');
  const role = document.getElementById('projectModalRole');
  const tags = document.getElementById('projectModalTags');

  const data = [
  {
    num: "PROJECT 01",
    title: "감귤",
    image: "./images/p1.png",

    c1: "#ff8b32",
    c2: "#fff1c9",

    desc: "신선한 감귤의 색감과 풍성한 이미지를 활용해 제품의 산뜻하고 먹음직스러운 분위기를 표현한 식품 상세페이지입니다.",

    overview: "감귤의 특징과 신선도, 보관 방법 등의 정보를 한눈에 확인할 수 있도록 구성했습니다. 따뜻한 오렌지 컬러와 제품 중심의 이미지 배치를 활용해 자연스럽게 구매로 이어질 수 있도록 디자인했습니다.",

    tools: "Adobe Photoshop · Adobe Illustrator",

    tags: [
      "Detail Page",
      "Food",
      "Photoshop",
      "Illustrator",
      "Visual Design"
    ]
  },

  {
    num: "PROJECT 02",
    title: "프라이팬",
    image: "./images/p2.png",

    c1: "#242424",
    c2: "#d7d7d7",

    desc: "프라이팬의 내구성과 실용적인 기능을 효과적으로 전달하기 위해 제품 이미지와 핵심 정보를 명확하게 구성한 주방용품 상세페이지입니다.",

    overview: "코팅력, 열전도율, 손잡이 구조 등 구매자가 중요하게 생각하는 기능을 중심으로 정보의 우선순위를 정리했습니다. 금속 소재의 느낌을 살린 차분한 색상과 깔끔한 레이아웃으로 제품의 전문성과 신뢰감을 표현했습니다.",

    tools: "Adobe Photoshop · Adobe Illustrator",

    tags: [
      "Detail Page",
      "Cookware",
      "Photoshop",
      "Illustrator",
      "Product Design"
    ]
  },

  {
    num: "PROJECT 03",
    title: "샤인머스켓",
    image: "./images/p3.png",

    c1: "#8ebf45",
    c2: "#eff8cd",

    desc: "샤인머스켓의 싱그러운 색감과 높은 당도를 시각적으로 강조해 신선하고 고급스러운 이미지를 전달한 과일 상세페이지입니다.",

    overview: "제품의 당도와 식감, 선별 과정, 포장 방식 등의 정보를 순차적으로 배치했습니다. 밝은 그린 컬러와 생동감 있는 과일 이미지를 활용해 신선함을 강조하고, 선물용 상품으로서의 고급스러운 분위기도 함께 표현했습니다.",

    tools: "Adobe Photoshop · Adobe Illustrator",

    tags: [
      "Detail Page",
      "Fresh Food",
      "Photoshop",
      "Illustrator",
      "E-commerce"
    ]
  },

  {
    num: "PROJECT 04",
    title: "사각 스텐 트레이",
    image: "./images/p4.png",

    c1: "#8b9298",
    c2: "#eef1f3",

    desc: "스테인리스 소재의 위생성과 다양한 활용 방법을 간결하게 전달한 주방용 사각 트레이 상세페이지입니다.",

    overview: "제품의 크기와 소재, 내구성, 세척 방법 등 실사용에 필요한 정보를 중심으로 구성했습니다. 스테인리스 특유의 깨끗하고 견고한 이미지를 살리기 위해 실버와 그레이 컬러를 사용하고, 군더더기 없는 정돈된 레이아웃으로 제작했습니다.",

    tools: "Adobe Photoshop · Adobe Illustrator",

    tags: [
      "Detail Page",
      "Kitchenware",
      "Photoshop",
      "Illustrator",
      "Product Layout"
    ]
  },

  {
    num: "PROJECT 05",
    title: "멍게젓갈",
    image: "./images/p5.png",

    c1: "#e65f39",
    c2: "#ffe3c8",

    desc: "멍게젓갈의 신선한 원재료와 깊은 감칠맛을 강조해 제품의 풍미가 효과적으로 전달되도록 구성한 식품 상세페이지입니다.",

    overview: "원재료의 특징과 제조 과정, 맛있게 즐기는 방법, 보관 정보를 자연스러운 흐름으로 정리했습니다. 따뜻한 주황색과 식탁 이미지를 활용해 친근하고 먹음직스러운 분위기를 표현하고 제품에 대한 신뢰감을 높였습니다.",

    tools: "Adobe Photoshop · Adobe Illustrator",

    tags: [
      "Detail Page",
      "Food",
      "Photoshop",
      "Illustrator",
      "Content Design"
    ]
  },

  {
    num: "PROJECT 06",
    title: "쿡웨어",
    image: "./images/p6.png",

    c1: "#343434",
    c2: "#c9c3bb",

    desc: "다양한 주방용품의 기능과 구성품을 효과적으로 보여주기 위해 제품 중심으로 설계한 쿡웨어 상세페이지입니다.",

    overview: "제품별 특징과 사용 방법, 사이즈, 소재 정보를 비교하기 쉽게 구성했습니다. 차분한 뉴트럴 컬러와 넓은 여백을 활용해 여러 제품이 복잡해 보이지 않도록 정리하고, 실용적이면서도 세련된 주방용품의 이미지를 표현했습니다.",

    tools: "Adobe Photoshop · Adobe Illustrator",

    tags: [
      "Detail Page",
      "Cookware",
      "Photoshop",
      "Illustrator",
      "E-commerce"
    ]
  }
];

  function resetProjectModalScroll(){
    if(!scrollArea) return;

    scrollArea.scrollTop = 0;
    scrollArea.scrollLeft = 0;
  }

  function openModal(i){
    const item = data[i] || data[0];

    /* 이전 프로젝트에서 읽던 위치를 먼저 제거 */
    resetProjectModalScroll();

    kicker.textContent = item.num;
    title.textContent = item.title;
    modalImage.src = item.image;
    modalImage.alt = `${item.title} 프로젝트 상세페이지`;
    desc.textContent = item.desc;
    overview.textContent = item.overview;
    role.textContent = item.tools;
    visual.style.setProperty('--modal-c1', item.c1);
    visual.style.setProperty('--modal-c2', item.c2);
    tags.innerHTML = item.tags.map(tag => `<span>${tag}</span>`).join('');

    modal.classList.add('on');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('project-modal-open');

    /*
      팝업 표시와 레이아웃 계산이 끝난 뒤에도 초기화해
      모든 프로젝트가 항상 첫 화면부터 열리도록 합니다.
    */
    requestAnimationFrame(() => {
      resetProjectModalScroll();

      requestAnimationFrame(() => {
        resetProjectModalScroll();
      });
    });

    window.dispatchEvent(new CustomEvent('projectModalOpen'));
  }

  window.openProjectModal = openModal;

  function closeModal(){
    modal.classList.remove('on');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('project-modal-open');

    resetProjectModalScroll();

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
  const image = document.getElementById('boxModalImage');
  const closeBtn = modal?.querySelector('.box-modal-close');

  if(!section || !marquee || !track || !modal || !title || !desc || !image) return;
  if(track.dataset.boxReady === 'true') return;

  const data = {
  POSTER: {
    desc: '브랜드 메시지와 정보를 시각적으로 전달한 포스터 디자인 작업입니다.',
    image: './images/poster_work.png'
  },

  BLOG: {
    desc: '브랜드의 콘텐츠와 제품 정보를 효과적으로 전달한 블로그 디자인 작업입니다.',
    image: './images/blog_work.png'
  },

  BROCHURE: {
    desc: '기업과 제품 정보를 명확한 흐름으로 정리한 브로슈어 디자인 작업입니다.',
    image: './images/brochure_work.png'
  },

  BIZ_CARD: {
    desc: '브랜드의 인상을 간결하게 담아낸 명함 디자인 작업입니다.',
    image: './images/businesscard_work.png'
  },

  BANNER: {
    desc: '프로모션과 이벤트 내용을 직관적으로 전달한 배너 디자인 작업입니다.',
    image: './images/banner_work.png'
  }
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

  function openBoxModal(card) {
  const name =
    card.querySelector('h3')?.textContent.trim() || 'DESIGN WORK';

  const item = data[name] || {
    desc: '디자인 작업 상세 내용을 보여주는 팝업입니다.',
    image: './images/poster_work.jpg'
  };

  title.textContent = name;
  desc.textContent = item.desc;

  image.src = item.image;
  image.alt = `${name} 디자인 작업 이미지`;

  modal.classList.add('on');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('project-modal-open');

  const scrollArea = modal.querySelector('.box-modal-scroll');
  if (scrollArea) {
    scrollArea.scrollTop = 0;
  }
}

  function closeBoxModal(){
    modal.classList.remove('on');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('project-modal-open');

    const scrollArea = modal.querySelector('.box-modal-scroll');
    if(scrollArea){
      scrollArea.scrollTop = 0;
      scrollArea.scrollLeft = 0;
    }
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
    addMotion(document.querySelector("#box_project .box-drag-guide"), "right", 120);
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
