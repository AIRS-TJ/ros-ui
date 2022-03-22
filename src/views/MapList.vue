<template>
    <div class="map-list-con dashboard">
        <div class="action-header">
            <a-button type="primary" size="small">新增地图</a-button>
            <a-button size="small" style="margin-left: 20px">导入地图</a-button>

            <a-input-search
                class="search"
                v-model:value="keywords"
                placeholder="搜索地图"
                style="width: 200px"
                @search="onSearch"
            />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({

    setup() {
        const state = reactive({
            keywords: ''
        })
        const onSearch = () => { }


        return {
            ...toRefs(state),
            onSearch,
        }

    },

})

</script>

<style lang="scss" scoped>
.map-list-con {
    

    .action-header {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .search{ align-self: flex-end; }
    }
}
</style>
