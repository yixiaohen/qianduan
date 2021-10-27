<template>
  <div style="height:calc(100vh - 60px)">
    <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="true"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :active="activeMenu"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem';
import variables from '@/styles/variables.scss';

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['sidebar', 'permission_routes']),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
