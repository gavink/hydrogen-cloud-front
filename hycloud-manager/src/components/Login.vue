<template>
<el-container class="hy-container">
  <el-card class="box-card" style="height: 240px; width: 320px;">
    <el-form label-width="0px" size="medium">
      <el-form-item>
        <div>
          <el-input v-model="username" placeholder="用户名">
            <template slot="prepend"><span class="fa fa-user"></span></template>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item>
        <div>
          <el-input v-model="password" type="password" placeholder="密码">
            <template slot="prepend"><span class="fa fa-lock"></span></template>
          </el-input>
        </div>
      </el-form-item>
      <!-- <el-form-item>
        <el-checkbox-group>
          <el-checkbox label="记住我" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="login" style="width: 100%;">登&emsp;&emsp;录</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</el-container>
</template>

<script>
import api from '@/api/api'
// import axios from 'axios'
// import qs from 'qs'

export default {
  name: 'Index',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    /* eslint-disable */
    login: function () {
      var that = this
      api.login(that.username, that.password).then(function (res) {
        console.log(res.data)
        api.storeToken(res.data)
        that.$router.push({
          name: 'index'
        })
        // window.location.href = '/'
      }).catch(function (err) {
        that.$message({
          message: '用户名或密码错误！',
          type: 'error'
        })
        that.username = ''
        that.password = ''
      })

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hy-container {
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: #DCDFE6;
}
</style>
