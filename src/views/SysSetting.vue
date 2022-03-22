<template>
    <div class="dashboard">
        <h4 class="title">系统设置</h4>
        <a-form
            :model="state"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 14 }"
            labelAlign="left"
        >
            <a-form-item label="每步距离">
                <a-input-number v-model:value="state.step" :step="0.1"/>
            </a-form-item>
            <a-form-item label="独占状态">
                <a-switch v-model:checked="state.exclusiveState" />
            </a-form-item>
            <a-form-item label="调度模式">
                <a-switch v-model:checked="state.schedulingMode" />
            </a-form-item>
            <a-form-item label="低功耗">
                <a-switch v-model:checked="state.lowPowerConsumption" />
            </a-form-item>
            <a-form-item label="系统音量">
                <a-slider id="test" v-model:value="state.volume" />
            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useSystemStore } from '@/store/system'

export default defineComponent({

    setup() {
        const store = useSystemStore()
        const state = computed(() => store.$state)

        const onSubmit = () => {

        }
        return {
            onSubmit,
            state
        }

    },

})

</script>

<style lang="scss" scoped>
.title {
    border-bottom: 1px solid #e1e1e1;
}
</style>
