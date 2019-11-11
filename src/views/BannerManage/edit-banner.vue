<template>
  <a-drawer
    title="banner图片"
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
        label="修改封面图"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-upload
          class="avatar-uploader"
          :showUploadList="false"
          :customRequest="customRequest"
          v-decorator="[
            'imageUrl',
            {rules: [{ required: true, message: '请选择图片' }],initialValue: details.coverImageUrl}
          ]"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div class="avatar" v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
          </div>
          <div class="hint">推荐尺寸：188px × 77px</div>
        </a-upload>
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

  </a-drawer>
</template>

<script>
import { upload } from '@/utils/ossclient'
import { bannerimage } from '@/api'
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    details: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),

      loading: false,
      imageUrl: ''
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.form = this.$form.createForm(this)
        this.imageUrl = this.details.coverImageUrl
      }
    }
  },
  methods: {
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

    // 确定
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const obj = {
            id: this.details.id,
            coverImageUrl: this.imageUrl
          }
          bannerimage(obj)
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
    console.log(this.details, '------')
    this.imageUrl = this.details.coverImageUrl
  }
}
</script>

<style lang="scss" scoped>
.hint{
  color: #1890FF;
  margin: 5px 0;
}
</style>

<style>
  .avatar{
    display: inline-block;
    width: 188px;
    height: 77px;
    line-height: 77px;
    text-align: center;
    border: 1px dashed #ccc;
  }
  .avatar-uploader img {
    width: 188px;
    height: 77px;
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
