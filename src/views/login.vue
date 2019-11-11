<template>
  <div class="container">
    <div class="content" style="background: transparent;margin: 0;">
      <div class="top">
        <img src="@/assets/logo@2x.png" alt="">
        <div class="desc"></div>
      </div>
      <div class="main">
          <div class="login">
            <a-form
              :form="form"
              @submit="handleSubmit"
            >
              <a-form-item

              >
                <a-input
                  v-decorator="[
                    'username',
                    {rules: [{ required: true, message: '用户名不能为空' }]}
                  ]"
                  placeholder="请输入用户名"
                >
                  <a-icon
                    slot="prefix"
                    type="user"
                    style="color:rgba(0,0,0,.65)"
                  />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input
                  v-decorator="[
                    'password',
                    {rules: [{ required: true, message: '密码不能为空' }]}
                  ]"
                  type="password"
                  placeholder="请输入密码"
                >
                  <a-icon
                    slot="prefix"
                    type="lock"
                    style="color:rgba(0,0,0,.65)"
                  />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button
                  type="primary"
                  html-type="submit"
                  style="background:#FFC627;border:none"
                >
                  登录
                </a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { userlogin } from '@/api'
import md5 from 'js-md5'
export default {
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this)
    }
  },
  methods: {
    // 登录
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const paw = 'rKwf5216yt8UTy7j' + values.password
          const obj = {
            username: values.username,
            password: md5(paw)
          }
          userlogin(obj)
            .then(res => {
              if (res.code === 200) {
                localStorage.setItem('id', res.body.id)
                localStorage.setItem('name', values.username)
                this.$router.push('/')
              } else {
                this.$message.error(res.message)
              }
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background: #f0f2f5;
  .content {
    padding: 32px 0;
    flex: 1;
  }
  .top {
    margin-top: 64px;
    text-align: center;
    .desc {
      line-height: 21px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }
  .main {
    width: 368px;
    margin: 0 auto;
  }
}
@media (min-width: 768px){
  .container {
    background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
    background-repeat: no-repeat;
    background-position: center 110px;
    background-size: 100%;
    .content {
      padding: 112px 0 24px 0;
    }
  }
}
</style>

<style scoped>
.container >>> .ant-form-item{
  margin-bottom: 24px;
}
.container >>> .ant-input{
  height: 40px;
}
.container >>> .ant-btn-primary{
  width: 100%;
  height: 40px;
}
</style>
