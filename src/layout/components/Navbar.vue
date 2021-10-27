<template>
  <div class="navbar" :style="{ background: naviType ? '#fff' : '#a2c0ca4a' }">
    <router-link tag="span" to="/">
      <img src="../../assets/tiansense.png" class="logo">
    </router-link>
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <div v-if="device !== 'desktop'" class="navDsktop">
      <!-- 手机端菜单按钮 -->
      <div
        class="iconfont al-icon-daohanglantubiao_shebei"
        @click="show3 = !show3"
      />
    </div>
    <div v-if="device == 'desktop'" style="width: 6rem" />
    <div
      v-if="device == 'desktop'"
         class="nav-items-container"
    >
      <div
        v-for="(item, index) in navi"
        :key="index"
        class="nav-item"
        :style="{
          color: item.Cur == 1 ? '#3E84E9' : '#333333',
          'border-bottom': item.Cur == 1 ? '2px solid #fad162' : 'none',
          'margin-right': '5%',
        }"
        @click="navItemsClick(item.MenuTypeID)"
      >
        <svg-icon
          :icon-class="`nav_${item.MenuTypeID}`"
          :style="{
            width:
              item.MenuTypeID == '5' || item.MenuTypeID == '6'
                ? '1.4em'
                : '1em',
            height:
              item.MenuTypeID == '5' || item.MenuTypeID == '6'
                ? '1.4em'
                : '1em',
          }"
        />
        <span class="nav-item-title">{{ item.MenuTypeName }}</span>
      </div>

