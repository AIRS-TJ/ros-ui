import { ros } from '@/util/RosManager'

let curWidth = 0
let  curHeight = 0


export const useMapSize = (fn: Function) => {
    const topic = new window.ROSLIB.Topic({
        ros: ros,
        name: '/map',
        throttle_rate: 100
    });
    topic.subscribe(function (data: any) {
        const width = data.info.width * 2
        const height = data.info.height * 2
        
        if(curWidth !== width && curHeight !== height) {
            fn({width, height})
            curWidth = width
            curHeight = height
        }
    })
}
