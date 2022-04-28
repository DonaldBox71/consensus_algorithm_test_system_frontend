<template>
  <div class="user-avatar-dropdown">
    <!-- <Dropdown @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        
        <Avatar v-if="useraccess.indexOf('超级管理员')>-1" :src="require('@/assets/images/super_adimin.png')" />
        <Avatar v-else-if="useraccess.indexOf('普通管理员')>-1" :src="require('@/assets/images/adimin.png')" />
        <Avatar v-else :src="require('@/assets/images/other_access.png')" />

      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="usercenter">用户中心</DropdownItem>
        <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown> -->
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvatar: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  data(){
    return{
      imageurl:''
    }

  },   
   // 组件加入权限--读取用户权限  
  computed: {
      useraccess(){
        return this.$store.state.user.access
      }
    },


  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    usercenter () {
        this.$router.push({
          name: 'usercenter_page'
        })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
        case 'usercenter': this.usercenter()
      }
    }
  }
}
</script>
