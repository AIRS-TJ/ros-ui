<template>
    <div class="login-form">
        <div class="form-tab">
            <div
                class="tab-item"
                :class="{ 'active-tab': tab.label === activeTab }"
                v-for="tab in tabs"
                :key="tab.label"
                @click="onTabChange(tab.label)"
            >{{ tab.name }}</div>
        </div>

        <div class="password-form form-layout" v-show="activeTab === 'password'">
            <a-form :model="passwordState" layout="vertical">
                <a-form-item label="手机/邮箱">
                    <a-input v-model:value="passwordState.account" />
                </a-form-item>
                <a-form-item label="密码">
                    <a-input-password v-model:value="passwordState.password" />
                </a-form-item>
            </a-form>
        </div>
        <div class="pin-form form-layout" v-show="activeTab === 'pin'">

        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
    name: 'LoginForm',
    setup() {
        const state = reactive({
            tabs: [
                { label: 'password', name: '密码登陆' },
                { label: 'pin', name: 'PIN码登陆' }
            ],
            activeTab: 'password',
            passwordState: {
                account: '',
                password: ''
            }
        })

        const onTabChange = (tabLabel: string): void => {
            state.activeTab = tabLabel
        }

        return {
            ...toRefs(state),
            onTabChange,
        }

    },

})

</script>

<style lang="scss" scoped>
.login-form {
    width: 360px;
    background-color: #fff;
    border-radius: 4px;

    .form-tab {
        display: flex;
        height: 45px;
        .tab-item {
            background-color: #dfdfdf;
            color: #999;
            font-size: 14px;
            width: 50%;
            line-height: 45px;
            text-align: center;
            cursor: pointer;
            &.active-tab {
                color: var(--main-color);
                background-color: #fff;
            }
        }
    }
    .form-layout{
        padding: 20px 40px 27px 40px;
    }
}
</style>
