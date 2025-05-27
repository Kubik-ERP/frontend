import { App, inject } from 'vue';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io(import.meta.env.VITE_APP_BASE_API_URL, {
  transports: ['websocket'],
});

export default {
  install: (app: App) => {
    app.config.globalProperties.$socket = socket;
    app.provide('socket', socket);
  },
};

export const useSocket = (): Socket => {
  const socket = inject<Socket>('socket');
  if (!socket) throw new Error('Socket not provided!');
  return socket;
};
