<template>
    <ul class="map-actions">
        <li class="action-item" @click="$emit('action', 'zoom-in')">
            <PlusCircleOutlined />
        </li>
        <li class="action-item" @click="$emit('action', 'zoom-out')">
            <MinusCircleOutlined />
        </li>
        <li class="action-item" @click="$emit('action', 'rotate-right')">
            <ReloadOutlined />
        </li>
        <li class="action-item dir-reverse" @click="$emit('action', 'rotate-left')">
            <ReloadOutlined />
        </li>
        <!-- <li class="action-item" @click="locate">
            <AimOutlined />
        </li>
        <li class="action-item" @click="clear">
            <ClearOutlined />
        </li> -->
    </ul>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { PlusCircleOutlined, MinusCircleOutlined, UndoOutlined, RedoOutlined, AimOutlined, ReloadOutlined, ClearOutlined } from '@ant-design/icons-vue'
import rosManager from '@/util/RosManager'
export default defineComponent({
    components: { PlusCircleOutlined,MinusCircleOutlined, UndoOutlined, RedoOutlined, AimOutlined , ReloadOutlined, ClearOutlined },

    setup(props, { emit }) {
        let zoomView 
        const zoomIn = ()=>{
            zoomView = new window.ROS2D.ZoomView({
			rootObject : rosManager.viewer.scene
		});
            zoomView.zoom(0.9)
        }
        const zoomOut = ()=>{
            rosManager.viewer.scaleToDimensions(
                rosManager.gridClient.currentGrid.width * 0.1,
                rosManager.gridClient.currentGrid.height * 0.1
            );
        }
        const rotateLeft = ()=>{

        }
        const rotateRight = ()=>{}
        const locate = ()=>{}
        const clear = ()=>{}
        return {
            zoomIn,
            zoomOut,
            rotateLeft,
            rotateRight,
            locate,
            clear,
        }
    },

})

</script>

<style lang="scss" scoped>
.map-actions {
    position: absolute;
    bottom: 20px;
    right: 10px;
    width: 40px;
    .action-item {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 4px;
        font-size: 22px;
        cursor: pointer;
    }
    .dir-reverse{
        transform: scaleX(-1);

    }
}
</style>
