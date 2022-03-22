import rosManager from "@/util/RosManager"

const station = new window.createjs.Shape();
let isDrawing = false
const useStation = () => {
    console.log('useStation')
    station.graphics.beginFill('#f52d7a').drawCircle(0, 0, 10);
    const stage = rosManager.viewer.scene
    stage.on('mousedown',(evt:any)=>{
        console.log(evt)
        rosManager.viewer.scene.addChild(station);
        station.setTransform(evt.stageX, evt.stageY)
        isDrawing = true
    })
    stage.on('pressmove', (evt: any) => {
        console.log('mousemove', evt)
        if(!isDrawing) return
        station.setTransform(evt.stageX, evt.stageY)
    })
    // 释放导航消息
    stage.on('pressup', (evt: any) => {
        console.log('mousemove', evt)
        if(!isDrawing) return
        station.setTransform(evt.stageX, evt.stageY)
    })
}

export default useStation