<template>
    <div class="axis">
        <div class="y"></div>
        <div class="x"></div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {

    },
})
</script>
<style lang="scss" scoped>
.axis {
    position: absolute;
    bottom: 20px;
    right: 120px;
    width: 50px;
    height: 40px;
    $color-danger: #f8504d;
    .y {
        width: 5px;
        height: 40px;
        background-color: $color-danger;
        position: relative;
        &::after{
            content: "Y";
            font-size: 14px;
            color: #000;        
            top: -24px;
            left: -1px;
            position: absolute;
        }
        &::before {
            content: "";
            position: absolute;
            left: -7.5px;
            top: -5px;
            width: 0; 
            height: 0; 
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 10px solid $color-danger;
        }
    }
    .x {
        width: 50px;
        height: 5px;
        background-color: $color-danger;
         &::after{
            content: "X";
            font-size: 14px;
            color: #000;
            position: absolute;
            right: -16px;
            bottom: -12px;
    
        }
        &::before {
            content: "";
            position: absolute;
            right: -4px;
            bottom: -12px;
            width: 0; 
            height: 0; 
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            border-left: 10px solid $color-danger;
        }
    }
}
</style>
