<template>
  <div>
    <div class="add">
      <a-button @click="addUserVisible = true">添加账户</a-button>
      <a-drawer
        title="添加账号"
        placement="right"
        width="600"
        :closable="false"
        :visible="addUserVisible"
      >
        <AddUser @success='success' @close='close'></AddUser>
      </a-drawer>
    </div>
    <a-table
      :columns="columns"
      :dataSource="data"
      rowKey='id'
      :pagination="{
        total: total,
        current: currentPage,
        pageSize: pageSize
      }"
      @change="changePage">
      <template slot="operation" slot-scope="text">
        <div class="operation">
          <a href="#" @click="edit(text)">编辑</a>
          <a-popconfirm title="您确定要删除吗?" @confirm="del(text)" okText="确定" cancelText="取消">
            <a href="#">删除</a>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
    <a-drawer
      title="编辑账号"
      placement="right"
      width="600"
      :closable="false"
      :visible="editUserVisible"
    >
      <EditUser :visible="editUserVisible" :details="details" @success='success' @close='close'></EditUser>
    </a-drawer>
  </div>
</template>

<script>
import AddUser from './add-user'
import EditUser from './edit-user'
import { userpage, userdelete } from '@/api'
export default {
  data () {
    return {
      columns: [{
        title: '昵称',
        dataIndex: 'name'
      }, {
        title: '账号名',
        dataIndex: 'userName'
      }, {
        title: '注册时间',
        dataIndex: 'updateTime'
      }, {
        title: '操作',
        scopedSlots: { customRender: 'operation' }
      }],
      data: [],
      total: 0, // 总条数
      pageSize: 10, // 当前页条数
      currentPage: 1, // 当前页数

      addUserVisible: false,
      editUserVisible: false,

      details: {}
    }
  },
  components: {
    AddUser,
    EditUser
  },
  watch: {
    total (val) {
      if (val === (this.currentPage - 1) * this.pageSize && val !== 0) {
        this.currentPage -= 1
        this.list()
      }
    }
  },
  methods: {
    // 日期时间转成字符串方法
    formatDate (date) {
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    // 获取列表
    list () {
      const obj = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      }
      userpage(obj)
        .then(res => {
          if (res.code === 200) {
            this.data = res.body.records
            res.body.records.map(item => {
              item.updateTime = this.formatDate(new Date(Date.parse(item.updateTime)))
            })
            this.total = res.body.total
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 编辑
    edit (row) {
      this.details = row
      this.editUserVisible = true
    },
    // 删除
    del (row) {
      const obj = {
        id: row.id
      }
      userdelete(obj)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.list()
          } else {
            this.$message.error(res.message)
          }
        })
    },

    // 分页
    changePage (page) {
      console.log(page, 'page')
      this.currentPage = page.current
      this.pageSize = page.pageSize
      this.list()
    },

    // 成功操作
    success () {
      this.list()
      this.close()
    },
    // 关闭弹出框
    close () {
      this.addUserVisible = false
      this.editUserVisible = false
    }
  },
  mounted () {
    this.list()
  }
}
</script>

<style lang="scss" scoped>
.add{
  margin-bottom: 24px;
}
.operation{
  color: #1890FF;
  a{
    margin: 5px;
  }
}
</style>
