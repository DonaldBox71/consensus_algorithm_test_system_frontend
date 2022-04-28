import axios from '@/libs/api.request'

// export const login = ({ userName, password }) => { //这个方法的返回值是一个axios的post请求。由于url是写死的所以去mock中找mock/index.js
//   const data = {
//     userName,
//     password
//   }
//   return axios.request({
//     url: 'http://10.28.144.103:8080/login',  //原本为’login‘
//     data, 
//     method: 'post'
//   })
// }

// export const getUserInfo = (token) => {
//   return axios.request({
//     url: 'get_info',  //http://10.28.144.103:8080/
//     params: {
//       token
//     },
//     method: 'get'
//   })
// }

// export const logout = (token) => {
//   return axios.request({
//     url: 'logout',
//     method: 'post'
//   })
// }

// export const getUnreadCount = () => {
//   return axios.request({
//     url: 'message/count',
//     method: 'get'
//   })
// }

// export const getMessage = () => {
//   return axios.request({
//     url: 'message/init',
//     method: 'get'
//   })
// }

// export const getContentByMsgId = msg_id => {
//   return axios.request({
//     url: 'message/content',
//     method: 'get',
//     params: {
//       msg_id
//     }
//   })
// }

// export const hasRead = msg_id => {
//   return axios.request({
//     url: 'message/has_read',
//     method: 'post',
//     data: {
//       msg_id
//     }
//   })
// }

// export const removeReaded = msg_id => {
//   return axios.request({
//     url: 'message/remove_readed',
//     method: 'post',
//     data: {
//       msg_id
//     }
//   })
// }

// export const restoreTrash = msg_id => {
//   return axios.request({
//     url: 'message/restore',
//     method: 'post',
//     data: {
//       msg_id
//     }
//   })
// }
