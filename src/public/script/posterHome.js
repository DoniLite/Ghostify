/* eslint-disable no-undef */

const actionBtn = document.querySelector('#posterNewAction');
const closerBtn = document.querySelector('#actionCloser');
const rawHeaderNav = document.querySelector('#rawHeaderNav');
const NavCloserBtn = document.querySelector('#NavCloserBtn');
const rawHeadIcon = document.querySelector('#rawHeadIcon');
/**
 * @type {HTMLElement}
 */
const docRequester = document.querySelector('#newDocumentRequester');

actionBtn.addEventListener('click', (e) => {
  e.preventDefault();
  docRequester.classList.remove('translate-x-[-200%]');
});
closerBtn.addEventListener('click', (e) => {
  e.preventDefault();
  docRequester.classList.add('translate-x-[-200%]');
});

NavCloserBtn.addEventListener('click', (e) => {
    e.preventDefault();
    rawHeaderNav.classList.add('translate-x-[200%]');
})

rawHeadIcon.addEventListener('click', (e) => {
    e.preventDefault();
    rawHeaderNav.classList.remove('translate-x-[200%]');
});