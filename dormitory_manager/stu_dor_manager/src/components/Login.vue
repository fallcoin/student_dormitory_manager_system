<template>
  <div class="container">
    <!-- 中间的登录和注册框 -->
    <div class="box">
      <el-tabs v-model="activeName" stretch type="card">
        <!-- 登录 -->
        <el-tab-pane label="登录" name="login">
          <el-form
            class="login_form form"
            :model="loginMsg"
            label-width="auto"
            ref="loginFormRef"
            :rules="rules">
            <el-form-item label="账号" prop="account">
              <el-input
                prefix-icon="el-icon-user-solid"
                placeholder="请输入账号"
                clearable
                maxlength="12"
                v-model="loginMsg.account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                placeholder="请输入密码"
                prefix-icon="el-icon-lock"
                clearable
                maxlength="12"
                minlength="8"
                v-model="loginMsg.password"
                show-password></el-input>
            </el-form-item>
              <el-button type="primary" @click="login">登录</el-button>
          </el-form>
        </el-tab-pane>
        <!-- 注册 -->
        <el-tab-pane label="注册" name="register">
          <el-form
            label-width="auto"
            class="register_form form"
            :model="registerMsg"
            ref="registerFormRef"
            :rules="rules">
            <el-form-item label="账号" prop="account">
              <el-input
                placeholder="请输入账号"
                prefix-icon="el-icon-user-solid"
                clearable
                maxlength="12"
                v-model="registerMsg.account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                placeholder="请输入密码"
                prefix-icon="el-icon-lock"
                clearable
                maxlength="12"
                minlength="8"
                v-model="registerMsg.password"
                show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="password">
              <el-input
                placeholder="请确认密码"
                prefix-icon="el-icon-lock"
                clearable
                maxlength="12"
                minlength="8"
                v-model="registerMsg.repassword"
                show-password></el-input>
            </el-form-item>
            <el-button type="primary" @click="register">注册</el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
const loginUrl = '/login'
const registerUrl = '/register'
export default {
  data() {
    return {
      activeName: 'login',  // 当前分页
      loginMsg: {
        account: '',  // 账号
        password: ''  // 密码
      },
      registerMsg: {
        account: '',  // 账号
        password: '', // 密码
        repassword: ''  // 确认密码
      },
      rules: {  // 表单的约束规则
        account: [
          { required: true, message: '请输入账号' },
          { min: 3, max: 12, message: '长度为3到12个字符' }
        ],
        password: [
          { required: true, message: '请输入密码' },
          { min: 8, max: 12, message: '长度为8到12个字符' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          // 不符合表单的约束直接返回
          return
        }
        try {
          const res = await this.$axios.post(loginUrl, this.loginMsg)
          if (res.status == 200) {
            // 请求成功
            if (res.data.status == 1) {
              // 登录成功
              window.sessionStorage.setItem('token', res.data.token)
              this.$message.success('登录成功')
              this.$router.push('/home')
            } else {
              // 登录失败
              this.$message.error(res.data.msg)
            }
          } 
        } catch (error) {
          console.log(error)
        }
      })
    },
    register() {
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) {
          // 不符合表单的约束直接返回
          return
        }
        try {
          const res = await this.$axios.post(registerUrl, this.registerMsg)
          if (res.status == 200) {
            // 请求成功
            if (res.data.status == 1) {
              // 注册成功
              this.$message.success(res.data.msg)
            } else {
              // 注册失败
              this.$message.error(res.data.msg)
            }
          }
        } catch (error) {
          console.log(error)
        }
      })
    }
  }
}
</script>

<style scoped>
.container {
  background-attachment: fixed;
  background-image: url('../assets/images/background.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
}
.box {
  width: 450px;
  height: 350px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.75;
}
.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.register_form {
  margin-top: 25px;
}
.login_form {
  margin-top: 45px;
}
</style>
