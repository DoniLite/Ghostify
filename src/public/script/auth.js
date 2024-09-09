/* eslint-disable no-undef */

const mobileAuth = document.querySelector('#ghostifyPowerMob');
const ghostifyPower = document.querySelector('#ghostifyPower');

/**
 * 
 * @param {Event} e 
 */
const disconnection = async (e) => {
    e.preventDefault();
    const el = e.currentTarget;
    const req = await fetch('/disconnection');
    if(!req.ok) {
        alert('something went wrong');
        return;
    }
    const data = await req.json();
    if(data.success) {
        el.style.display = 'none';
        ghostifyPower.style.display = 'none';
        window.location.reload();
    }
}

mobileAuth.addEventListener('click', disconnection);