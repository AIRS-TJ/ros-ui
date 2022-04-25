<template>
    <div class="map-con">
        <ul class="action-list">
            <li
                class="action-item"
                v-for="item in actions"
                :key="item.name"
                :class="{ active: item.name === activeAction, disable: item.disable }"
                @click="onAction(item)"
            >
                <SvgIcon :name="item.icon" color="#333" stroke="#333" class="action-svg-icon" />
                <span class="action-name">{{ item.name }}</span>
            </li>
        </ul>
        <div class="map-wrapper" ref="mapWrapper">
            <div class="zoom-viewer" ref="zoomViewer">
                <div id="map" ref="mapEl" :style="zoomCanvasStyle"></div>
            </div>
        </div>

        <div class="manual-control">
            <div class="direction-control" v-show="isManualControl">
                <div class="dir-item top" @click="manualAction('forward')">
                    <SvgIcon
                        name="turn-forward"
                        color="#333"
                        stroke="#333"
                        class="action-svg-icon"
                    />
                </div>
                <div class="dir-item left" @click="manualAction('left')">
                    <SvgIcon name="turn-left" color="#333" stroke="#333" />
                </div>
                <div class="dir-item right" @click="manualAction('right')">
                    <SvgIcon name="turn-right" />
                </div>
                <div class="dir-item bottom" @click="manualAction('back')">
                    <SvgIcon name="turn-back" />
                </div>
                <div class="circle circle-1"></div>
                <div class="circle circle-2">
                    <a-button
                    type="primary"
                    danger
                    shape="circle"
                    size="small"
                    class="stop"
                    @click="stop"
                >
                    <template #icon>
                        <StopOutlined />
                    </template>
                </a-button>
                </div>
            </div>

            <!-- <a-slider v-model:value="systemState.step" 
            v-show="isManualControl"/>-->

            <div class="speed-control" v-show="isManualControl">
                <a-input-number
                    class="speed-control-input"
                    v-model:value="systemState.step"
                    :step="0.1"
                    size="small"
                />
                <span style="margin-left: 4px;">m/s</span>
            </div>

            <div class="manual-switch">
                手动遥控
                <a-switch size="small" v-model:checked="isManualControl" style="margin-left: 4px;" />
            </div>
        </div>

        <!-- <HomeMapBar /> -->
        <HomeMapActions @action="onMapActions" />
        <MapAxis :style="{ transform: `rotate(${rotate}deg)` }" />
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs, computed, onMounted, nextTick, watch } from 'vue'
import { StopOutlined, ArrowUpOutlined, ArrowDownOutlined, UndoOutlined, RedoOutlined } from '@ant-design/icons-vue'
import rosManager from '@/util/RosManager'
import useStation from '@/hooks/station'
import { useSystemStore } from '@/store/system'
import HomeMapActions from './HomeMapActions.vue'
import MapAxis from './MapAxis.vue'
import HomeMapBar from './HomeMapBar.vue'
import { useMapSize } from '@/hooks/map'
import { useAppStore } from '@/store/app'

