import axios from 'axios'

// 全局基准路径
axios.defaults.baseURL = '//test.vanmei.zhiytech.com'
// axios.defaults.baseURL = '//192.168.0.72:770'

// 设置请求拦截
axios.interceptors.request.use(config => {
  const userid = localStorage.getItem('id')
  if (userid) {
    config.headers['userid'] = userid
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 登录
export const userlogin = (obj) => axios.get(`/user/login?username=${obj.username}&password=${obj.password}`).then(res => res.data)

// 用户列表
export const userpage = (obj) => axios.get(`/user/page?PageIndex=${obj.pageIndex}&PageSize=${obj.pageSize}`).then(res => res.data)
// 添加用户
export const usercreate = (obj) => axios.post('/user/create', obj).then(res => res.data)
// 删除用户
export const userdelete = (obj) => axios.post('/user/delete', obj).then(res => res.data)
// 更新用户
export const userupdate = (obj) => axios.post('/user/update', obj).then(res => res.data)

// 读取文章列表（分页）
export const newspage = (obj) => axios.get(`/news/page?PageIndex=${obj.pageIndex}&PageSize=${obj.pageSize}&Title=${obj.title}&Category=${obj.category}&BeginDate=${obj.beginDate}&EndDate=${obj.endDate}`).then(res => res.data)
// 添加文章
export const newscreate = (obj) => axios.post('/news/create', obj).then(res => res.data)
// 删除文章
export const newsdelete = (id) => axios.post('/news/delete', id).then(res => res.data)
// 修改文章状态（上架/下架）
export const newsstatus = (obj) => axios.post('/news/status', obj).then(res => res.data)
// 文章排序（上移/下移）
export const newsmove = (obj) => axios.post('/news/move', obj).then(res => res.data)
// 设置置顶
export const newstop = (obj) => axios.post('/news/top', obj).then(res => res.data)
// 绑定banner
export const newsbind = (obj) => axios.post('/news/bind', obj).then(res => res.data)
// 查询文章详情
export const newsone = (id) => axios.get('/news/one?id=' + id).then(res => res.data)
// 更新文章
export const newsupdate = (obj) => axios.post('/news/update', obj).then(res => res.data)

// 读取轮播列表（分页）
export const bannerpage = (obj) => axios.get(`/banner/page?PageIndex=${obj.pageIndex}&PageSize=${obj.pageSize}&Title=${obj.title}`).then(res => res.data)
// 修改轮播状态（上架/下架）
export const bannerstatus = (obj) => axios.post('/banner/status', obj).then(res => res.data)
// 轮播排序（上移/下移）
export const bannermove = (obj) => axios.post('/banner/move', obj).then(res => res.data)
// 更新封面图片
export const bannerimage = (obj) => axios.post('/banner/image', obj).then(res => res.data)

// 读取PV/UV列表（分页）
export const visitpage = (obj) => axios.get(`/visit/page?PageIndex=${obj.pageIndex}&PageSize=${obj.pageSize}&Title=${obj.title}&Category=${obj.category}&BeginDate=${obj.beginDate}&EndDate=${obj.endDate}`).then(res => res.data)
