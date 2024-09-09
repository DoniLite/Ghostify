/* eslint-disable no-undef */

/**
 * @type {HTMLLinkElement[]}
 */
const allLinks = document.querySelectorAll('#matchedLink');

allLinks.forEach(link => {
    link.addEventListener('click',async (e) => {
        e.preventDefault();
        const link = e.currentTarget.href;
        const result = await fetch(`/update/visitor?url=${link}`);
        if(!result.ok) {
            window.alert("It's looks like you're trying to get a invalid URL iside the plateforme")
        }
        window.open(link)
    })
})