<!--        v-if="iniPara.hr != undefined && naviType"-->
      <div
        v-if="false"
        :style="{
          color: '#333333',
          'margin-right': '5%',
        }"
        class="nav-item"
        @click="hrClick()"
      >
        <svg-icon
          icon-class="human_resources"
          style="width: 1.2em; height: 1.2em"
        />
        <span class="nav-item-title">人力资源</span>
      </div>
    </div>
    <div v-if="device == 'desktop'" class="right-menu">
      <template>
        <div
          v-if="naviCur == 1"
          class="right-menu-item hover-effect"
          icon="el-icon-s-order"
        >
          <router-link target="_blank" :to="{ path: '/SelectCatalog' }">
            <span style="font-size: 14px; color: #ff4042">评审查阅</span>
          </router-link>
        </div>
        <div
          v-if="rule && naviCur == 1"
          class="right-menu-item hover-effect"
          @click="$router.push('/institution')"
        >
          <span style="font-size: 14px">制度管理</span>
        </div>
        <div
          v-if="search && naviCur == 1"
          class="right-menu-item hover-effect"
          @click="$router.push('/search')"
        >
          <span style="font-size: 14px">分类查询</span>
        </div>
        <div
          v-if="refer && naviCur == 1"
          class="right-menu-item hover-effect"
          v-html="refDoc"
        />
        <div
          v-if="refer == 2 && naviCur == 1"
          class="right-menu-item hover-effect"
          v-html="refDoc2"
        />
        <el-button
          v-if="naviType == 0"
          type="primary"
          size="small"
          @click="exitSystemSet()"
        >返回前台</el-button>
        <el-button
          v-if="naviType == 0"
          style="margin-right: 10px"
          size="small"
          @click="logout"
        >退出系统</el-button>
      </template>

      <el-dropdown
        v-if="naviType"
        class="avatar-container hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper name-avatar">
          <img
            src="../../assets/avatar.jpg?imageView2/1/w/80/h/80"
            class="user-avatar"
          >
          <el-tooltip
            class="item"
            effect="dark"
            :content="`${UserName}/${DeptName}`"
            placement="bottom"
          >
            <div class="text-avatar">
              {{ UserName.substr(UserName.length - 3, 3) }}
            </div>
          </el-tooltip>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/" divided>
            <el-dropdown-item>
              <svg-icon icon-class="home" />&nbsp;&nbsp;首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display: block" @click="open">
              <svg-icon icon-class="user" />&nbsp;&nbsp;修改密码
            </span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display: block" @click="logout">
              <svg-icon icon-class="exit" />&nbsp;&nbsp;退出登录
            </span>
          </el-dropdown-item>
          <el-dropdown-item v-if="hasSys" divided>
            <el-button
              type="primary"
              class="handel-button"
              size="small"
              @click="enterSystemSet()"
            >进入后台管理</el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      :width="device === 'desktop' ? '30%' : '90%'"
      title="修改密码"
      :close-on-click-modal="false"
      :visible.sync="dialogTableVisible"
      append-to-body
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="密码" prop="pass">
          <el-input
            v-model="ruleForm.pass"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            v-model="ruleForm.checkPass"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 手机端下拉菜单 -->
    <el-collapse-transition>
      <div v-show="show3" ref="dropdown" class="dropdown">
        <div
          v-for="(item, index) in navi"
          :key="index"
          @click="
            navItemsClick(item.MenuTypeID)
            show3 = false
          "
        >
          {{ item.MenuTypeName }}<i class="nav-item el-icon-arrow-right" />
        </div>
        <div v-if="rule && naviCur == 1" @click="show3 = false">
          <router-link
            target="_blank"
            :to="{ path: '/SelectCatalog' }"
          >评审查阅<i
            class="nav-item el-icon-arrow-right"
          /></router-link>
        </div>
        <div
          v-if="rule && naviCur == 1"
          @click="
            $router.push('/institution')
            show3 = false
          "
        >
          制度管理<i class="nav-item el-icon-arrow-right" />
        </div>
        <div
          v-if="rule && naviCur == 1"
          @click="
            $router.push('/search')
            show3 = false
          "
        >
          分类查询<i class="nav-item el-icon-arrow-right" />
        </div>
        <div v-if="refer && naviCur == 1" v-html="refDoc" />
        <div v-if="refer == 2 && naviCur == 1" v-html="refDoc2" />
        <div
          v-if="iniPara.hr != undefined && naviType"
          class="nav-item"
          @click="
            hrClick()
            show3 = false
          "
        >
          人力资源<i class="nav-item el-icon-arrow-right" />
        </div>
        <div
          v-if="rule && naviType"
          @click="
            open()
            show3 = false
          "
        >
          修改密码<i class="nav-item el-icon-arrow-right" />
        </div>
        <div
          v-if="naviType == 0"
          @click="
            exitSystemSet()
            show3 = false
          "
        >
          返回前台<i class="nav-item el-icon-arrow-right" />
        </div>
        <div
          @click="
            logout()
            show3 = false
          "
        >
          退出系统<i class="nav-item el-icon-arrow-right" />
        </div>
        <div
          v-if="rule && naviType"
          divided
          @click="
            enterSystemSet()
            show3 = false
          "
        >
          进入后台管理
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { resetRouter } from '@/router';
import Hamburger from '@/components/Hamburger';
import { UpdatePwd } from '@/api/user';

