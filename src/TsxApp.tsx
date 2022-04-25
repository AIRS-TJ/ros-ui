import { defineComponent } from "vue"; // vue-demi

export default defineComponent({
  setup(){
    return ()=> (
      <div>hello world! <router-view></router-view> </div>
    )
  }
})