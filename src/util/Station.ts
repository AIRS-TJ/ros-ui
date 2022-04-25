interface Station {
    stationId: number,
    position: { x: number, y: number, z: number },
    orientation: { x: number, y: number, z: number, w: number }
}

class Station{
    stations: Station[]
    id: number
    ros: any
    constructor(ros: any){
        this.ros = ros
        this.stations = []
        this.id = 0
        window.__station = this
    }
    addStation(station: Station){
        station.stationId = ++this.id
    }
    reset(){
        this.stations = []
        this.id = 0
    }
    send(){
        let topic = new window.ROSLIB.Topic({
            ros: this.ros,
            name: '/cmd_vel',
            messageType: 'geometry_msgs/Twist'
        })
        let message = new window.ROSLIB.Message(this.stations)
        topic.publish(message)
    }
}

export default Station