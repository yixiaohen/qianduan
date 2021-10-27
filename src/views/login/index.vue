<template>
  <div class="login-container">
    <!--     <div class="bg-logo-container">
      <div class="logo" />
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="评审管理系统" name="djpx" />
      <el-tab-pane label="日常管理系统" name="km" />
      <el-tab-pane label="VTE项目管理系统" name="rc" />
      <el-tab-pane label="院科质量监管KM系统" name="kspx" />
      <el-tab-pane label="绩效指标上报系统" name="blsj" />
      <el-tab-pane label="考试管理系统" name="blsjs" />
      <el-tab-pane label="培训管理系统" name="blsks" />
      <el-tab-pane label="不良事件系统" name="blsjsw" />
      <el-tab-pane label="人力资源管理系统" name="blsksd" />
      <el-tab-pane label="OA公文流系统" name="blsjswsx" />
      <el-tab-pane label="日常统计学评价系统" name="blsksdxc" />
    </el-tabs> -->
    <div class="login-form login-tabs">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">{{ title }}</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="账号（工号）"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="defaultPassword"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span
            class="show-pwd"
            @click="showPwd"
          >
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"

          @click.native.prevent="handleLogin"
        >登录
        </el-button>
      </el-form>
    </div>
    <div class="bg-footer-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <div>技术支持QQ：2443986764</div>
        </el-col>
        <el-col :span="12">
          <div>24小时咨询电话：4006-614-118</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div>技术支持服务时间：周一至周五8.30-17.30（节假日除外）</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { removeToken } from '@/utils/auth';
import { getRNum, GetSysCode } from '@/api/user';
import { Notification } from 'element-ui';
import aes from '@/utils/aes.js';

export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码不能少于8位'));
      } else {
        callback();
      }
    };
    return {
      // addNum:0,
      // xianzhi:false,
      defaultPassword: `密码（初始密码${this.$store.getters.iniPara.defaultPassword})`,
      title: '',
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入正确的用户名' }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    removeToken();
    this.getPageTitle();
  },
  methods: {
    getPageTitle() {
      this.title = '天智';
      if (this.$store.state.app.iniPara.title) {
        this.title += this.$store.state.app.iniPara.title;
      } else {
        this.title += '智慧医院综合质量监管平台';
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    async handleLogin() {
      try {
        if (this.loading) return;
        this.loading = true;
        const loginNum = await getRNum();
        if (loginNum.code != 200) {
          GetSysCode().then(v => {
            console.log('v', v);
            Notification({
              title: loginNum.data,
              message: v.data,
              type: 'info'
            });
          });
          return;
        }
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.$store
              .dispatch('user/login', {
                username: this.loginForm.username,
                password: aes.encrypt(this.loginForm.password)
              })
              .then(() => {
                let path = '/';
                if (window.location.search) {
                  let op = '';
                  let id = '';
                  const a = window.location.search.substr(1); // 去掉第一个字符？

                  a.split('&').forEach(para => {
                    const b = para.split('=');
                    if (b.length == 2) {
                      if (b[0] == 'trainplanId') {
                        id = b[1];
                      } else if (b[0] == 'op') {
                        op = b[1];
                      } else if (b[0] == 'examtaskId') {
                        id = b[1];
                        op = 'exam';
                      }
                    }
                  });
                  if (op == 'apply') {
                    path = `/example-train/traning/myplan?id=${id}`;
                  } else if (op == 'sign') {
                    path = `/example-train/traning/trainSign?id=${id}`;
                  } else if (op == 'exam') {
                    path = `/example-train/example/examinterface?id=${id}`;
                  } else if (op == 'meetings') {
                    path = `/managementMeetings/meetingSign?id=${id}`;
                  }
                }
                this.addNum = 0;
                this.$router.push(path);
              })
              .catch(e => {
                // this.addNum +=this.addNum;
                // if(this.addNum>3){
                //   this.$message.error('你已输入错误超过3次，请稍后输入');
                //   this.xianzhi = true;
                // }
                console.log(e);
                this.loading = false;
              });
          } else {
            this.loading = false;
          }
        });
      } catch (error) {
        console.log('error', error);
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
$dark_gray: #889aa4;
$light_grays: #eee;

@supports (-webkit-mask: none) and (not (cater-color: $bg)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 8px 5px 12px 15px;
      margin: 0 2px;
      color: $bg;
      height: 47px;
      caret-color: $bg;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $light_grays inset !important;
        -webkit-text-fill-color: black !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(46, 46, 46, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  background-image: url('../../assets/bgx.png');
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 620px;
    max-width: 100%;
    padding: 30px 30px 0 30px;
    margin: 0 auto;
    overflow: hidden;
  }

  .login-tabs {
    background-color: white;
    margin-top: 14vh;
    // margin-bottom: 22vh;
    border-radius: 10px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    margin-top: 0px;

    .title {
      font-size: 26px;
      color: rgb(70, 70, 70);
      margin: 0px auto 20px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .bg-logo-container {
    position: relative;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 10px;

    .logo {
      width: 100px;
      height: 100px;
      background-image: url('../../assets/logo.png');
      background-size: contain;
      border-radius: 10px;
    }
  }

  .bg-footer-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 88%;
    margin: auto;
    width: 620px;
    max-width: 100%;
    border-radius: 10px;
    padding: 6px 0;
    text-align: center;
    // background-color: rgba(255, 255, 255, 0.4);
    ::v-deep {
      div {
        font-weight: bold;
        color: rgb(226, 226, 226);
        font-size: 18px;
        padding: 4px 0;
      }
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  ::v-deep {
    .el-tabs--card > .el-tabs__header .el-tabs__nav {
      border: 2px solid rgb(24, 125, 189);
      border-radius: 0;
      width: 100%;
      // background-color: rgba(255, 255, 255, 0.4);
      border-right: none;
      border-left: none;
    }

    .el-tabs--card {
      width: 100%;
    }

    .el-tabs {
      width: 100%;
      border-radius: 0;
    }

    .el-tabs--card > .el-tabs__header {
      border: none !important;
    }

    .el-tabs__item {
      border: none;
      color: white;
    }
  }
}
</style>
