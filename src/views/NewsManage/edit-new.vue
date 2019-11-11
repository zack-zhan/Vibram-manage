<template>
  <a-drawer
    title="添加文章"
    placement="right"
    width="600"
    :closable="false"
    :visible="visible"
  >
    <a-form
      :form="form"
      @submit="handleSubmit"
      class="box"
    >
      <a-form-item
        label="标题"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'title',
            {rules: [{ required: true, message: '请输入标题' }],initialValue: title}
          ]"
        />
      </a-form-item>

      <a-form-item
        label="菜单"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-select
          v-decorator="[
            'category',
            {rules: [{ required: true, message: '请选择分类' }],initialValue: category}
          ]"
          placeholder="请选择分类"
        >
          <a-select-option value="1">赛事信息</a-select-option>
          <a-select-option value="2">VIBRAM速递</a-select-option>
          <a-select-option value="3">跑者赛记</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="上传封面图"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-upload
          class="avatar-uploader"
          :showUploadList="false"
          :customRequest="customRequest"
          v-decorator="[
            'imageUrl',
            {rules: [{ required: true, message: '请选择图片' }],initialValue: imageUrl}
          ]"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div class="avatar" v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
          </div>
        </a-upload>
      </a-form-item>

      <a-form-item
        label="类型"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-radio-group @change="onChange" v-model="value">
          <a-radio :value="1">内容</a-radio>
          <a-radio :value="2">链接</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        v-if="value === 1"
        label="内容"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a href="javascript:void(0)" style="color: #1890FF;" @click="editorVisible = true">内容编辑</a>
      </a-form-item>
      <a-form-item
        v-else
        label="链接"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'url',
            {initialValue: url}
          ]"
        />
      </a-form-item>

      <a-form-item
        :wrapper-col="{ span: 12, offset: 5 }"
      >
        <a-button
          type="primary"
          html-type="submit"
        >
          确定
        </a-button>
        <a-button @click="cancel" style="margin-left:20px;">取消</a-button>
      </a-form-item>
    </a-form>

    <a-modal
      title="内容编辑"
      v-model="editorVisible"
      @ok="editorOk"
      cancelText="取 消"
      okText="确 认"
      width="1000px"
    >
      <Editor :visible="editorVisible" :content="content" @text="text"></Editor>
    </a-modal>

  </a-drawer>
</template>

<script>
import { upload } from '@/utils/ossclient'
import Editor from './edit-editor'
import { newsone, newsupdate } from '@/api'
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),

      title: '',
      category: '',

      loading: false,
      imageUrl: '',

      value: 1,

      editorVisible: false,
      editorText: '',
      content: '',

      url: ''
    }
  },
  components: {
    Editor
  },
  watch: {
    visible (val) {
      if (val) {
        this.form = this.$form.createForm(this)
        this.list()
      }
    }
  },
  methods: {
    // 获取详情
    list () {
      newsone(this.id)
        .then(res => {
          if (res.code === 200) {
            this.title = res.body.title
            this.category = res.body.category.toString()
            this.imageUrl = res.body.coverImageUrl
            this.value = res.body.type
            if (res.body.type === 1) {
              this.content = res.body.content
            } else {
              this.url = res.body.content
            }
          } else {
            this.$message.error(res.message)
          }
        })
    },

    onChange (e) {
      console.log('radio checked', e.target.value)
      this.value = e.target.value
    },

    // 上传图片
    customRequest (request) {
      console.log(request.file, '--------')
      const isJPG = request.file.type === 'image/jpeg'
      const isPNG = request.file.type === 'image/png'
      const isLt2M = request.file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        return
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return
      }
      if ((isJPG || isPNG) && isLt2M) {
        upload(request.file, p => console.log(p)).then(res => {
          console.log(res.url, '---')
          this.imageUrl = res.url
        })
      }
    },

    // 监听富文本内容
    text (val) {
      this.editorText = val
    },
    // 富文本框确定
    editorOk () {
      this.content = this.editorText
      this.editorVisible = false
    },

    // 确定
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const obj = {
            id: this.id,
            title: values.title,
            category: values.category,
            coverImageUrl: this.imageUrl,
            type: this.value,
            content: this.value === 1 ? this.content : values.url
          }
          console.log(obj, '---')
          newsupdate(obj)
            .then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$emit('success')
              } else {
                this.$message.error(res.message)
              }
            })
        }
      })
    },
    // 取消
    cancel () {
      this.$emit('close')
    }
  },
  mounted () {
    if (this.id) {
      this.list()
    }
  }
}
</script>

<style>
  .avatar{
    display: inline-block;
    width: 128px;
    height: 128px;
    line-height: 128px;
    text-align: center;
    border: 1px dashed #ccc;
  }
  .avatar-uploader img {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }
</style>

<style scoped>
.box >>> .ant-btn-primary{
  background:#FFC627;
  color: #000;
  border:none;
}
.box >>> .ant-btn-default{
  color:rgba(0, 0, 0, 0.65);
  border:1px solid #ccc;
}
</style>
