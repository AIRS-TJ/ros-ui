<template>
    <div class="header-con">
        <div class="left-layout">
            <a-button
                @click="showLoadPap = true"
                type="primary"
                size="small"
                class="ros-btn-primary"
                style="margin-left: 10px"
            >
                <template #icon>
                    <DownloadOutlined />
                </template>
                加载地图
            </a-button>

            <a-button @click="onCreateMap" size="small" class="ros-btn-primary" type="primary" style="margin-left: 20px">
                <template #icon>
                    <PlusOutlined />
                </template>
                新建地图
            </a-button>

            <div class="create-map-action" v-if="isCreateMap">
                <a-button
                    @click="onSaveMap"
                    type="primary"
                    size="small"
                    class="ros-btn-primary"
                    style="margin-left: 10px"
                >保存</a-button>

                <a-button
                    @click="onQuitMap"
                    type="primary"
                    size="small"
                    class="ros-btn-primary"
                    style="margin-left: 20px"
                >退出</a-button>
                <span class="map-name">{{ newMapName }}</span>
            </div>
        </div>
        <div class="right-layout">
            <a-button class="emergency-stop" type="danger" size="small" @click="emergencyStop">急停</a-button>
            <div class="info-icon"></div>
            <span style="margin-left: 24px;margin-right: 8px; font-size: 16px;">admin</span>
            <DownOutlined style="font-size: 12px;"/>
        </div>
    </div>

    <a-modal v-model:visible="showLoadPap" title="加载地图" width="1000px" :footer="null">
        <a-input-search
            v-model:value="mapFileSearchKeywords"
            placeholder="地图名称"
            style="width: 200px; margin-bottom: 20px;"
            @search="onSearchMapFile"
        />
        <a-table
            :dataSource="mapDataSource"
            :columns="mapDataColumns"
            v-if="mapFileViewType === 'list'"
        >
            <template #customTitle>
                <img
                    class="list-icon__card"
                    src="../../assets/list-card.png"
                    style="cursor: pointer"
                    @click="toggleMopFileView('card')"
                />
                <img
                    class="list-icon"
                    src="../../assets/list-active.png"
                    style="margin-left: 5px; cursor: pointer"
                    @click="toggleMopFileView('list')"
                />
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

    <a-modal
        v-model:visible="showMapNameDialog"
        title="保存地图"
        @ok="doSaveMap"
        okText="确认"
        cancelText="取消"
    >
        <div class="map-name-input">
            <a-input v-model="newMapName" :maxlength="20" />
            <span class="map-name-count">{{ newMapName.length }} / 20</span>
        </div>
    </a-modal>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { DownloadOutlined, PlusOutlined, DownOutlined } from '@ant-design/icons-vue';
import RosManager from '@/util/RosManager'

export default defineComponent({
    components: { DownloadOutlined, PlusOutlined, DownOutlined },
    setup() {
        const state = reactive({
            showLoadPap: false,
            mapDataSource: [
                {
                    key: '1',
                    name: '地图名称2',
                    createTime: '2022-02-27 12:00',
                    updateTime: '2022-02-27 12:00',
                },
                {
                    key: '2',
                    name: '地图名称1',
                    createTime: '2022-02-28 12:00',
                    updateTime: '2022-02-28 12:00',
                },
            ],
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
            newMapName: '',
            isCreateMap: false,
            showMapNameDialog: false
        })

        const onSearchMapFile = () => { }

        const toggleMopFileView = (type: 'list' | 'card') => {
            state.mapFileViewType = type
        }

        const onCreateMap = () => {
            state.isCreateMap = true
        }

        const onSaveMap = () => {
            state.showMapNameDialog = true
            state.newMapName = '地图名称'
        }
        const doSaveMap = () => {
            state.showMapNameDialog = false
        }
        const onQuitMap = () => {
            state.newMapName = '地图名称'
            state.isCreateMap = false
        }

        const emergencyStop = () => {
            RosManager.stop()
        }

        return {
            ...toRefs(state),
            onSearchMapFile,
            toggleMopFileView,
            onCreateMap,
            onSaveMap,
            onQuitMap,
            doSaveMap,
            emergencyStop,
        }
    },

})

</script>

<style lang="scss">
.header-con {
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

        .emergency-stop{
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
            background: url('../../assets/main-header-info.png') center  no-repeat;
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
}
</style>
