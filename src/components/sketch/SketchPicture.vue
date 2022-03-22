<template>
    <img class='sketch-image' :src='src' />
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'SketchPicture',
    props: {
        src: {
            type:String
        }
    }
})

</script>
<style lang="scss">
.sketch-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>