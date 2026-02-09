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
  if (dot && ring && matchMedia('(pointer:fine)').matches && !('ontouchstart' in window) && navigator.maxTouchPoints === 0) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = (mx-4)+'px'; dot.style.top = (my-4)+'px'; });
    (function cl() { rx+=(mx-rx)*.1; ry+=(my-ry)*.1; ring.style.left=(rx-22)+'px'; ring.style.top=(ry-22)+'px'; requestAnimationFrame(cl); })();
    const sel = 'a,button,.faq-q,.gallery-item,.benefit-card,.workshop-pill,.credential,.btt,.paint-color,.paint-clear,.tcard,.copy-btn,.tl-item,.pw-node,.pw-pointer';
    document.addEventListener('mouseover', e => { if(e.target.closest(sel)){dot.classList.add('hovering');ring.classList.add('hovering');} });
    document.addEventListener('mouseout', e => { if(e.target.closest(sel)){dot.classList.remove('hovering');ring.classList.remove('hovering');} });
  }

  /* ─── BG CANVAS (organic watercolor blobs) ─── */
  const bgC = document.getElementById('bgCanvas');
  if (bgC) {
    const bc = bgC.getContext('2d'), pts = [];
    const cols = [
      ['rgba(163,196,160,.22)','rgba(163,196,160,.03)'],
      ['rgba(198,123,92,.18)','rgba(198,123,92,.03)'],
      ['rgba(155,122,158,.16)','rgba(155,122,158,.03)'],
      ['rgba(212,160,160,.20)','rgba(212,160,160,.03)'],
      ['rgba(163,196,160,.18)','rgba(163,196,160,.03)'],
      ['rgba(198,123,92,.16)','rgba(198,123,92,.03)'],
      ['rgba(155,122,158,.14)','rgba(155,122,158,.03)'],
      ['rgba(212,160,160,.18)','rgba(212,160,160,.03)']
    ];
    function rz() { bgC.width=innerWidth; bgC.height=innerHeight; }
    rz(); addEventListener('resize', rz);

    // Generate organic blob control points for each particle
    function makeBlob(nPts) {
      const angles = [];
      for (let i = 0; i < nPts; i++) angles.push((i / nPts) * Math.PI * 2);
      // Random radii per control point for organic shape
      const radii = angles.map(() => 0.7 + Math.random() * 0.6);
      return { angles, radii };
    }

    for (let i = 0; i < 8; i++) {
      pts.push({
        x: Math.random() * bgC.width,
        y: Math.random() * bgC.height,
        r: Math.random() * 120 + 80,
        c: cols[i % cols.length],
        vx: (Math.random() - .5) * .15,
        vy: (Math.random() - .5) * .15,
        blob: makeBlob(6 + Math.floor(Math.random() * 4)),
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - .5) * .003
      });
    }

    let cv = true;
    new IntersectionObserver(e => { cv = e[0].isIntersecting; }, { threshold: 0 }).observe(document.querySelector('.hero'));
    let tk = 0;

    function drawBlob(p) {
      const { angles, radii } = p.blob;
      const n = angles.length;
      const points = [];
      for (let i = 0; i < n; i++) {
        const a = angles[i] + p.rot;
        const r = p.r * radii[i];
        points.push({ x: p.x + Math.cos(a) * r, y: p.y + Math.sin(a) * r });
      }
      // Smooth closed curve through points using quadratic bezier
      bc.beginPath();
      const first = points[0], last = points[n - 1];
      bc.moveTo((last.x + first.x) / 2, (last.y + first.y) / 2);
      for (let i = 0; i < n; i++) {
        const curr = points[i];
        const next = points[(i + 1) % n];
        bc.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) / 2, (curr.y + next.y) / 2);
      }
      bc.closePath();

      // Gradient fill
      const g = bc.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 1.1);
      g.addColorStop(0, p.c[0]);
      g.addColorStop(0.6, p.c[0]);
      g.addColorStop(1, p.c[1]);
      bc.fillStyle = g;
      bc.fill();
    }

    (function d() {
      requestAnimationFrame(d);
      if (!cv) return;
      if (++tk % 2) return;
      bc.clearRect(0, 0, bgC.width, bgC.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
        if (p.x < -p.r) p.x = bgC.width + p.r;
        if (p.x > bgC.width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = bgC.height + p.r;
        if (p.y > bgC.height + p.r) p.y = -p.r;
        drawBlob(p);
      });
    })();
  }

  /* ─── STATIC ACRYLIC SPLAT OVERLAY ─── */
  const splatC = document.getElementById('splatCanvas');
  if (splatC) {
    const sc = splatC.getContext('2d');
    const dpr = devicePixelRatio || 1;

    // Splat palette: dark forest greens + a few warm accents — MUCH more visible
    const splatPalette = [
      { color: 'rgba(25,55,35,1)', alpha: 0.28 },    // deep forest green
      { color: 'rgba(35,70,45,1)', alpha: 0.24 },    // dark green
      { color: 'rgba(45,80,50,1)', alpha: 0.20 },    // medium forest
      { color: 'rgba(107,143,113,1)', alpha: 0.18 }, // sage accent
      { color: 'rgba(155,122,158,1)', alpha: 0.16 }, // plum accent
      { color: 'rgba(198,123,92,1)', alpha: 0.16 },  // terra accent
    ];

    // Store splat definitions with NORMALIZED coordinates (0-1 range)
    // so they reposition correctly on resize
    const pageH = document.documentElement.scrollHeight;
    const splatCount = Math.floor(pageH / 400) * 3 + 4;
    const splatDefs = [];

    // Use a seeded random so splats stay consistent across redraws
    let seed = 42;
    function seededRandom() {
      seed = (seed * 16807 + 0) % 2147483647;
      return (seed - 1) / 2147483646;
    }

    for (let i = 0; i < splatCount; i++) {
      splatDefs.push({
        nx: seededRandom(),                          // normalized X (0-1)
        ny: seededRandom(),                          // normalized Y (0-1)
        size: 50 + seededRandom() * 120,             // slightly bigger splats
        paletteIdx: i % splatPalette.length,
        // Pre-generate the organic shape offsets so shape is consistent
        nPts: 8 + Math.floor(seededRandom() * 6),
        angles: [],
        radii: [],
        satellites: [],
      });
      const def = splatDefs[i];
      for (let j = 0; j < def.nPts; j++) {
        def.radii.push(0.5 + seededRandom() * 0.7);
      }
      const satCount = 3 + Math.floor(seededRandom() * 4);
      for (let j = 0; j < satCount; j++) {
        def.satellites.push({
          angle: seededRandom() * Math.PI * 2,
          dist: 1.0 + seededRandom() * 0.8,
          r: 2 + seededRandom() * 5,
          alphaScale: 0.4 + seededRandom() * 0.4,
        });
      }
    }

    // Draw a single splat at absolute coordinates
    function drawSplat(x, y, size, color, alpha, def) {
      const points = [];
      for (let i = 0; i < def.nPts; i++) {
        const a = (i / def.nPts) * Math.PI * 2;
        const r = size * def.radii[i];
        points.push({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r });
      }

      sc.save();
      sc.globalAlpha = alpha;
      sc.beginPath();
      const last = points[def.nPts - 1], first = points[0];
      sc.moveTo((last.x + first.x) / 2, (last.y + first.y) / 2);
      for (let i = 0; i < def.nPts; i++) {
        const curr = points[i];
        const next = points[(i + 1) % def.nPts];
        sc.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) / 2, (curr.y + next.y) / 2);
      }
      sc.closePath();

      const g = sc.createRadialGradient(x, y, 0, x, y, size * 0.9);
      g.addColorStop(0, color);
      g.addColorStop(0.7, color);
      g.addColorStop(1, 'transparent');
      sc.fillStyle = g;
      sc.fill();

      // Satellite droplets
      for (const sat of def.satellites) {
        const dx = x + Math.cos(sat.angle) * size * sat.dist;
        const dy = y + Math.sin(sat.angle) * size * sat.dist;
        sc.beginPath();
        sc.arc(dx, dy, sat.r, 0, Math.PI * 2);
        sc.globalAlpha = alpha * sat.alphaScale;
        sc.fillStyle = color;
        sc.fill();
      }
      sc.restore();
    }

    // Render all splats at current viewport dimensions
    function renderSplats() {
      const W = innerWidth;
      const H = document.documentElement.scrollHeight;
      splatC.width = W * dpr;
      splatC.height = H * dpr;
      splatC.style.width = W + 'px';
      splatC.style.height = H + 'px';
      sc.setTransform(dpr, 0, 0, dpr, 0, 0);
      sc.clearRect(0, 0, W, H);

      for (const def of splatDefs) {
        const p = splatPalette[def.paletteIdx];
        drawSplat(def.nx * W, def.ny * H, def.size, p.color, p.alpha, def);
      }
    }

    renderSplats();

    // Re-render on resize so splats redistribute across the full width
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderSplats, 150);
    });
  }

  /* ─── VANTA.JS BIRDS HERO BACKGROUND ─── */
  if (typeof VANTA !== 'undefined' && VANTA.BIRDS) {
    try {
      const vw = window.innerWidth;
      // Smooth lerp: scales linearly from small screens (400px) to large (1200px)
      const t = Math.min(1, Math.max(0, (vw - 400) / 800)); // 0 at 400px, 1 at 1200px+
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
        color1: 0x6B3FA0,
        color2: 0xA0334D,
        colorMode: 'lerp',
        birdSize: 2.5 - t * 1.3,         // 2.5 → 1.2
        wingSpan: 50.0 - t * 25.0,        // 50 → 25
        speedLimit: 1.0 + t * 3.0,        // 1 → 4
        separation: 30.0,
        alignment: 30.0,
        cohesion: 25.0,
        quantity: t < 0.5 ? 2.0 : 3.0
      });
    } catch(e) { /* Vanta may fail silently */ }
  }

  /* ─── SCROLL PROGRESS ─── */
  const pb = document.querySelector('.scroll-progress');
  function up(){const h=document.documentElement.scrollHeight-innerHeight;pb.style.width=(h>0?(scrollY/h)*100:0)+'%';}

  /* ─── NAV + BTT ─── */
  const nav=document.getElementById('mainNav'),btt=document.querySelector('.btt');
  const navTherapist=nav.querySelector('.nav-therapist');
  const therapistImg=navTherapist?navTherapist.querySelector('img'):null;

  // Therapist photo: large at top-right, shrinks into nav pill on scroll (wide only)
  const navRect=()=>nav.getBoundingClientRect();
  function updateTherapistSize(){
    if(!therapistImg||!navTherapist) return;
    const wide=window.innerWidth>1260;
    if(!wide){
      therapistImg.style.cssText='';
      navTherapist.style.cssText='';
      navTherapist.classList.remove('therapist-hero');
      return;
    }
    const trigger=80;
    const t=Math.min(1,scrollY/trigger); // 0=top, 1=scrolled
    // Scale max size by viewport: 260px at 1600+, down to 90px at 1260px
    const vw=window.innerWidth;
    const maxSize=Math.round(90+Math.min(1,(vw-1260)/340)*170); // 90→260
    const size=Math.round(maxSize-t*(maxSize-34)); // maxSize → 34px

    if(t<1){
      navTherapist.classList.add('therapist-hero');
      // Get the pill's resting position for the endpoint
      const nr=navRect();
      const endRight=16;
      const endTop=Math.round((nr.height-34)/2);
      // Large: top-right of viewport, outside nav flow
      const startRight=16;
      const startTop=16;
      const right=startRight+t*(endRight-startRight);
      const top=startTop+t*(endTop-startTop);
      therapistImg.style.cssText='width:'+size+'px;height:'+size+'px;position:fixed;top:'+top+'px;right:'+right+'px;z-index:9001;border-radius:50%;object-fit:cover;border:3px solid var(--sage-light);box-shadow:0 4px 20px rgba(0,0,0,.1);';
      // Hide the nav button container so it doesn't take space
      navTherapist.style.cssText='width:0;height:0;padding:0;border:none;background:none;backdrop-filter:none;overflow:hidden;margin:0;';
    } else {
      navTherapist.classList.remove('therapist-hero');
      therapistImg.style.cssText='';
      navTherapist.style.cssText='';
    }
  }
  updateTherapistSize();
  addEventListener('resize',updateTherapistSize);

  addEventListener('scroll',()=>{
    nav.classList.toggle('scrolled',scrollY>60);
    btt.classList.toggle('show',scrollY>600);
    updateTherapistSize();
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
     ★ WATERCOLOR — Ink drops on hover + splatter on click (Mission)
     ═══════════════════════════════════════════════════════════════ */
  (() => {
    const canvas = document.getElementById('bloomCanvas');
    if (!canvas) return;
    const bc = canvas.getContext('2d');
    let W, H, vis = false, tick = 0;
    const MAX_DROPS = 25, MAX_SPLATS = 6;
    const PAL = [
      {r:107,g:63,b:160},  {r:160,g:51,b:77},
      {r:155,g:122,b:158}, {r:212,g:160,b:160}, {r:163,g:196,b:160}
    ];
    function rgba(c,a){return 'rgba('+c.r+','+c.g+','+c.b+','+a+')';}
    function pick(){return PAL[Math.floor(Math.random()*PAL.length)];}

    function rz(){
      const r=canvas.parentElement.getBoundingClientRect(), d=devicePixelRatio||1;
      canvas.width=r.width*d; canvas.height=r.height*d;
      W=r.width; H=r.height; bc.setTransform(d,0,0,d,0,0);
    }
    rz(); addEventListener('resize',rz);
    new IntersectionObserver(e=>{vis=e[0].isIntersecting;},{threshold:0.05}).observe(canvas);

    /* — shared organic blob path — */
    function blobPath(cx,cy,r,offsets){
      const n=offsets.length;
      bc.beginPath();
      for(let j=0;j<=n;j++){
        const a=(j/n)*Math.PI*2;
        const off=offsets[j%n];
        const px=cx+Math.cos(a)*r*off, py=cy+Math.sin(a)*r*off;
        if(j===0){bc.moveTo(px,py);}
        else{
          const pa=((j-0.5)/n)*Math.PI*2;
          const co=(offsets[j%n]+offsets[(j-1+n)%n])*0.5;
          bc.quadraticCurveTo(cx+Math.cos(pa)*r*co, cy+Math.sin(pa)*r*co, px, py);
        }
      }
      bc.closePath();
    }

    /* — ink drops (hover) — */
    const drops=[];
    let lastX=-1, lastY=-1;
    const DROP_FADE=0.006; // ~2.5s fade

    const mEl=document.getElementById('mission');
    mEl.addEventListener('mousemove',e=>{
      const r=mEl.getBoundingClientRect();
      const x=e.clientX-r.left, y=e.clientY-r.top;
      const dx=x-lastX, dy=y-lastY;
      if(Math.sqrt(dx*dx+dy*dy)>50||lastX<0){
        if(drops.length>=MAX_DROPS) drops.shift();
        drops.push({x,y,c:pick(),maxR:30+Math.random()*50,life:1,
          speed:0.3+Math.random()*0.3,
          offsets:Array.from({length:6},()=>0.7+Math.random()*0.6)});
        lastX=x; lastY=y;
      }
    });
    mEl.addEventListener('mouseleave',()=>{lastX=-1;lastY=-1;});

    /* — splatters (click) — ~6s fade — */
    const splatters=[];
    const SPLAT_FADE=1/(6*30); // ~6s at 30fps (we skip frames)

    canvas.addEventListener('click',e=>{
      const r=canvas.getBoundingClientRect();
      const x=e.clientX-r.left, y=e.clientY-r.top;
      const c=pick();
      const blobs=[];
      // central blob
      blobs.push({x,y,r:30+Math.random()*35,
        offsets:Array.from({length:6},()=>0.6+Math.random()*0.8),drip:null});
      // satellite droplets — fewer for perf
      const count=5+Math.floor(Math.random()*5);
      for(let i=0;i<count;i++){
        const a=Math.random()*Math.PI*2, dist=35+Math.random()*90;
        blobs.push({
          x:x+Math.cos(a)*dist, y:y+Math.sin(a)*dist,
          r:5+Math.random()*14,
          offsets:Array.from({length:5},()=>0.6+Math.random()*0.8),
          drip:Math.random()>0.5?{len:12+Math.random()*35,
            angle:Math.PI/2+Math.random()*0.4-0.2}:null
        });
      }
      if(splatters.length>=MAX_SPLATS) splatters.shift();
      splatters.push({blobs,color:c,life:1});
    });

    /* — draw loop (throttled to ~30fps) — */
    function draw(){
      requestAnimationFrame(draw);
      if(!vis) return;
      if(++tick%2) return; // skip every other frame → 30fps
      bc.clearRect(0,0,W,H);

      /* draw ink drops — single fill pass, no blur filter */
      for(let i=drops.length-1;i>=0;i--){
        const d=drops[i];
        d.life-=DROP_FADE*d.speed;
        if(d.life<=0){drops.splice(i,1);continue;}
        const expand=1+(1-d.life)*1.2;
        const cr=d.maxR*expand;

        bc.save();
        bc.globalAlpha=d.life*0.35;
        blobPath(d.x,d.y,cr,d.offsets);
        bc.fillStyle=rgba(d.c,0.7);
        bc.fill();
        // lighter halo — just a bigger fill, no blur filter
        bc.globalAlpha=d.life*0.15;
        blobPath(d.x,d.y,cr*1.4,d.offsets);
        bc.fillStyle=rgba(d.c,0.3);
        bc.fill();
        bc.restore();
      }

      /* draw splatters — single pass, no blur filter */
      for(let i=splatters.length-1;i>=0;i--){
        const s=splatters[i];
        s.life-=SPLAT_FADE;
        if(s.life<=0){splatters.splice(i,1);continue;}

        bc.save();
        for(const b of s.blobs){
          bc.globalAlpha=s.life*0.5;
          blobPath(b.x,b.y,b.r,b.offsets);
          bc.fillStyle=rgba(s.color,0.7);
          bc.fill();
          // halo
          bc.globalAlpha=s.life*0.2;
          blobPath(b.x,b.y,b.r*1.3,b.offsets);
          bc.fillStyle=rgba(s.color,0.3);
          bc.fill();
          // drip
          if(b.drip){
            const ex=b.x+Math.cos(b.drip.angle)*b.drip.len;
            const ey=b.y+Math.sin(b.drip.angle)*b.drip.len;
            bc.beginPath();
            bc.moveTo(b.x-3,b.y);
            bc.quadraticCurveTo(b.x,b.y+b.drip.len*0.5,ex,ey);
            bc.quadraticCurveTo(b.x,b.y+b.drip.len*0.5,b.x+3,b.y);
            bc.fillStyle=rgba(s.color,0.5);
            bc.globalAlpha=s.life*0.35;
            bc.fill();
          }
        }
        bc.restore();
      }
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


  /* ═══════════════ PROCESS WHEEL (orbital W2 with draggable pointer) ═══════════════ */
  (() => {
    const wrap = document.getElementById('processWheel');
    if (!wrap) return;

    const STEPS = [
      { title:'Initial Assessment', short:'Assess', sub:'Understanding your unique needs', ic:1, clr:1,
        desc:'Meet with an experienced art therapist to discuss your goals, concerns, and what you hope to achieve. Every journey begins with understanding — we take the time to listen, learn about your history, and create a personalized path forward.',
        tags:['45\u201360 minutes','Safe & confidential','One-on-one setting'] },
      { title:'Artistic Exploration', short:'Create', sub:'Creating without judgment', ic:2, clr:2,
        desc:'Engage in creative activities — painting, drawing, sculpture, or collage. No artistic skill required; the focus is entirely on the process, not the product.',
        tags:['Multiple art mediums','No skill required','Process over product'] },
      { title:'Reflect & Share', short:'Reflect', sub:'Finding meaning in your creation', ic:3, clr:3,
        desc:'Discuss your creation with your therapist in a supportive, non-judgmental environment. Together, explore the themes, emotions, and symbols that emerge from your artwork.',
        tags:['Guided dialogue','Deep self-reflection','Non-judgmental space'] },
      { title:'Coping Strategies', short:'Cope', sub:'Building your emotional toolkit', ic:4, clr:4,
        desc:'Learn techniques to manage stress, anxiety, and emotional challenges that you can apply in everyday life. Art-based coping strategies become tools you carry with you.',
        tags:['Practical techniques','Take-home exercises','Everyday application'] },
      { title:'Progress & Growth', short:'Grow', sub:'Witnessing your transformation', ic:5, clr:5,
        desc:'Notice positive changes in your well-being, self-awareness, and personal growth. The creative process reveals patterns of transformation over time.',
        tags:['Measurable progress','Lasting empowerment','Ongoing support'] }
    ];

    const ICONS = [
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688"/><circle cx="7.5" cy="10" r="1.5" fill="currentColor"/><circle cx="12" cy="7" r="1.5" fill="currentColor"/><circle cx="16.5" cy="10" r="1.5" fill="currentColor"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>'
    ];

    const BADGE_COLORS = ['#9b7a9e','#c67b5c','#d4a0a0','#a3c4a0','#c9a96e'];
    const N = STEPS.length;

    const wheelEl = wrap.querySelector('.pw-wheel');
    const detailEl = document.getElementById('pwDetail');
    const pointer = document.getElementById('pwPointer');
    const dragLabel = document.getElementById('pwDragLabel');
    const hubIcon = wrap.querySelector('.pw-hub-icon');
    const hubTitle = wrap.querySelector('.pw-hub-title');
    const hubStep = wrap.querySelector('.pw-hub-step');
    const GRIP_W = 48, GRIP_H = 26; // pill dimensions
    const gripBody = document.querySelector('.pw-grip-body');
    const gripNotch = document.querySelector('.pw-grip-notch');
    // Node colors: plum, terra, rose, sage, gold — matching pw-c1..c5
    const NODE_COLORS = [
      ['#9b7a9e','#c3a5c6','rgba(155,122,158,.45)'],
      ['#c67b5c','#e8a889','rgba(198,123,92,.45)'],
      ['#d4a0a0','#e8c4c4','rgba(212,160,160,.45)'],
      ['#a3c4a0','#c5dfc3','rgba(163,196,160,.45)'],
      ['#c9a96e','#dfc99a','rgba(201,169,110,.45)']
    ];

    // Responsive radius
    function getWheelSize() {
      const w = wheelEl.offsetWidth;
      return { radius: w * 0.435, nodeSize: w <= 260 ? 32 : (w <= 300 ? 38 : 46), svgSize: w + 6, center: w / 2 };
    }

    // Build nodes
    const nodeEls = [];
    STEPS.forEach((s, i) => {
      const node = document.createElement('div');
      node.className = 'pw-node pw-c' + s.clr + (i === 0 ? ' active' : '');
      node.innerHTML = ICONS[i] + '<div class="pw-pulse"></div><span class="pw-node-label">' + s.short + '</span>';
      node.addEventListener('click', () => { if (!dragJustEnded) goTo(i); });
      wheelEl.appendChild(node);
      nodeEls.push(node);
    });

    // Build panels
    STEPS.forEach((s, i) => {
      const panel = document.createElement('div');
      panel.className = 'pw-panel pw-c' + s.clr + (i === 0 ? ' active' : '');
      panel.innerHTML =
        '<div class="pw-badge" style="background:' + BADGE_COLORS[i] + '">Step 0' + (i+1) + '</div>' +
        '<h3>' + s.title + '</h3>' +
        '<span class="pw-sub">' + s.sub + '</span>' +
        '<p>' + s.desc + '</p>' +
        '<div class="pw-tags">' + s.tags.map(t => '<span>' + t + '</span>').join('') + '</div>';
      detailEl.appendChild(panel);
    });

    const panels = detailEl.querySelectorAll('.pw-panel');

    // Position nodes around the orbit
    function layoutNodes() {
      const { radius, nodeSize, center } = getWheelSize();
      STEPS.forEach((s, i) => {
        const angle = -Math.PI / 2 + (i / N) * Math.PI * 2;
        const nx = center + Math.cos(angle) * radius - nodeSize / 2;
        const ny = center + Math.sin(angle) * radius - nodeSize / 2;
        nodeEls[i].style.left = nx + 'px';
        nodeEls[i].style.top = ny + 'px';
        nodeEls[i].style.width = nodeSize + 'px';
        nodeEls[i].style.height = nodeSize + 'px';
      });
    }
    layoutNodes();
    addEventListener('resize', () => { layoutNodes(); positionPointer(pointerAngle); });

    // Current state
    let currentIdx = 0;
    // Track total accumulated angle for the pointer (allows going past 2*PI for wrap)
    let pointerAngle = -Math.PI / 2; // start at top (Assess position)
    let targetPointerAngle = -Math.PI / 2;
    let pointerAnimId = null;

    function nodeAngle(idx) {
      return -Math.PI / 2 + (idx / N) * Math.PI * 2;
    }

    function positionPointer(angle) {
      const { radius, center } = getWheelSize();
      const pointerR = radius + 38; // further outside the orbit than before
      const px = center + Math.cos(angle) * pointerR - GRIP_W / 2;
      const py = center + Math.sin(angle) * pointerR - GRIP_H / 2;
      pointer.style.left = px + 'px';
      pointer.style.top = py + 'px';
      // Rotate the pill so the notch points inward
      const deg = (angle * 180 / Math.PI) + 90;
      pointer.style.transform = 'rotate(' + deg + 'deg)';

      // Position the "drag" label further out, always upright
      const labelR = pointerR + GRIP_H / 2 + 14;
      const lx = center + Math.cos(angle) * labelR;
      const ly = center + Math.sin(angle) * labelR;
      dragLabel.style.left = lx + 'px';
      dragLabel.style.top = ly + 'px';
      dragLabel.style.transform = 'translate(-50%,-50%)';
    }

    function animatePointer(from, to, callback) {
      if (pointerAnimId) cancelAnimationFrame(pointerAnimId);
      const duration = 500;
      const start = performance.now();
      const diff = to - from;
      function tick(now) {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / duration);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - t, 3);
        pointerAngle = from + diff * ease;
        positionPointer(pointerAngle);
        if (t < 1) pointerAnimId = requestAnimationFrame(tick);
        else { pointerAnimId = null; if (callback) callback(); }
      }
      pointerAnimId = requestAnimationFrame(tick);
    }

    function goTo(idx) {
      // Cancel any momentum spin in progress
      if (spinAnimId) { cancelAnimationFrame(spinAnimId); spinAnimId = null; velocity = 0; }
      const prevIdx = currentIdx;
      currentIdx = idx;

      // Update nodes
      nodeEls.forEach((nd, j) => {
        nd.classList.remove('active');
        if (j === idx) nd.classList.add('active');
      });
      // Update panels
      panels.forEach((p, j) => p.classList.toggle('active', j === idx));

      // Update hub
      hubIcon.className = 'pw-hub-icon ssi-' + STEPS[idx].ic;
      hubIcon.innerHTML = ICONS[idx];
      hubTitle.textContent = STEPS[idx].title;
      hubStep.textContent = 'Step 0' + (idx + 1);

      // Calculate pointer target angle with shortest-path + wrap-around
      const tgtRaw = nodeAngle(idx);
      let newTarget;

      if (prevIdx === N - 1 && idx === 0) {
        // Wrap-around: Grow → Assess = go FORWARD one step (completes the circle)
        newTarget = pointerAngle + (2 * Math.PI / N);
      } else if (prevIdx === 0 && idx === N - 1) {
        // Reverse wrap: Assess → Grow = go BACKWARD one step
        newTarget = pointerAngle - (2 * Math.PI / N);
      } else {
        // Normal: shortest path from current pointer to target node
        let d = tgtRaw - pointerAngle;
        // Normalize to [-PI, PI]
        d = d - Math.round(d / (2 * Math.PI)) * 2 * Math.PI;
        newTarget = pointerAngle + d;
      }

      animatePointer(pointerAngle, newTarget);
    }

    // ── Draggable pointer ──
    let dragging = false, dragStartAngle = 0;

    function getAngleFromEvent(e) {
      const { center } = getWheelSize();
      const rect = wheelEl.getBoundingClientRect();
      const ev = e.touches ? e.touches[0] : e;
      const x = ev.clientX - rect.left - center;
      const y = ev.clientY - rect.top - center;
      return Math.atan2(y, x);
    }

    function closestNode(angle) {
      // Normalize to 0..2PI
      let a = ((angle + Math.PI / 2) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const segSize = (2 * Math.PI) / N;
      let closest = Math.round(a / segSize) % N;
      if (closest < 0) closest += N;
      return closest;
    }

    // Update node/panel/hub visuals without moving the pointer
    function selectNode(idx) {
      if (idx === currentIdx) return;
      currentIdx = idx;
      nodeEls.forEach((nd, j) => {
        nd.classList.remove('active');
        if (j === idx) nd.classList.add('active');
      });
      panels.forEach((p, j) => p.classList.toggle('active', j === idx));
      hubIcon.className = 'pw-hub-icon ssi-' + STEPS[idx].ic;
      hubIcon.innerHTML = ICONS[idx];
      hubTitle.textContent = STEPS[idx].title;
      hubStep.textContent = 'Step 0' + (idx + 1);

      // Color-match the grip to the active node while dragging
      if (dragging) colorGrip(idx);
    }

    function colorGrip(idx) {
      const c = NODE_COLORS[STEPS[idx].clr - 1];
      gripBody.style.setProperty('--g1', c[0]);
      gripBody.style.setProperty('--g2', c[1]);
      gripBody.style.boxShadow = '0 4px 20px ' + c[2];
      gripNotch.style.borderTopColor = c[0];
    }

    function clearGripColor() {
      gripBody.style.removeProperty('--g1');
      gripBody.style.removeProperty('--g2');
      gripBody.style.boxShadow = '';
      gripNotch.style.borderTopColor = '';
    }

    // ── Momentum / physics ──
    let velocity = 0;           // rad/s
    let spinAnimId = null;
    let dragJustEnded = false;  // suppress node clicks right after drag
    const DECAY = 3.5;          // exponential friction — higher = stops sooner
    const SELECT_VEL = 5.0;     // below this, start updating selected node
    const MAGNET_VEL = 0.6;     // below this, pull toward nearest node
    const MIN_VEL = 0.15;       // fully stop and snap
    // Track recent pointer positions as { angle (cumulative), time }
    const trail = [];
    const TRAIL_WINDOW = 80;    // ms — look back this far for velocity

    pointer.addEventListener('mousedown', startDrag);
    pointer.addEventListener('touchstart', startDrag, { passive: false });

    function startDrag(e) {
      e.preventDefault();
      e.stopPropagation();
      dragging = true;
      pointer.classList.add('dragging');
      if (pointerAnimId) { cancelAnimationFrame(pointerAnimId); pointerAnimId = null; }
      if (spinAnimId) { cancelAnimationFrame(spinAnimId); spinAnimId = null; }
      velocity = 0;
      trail.length = 0;
      const rawStart = getAngleFromEvent(e);
      trail.push({ a: pointerAngle, t: performance.now(), raw: rawStart });
      colorGrip(currentIdx);
    }

    addEventListener('mousemove', onDrag);
    addEventListener('touchmove', onDrag, { passive: false });

    function onDrag(e) {
      if (!dragging) return;
      if (e.cancelable) e.preventDefault();
      const now = performance.now();
      const rawAngle = getAngleFromEvent(e);

      // Compute delta from last raw angle, unwrap
      const lastRaw = trail.length > 0 ? trail[trail.length - 1].raw : rawAngle;
      let dA = rawAngle - lastRaw;
      while (dA > Math.PI) dA -= 2 * Math.PI;
      while (dA < -Math.PI) dA += 2 * Math.PI;

      pointerAngle += dA;
      positionPointer(pointerAngle);
      selectNode(closestNode(pointerAngle));

      trail.push({ a: pointerAngle, t: now, raw: rawAngle });
      // Keep only recent entries
      while (trail.length > 1 && now - trail[0].t > 150) trail.shift();
    }

    addEventListener('mouseup', endDrag);
    addEventListener('touchend', endDrag);

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      dragJustEnded = true;
      setTimeout(() => { dragJustEnded = false; }, 50);
      pointer.classList.remove('dragging');
      clearGripColor();

      // Compute release velocity from the trail
      // Try multiple time windows and pick the fastest — this catches
      // both quick flicks (short window) and sweeping throws (longer window)
      const now = performance.now();
      const latest = trail[trail.length - 1];
      let bestVel = 0;
      const windows = [30, 50, 80, 120];
      for (const win of windows) {
        let sample = trail[0];
        for (let i = trail.length - 1; i >= 0; i--) {
          if (now - trail[i].t >= win) { sample = trail[i]; break; }
        }
        const dt = (latest.t - sample.t) / 1000;
        if (dt > 0.003) {
          const v = (latest.a - sample.a) / dt;
          if (Math.abs(v) > Math.abs(bestVel)) bestVel = v;
        }
      }
      // Only treat as a throw if the release speed exceeds a hard minimum
      const THROW_MIN = 12.0; // rad/s — need a hard flick to trigger momentum
      velocity = Math.abs(bestVel) > THROW_MIN ? bestVel * 2.5 : 0;

      // If barely moving, just snap
      if (Math.abs(velocity) < MIN_VEL) {
        snapToNearest();
        return;
      }

      // Momentum spin
      let lastTime = performance.now();
      function spinTick(now) {
        const dt = (now - lastTime) / 1000;
        lastTime = now;
        if (dt <= 0 || dt > 0.1) { spinAnimId = requestAnimationFrame(spinTick); return; }

        velocity *= Math.exp(-DECAY * dt);

        // Magnetism: when slow enough, pull toward nearest node
        if (Math.abs(velocity) < MAGNET_VEL) {
          const nearest = closestNode(pointerAngle);
          const target = nodeAngle(nearest);
          let diff = target - pointerAngle;
          while (diff > Math.PI) diff -= 2 * Math.PI;
          while (diff < -Math.PI) diff += 2 * Math.PI;
          // Add a pull force toward the node
          velocity += diff * 8 * dt;
        }

        pointerAngle += velocity * dt;
        positionPointer(pointerAngle);

        // Update selected node once slow enough
        if (Math.abs(velocity) < SELECT_VEL) {
          selectNode(closestNode(pointerAngle));
        }

        if (Math.abs(velocity) > MIN_VEL) {
          spinAnimId = requestAnimationFrame(spinTick);
        } else {
          spinAnimId = null;
          snapToNearest();
        }
      }
      spinAnimId = requestAnimationFrame(spinTick);
    }

    function snapToNearest() {
      const snapIdx = closestNode(pointerAngle);
      selectNode(snapIdx);
      const snapAngle = nodeAngle(snapIdx);
      let d = snapAngle - pointerAngle;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      animatePointer(pointerAngle, pointerAngle + d);
    }

    // Initialize
    positionPointer(pointerAngle);
    goTo(0);
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
      gc.strokeStyle = '#a3c4a0';
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
        gc.fillStyle = 'rgba(163,196,160,' + (0.3 + leafS * 0.3) + ')';
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
    /* magnetic effect removed */
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
