(() => {
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('y').textContent = new Date().getFullYear();

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15 });
  document.querySelectorAll('.rv').forEach((el, i) => { el.style.setProperty('--d', (i % 3) * .08 + 's'); io.observe(el); });

  if (!rm && matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--ry', (x - .5) * 10 + 'deg'); c.style.setProperty('--rx', (.5 - y) * 10 + 'deg');
        c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
      });
      c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });

    // Hero depth parallax: one rAF per input event, no idle loop
    const layers = [...document.querySelectorAll('.hero [data-d]')];
    let mx = 0, my = 0, sy = 0, queued = false;
    const draw = () => { queued = false; layers.forEach(l => { const d = +l.dataset.d; l.style.transform = `translate3d(${mx * d * 24}px,${my * d * 24 - sy * d * .08}px,0)`; }); };
    const ask = () => { if (!queued) { queued = true; requestAnimationFrame(draw); } };
    addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; ask(); });
    addEventListener('scroll', () => { sy = scrollY; ask(); }, { passive: true });
  }

  const dlg = document.getElementById('case');
  document.querySelectorAll('[data-case]').forEach(b => b.addEventListener('click', () => {
    const a = b.closest('article');
    dlg.querySelector('.body').innerHTML = '<h3>' + a.querySelector('h3').textContent + '</h3>' + a.querySelector('.cs').innerHTML;
    dlg.showModal();
  }));
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
})();
