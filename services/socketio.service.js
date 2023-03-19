import { io } from 'socket.io-client';
// import store from "../store/index";
class SocketioService {
    socket;
    constructor() {

    }
  
    setupSocketConnection(store, userName) {
        this.socket = io(process.env.API_ENDPOINT, {
            auth: {
                token: userName
            }
        });
        
        this.socket.on('socketUser', async(data) => {
            await store.dispatch('socketLogin', data);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
  
  export default new SocketioService();