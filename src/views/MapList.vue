<template>
    <div class="map-list-con dashboard">
        <div class="action-header">
             <a-button @click="onCreateMap" size="small" class="ros-btn-primary" type="primary">
                <template #icon>
                    <PlusOutlined />
                </template>
                新建地图
            </a-button>
            <a-button @click="showMapList" size="small" class="ros-btn"
                style="margin-left: 20px">
                <template #icon>
                    <PlusOutlined />
                </template>
                导入地图
            </a-button>

            <a-input-search
                class="search"
                v-model:value="keywords"
                placeholder="搜索地图"
                style="width: 200px; align-self:flex-end;"
                @search="onSearch"
            />
        </div>

        <a-table :dataSource="mapDataSource" :columns="mapDataColumns">
            <template #name="{ record }">
                <span>
                    <img :src="record.img" />
                    {{ record.name }}
                </span>
            </template>
        </a-table>
    </div>
</template>
<script lang="ts">
import { useAppStore } from '@/store/app'
import { createTopic } from '@/util/RosUtil'
import { defineComponent, onMounted, reactive, toRefs } from 'vue'

interface State {
    keywords:string
    mapDataSource: any[]
    mapDataColumns: any[]
}
export default defineComponent({

    setup() {
        
        const appStore = useAppStore()
        const state = reactive<State>({
            keywords: '',
            mapDataSource: [],
            mapDataColumns: [{
                title: '地图名称',
                dataIndex: 'name',
                key: 'name',
                slots: {
                    customRender: 'name',
                },
            },
            {
                title: '更新时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                defaultSortOrder: 'descend',
                sorter: (a: any, b: any) => new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime(),
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                defaultSortOrder: 'descend',
                sorter: (a: any, b: any) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
            },
            {
                dataIndex: 'action',
                key: 'action',
                width: 150,
                slots: {
                    title: 'customTitle',
                    customRender: 'action',
                },
            },],
        })
        const onSearch = (e) => {
            state.keywords = e
         }

         const showMapList = () => {
            createTopic('map_list').subscribe(({ data }: { data: string }) => {
                const mapNames = data.split('#')[1] || ''
                const mapNameLIst = mapNames.split(' ').map((name, idx) => {
                    return {
                        key: `${idx}`,
                        name,
                        createTime: '',
                        updateTime: ''
                    }
                })
                state.mapDataSource = mapNameLIst;
            })
        }
         const onCreateMap = () => {
            appStore.$patch({
                isCreatingNewMap: true
            })
            createTopic("new_map").subscribe((data: any) => {
                console.log('onCreateMap', data)
            })
        }
        onMounted(() => {
           showMapList()
        })

        return {
            ...toRefs(state),
            onSearch,
            onCreateMap,
            showMapList,
        }

    },

})

</script>

<style lang="scss">
.map-list-con {
    
    .action-header {
        // display: flex;
        // justify-content: flex-start;
        // align-items: center;
        height: 36px;
        margin-bottom: 50px;
        ;
        .search{ 
            height: 36px;
            align-self: flex-end;
            float:right;
        }
    }
}
</style>
