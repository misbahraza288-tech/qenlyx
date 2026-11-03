(function () {
'use strict';
var d = document, html = d.documentElement, body = d.body;
var DATA = window.__BRAND__ || { hi: {} };
var KEY = 'brand:settings';
var S = {};
try { S = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { S = {}; }
var $ = function (q, el) { return (el || d).querySelector(q); };
var $$ = function (q, el) { return Array.prototype.slice.call((el || d).querySelectorAll(q)); };
var reduced = function () { return html.classList.contains('reduce') || (window.matchMedia('(prefers-reduced-motion: reduce)').matches && S.motion !== 'on'); };
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
var ticking = false;
function onScroll() {
var y = window.scrollY || 0, h = d.documentElement.scrollHeight - window.innerHeight;
html.classList.toggle('is-scrolled', y > 24);
var p = $('.hdr__progress'); if (p) p.style.setProperty('--p', h > 0 ? Math.min(1, y / h).toFixed(4) : 0);
if (!reduced()) $$('[data-parallax]').forEach(function (el) {
var r = el.getBoundingClientRect(); var k = parseFloat(el.getAttribute('data-parallax')) || 0.06;
var c = r.top + r.height / 2 - window.innerHeight / 2;
el.style.setProperty('translate', '0 ' + (-c * k).toFixed(1) + 'px');
});
ticking = false;
}
window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();
var openEl = null, lastBtn = null;
function open(id, btn) {
var el = d.getElementById(id); if (!el) return;
if (openEl && openEl !== el) close();
lastBtn = btn; el.hidden = false; openEl = el;
requestAnimationFrame(function () { el.classList.add('is-open'); });
if (btn) btn.setAttribute('aria-expanded', 'true');
if (id === 'menu') { body.style.overflow = 'hidden'; $$('.menu__a', el).forEach(function (a, i) { a.style.transitionDelay = (0.04 * i + 0.08) + 's'; }); }
var f = $('button, a', el); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 60);
}
function close() {
if (!openEl) return; var el = openEl; openEl = null;
el.classList.remove('is-open'); body.style.overflow = '';
$$('[data-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
setTimeout(function () { if (!el.classList.contains('is-open')) el.hidden = true; }, 350);
if (lastBtn) lastBtn.focus({ preventScroll: true });
}
$$('[data-open]').forEach(function (b) {
b.addEventListener('click', function (e) { e.stopPropagation(); var id = b.getAttribute('data-open'); if (openEl && openEl.id === id) close(); else open(id, b); });
});
$$('[data-close]').forEach(function (b) { b.addEventListener('click', close); });
d.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
d.addEventListener('click', function (e) { if (openEl && openEl.id === 'settings' && !openEl.contains(e.target)) close(); });
function applySettings() {
html.setAttribute('data-size', S.size || 'm');
html.classList.toggle('reduce', S.motion === 'reduce');
html.classList.toggle('motion-on', S.motion === 'on');
setLang(S.lang || 'en');
$$('[data-set="size"]').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-val') === (S.size || 'm')); });
$$('[data-set="lang"]').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-val') === (S.lang || 'en')); });
var sw = $('[data-set="motion"]'); if (sw) sw.setAttribute('aria-checked', String(S.motion === 'reduce'));
}
$$('[data-set]').forEach(function (b) {
b.addEventListener('click', function () {
var k = b.getAttribute('data-set');
if (k === 'size') S.size = b.getAttribute('data-val');
else if (k === 'lang') S.lang = b.getAttribute('data-val');
else if (k === 'motion') S.motion = S.motion === 'reduce' ? 'on' : 'reduce';
else if (k === 'reset') S = {};
save(); applySettings();
});
});
var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
function setLang(lang) {
html.setAttribute('lang', lang === 'hi' ? 'hi-Latn' : 'en');
html.setAttribute('data-lang', lang);
var dict = DATA.hi || {};
$$('[data-t]').forEach(function (el) {
if (el.__en === undefined) el.__en = el.innerHTML;
var key = norm(el.textContent && el.__en ? tmpText(el.__en) : '');
if (lang === 'hi' && dict[key]) el.innerHTML = dict[key];
else if (el.innerHTML !== el.__en) el.innerHTML = el.__en;
});
}
var tmp = d.createElement('div');
function tmpText(h) { tmp.innerHTML = h; return norm(tmp.textContent); }
$$('[data-split]').forEach(function (el) {
if (el.children.length) return; // rich text: leave
var words = el.textContent.trim().split(/\s+/);
el.textContent = '';
words.forEach(function (w, i) {
var o = d.createElement('span'); o.className = 'split-w';
var inn = d.createElement('span'); inn.textContent = w; inn.style.setProperty('--d', (0.08 * i + 0.1) + 's');
o.appendChild(inn); el.appendChild(o); if (i < words.length - 1) el.appendChild(d.createTextNode(' '));
});
});
var groups = new Map();
$$('[data-reveal]').forEach(function (el) {
var p = el.parentElement; var n = groups.get(p) || 0; groups.set(p, n + 1);
el.style.setProperty('--d', Math.min(n, 6) * 0.08 + 's');
});
if ('IntersectionObserver' in window) {
var io = new IntersectionObserver(function (ents) {
ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
$$('[data-reveal]').forEach(function (el) { io.observe(el); });
} else $$('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
$$('[data-tilt]').forEach(function (el) {
el.addEventListener('pointermove', function (e) {
if (reduced()) return; var r = el.getBoundingClientRect();
var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
el.style.transform = 'perspective(900px) rotateY(' + (x * 10).toFixed(2) + 'deg) rotateX(' + (-y * 10).toFixed(2) + 'deg)';
});
el.addEventListener('pointerleave', function () { el.style.transform = ''; });
el.style.transition = 'transform .6s cubic-bezier(.22,.61,.24,1)';
});
}
$$('[data-filter-group]').forEach(function (g) {
var target = $('[data-filter-target="' + g.getAttribute('data-filter-group') + '"]');
$$('[data-filter]', g).forEach(function (b) {
b.addEventListener('click', function () {
var f = b.getAttribute('data-filter');
$$('[data-filter]', g).forEach(function (x) { x.classList.toggle('is-on', x === b); });
$$('[data-cats]', target).forEach(function (it) {
var show = f === 'all' || (' ' + it.getAttribute('data-cats') + ' ').indexOf(' ' + f + ' ') > -1;
it.classList.toggle('is-hidden', !show); if (show) it.classList.add('in');
});
});
});
});
var lb = d.getElementById('lb'), stage = d.getElementById('lbStage'), lbTitle = d.getElementById('lbTitle');
var list = [], idx = 0;
function items() { return $$('[data-video],[data-image]').filter(function (x) { return !x.classList.contains('is-hidden') && x.offsetParent !== null; }); }
function show(i) {
if (!list.length) return; idx = (i + list.length) % list.length; var el = list[idx];
stage.textContent = '';
var t = el.getAttribute('data-title') || ''; lbTitle.textContent = t;
if (el.hasAttribute('data-video')) {
var v = d.createElement('video'); v.src = el.getAttribute('data-video'); v.controls = true; v.playsInline = true; v.autoplay = true;
v.setAttribute('playsinline', ''); var img = $('img', el); if (img) v.poster = img.currentSrc || img.src; stage.appendChild(v);
var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
} else { var im = d.createElement('img'); im.src = el.getAttribute('data-image'); im.alt = t; stage.appendChild(im); }
}
function lbOpen(el) {
if (!lb || !lb.showModal) { var u = el.getAttribute('data-video') || el.getAttribute('data-image'); if (u) location.href = u; return; }
list = items(); show(list.indexOf(el)); lb.showModal(); body.style.overflow = 'hidden';
}
function lbClose() { stage.textContent = ''; if (lb.open) lb.close(); body.style.overflow = ''; }
d.addEventListener('click', function (e) {
var el = e.target.closest && e.target.closest('[data-video],[data-image]');
if (el) { e.preventDefault(); lbOpen(el); }
});
if (lb) {
$$('[data-lb]', lb).forEach(function (b) {
b.addEventListener('click', function () { var a = b.getAttribute('data-lb'); if (a === 'close') lbClose(); else show(idx + (a === 'next' ? 1 : -1)); });
});
lb.addEventListener('close', function () { stage.textContent = ''; body.style.overflow = ''; });
lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') show(idx + 1); if (e.key === 'ArrowLeft') show(idx - 1); });
lb.addEventListener('click', function (e) { if (e.target === stage) lbClose(); });
}
var form = d.getElementById('contactForm');
if (form) {
var q = new URLSearchParams(location.search).get('service');
if (q && form.service) { for (var i = 0; i < form.service.options.length; i++) if (form.service.options[i].value === q) form.service.selectedIndex = i; }
form.addEventListener('submit', function (e) {
e.preventDefault();
var ok = true;
['name', 'msg'].forEach(function (n) { var f = form[n]; var bad = !f.value.trim(); f.classList.toggle('is-bad', bad); if (bad) ok = false; });
if (!ok) { (form.name.value.trim() ? form.msg : form.name).focus(); return; }
var svc = form.service.options[form.service.selectedIndex].text;
var text = 'Hi! I am ' + form.name.value.trim() + (form.email.value.trim() ? ' (' + form.email.value.trim() + ')' : '') + '.\nService: ' + svc + '\n\n' + form.msg.value.trim();
var url = 'https://wa.me/' + form.getAttribute('data-wa') + '?text=' + encodeURIComponent(text);
var w = window.open(url, '_blank', 'noopener'); if (!w) location.href = url;
});
}
d.addEventListener('click', function (e) {
var a = e.target.closest && e.target.closest('a[href]');
if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
if (a.target === '_blank' || a.hasAttribute('download')) return;
var u; try { u = new URL(a.href, location.href); } catch (er) { return; }
if (u.origin !== location.origin || (u.pathname === location.pathname && u.hash)) return;
if (reduced()) return;
e.preventDefault(); close(); html.classList.add('is-leaving');
setTimeout(function () { location.href = u.href; }, 300);
});
window.addEventListener('pageshow', function (e) { if (e.persisted) html.classList.remove('is-leaving'); });
applySettings();
requestAnimationFrame(function () { html.classList.add('is-ready'); });
})();