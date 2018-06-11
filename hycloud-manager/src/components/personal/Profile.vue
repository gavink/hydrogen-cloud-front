<template>
  <div class="personal-info">
    <el-row class="personal-info-item">
      <el-col :span="8">
        <div class="grid-content">
          <img class="avantar-big" :src="userInfo.avantar"/>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content">
          <el-upload
            class="upload-avantar"
            :action="fileUploadUrl"
            :headers="headers"
            :show-file-list="false"
            :on-success="avantarUploadSuccess"
            :on-error="avantarUploadFailed">
            <el-button size="small" type="primary">更改头像</el-button>
          </el-upload>
        </div>
      </el-col>
    </el-row>
    <el-row class="personal-info-item">
      <el-col :span="8">
        <div class="grid-content">
          <label>昵称</label>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content">
          <el-input v-model="userInfo.nickname"></el-input>
        </div>
      </el-col>
    </el-row>
    <el-row class="personal-info-item">
      <el-col :span="4">
        <div class="grid-content">
          <el-button size="small" type="primary" @click="saveUserInfo" style="width: 100%;">保存</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '@/api/api'
import config from '@/config/config'

export default {
  name: 'Profile',
  data () {
    return {
      headers: {
        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      },
      userInfo: {},
      fileUploadUrl: config.fileServer + 'upload'
    }
  },
  methods: {
    /* eslint-disable */
    getUserInfo () {
      let that = this
      api.get('/api/personal/profile').then(function (res) {
        let data = res.data
        if (data.res === 'S') {
          that.userInfo = data.item
        } else {
          throw data.msg
        }
      }).catch(function (err) {
        that.$message({
          message: 'failed to get userinfo.',
          type: 'error'
        })
      })
    },
    saveUserInfo () {
      let that = this
      api.put('/api/personal/profile', that.userInfo).then(function (res) {
        that.$message({
          message: '已保存',
          type: 'success'
        })
        that.$store.dispatch("refreshUserInfo") // 更新store中的userInfo
      }).catch(function (err) {
        that.$message({
          message: '保存失败！',
          type: 'error'
        })
      })
    },
    avantarUploadSuccess (res, file, fileList) {
      // console.log(res)
      if(res.res === 'S'){
        this.userInfo.avantar = config.fileServer + res.item.src
        this.$message({
          message: '头像上传成功.',
          type: 'success'
        })
      } else {
        this.$message({
          message: '头像上传失败.',
          type: 'error'
        })
      }
    },
    avantarUploadFailed (res, file, fileList){
      this.$message({
        message: '头像上传失败.',
        type: 'error'
      })
    }
  },
  mounted () {
    this.getUserInfo()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .personal-info {
    max-width: 480px;
  }
  .personal-info-item {
    display: flex;
    padding-bottom: 30px;
    align-items:center;
  }
  .avantar-big {
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
</style>
