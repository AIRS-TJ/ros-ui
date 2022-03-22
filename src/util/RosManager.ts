/**
 * TODO:
 * 1. 地图尺寸
 */
import { rosQuaternionToGlobalTheta } from './index'
declare global {
    interface Window {
        ROSLIB: any
        ROS2D: any
        ros: any
        createjs: any
        NAV2D: any
    }
}
import { useSystemStore } from "@/store/system"
import { computed } from "vue"
import { notification } from "ant-design-vue"
import { randomRGB } from './index'
import { throttle } from "lodash-es"
import RosNavDirection from './RosNavDirection'

export let ros: any = null

const NOTIFICATION_KEY = 'socket-notification'


class RosManager {
    public ros
    public cmdVel
    public twist
    public gridClient!: any
    public viewer!: any
    public connected = false
    public nav!: any
    public robot!: any
    public robotAdd: boolean
    constructor() {
        this.ros = new window.ROSLIB.Ros({
            // set this to false to use the new service interface to
            // tf2_web_republisher. true is the default and means roslibjs
            // will use the action interface
            groovyCompatibility: true,
        })
        this.cmdVel = new window.ROSLIB.Topic({
            ros: this.ros,
            name: '/cmd_vel',
            messageType: 'geometry_msgs/Twist'
        });//创建一个topic,它的名字是'/cmd_vel',,消息类型是'geometry_msgs/Twist'
        this.twist = new window.ROSLIB.Message({
            linear: {
                x: 0,
                y: 0,
                z: 0
            },
            angular: {
                x: 0,
                y: 0,
                z: 0
            }
        });//创建一个message

        this.ros.on('error', (error: any) => {
            console.log(error)
            notification.error({
                key: NOTIFICATION_KEY,
                message: 'ros error',
                // description: error.toString()
            })
        })
        this.ros.on('connection', () => {
            this.connected = true
        });
        window.ros = this
        this.robotAdd = false
        this.robot = this.createRobot()
        ros = this.ros
    }
    connect(url: string) {
        this.ros.connect(url);
    }
    go(direction: 'forward' | 'back' | 'left' | 'right') {
        const systemStore = useSystemStore()
        const step = computed(() => systemStore.$state.step)
        switch (direction) {
            case 'forward':
                this.twist.linear.x += step.value;
                break;
            case 'back':
                this.twist.linear.x -= step.value;
                break;
            case 'right':
                this.twist.angular.z -= step.value;
                break;
            case 'left':
                this.twist.angular.z += step.value;
                break;
        }
        this.cmdVel.publish(this.twist);//发布twist消息
    }
    stop() {
        this.twist.linear.x = 0;
        this.twist.linear.y = 0;
        this.twist.linear.z = 0;
        this.twist.angular.x = 0;
        this.twist.angular.y = 0;
        this.twist.angular.z = 0;
        this.cmdVel.publish(this.twist);//发布twist消息
    }
    initMap({ divID, width, height }: { divID: string, width: number, height: number }) {
        this.viewer = new window.ROS2D.Viewer({
            divID,
            width,
            height,
        });
        console.log(this.viewer)
        this.nav = window.NAV2D.OccupancyGridClientNav({
            ros: this.ros,
            rootObject: this.viewer.scene,
            viewer: this.viewer,
            serverName: '/move_base',
            continuous: true,
            withOrientation: true
        });
        // const dir = new RosNavDirection(this.viewer.scene)
        // console.log('dir', dir)

    }
    resizeMap() {
        try {
            if (this.gridClient && this.gridClient.currentGrid) {
                this.viewer.scaleToDimensions(this.gridClient.currentGrid.width, this.gridClient.currentGrid.height);
            }
            if (this.gridClient && this.gridClient.currentGrid && this.gridClient.currentGrid.pose) {
                this.viewer.shift(this.gridClient.currentGrid.pose.position.x, this.gridClient.currentGrid.pose.position.y);
            }
        } catch (e) { console.warn('[resize map error]: ', e) }
    }
    createRobot() {
        const shape = new window.createjs.Shape();
        shape.graphics.beginFill('#F6AB00').drawCircle(0, 0, 6);
        shape.alpha = 0.6
        return shape
    }
    displayRobot() {
        var robotMarker = new window.ROS2D.NavigationArrow({
            size: 0.25,
            strokeSize: 0.05,
            pulse: true,
            fillColor: "#F6AB00",
            strokeColor: "#F6AB00"
        });
        console.log('robotMarker', robotMarker)
        this.viewer.scene.addChild(robotMarker)

        var poseListener = new window.ROSLIB.Topic({
            ros: this.ros,
            name: '/tracked_pose',
            throttle_rate: 100
        });
        poseListener.subscribe(function (pose: any) {
            // console.log(`Received message on ${message} : ${message}`, message);
            robotMarker.x = pose.pose.position.x;
            robotMarker.y = -pose.pose.position.y;
            robotMarker.rotation = rosQuaternionToGlobalTheta(pose.pose.orientation)
        })
    }
}

export default new RosManager()
