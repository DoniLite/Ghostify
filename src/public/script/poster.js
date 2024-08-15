
const posterComponent = document.querySelector("#posterComponent");

// const allSections = [
//   ...posterComponent.querySelectorAll(),
//   ...posterComponent.querySelectorAll(),
// ];

const actionBtn = document.querySelector('#action');
const actionComponent = document.querySelector("#actionComponent");
const posterForm = document.querySelector("#posterForm");
const requestSetionBtn = document.querySelector("#requestSetionBtn");
const form = new FormData(posterForm);
/**
 * @type {HTMLInputElement}
 */
const sessionIndex = document.querySelector("#sessionIndex");
const index = Number(sessionIndex.value)
/**
 * 
 * @param {MouseEvent} e 
 */
const hideComponent = (e) => {
    console.log("Hiding component");
    e.preventDefault();
    actionComponent.classList.add("poster-hidden");
}
/**
 * 
 * @param {MouseEvent} e 
 */
const showComponent = (e) => {
    console.log("showComponent", e);
    e.preventDefault();
    actionComponent.classList.remove("poster-hidden");
}
 
/**
 * 
 * @param {Event} e 
 */
const requestNewSection = async (e) => {
    e.preventDefault();
    const result = await fetch(`/components/poster?section=${index}`);
    if(!result.ok) {
        posterForm.appendChild(
            `<div class=" text-red-500 font-bold text-center">
            Oups une erreurs'est produite
            ${result.statusText}
            </div>
            `
        )
    }
    
    const component = await result.text();
    console.log(component)
    posterForm.insertAdjacentHTML('beforeend', component);
    sessionIndex.value = String(parseInt(sessionIndex.value) + 1);
}

/**
 * 
 * @param {Event} e 
 */
actionBtn.onclick = (e) => {
    e.preventDefault();
    actionComponent.classList.toggle('poster-hidden');
}
actionBtn.addEventListener('mouseenter',showComponent);
actionBtn.addEventListener('mouseleave',hideComponent);
actionComponent.addEventListener('mouseenter',showComponent);
actionComponent.addEventListener('mouseleave',hideComponent);
requestSetionBtn.addEventListener('click',requestNewSection);