import Vue from 'vue'
import { io } from 'socket.io-client'

export default ({ app }, inject) => {
    if (!app.$auth.loggedIn) {
        return
    }

    const token = app.$auth.strategy.token.get();
    const socket = io(process.env.API_ENDPOINT, {
        auth: {
            token: token
        }
    });
    
    inject('socket', socket)
}
// export default socket;