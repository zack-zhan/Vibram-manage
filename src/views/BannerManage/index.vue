<template>
  <div>
    <a-row :gutter="32" type="flex" class="form">
      <a-col :span="8">
        标题：<a-input placeholder="请输入标题" v-model="title"/>
      </a-col>
    </a-row>
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
      <div slot="coverImageUrl" slot-scope="text">
          <img :src="text.coverImageUrl" style="width: 188px;height: 77px;"/>
      </div>
      <span slot="publishStatus" slot-scope="text,record">
        {{ record.publishStatus === 0 ? '未上架' : (record.publishStatus === 1 ? '上架' : (record.publishStatus === 2 ? '下架' : '')) }}
      </span>
      <template slot="sort" slot-scope="text,record">
        <div class="operation">
          <a href="#" @click="up(text,record,)">上移</a>
          <a href="#" @click="down(text,record)">下移</a>
        </div>
      </template>
      <template slot="operation" slot-scope="text,record">
        <div class="operation">
          <a href="#" @click="putaway(text,record)" v-if="record.publishStatus !== 1">上架</a>
          <a href="#" @click="soldout(text,record)" v-if="record.publishStatus === 1">下架</a>

          <a href="#" @click="edit(text,record)" v-if="record.publishStatus !== 1">编辑</a>
        </div>
      </template>
    </a-table>
    <EditBanner :visible="editBannerVisible" :details="details" @success='success' @close='editBannerVisible = false'></EditBanner>
  </div>
</template>

<script>
import { bannerpage, bannerstatus, bannermove } from '@/api'
import EditBanner from './edit-banner'
export default {
  data () {
    return {
      columns: [{
        title: 'banner图片',
        scopedSlots: { customRender: 'coverImageUrl' }
      }, {
        title: '链接文章',
        dataIndex: 'title'
      }, {
        title: '状态',
        scopedSlots: { customRender: 'publishStatus' }
      }, {
        title: '排序',
        scopedSlots: { customRender: 'sort' }
      }, {
        title: '操作',
        scopedSlots: { customRender: 'operation' }
      }],
      data: [],
      total: 0, // 总条数
      pageSize: 10, // 当前页条数
      currentPage: 1, // 当前页数

      editBannerVisible: false,
      details: {},

      title: ''
    }
  },
  components: {
    EditBanner
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
    }
  },
  methods: {
    // 获取列表
    list () {
      const obj = {
        title: this.title,
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      }
      bannerpage(obj)
        .then(res => {
          if (res.code === 200) {
            this.data = res.body.records
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
      bannerstatus(obj)
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
      bannermove(obj)
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
      this.editBannerVisible = true
      this.details = row
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
      this.editBannerVisible = false
      this.list()
    }
  },
  mounted () {
    this.list()
  }
}
</script>

<style lang="scss" scoped>
.operation{
  color: #1890FF;
  a{
    margin: 5px;
  }
}
.form{
  margin-bottom: 30px;
}
</style>

<style scoped>
.form >>> .ant-col-8 .ant-input{
  width: 70%;
}
</style>
