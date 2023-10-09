import Vue from 'vue'
import { io } from 'socket.io-client'
import dotenv from 'dotenv';
dotenv.config();

export default ({ app }, inject) => {
    if (!app.$auth.loggedIn) {
        return
    }

    const token = app.$auth.strategy.token.get();
    var path = '/socket.io/';

    //Kết nối
    const socket = io(process.env.API_ENDPOINT, {
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