import Vue from 'vue'
import { io } from 'socket.io-client'

export default ({ app, $config: { API_SOCKET } }, inject) => {
    if (!app.$auth.loggedIn) {
        return
    }

    const token = app.$auth.strategy.token.get();
    //Kết nối
    const socket = io(API_SOCKET, {
        path: '/socket.io/',
        transports: ['websocket', 'polling', 'flashsocket'],
        auth: {
            token: token
        }
    });
    // const socket = io(process.env.API_ENDPOINT, {
    //     auth: {
    //         token: token
    //     }
    // });
    
    inject('socket', socket)
}
// export default socket;