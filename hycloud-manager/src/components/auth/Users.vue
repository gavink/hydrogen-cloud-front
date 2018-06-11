<template>
  <div>
    <el-button @click="showDlg" type="text" size="small">添加用户</el-button>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="username" width="200" label="账号">
      </el-table-column>
      <el-table-column prop="nickname" width="200" label="昵称">
      </el-table-column>
      <el-table-column prop="avantar" label="头像">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="deleteUser(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="newUser">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="newUser.username" width="300" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="newUser.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="newUser.nickname" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/api'

export default {
  name: 'Users',
  data () {
    return {
      users: [],

      newUser: {},

      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  methods: {
    /* eslint-disable */
    getUsers: function() {
      var that = this
      api.get('/api/users?pageNum=1&pageSize=10').then(function(res) {
        console.log(res)
        let data = res.data
        that.users = data.items
      }).catch(function(err) {
        that.$message({
          message: '获取用户信息失败！',
          type: 'error'
        })
      })
    },
    showDlg: function () {
      this.newUser = {}
      this.dialogFormVisible = true
    },
    addUser: function () {
      let that = this
      let user = that.newUser
      api.post('/api/users', user).then((res) => {
        api.put('/api/users', user).then((res) => {
          that.$message({
            type: 'success',
            message: '添加成功.'
          })
        }).catch((err) => {
          throw err
        })
      }).catch((err) => {
        that.$message({
          type: 'error',
          message: '添加失败.' + err
        })
      }).finally(() => {
        that.dialogFormVisible = false
        that.getUsers()
      })
    },
    deleteUser: function (user) {
      let that = this
      that.$confirm('此操作将删除该用户, 是否继续?', '删除用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          api.delete('/api/users/' + user.username).then((res) => {
            if(res.data.res === 'S'){
              that.$message({
                type: 'success',
                message: '删除成功.'
              })
              that.getUsers()
            } else {
              throw res.data.msg
            }
          }).catch((err) => {
            that.$message({
              type: 'error',
              message: '删除失败.' + err
            })
          })
        })
    }
  },
  mounted () {
    this.getUsers()
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
