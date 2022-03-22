import { defineComponent } from "vue";
import { MENU as menu } from '@/constant'
import { Menu } from 'ant-design-vue'
import { useRouter } from "vue-router";
import HomeHeader from '@/components/home/HomeHeader.vue'
import SvgIcon from '@/components/svg/SvgIcon.vue'


export default defineComponent({
  components: { HomeHeader },
  setup(){
    const router = useRouter()
    const onMenuClick = (e:any) => {
      console.log('/dashboard/' + e.key)
      router.push('/dashboard/' + e.key)
    }
    return ()=> (
      <a-layout id="layout">
      <a-layout-sider width="140" className="side-menu">
        <div class="logo" >
          <SvgIcon name="aris-logo" class="logo-icon"/>
        </div>
        <a-menu
          mode="inline"
          defaultSelectedKeys={['/']}
          style={{height: 'calc(100% - 60px)', borderRight: 0}}
          onClick={onMenuClick}
        >
          {
            menu.map(item => {
              const menuTag = item.children.length ? Menu.SubMenu : Menu.Item;
              const slots = { title: ()=> <span>{item.name}</span> }
              return (
                <menuTag key={item.link} v-slots={slots}>
                  <span v-show={!item.children.length}>{item.name}</span>
           
                  {
                    item.children && item.children.map(subItem => {
                      return <a-menu-item key={subItem.link}>{subItem.name}</a-menu-item>
                    })
                  }
                </menuTag>
              )
            })
          }
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header className="layout-header">
          <HomeHeader />
        </a-layout-header>
        <a-layout>
          <a-layout-content
            className="main-content"
          >
            <router-view />
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
    )
  }
})


      