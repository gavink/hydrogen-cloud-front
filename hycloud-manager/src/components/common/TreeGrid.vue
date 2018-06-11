<template>
<div>
<!-- <el-table :data="data" border style="width: 100%;">
    <el-table-column label="权限" width="260">

    </el-table-column>
    <el-table-column label="操作" width="260">
      <el-button size="mini" type="success">添加</el-button>
      <el-button size="mini" type="default">编辑</el-button>
      <el-button size="mini" type="danger" @click="handleDelete()">删除</el-button>
    </el-table-column>
  </el-table> -->
<el-tree :data="data5" node-key="id" :expand-on-click-node="false">
  <span class="custom-tree-node" slot-scope="{ node, data }">
    <span>{{ node.name }}</span>
    <span>{{ node.id }}</span>
    <span>{{ node.auth }}</span>
    <span>{{ node.parentId }}</span>
    <span>
      <el-button type="text" size="mini" @click="() => openDlg(data)">Append</el-button>
      <el-button type="text" size="mini" @click="() => remove(node, data)">Delete</el-button>
    </span>
  </span>
</el-tree>

<el-dialog title="权限" :visible.sync="showDlg">
  <el-form :model="form">
    <el-form-item label="ID" :label-width="formLabelWidth">
      {{form.id}}
    </el-form-item>
    <el-form-item label="权限" :label-width="formLabelWidth">
      <el-input v-model="form.auth" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="名称" :label-width="formLabelWidth">
      <el-input v-model="form.name" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="showDlg = false">取 消</el-button>
    <el-button type="primary" @click="showDlg = false">确 定</el-button>
  </div>
</el-dialog>
</div>
</template>

<script>
import api from '@/api/api'
let id = 1000
/* eslint-disable */
export default {
  data () {
    const data = [
      {id: 1, label: '一级 1', children: [
        {id: 4, label: '二级 1-1', children: [
          {id: 9, label: '三级 1-1-1'},
          {id: 10, label: '三级 1-1-2'}
        ]}
      ]},
      {id: 2, label: '一级 2', children: [
        {id: 5, label: '二级 2-1'},
        {id: 6, label: '二级 2-2'}
      ]},
      {id: 3, label: '一级 3', children: [
        {id: 7, label: '二级 3-1'},
        {id: 8, label: '二级 3-2'}
      ]}
    ]
    return {
      data5: data,
      form: {},
      showDlg: false,
      formLabelWidth: '120px'
    }
  },

  methods: {
    openDlg (data) {
      this.showDlg = true
      this.form = data
    },
    append (data) {
      const newChild = {
        id: id++,
        label: 'testtest',
        children: []
      }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },

    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    }

    // renderContent(h, {node, data, store}) {
    //   return ( <span class = "custom-tree-node" >
    //     <span > {
    //       node.label
    //     } < /span>
    //     <span >
    //     <el - button size = "mini" type = "text" on - click = {
    //       () => this.append(data)
    //     } > Append < /el-button> <el - button size = "mini" type = "text" on - click = {
    //       () => this.remove(node, data)
    //     } > Delete < /el-button> </span> </span>);
    //   }
  },
  mounted () {
    let that = this
    api.get('/api/authtree').then((res) => {
      that.data5 = res.data.item.auths
      console.log(that.data5)
    }).catch((err) => {

    })
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>

<style>
.el-tree-node__content :hover {
  background-color: #409EFF;
  color: #F2F6FC;
}
/*.is-current > .el-tree-node__content {
  background-color: #409EFF;;
  color: #F2F6FC;
}*/
</style>
