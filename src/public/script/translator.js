import { notificationPush, notificationsComponent } from './notifications';


/**
 * Translate text
 *
 * @param {string} text
 * @returns {string}
 */
export const translate = (text) => {
  const url = new URL(window.location.href);
  const lang = url.searchParams.get('lang');
  if (typeof lang === 'string') {
    const xhr = new XMLHttpRequest();
    xhr.open(
      'GET',
      '/translate?text=' + encodeURIComponent(text) + '&to=' + lang,
      false
    ); // false = synchrone
    try {
      xhr.send();
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        return response.data;
      }
    } catch (e) {
      notificationPush(notificationsComponent.error('Translation failed'));
    }
  }
  return text;
};


window.App.translator = App.translator || {};

App.translator.translate = translate;

App.translator.components = {
  fr: {},
  en: {},
  es: {},
};