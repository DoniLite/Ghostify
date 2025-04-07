import { notificationPush, notificationsComponent } from './notifications.ts';


export const translate = (text: string): string => {
  const url = new URL(globalThis.location.href);
  const lang = url.searchParams.get('lang');
  if (typeof lang === 'string') {
    const xhr = new XMLHttpRequest();
    xhr.open(
      'GET',
      '/translate?text=' + encodeURIComponent(text) + '&to=' + lang,
      false,
    ); // false = synchrone
    try {
      xhr.send();
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        return response.data;
      }
    } catch (e) {
      notificationPush(notificationsComponent.error('Translation failed'));
      console.error(e);
    }
  }
  return text;
};

// window.App.translator = App.translator || {};

// App.translator = {
//   translate,
//   components: {
//     fr: {},
//     en: {},
//     es: {},
//   },
// };
