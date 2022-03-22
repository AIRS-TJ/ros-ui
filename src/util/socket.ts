
import { notification } from "ant-design-vue"

const NOTIFICATION_KEY = 'socket-notification'

class Socket {
    private socket: WebSocket | null
    constructor() {
        this.socket = null
    }
    initSocket(href: string) {
        this.socket = new WebSocket(href)
        this.socket.addEventListener('error', (error)=>{
            console.log(error)
            notification.error({
                key: NOTIFICATION_KEY,
                message: 'socket error',
                description: error.toString()
            })
        })

        this.socket.addEventListener('message', function (event) {
            console.log('Message from server ', event.data);
        });
    }
    addEventListener(type: keyof WebSocketEventMap, fn: EventListenerOrEventListenerObject) {
        if (this.socket) {
            this.socket.addEventListener(type, fn)
        } else {
            console.error('socket has not been connected!')
        }
    }
    send(msg: string) {
        this.socket?.send(msg)
    }
}

export let socket: WebSocket
export const initSocket = (href: string) => {
    socket = new WebSocket(href)
}
export default new Socket()