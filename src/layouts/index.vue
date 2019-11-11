<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider
      :trigger="null"
      collapsible
      width = "200"
      v-model="collapsed"
    >
      <div class="logo">
        Vibram
      </div>
      <a-menu theme="dark" mode="inline">
        <a-menu-item key="1">
          <router-link to="/user">
            <a-icon type="user" />
            <span>账号管理</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link to="/new">
            <a-icon type="copy" />
            <span>文章管理</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <router-link to="/banner">
            <a-icon type="setting" />
            <span>banner管理</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="4">
          <router-link to="/flux">
            <a-icon type="pie-chart" />
            <span>流量查看</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="()=> collapsed = !collapsed"
        />
        <div id="components-popover-demo-placement" class="user">
          <div :style="{ marginLeft: `${buttonWidth}px`, clear: 'both', whiteSpace: 'nowrap' }">
            <a-popover placement="bottomRight">
              <template slot="content">
                <a href="#" @click="quit">退出登录</a>
              </template>
              <a href="#">{{user}}</a>
            </a-popover>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  data () {
    return {
      collapsed: false,

      buttonWidth: 70,

      user: ''
    }
  },
  methods: {
    // 退出
    quit () {
      localStorage.removeItem('id')
      localStorage.removeItem('name')
      this.$router.push('/login')
    }
  },
  mounted () {
    this.user = localStorage.getItem('name')
  }
}
</script>

<style>
#components-layout-demo-custom-trigger{
  height: 100vh;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color .3s;
}
.user{
  float: right;
  padding-right: 50px;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  line-height: 32px;
  background: rgba(255,255,255,.2);
  margin: 16px;
  text-align: center;
  color: #fff;
}
</style>

<style scoped>
#components-layout-demo-custom-trigger >>> .ant-layout-sider{
  background: #181818;
}
#components-layout-demo-custom-trigger >>> .ant-menu-dark{
  background: #181818;
}
#components-layout-demo-custom-trigger >>> .ant-menu-item-selected{
  background: #FFC627;
}
#components-layout-demo-custom-trigger >>> .ant-menu-item-selected a{
  color: #181818;
}
#components-layout-demo-custom-trigger >>> .ant-layout-content{
  min-height: auto !important;
}
</style>
