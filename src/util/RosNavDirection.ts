class RosNavDirection {
    private stage: any
    constructor(stage: any) {
        this.stage = stage
        this.createArrowShape()
    }
    createArrowShape() {
        const stage = this.stage

        // Sorry if my math terms are wrong.

        function drawArrow(arrow:any, length: number, frequency:number, amplitude:any) {
            arrow.graphics.clear().ss(3).s("#f00").mt(0, 0);
            var arrowSize = 15;
            for (var i = 0, l = (length - arrowSize) / frequency; i < l; i++) {
                var p = frequency / 4, breakAfter = false,
                    a = amplitude;

                // More fun line amplitude
                // a = Math.pow(amplitude, 0.5 / l) * i;

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
            arrow.graphics.f("#000");
            arrow.graphics.dp(length - arrowSize, 0, arrowSize, 3);
        }

        var current:any = null;
        stage.on("stagemousedown", function () {
            console.log('stagemousedown')

            // Create a new arrow on stage press
            current = new window.createjs.Shape().set({ x: stage.mouseX, y: stage.mouseY });
            console.log('current', current)
            stage.addChild(current);

            // Update the current arrow on move
            var moveListener = stage.on("stagemousemove", function () {
                console.log('stagemousemove')
                // Determine the length between the start and end point using pythagoras
                var w = stage.mouseX - current.x;
                var h = stage.mouseY - current.y;
                var l = Math.sqrt(w * w + h * h);

                // Draw the arrow.
                // Math.sqrt on the amplitude and frequency make it scale as it gets larger
                drawArrow(current, l, Math.sqrt(l), Math.sqrt(l));

                // Rotate to touch the mouse
                current.rotation = Math.atan2(h, w) * 180 / Math.PI;
                stage.update();
            });

            // Stop the drag
            var upListener = stage.on("stagemouseup", function () {
                stage.off("stagemousemove", moveListener);
                stage.off("stagemouseup", upListener);
                current = null;
            });
        });
    }
}
/*
var stage = ros.viewer.scene

function drawArrow(arrow, length, frequency, amplitude) {
    arrow.graphics.clear().ss(3).s("#f00").mt(0, 0);
    var arrowSize = 15;
    for (var i = 0, l = (length - arrowSize) / frequency; i < l; i++) {
        var p = frequency / 4
          , breakAfter = false
          , a = amplitude;

        // More fun line amplitude
        // a = Math.pow(amplitude, 0.5 / l) * i;

        // Prevent the line from being longer than the arrow
        // Adjusts the period to fit.
        if (i * frequency + p * 2 > length - arrowSize) {
            p = (length - arrowSize * 1.5 - i * frequency) / 2;
            breakAfter = true;
        }

        // Draw the first part of the wave
        arrow.graphics.qt(i * frequency + p, a, i * frequency + p * 2, 0);
        if (breakAfter) {
            break;
        }
        // Break if it would be too long

        // Adjust the period if the second part is too long
        if (i * frequency + p * 4 > length - arrowSize) {
            p = (length - arrowSize * 1.5 - i * frequency) / 4;
            // 1.5 because its a triangle
        }

        // Draw the second part of the wave
        arrow.graphics.qt(i * frequency + p * 3, -a, i * frequency + p * 4, 0);
    }

    // Draw the arrow head at the end.
    arrow.graphics.f("#000");
    arrow.graphics.dp(length - arrowSize, 0, arrowSize, 3);
}

var current = null;
stage.on("stagemousedown", function() {
    console.log('stagemousedown')

    // Create a new arrow on stage press
    current = new window.createjs.Shape().set({
        x: stage.mouseX,
        y: stage.mouseY
    });
    console.log('current', current)
    stage.addChild(current);

    // Update the current arrow on move
    var moveListener = stage.on("stagemousemove", function() {
        console.log('stagemousemove')
        // Determine the length between the start and end point using pythagoras
        var w = stage.mouseX - current.x;
        var h = stage.mouseY - current.y;
        var l = Math.sqrt(w * w + h * h);

        // Draw the arrow.
        // Math.sqrt on the amplitude and frequency make it scale as it gets larger
        drawArrow(current, l, Math.sqrt(l), Math.sqrt(l));

        // Rotate to touch the mouse
        current.rotation = Math.atan2(h, w) * 180 / Math.PI;
        stage.update();
    });

    // Stop the drag
    var upListener = stage.on("stagemouseup", function() {
        stage.off("stagemousemove", moveListener);
        stage.off("stagemouseup", upListener);
        current = null;
    });
});


*/
export default RosNavDirection