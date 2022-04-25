<template>
    <canvas ref="canvas" id="canvas" width="600" height="600"></canvas>
</template>
<script lang="ts">
import { useRobotArrow } from "@/util/RosUtil";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: "Text",
    setup() {
        const canvas = ref(null)

        onMounted(() => {
            const { createjs } = window

            var stage = new createjs.Stage("canvas");
            (window as any).stage = stage
            var robotMarker = new window.ROS2D.NavigationArrow({
                size: 40,
                strokeSize: 10,
                pulse: true,
                fillColor: "#F6AB00",
                strokeColor: "#F6AB00"
            });
            console.log('robotMarker', robotMarker)
            stage.addChild(robotMarker)
            console.log('stage', stage)
            stage.scale = 0.5
            robotMarker.x = 220;
            robotMarker.y = 220;
            stage.update();

            useRobotArrow(stage, robotMarker, (rotation: number) => {
                console.log(rotation)
            })

            // Sorry if my math terms are wrong.

            // function drawArrow(arrow:any, length:any, frequency:any, amplitude:any) {
            //     // 给箭头一个固定长度
            //     length = 100;
            //     arrow.graphics.clear().ss(3).s("#000").mt(0, 0);
            //     var arrowSize = 15;
            //     for (var i = 0, l = (length - arrowSize) / frequency; i < l; i++) {
            //         var p = frequency / 4, breakAfter = false,
            //             a = amplitude;

            //         // More fun line amplitude
            //         a = Math.pow(amplitude, 0.5 / l) * i;

            //         // Prevent the line from being longer than the arrow
            //         // Adjusts the period to fit.
            //         if (i * frequency + p * 2 > length - arrowSize) {
            //             p = (length - arrowSize * 1.5 - i * frequency) / 2;
            //             breakAfter = true;
            //         }

            //         // Draw the first part of the wave
            //         arrow.graphics.qt(i * frequency + p, a, i * frequency + p * 2, 0);
            //         if (breakAfter) { break; } // Break if it would be too long

            //         // Adjust the period if the second part is too long
            //         if (i * frequency + p * 4 > length - arrowSize) {
            //             p = (length - arrowSize * 1.5 - i * frequency) / 4; // 1.5 because its a triangle
            //         }

            //         // Draw the second part of the wave
            //         arrow.graphics.qt(i * frequency + p * 3, -a, i * frequency + p * 4, 0);
            //     }

            //     // Draw the arrow head at the end.
            //     arrow.graphics.f("#000");
            //     arrow.graphics.dp(length - arrowSize, 0, arrowSize, 3);
            // }


            // var current:any = null;
            // stage.on("stagemousedown", function () {

            //     // Create a new arrow on stage press
            //     current = new createjs.Shape().set({ x: stage.mouseX, y: stage.mouseY });
            //     stage.addChild(current);

            //     // Update the current arrow on move
            //     var moveListener = stage.on("stagemousemove", function () {
            //         // Determine the length between the start and end point using pythagoras
            //         var w = stage.mouseX - current.x;
            //         var h = stage.mouseY - current.y;
            //         var l = Math.sqrt(w * w + h * h);

            //         // Draw the arrow.
            //         // Math.sqrt on the amplitude and frequency make it scale as it gets larger
            //         drawArrow(current, l, Math.sqrt(l), 0);
            //         console.log(l)
            //         // Rotate to touch the mouse
            //         current.rotation = Math.atan2(h, w) * 180 / Math.PI;
            //         stage.update();
            //     });

            //     // Stop the drag
            //     var upListener = stage.on("stagemouseup", function () {
            //         stage.off("stagemousemove", moveListener);
            //         stage.off("stagemouseup", upListener);
            //         // current = null;
            //         stage.removeChild(current)
            //         stage.update()
            //     });
            // });

        })

        return {
            canvas
        }
    }
});
</script>
<style>
</style>