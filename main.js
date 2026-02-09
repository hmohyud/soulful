/* ══════════════════════════════════════════════════════
   SOULFUL EXPRESSIONS — main.js v4
   ══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── LOADER ─── */
  const loader = document.querySelector('.loader');
  const loaderFill = document.querySelector('.loader-fill');
  let lp = 0;
  const li = setInterval(() => {
    lp += Math.random() * 15 + 5; if (lp > 100) lp = 100;
    loaderFill.style.width = lp + '%';
    if (lp >= 100) { clearInterval(li); setTimeout(() => loader.classList.add('done'), 300); }
  }, 120);

  /* ─── CUSTOM CURSOR ─── */
  const dot = document.getElementById('cursorDot'), ring = document.getElementById('cursorRing');
  if (dot && ring && matchMedia('(pointer:fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = (mx-4)+'px'; dot.style.top = (my-4)+'px'; });
    (function cl() { rx+=(mx-rx)*.1; ry+=(my-ry)*.1; ring.style.left=(rx-22)+'px'; ring.style.top=(ry-22)+'px'; requestAnimationFrame(cl); })();
    const sel = 'a,button,.faq-q,.gallery-item,.benefit-card,.workshop-pill,.credential,.btt,.magnetic,.paint-color,.paint-clear,.tcard,.copy-btn,.tl-item,.garden-seed';
    document.addEventListener('mouseover', e => { if(e.target.closest(sel)){dot.classList.add('hovering');ring.classList.add('hovering');} });
    document.addEventListener('mouseout', e => { if(e.target.closest(sel)){dot.classList.remove('hovering');ring.classList.remove('hovering');} });
  }

  /* ─── BG CANVAS ─── */
  const bgC = document.getElementById('bgCanvas');
  if (bgC) {
    const bc = bgC.getContext('2d'), pts = [];
    const cols = ['rgba(163,196,160,.25)','rgba(198,123,92,.18)','rgba(107,76,110,.12)','rgba(212,160,160,.18)','rgba(201,169,110,.15)','rgba(107,143,113,.2)'];
    function rz() { bgC.width=innerWidth; bgC.height=innerHeight; }
    rz(); addEventListener('resize', rz);
    for(let i=0;i<12;i++) pts.push({x:Math.random()*bgC.width,y:Math.random()*bgC.height,r:Math.random()*130+70,c:cols[i%cols.length],vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25});
    let cv=true; new IntersectionObserver(e=>{cv=e[0].isIntersecting},{threshold:0}).observe(document.querySelector('.hero'));
    let tk=0;
    (function d(){requestAnimationFrame(d);if(!cv)return;if(++tk%2)return;bc.clearRect(0,0,bgC.width,bgC.height);
      pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<-p.r)p.x=bgC.width+p.r;if(p.x>bgC.width+p.r)p.x=-p.r;if(p.y<-p.r)p.y=bgC.height+p.r;if(p.y>bgC.height+p.r)p.y=-p.r;
        const g=bc.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,p.c);g.addColorStop(1,'transparent');bc.beginPath();bc.fillStyle=g;bc.arc(p.x,p.y,p.r,0,Math.PI*2);bc.fill();});
    })();
  }

  /* ─── VANTA.JS BIRDS HERO BACKGROUND ─── */
  if (typeof VANTA !== 'undefined' && VANTA.BIRDS) {
    try {
      VANTA.BIRDS({
        el: '#heroVanta',
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: 0xfaf5ef,
        color1: 0xa3c4a0,
        color2: 0xc67b5c,
        colorMode: 'lerp',
        birdSize: 1.2,
        wingSpan: 25.0,
        speedLimit: 4.0,
        separation: 30.0,
        alignment: 30.0,
        cohesion: 25.0,
        quantity: 3.0
      });
    } catch(e) { /* Vanta may fail silently */ }
  }

  /* ─── SCROLL PROGRESS ─── */
  const pb = document.querySelector('.scroll-progress');
  function up(){const h=document.documentElement.scrollHeight-innerHeight;pb.style.width=(h>0?(scrollY/h)*100:0)+'%';}

  /* ─── NAV + BTT ─── */
  const nav=document.getElementById('mainNav'),btt=document.querySelector('.btt');
  const navTherapist=nav.querySelector('.nav-therapist');
  const heroIntro=document.querySelector('.hero-intro');
  const heroEl=document.getElementById('hero');
  addEventListener('scroll',()=>{
    nav.classList.toggle('scrolled',scrollY>60);
    btt.classList.toggle('show',scrollY>600);
    // Crossfade hero portrait → nav therapist pill
    if(navTherapist&&heroIntro&&heroEl){
      const trigger=heroEl.offsetHeight*0.45;
      const range=heroEl.offsetHeight*0.2;
      const t=Math.min(1,Math.max(0,(scrollY-trigger)/range));
      heroIntro.style.opacity=String(1-t);
      heroIntro.style.transform='scale('+(1-t*0.3)+') translateY('+(t*-20)+'px)';
      navTherapist.classList.toggle('visible',t>0.3);
    }
    up();
  },{passive:true});
  btt.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

  /* ─── HAMBURGER ─── */
  const hb=document.getElementById('hamburger'),mm=document.getElementById('mobileMenu'),mo=document.getElementById('mobileOverlay');
  function tm(){const o=!mm.classList.contains('open');hb.classList.toggle('active',o);mm.classList.toggle('open',o);mo.classList.toggle('open',o);document.body.style.overflow=o?'hidden':'';}
  hb.addEventListener('click',tm);mo.addEventListener('click',tm);mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',tm));

  /* ─── SMOOTH SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(l=>{l.addEventListener('click',e=>{const t=document.querySelector(l.getAttribute('href'));if(t){e.preventDefault();scrollTo({top:t.getBoundingClientRect().top+scrollY-80,behavior:'smooth'});}});});

  /* ─── REVEAL ─── */
  const ro=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('revealed');});},{threshold:.08,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('[data-reveal],[data-stagger]').forEach(el=>ro.observe(el));

  /* ─── FREEZE ANIMS ─── */
  document.querySelectorAll('.therapist-photo-frame').forEach(el=>{
    new IntersectionObserver(e=>{e[0].target.classList.toggle('paused',!e[0].isIntersecting);},{rootMargin:'100px'}).observe(el);
  });


  /* ═══════════════════════════════════════════════════════════════
     ★ HEALING GARDEN — Interactive click-to-bloom journey
     ═══════════════════════════════════════════════════════════════ */
  (() => {
    const STEPS = [
      { title: 'Discover', desc: 'your inner world — through the transformative language of art', color: '#a3c4a0' },
      { title: 'Express',  desc: 'emotions freely — in a safe, non-judgmental space', color: '#c67b5c' },
      { title: 'Create',   desc: 'something meaningful — no artistic skill required', color: '#9b7a9e' },
      { title: 'Heal',     desc: 'from within — processing pain through the act of making', color: '#d4a0a0' },
      { title: 'Grow',     desc: 'into wholeness — building resilience, confidence, and self-awareness', color: '#c9a96e' },
    ];

    const garden = document.getElementById('garden');
    if (!garden) return;
    const canvas = document.getElementById('gardenCanvas');
    const ctx = canvas.getContext('2d');
    const textEl = document.getElementById('gardenText');
    const wordEl = document.getElementById('gardenWord');
    const descEl = document.getElementById('gardenDesc');
    const hintEl = document.getElementById('gardenHint');

    let W, H, dpr;
    let time = 0, visible = false;
    const bloomed = [false, false, false, false, false];
    const bloomProgress = [0, 0, 0, 0, 0]; // 0-1 animation
    const particles = [];
    let curStep = 0;

    // Floating particles for ambiance
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random(), y: Math.random() * 0.6,
        r: 1 + Math.random() * 2, spd: 0.0001 + Math.random() * 0.0002,
        phase: Math.random() * Math.PI * 2, alpha: 0.1 + Math.random() * 0.15
      });
    }

    new IntersectionObserver(e => { visible = e[0].isIntersecting; }, { threshold: 0.05 }).observe(garden);

    function resize() {
      dpr = devicePixelRatio || 1;
      W = garden.clientWidth; H = garden.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seedX(i) { return W * (0.1 + (i / (STEPS.length - 1)) * 0.8); }
    function groundY() { return H * 0.75; }

    function drawGround() {
      // Soil/grass line
      const gy = groundY();
      ctx.beginPath();
      ctx.moveTo(0, gy);
      for (let x = 0; x <= W; x += 2) {
        ctx.lineTo(x, gy + Math.sin(x * 0.03 + time * 0.5) * 3);
      }
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      const grd = ctx.createLinearGradient(0, gy, 0, H);
      grd.addColorStop(0, '#7a9e6a');
      grd.addColorStop(0.3, '#5d8a4c');
      grd.addColorStop(1, '#4a7340');
      ctx.fillStyle = grd;
      ctx.fill();

      // Grass blades
      for (let x = 5; x < W; x += 8) {
        const bh = 6 + Math.sin(x * 0.1) * 4;
        const sway = Math.sin(time * 1.5 + x * 0.05) * 3;
        ctx.beginPath();
        ctx.moveTo(x, gy + Math.sin(x * 0.03 + time * 0.5) * 3);
        ctx.quadraticCurveTo(x + sway, gy - bh * 0.6, x + sway * 1.5, gy - bh);
        ctx.strokeStyle = 'rgba(100,160,80,' + (0.2 + Math.random() * 0.15) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Helper: parse hex to rgb
    function hexRgb(hex) {
      const v = parseInt(hex.slice(1), 16);
      return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
    }

    function drawSeed(i) {
      const sx = seedX(i);
      const sy = groundY() + Math.sin(sx * 0.03 + time * 0.5) * 3;
      const bp = bloomProgress[i];
      const col = STEPS[i].color;
      const [cr, cg, cb] = hexRgb(col);

      if (bp < 0.01 && !bloomed[i]) {
        // Glowing orb seed with the step's color
        const bob = Math.sin(time * 2 + i) * 3;
        ctx.save();
        ctx.translate(sx, sy - 12 + bob);

        // Outer glow
        const pulse = 0.5 + 0.5 * Math.sin(time * 2.5 + i * 1.3);
        const glowR = 18 + pulse * 8;
        const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, glowR);
        glow.addColorStop(0, 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (0.35 + pulse * 0.15) + ')');
        glow.addColorStop(0.5, 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (0.1 + pulse * 0.05) + ')');
        glow.addColorStop(1, 'rgba(' + cr + ',' + cg + ',' + cb + ',0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Core orb
        const coreG = ctx.createRadialGradient(-2, -2, 1, 0, 0, 8);
        coreG.addColorStop(0, 'rgba(255,255,255,0.9)');
        coreG.addColorStop(0.4, col);
        coreG.addColorStop(1, 'rgba(' + cr + ',' + cg + ',' + cb + ',0.6)');
        ctx.fillStyle = coreG;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();

        // Specular highlight
        ctx.beginPath();
        ctx.arc(-2, -3, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + (0.5 + pulse * 0.3) + ')';
        ctx.fill();

        // Tiny orbiting sparkles
        for (let s = 0; s < 3; s++) {
          const angle = time * 1.5 + s * (Math.PI * 2 / 3) + i * 0.7;
          const dist = 14 + Math.sin(time * 2 + s + i) * 3;
          const px = Math.cos(angle) * dist;
          const py = Math.sin(angle) * dist;
          ctx.beginPath();
          ctx.arc(px, py, 1 + 0.5 * Math.sin(time * 4 + s), 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,' + (0.2 + 0.3 * Math.sin(time * 3 + s * 2)) + ')';
          ctx.fill();
        }

        ctx.restore();
      }

      if (bp > 0) {
        // Draw growing flower
        const stemH = bp * 70;
        const petalSize = Math.min(1, bp * 1.5) * 20;

        ctx.save();
        ctx.translate(sx, sy);

        // Stem with slight curve
        const sway = Math.sin(time * 1.2 + i) * 4 * bp;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(sway * 0.5, -stemH * 0.3, sway, -stemH * 0.6, sway * 0.5, -stemH);
        ctx.strokeStyle = '#4a8040';
        ctx.lineWidth = 2.5 - bp * 0.3;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Leaves (appear at 25%+)
        if (bp > 0.25) {
          const leafP = Math.min(1, (bp - 0.25) / 0.25);
          for (let side = -1; side <= 1; side += 2) {
            const lPosY = -stemH * (side === -1 ? 0.35 : 0.55);
            const lPosX = sway * (side === -1 ? 0.25 : 0.4);
            ctx.save();
            ctx.translate(lPosX, lPosY);
            ctx.rotate(side * 0.5 + Math.sin(time * 0.8 + i) * 0.08);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(side * 10 * leafP, -4 * leafP, side * 14 * leafP, 1 * leafP);
            ctx.quadraticCurveTo(side * 8 * leafP, 3 * leafP, 0, 0);
            ctx.fillStyle = 'rgba(90,160,70,' + (0.5 + leafP * 0.3) + ')';
            ctx.fill();
            // Leaf vein
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(side * 10 * leafP, -1 * leafP);
            ctx.strokeStyle = 'rgba(60,120,50,0.3)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.restore();
          }
        }

        // Flower head (appears at 45%+)
        if (bp > 0.45) {
          const flowerP = Math.min(1, (bp - 0.45) / 0.55);
          const fx = sway * 0.5;
          const fy = -stemH;
          const petalCount = 7;

          // Petal layers (two layers for depth)
          for (let layer = 0; layer < 2; layer++) {
            const layerOffset = layer * (Math.PI / petalCount);
            const layerAlpha = layer === 0 ? 0.3 : 0.55;
            const layerScale = layer === 0 ? 1.15 : 1;

            for (let p = 0; p < petalCount; p++) {
              const angle = (p / petalCount) * Math.PI * 2 + time * 0.2 + i + layerOffset;
              const pr = petalSize * flowerP * layerScale;
              ctx.save();
              ctx.translate(fx, fy);
              ctx.rotate(angle);
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.quadraticCurveTo(pr * 0.35, -pr * 0.3, pr * 0.85, 0);
              ctx.quadraticCurveTo(pr * 0.35, pr * 0.3, 0, 0);
              ctx.fillStyle = col;
              ctx.globalAlpha = layerAlpha * flowerP;
              ctx.fill();
              ctx.restore();
            }
          }

          // Golden center with gradient
          const centerR = 5 * flowerP;
          const cenG = ctx.createRadialGradient(fx, fy, 0, fx, fy, centerR);
          cenG.addColorStop(0, '#e8c86a');
          cenG.addColorStop(0.7, '#c9a96e');
          cenG.addColorStop(1, 'rgba(180,140,80,0.4)');
          ctx.globalAlpha = flowerP;
          ctx.fillStyle = cenG;
          ctx.beginPath();
          ctx.arc(fx, fy, centerR, 0, Math.PI * 2);
          ctx.fill();

          // Center dots
          ctx.globalAlpha = flowerP * 0.6;
          for (let d = 0; d < 5; d++) {
            const da = (d / 5) * Math.PI * 2 + time * 0.5;
            ctx.beginPath();
            ctx.arc(fx + Math.cos(da) * 2.5, fy + Math.sin(da) * 2.5, 0.8, 0, Math.PI * 2);
            ctx.fillStyle = '#a08040';
            ctx.fill();
          }

          // Sparkles and floating petals when bloomed
          if (bp >= 1) {
            ctx.globalAlpha = 1;
            for (let s = 0; s < 5; s++) {
              const sa = time * 1.5 + s * 1.25 + i;
              const sr = 22 + Math.sin(time * 2 + s) * 10;
              const sparkX = fx + Math.cos(sa) * sr;
              const sparkY = fy + Math.sin(sa) * sr * 0.7;
              const sparkAlpha = 0.15 + 0.35 * Math.sin(time * 3 + s * 1.7);

              // Star-shaped sparkle
              ctx.save();
              ctx.translate(sparkX, sparkY);
              ctx.rotate(time * 2 + s);
              ctx.beginPath();
              for (let p = 0; p < 4; p++) {
                const a = (p / 4) * Math.PI * 2;
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(a) * 3, Math.sin(a) * 3);
              }
              ctx.strokeStyle = 'rgba(255,255,255,' + sparkAlpha + ')';
              ctx.lineWidth = 0.8;
              ctx.stroke();
              ctx.restore();
            }
          }
        }

        ctx.globalAlpha = 1;
        ctx.restore();
      }
    }

    function drawParticles() {
      particles.forEach(p => {
        const py = p.y * H + Math.sin(time * 0.8 + p.phase) * 10;
        ctx.beginPath();
        ctx.arc(p.x * W, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + p.alpha * (0.5 + 0.5 * Math.sin(time + p.phase)) + ')';
        ctx.fill();
        p.x += p.spd;
        if (p.x > 1.05) p.x = -0.05;
      });
    }


    // Labels under seeds
    function drawLabels() {
      ctx.textAlign = 'center';
      ctx.font = '600 10px Outfit, sans-serif';
      const gy = groundY();
      STEPS.forEach((s, i) => {
        const sx = seedX(i);
        const sy = gy + 20;
        ctx.fillStyle = bloomed[i] ? 'rgba(26,47,42,0.7)' : 'rgba(26,47,42,0.3)';
        ctx.fillText(s.title.toUpperCase(), sx, sy);
      });
    }

    function frame() {
      if (visible) {
        time += 0.016;
        ctx.clearRect(0, 0, W, H);

        drawParticles();
        drawGround();
        for (let i = 0; i < STEPS.length; i++) {
          if (bloomed[i] && bloomProgress[i] < 1) {
            bloomProgress[i] = Math.min(1, bloomProgress[i] + 0.008);
          }
          drawSeed(i);
        }
        drawLabels();
      }
      requestAnimationFrame(frame);
    }

    function updateText(idx) {
      textEl.classList.add('fading');
      setTimeout(() => {
        curStep = idx;
        wordEl.textContent = STEPS[idx].title;
        descEl.textContent = STEPS[idx].desc;
        textEl.classList.remove('fading');
      }, 200);
    }

    // Click detection
    function handleClick(e) {
      const rect = garden.getBoundingClientRect();
      const ev = e.touches ? e.touches[0] : e;
      const cx = ev.clientX - rect.left;
      const cy = ev.clientY - rect.top;

      for (let i = 0; i < STEPS.length; i++) {
        const sx = seedX(i);
        const sy = groundY() - 8;
        const dist = Math.sqrt((cx - sx) ** 2 + (cy - sy) ** 2);
        if (dist < 30) {
          if (!bloomed[i]) {
            bloomed[i] = true;
            bloomProgress[i] = 0.01;
            updateText(i);
            if (hintEl && !hintEl.classList.contains('hidden')) {
              hintEl.classList.add('hidden');
            }
          } else {
            updateText(i);
          }
          break;
        }
      }
    }

    garden.addEventListener('click', handleClick);
    garden.addEventListener('touchend', e => {
      if (e.changedTouches && e.changedTouches[0]) {
        const rect = garden.getBoundingClientRect();
        const cx = e.changedTouches[0].clientX - rect.left;
        const cy = e.changedTouches[0].clientY - rect.top;
        for (let i = 0; i < STEPS.length; i++) {
          const sx = seedX(i);
          const sy = groundY() - 8;
          if (Math.sqrt((cx - sx) ** 2 + (cy - sy) ** 2) < 30) {
            if (!bloomed[i]) {
              bloomed[i] = true;
              bloomProgress[i] = 0.01;
              updateText(i);
              if (hintEl && !hintEl.classList.contains('hidden')) hintEl.classList.add('hidden');
            } else {
              updateText(i);
            }
            break;
          }
        }
      }
    });

    resize(); frame();
    addEventListener('resize', resize);
  })();




  /* ═══════════════════════════════════════════════════════════════
     ★ PAINT CANVAS — Fixed: painting continues outside canvas
     ═══════════════════════════════════════════════════════════════ */
  (() => {
    const canvas = document.getElementById('paintCanvas');
    if (!canvas) return;
    const pc = canvas.getContext('2d');
    let painting = false, color = '#a3c4a0', lastPt = null;

    function rz() {
      const r = canvas.parentElement.getBoundingClientRect(), d = devicePixelRatio || 1;
      canvas.width = r.width * d; canvas.height = r.height * d;
      pc.scale(d, d); canvas.style.width = r.width + 'px'; canvas.style.height = r.height + 'px';
    }
    rz(); let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(rz, 200); });

    function pos(e) {
      const r = canvas.getBoundingClientRect(), t = e.touches ? e.touches[0] : e;
      return { x: Math.max(0, Math.min(r.width, t.clientX - r.left)), y: Math.max(0, Math.min(r.height, t.clientY - r.top)) };
    }

    function stroke(a, b) {
      for (let i = 0; i < 3; i++) {
        pc.beginPath(); pc.strokeStyle = color; pc.globalAlpha = .15 + Math.random() * .15;
        pc.lineWidth = 12 + Math.random() * 18; pc.lineCap = 'round';
        const jx = (Math.random() - .5) * 6, jy = (Math.random() - .5) * 6;
        pc.moveTo(a.x + jx, a.y + jy); pc.lineTo(b.x + jx, b.y + jy); pc.stroke();
      }
      pc.beginPath(); pc.strokeStyle = color; pc.globalAlpha = .5; pc.lineWidth = 6; pc.lineCap = 'round';
      pc.moveTo(a.x, a.y); pc.lineTo(b.x, b.y); pc.stroke(); pc.globalAlpha = 1;
    }

    canvas.addEventListener('mousedown', e => { painting = true; lastPt = pos(e); e.preventDefault(); });
    canvas.addEventListener('touchstart', e => { painting = true; lastPt = pos(e); e.preventDefault(); }, { passive: false });
    addEventListener('mousemove', e => { if (!painting) return; const p = pos(e); stroke(lastPt, p); lastPt = p; });
    addEventListener('touchmove', e => { if (!painting) return; const p = pos(e); stroke(lastPt, p); lastPt = p; }, { passive: true });
    addEventListener('mouseup', () => { painting = false; lastPt = null; });
    addEventListener('touchend', () => { painting = false; lastPt = null; });

    document.querySelectorAll('.paint-color').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.paint-color').forEach(b => b.classList.remove('active'));
        btn.classList.add('active'); color = btn.dataset.color;
      });
    });
    document.getElementById('paintClear')?.addEventListener('click', () => {
      const d = devicePixelRatio || 1;
      pc.clearRect(0, 0, canvas.width / d, canvas.height / d);
    });
  })();


  /* ═══════════════════════════════════════════════════════════════
     ★ BLOOM — Interactive flower/mandala (Mission section)
     ═══════════════════════════════════════════════════════════════ */
  (() => {
    const canvas = document.getElementById('bloomCanvas');
    if (!canvas) return;
    const bc = canvas.getContext('2d');
    let W, H, mx = 0.5, my = 0.5, vis = false;
    const colors = ['#a3c4a0', '#c67b5c', '#9b7a9e', '#d4a0a0', '#c9a96e', '#6b8f71'];

    function rz() {
      const r = canvas.parentElement.getBoundingClientRect(), d = devicePixelRatio || 1;
      canvas.width = r.width * d; canvas.height = r.height * d;
      W = r.width; H = r.height;
      bc.setTransform(d, 0, 0, d, 0, 0);
    }
    rz(); addEventListener('resize', rz);

    new IntersectionObserver(e => { vis = e[0].isIntersecting; }, { threshold: 0.05 }).observe(canvas);

    const mEl = document.getElementById('mission');
    mEl.addEventListener('mousemove', e => { const r = mEl.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; });
    mEl.addEventListener('touchmove', e => { const r = mEl.getBoundingClientRect(), t = e.touches[0]; mx = (t.clientX - r.left) / r.width; my = (t.clientY - r.top) / r.height; }, { passive: true });

    let tick = 0;
    function draw() {
      requestAnimationFrame(draw);
      if (!vis) return;
      if (++tick % 2) return;

      bc.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const time = Date.now() * 0.0003;
      const petalCount = 12;
      const layers = 4;

      for (let layer = 0; layer < layers; layer++) {
        const layerRatio = layer / layers;
        const maxR = Math.min(W, H) * (0.15 + mx * 0.25) * (0.4 + layerRatio * 0.6);
        const rotOffset = time * (1 + layer * 0.3) + my * Math.PI;

        for (let i = 0; i < petalCount; i++) {
          const angle = (i / petalCount) * Math.PI * 2 + rotOffset;
          const petalLen = maxR * (0.6 + 0.4 * Math.sin(time * 2 + i + layer));
          const petalW = maxR * 0.18 * (0.5 + my * 0.5);

          const px = cx + Math.cos(angle) * petalLen * 0.4;
          const py = cy + Math.sin(angle) * petalLen * 0.4;

          bc.save();
          bc.translate(px, py);
          bc.rotate(angle);

          bc.beginPath();
          bc.moveTo(0, 0);
          bc.quadraticCurveTo(petalW, -petalLen * 0.3, 0, -petalLen * 0.7);
          bc.quadraticCurveTo(-petalW, -petalLen * 0.3, 0, 0);
          bc.closePath();

          const col = colors[(i + layer) % colors.length];
          bc.fillStyle = col;
          bc.globalAlpha = 0.06 + layerRatio * 0.04;
          bc.fill();

          bc.restore();
        }
      }

      const gr = bc.createRadialGradient(cx, cy, 0, cx, cy, 40 + mx * 30);
      gr.addColorStop(0, 'rgba(198,123,92,0.08)');
      gr.addColorStop(1, 'rgba(198,123,92,0)');
      bc.globalAlpha = 1;
      bc.fillStyle = gr;
      bc.beginPath(); bc.arc(cx, cy, 60 + mx * 30, 0, Math.PI * 2); bc.fill();
    }
    draw();
  })();


  /* ═══════════════════════════════════════════════════════════════
     ★ DRAGGABLE GALLERY
     ═══════════════════════════════════════════════════════════════ */
  (() => {
    const sc = document.getElementById('galleryScroll'), tr = document.getElementById('galleryTrack');
    if (!sc || !tr) return;
    let gd = false, gsX = 0, gsL = 0, gV = 0, glX = 0, glT = 0, gDD = 0, gRaf;
    function ggx(e) { return e.touches ? e.touches[0].clientX : e.clientX; }
    function curTX() { return parseFloat(tr.style.transform?.replace('translateX(', '').replace('px)', '') || '0'); }
    function gStart(e) { gd = true; gsX = ggx(e); gsL = curTX(); gV = 0; glX = gsX; glT = Date.now(); gDD = 0; cancelAnimationFrame(gRaf); tr.style.transition = 'none'; }
    function gMove(e) {
      if (!gd) return; const x = ggx(e), dx = x - gsX;
      gDD += Math.abs(x - glX); const dt = Date.now() - glT; if (dt > 0) gV = (x - glX) / dt * 16;
      glX = x; glT = Date.now();
      const mS = -(tr.scrollWidth - sc.offsetWidth);
      tr.style.transform = `translateX(${Math.max(mS - 40, Math.min(40, gsL + dx))}px)`;
    }
    function gEnd() {
      if (!gd) return; gd = false; let v = gV;
      (function m() { if (Math.abs(v) < .3) return; let c = curTX() + v; const mS = -(tr.scrollWidth - sc.offsetWidth);
        if (c > 0) { c = 0; v = 0; } if (c < mS) { c = mS; v = 0; }
        tr.style.transform = `translateX(${c}px)`; v *= .94; gRaf = requestAnimationFrame(m);
      })();
    }
    sc.addEventListener('mousedown', gStart); sc.addEventListener('touchstart', gStart, { passive: true });
    addEventListener('mousemove', gMove); addEventListener('touchmove', gMove, { passive: true });
    addEventListener('mouseup', gEnd); addEventListener('touchend', gEnd);
    sc.querySelectorAll('.gallery-item').forEach(item => { item.addEventListener('click', e => { if (gDD > 10) e.stopPropagation(); }, true); });
  })();


  /* ═══════════════ TESTIMONIALS — Draggable Stack ═══════════════ */
  (() => {
    const slider = document.getElementById('testimonialSlider');
    if (!slider) return;
    const container = slider.querySelector('.tcard-container');
    const cards = Array.from(container.querySelectorAll('.tcard'));
    const resetBtn = document.getElementById('tStackReset');
    const total = cards.length;
    let tossed = [];

    // Measure tallest card and set container height
    let maxH = 320;
    cards.forEach(c => {
      const front = c.querySelector('.tcard-front');
      if (front && front.offsetHeight > maxH) maxH = front.offsetHeight;
    });
    container.style.minHeight = maxH + 'px';

    function topCard() {
      for (let i = 0; i < total; i++) if (!tossed.includes(i)) return { el: cards[i], idx: i };
      return null;
    }

    function layoutStack() {
      const active = cards.filter((_, i) => !tossed.includes(i));
      cards.filter((_, i) => tossed.includes(i)).forEach(c => {
        c.classList.add('tossed');
        c.style.zIndex = '0';
        c.style.opacity = '0';
        c.style.pointerEvents = 'none';
      });
      active.forEach((c, i) => {
        c.classList.remove('tossed');
        c.style.zIndex = String(active.length - i);
        c.style.transform = 'translateY(' + (i * 6) + 'px) rotate(' + ((i % 2 === 0 ? 1 : -1) * i * 0.8) + 'deg) scale(' + (1 - i * 0.02) + ')';
        c.style.opacity = i > 3 ? '0' : String(1 - i * 0.12);
        c.style.pointerEvents = '';
      });
      resetBtn.classList.toggle('visible', tossed.length > 0);
    }

    let dragging = false, dragCard = null, startX = 0, dx = 0;

    container.addEventListener('mousedown', onDown);
    container.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);

    function onDown(e) {
      if (e.target.closest('.tstack-reset')) return;
      const top = topCard();
      if (!top) return;
      dragging = true;
      dragCard = top;
      const ev = e.touches ? e.touches[0] : e;
      startX = ev.clientX;
      dx = 0;
      container.classList.add('dragging');
      dragCard.el.style.transition = 'none';
    }
    function onMove(e) {
      if (!dragging || !dragCard) return;
      const ev = e.touches ? e.touches[0] : e;
      dx = ev.clientX - startX;
      dragCard.el.style.transform = 'translate(' + dx + 'px,' + (Math.abs(dx) * -0.15) + 'px) rotate(' + (dx * 0.06) + 'deg)';
    }
    function onUp() {
      if (!dragging || !dragCard) return;
      dragging = false;
      container.classList.remove('dragging');
      dragCard.el.style.transition = '';
      if (Math.abs(dx) > 100) {
        const dir = dx > 0 ? 1 : -1;
        dragCard.el.style.transition = 'transform .5s var(--ease), opacity .4s';
        dragCard.el.style.transform = 'translate(' + (dir * 900) + 'px,-80px) rotate(' + (dir * 25) + 'deg)';
        dragCard.el.style.opacity = '0';
        const idx = dragCard.idx;
        tossed.push(idx);
        setTimeout(() => { cards[idx].classList.add('tossed'); layoutStack(); }, 500);
      } else {
        layoutStack();
      }
      dragCard = null;
    }

    resetBtn.addEventListener('click', () => {
      tossed = [];
      cards.forEach(c => { c.style.cssText = ''; c.classList.remove('tossed'); });
      container.style.minHeight = maxH + 'px';
      layoutStack();
    });

    layoutStack();
  })();


  /* ═══════════════ SESSION STEPS (interactive accordion) ═══════════════ */
  (() => {
    const steps = document.querySelectorAll('.session-step');
    if (!steps.length) return;

    steps.forEach(step => {
      const header = step.querySelector('.session-step-header');
      if (!header) return;

      header.addEventListener('click', () => {
        const wasActive = step.classList.contains('active');

        // Close all steps
        steps.forEach(s => s.classList.remove('active'));

        // Open clicked step if it wasn't already open
        if (!wasActive) {
          step.classList.add('active');
        }
      });
    });

    // Auto-open first step after a short delay when section comes into view
    const sessionsSection = document.getElementById('sessions');
    if (sessionsSection) {
      let opened = false;
      new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !opened) {
          opened = true;
          setTimeout(() => {
            if (!document.querySelector('.session-step.active')) {
              steps[0].classList.add('active');
            }
          }, 600);
        }
      }, { threshold: 0.3 }).observe(sessionsSection);
    }
  })();

  /* ═══════════════ FAQ ═══════════════ */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => { const i = q.parentElement, w = i.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(x => x.classList.remove('open')); if (!w) i.classList.add('open'); });
  });

  /* ═══════════════ FAQ VOTES ═══════════════ */
  document.querySelectorAll('.faq-vote').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.faq-helpful');
      parent.querySelectorAll('.faq-vote').forEach(b => { b.classList.remove('voted', 'voted-no'); });
      if (btn.dataset.vote === 'yes') {
        btn.classList.add('voted');
      } else {
        btn.classList.add('voted-no');
      }
    });
  });


  /* ═══════════════ LIGHTBOX ═══════════════ */
  const lb = document.getElementById('lightbox'), lbi = document.getElementById('lbImg');
  window.openLightbox = el => { const img = el.querySelector('img'); if (img) { lbi.src = img.src; lb.classList.add('active'); document.body.style.overflow = 'hidden'; } };
  window.closeLightbox = () => { lb.classList.remove('active'); document.body.style.overflow = ''; };
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });


  /* ═══════════════ WORKSHOP PILL POPUPS ═══════════════ */
  (() => {
    const popup = document.getElementById('workshopPopup');
    const popupText = document.getElementById('workshopPopupText');
    if (!popup || !popupText) return;

    document.querySelectorAll('.workshop-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const info = pill.dataset.workshopInfo;
        const wasActive = pill.classList.contains('active');

        document.querySelectorAll('.workshop-pill').forEach(p => p.classList.remove('active'));

        if (wasActive) {
          popup.classList.remove('visible');
        } else {
          pill.classList.add('active');
          popupText.textContent = info;
          popup.classList.add('visible');
        }
      });
    });
  })();


  /* ═══════════════ BENEFIT CARD INTERACTIONS ═══════════════ */

  // Grow canvas — proper animated tree that grows with each click
  (() => {
    const canvas = document.getElementById('growCanvas');
    if (!canvas) return;
    const gc = canvas.getContext('2d');
    let growState = 0; // 0=seed, 1=sprout, 2=sapling, 3=tree, 4=bloom
    let animT = 0, targetT = 0;
    let W, H, dpr;

    function sizeCanvas() {
      dpr = devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      gc.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawGrowth();
    }
    sizeCanvas();
    addEventListener('resize', () => { sizeCanvas(); });

    function drawGrowth() {
      if (!W || !H) return;
      gc.clearRect(0, 0, W, H);
      const cx = W / 2, base = H - 5;
      const t = animT;
      const scale = Math.min(W / 200, H / 70);

      // Ground
      gc.beginPath();
      gc.moveTo(0, base);
      gc.lineTo(W, base);
      gc.strokeStyle = '#7a9e6a';
      gc.lineWidth = 2;
      gc.stroke();

      if (t <= 0) {
        gc.beginPath();
        gc.ellipse(cx, base - 4, 4 * scale, 5 * scale, 0, 0, Math.PI * 2);
        gc.fillStyle = '#8B6914';
        gc.fill();
        return;
      }

      const trunkH = Math.min(t, 1) * 35 * scale;
      gc.beginPath();
      gc.moveTo(cx, base);
      gc.lineTo(cx, base - trunkH);
      gc.strokeStyle = '#6b5c3a';
      gc.lineWidth = (2 + Math.min(t, 3) * 0.5) * scale;
      gc.lineCap = 'round';
      gc.stroke();

      if (t > 0.5) {
        const bLen = Math.min((t - 0.5) / 0.5, 1) * 18 * scale;
        gc.beginPath();
        gc.moveTo(cx, base - trunkH * 0.6);
        gc.lineTo(cx - bLen, base - trunkH * 0.6 - bLen * 0.6);
        gc.strokeStyle = '#6b5c3a';
        gc.lineWidth = 1.5 * scale;
        gc.stroke();
        gc.beginPath();
        gc.moveTo(cx, base - trunkH * 0.75);
        gc.lineTo(cx + bLen * 0.8, base - trunkH * 0.75 - bLen * 0.5);
        gc.stroke();
      }

      if (t > 1) {
        const leafS = Math.min((t - 1) / 1, 1);
        const leafR = (8 + leafS * 10) * scale;
        gc.beginPath();
        gc.arc(cx - 14 * scale, base - trunkH * 0.6 - 12 * scale, leafR, 0, Math.PI * 2);
        gc.fillStyle = 'rgba(107,143,113,' + (0.3 + leafS * 0.3) + ')';
        gc.fill();
        gc.beginPath();
        gc.arc(cx + 10 * scale, base - trunkH * 0.75 - 10 * scale, leafR * 0.8, 0, Math.PI * 2);
        gc.fill();
        gc.beginPath();
        gc.arc(cx, base - trunkH - 5 * scale, leafR * 1.1, 0, Math.PI * 2);
        gc.fillStyle = 'rgba(163,196,160,' + (0.3 + leafS * 0.4) + ')';
        gc.fill();
      }

      if (t > 2) {
        const fS = Math.min((t - 2) / 1, 1);
        const spots = [
          [cx - 18 * scale, base - trunkH * 0.5 - 16 * scale, '#c67b5c'],
          [cx + 14 * scale, base - trunkH * 0.7 - 14 * scale, '#d4a0a0'],
          [cx - 4 * scale, base - trunkH - 12 * scale, '#c9a96e'],
          [cx + 6 * scale, base - trunkH - 2 * scale, '#9b7a9e'],
          [cx - 10 * scale, base - trunkH - 6 * scale, '#c67b5c'],
        ];
        spots.forEach(([x, y, col]) => {
          gc.beginPath();
          gc.arc(x, y, 2.5 * fS * scale, 0, Math.PI * 2);
          gc.fillStyle = col;
          gc.globalAlpha = fS;
          gc.fill();
        });
        gc.globalAlpha = 1;
      }

      if (t > 3) {
        const sT = Date.now() * 0.003;
        for (let i = 0; i < 5; i++) {
          const sx = cx + Math.cos(sT + i * 1.3) * (20 + i * 5) * scale;
          const sy = base - trunkH * 0.5 + Math.sin(sT + i * 1.7) * 15 * scale - 10 * scale;
          gc.beginPath();
          gc.arc(sx, sy, 1.5 * scale, 0, Math.PI * 2);
          gc.fillStyle = 'rgba(201,169,110,' + (0.3 + 0.3 * Math.sin(sT * 2 + i)) + ')';
          gc.fill();
        }
      }
    }

    function animate() {
      animT += (targetT - animT) * 0.04;
      drawGrowth();
      if (targetT > 3) requestAnimationFrame(animate);
      else if (Math.abs(animT - targetT) > 0.01) requestAnimationFrame(animate);
    }

    canvas.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      growState++;
      if (growState > 4) growState = 0;
      targetT = growState;
      if (growState === 0) animT = 0;
      requestAnimationFrame(animate);
    });

    drawGrowth();
  })();

  // Affirmation word reveal
  const affirmations = [
    'I am worthy of healing',
    'My feelings are valid',
    'I choose to grow',
    'I embrace my journey',
    'I am enough',
    'Creativity lives in me',
    'I am brave and resilient',
    'My art tells my truth'
  ];
  const wordReveal = document.getElementById('wordReveal');
  if (wordReveal) {
    let affIdx = 0;
    wordReveal.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const span = wordReveal.querySelector('.word-hidden');
      span.style.opacity = '0';
      setTimeout(() => {
        span.textContent = affirmations[affIdx % affirmations.length];
        span.style.opacity = '1';
        affIdx++;
      }, 200);
    });
  }

  // Heart heal — click to send ripple and heal
  const heartHeal = document.getElementById('heartHeal');
  if (heartHeal) {
    heartHeal.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      heartHeal.classList.toggle('healed');
      // Create ripple
      const ripple = document.createElement('div');
      ripple.className = 'heal-ripple';
      ripple.style.left = '50%';
      ripple.style.top = '50%';
      ripple.style.transform = 'translate(-50%, -50%)';
      heartHeal.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1000);
    });
  }

  // Self-awareness mirror canvas
  document.querySelectorAll('.benefit-mirror-canvas').forEach(canvas => {
    const mc = canvas.getContext('2d');
    const card = canvas.closest('.benefit-card');
    if (!card) return;
    let cW, cH;

    function sizeMirror() {
      const dpr = devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      cW = rect.width; cH = rect.height;
      canvas.width = cW * dpr; canvas.height = cH * dpr;
      mc.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    sizeMirror();
    addEventListener('resize', sizeMirror);

    card.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;

      mc.fillStyle = 'rgba(250,245,239,0.15)';
      mc.fillRect(0, 0, cW, cH);

      const cols = ['#a3c4a0', '#c67b5c', '#9b7a9e', '#d4a0a0'];
      for (let i = 0; i < 4; i++) {
        mc.beginPath();
        mc.arc(x * cW, y * cH, 5 + i * 6, 0, Math.PI * 2);
        mc.strokeStyle = cols[i];
        mc.globalAlpha = 0.3;
        mc.lineWidth = 1;
        mc.stroke();

        mc.beginPath();
        mc.arc((1 - x) * cW, (1 - y) * cH, 5 + i * 6, 0, Math.PI * 2);
        mc.stroke();
      }
      mc.globalAlpha = 1;
    });
  });


  /* ═══════════════ COPY TO CLIPBOARD ═══════════════ */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        const span = btn.querySelector('span');
        const orig = span.textContent;
        span.textContent = 'Copied!';
        setTimeout(() => {
          btn.classList.remove('copied');
          span.textContent = orig;
        }, 2000);
      });
    });
  });


  /* ═══════════════ BENEFIT CARDS (radial highlight, no 3D tilt) ═══════════════ */
  document.querySelectorAll('.benefit-card').forEach(c => {
    c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%'); c.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%'); });
  });

  /* ═══════════════ MAGNETIC ═══════════════ */
  if (matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .25}px)`; });
      b.addEventListener('mouseleave', () => { b.style.transform = ''; });
    });
  }

  /* ═══════════════ CREDENTIAL RIPPLE ═══════════════ */
  document.querySelectorAll('.credential').forEach(c => {
    c.addEventListener('click', function (e) {
      const r = document.createElement('span');
      r.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,.2);pointer-events:none;transform:scale(0);animation:ripple .6s ease-out forwards;width:100px;height:100px;left:${e.offsetX - 50}px;top:${e.offsetY - 50}px`;
      this.style.position = 'relative'; this.style.overflow = 'hidden'; this.appendChild(r); setTimeout(() => r.remove(), 600);
    });
  });
  const sty = document.createElement('style'); sty.textContent = '@keyframes ripple{to{transform:scale(3);opacity:0}}'; document.head.appendChild(sty);

})();
