window.addEventListener("load", function () {
  // preloader
  const images = document.querySelectorAll('.preloader-images img');
  const svg = document.querySelector('.preloader-icon svg');
  const svgRects = svg.querySelectorAll('rect');
  const preloader = document.querySelector('.preloader');

  images.forEach(img => {
    gsap.set(img, {
      position: 'absolute',
      top: Math.random() * window.innerHeight,
      left: Math.random() * window.innerWidth,
      opacity: 0,
      scale: 0.5
    });
  });

  const tl = gsap.timeline();

  tl.to(images, {
    opacity: 1,
    scale: 1,
    stagger: { each: 0.1 },
    duration: 0.4,
    ease: "power1.inOut",
  });

  tl.add(() => {
    const preloaderOffset = preloader.getBoundingClientRect();

    const targets = Array.from(images).map((img, i) => {
      const rect = svgRects[Math.floor(Math.random() * svgRects.length)];
      const bbox = rect.getBoundingClientRect();

      return {
        img,
        x: bbox.left - preloaderOffset.left,
        y: bbox.top - preloaderOffset.top,
        w: bbox.width,
        h: bbox.height
      };
    });

    targets.forEach(({ img, x, y, w, h }) => {
      gsap.to(img, {
        x: x - img.offsetLeft,
        y: y - img.offsetTop,
        width: w,
        height: h,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power1.out'
      });
    });
  });
  
  tl.to('.preloader-icon', {
    opacity: 1,
    duration: 0.3,
    ease: 'power1.out'
  }, '+=1');

  tl.to('.preloader-block', {
    height: '100%',
    duration: 0.6,
    ease: 'power1.out'
  }, '+=0.6');

  tl.add(() => {
    if (preloader) {
      preloader.style.opacity = 0; 
      preloader.style.zIndex = -1;
    }

    if (window.location.pathname === '/') {
      AOS.init({
        duration: 1200,
        offset: 0,
      });
    }
  }, "+=1");

  // Swiper
  var aboutSwiper = new Swiper(".aboutSwiper", {
    slidesPerView: 1.2,
    spaceBetween: 16,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    breakpoints: {
      768: {
        slidesPerView: 2.5,
        spaceBetween: 20,
      },
      1025: {
        slidesPerView: 3.5,
        spaceBetween: 20,
      },
    }
  });

  document.querySelectorAll('.person__wrap').forEach((wrap) => {
    const personSwiper2 = new Swiper(wrap.querySelector('.personSwiper2'), {
      direction: 'horizontal',
      loop: true,
      spaceBetween: 16,
      reverseDirection: true,
      allowTouchMove: false,
      pagination: {
        el: wrap.querySelector('.person__pagination'),
        type: 'fraction',
      },
      navigation: {
        nextEl: wrap.querySelector('.person__next'),
        prevEl: wrap.querySelector('.person__prev'),
      },
      breakpoints: {
        768: {
          initialSlide: 1,
          spaceBetween: 0,
        },
      }
    });

    const personSwiper = new Swiper(wrap.querySelector('.personSwiper'), {
      direction: 'horizontal',
      loop: true,
      spaceBetween: 16,
      reverseDirection: true,
      allowTouchMove: false,
      pagination: {
        el: wrap.querySelector('.person__pagination'),
        type: 'fraction',
      },
      navigation: {
        nextEl: wrap.querySelector('.person__next'),
        prevEl: wrap.querySelector('.person__prev'),
      },
      breakpoints: {
        768: {
          spaceBetween: 0,
        },
      }
    });
  });

  // AOS Animate

  if (window.location.pathname !== '/') {
    AOS.init({
      duration: 1200,
      offset: 0,
    });
  }

  // Fancybox
  Fancybox.bind("[data-fancybox]", {
    // Your custom options
  });

  // Modal

  const modal = document.querySelector('.modal');
  const containerWrapper = modal.querySelector('.modal__wrap');
  const modalTriggers = document.querySelectorAll('.modal-btn');

  function showmodal(modal) {
    modal.style.display = 'block';
    setTimeout(() => {
      modal.style.transition = 'opacity 0.4s';
      modal.style.opacity = '1';
    }, 10);
  }

  function hidemodal(modal) {
    modal.addEventListener('click', (e) => {
      const target = e.target;
      if (target.classList.contains('modal__close') || target.classList.contains('modal')) {
        modal.style.transition = 'opacity 0.4s';
        modal.style.opacity = '0';
        setTimeout(() => {
          modal.style.display = 'none';
          containerWrapper.innerHTML = '';
        }, 400);
      }
    });
  }

  async function fetchModalContent(id) {
    try {
      const res = await fetch('../files/modals.json');
      const data = await res.json();
      return data.find(item => item.id === id);
    } catch (e) {
      console.error('Ошибка загрузки JSON:', e);
      return null;
    }
  }

  function buildModalHTML(data) {
    const slides = data.images.map(src => `
      <div class="swiper-slide"><img src="${src}" alt=""></div>
    `).join('');

    const paragraphs = data.paragraphs.map(p => `<p>${p}</p>`).join('');

    return `
      <div class="modal__container">
        <div class="modal__top">
          <div class="modal__heading">
            <h3 class="modal__title">${data.name}</h3>
            <div class="modal__position">
              <span>${data.position}</span>
              <span>${data.experience}</span>
            </div>
          </div>
          <button class="modal__close">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.89321 5.99999L11.815 1.07817C12.0617 0.831514 12.0617 0.431624 11.815 0.184992C11.5684 -0.0616639 11.1685 -0.0616639 10.9218 0.184992L5.99999 5.10681L1.07817 0.184992C0.831514 -0.0616639 0.431624 -0.0616639 0.184992 0.184992C-0.0616405 0.431648 -0.0616639 0.831537 0.184992 1.07817L5.10681 5.99999L0.184992 10.9218C-0.0616639 11.1685 -0.0616639 11.5684 0.184992 11.815C0.431647 12.0616 0.831537 12.0616 1.07817 11.815L5.99999 6.89317L10.9218 11.815C11.1684 12.0616 11.5683 12.0616 11.815 11.815C12.0616 11.5683 12.0616 11.1684 11.815 10.9218L6.89321 5.99999Z" fill="#151516"/>
            </svg>
          </button>
        </div>
        <div class="modal__slider">
          <div class="swiper modalSwiper">
            <div class="swiper-wrapper">${slides}</div>
          </div>
        </div>
        <div class="modal__info">
          ${paragraphs}
        </div>
      </div>
    `;
  }

  if (modal && modalTriggers.length) {
    hidemodal(modal);

    modalTriggers.forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const modalData = await fetchModalContent(id);

        if (modalData) {
          const html = buildModalHTML(modalData);
          containerWrapper.innerHTML = html;
          showmodal(modal);

          const closeBtn = modal.querySelector('.modal__close');
          closeBtn?.addEventListener('click', () => {
            modal.style.opacity = "0";
            setTimeout(() => {
              modal.style.display = "none";
              containerWrapper.innerHTML = '';
            }, 400);
          });

          new Swiper(".modalSwiper", {
            slidesPerView: 1.2,
            spaceBetween: 16,
            breakpoints: {
              768: {
                slidesPerView: 3.2,
                spaceBetween: 20,
              },
              1025: {
                slidesPerView: 4.2,
                spaceBetween: 20,
              },
            }
          });
        }
      });
    });
  }

});
