<template>
  <div class="box">
    <div class="add">
      <a-button @click="addUserVisible = true">添加文章</a-button>
    </div>
    <div class="form">
      <div class="form_item">
        <span>标题：</span>
        <a-input placeholder="请输入标题" v-model="title"/>
      </div>
      <div  class="form_item">
        <span>类型：</span>
        <a-select :value="type" @change="handleChange" placeholder="请选择分类">
          <a-select-option value="0">请选择</a-select-option>
          <a-select-option value="1">赛事信息</a-select-option>
          <a-select-option value="2">VIBRAM速递</a-select-option>
          <a-select-option value="3">跑者赛记</a-select-option>
        </a-select>
      </div>
      <div>
        <span>日期：</span>
        <a-range-picker @change="onChange" />
      </div>
    </div>

    <AddNew :visible="addUserVisible" @success='success' @close='addUserVisible = false'></AddNew>

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
      <span slot="title" slot-scope="text">
        <i class="isTop" v-if="text.isTop === 1">置顶</i>
        {{ text.title }}
      </span>
      <span slot="category" slot-scope="text,record">
        {{ record.category === 1 ? '赛事信息' : (record.category === 2 ? 'VIBRAM速递' : (record.category === 3 ? '跑者赛记' : '')) }}
      </span>
      <span slot="publishStatus" slot-scope="text,record">
        {{ record.publishStatus === 0 ? '未上架' : (record.publishStatus === 1 ? '上架' : (record.publishStatus === 2 ? '下架' : '')) }}
      </span>
      <template slot="sort" slot-scope="text,record">
        <div class="operation">
          <a href="#" @click="up(text,record,)">上移</a>
          <a href="#" @click="down(text,record)">下移</a>

          <a href="#" @click="stick(text,record)" v-if="record.publishStatus === 1 && record.isTop !== 1">置顶</a>
          <a href="#" @click="noStick(text,record)" v-if="record.publishStatus === 1 && record.isTop === 1">取消置顶</a>
        </div>
      </template>
      <template slot="operation" slot-scope="text,record">
        <div class="operation">
          <a href="#" @click="putaway(text,record)" v-if="record.publishStatus !== 1">上架</a>
          <a href="#" @click="soldout(text,record)" v-if="record.publishStatus === 1">下架</a>

          <a href="#" @click="edit(text,record)" v-if="record.publishStatus !== 1">编辑</a>
          <a-popconfirm title="您确定要删除吗?" @confirm="del(text,record)" okText="确定" cancelText="取消" v-if="record.publishStatus !== 1">
            <a href="#">删除</a>
          </a-popconfirm>

          <a href="#" @click="push(text,record)" v-if="record.publishStatus === 1 && record.bindStatus !== 1">推送banner</a>
          <a href="#" @click="cancel(text,record)" v-if="record.publishStatus === 1 && record.bindStatus === 1">取消banner</a>
        </div>
      </template>
    </a-table>
    <EditNew :visible="editUserVisible" :id="id" @success='success' @close='editUserVisible = false'></EditNew>
  </div>
</template>

