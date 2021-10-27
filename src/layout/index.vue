<template>
  <el-container :class="classObj" style="height: 100%">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <el-header class="nav-container">
      <navbar :nav-index="0" @nav-items-click="navClick" />
    </el-header>
    <el-container>
      <el-aside width="auto" class="sidebar-container">
        <sidebar />
      </el-aside>
      <el-main class="main-container">
        <div :class="{ hasTagsView: needTagsView }">
          <div>
            <tags-view v-if="needTagsView" />
          </div>
          <app-main />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import RightPanel from '@/components/RightPanel';
import ExpertHandbook from '@/views/expertHandbook/index';
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components';
import ResizeMixin from './mixin/ResizeHandler';
import { mapGetters } from 'vuex';

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    Settings,
    AppMain,
    TagsView,
    RightPanel,
    ExpertHandbook
  },
  mixins: [ResizeMixin],
  data() {
    return {
      dialogVisible: false
    };
  },
  computed: {
    ...mapGetters(['sidebar', 'device', 'needTagsView']),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      };
    }
  },
  created() {},
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false });
    },
    navClick(index) {},

    // 新增跳转
    addSkip(val) {
      switch (val.label) {
        case '日志':
          this.$router.push({ path: 'journal', query: { routerKey: 1 }});
          break;
        case '审批':
          this.showCategorySelect = true;
          break;
        case '任务':
          this.$router.push({ path: 'task', query: { routerKey: 1 }});
          break;
        case '日程':
          this.$router.push({ path: 'schedule-new', query: { routerKey: 1 }});
          break;
        case '公告':
          this.$router.push({ path: 'notice-new', query: { routerKey: 1 }});
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./styles/common.scss";
@import "~@/styles/index.scss";

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.nav-container {
  padding: 0;
  box-shadow: 0px 1px 2px #dbdbdb;
  z-index: 100;
  min-width: 500px;
  height: 50px !important;
}

.quick-add {
  height: 178px;
}
</style>
