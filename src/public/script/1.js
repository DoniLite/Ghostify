/* eslint-disable no-undef */

const navContainer = document.querySelector('.default-nav');
const searchInput = document.querySelector('#searcher');
const mobileIcon = document.querySelector('#mobileSiteIcon');
const navLinks = document.querySelectorAll('.default-nav ul li');
const linkGroup = document.querySelector('nav ul');
const scrollParent = document.querySelectorAll('.swiper-slide');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavBtn = document.querySelector('.mobile-nav-icon');
const closerBtn = document.querySelector('.close-btn');
window.onscroll = (e) => {
  e.preventDefault();
  navContainer.classList.add('-translate-y-[300%]');
  searchInput.classList.add('-translate-y-[300%]');
  mobileIcon.classList.add('-translate-y-[300%]');
  mobileNavBtn.classList.add('-translate-y-[300%]');
};
window.onscrollend = (e) => {
  e.preventDefault();
  navContainer.classList.remove('-translate-y-[300%]');
  searchInput.classList.remove('-translate-y-[300%]');
  mobileIcon.classList.remove('-translate-y-[300%]');
  mobileNavBtn.classList.remove('-translate-y-[300%]');
};

window.onload = (e) => {
  e.preventDefault();
  navLinks.forEach(link => {
    link.classList.remove('text-red-950');
  }); 
};

// window.onscroll = (e) => {

// }

scrollParent.forEach((el) => {
  el.addEventListener('scroll', (e) => {
    e.preventDefault();
    linkGroup.style.display = 'none';
  });
});


mobileNavBtn.addEventListener('click', (e) => {
  e.preventDefault();
  mobileNav.classList.remove('hide', '-translate-x-full');
  mobileNav.classList.add('show');
});

closerBtn.addEventListener('click', (e) => {
  e.preventDefault();
  mobileNav.classList.remove('show');
  mobileNav.classList.add('hide');
});
