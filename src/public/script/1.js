import Swiper, {} from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'


window.onload = (e) => {
    console.log(activeIndex.className)
    swiper.slideTo(parseInt(activeIndex.className), 200)
}

// window.onscroll = (e) => {
    
// }
// const swiper = new Swiper(...)
const activeIndex = document.querySelector('#activeInputNav')
const navLinks = document.querySelectorAll('nav ul li')
const linkGroup = document.querySelector('nav ul')
const scrollParent = document.querySelectorAll('.swiper-slide')
scrollParent.forEach(el => {
    el.addEventListener('scroll', (e)=>{
        linkGroup.style.display = 'none'
        console.log('scroll')
    })
})
navLinks.forEach((el, index, list)=>{
    el.addEventListener('click', (e)=>{
        e.preventDefault()
        let element = e.currentTarget
        swiper.slideTo(parseInt(element.dataset.index), 200)
        navLinks.forEach(el=>{
            el.classList.remove('text-red-950')
        })
        element.classList.add('text-red-950')
        console.log(element.dataset.index)
    })
    el.setAttribute('data-index', index)
})
// init Swiper:
const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
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
console.log('hello dears!')