/* eslint-disable no-undef */
document.querySelectorAll('pre').forEach(el => {
    const btn = document.createElement('button');
    btn.classList.add('copy-btn');
    btn.innerText = 'copier';
    el.insertAdjacentHTML('beforeend', btn); 
});

document.querySelectorAll('.copy-btn').forEach((button) => {
  button.addEventListener('click', function () {
    const codeBlock = this.previousElementSibling;
    const textToCopy = codeBlock.innerText;

    // Copier dans le presse-papiers
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        // Changer temporairement le texte du bouton pour montrer que le code est copié
        button.textContent = 'Copié !';
        setTimeout(() => {
          button.textContent = 'Copier';
        }, 2000);
      })
      .catch((err) => {
        console.error('Échec de la copie', err);
      });
  });
});
