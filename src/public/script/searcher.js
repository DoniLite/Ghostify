
/**
 * @type {HTMLInputElement}
 */
const searchInput = document.querySelector("#PrimarySearch");
const containerParser = document.querySelector("#containerPaser");
const loader = document.querySelector("#searchLoader");
console.log(searchInput);

/**
 * 
 * @param {Event} e 
 */
const sendKeysToServer = async (e) => {
    e.preventDefault();
    console.log('click on search')
    loader.classList.remove('hidden');
    loader.classList.add('flex');
    /**
     * @type {HTMLInputElement}
     */
    const el = e.currentTarget;
    const value = el.value;
    console.log(value);
    const res = await fetch(`/find?q=${value}`);
    if(!res.ok) {
        loader.classList.remove("flex");
        loader.classList.add("hidden");
        const errorComponent = `<div class=" text-red-600 font-bold text-center">Une erreur s'est produite</div>`;
        containerParser.insertAdjacentHTML(errorComponent);
        return;
    }
    /**
     * @type {any[]}
     */
    const data = await res.json();
    console.log(data);
    loader.classList.remove("flex");
    loader.classList.add("hidden");
    if(data.length > 0) {
        data.forEach(el => {
            containerParser.insertAdjacentHTML('beforeend', el);
        });
        return;
    }
}
searchInput.onkeyup = sendKeysToServer
// searchInput.addEventListener('click', sendKeysToServer)