import { notificationPush, notificationsComponent } from './notifications';

/* eslint-disable no-undef */
export const socket = new WebSocket('ws://localhost:3085/');

socket.addEventListener('open', () => {
  console.log('Connecté au serveur WebSocket');
  window.dispatchEvent(new Event('SocketConnected'));
});

socket.addEventListener('message', (event) => {
  console.log('Message du serveur:', event.data);
  const { data } = event;
  /**
   * @type {{
   *  type: "connect" | "disconnect" | "message" | "notification"
   *  data: Record<string, unknown>
   *  flash?: boolean
   * }}
   */
  const rawData = JSON.parse(data);

  if (rawData.flash && rawData.flash === true) {
    if (
      typeof rawData === 'object' &&
      rawData.data.hasOwnProperty('title') &&
      rawData.data.hasOwnProperty('content')
    ) {
      notificationPush(
        notificationsComponent.success(
          rawData.data.title + ' <br/> ' + rawData.data.content
        )
      );
      return;
    }
    notificationPush(notificationsComponent.success(rawData.data));
  }
});

socket.addEventListener('close', () => {
  console.log('Déconnecté du serveur WebSocket');
});
