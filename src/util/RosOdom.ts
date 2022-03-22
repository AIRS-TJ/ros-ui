// tracker = new track(30, 50, "white", 100, 820, 0)
// class Tracker(width, height, color, distanceX, distanceY, rotation, odomPosition){ 
//     this.width = width;
//     this.height = height;
//     this.speed = 0;
//     //this.distanceX = odomPosition.xPos || 0;
//     //this.distanceY = odomPosition.yPos || 0;
//     this.rotation = rotation || 0;
//     this.rotationSpeed = 0;
//     console.log("inside track()");

//     this.update = function(odomPosition){
//         ctx = mainCanvas.ctx1;
//         ctx.fillStyle = color;
//         ctx.save();
//         ctx.translate(odomPosition.xPos, odomPosition.yPos);
//         ctx.rotate(this.rotation); //rotate diagram specified below:
//         ctx.fillRect(-this.width/2, -this.height/2, width, height); //first 2 variables ensure that it rotates around its center, and not around origin
//         ctx.beginPath();
//         ctx.moveTo(50, 0);
//         ctx.lineTo(10,25);
//         ctx.lineTo(10,-25);
//         ctx.fill();
//         ctx.restore();
//     }
//     this.newPosition = function(){
//         this.rotation += this.rotationSpeed;
//         this.distanceX += this.speed * Math.cos(this.rotation); //twist with respect to cosine and sine; 
//         this.distanceY += this.speed * Math.sin(this.rotation);
//     }
// }

// function moveTracker(){ //recognize keys from keyboard
//     mainCanvas.clear();
//     tracker.speed = 0; //for linear speed
//     tracker.rotationSpeed = 0; //for angular speed
//     if (mainCanvas.key && mainCanvas.key == 37) { //left key; countercl. rotation
//         tracker.rotationSpeed = -.1/ (Math.PI);
//         rosCmdVel.publish(rosTwistLft);
//         //console.log('swinging anticlockwise');
//     }
//     if (mainCanvas.key && mainCanvas.key == 38) { //up key
//         tracker.speed = 3;
//         rosCmdVel.publish(rosTwistFwd);
//         //console.log('moving forward');
//     }
//     if (mainCanvas.key && mainCanvas.key == 39) { //right key; clockw. rotation
//         tracker.rotationSpeed = .1 / (Math.PI);
//         rosCmdVel.publish(rosTwistRht);
//         //console.log('swinging clockwise');
//      }
//     if (mainCanvas.key && mainCanvas.key == 40) { //down key
//         tracker.speed= -3;
//         rosCmdVel.publish(rosTwistBwd);
//         //console.log('moving backward');
//     }
//     tracker.newPosition();
//     //tracker.update();
// }

class Robot {
    robotShape: any
    constructor(){
       
    }
    
}
export default Robot