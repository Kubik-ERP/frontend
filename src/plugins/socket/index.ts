import { App, inject } from 'vue';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://103.191.63.109:8080');

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
