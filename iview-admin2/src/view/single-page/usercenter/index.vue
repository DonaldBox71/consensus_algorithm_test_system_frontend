<template>
    <div >
        <Row class="code-row-bg" type="flex" align="middle">
          <Col span=6 class='left' style="padding-right:5px;padding-left:5px">
            <img class='avatar' v-if="useraccess.indexOf('超级管理员')>-1" :src="require('@/assets/images/super_adimin.png')" />
            <img class='avatar' v-else-if="useraccess.indexOf('普通管理员')>-1" :src="require('@/assets/images/adimin.png')" />
            <img class='avatar' v-else :src="require('@/assets/images/other_access.png')" />
            <br><br>
            <p>用户名：{{username}}</p>
            <br>
            <p >工号：{{userid}}</p>
            <br>
            <p>用户权限：{{after_access}}</p>

          </Col>
          <Col span=18 class='right' style="padding-right:5px;padding-left:5px">
           <Card title="修改密码" class="card">
            <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
                <FormItem label="新密码：" prop="passwd">
                    <Input type="password" v-model="formCustom.passwd"></Input>
                </FormItem>
                <FormItem label="确认密码：" prop="passwdCheck">
                    <Input type="password" v-model="formCustom.passwdCheck"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit(userid)" style="margin-left: 120px">向超级管理员提交申请</Button>
                    <Button @click="handleReset('formCustom')" style="margin-left: 180px">重置</Button>
                </FormItem>
            </Form>
            </Card>
          </Col>
        </Row> 
  </div>
</template>
<script>
import config from '@/config'
import axios from 'axios'
const url = config.baseUrl
    export default {
        
        name: 'usercenter_page',
        data () {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请重新设置密码！'));
                } else {
                    if (this.formCustom.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        let passwordreg = /(?![A-Z]*$)(?![a-z]*$)(?![0-9]*$)(?![^a-zA-Z0-9]*$).{6,16}/
                        // !/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{6,16}/ 
                        if (!passwordreg.test(value)) {
                            callback(new Error('密码必须包含大写字母、小写字母、数字、特殊符号中两种以上，且位数为8-16位！'))
                        }
                        else{
                            this.$refs.formCustom.validateField('passwdCheck');
                        }
                        
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请重新确认密码！'));
                } else if (value !== this.formCustom.passwd) {
                    callback(new Error('两次密码输入不一致！'));
                } else {
                    callback();
                }
            };
            
            
            return {
                after_access:"",
                formCustom: {
                    passwd: '',
                    passwdCheck: '',
                },
                ruleCustom: {
                    passwd: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ]  
                }
            }
        },
        methods: {
            handleSubmit (userid) {
                this.$refs.formCustom.validate((valid) => {
                    console.log(userid)
                    console.log(this.username)
                    
                    
                    if (valid) {
                        this.$Modal.confirm({
                                title:'操作确认', 
                                content:'请确认是否要修改密码？',
                                onCancel: () => {
                                    this.$Message.info('取消操作!');
                                },
                                onOk: () => {
                                    let data ={
                                        number: userid,
                                        password: this.formCustom.passwd
                                    }
                                    axios.post(url+'/usercenter', data).then(res => {  
                                    console.log(res)                                      
                                    this.$Message.success({ content: '密码修改成功！', duration: 2})
                                    }).catch(e =>{
                                    this.$Message.error({content: '密码修改失败！', duration: 2})
                                    })
                                },
                            })        
                        }
                     else{
                            this.$Message.error({content: '密码修改存在问题！', duration: 2})                     
                        }
                })                 
    } ,   
            handleReset (name) {
                this.$refs[name].resetFields();
                this.$Message.error({ content: '请重新设置密码！', duration: 2})
                console.log(this.useraccess)
                console.log(JSON.parse(this.useraccess)['access'])
            },
        },

        computed: {
            useraccess(){
                // this.after_access = JSON.parse(this.$store.state.user.access)['access']
                let access_p = JSON.parse(this.$store.state.user.access)['access']
                this.after_access = access_p[0]
                for (let i = 1; i < access_p.length; i++) {
                    this.after_access = this.after_access + ';' + access_p[i]
                }
                return this.$store.state.user.access
      },
            username(){
                return this.$store.state.user.userName
      },
            userid(){
                return this.$store.state.user.userId
      }

    },
    }
</script>


<style scoped>
.code-row-bg {
  font-size: 10px;
  height: 100%;
}
.avatar{
margin-top: 100px;
border-radius:60px;
width:120px;
height: 120px;
}
.left {
  background-color: rgb(245, 245, 245);
  font-size: 20px;
  text-align: center;
  height: 500px;
  border: dashed;
  
}
.right {
  background-color: rgb(253, 253, 253);
  height:500px;
  border: dashed;
}
.card{
    margin-top: 100px;
}
</style>