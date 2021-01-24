<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="~assets/img/hp01.jpg" alt="">
      </div>

      <!-- 登录表单区域 -->
      <el-form class="login-form"
      ref="loginFormRef"
      :model="loginForm" 
      label-width="0px" 
      :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item class="username" prop="username">
          <el-input v-model="loginForm.username"
          prefix-icon="fa fa-user"
          type="text"
          placeholder ="用户名"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item class="password" prop="password">
          <el-input v-model="loginForm.password"
          prefix-icon="fa fa-unlock-alt"
          type="password"
          placeholder ="密码"></el-input>
        </el-form-item>

        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>  
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data(){
      return {
        // 登录表单的数据绑定对象
        loginForm:{
          username: 'admin',
          password: '123456'
        },
        // 验证表单的数据是否符合规则
        loginFormRules:{
          username: [
            {required: true, message: "请输入用户名", tigger: "blur"},
            {min: 3, max: 10, message: "长度在3到10个字符之间", tigger: "blur"}
          ],
          password: [
            {required: true, message: "请输入登录密码", tigger: "blur"},
            {min: 6, max: 15, message: "长度在6到15个字符之间", tigger: "blur"}
          ]
        }
      }
    },
    methods: {
      // 设置重置按钮
      resetLoginForm(){
        this.$refs.loginFormRef.resetFields()
      },
      login(){
        this.$refs.loginFormRef.validate(async valid => {
          if(!valid) return;
          // const {data:res} = await this.$http.post("login",this.loginForm)
          const res = await this.$http.post("login",this.loginForm)
          // if(res.meta.status !== 200) return this.$message.error("登录失败!");
          if(res.status !== 200)  this.$message.error("登录失败!");
          this.$message.success("登录成功!");
          
          // 将token保存在sessionStorage中
          // window.sessionStorage.setItem("token",res.data.token)
          // 跳转到/home
          this.$router.push("/home")
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login-container{
    height: 100%;
    background-color: #2b4b6b;

    .login-box{
      position: absolute;
      width: 450px;
      height: 300px;
      background-color: #fff;
      border-radius: 10px;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);

      .avatar-box{
        position: absolute;
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        left: 50%;
        transform: translate(-50%,-50%);

        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .login-form{
        position: relative;
        width: 100%;
        margin: 100px auto;

        .username, .password{
          position: relative;
          margin: 15px 0;
        }

        .btns{
          display: flex;
          justify-content: center;

          button{
            margin: 0 5px;
          }
        }
      }
    }
  }
</style>
