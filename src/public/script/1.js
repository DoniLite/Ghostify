import Swiper from "../swiper/package/swiper.mjs";
// const swiper = new Swiper(...)
const activeIndex = document.querySelector("#activeInputNav");
const navContainer = document.querySelector('.default-nav');
const allParentsContainer = document.querySelectorAll('#container');
const searchInput = document.querySelector('#searcher');
const mobileIcon = document.querySelector('#mobileSiteIcon');
const navLinks = document.querySelectorAll(".default-nav ul li");
const mobileNavLinks = document.querySelectorAll(".mobile-nav ul li");
const linkGroup = document.querySelector("nav ul");
const scrollParent = document.querySelectorAll(".swiper-slide");
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavBtn = document.querySelector('.mobile-nav-icon');
const closerBtn = document.querySelector('.close-btn');

allParentsContainer.forEach(parent => {
  parent.addEventListener('scroll', (e) => {
    e.preventDefault();
    navContainer.classList.add('-translate-y-[300%]');
    searchInput.classList.add('-translate-y-[300%]');
    mobileIcon.classList.add('-translate-y-[300%]');
    mobileNavBtn.classList.add('-translate-y-[300%]');
  });
  parent.addEventListener('scrollend', (e) => {
    e.preventDefault();
    navContainer.classList.remove('-translate-y-[300%]');
    searchInput.classList.remove('-translate-y-[300%]');
    mobileIcon.classList.remove('-translate-y-[300%]');
    mobileNavBtn.classList.remove('-translate-y-[300%]');
  })
})

window.onload = (e) => {
  console.log(activeIndex.className);
  swiper.slideTo(parseInt(activeIndex.className), 200);
};

localStorage.setItem('activeIndex', activeIndex);
sessionStorage.setItem('activeIndex', activeIndex);
const Aindex = localStorage.getItem("activeIndex");
console.log(localStorage.getItem('activeIndex'), sessionStorage.getItem('activeIndex'));
// window.onscroll = (e) => { 

// }

scrollParent.forEach((el) => {
  el.addEventListener("scroll", (e) => {
    linkGroup.style.display = "none";
    console.log("scroll");
  });
});

/**
 * 
 * @param {Element} el 
 * @param {number} index 
 * @param {NodeListOf<Element>} list 
 */
const slideNavigation = (el, index, list) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();

    /**
     * @type {EventTarget}
     */
    let element = e.currentTarget;
    swiper.slideTo(parseInt(element.dataset.index), 200);
    navLinks.forEach((el) => {
      el.classList.remove("text-red-950");
    });
    element.classList.add("text-red-950");
    console.log(element.dataset.index);
  });
  el.setAttribute("data-index", index);
};

navLinks.forEach(slideNavigation);
mobileNavLinks.forEach(slideNavigation);
// init Swiper:
const swiper = new Swiper(".swiper", {
  // Optional parameters
  direction: "horizontal",
  loop: true,
  // draggable: true,

  // If we need pagination

  // pagination: {
  //     el: '.swiper-pagination',
  // },
  // Navigation arrows
  // navigation: {
  //     nextEl: '.swiper-button-next',
  //     prevEl: '.swiper-button-prev',
  // },

  // And if we need scrollbar
  // scrollbar: {
  //     el: '.swiper-scrollbar',
  // },
});

mobileNavBtn.addEventListener('click', (e) => {
  e.preventDefault();
  mobileNav.classList.remove('hide');
  mobileNav.classList.add('show');
})

closerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  mobileNav.classList.remove("show");
  mobileNav.classList.add("hide");
});