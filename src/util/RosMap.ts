

class RosMap {
    private clickedPolygon: boolean
    private selectedPointIndex: null | number
    private viewer : any
    constructor(viewer: any) {
        this.clickedPolygon = false
        this.selectedPointIndex = null
        this.viewer = viewer
    }

    initMapDrawable() {
        // Callback functions when there is mouse interaction with the polygon
        var pointCallBack =  (type: string, event: any, index: number) => {
            if (type === 'mousedown') {
                if (event.nativeEvent.shiftKey === true) {
                    polygon.remPoint(index);
                }
                else {
                    this.selectedPointIndex = index;
                }
            }
            this.clickedPolygon = true;
        };

        var lineCallBack = (type: string, event: any, index: number) => {
            if (type === 'mousedown') {
                if (event.nativeEvent.ctrlKey === true) {
                    polygon.splitLine(index);
                }
            }
            this.clickedPolygon = true;
        }

        // Create the polygon
        var polygon = new window.ROS2D.PolygonMarker({
            lineColor: window.createjs.Graphics.getRGB(100, 100, 255, 1),
            pointCallBack: pointCallBack,
            lineCallBack: lineCallBack
        });

        // Add the polygon to the this.viewer
        this.viewer.scene.addChild(polygon);

        // Event listeners for mouse interaction with the stage
        this.viewer.scene.mouseMoveOutside = false; // doesn't seem to work

        this.viewer.scene.addEventListener('stagemousemove', (event: any) => {
            // Move point when it's dragged
            if (this.selectedPointIndex !== null) {
                var pos = this.viewer.scene.globalToRos(event.stageX, event.stageY);
                polygon.movePoint(this.selectedPointIndex, pos);
            }
        });

        this.viewer.scene.addEventListener('stagemouseup',  (event: any) => {
            // Add point when not clicked on the polygon
            if (this.selectedPointIndex !== null) {
                this.selectedPointIndex = null;
            }
            else if (this.viewer.scene.mouseInBounds === true && this.clickedPolygon === false) {
                var pos = this.viewer.scene.globalToRos(event.stageX, event.stageY);
                polygon.addPoint(pos);
            }
            this.clickedPolygon = false;
        });
    }
}