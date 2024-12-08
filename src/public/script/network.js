/* eslint-disable no-undef */
export const socket = new WebSocket('ws://localhost:3085/');

socket.addEventListener('open', () => {
  console.log('Connecté au serveur WebSocket');
  socket.send(JSON.stringify({ hello: 'world' }));
  window.dispatchEvent(new Event('SocketConnected'));
});

socket.addEventListener('message', (event) => {
  console.log('Message du serveur:', event.data);
});

socket.addEventListener('close', () => {
  console.log('Déconnecté du serveur WebSocket');
});
