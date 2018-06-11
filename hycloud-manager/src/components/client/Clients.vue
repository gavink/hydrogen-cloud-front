<template>
  <div>
    <el-button @click="showDlg" type="text" size="small">添加客户端</el-button>
    <el-table :data="clients" style="width: 100%">
      <el-table-column prop="clientId" width="200" label="Client_ID">
      </el-table-column>
      <el-table-column prop="clientSecret" width="200" label="Client_Secret">
      </el-table-column>
      <el-table-column prop="clientDesc" label="说明">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="deleteClient(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加客户端" :visible.sync="dialogFormVisible">
      <el-form :model="newClient">
        <el-form-item label="Client_ID" :label-width="formLabelWidth">
          <el-input v-model="newClient.clientId" width="300" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Client_Secret" :label-width="formLabelWidth">
          <el-input v-model="newClient.clientSecret" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="说明" :label-width="formLabelWidth">
          <el-input v-model="newClient.clientDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClient">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/api'

export default {
  name: 'Clients',
  data () {
    return {
      clients: [],

      newClient: {},

      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  methods: {
    /* eslint-disable */
    getClients: function() {
      var that = this
      api.get('/api/clients?pageNum=1&pageSize=10').then(function(res) {
        console.log(res)
        let data = res.data
        that.clients = data.items
      }).catch(function(err) {
        that.$message({
          message: '获取客户端信息失败！',
          type: 'error'
        })
      })
    },
    showDlg: function () {
      this.newClient = {}
      this.dialogFormVisible = true
    },
    addClient: function () {
      let that = this
      let client = that.newClient
      api.post('/api/clients', client).then((res) => {
        api.put('/api/clients', client).then((res) => {
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
        that.getClients()
      })
    },
    deleteClient: function (client) {
      let that = this
      that.$confirm('此操作将删除该用户, 是否继续?', '删除用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          api.delete('/api/clients/' + client.clientId).then((res) => {
            if(res.data.res === 'S'){
              that.$message({
                type: 'success',
                message: '删除成功.'
              })
              that.getClients()
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
    this.getClients()
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