<script>
import AddNew from './add-new'
import EditNew from './edit-new'
import { newspage, newsdelete, newsstatus, newsmove, newstop, newsbind } from '@/api'
export default {
  data () {
    return {
      columns: [{
        title: '标题',
        scopedSlots: { customRender: 'title' },
        width: '30%'
      }, {
        title: '分类',
        scopedSlots: { customRender: 'category' },
        width: '10%'
      }, {
        title: '状态',
        scopedSlots: { customRender: 'publishStatus' },
        width: '10%'
      }, {
        title: '更新时间',
        dataIndex: 'updateTime',
        width: '10%'
      }, {
        title: '排序',
        scopedSlots: { customRender: 'sort' },
        width: '20%'
      }, {
        title: '操作',
        scopedSlots: { customRender: 'operation' },
        width: '20%'
      }],
      data: [],
      total: 0, // 总条数
      pageSize: 10, // 当前页条数
      currentPage: 1, // 当前页数

      addUserVisible: false,
      editUserVisible: false,
      id: '',

      title: '',
      type: '0',
      startTime: '',
      endTime: ''
    }
  },
  components: {
    AddNew,
    EditNew
  },
  watch: {
    total (val) {
      if (val === (this.currentPage - 1) * this.pageSize && val !== 0) {
        this.currentPage -= 1
        this.list()
      }
    },
    title (val) {
      if (val) {
        this.currentPage = 1
        this.list()
      } else {
        this.list()
      }
    },
    type (val) {
      if (val) {
        this.currentPage = 1
        this.list()
      }
    },
    startTime (val) {
      if (val) {
        this.currentPage = 1
        this.list()
      } else {
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
        title: this.title,
        category: this.type,
        beginDate: this.startTime,
        endDate: this.endTime,
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      }
      newspage(obj)
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
    // 上架
    putaway (text) {
      console.log(text)
      const obj = {
        publishStatus: 1,
        id: text.id
      }
      this.plan(obj)
    },
    // 下架
    soldout (text) {
      const obj = {
        publishStatus: 2,
        id: text.id
      }
      this.plan(obj)
    },
    // 上架下架请求方法
    plan (obj) {
      newsstatus(obj)
        .then(res => {
          if (res.code === 200) {
            this.list()
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 上移
    up (text) {
      const obj = {
        moveType: 1,
        id: text.id
      }
      this.move(obj)
    },
    // 下移
    down (text) {
      const obj = {
        moveType: 2,
        id: text.id
      }
      this.move(obj)
    },
    // 上移下移请求方法
    move (obj) {
      newsmove(obj)
        .then(res => {
          if (res.code === 200) {
            this.list()
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 置顶
    stick (text) {
      const obj = {
        isTop: 1,
        id: text.id
      }
      this.front(obj)
    },
    // 取消置顶
    noStick (text) {
      const obj = {
        isTop: 2,
        id: text.id
      }
      this.front(obj)
    },
    // 置顶取消置顶方法
    front (obj) {
      newstop(obj)
        .then(res => {
          if (res.code === 200) {
            this.list()
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 推送banner
    push (text) {
      const obj = {
        bindStatus: 1,
        id: text.id
      }
      this.banner(obj)
    },
    // 取消banner
    cancel (text) {
      const obj = {
        bindStatus: 2,
        id: text.id
      }
      this.banner(obj)
    },
    // 推送取消banner方法
    banner (obj) {
      newsbind(obj)
        .then(res => {
          if (res.code === 200) {
            this.list()
          } else {
            this.$message.error(res.message)
          }
        })
    },

    // 编辑
    edit (row) {
      this.editUserVisible = true
      this.id = row.id
    },
    // 删除
    del (row) {
      const obj = {
        id: row.id
      }
      newsdelete(obj)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.list()
          } else {
            this.$message.error(res.message)
          }
        })
    },

    // 选择类型
    handleChange (value) {
      this.type = value
    },
    // 选择日期
    onChange (date, dateString) {
      console.log(date, dateString)
      this.startTime = dateString[0]
      this.endTime = dateString[1]
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
      this.addUserVisible = false
      this.editUserVisible = false
      this.list()
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
.form{
  margin-bottom: 30px;
  .form_item{
    width: 25%;
    float: left;
  }
}
.isTop{
  background-color: #f5222d;
    display: inline-block;
    font-size: 12px;
    width: 35px;
    margin-right: 5px;
    color: #fff;
    font-style: normal;
    text-align: center;
}
</style>

<style scoped>
.form >>> .ant-input{
  width: 70%;
}
.form >>> .ant-select{
  width: 70%;
}
.form >>> .ant-calendar-picker{
  width: 40%;
}
.box >>> .ant-table-title{
  display: none;
}
</style>
