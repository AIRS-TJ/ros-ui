<template>
    <header class="login-header"></header>
    <main class="login-body">
        <LoginForm />
    </main>
    <footer class="login-footer">
        <p class="rights">深圳市人工智能与机器人研究院</p>
        <div class="info">
            <p>电话: +86(0)755-23518114</p>
            <p>地址: 深圳市龙岗区坂田街道雅宝路1号星河WORLD G2-14.15层</p>
            <p>Copyright © 2021 All Rights Reserved. CUHK(SZ) 粤ICP备14099122-1号</p>
        </div>
    </footer>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import LoginForm from '../components/login/LoginForm.vue'

export default defineComponent({
    components: { LoginForm },
    setup() {

    },

})

</script>

<style lang="scss" scoped>
.login-header {
    height: 120px;
}
.login-body {
    height: 580px;
    background-color: #333;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 140px;
}
.login-footer {
    color: #999999;
    background: #ffffff;
    text-align: center;

    .rights {
        height: 80px;
        font-size: 14px;
        line-height: 80px;
    }
    .info {
        border-top: 1px solid #d1d1d1;
        font-size: 12px;
        font-family: Alibaba PuHuiTi-Regular, Alibaba PuHuiTi;
        font-weight: 400;
        color: #999999;
        line-height: 24px;
        padding: 19px 0 24px 0;
    }
}
</style>
