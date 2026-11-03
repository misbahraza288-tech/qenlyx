(function () {
var d = document.documentElement, s = {};
try { s = JSON.parse(localStorage.getItem('brand:settings') || '{}'); } catch (e) {}
d.classList.remove('no-js'); d.classList.add('js');
d.setAttribute('data-size', s.size || 'm');
if (s.motion === 'reduce') d.classList.add('reduce');
if (s.lang === 'hi') d.setAttribute('data-lang', 'hi');
})();