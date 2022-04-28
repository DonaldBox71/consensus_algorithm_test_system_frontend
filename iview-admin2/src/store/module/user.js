import axios from 'axios'
import {
// getMessage,
// getContentByMsgId,
// hasRead,
// removeReaded,
// restoreTrash,
// getUnreadCount
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'
import CryptoJS from 'crypto-js'

const url = ''
function encrypt (plaintText, keyStr, ivStr) {
  keyStr = keyStr || 'beijing-ittc626*'
  ivStr = ivStr || 'beijing-ittc626*'
  var key = CryptoJS.enc.Utf8.parse(keyStr)
  let iv = CryptoJS.enc.Utf8.parse(ivStr)
  var encryptedData = CryptoJS.AES.encrypt(plaintText, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  encryptedData = encryptedData.ciphertext.toString()
  console.log('加密后-no-hex：' + encryptedData)
  return encryptedData
}
// 解密
function decrypt (word, keyStr, ivStr) {
  keyStr = keyStr || 'beijing-ittc626*'
  ivStr = ivStr || 'beijing-ittc626*'
  var key = CryptoJS.enc.Utf8.parse(keyStr)
  let iv = CryptoJS.enc.Utf8.parse(ivStr)

  var decrypt = CryptoJS.AES.decrypt(word, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypt.toString(CryptoJS.enc.Utf8)
}

export default {

  state: {
    userName: '',
    userId: '',
    avatarImgPath: '',
    token: getToken(),
    access: '',
    timer1: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },

  mutations: { // 同步
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token // 给state加了一个token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: { // 异步
    // 登录
    handleLogin ({ commit }, { userName, password }) {
      userName = userName.trim()
      var data = {
        userName: userName,
        password: password
      }
      return new Promise((resolve, reject) => {
        axios.post('/login', encrypt(JSON.stringify(data))).then(res => { // axios.post('http://10.28.144.103:8080/login', {userName: userName, password: password})
          const headers = res.headers
          console.log(headers.authorization)
          commit('setToken', headers.authorization) // 同步更新setToken的状态
          axios.defaults.headers.common['Authorization'] = headers.authorization
          // console.log(res.headers)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        // logout(state.token)
        // axios.defaults.headers.common["Authorization"] = state.token
        // console.log('aaaaaaaaa')
        axios.post('/logout').then(res => {
          const data = res.data
          console.log(data)
          commit('setToken', '')
          commit('setAccess', [])
          sessionStorage.setItem('community', 0)
          sessionStorage.setItem('pumphouse', 0)
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          // getUserInfo(state.token)
          // console.log('aaaaaaaaaaaaaaaaaa')
          // console.log(state.token)
          // axios.defaults.headers.common["Authorization"] = state.token
          axios.get('/get_info').then(res => {
            // headers:{}
            // const data = decrypt(res.data)
            const data = res.data
            console.log(data)
            commit('setAvatar', data.iconUrl)
            commit('setUserName', data.userName)
            commit('setUserId', data.password)
            commit('setAccess', data.super_admin)
            console.log(data.super_admin)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount ({ state, commit }) {
      clearInterval(state.timer1) // 轮询部分
      state.timer1 = setInterval(() => {
        if (state.token) {
          axios.get('/message/count').then(res => {
            const headers = res.headers
            console.log(headers.authorization)
            commit('setToken', headers.authorization) // 同步更新setToken的状态
            axios.defaults.headers.common['Authorization'] = headers.authorization
            const { data } = res
            console.log(data)
            commit('setMessageCount', data)
            const headers1 = res.headers
            console.log(headers1.authorization)
            commit('setToken', headers1.authorization) // 同步更新setToken的状态
            axios.defaults.headers.common['Authorization'] = headers1.authorization
          })
        }
      }, 20000)
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        clearInterval(state.timer1) // 轮询部分
        state.timer1 = setInterval(() => {
          if (state.token) {
            axios.get('/message/init').then(res => {
              const unread = res.data.unreadList
              const readed = res.data.readedList
              const trash = res.data.trashList
              console.log(res.data)
              // commit状态赋值不可以为空，否则将影响其他的状态赋值
              if (unread != null) {
                commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
                // console.log(state.messageUnreadList)
              }

              if (readed != null) {
                commit('setMessageReadedList', readed.map(_ => {
                  _.loading = false
                  return _
                }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
              }

              if (trash != null) {
                commit('setMessageTrashList', trash.map(_ => {
                  // console.log(state.messageTrashList)

                  _.loading = false
                  return _
                }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
              }

              resolve()
            }).catch(error => {
              reject(error)
            })
          }
        }, 3000)
      })
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msg_id]
        console.log(contentItem)
        if (contentItem) {
          resolve(contentItem)
        } else {
          axios.post('/message/content', { msg_id: msg_id }).then(res => {
            const content = res.data
            commit('updateMessageContentStore', { msg_id, content })
            resolve(content)
          })
        }
      })
    },
    // 把一个未读消息标记为已读
    hasRead ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        axios.post('/message/has_read', { msg_id: msg_id }).then(res => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            msg_id
          })
          commit('setMessageCount', state.unreadCount - 1)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除一个已读消息到回收站
    removeReaded ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        axios.post('/message/remove_readed', { msg_id: msg_id }).then(res => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 还原一个已删除消息到已读消息
    restoreTrash ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        axios.post('/message/restore_trash', { msg_id: msg_id }).then(res => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
