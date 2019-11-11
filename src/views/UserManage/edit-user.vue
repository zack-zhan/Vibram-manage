<template>
  <div class="box">
    <a-form
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item
        label="昵称"
        :label-col="{ span: 6 }"
      :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入用户名' }],initialValue: details.name}
          ]"
        />
      </a-form-item>
      <a-form-item
        label="账号名"
        :label-col="{ span: 6 }"
      :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'userName',
            {rules: [{ required: true, message: '请输入用户名' }],initialValue: details.userName}
          ]"
        />
      </a-form-item>
      <a-form-item
        label="密码"
        :label-col="{ span: 6 }"
      >
        <a-input
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入密码' }]}
          ]"
          type="password"
        />
      </a-form-item>
      <a-form-item
        label="确认密码"
        :label-col="{ span: 6 }"
      >
        <a-input
          v-decorator="[
            'newPassword',
            {rules: [{ required: true, message: '请输入确认密码' }]}
          ]"
          type="password"
        />
      </a-form-item>
      <a-form-item
        :wrapper-col="{ offset: 6 }"
      >
        <a-button
          type="primary"
          html-type="submit"
        >
          确 认
        </a-button>
        <a-button style="margin-left:20px;" @click="cancel">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { userupdate } from '@/api'
import md5 from 'js-md5'
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
      form: this.$form.createForm(this)
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.form = this.$form.createForm(this)
      }
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          if (values.password !== values.newPassword) {
            this.$message.error('密码输入不一致')
            return
          }
          const paw = 'rKwf5216yt8UTy7j' + values.password
          const paw2 = 'rKwf5216yt8UTy7j' + values.newPassword
          const obj = {
            name: values.name,
            userName: values.userName,
            password: md5(paw),
            newPassword: md5(paw2),
            id: this.details.id
          }
          userupdate(obj)
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
  }
}
</script>

<style lang="scss" scoped>

</style>

<style scoped>
.box >>> .ant-input{
  width: 400px;
}
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
