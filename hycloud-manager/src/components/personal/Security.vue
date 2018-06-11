<template>
  <div class="password-form">
    <el-form label-width="80px">
      <el-form-item label="旧密码">
        <el-input type="password" v-model="password.oldPassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input type="password" v-model="password.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input type="password" v-model="password.checkPassword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changePassword" style="width: 50%;">修&emsp;&emsp;改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '@/api/api'

export default {
  name: 'Security',
  data () {
    return {
      password: {
        oldPassword: '',
        newPassword: '',
        checkPassword: ''
      }
    }
  },
  methods: {
    /* eslint-disable */
    changePassword () {
      let that = this
      let oldPassword = that.password.oldPassword
      let newPassword = that.password.newPassword
      let checkPassword = that.password.checkPassword
      if(oldPassword == '' || newPassword == '' || checkPassword == ''){
        that.$message({
          message: '密码不能为空.',
          type: 'error'
        })
        return
      }
      if(newPassword != checkPassword){
        that.$message({
          message: '两次输入的新密码不一致.',
          type: 'error'
        })
        return
      }
      api.put('/api/personal/password', that.password).then(function (res) {
        let data = res.data
        if (data.res === 'S') {
          that.$message({
            message: '密码修改成功.',
            type: 'success'
          })
        } else {
          throw data.msg
        }
      }).catch(function (err) {
        that.$message({
          message: '密码修改失败. ' + err,
          type: 'error'
        })
      }).finally(function () {
        that.password = {
          oldPassword: '',
          newPassword: '',
          checkPassword: ''
        }
      })
    }
  },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .password-form {
    max-width: 360px;
  }
</style>
