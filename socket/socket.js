// import { io } from 'socket.io-client';
// const BACKEND_SERVER = process.env.API_ENDPOINT;
// const socket = io(BACKEND_SERVER, { autoConnect: false });

// function createWebSocketPlugin(socket) {
//   return (store) => {
//     store.$socket = socket;
//     // Thêm các socket event listening
//     socket.on("USER_INFO", (user) => store.dispatch("socketLogin", user));
//   };
// }

// // Plugin lưu giá trị nhận được từ Socket vào Vuex store
// export const websocketPlugin = createWebSocketPlugin(socket);

// export default socket;
