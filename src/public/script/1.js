import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

window.onload = (e) => {
  console.log(activeIndex.className);
  swiper.slideTo(parseInt(activeIndex.className), 200);
};

/**
 * Fonction retournant le mois correspondant à l'index
 * @param {number} monthIndex
 */
const getMonthWithDate = (monthIndex) => {
const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
return months[monthIndex]
}

window.setInterval(()=>{
    const handler = document.querySelector(".time-check");
    const handlerText = handler.textContent
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const secondes = date.getSeconds();
    const time = `${hours}H : ${minutes}m ${secondes}s`
    handler.innerHTML = `${time} <br> ${date.getDate()} ${getMonthWithDate(
      date.getMonth()
    )} ${date.getFullYear()}`;
    console.log(time);
}, 1000);

// window.onscroll = (e) => {

// }
// const swiper = new Swiper(...)
const activeIndex = document.querySelector("#activeInputNav");
const navLinks = document.querySelectorAll(".default-nav ul li");
const mobileNavLinks = document.querySelectorAll(".mobile-nav ul li");
const linkGroup = document.querySelector("nav ul");
const scrollParent = document.querySelectorAll(".swiper-slide");
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
    let element = e.currentTarget;
    swiper.slideTo(parseInt(element.dataset.index), 200);
    navLinks.forEach((el) => {
      el.classList.remove("text-red-950");
    });
    element.classList.add("text-red-950");
    console.log(element.dataset.index);
  });
  el.setAttribute("data-index", index);
  const i = document.createElement("button");
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