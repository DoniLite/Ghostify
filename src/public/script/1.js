import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

// const swiper = new Swiper(...)
const activeIndex = document.querySelector("#activeInputNav");
const navLinks = document.querySelectorAll(".default-nav ul li");
const mobileNavLinks = document.querySelectorAll(".mobile-nav ul li");
const linkGroup = document.querySelector("nav ul");
const scrollParent = document.querySelectorAll(".swiper-slide");

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
  draggable: true,

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

const mobileNav = document.querySelector(".mobile-nav");
const mobileNavBtn = document.querySelector(".mobile-nav-icon");
const closerBtn = document.querySelector(".close-btn");

mobileNavBtn.addEventListener('click', () => {
  mobileNav.classList.remove('hide')
  mobileNav.classList.add('show')
})

closerBtn.addEventListener("click", () => {
  mobileNav.classList.remove("show");
  mobileNav.classList.add("hide");
});