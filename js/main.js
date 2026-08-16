document.addEventListener('DOMContentLoaded', () => {
  let projectsData = [];
  let certificatesData = [];

  // Fetch projects and certificates data dynamically
  const initPortfolio = async () => {
    try {
      const [projectsRes, certificatesRes] = await Promise.all([
        fetch('data/projects.json'),
        fetch('data/certificates.json')
      ]);

      if (!projectsRes.ok) throw new Error('Gagal mengambil data proyek');
      if (!certificatesRes.ok) throw new Error('Gagal mengambil data sertifikat');

      projectsData = await projectsRes.json();
      certificatesData = await certificatesRes.json();
      
      renderProjects(projectsData);
      renderCertificates(certificatesData);
      setupReadMore();
      setupCarousels();
      setupModal();

      // Pulihkan posisi scroll setelah data dinamis selesai dirender
      const savedScrollPosition = sessionStorage.getItem('scrollPosition');
      if (savedScrollPosition !== null) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollPosition));
          sessionStorage.removeItem('scrollPosition');
        }, 50);
      } else if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
          setTimeout(() => {
            window.scrollTo({
              top: targetElement.offsetTop - 100,
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error initializing portfolio:', error);
      const projectsGrid = document.getElementById('projects-grid');
      if (projectsGrid) {
        projectsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--accent-cyan);">
            <p>Gagal memuat data portofolio.</p>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">Pastikan server lokal/hosting berjalan dengan benar.</p>
          </div>
        `;
      }
    }
  };

  let visibleProjectsCount = 3;
  let visibleCertificatesCount = 3;

  const updateCertificatesVisibility = (totalCount) => {
    const cards = document.querySelectorAll('.certificate-card');
    cards.forEach((card, index) => {
      if (index < visibleCertificatesCount) {
        card.classList.remove('hidden-card');
      } else {
        card.classList.add('hidden-card');
      }
    });

    // Perbarui visibilitas tombol
    const moreBtn = document.getElementById('btn-cert-load-more');
    const lessBtn = document.getElementById('btn-cert-show-less');

    if (moreBtn) {
      if (visibleCertificatesCount >= totalCount) {
        moreBtn.style.display = 'none';
      } else {
        moreBtn.style.display = 'flex';
      }
    }

    if (lessBtn) {
      if (visibleCertificatesCount > 3) {
        lessBtn.style.display = 'flex';
      } else {
        lessBtn.style.display = 'none';
      }
    }
  };

  const renderCertificatesControlButtons = (totalCount) => {
    const controlsContainer = document.getElementById('certificates-controls');
    if (!controlsContainer || totalCount <= 3) {
      if (controlsContainer) controlsContainer.innerHTML = '';
      return;
    }

    controlsContainer.innerHTML = `
      <button class="btn-control btn-control-more" id="btn-cert-load-more">
        <span>Selengkapnya</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
      <button class="btn-control btn-control-less" id="btn-cert-show-less" style="display: none;">
        <span>Lebih sedikit</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    `;

    const moreBtn = document.getElementById('btn-cert-load-more');
    const lessBtn = document.getElementById('btn-cert-show-less');

    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        visibleCertificatesCount += 3;
        updateCertificatesVisibility(totalCount);
      });
    }

    if (lessBtn) {
      lessBtn.addEventListener('click', () => {
        visibleCertificatesCount = 3;
        updateCertificatesVisibility(totalCount);
        // Scroll kembali ke atas galeri sertifikat
        const certificatesSection = document.getElementById('certificates');
        if (certificatesSection) {
          window.scrollTo({
            top: certificatesSection.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      });
    }

    updateCertificatesVisibility(totalCount);
  };

  const updateProjectsVisibility = (totalCount) => {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
      if (index < visibleProjectsCount) {
        card.classList.remove('hidden-card');
      } else {
        card.classList.add('hidden-card');
      }
    });

    // Perbarui visibilitas tombol
    const moreBtn = document.getElementById('btn-load-more');
    const lessBtn = document.getElementById('btn-show-less');

    if (moreBtn) {
      if (visibleProjectsCount >= totalCount) {
        moreBtn.style.display = 'none';
      } else {
        moreBtn.style.display = 'flex';
      }
    }

    if (lessBtn) {
      if (visibleProjectsCount > 3) {
        lessBtn.style.display = 'flex';
      } else {
        lessBtn.style.display = 'none';
      }
    }
  };

  const renderControlButtons = (totalCount) => {
    const controlsContainer = document.getElementById('projects-controls');
    if (!controlsContainer || totalCount <= 3) return;

    controlsContainer.innerHTML = `
      <button class="btn-control btn-control-more" id="btn-load-more">
        <span>Selengkapnya</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
      <button class="btn-control btn-control-less" id="btn-show-less" style="display: none;">
        <span>Lebih sedikit</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    `;

    const moreBtn = document.getElementById('btn-load-more');
    const lessBtn = document.getElementById('btn-show-less');

    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        visibleProjectsCount += 3;
        updateProjectsVisibility(totalCount);
      });
    }

    if (lessBtn) {
      lessBtn.addEventListener('click', () => {
        visibleProjectsCount = 3;
        updateProjectsVisibility(totalCount);
        // Scroll kembali ke atas galeri proyek
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
          window.scrollTo({
            top: projectsSection.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      });
    }

    updateProjectsVisibility(totalCount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  // 1. Render Project Cards Dinamis
  const renderProjects = (data) => {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = data.map((project, index) => {
      const techBadges = project.techStack
        .map(tech => `<span>${tech}</span>`)
        .join('');

      const imgElements = project.images
        .map((imgUrl, imgIndex) => `
          <div class="carousel-slide" data-index="${imgIndex}">
            <img src="${imgUrl}" alt="${project.name}" loading="lazy">
          </div>
        `)
        .join('');

      const hasMultipleImages = project.images.length > 1;
      const dotsElements = hasMultipleImages 
        ? `<div class="carousel-dots">` + 
          project.images.map((_, idx) => `<span class="dot ${idx === 0 ? 'active' : ''}" data-slide-to="${idx}"></span>`).join('') + 
          `</div>`
        : '';

      const navButtons = hasMultipleImages
        ? `<button class="carousel-nav prev-btn" aria-label="Gambar Sebelumnya">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
           </button>
           <button class="carousel-nav next-btn" aria-label="Gambar Selanjutnya">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
           </button>`
        : '';

      const isHidden = index >= 3 ? 'hidden-card' : '';

      const statusBadge = project.status === 'archived'
        ? `<span class="project-status archived">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; display: inline-block; vertical-align: middle;">
              <path d="M21 8v13H3V8z"></path>
              <path d="M1 3h22v5H1z"></path>
              <path d="M10 12h4"></path>
            </svg>Arsip
           </span>`
        : '';

      return `
        <article class="project-card glass-panel ${isHidden}" data-project-id="${project.id}">
          <div class="project-header">
            <div>
              <h3 class="project-title">${project.name}</h3>
              <div class="project-meta">Diperbarui: ${formatDate(project.lastUpdated)}</div>
            </div>
            <div class="project-badges">
              ${statusBadge}
              <span class="project-version">${project.version}</span>
            </div>
          </div>
          
          <div class="project-carousel-container">
            ${navButtons}
            <div class="project-img-wrapper ${project.orientation}">
              <div class="carousel-track">
                ${imgElements}
              </div>
              <div class="project-overlay-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </div>
            </div>
            ${dotsElements}
          </div>
          
          <div class="project-body">
            <p class="project-purpose">${project.purpose}</p>
            <button class="read-more-btn" style="display: none;">Selengkapnya</button>
            <div class="project-tech">
              ${techBadges}
            </div>
            <div class="project-links">
              ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" rel="noopener" class="link-demo">Demo Live</a>` : ''}
              <a href="${project.githubUrl}" target="_blank" rel="noopener" class="link-code">Kode Sumber</a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    renderControlButtons(data.length);
  };

  // 1.8. Render Certificates Dinamis
  const renderCertificates = (data) => {
    const certsGrid = document.getElementById('certificates-grid');
    if (!certsGrid) return;

    certsGrid.innerHTML = data.map((cert, index) => {
      const techBadges = cert.techStack
        .map(tech => `<span>${tech}</span>`)
        .join('');

      const isHidden = index >= 3 ? 'hidden-card' : '';

      const credLink = cert.credentialUrl
        ? `<a href="${cert.credentialUrl}" target="_blank" rel="noopener" class="cert-link">
            <span>Lihat Kredensial</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
           </a>`
        : '';

      return `
        <article class="certificate-card glass-panel ${isHidden}" data-certificate-id="${cert.id}">
          <div class="cert-img-wrapper">
            <img src="${cert.image}" alt="${cert.name}" loading="lazy">
            <div class="cert-overlay-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
          </div>
          <div class="cert-body">
            <div class="cert-header">
              <div class="cert-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <span class="cert-badge">${cert.credentialId ? cert.credentialId : 'Kredensial'}</span>
            </div>
            <h3 class="cert-title">${cert.name}</h3>
            <div class="cert-issuer">${cert.issuer}</div>
            <div class="cert-date">Diterbitkan: ${cert.issuedDate} &bull; Exp: ${cert.expirationDate ? cert.expirationDate : 'Tanpa Batas'}</div>
            <p class="cert-description">${cert.description}</p>
            <div class="cert-tech">
              ${techBadges}
            </div>
            ${credLink}
          </div>
        </article>
      `;
    }).join('');

    renderCertificatesControlButtons(data.length);
  };

  // 1.5. Penanganan Tombol Selengkapnya (Read More) untuk Deskripsi Proyek
  const setupReadMore = () => {
    const purposes = document.querySelectorAll('.project-purpose');
    purposes.forEach(purpose => {
      setTimeout(() => {
        const readMoreBtn = purpose.nextElementSibling;
        if (readMoreBtn && readMoreBtn.classList.contains('read-more-btn')) {
          if (purpose.scrollHeight > purpose.clientHeight) {
            readMoreBtn.style.display = 'inline-block';
          }
          
          readMoreBtn.addEventListener('click', () => {
            purpose.classList.toggle('expanded');
            if (purpose.classList.contains('expanded')) {
              readMoreBtn.innerText = 'Sembunyikan';
            } else {
              readMoreBtn.innerText = 'Selengkapnya';
            }
          });
        }
      }, 150);
    });
  };

  // 2. Setup Kontrol Carousel untuk Setiap Kartu Proyek
  const setupCarousels = () => {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      const slides = card.querySelectorAll('.carousel-slide');
      const dots = card.querySelectorAll('.dot');
      const prevBtn = card.querySelector('.prev-btn');
      const nextBtn = card.querySelector('.next-btn');
      const track = card.querySelector('.carousel-track');
      
      if (slides.length <= 1) return;

      let currentIndex = 0;

      const updateCarousel = (index) => {
        if (dots.length > 0) dots[currentIndex].classList.remove('active');
        currentIndex = (index + slides.length) % slides.length;
        if (track) {
          track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        if (dots.length > 0) dots[currentIndex].classList.add('active');
      };

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          updateCarousel(currentIndex - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          updateCarousel(currentIndex + 1);
        });
      }

      dots.forEach((dot, dotIdx) => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          updateCarousel(dotIdx);
        });
      });

      // Swipe gesture support for card carousels in mobile
      let touchstartX = 0;
      let touchendX = 0;
      const carouselContainer = card.querySelector('.project-carousel-container');

      if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
          touchstartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselContainer.addEventListener('touchend', (e) => {
          touchendX = e.changedTouches[0].screenX;
          handleSwipe();
        }, { passive: true });
      }

      const handleSwipe = () => {
        const threshold = 50;
        const swipeLength = touchendX - touchstartX;
        if (swipeLength > threshold) {
          updateCarousel(currentIndex - 1);
        } else if (swipeLength < -threshold) {
          updateCarousel(currentIndex + 1);
        }
      };
    });
  };

  // 3. Modal Handler untuk Pratinjau Gambar Screenshot dengan Navigasi Multi-Foto
  const setupModal = () => {
    const imageModal = document.getElementById('image-modal');
    const modalTrack = document.getElementById('modal-carousel-track');
    const modalClose = document.getElementById('modal-close');
    const modalPrevBtn = document.getElementById('modal-prev-btn');
    const modalNextBtn = document.getElementById('modal-next-btn');
    const projectImgWrappers = document.querySelectorAll('.project-img-wrapper');

    let activeProjectImages = [];
    let activeImageIndex = 0;

    const openModal = () => {
      if (imageModal && !imageModal.classList.contains('active')) {
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        history.pushState({ modalOpen: true }, '');
      }
    };

    const closeModal = (popHistory = true) => {
      if (imageModal && imageModal.classList.contains('active')) {
        imageModal.classList.remove('active');
        document.body.style.overflow = '';
        if (popHistory && history.state && history.state.modalOpen) {
          history.back();
        }
      }
    };

    window.addEventListener('popstate', () => {
      if (imageModal && imageModal.classList.contains('active')) {
        closeModal(false);
      }
    });

    const updateModalImage = (index) => {
      if (activeProjectImages.length === 0) return;

      const modalDots = document.querySelectorAll('.modal-dot');
      if (modalDots.length > 0) modalDots[activeImageIndex].classList.remove('active');

      activeImageIndex = (index + activeProjectImages.length) % activeProjectImages.length;
      
      if (modalTrack) {
        modalTrack.style.transform = `translateX(-${activeImageIndex * 100}%)`;
      }

      if (modalDots.length > 0) modalDots[activeImageIndex].classList.add('active');
    };

    projectImgWrappers.forEach(wrapper => {
      wrapper.addEventListener('click', (e) => {
        if (e.target.closest('.carousel-nav') || e.target.closest('.carousel-dots')) {
          return;
        }

        const card = wrapper.closest('.project-card');
        if (!card) return;
        
        const projectId = parseInt(card.getAttribute('data-project-id'));
        const project = projectsData.find(p => p.id === projectId);
        
        if (project && imageModal && modalTrack) {
          activeProjectImages = project.images;
          
          const dots = card.querySelectorAll('.dot');
          let activeIndex = 0;
          dots.forEach((dot, idx) => {
            if (dot.classList.contains('active')) {
              activeIndex = idx;
            }
          });
          activeImageIndex = activeIndex;

          modalTrack.innerHTML = activeProjectImages.map((imgUrl, idx) => `
            <div class="modal-slide">
              <img src="${imgUrl}" alt="Zoomed screenshot ${idx + 1}" class="modal-img">
            </div>
          `).join('');

          modalTrack.style.transform = `translateX(-${activeImageIndex * 100}%)`;

          const modalDotsContainer = document.getElementById('modal-carousel-dots');
          if (modalDotsContainer) {
            if (activeProjectImages.length > 1) {
              modalDotsContainer.innerHTML = activeProjectImages.map((_, idx) => `
                <span class="modal-dot ${idx === activeImageIndex ? 'active' : ''}" data-modal-slide-to="${idx}"></span>
              `).join('');
              modalDotsContainer.style.display = 'flex';
            } else {
              modalDotsContainer.innerHTML = '';
              modalDotsContainer.style.display = 'none';
            }
          }

          if (activeProjectImages.length > 1) {
            if (modalPrevBtn) modalPrevBtn.style.display = 'flex';
            if (modalNextBtn) modalNextBtn.style.display = 'flex';
          } else {
            if (modalPrevBtn) modalPrevBtn.style.display = 'none';
            if (modalNextBtn) modalNextBtn.style.display = 'none';
          }

          openModal();
        }
      });
    });

    const certImgWrappers = document.querySelectorAll('.cert-img-wrapper');

    certImgWrappers.forEach(wrapper => {
      wrapper.addEventListener('click', () => {
        const card = wrapper.closest('.certificate-card');
        if (!card) return;
        
        const certId = parseInt(card.getAttribute('data-certificate-id'));
        const cert = certificatesData.find(c => c.id === certId);
        
        if (cert && imageModal && modalTrack) {
          activeProjectImages = [cert.image];
          activeImageIndex = 0;

          modalTrack.innerHTML = `
            <div class="modal-slide">
              <img src="${cert.image}" alt="${cert.name}" class="modal-img">
            </div>
          `;

          modalTrack.style.transform = `translateX(0)`;

          const modalDotsContainer = document.getElementById('modal-carousel-dots');
          if (modalDotsContainer) {
            modalDotsContainer.innerHTML = '';
            modalDotsContainer.style.display = 'none';
          }

          if (modalPrevBtn) modalPrevBtn.style.display = 'none';
          if (modalNextBtn) modalNextBtn.style.display = 'none';

          openModal();
        }
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => closeModal(true));
    }

    if (modalPrevBtn) {
      modalPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateModalImage(activeImageIndex - 1);
      });
    }

    if (modalNextBtn) {
      modalNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateModalImage(activeImageIndex + 1);
      });
    }

    if (imageModal) {
      imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal || e.target.classList.contains('modal-slide')) {
          closeModal(true);
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (imageModal && imageModal.classList.contains('active')) {
        if (e.key === 'Escape') {
          closeModal(true);
        } else if (e.key === 'ArrowLeft' && activeProjectImages.length > 1) {
          updateModalImage(activeImageIndex - 1);
        } else if (e.key === 'ArrowRight' && activeProjectImages.length > 1) {
          updateModalImage(activeImageIndex + 1);
        }
      }
    });

    let modalTouchstartX = 0;
    let modalTouchendX = 0;

    if (imageModal) {
      imageModal.addEventListener('touchstart', (e) => {
        modalTouchstartX = e.changedTouches[0].screenX;
      }, { passive: true });

      imageModal.addEventListener('touchend', (e) => {
        modalTouchendX = e.changedTouches[0].screenX;
        handleModalSwipe();
      }, { passive: true });
    }

    const handleModalSwipe = () => {
      const threshold = 50;
      const swipeLength = modalTouchendX - modalTouchstartX;
      if (activeProjectImages.length > 1) {
        if (swipeLength > threshold) {
          updateModalImage(activeImageIndex - 1);
        } else if (swipeLength < -threshold) {
          updateModalImage(activeImageIndex + 1);
        }
      }
    };

    const modalDotsContainer = document.getElementById('modal-carousel-dots');
    if (modalDotsContainer) {
      modalDotsContainer.addEventListener('click', (e) => {
        const dot = e.target.closest('.modal-dot');
        if (dot) {
          e.stopPropagation();
          const slideTo = parseInt(dot.getAttribute('data-modal-slide-to'));
          updateModalImage(slideTo);
        }
      });
    }
  };

  // 4. Mobile Navigation Menu Toggle (Burger Menu)
  const burgerMenu = document.getElementById('burger-menu');
  const navLinks = document.getElementById('nav-links');

  if (burgerMenu && navLinks) {
    burgerMenu.addEventListener('click', () => {
      burgerMenu.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // 5. ScrollSpy & Sticky Navbar Styling
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (scrollY > 50) {
        navbar.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.5)';
        navbar.style.borderBottom = '1px solid rgba(0, 240, 255, 0.15)';
      } else {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.06)';
      }
    }

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 200;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  });



  // Simpan posisi scroll sebelum halaman di-refresh/ditutup
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('scrollPosition', window.scrollY);
  });

  // Panggil initPortfolio untuk memicu loading data
  initPortfolio();
});