export default {
  components: {
    Hamburger
  },
  data() {
    var validatePass = (rule, value, callback) => {
      const pwdRegex = new RegExp(
        '(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}'
      );
      if (!pwdRegex.test(value)) {
        callback(
          new Error('您的密码复杂度过低!(密码中必须包含字母、数字、特殊字符)')
        );
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      rule: 1,
      search: 1,
      refer: 1,
      refDoc: '',
      refDoc2: '',
      dialogTableVisible: false,

      ruleForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      },
      dropdown: false,
      show3: false
    };
  },

  created() {
    this.$nextTick(() => {
      this.getIni();
    });
  },
  computed: {
    ...mapGetters([
      'iniPara',
      'navi',
      'naviType',
      'naviCur',
      'menuCur',
      'hasSys',
      'sidebar',
      'avatar',
      'device',
      'UserName',
      'DeptName'
    ])
  },
  mounted() {
    document.addEventListener('click', e => {
      if (!this.$el.contains(e.target)) {
        if (this.show3 === true) {
          this.show3 = false; // 这句话的意思是点击其他区域关闭（也可以根据自己需求写触发事件）
        }
      }
    });
  },

  methods: {
    dropdownFun() {
      if (this.dropdown === true) {
        this.dropdown = false;
      } else {
        this.dropdown = true;
      }
    },

    hrClick() {
      window.open(
        `http://${this.iniPara.hr}?user=${window.userInfo[0].UserCode}`
      );
    },
    async navItemsClick(id) {
      if (this.naviCur !== id) {
        this.$store.dispatch('tagsView/delAllViews');
        const menu = await this.$store.dispatch('user/getNavi', id);
        const res = await this.$store.dispatch(
          'permission/generateRoutes',
          menu
        );
        resetRouter();
        this.$router.addRoutes(res);
        if (
          this.menuCur[parseInt(this.naviCur)] === undefined ||
          this.menuCur[parseInt(this.naviCur)] === ''
        ) {
          if (res.length > 0) {
            if (res[0].children.length > 0) {
              this.$router.push({ name: res[0].children[0].name });
            } else this.$router.push({ path: res[0].path });
          }
        } else {
          this.$router.push({ path: this.menuCur[parseInt(this.naviCur)] });
        }
      }
    },
    async enterSystemSet() {
      await this.$store.dispatch('user/getNaviType', { type: 0, typeID: 0 });
      this.navItemsClick(0);
    },
    async exitSystemSet() {
      const data = await this.$store.dispatch('user/getNaviType', {
        type: 1,
        typeID: 1
      });
      this.navItemsClick(data[0].MenuTypeID);
    },
    async submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const form = {
            UserID: window.userInfo[0].UserID,
            UserPwd: this.ruleForm.checkPass
          };
          UpdatePwd(form).then(data => {
            if (data.code === 200) {
              this.$message.success('密码修改' + data.msg);
              this.dialogTableVisible = false;
              this.logout();
              return;
            }
            this.$message.error(data.msg);
          });
        } else {
          this.$message.error('请您输入正确的密码!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    async getIni() {
      try {
        const para = this.$store.getters.iniPara;
        if (para.rule === 0) this.rule = 0;
        if (para.search === 0) this.search = 0;
        this.refer = para.refer;
        if (this.refer === 1 || this.refer === 2) {
          const name =
            para.refDoc === undefined || para.refDoc === ''
              ? '参考资料'
              : para.refDoc;
          if (
            para.refDocInner !== '' &&
            para.refDocOuter !== '' &&
            para.refDocInner !== para.refDocOuter
          ) {
            let a = para.refDocInner;
            if (
              !window.location.host.includes('localhost') &&
              !window.location.host.includes('127.0.0.1') &&
              !window.location.host.includes(a.slice(0, a.indexOf('.') + 1))
            ) {
              a = para.refDocOuter;
            }
            if (this.device === 'desktop') {
              // 当前网络ip是与配置中的内网ip不同网段
              this.refDoc = `<a
            style="font-size:14px;color:blue"
            target="_blank"
            href="http://${a}/?un=admin&up=${para.pwd}">${name}</a>`;
            } else {
              this.refDoc = `<a
            style="font-size:15px;color: #fff;"
            target="_blank"
            href="http://${a}/?un=admin&up=${para.pwd}">${name}</a>`;
            }
            // href="http://${a}/?un=admin&up=${para.pwd}">${name}</a><i style=" position: relative;left: 40%;" class="nav-item el-icon-arrow-right" />`;
          } else if (para.refDocInner !== '' && para.refDocOuter === '') {
            if (this.device === 'desktop') {
              this.refDoc = `<a
            style="font-size:14px;color:blue"
            target="_blank"
            href="http://${para.refDocInner}/?un=admin&up=${para.pwd}">${name}</a>`;
            } else {
              this.refDoc = `<a
            style="font-size:15px;color:#fff"
            target="_blank"
            href="http://${para.refDocInner}/?un=admin&up=${para.pwd}">${name}</a>`;
            }
          }
        }
        if (this.refer === 2) {
          const name =
            para.refDoc2 === undefined || para.refDoc2 === ''
              ? '参考资料'
              : para.refDoc2;
          if (
            para.refDocInner2 !== '' &&
            para.refDocOuter2 !== '' &&
            para.refDocInner2 !== para.refDocOuter2
          ) {
            let a = para.refDocInner2;
            if (
              !window.location.host.includes('localhost') &&
              !window.location.host.includes('127.0.0.1') &&
              !window.location.host.includes(a.slice(0, a.indexOf('.') + 1))
            ) {
              a = para.refDocOuter2;
            }
            if (this.device === 'desktop') {
              // 当前网络ip是与配置中的内网ip不同网段
              this.refDoc2 = `<a
            style="font-size:14px;color:blue"
            target="_blank"
            href="http://${a}/?un=admin&up=${para.pwd2}">${name}</a>`;
            } else {
              this.refDoc2 = `<a
            style="font-size:15px;color: #fff;"
            target="_blank"
            href="http://${a}/?un=admin&up=${para.pwd2}">${name}</a>`;
            }
          } else if (para.refDocInner2 !== '' && para.refDocOuter2 === '') {
            if (this.device === 'desktop') {
              this.refDoc2 = `<a
            style="font-size:14px;color:blue"
            target="_blank"
            href="http://${para.refDocInner2}/?un=admin&up=${para.pwd2}">${name}</a>`;
            } else {
              this.refDoc2 = `<a
            style="font-size:15px;color:#fff"
            target="_blank"
            href="http://${para.refDocInner2}/?un=admin&up=${para.pwd2}">${name}</a>`;
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    open() {
      this.dialogTableVisible = true;
      this.ruleForm.pass = '';
      this.ruleForm.checkPass = '';
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      this.$store.dispatch('tagsView/delAllViews');
      this.$router.push(`/login`);
    },
    changeDialog() {
      this.$store.dispatch('components/changeDialog', true);
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  width: 100%;
  display: flex;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .dropdown {
    width: 100%;
    // height: 400px;
    background: rgba(7, 86, 68, 0.9);
    box-sizing: border-box;
    position: fixed;
    top: 50px;
    left: 0;
    overflow: auto;
    z-index: 9999;
    div {
      width: 90%;
      margin: 0 auto;
      padding: 15px 0.28rem;
      font-size: 15px;
      color: #fff;
      height: 50px;
      transition: all 0.5s ease-in-out;
      padding: 0 auto;
      line-height: 20px;
      border-bottom: 1px solid #fff;
      text-align: center;
    }
    i {
      position: relative;
      left: 40%;
    }
  }
  .navDsktop {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    div {
      margin: 10px;
    }
  }
  .logo {
    margin: 5px;
    width: 53px;
    height: 40px;
    vertical-align: middle;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .nav-items-container {
    flex: 2;
    display: flex;
    flex-direction: row;
    align-items: center;

    .nav-item {
      display: flex;
      cursor: pointer;
      height: 100%;
      align-items: center;
    }
    .nav-item-title {
      padding-left: 5px;
      font-size: 15px;
      min-width: 30px;
    }
  }

  .right-menu {
    flex: 1.5;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      font-size: 14px;
      color: #5a5e66;
      margin-right: 8px;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      .name-avatar {
        display: flex;
        align-items: center;
        span {
          font-weight: bold;
          margin-right: 6px;
          font-size: 14px;
        }
      }
      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .text-avatar {
          cursor: pointer;
          position: absolute;
          left: 2px;
          font-size: 12px;
          color: #5a595a;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
