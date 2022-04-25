<template>
    <div class="header-con">
        <div class="left-layout">
            <a-button @click="onMapListVisibleChange(true)" type="primary" size="small" class="ros-btn-primary"
                style="margin-left: 10px">
                <template #icon>
                    <DownloadOutlined />
                </template>
                加载地图
            </a-button>

            <a-button @click="onCreateMap" size="small" class="ros-btn-primary" type="primary"
                style="margin-left: 20px">
                <template #icon>
                    <PlusOutlined />
                </template>
                新建地图
            </a-button>

            <div class="create-map-action" v-if="isCreatingNewMap">
                <a-button @click="onSaveMap" type="primary" size="small" class="ros-btn-primary"
                    style="margin-left: 10px">保存</a-button>

                <a-button @click="onQuitMap" type="primary" size="small" class="ros-btn-primary"
                    style="margin-left: 20px">退出</a-button>
                <span class="map-name">{{ mapNameFormState.newMapName }}</span>
            </div>
        </div>
        <div class="right-layout">
            <a-button class="emergency-stop" size="small" @click="emergencyStop">急停</a-button>
            <div class="info-icon"></div>
            <span style="margin-left: 24px;margin-right: 8px; font-size: 16px;">admin</span>
            <DownOutlined style="font-size: 12px;" />
        </div>
    </div>

    <a-modal :visible="showLoadPap" @cancel="onMapListVisibleChange(false)" title="加载地图" width="1000px" :footer="null">
        <a-input-search v-model:value="mapFileSearchKeywords" placeholder="地图名称"
            style="width: 200px; margin-bottom: 20px;" @search="onSearchMapFile" />
        <a-table :dataSource="mapDataSource" :columns="mapDataColumns" v-if="mapFileViewType === 'list'">
            <template #customTitle>
                <img class="list-icon__card" src="../../assets/list-card.png" style="cursor: pointer"
                    @click="toggleMopFileView('card')" />
                <img class="list-icon" src="../../assets/list-active.png" style="margin-left: 5px; cursor: pointer"
                    @click="toggleMopFileView('list')" />
            </template>
            <template #name="{ record }">
                <span>
                    <img :src="record.img" />
                    {{ record.name }}
                </span>
            </template>
        </a-table>
        <div class="card-view" v-if="mapFileViewType === 'card'">
            <div class="sort-action">更新时间</div>
            <div class="card-view-list">
                <div class="card-item" v-for="item in mapDataSource" :key="item.key">
                    <!-- <img src class="map-img" /> -->
                    <p>{{ item.name }}</p>
                    <p>{{ item.updateTime }}</p>
                </div>
            </div>
        </div>
    </a-modal>

    <a-modal v-model:visible="showMapNameDialog" title="保存地图" @ok="doSaveMap" okText="确认" cancelText="取消">
        <div class="map-name-input">
            <a-form
                :model="mapNameFormState"
                :rules="rules"
            >
                <a-form-item has-feedback label="地图名称">
                    <a-input v-model:value="mapNameFormState.newMapName" name="newMapName" :maxlength="20" />
                </a-form-item>
            </a-form>
            <span class="map-name-count">{{ mapNameFormState.newMapName.length }} / 20</span>
        </div>
        </a-modal>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, computed, watch, h } from 'vue'
