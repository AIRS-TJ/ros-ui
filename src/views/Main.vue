<template>
  <div class="home-con">
    <HomeMap />
    <HomePanel />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import HomeMap from '@/components/home/HomeMap.vue'
import HomePanel from '@/components/home/HomePanel.vue'

export default defineComponent({
  components: {
    HomeMap,
    HomePanel
  },
  setup() {

  },
})
</script>

<style lang="scss" scoped>
.home-con {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
}
</style>