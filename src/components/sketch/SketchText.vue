<template>
    <div class="sketch-text" v-html="text" ref="el"></div>
</template>>
<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from "vue";

export default defineComponent ({
    name: 'SketchText',
    props: {
        id: {
            type: Number
        },
        text: {
            type: String
        }
    },
    setup(props, { emit }) {
        //TODO: mutation observer根据文本内容变化重新计算dom大小
        const el = ref<null | HTMLDivElement>(null)
        const resizeObserver = new ResizeObserver(entries => {
            console.log('entries', entries)
            const { contentRect } = entries[0]
            emit('resize', props.id, { height: contentRect.height })

        });

        onMounted(() => {
            resizeObserver.observe(el.value as HTMLDivElement);
        })
        onBeforeUnmount(() => {
            resizeObserver.unobserve(el.value as HTMLDivElement)
        })
        return {
            el
        }
    }
})

</script>
<style lang="scss">
</style>