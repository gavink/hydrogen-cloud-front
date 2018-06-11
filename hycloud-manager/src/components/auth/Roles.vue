<template>
  <div>
    <el-button @click="showDlg" type="text" size="small">添加角色</el-button>
    <el-table :data="roles" style="width: 100%">
      <el-table-column prop="role" label="角色">
      </el-table-column>
      <el-table-column prop="name" label="名称">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="deleteRole(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="newRole">
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-input v-model="newRole.role" width="300" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="newRole.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/api'

export default {
  name: 'Roles',
  data () {
    return {
      roles: [],

      newRole: {},

      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  methods: {
    /* eslint-disable */
    getRoles: function() {
      var that = this
      api.get('/api/roles?pageNum=1&pageSize=10').then(function(res) {
        console.log(res)
        let data = res.data
        that.roles = data.items
      }).catch(function(err) {
        that.$message({
          message: '获取角色信息失败！',
          type: 'error'
        })
      })
    },
    showDlg: function () {
      this.newRole = {}
      this.dialogFormVisible = true
    },
    addRole: function () {
      let that = this
      let role = that.newRole
      api.post('/api/roles', role).then((res) => {
        api.put('/api/roles', role).then((res) => {
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
        that.getRoles()
      })
    },
    deleteRole: function (role) {
      let that = this
      that.$confirm('此操作将删除该用户, 是否继续?', '删除用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          api.delete('/api/roles/' + role.role).then((res) => {
            if(res.data.res === 'S'){
              that.$message({
                type: 'success',
                message: '删除成功.'
              })
              that.getRoles()
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
    this.getRoles()
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
