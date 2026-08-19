/* /shared/anatomy.js — X-Ray Toggle & HUD for Case Study Pages */
window.XRAY = (function() {
  let active = false;
  const toggle = () => {
    active = !active;
    document.documentElement.classList.toggle('xray-mode', active);
  };
  window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'x' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      toggle();
    }
  });
  if (new URLSearchParams(window.location.search).get('xray') === '1') toggle();
  return { toggle };
})();
