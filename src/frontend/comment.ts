
import { notificationPush, notificationsComponent } from './notifications.ts';

/**
 * Initialise les événements pour un composant spécifique.
 * @param {HTMLElement} componentElement - L'élément DOM racine du composant.
 */
const initializeComponent = (componentElement: HTMLElement) => {
  const fileControl = componentElement.querySelector<HTMLElement>(
    '.commentFileControl',
  );
  const fileInput = componentElement.querySelector<HTMLInputElement>(
    '.commentFileInput',
  );
  const formElement = componentElement.querySelector<HTMLFormElement>(
    '.commentFormElement',
  );

  /**
   * Gestionnaire d'evenement pour le formulaire de commentaire
   * @param {Event} e
   */
  const commentAction = async (e: Event) => {
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const response = await fetch('/comment/post', {
      method: 'POST',
      body: form,
    });
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      notificationPush(
        notificationsComponent.success(
          'your comment has been posted successfully',
        ),
      );
    }
  };

  if (fileControl && fileInput) {
    fileControl.addEventListener('click', (e) => {
      e.preventDefault();
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      e.preventDefault();
      const tFile = e.currentTarget as HTMLInputElement;
      const file = tFile.files![0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const component = `
            <div class="w-full relative mt-1">
              <div
                class="absolute top-2 right-2 p-1 cursor-pointer flex justify-center items-center bg-orange-500 rounded-full"
                id="removeFile"
              >
                <i class="fa-solid fa-circle-xmark fa-xl text-white"></i>
              </div>
              <img
                src="${reader.result}"
                alt=""
                class="w-full h-auto rounded-lg"
              />
            </div>
          `;
          formElement?.insertAdjacentHTML('beforeend', component);

          // Gestion de suppression locale
          formElement?.querySelectorAll('#removeFile').forEach((el) => {
            el.addEventListener('click', (e) => {
              e.preventDefault();
              const tEl = e.currentTarget as HTMLElement;
              tEl.parentElement?.remove();
              fileInput.files = null;
              fileInput.value = '';
            });
          });
        };
      }
    });
  }

  if (formElement) {
    formElement.addEventListener('submit', commentAction);
  }
};

// Initialisation globale
document
  .querySelectorAll('.commentComponent')
  .forEach((componentElement) => {
    initializeComponent(componentElement as HTMLElement);
  });