const actions = [
    // { icon: 'select', name: '选择' },
    { icon: 'station', name: '站点', disable: false, job: useStation },
    // { icon: 'passing-point', name: '途径点' },
    // { icon: 'straight-line', name: '直线' },
    // { icon: 'arc', name: '曲线' },
    // { icon: 'round-corner', name: '圆角' },
    { icon: 'area', name: '区域', disable: true },
    { icon: 'qr-code', name: '二维码', disable: true },
]
export default defineComponent({
    components: { StopOutlined, ArrowUpOutlined, ArrowDownOutlined, UndoOutlined, RedoOutlined, HomeMapActions, HomeMapBar, MapAxis },
    setup() {
        const systemStore = useSystemStore()
        const systemState = computed(() => systemStore.$state)

        const appStore = useAppStore()
        const isCreatingNewMap = computed(() => appStore.$state.isCreatingNewMap )

        watch(
            isCreatingNewMap,
            (val:boolean)=>{
                state.isManualControl = val
            }
        )

        const state = reactive({
            actions,
            isManualControl: false,
            activeAction: '',
            zoomScale: 1,
            rotate: 0,
            mapWidth: 616,
            mapHeight: 500,
        })
        const mapEl = ref()
        const zoomViewer = ref()
        const mapWrapper = ref()

        onMounted(() => {
            nextTick(() => {
                const { width, height } = mapEl.value.getBoundingClientRect()
                console.log(width, height)
                rosManager.initMap({ divID: 'map', width, height })
                rosManager.displayRobot()

                useMapSize(({ width, height }: { width: number, height: number }) => {
                    state.mapWidth = width
                    state.mapHeight = height
                    mapEl.value.removeChild(mapEl.value.firstChild)
                    rosManager.initMap({ divID: 'map', width, height })
                    rosManager.displayRobot()

                    state.zoomScale = 0;
                    state.rotate = 0;
                    fitMap({ width, height })
                    nextTick(() => {
                        showMapInCenter()
                    })
                })
                showMapInCenter()
            })

        })

        const showMapInCenter = () => {
            const w = 10000, h = 10000;
            mapWrapper.value.scrollLeft = (w - mapWrapper.value.offsetWidth) / 2
            mapWrapper.value.scrollTop = (h - mapWrapper.value.offsetHeight) / 2
        }

        const fitMap = ({ width, height }: { width: number, height: number }) => {
            const wRatio = mapWrapper.value.offsetWidth / width
            const hRatio = mapWrapper.value.offsetHeight / height
            const ratio = Math.min(wRatio, hRatio) // 选取最小比值，作为放大比例
            state.zoomScale = ratio
        }
        const onAction = (action: any) => {
            if(action.disable) return
            console.log(rosManager)
            state.activeAction = action.name
            action.job && action.job()
        }
        const manualAction = (direction: 'forward' | 'back' | 'left' | 'right') => {
            rosManager.go(direction)
        }

        type ActionType = 'zoom-in' | 'zoom-out' | 'rotate-right' | 'rotate-left'
        const onMapActions = (action: ActionType) => {
            switch (action) {
                case 'zoom-in':
                    if (state.zoomScale <= 1) { state.zoomScale += 0.1 };
                    break;
                case 'zoom-out':
                    if (state.zoomScale >= 0.5) { state.zoomScale -= 0.1 };
                    break;
                case 'rotate-left':
                    // state.rotate = (state.rotate - 90) % 360;
                    break;
                case 'rotate-right':
                    // state.rotate = (state.rotate + 90) % 360;
                    break;
            }
        }
        const stop = () => {
            rosManager.stop()
        }
        const zoomCanvasStyle = computed(() => {
            return {
                transform: `scale(${state.zoomScale}) rotate(${state.rotate}deg)`,
                width: state.mapWidth + 'px',
                height: state.mapHeight + 'px',
                // marginTop: `calc(50% - ${state.mapHeight / 2}px)`
            }
        })
        return {
            ...toRefs(state),
            mapEl,
            mapWrapper,
            zoomViewer,
            systemState,
            onAction,
            manualAction,
            stop,
            onMapActions,
            zoomCanvasStyle,
        }

    },
})
</script>
<style lang="scss" scoped>
.map-con {
    width: calc(100% - 272px);
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    position: relative;
    user-select: none;

    .map-wrapper {
        overflow: scroll;
        height: 100%;
        width: 100%;
        flex-grow: 1;
        .zoom-viewer {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #map {
            background-color: #e4e4e4;
            transform-origin: center;
        }
    }
    .action-list {
        width: 100%;
        height: 48px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: flex-start;
        background-color: #fff;
    }
    .action-item {
        box-sizing: border-box;
        height: 48px;
        width: 48px;
        text-align: center;
        cursor: pointer;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding-top: 8px;
        &:hover {
            background-color: #e1e1e1;
        }
        &.active {
            background-color: #d3d1d1;
        }
        &.disable {
            background: #e4e4e4;
            cursor: not-allowed;
        }
        .action-svg-icon {
            height: 12px;
            width: 10px;
        }
        span.action-name {
            font-size: 12px;
        }
    }
    .manual-control {
        position: absolute;
        bottom: 10px;
        left: 10px;
        border-radius: 2px;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
        background-color: #fff;
        padding: 10px 24px;
        font-size: 12px;
        width: 200px;
        max-height: 300px;

        .direction-control {
            position: relative;
            height: 153px;
            width: 153px;
            margin-top: 14px;
            margin-bottom: 24px;
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: center;
            & > .dir-item {
                width: 55px;
                height: 55px;
                line-height: 33px;
                position: absolute;
                cursor: pointer;
                text-align: center;
                z-index: 9;
            }
            .top {
                top: 0;
                left: 50%;
                transform: translateX(-50%);
            }
            .left {
                left: 0;
                top: 55px;
            }
            .right {
                right: 0;
                top: 55px;
            }
            .bottom {
                top: 110px;
                left: 50%;
                transform: translateX(-50%);
            }
        }
        .speed-control {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin-bottom: 24px;

            &-input {
                flex-grow: 1;
            }
        }
        .manual-switch {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
        }
        .circle {
            border-radius: 50%;
            border: 1px solid #eeeeee;
            position: absolute;
            z-index: 0;
            &.circle-1 {
                left: 0;
                top: 0;
                width: 153px;
                height: 153px;
            }
            &.circle-2 {
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                .ant-btn-dangerous.ant-btn-primary {
                    background: var(--main-color);
                    border-color: var(--main-color);
                }
            }
        }
    }
}
</style>
