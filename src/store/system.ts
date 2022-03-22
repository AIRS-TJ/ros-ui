import { defineStore } from 'pinia'

interface SystemState {
    exclusiveState: boolean
    schedulingMode: boolean
    lowPowerConsumption: boolean
    volume: number
    step: number
}
export const useSystemStore = defineStore('system', {
    state: (): SystemState => {
        return {
            exclusiveState: true, // 独占状态
            schedulingMode: true, // 调度模式
            lowPowerConsumption: true, //低功耗
            volume: 50,
            step: 0.1,
        }
    },
    getters: {
        sortedList: (state) => {
            return state
            
        },
    },

})