import { DownloadOutlined, PlusOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import RosManager from '@/util/RosManager'
import { createTopic } from '@/util/RosUtil';
import { useAppStore } from '@/store/app'
import { notification } from 'ant-design-vue';

interface State {
    mapDataSource: { key: string, name: string, createTime: string, updateTime: string }[]
    mapDataColumns: any
    mapFileSearchKeywords: string
    mapFileViewType: 'list' | 'card'
    mapNameFormState:any,
    showMapNameDialog: boolean
    rules: any

}

const validateName =  async (_rule, value: string) => {
    console.log('_rule', _rule, 'value', value)
    const chinessReg = /^[\u4e00-\u9fa5]/
      if (chinessReg.test(value)) {
        return Promise.reject('地图名称不能使用中文');
      }
    return Promise.resolve();
    };

export default defineComponent({
    components: { DownloadOutlined, PlusOutlined, DownOutlined },
    setup() {
        const state = reactive<State>({
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
            mapFileSearchKeywords: '',
            mapFileViewType: 'list',
            showMapNameDialog: false,
            mapNameFormState: {
                newMapName: ''
            },
            rules: {
                newMapName: [{ required: true, validator: validateName, trigger: 'input' }],
            }
        })

        const appStore = useAppStore()
        const showLoadPap = computed(() => appStore.$state.showLoadPap)
        const isCreatingNewMap = computed(() => appStore.$state.isCreatingNewMap)
        //  地图列表
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

        watch(
            showLoadPap,
            (val) => {
                if (val) { showMapList() }
            }
        )
        const onMapListVisibleChange = (val: boolean) => {
            appStore.$patch({
                showLoadPap: val,
            })
        }


        const onSearchMapFile = () => { }

        const toggleMopFileView = (type: 'list' | 'card') => {
            state.mapFileViewType = type
        }

        const onCreateMap = () => {
            notification.open({
                message: '请遥控机器人进行建图',
                icon: h(ExclamationCircleOutlined, { style: 'color: #f5222d' })
            });
    //         notification.open({
    //     message: 'Notification Title',
    //     description:
    //       'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    //     icon: h(ExclamationCircleOutlined, { style: 'color: #108ee9' }),
    //   });
            appStore.$patch({
                isCreatingNewMap: true
            })
            createTopic("new_map").subscribe((data: any) => {
                console.log('onCreateMap', data)
            })
        }

        const onSaveMap = () => {
            state.showMapNameDialog = true
            state.mapNameFormState.newMapName = ''
        }
        const doSaveMap = () => {
            createTopic(`save_map#${state.mapNameFormState.newMapName}`).subscribe((data: any) => {
                console.log('onSaveMap', data)
            })
            state.showMapNameDialog = false
            appStore.$patch({
                isCreatingNewMap: false
            })
        }

        const onQuitMap = () => {
            state.mapNameFormState.newMapName = ''
            appStore.$patch({
                isCreatingNewMap: false
            })
            createTopic('new_map_quit').subscribe((data: any) => {
                console.log('new_map_quit data is: ', data)
            })
        }

        const emergencyStop = () => {
            RosManager.stop()
        }

        return {
            ...toRefs(state),
            showLoadPap,
            isCreatingNewMap,
            onSearchMapFile,
            toggleMopFileView,
            onCreateMap,
            onMapListVisibleChange,
            onSaveMap,
            onQuitMap,
            doSaveMap,
            emergencyStop,
        }
    },

})

</script>

<style lang="scss">.header-con {
    display: flex;
    height: 100%;

    .list-icon {
        margin-left: 20px;
    }

    .create-map-action {
        position: absolute;
        background-color: #fff;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;

        .map-name {
            margin-left: 10px;
            color: #333;
        }
    }

    .left-layout {
        flex-grow: 1;
        display: flex;
        position: relative;
        align-items: center;
        height: 100%;
        padding-left: 10px;
    }

    .right-layout {
        width: 300px;
        padding: 0 24px;
        flex-shrink: 0;
        display: flex;
        align-items: center;

        .emergency-stop {
            background-color: #FC4646;
            width: 86px;
            height: 36px;
            font-size: 16px;
            border-radius: 4px;
        }

        .info-icon {
            width: 28px;
            height: 24px;
            margin-left: 50px;
            background: url('../../assets/main-header-info.png') center no-repeat;
            background-size: contain;
        }
    }
}

.card-view {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    overflow: hidden;
    background-color: #f9f9f9;

    .sort-action {
        margin-bottom: 30px;
    }

    .card-view-list {
        display: grid;
        row-gap: 34px;
        column-gap: 34px;
        grid-template-columns: repeat(4, 1fr);

        .card-item {
            width: 200px;
            height: 180px;
            display: inline-block;
            border: #999 1px solid;
            border-radius: 4px;
            background-color: #fff;
            overflow: hidden;

            .map-img {
                height: 130px;
                display: block;
            }

            p {
                padding: 0 12px;
                color: #333;
                font-size: 12px;
            }
        }
    }
}

.map-name-input {
    position: relative;

    .map-name-count {
        position: absolute;
        right: 20px;
        top: 6px;
        color: #999999;
    }
}</style>
