<template>
    <div class="home-panel">
        <div class="robot-info">
            <div class="header">
                <h5 class="robot-title">机器人实时信息</h5>
                <div class="status" :class="[rosStatus]"></div>
                <a-button @click="onConnect" size="small">机器人连接</a-button>
            </div>
            <a-input
                class="ros-address"
                v-model:value="href"
                size="small"
                placeholder="请输入链接"
            />
            <div class="info-item">
                <div class="label">信号</div>
                <div class="info"></div>
            </div>
            <div class="info-item">
                <div class="label">电量</div>
                <div class="info">
                    <div class="battery-info">
                        <div class="battery-count" :style="batteryStyle"></div>
                    </div>
                    {{ battery }} %
                </div>
            </div>
            <div class="info-item">
                <div class="label">温度</div>
                <div class="info"></div>
            </div>
            <div class="info-item">
                <div class="label">预计可用</div>
                <div class="info"></div>
            </div>
            <div class="info-item">
                <div class="label">系统状态</div>
                <div class="info"></div>
            </div>
            <div class="info-item">
                <div class="label">当前位置</div>
                <div class="info"></div>
            </div>
        </div>
        <div class="robot-"></div>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, reactive, toRefs } from 'vue'
import RosManager from '@/util/RosManager'

export default defineComponent({
    setup() {
        const storageHref = localStorage.getItem('href')

        const state = reactive({
            href: storageHref || '121.5.20.20:9090',
            rosStatus: 'disconnected',
            battery: 0
        });

        const COLOR = {
            GREEN: '#61C361'
        }
        const batteryStyle = computed(() => {
            return {
                backgroundColor: COLOR.GREEN,
                width: `${state.battery}%`
            }
        })
        const ONE_MINUTE = 60 * 1000;
        // 电量topic
        const listener = new window.ROSLIB.Topic({
            ros: RosManager.ros,
            name: "/battery_level",
            messageType: "std_msgs/UInt8",
            throttle_rate: ONE_MINUTE
        });
        listener.subscribe(function ({ data }: {
            data: number;
        }) {
            state.battery = data;
        });
        onUnmounted(() => {
            listener.unsubscribe();
        });

        const onConnect = () => {
            localStorage.setItem('href', state.href)
            RosManager.connect('ws://' + state.href)
        }
        RosManager.ros.on('connection', () => {
            state.rosStatus = 'success'
        })
        return {
            ...toRefs(state),
            onConnect,
            batteryStyle
        };
    }
})
</script>
<style lang="scss" scoped>
.home-panel {
    width: 300px;
    height: 100%;
    background-color: #fff;
    padding: 24px 0;
    flex-shrink: 0;
    z-index: 1;
    .robot-info {
        border-bottom: 2px solid #e3e3e3;
        padding: 0 20px;
        overflow: hidden;
        .header {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 6px;
            align-items: center;
            .robot-title {
                text-align: left;
                font-size: 14px;
                margin-bottom: 0;
            }
            .status {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin:0 8px;
                background-color: $gray-color;
                &.error {
                    background-color: $error-color;
                }
                &.success {
                    background-color: $success-color;
                }
            }
        }
        .ros-address {
            margin-bottom: 23px;
            width: 100%;
        }

        .info-item {
            width: 50%;
            float: left;
            // display: inline-block;
            font-size: 12px;
            margin-bottom: 18px;
            .label {
                color: #666666;
            }
            .info {
                height: 20px;
                display: flex;
                align-items: center;
            }
            .battery-info {
                width: 22px;
                height: 12px;
                background: url("../../assets/battery-green.png") no-repeat;
                background-size: 100% 100%;
                padding: 2px 3px 2px 2px;
                margin-right: 6px;

                .battery-count {
                    height: 100%;
                }
            }
        }
    }
}
</style>
