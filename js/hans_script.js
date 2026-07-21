(() => {
  const body = document.body;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* =========================================================
     PROJECT CONFIG
     - 콘텐츠와 컬러 프리셋을 한곳에서 관리합니다.
     - 실제 개별 페이지에서는 원하는 프로젝트만 남겨도 됩니다.
  ========================================================= */
  const PROJECTS = {
    hans: {
      projectName: "HANS CAKE",
      shortName: "HANS",
      titleTop: "HANS",
      titleBottom: "CAKE",
      eyebrow: "PREMIUM DESSERT BRAND REDESIGN",
      description:
        "한스케익의 브랜드 감성과 제품 탐색 흐름을 동시에 정돈한 반응형 웹사이트 UX/UI 리디자인 프로젝트입니다.",
      domain: "hanscake.co.kr",
      period: "2026.04<br>— 2026.05",
      year: "2026",
      screenLabel: "PREMIUM DESSERT EXPERIENCE",
      screenTitle: "Sweet moments,<br>clearly designed.",
      marquee:
        "HANS CAKE — UX/UI REDESIGN — HANS CAKE — UX/UI REDESIGN — ",
      accentHex: "#D92818",
      note1Title: '브랜드 첫인상',
      note1Desc: '큰 비주얼과 감성적인 카피로 한스케익의 산뜻하고 달콤한 이미지를 직관적으로 전달합니다.',
      note2Title: '쉬운 제품 탐색',
      note2Desc: '케이크·스위트·음료 메뉴를 탭과 카드로 구성해 원하는 제품을 쉽게 비교합니다.',
      note3Title: '브랜드 스토리',
      note3Desc: '신선한 재료와 정성스러운 제작 과정을 이미지 중심으로 보여줍니다.',
      note4Title: '행동으로 연결',
      note4Desc: '제품 확인 이후 주문, 매장 찾기, 공지 확인까지 자연스럽게 이어지도록 CTA를 배치합니다.',
    },

    bio: {
      projectName: "SAMSUNG BIOLOGICS",
      shortName: "BIO",
      titleTop: "SAMSUNG",
      titleBottom: "BIOLOGICS",
      eyebrow: "GLOBAL BIOPHARMA CORPORATE REDESIGN",
      description:
        "글로벌 생산 역량과 기술 경쟁력을 명확한 정보 구조와 미래지향적인 인터랙션으로 전달한 기업 웹사이트 리디자인 프로젝트입니다.",
      domain: "samsungbiologics.com",
      period: "2026.05<br>— 2026.06",
      year: "2026",
      screenLabel: "GLOBAL BIOPHARMA PARTNER",
      screenTitle: "Building trust<br>through innovation.",
      marquee:
        "SAMSUNG BIOLOGICS — CORPORATE REDESIGN — SAMSUNG BIOLOGICS — ",
      accentHex: "#1677FF",
      note1Title: '글로벌 첫인상',
      note1Desc: '대형 비주얼과 핵심 메시지로 글로벌 바이오 파트너로서의 신뢰와 규모를 전달합니다.',
      note2Title: '서비스 탐색',
      note2Desc: 'CDMO 서비스와 생산 역량을 명확한 카테고리로 구성해 필요한 정보를 빠르게 확인합니다.',
      note3Title: '기술과 신뢰',
      note3Desc: 'R&D, 생산시설, 품질관리 정보를 시각적으로 연결해 기업의 전문성을 강조합니다.',
      note4Title: '파트너십 연결',
      note4Desc: '서비스 문의, 뉴스룸, ESG 정보로 자연스럽게 이어지는 기업형 CTA 흐름을 구성합니다.',
    },

    ne: {
      projectName: "NE NEUNGYULE",
      shortName: "NE",
      titleTop: "NE",
      titleBottom: "NEUNGYULE",
      eyebrow: "EDUCATION PLATFORM UX/UI REDESIGN",
      description:
        "다양한 교육 콘텐츠를 사용 목적에 따라 정리하고 학습 정보 접근성을 개선한 교육 브랜드 웹사이트 리디자인 프로젝트입니다.",
      domain: "neungyule.com",
      period: "2026.06<br>— 2026.07",
      year: "2026",
      screenLabel: "BETTER LEARNING EXPERIENCE",
      screenTitle: "Learning made<br>clear and easy.",
      marquee:
        "NE NEUNGYULE — EDUCATION REDESIGN — NE NEUNGYULE — ",
      accentHex: "#FF5B2E",
      note1Title: '학습 브랜드 인상',
      note1Desc: '명확한 메시지와 밝은 비주얼로 교육 브랜드의 친근함과 전문성을 함께 전달합니다.',
      note2Title: '쉬운 콘텐츠 탐색',
      note2Desc: '교재와 학습 서비스를 사용자 목적에 따라 구분해 필요한 콘텐츠를 빠르게 찾도록 구성합니다.',
      note3Title: '교육 가치 전달',
      note3Desc: '학습 철학과 교육 콘텐츠의 강점을 이미지와 사례 중심으로 보여줍니다.',
      note4Title: '학습 행동 연결',
      note4Desc: '교재 검색, 강의 확인, 고객지원으로 이어지는 실용적인 CTA 흐름을 배치합니다.',
    },

    sonicast: {
      projectName: "SONICAST",
      shortName: "SONICAST",
      titleTop: "SONI",
      titleBottom: "CAST",
      eyebrow: "AUDIO TECHNOLOGY BRAND REDESIGN",
      description:
        "음향 기술과 제품의 전문성을 강한 비주얼과 인터랙션으로 전달한 오디오 브랜드 웹사이트 리디자인 프로젝트입니다.",
      domain: "sonicast.co.kr",
      period: "2026.06<br>— 2026.07",
      year: "2026",
      screenLabel: "ADVANCED AUDIO TECHNOLOGY",
      screenTitle: "Engineered for<br>pure sound.",
      marquee:
        "SONICAST — AUDIO TECHNOLOGY REDESIGN — SONICAST — ",
      accentHex: "#7857FF",
      note1Title: '강한 사운드 인상',
      note1Desc: '제품 비주얼과 강한 타이포그래피로 소니캐스트의 기술적이고 감각적인 이미지를 전달합니다.',
      note2Title: '제품 탐색',
      note2Desc: '이어폰과 음향 제품을 시리즈와 특징별로 나누어 쉽게 비교할 수 있도록 구성합니다.',
      note3Title: '기술 스토리',
      note3Desc: '음향 기술, R&D, 측정 장비를 시각적으로 보여주며 브랜드의 전문성을 강조합니다.',
      note4Title: '구매와 정보 연결',
      note4Desc: '제품 확인에서 상세 정보, 구매처, 고객지원으로 자연스럽게 이동하도록 CTA를 구성합니다.',
    },
  };

  /* =========================================================
     THEME SWITCH
  ========================================================= */
  const bindProject = (key) => {
    const project = PROJECTS[key];
    if (!project) return;

    body.dataset.project = key;

    Object.entries(project).forEach(([name, value]) => {
      document.querySelectorAll(`[data-bind="${name}"]`).forEach((element) => {
        element.innerHTML = value;
      });
    });

    document.querySelectorAll("[data-theme]").forEach((button) => {
      button.classList.toggle("active", button.dataset.theme === key);
    });

    document.title = `${project.projectName} — Universal Case Study`;
  };


  bindProject(body.dataset.project || "hans");

  /* =========================================================
     LOADER
  ========================================================= */
  const loader = document.querySelector(".page-loader");
  const loaderNumber = loader?.querySelector(".loader-number b");
  const loaderTrack = loader?.querySelector(".loader-track i");

  if (!reducedMotion && loader && loaderNumber && loaderTrack) {
    let value = 0;

    const timer = window.setInterval(() => {
      value += Math.max(1, Math.round((100 - value) * 0.13));
      value = Math.min(100, value);

      loaderNumber.textContent = String(value).padStart(2, "0");
      loaderTrack.style.width = `${value}%`;

      if (value >= 100) {
        window.clearInterval(timer);

        window.setTimeout(() => {
          loader.classList.add("is-hidden");
          body.classList.remove("is-loading");

          document.querySelectorAll(".hero .reveal").forEach((item, index) => {
            window.setTimeout(() => item.classList.add("is-visible"), index * 90);
          });
        }, 230);
      }
    }, 38);
  } else {
    loader?.remove();
    body.classList.remove("is-loading");
  }

  /* =========================================================
     REVEAL
  ========================================================= */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const delay = Number(entry.target.dataset.delay || 0);
        window.setTimeout(() => entry.target.classList.add("is-visible"), delay);
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  document.querySelectorAll(".reveal").forEach((item) => {
    revealObserver.observe(item);
  });

  /* =========================================================
     CUSTOM CURSOR
  ========================================================= */
  if (finePointer && !reducedMotion) {
    const cursor = document.querySelector(".cursor");
    const label = cursor?.querySelector(".cursor-label");

    if (cursor && label) {
      let targetX = window.innerWidth / 2;
      let targetY = window.innerHeight / 2;
      let currentX = targetX;
      let currentY = targetY;

      window.addEventListener("mousemove", (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
      });

      const renderCursor = () => {
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        requestAnimationFrame(renderCursor);
      };

      renderCursor();

      document
        .querySelectorAll("a, button, .tilt, .feature-card, .analysis-row")
        .forEach((element) => {
          element.addEventListener("mouseenter", () => {
            cursor.classList.add("is-active");
            label.textContent =
              element.classList.contains("tilt") ||
              element.classList.contains("feature-card")
                ? "VIEW"
                : "GO";
          });

          element.addEventListener("mouseleave", () => {
            cursor.classList.remove("is-active");
          });
        });
    }
  }

  /* =========================================================
     SCROLL PROGRESS + ACTIVE NAV
  ========================================================= */
  const progress = document.querySelector(".scroll-progress i");
  const sideLinks = [...document.querySelectorAll(".side-nav a")];

  const sections = sideLinks
    .map((link) => {
      const href = link.getAttribute("href");
      return href === "#top"
        ? document.querySelector(".hero")
        : document.querySelector(href);
    })
    .filter(Boolean);

  const updateProgress = () => {
    const max = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );
    progress.style.transform = `scaleX(${window.scrollY / max})`;
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!active) return;

      const href = active.target.classList.contains("hero")
        ? "#top"
        : `#${active.target.id}`;

      sideLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === href);
      });
    },
    {
      threshold: [0.15, 0.3, 0.55],
      rootMargin: "-20% 0px -55% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* =========================================================
     RESULT NAV
  ========================================================= */
  const resultLinks = [...document.querySelectorAll(".result-nav a")];
  const resultSections = resultLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const resultObserver = new IntersectionObserver(
    (entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!active) return;

      resultLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${active.target.id}`
        );
      });
    },
    {
      threshold: [0.2, 0.4, 0.6],
      rootMargin: "-18% 0px -58% 0px",
    }
  );

  resultSections.forEach((section) => resultObserver.observe(section));

  /* =========================================================
     TILT
  ========================================================= */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll(".tilt").forEach((element) => {
      element.addEventListener("mousemove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        element.style.setProperty("--ry", `${(x - 0.5) * 7}deg`);
        element.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
        element.style.setProperty("--lift", "-6px");
      });

      element.addEventListener("mouseleave", () => {
        element.style.setProperty("--ry", "0deg");
        element.style.setProperty("--rx", "0deg");
        element.style.setProperty("--lift", "0px");
      });
    });
  }

  /* =========================================================
     MAGNETIC
  ========================================================= */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll(".magnetic").forEach((element) => {
      element.addEventListener("mousemove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        element.style.transform = `translate3d(${x * 0.16}px, ${y * 0.16}px, 0)`;
      });

      element.addEventListener("mouseleave", () => {
        element.style.transform = "translate3d(0, 0, 0)";
      });
    });
  }

  /* =========================================================
     HERO PARALLAX
  ========================================================= */
  const hero = document.querySelector(".hero");
  const heroTitle = document.querySelectorAll(".hero-title h1 span");
  const heroMockup = document.querySelector(".hero-mockup");

  if (hero && finePointer && !reducedMotion) {
    hero.addEventListener("mousemove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      heroTitle.forEach((line, index) => {
        const strength = index === 0 ? 18 : -23;
        line.style.transform = `translate3d(${x * strength}px, ${y * 7}px, 0)`;
      });

      if (heroMockup) {
        heroMockup.style.marginLeft = `${x * -12}px`;
        heroMockup.style.marginTop = `${y * -10}px`;
      }
    });

    hero.addEventListener("mouseleave", () => {
      heroTitle.forEach((line) => {
        line.style.transform = "translate3d(0,0,0)";
      });

      if (heroMockup) {
        heroMockup.style.marginLeft = "0";
        heroMockup.style.marginTop = "0";
      }
    });
  }

  /* =========================================================
     SCROLL TYPE PARALLAX
  ========================================================= */
  const parallaxItems = [...document.querySelectorAll(".parallax-type")];

  const updateParallaxType = () => {
    if (reducedMotion) return;

    parallaxItems.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = center - window.innerHeight / 2;
      const move = Math.max(-50, Math.min(50, distance * -0.05));
      const direction = index % 2 === 0 ? 1 : -1;

      element.style.transform = `translate3d(${move * direction}px, 0, 0)`;
    });
  };

  window.addEventListener("scroll", updateParallaxType, { passive: true });
  updateParallaxType();

  /* =========================================================
     DEVICE PARALLAX
  ========================================================= */
  const deviceStage = document.querySelector(".device-stage");

  if (deviceStage && finePointer && !reducedMotion) {
    const desktop = deviceStage.querySelector(".desktop-device");
    const tablet = deviceStage.querySelector(".tablet-device");
    const mobile = deviceStage.querySelector(".mobile-device");

    deviceStage.addEventListener("mousemove", (event) => {
      const rect = deviceStage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      desktop.style.transform =
        `perspective(1200px) rotateY(${-8 + x * 5}deg) translate3d(${x * -18}px, ${y * -12}px, 0)`;

      tablet.style.transform =
        `rotate(${-4 - x * 3}deg) translate3d(${x * 24}px, ${y * 18}px, 0)`;

      mobile.style.transform =
        `rotate(${5 + x * 4}deg) translate3d(${x * -28}px, ${y * -23}px, 0)`;
    });

    deviceStage.addEventListener("mouseleave", () => {
      desktop.style.transform = "perspective(1200px) rotateY(-8deg)";
      tablet.style.transform = "rotate(-4deg)";
      mobile.style.transform = "rotate(5deg)";
    });
  }


  /* =========================================================
     MAIN PAGE SHOWCASE
     - 왼쪽 설명 활성화
     - 모바일 화면 스크롤 동기화
  ========================================================= */
  const mainpageNotes = [...document.querySelectorAll(".mainpage-note")];
  const phonePage = document.querySelector(".phone-page");
  const mainpageShowcase = document.querySelector(".mainpage-showcase");

  const setActiveMainpageNote = (sectionId) => {
    mainpageNotes.forEach((note) => {
      note.classList.toggle("active", note.dataset.target === sectionId);
    });
  };

  const mainpageLong = document.querySelector(".mainpage-long");

  const updateMainpageNote = () => {
    if (!mainpageLong || !mainpageNotes.length) return;

    const rect = mainpageLong.getBoundingClientRect();

    /* 화면 높이의 45% 지점을 기준으로 현재 이미지 구간 계산 */
    const triggerPoint = window.innerHeight * 0.45;
    const rawProgress = (triggerPoint - rect.top) / rect.height;

    const progress = Math.min(
      Math.max(rawProgress, 0),
      0.9999
    );

    const activeIndex = Math.floor(
      progress * mainpageNotes.length
    );

    mainpageNotes.forEach((note, index) => {
      note.classList.toggle(
        "active",
        index === activeIndex
      );
    });
  };

  window.addEventListener("scroll", updateMainpageNote, {
    passive: true
  });

  window.addEventListener("resize", updateMainpageNote);
  window.addEventListener("load", updateMainpageNote);

  updateMainpageNote();

  /* 설명을 클릭하면 긴 웹사이트 이미지의 해당 구간으로 이동 */
  const moveToMainpageSection = (index) => {
    if (!mainpageLong || !mainpageNotes.length) return;

    const rect = mainpageLong.getBoundingClientRect();
    const sectionProgress = (index + 0.5) / mainpageNotes.length;
    const absoluteTop = window.scrollY + rect.top;
    const targetY =
      absoluteTop +
      rect.height * sectionProgress -
      window.innerHeight * 0.45;

    mainpageNotes.forEach((note, noteIndex) => {
      note.classList.toggle("active", noteIndex === index);
    });

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  mainpageNotes.forEach((note, index) => {
    note.addEventListener("click", () => {
      moveToMainpageSection(index);
    });

    note.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      moveToMainpageSection(index);
    });
  });

  const syncPhonePage = () => {
    if (!phonePage || !mainpageShowcase) return;

    const rect = mainpageShowcase.getBoundingClientRect();
    const total = mainpageShowcase.offsetHeight - window.innerHeight;
    const passed = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
    const progress = passed / Math.max(total, 1);

    const viewport = phonePage.parentElement;
    const maxMove = Math.max(0, phonePage.scrollHeight - viewport.clientHeight);
    phonePage.style.transform = `translate3d(0, ${-maxMove * progress}px, 0)`;
  };

  window.addEventListener("scroll", syncPhonePage, { passive: true });
  window.addEventListener("resize", syncPhonePage);
  syncPhonePage();

  /* =========================================================
     SMOOTH ANCHOR
  ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  });
})();

/* =========================================================
   SUBPAGE MOBILE HAMBURGER MENU
========================================================= */
(() => {
  const button = document.querySelector("#header .case-menu-btn");
  const menu = document.getElementById("caseMobileMenu");

  if (!button || !menu || menu.dataset.menuReady === "true") return;

  const menuLinks = [...menu.querySelectorAll('a[href^="#"]')];
  let previousFocus = null;

  const setMenuState = (open) => {
    document.body.classList.toggle("case-menu-open", open);
    button.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute(
      "aria-label",
      open ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"
    );
    menu.setAttribute("aria-hidden", String(!open));

    if (open) {
      previousFocus = document.activeElement;
      window.setTimeout(() => menuLinks[0]?.focus(), 70);
    }
  };

  const closeMenu = () => {
    const wasOpen = document.body.classList.contains("case-menu-open");
    setMenuState(false);

    if (
      wasOpen &&
      previousFocus &&
      typeof previousFocus.focus === "function"
    ) {
      previousFocus.focus();
    }
  };

  button.addEventListener("click", () => {
    const open = !document.body.classList.contains("case-menu-open");
    setMenuState(open);
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  window.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      document.body.classList.contains("case-menu-open")
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (
      window.innerWidth > 900 &&
      document.body.classList.contains("case-menu-open")
    ) {
      closeMenu();
    }
  });

  menu.dataset.menuReady = "true";
})();

