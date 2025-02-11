import 'vite/modulepreload-polyfill';

const mobileAuth = document.querySelector('#ghostifyPowerMob');
const ghostifyPower = document.querySelector('#ghostifyPower');

/**
 *
 * @param {Event} e
 */
const disconnection = async (e: Event) => {
  e.preventDefault();
  /**
   * @type {HTMLElement}
   */
  const el = e.currentTarget as HTMLElement;
  const req = await fetch('/disconnection');
  if (!req.ok) {
    alert('something went wrong');
    return;
  }
  const data = await req.json();
  if (data.success) {
    const attr = el.getAttribute('id');
    if (typeof attr === 'string' && attr === 'ghostifyPower') {
      el.remove();
      window.location.reload();
      return;
    }
    el.style.display = 'none';
    window.location.reload();
  }
};

mobileAuth.addEventListener('click', disconnection);
ghostifyPower.addEventListener('click', disconnection);
