<template>
  <div>
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
      <span slot="category" slot-scope="text,record">
        {{ record.category === 1 ? '赛事信息' : (record.category === 2 ? 'VIBRAM速递' : (record.category === 3 ? '跑者赛记' : '')) }}
      </span>
    </a-table>
  </div>
</template>

<script>
import { visitpage } from '@/api'
export default {
  data () {
    return {
      columns: [{
        title: '标题',
        dataIndex: 'title'
      }, {
        title: '分类',
        scopedSlots: { customRender: 'category' }
      }, {
        title: 'pv',
        dataIndex: 'pv'
      }, {
        title: 'uv',
        dataIndex: 'uv'
      }],
      data: [],
      total: 0, // 总条数
      pageSize: 10, // 当前页条数
      currentPage: 1, // 当前页数

      title: '',
      type: '0',
      startTime: '',
      endTime: ''
    }
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
      visitpage(obj)
        .then(res => {
          if (res.code === 200) {
            this.data = res.body.records
            this.total = res.body.total
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
    }
  },
  mounted () {
    this.list()
  }
}
</script>

<style lang="scss" scoped>
.form{
  margin-bottom: 30px;
  .form_item{
    width: 25%;
    float: left;
  }
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
</style>
