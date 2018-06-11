<template>
<el-container class="hy-container">
  <!-- header -->
  <el-header class="hy-header">
    <div class="logo">
      <span>Hydrogen Cloud</span>
    </div>
    <div class="user">
      <el-dropdown>
        <span class="el-dropdown-link">
          <a class="avantar">
            <img :src="userInfo.avantar"/>
          </a>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>{{userInfo.username}}</el-dropdown-item>
          <el-dropdown-item>
            <a @click="logout"><span class="fa fa-sign-out"></span>退出</a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div style="margin-left: 15px;">{{userInfo.nickname}}</div>
    </div>
  </el-header>

  <el-container class="hy-container">
    <!-- 边栏，系统菜单 -->
    <el-aside width="220px">
      <el-menu default-active="1" class="hy-menu" @select="selectMenu"
        background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <!-- 首页 -->
        <el-menu-item :index="initMenu.name">
          <i class="el-icon-location"></i>
          <span slot="title">{{initMenu.title}}</span>
        </el-menu-item>
        <!-- 动态菜单 -->
        <div v-for="menu in menus[0]" :key="menu.name">
          <el-submenu :index="menu.name">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{menu.title}}</span>
            </template>
            <el-menu-item v-for="subMenu in menus[menu.id]" :key="subMenu.name" :index="subMenu.name">{{subMenu.title}}</el-menu-item>
          </el-submenu>
        </div>
      </el-menu>
    </el-aside>

    <!-- 内容区 -->
    <el-main>
      <!-- 一级动态标签页 -->
      <el-tabs v-model="tabValue" type="card" @tab-click="changeTab" @tab-remove="removeTab">
        <el-tab-pane :key="item.name" v-for="item in tabs" :label="item.title" :name="item.name" :closable="item.name!='home'">
        </el-tab-pane>
        <router-view></router-view>
      </el-tabs>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import api from '@/api/api'

export default {
  name: 'Index',
  data () {
    return {
      // userInfo: {}, // 用户信息

      menus: {}, // 菜单项，嵌套结构
      menuIndex: {}, // 菜单索引，便于根据菜单的name查找对应的菜单对象
      initMenu: {
        title: '首页',
        name: 'home'
      }, // 任何用户有权访问的首页菜单

      tabs: [], // 一级动态标签页
      tabValue: 'home', // 当前激活的tab
      tabIndex: 1
    }
  },
  computed: {
    userInfo: function () {
      return this.$store.getters.getUserInfo
    }
  },
  methods: {
    /* eslint-disable */
    // 登出
    logout () {
      let that = this
      api.get('/oauth/revoke-token').finally(function () {
        localStorage.clear()
        that.$message({
          message: '已退出登录',
          type: 'success'
        })
        that.$router.push({
          name: 'login'
        })
      })
    },
    // 选中菜单事件的回调
    selectMenu (key, keyPath) {
      let added = false
      for (let idx in this.tabs) {
        let tab = this.tabs[idx]
        if (tab.name === key) {
          added = true;
          break;
        }
      }
      if (!added) {
        this.addTab(this.menuIndex[key])
      }
      this.tabValue = key
      this.$router.push({name: key})
    },

    // 添加tab页
    addTab (tabInfo) {
      this.tabs.push({
        title: tabInfo.title,
        name: tabInfo.name,
        content: tabInfo.content
      });
      this.tableValue = tabInfo.name
    },
    // 关闭tab页
    removeTab (tabName) {
      let tabs = this.tabs
      let activeName = this.tabValue
      if (activeName === tabName) {
        tabs.forEach((tab, index) => {
          if (tab.name === tabName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
              this.$router.push({name: activeName})
            }
          }
        })
      }

      this.tabValue = activeName
      this.tabs = tabs.filter(tab => tab.name !== tabName)
    },

    // 切换tab页
    changeTab (tab) {
      this.$router.push({name: tab.name})
    },

    // 构建菜单
    /* eslint-disable */
    getMenus () {
      let that = this
      api.get('/api/menus').then((res) => {
        if(res.data.res === 'S'){
          that.constructMenu(res.data.items)
        } else {
          throw res.data.msg
        }
      }).catch((err) => {
        that.$message({
          message: '无法获取菜单',
          type: 'error'
        })
      })
    },

    constructMenu (menus) {
      let menuMap = {}
      let menuIndex = {}
      for(let i in menus){
        let menu = menus[i]
        if(!menuMap[menu.parentId]){
          menuMap[menu.parentId] = {}
        }
        menuMap[menu.parentId][menu.id] = menu
        menuIndex[menu.name] = menu
      }

      this.menus = menuMap
      this.menuIndex = menuIndex
    }
  },

  mounted () {
    this.$store.dispatch("refreshUserInfo") // 首次加载获取用户信息
    this.tabs.push(this.initMenu)
    this.getMenus()
    this.$router.push({name: this.initMenu.name})
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hy-header {
  padding: 0;
  background-color: #303133;
  color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.logo {
  display: flex;
  font-size: 30px;
  align-items: center;
  padding-left: 15px;
}
.user {
  display: flex;
  align-items: center;
  padding-right: 15px;
}
.avantar img {
  width: 45px;
  height: 45px;
  border: 3px solid #DCDFE6;
  border-radius: 50%;
}
.hy-container {
  height: 100%;
}
.hy-menu {
  text-align: left;
  height: 100%;
}
</style>
