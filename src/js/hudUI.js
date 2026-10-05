import { PROJECTS_DATA } from './projectsData.js';
import { spaceAudio } from './audio.js';
import confetti from 'canvas-confetti';

export function setupHUDUI(onSectorJump) {
  // Elements
  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const mSector = document.getElementById('m-sector');
  const mTitle = document.getElementById('m-title');
  const mSubtitle = document.getElementById('m-subtitle');
  const mDescription = document.getElementById('m-description');
  const mInnovations = document.getElementById('m-innovations');
  const mTechTags = document.getElementById('m-tech-tags');
  const mLiveLink = document.getElementById('m-live-link');
  const mRepoLink = document.getElementById('m-repo-link');
  const mDemoContainer = document.getElementById('m-demo-container');
  const mScreenTitle = document.getElementById('m-screen-title');

  const navBtns = document.querySelectorAll('.nav-btn');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const audioToggleBtn = document.getElementById('audio-toggle');
  const audioIcon = document.getElementById('audio-icon');

  const startVoyageBtn = document.getElementById('start-voyage-btn');
  const directProjectsBtn = document.getElementById('direct-projects-btn');
  const contactQuickBtn = document.getElementById('contact-quick-btn');
  const spaceContactForm = document.getElementById('space-contact-form');

  let activeDemoAnimFrame = null;

  // 1. Modal Open / Close Logic
  function openProjectModal(index) {
    const data = PROJECTS_DATA[index];
    if (!data) return;

    spaceAudio.playChime();

    mSector.textContent = data.sector;
    mTitle.textContent = data.title;
    mSubtitle.textContent = data.tagline;
    mDescription.textContent = data.description;

    // Innovations
    mInnovations.innerHTML = '';
    data.innovations.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      mInnovations.appendChild(li);
    });

    // Tech Tags
    mTechTags.innerHTML = '';
    data.techStack.forEach(tech => {
      const span = document.createElement('span');
      span.className = 'pill';
      span.textContent = tech;
      mTechTags.appendChild(span);
    });

    mLiveLink.href = data.liveUrl;
    mRepoLink.href = data.repoUrl;

    // Render Dynamic Live Web Preview or Interactive Canvas Demo
    renderInteractiveDemo(data);

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    spaceAudio.playClick();
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (activeDemoAnimFrame) {
      cancelAnimationFrame(activeDemoAnimFrame);
      activeDemoAnimFrame = null;
    }
  }

  // Direct & Delegated Open Modal Button Listeners
  function handleOpenModalClick(e) {
    // 1. Check if the user clicked an explicit modal trigger button (.open-modal-btn)
    const openModalBtn = e.target.closest('.open-modal-btn');
    if (openModalBtn) {
      e.preventDefault();
      e.stopPropagation();
      const idxAttr = openModalBtn.getAttribute('data-project');
      if (idxAttr !== null) {
        openProjectModal(parseInt(idxAttr, 10));
      }
      return;
    }

    // 2. Check if user clicked a link with live-preview-trigger or dummy href '#'
    const previewTrigger = e.target.closest('.live-preview-trigger');
    if (previewTrigger) {
      const href = previewTrigger.getAttribute('href');
      if (!href || href === '#' || href === 'javascript:void(0)') {
        e.preventDefault();
        e.stopPropagation();
        const idxAttr = previewTrigger.getAttribute('data-project');
        if (idxAttr !== null) {
          openProjectModal(parseInt(idxAttr, 10));
        }
      }
    }
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', handleOpenModalClick);
  });

  // Standard bubbling event delegation fallback
  document.addEventListener('click', handleOpenModalClick);

  modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // 2. Render Live Embedded Iframe Preview or Dynamic Canvas Demo
  function renderInteractiveDemo(data) {
    mDemoContainer.innerHTML = '';

    if (activeDemoAnimFrame) {
      cancelAnimationFrame(activeDemoAnimFrame);
      activeDemoAnimFrame = null;
    }

    // Check if real live URL exists for live iframe embedding
    if (data.liveUrl && data.liveUrl.startsWith('http') && !data.liveUrl.includes('example.dev')) {
      if (mScreenTitle) mScreenTitle.textContent = "LIVE SYSTEM PREVIEW • " + data.planetName.toUpperCase();

      const iframe = document.createElement('iframe');
      iframe.className = 'modal-preview-iframe';
      iframe.src = data.liveUrl;
      iframe.title = `${data.title} Live Preview`;
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('allow', 'fullscreen; autoplay; accelerometer');
      mDemoContainer.appendChild(iframe);
      return;
    }

    if (mScreenTitle) mScreenTitle.textContent = "INTERACTIVE SIMULATION";

    // Canvas fallback rendering for demo types
    const canvas = document.createElement('canvas');
    canvas.width = 460;
    canvas.height = 320;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    mDemoContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let t = 0;

    function animate() {
      t += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (data.demoType === 'neuralNet') {
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
        ctx.lineWidth = 2;
        const nodes = [
          { x: 100 + Math.sin(t) * 20, y: 150 + Math.cos(t) * 15 },
          { x: 230, y: 80 + Math.sin(t * 1.5) * 20 },
          { x: 230, y: 220 + Math.cos(t * 1.2) * 20 },
          { x: 360 + Math.cos(t) * 20, y: 150 + Math.sin(t) * 15 }
        ];

        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }

        nodes.forEach(n => {
          ctx.fillStyle = '#00f3ff';
          ctx.beginPath();
          ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
          ctx.fill();
        });

      } else if (data.demoType === 'blockchainGraph') {
        ctx.fillStyle = '#00f5d4';
        for (let i = 0; i < 5; i++) {
          const x = 50 + i * 80;
          const y = 150 + Math.sin(t + i) * 30;
          ctx.fillRect(x, y, 50, 50);
          ctx.strokeStyle = '#fff';
          ctx.strokeRect(x, y, 50, 50);
        }
      } else if (data.demoType === 'product3DRotate') {
        ctx.save();
        ctx.translate(230, 150);
        ctx.rotate(t);
        ctx.strokeStyle = '#ffb703';
        ctx.lineWidth = 3;
        ctx.strokeRect(-50, -50, 100, 100);
        ctx.rotate(t * 0.5);
        ctx.strokeStyle = '#00f3ff';
        ctx.strokeRect(-70, -70, 140, 140);
        ctx.restore();
      } else if (data.demoType === 'canvasPulse') {
        ctx.strokeStyle = '#9d4edd';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 10) {
          const y = 150 + Math.sin(x * 0.03 + t * 2) * 40;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (data.demoType === 'calculatorDemo') {
        // Floating ambient math symbols
        const symbols = ['+', '−', '×', '÷', '=', '%', '±'];
        ctx.font = '14px Orbitron, sans-serif';
        for (let i = 0; i < 12; i++) {
          const sx = (i * 42 + Math.sin(t + i) * 15) % canvas.width;
          const sy = (i * 25 + Math.cos(t * 0.8 + i) * 20) % canvas.height;
          ctx.fillStyle = `rgba(167, 139, 250, ${0.2 + Math.sin(t + i) * 0.15})`;
          ctx.fillText(symbols[i % symbols.length], sx, sy);
        }

        // Draw Calculator Body (Glassmorphism card)
        const calcX = 145, calcY = 30, calcW = 170, calcH = 260, radius = 18;
        ctx.fillStyle = 'rgba(17, 24, 39, 0.85)';
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(calcX, calcY, calcW, calcH, radius);
        ctx.fill();
        ctx.stroke();

        // Calculator Display
        ctx.fillStyle = 'rgba(2, 6, 23, 0.8)';
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
        ctx.beginPath();
        ctx.roundRect(calcX + 12, calcY + 14, calcW - 24, 52, 10);
        ctx.fill();
        ctx.stroke();

        // Animated Expressions Cycle
        const expressions = [
          { expr: '25 × 4 =', res: '100' },
          { expr: '1024 ÷ 16 =', res: '64' },
          { expr: '348 + 512 =', res: '860' },
          { expr: '999 − 425 =', res: '574' }
        ];
        const currentExprIdx = Math.floor(t * 0.4) % expressions.length;
        const currentItem = expressions[currentExprIdx];

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px Space Grotesk, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(currentItem.expr, calcX + calcW - 22, calcY + 32);

        ctx.fillStyle = '#a78bfa';
        ctx.font = 'bold 20px Orbitron, monospace';
        ctx.fillText(currentItem.res, calcX + calcW - 22, calcY + 56);

        // Keypad Grid (4 columns x 5 rows)
        const cols = 4, rows = 5;
        const kw = 30, kh = 26, gap = 6;
        const gridX = calcX + 13;
        const gridY = calcY + 76;
        const keyLabels = [
          ['AC', '±', '%', '÷'],
          ['7', '8', '9', '×'],
          ['4', '5', '6', '−'],
          ['1', '2', '3', '+'],
          ['0', '.', '=']
        ];

        let keyCounter = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < keyLabels[r].length; c++) {
            const kText = keyLabels[r][c];
            const isZero = kText === '0';
            const curKw = isZero ? kw * 2 + gap : kw;
            const kx = gridX + c * (kw + gap);
            const ky = gridY + r * (kh + gap);

            // Active press effect animation
            const activePress = Math.floor(t * 3 + keyCounter) % 18 === 0;
            ctx.fillStyle = activePress ? 'rgba(167, 139, 250, 0.6)' : (['÷', '×', '−', '+', '='].includes(kText) ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.08)');
            ctx.beginPath();
            ctx.roundRect(kx, ky, curKw, kh, 6);
            ctx.fill();

            ctx.fillStyle = kText === 'AC' ? '#fb7185' : (['÷', '×', '−', '+', '='].includes(kText) ? '#ddd6fe' : '#f8fafc');
            ctx.font = 'bold 11px Space Grotesk, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(kText, kx + curKw / 2, ky + 17);

            if (isZero) c++; // skip extra col for wide zero
            keyCounter++;
          }
        }
        ctx.textAlign = 'left'; // reset
      } else {
        for (let i = 0; i < 30; i++) {
          const r = 40 + Math.sin(t + i) * 30;
          const angle = i * 0.2 + t;
          const x = 230 + Math.cos(angle) * r;
          const y = 150 + Math.sin(angle) * r;
          ctx.fillStyle = i % 2 === 0 ? '#ff0055' : '#ffb703';
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      activeDemoAnimFrame = requestAnimationFrame(animate);
    }

    animate();
  }

  // 3. Navigation Sector Jump Listeners
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      spaceAudio.playClick();
      const sectorIndex = parseInt(btn.getAttribute('data-sector'), 10);
      onSectorJump(sectorIndex);
    });
  });

  if (startVoyageBtn) {
    startVoyageBtn.addEventListener('click', () => {
      spaceAudio.playClick();
      onSectorJump(1);
    });
  }

  if (directProjectsBtn) {
    directProjectsBtn.addEventListener('click', () => {
      spaceAudio.playClick();
      onSectorJump(1);
    });
  }

  if (contactQuickBtn) {
    contactQuickBtn.addEventListener('click', () => {
      spaceAudio.playClick();
      onSectorJump(8);
    });
  }

  // 4. Audio Button Toggle
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      const isPlaying = spaceAudio.toggle();
      if (isPlaying) {
        audioToggleBtn.classList.add('playing');
        audioIcon.className = 'fa-solid fa-volume-high';
      } else {
        audioToggleBtn.classList.remove('playing');
        audioIcon.className = 'fa-solid fa-volume-xmark';
      }
    });
  }

  // 5. Contact Form Transmission Dispatch
  if (spaceContactForm) {
    spaceContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      spaceAudio.playChime();

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f3ff', '#9d4edd', '#00f5d4', '#ffb703']
      });

      const submitBtn = document.getElementById('submit-comm-btn');
      
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> TRANSMISSION SENT!';
      submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

      setTimeout(() => {
        spaceContactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
      }, 4000);
    });
  }

  return {
    updateActiveSector(sectorIndex) {
      navBtns.forEach((btn, idx) => {
        if (idx === sectorIndex) btn.classList.add('active');
        else btn.classList.remove('active');
      });

      const cards = document.querySelectorAll('.planet-hud-card');
      cards.forEach(card => {
        const cardPlanetIndex = parseInt(card.getAttribute('data-planet'), 10);
        if (cardPlanetIndex === sectorIndex) {
          card.classList.add('active-card');
        } else {
          card.classList.remove('active-card');
        }
      });
    }
  };
}
