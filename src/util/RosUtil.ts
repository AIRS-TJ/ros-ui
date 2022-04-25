import { ros } from './RosManager'

function getAngle(cen:number[], first:number[], second:number[]) {
     // cen  : 中心点 [0,0]
     // first : 开始点 [1,3]
     // second : 结束位置 [3,4]
    var f_c_x = first[0] - cen[0],
        f_c_y = cen[1] - first[1],
        s_c_x = second[0] - cen[0],
        s_c_y = cen[1] - second[1];
    var c = Math.sqrt(f_c_x * f_c_x + f_c_y * f_c_y) * Math.sqrt(s_c_x * s_c_x + s_c_y * s_c_y);
    if (c == 0) return -1;
    var angle = Math.acos((f_c_x * s_c_x + f_c_y * s_c_y) / c);
    // 第一象限
    if (cen[0] - second[0] < 0 && cen[1] - second[1] < 0) {
        return angle
        // 第二象限
    } else if (cen[0] - second[0] < 0 && cen[1] - second[1] > 0) {
        return angle
        // 第三象限
    } else if (cen[0] - second[0] > 0 && cen[1] - second[1] < 0) {
        return 2 * Math.PI - angle
        // 第四象限
    } else if (cen[0] - second[0] > 0 && cen[1] - second[1] > 0) {
        return 2 * Math.PI - angle
    }
}
let positionVec3 :any
let position: any

function getZ(stage:any, event: any){
    var goalPos = stage.globalToRos(event.stageX, event.stageY);

        var goalPosVec3 = new window.ROSLIB.Vector3(goalPos);
        const xDelta =  goalPosVec3.x - positionVec3.x;
        const yDelta =  goalPosVec3.y - positionVec3.y;
        
        let thetaRadians  = Math.atan2(xDelta,yDelta);
        
        if (thetaRadians >= 0 && thetaRadians <= Math.PI) {
          thetaRadians += (3 * Math.PI / 2);
        } else {
          thetaRadians -= (Math.PI/2);
        }
        
        var qz =  Math.sin(-thetaRadians/2.0);
        return qz
}
export const useRobotArrow = (stage: any, robot: any, cb: Function, options: any = {}) => {
    const { createjs } = window

    const { x, y } = stage.canvas.getBoundingClientRect()

    // Sorry if my math terms are wrong.

    function drawArrow(arrow: any, length: any, frequency: any, amplitude: any) {
        // 给箭头一个固定长度
        length = 0.002 / stage.scale
        if(options.fromConnect) {
            length = 120
        }
        // console.log('length', length)
        arrow.graphics.clear().ss(3).s("#503183").mt(0, 0);
        var arrowSize = 15;
        for (var i = 0, l = (length - arrowSize) / frequency; i < l; i++) {
            var p = frequency / 4, breakAfter = false,
                a = amplitude;

            // More fun line amplitude
            a = Math.pow(amplitude, 0.5 / l) * i;

            // Prevent the line from being longer than the arrow
            // Adjusts the period to fit.
            if (i * frequency + p * 2 > length - arrowSize) {
                p = (length - arrowSize * 1.5 - i * frequency) / 2;
                breakAfter = true;
            }

            // Draw the first part of the wave
            arrow.graphics.qt(i * frequency + p, a, i * frequency + p * 2, 0);
            if (breakAfter) { break; } // Break if it would be too long

            // Adjust the period if the second part is too long
            if (i * frequency + p * 4 > length - arrowSize) {
                p = (length - arrowSize * 1.5 - i * frequency) / 4; // 1.5 because its a triangle
            }

            // Draw the second part of the wave
            arrow.graphics.qt(i * frequency + p * 3, -a, i * frequency + p * 4, 0);
        }

        // Draw the arrow head at the end.
        arrow.graphics.f("#503183");
        arrow.graphics.dp(length - arrowSize, 0, arrowSize, 3);
    }
    function drawArc(arc:any, startAngle: number, endAngle: number, stage: any){
        stage.removeChild(arc)
        arc.scale = stage.scale
        length = 120 / stage.scale - 15 // 减去箭头大小
        arc.graphics.f("#b7accc");
        arc.graphics.moveTo(0,0)
        console.log(startAngle, endAngle)
        arc.graphics.arc(0,0, length, startAngle, endAngle);
        stage.addChild(arc);

    }

    var current: any = null;
    var arc: any = null;
    
    robot.on("mousedown", function (mouseDownEvent:any) {
        // console.log(mouseDownEvent, mouseDownEvent.stageY,robot.x, robot.y ,stage.mouseX, stage.mouseY)
        // if(window.ros.isMoving) return false
        // Create a new arrow on stage press
        current = new createjs.Shape().set({ x: robot.x , y: robot.y });
        arc = new createjs.Shape().set({ x: robot.x , y: robot.y });
        // current.scale = stage.scale
        current.scale = 0.01
        arc.scale = stage.scale
        stage.addChild(current);
        stage.addChild(arc);
        (window as any).arrow = current


        position = stage.globalToRos(mouseDownEvent.stageX, mouseDownEvent.stageY);
        positionVec3 = new window.ROSLIB.Vector3(position);

        
        // stage.setChildIndex( current, 0);

        // Update the current arrow on move
        var moveListener = stage.on("stagemousemove", function (mousemoveEvent:any) {
            var w = stage.mouseX  - (robot.x +  stage.x);
            var h = stage.mouseY - ( robot.y + stage.y);
            var l = Math.sqrt(w * w + h * h);
            // Draw the arrow.
            // Math.sqrt on the amplitude and frequency make it scale as it gets larger
            drawArrow(current, l, Math.sqrt(l), 0);
            const scale = stage.scale
            const angle = getAngle(
                [robot.x / scale, robot.y / scale], 
                [mouseDownEvent.stageX,mouseDownEvent.stageY] , 
                [stage.mouseX / scale, stage.mouseY / scale]
            ) as number
            // console.log(angle)
            // Rotate to touch the mouse
            const start = Math.atan2(h, w) * 180 / Math.PI;
            // const end = Math.atan2(h, w) * 180 / Math.PI; 
            current.rotation = Math.atan2(h, w) * 180 / Math.PI;
            // drawArc(arc, start, angle, stage);
            stage.update();
        });

        // Stop the drag
        var upListener = stage.on("stagemouseup", function (event) {
            stage.off("stagemousemove", moveListener);
            stage.off("stagemouseup", upListener);
            const z = getZ(stage, event)
            cb(z)
            stage.removeChild(current)
            // stage.removeChild(arc)
            stage.update()
            current = null;
            // arc = null;
        });
    });

}

export const createTopic = (dataMsg:string) => {
    console.log('create topic:', dataMsg)
    const topic = new window.ROSLIB.Topic({
        ros: ros,
        name: '/chatter',
        messageType : 'std_msgs/String'
    });
    const message = new window.ROSLIB.Message({data:dataMsg})
    topic.publish(message)
    return topic

    // var pub = new ROSLIB.Topic({
    //     ros : this.ros,
    //     name : '/chatter',
    //     messageType : 'std_msgs/String'
    // });

    // var str = new ROSLIB.Message({data : comment});
    // pub.publish(str);
}