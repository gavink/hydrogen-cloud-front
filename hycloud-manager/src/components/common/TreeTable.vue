<template>
<el-table :data="data" border style="width: 100%;" :row-style="showTr">
  <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text">
    <template scope="scope">
      <span v-for="space in scope.row._level" class="ms-tree-space"></span>
      <span v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
        <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
        <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
      </span>
      <span v-else-if="index===0" class="ms-tree-space"></span>
      {{scope.row[column.dataIndex]}}
    </template>
  </el-table-column>
  <el-table-column label="操作" width="260">
    <template scope="scope">
      <el-button size="mini" type="success">添加</el-button>
      <el-button size="mini" type="default">编辑</el-button>
      <el-button size="mini" type="danger" @click="handleDelete()">删除</el-button>
    </template>
  </el-table-column>
</el-table>
</template>

<script>
import MSDataTransfer from './DataTransfer.js'
//  import Vue from 'vue'
export default {
  name: 'TreeGrid',
  props: {
    // 这是相应的字段展示
    columns: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 这是数据源
    dataSource: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
    requestUrl: {
      type: String,
      default: function () {
        return ''
      }
    },
    // 是否默认展开所有树
    defaultExpandAll: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    // 格式化数据源
    data: function () {
      let me = this
      if (true) {
        let data = MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
        console.log(data)
        return data
      }
      return me.dataSource
    }
  },
  methods: {
    // 显示行
    showTr (row, index) {
      let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
      row._show = show
      return show ? '' : 'display:none;'
    },
    // 展开下级
    toggle (trIndex) {
      let me = this
      let record = me.data[trIndex]
      record._expanded = !record._expanded
    },
    // 显示层级关系的空格和图标
    spaceIconShow (index) {
      return index === 0
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow (index, record) {
      let me = this
      if (index === 0 && record.children && record.children.length > 0) {
        return true
      }
      return false
    },
    handleDelete () {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-family: 'Glyphicons Halflings';
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 18px;
  height: 14px;
}

.ms-tree-space::before {
  content: ""
}

table td {
  line-height: 26px;
}
</style>
