<template>
  <div class="menus">
    <el-tree
      ref="tree"
      :data="tableData"
      :props="props"
      show-checkbox
      default-expand-all
      node-key="MenuID"
      :check-strictly="strictly"
      @check="getMenusValue"
    />
  </div>
</template>

<script>
import { SelectMenu } from '@/api/user';

export default {
  name: 'MenusComponent',
  data() {
    return {
      props: {
        value: 'MenuID',
        label: 'MemuTitle',
        children: 'Children',
        multiple: true
      },
      menus_value: null,
      strictly: true,
      tableData: []
    };
  },
  created() {
    this.getMenus();
  },
  methods: {
    getMenusValue(value) {
      this.strictly = false;
      this.menus_value = this.$refs.tree.getCheckedKeys();
      this.$emit(
        'getMenusValue',
        this.menus_value.concat(this.$refs.tree.getHalfCheckedKeys())
      );
    },
    setCheckedKeys(v = []) {
      this.strictly = true;
      this.$refs.tree.setCheckedKeys(v);
    },
    async getMenus() {
      try {
        const { data } = await SelectMenu({ titleContent: '' });
        this.tableData = data.Menus;
      } catch {
      }
    }
  }
};
</script>

<style lang="scss">
.menus {
  max-height: 500px;
  overflow-y: auto;
}
</style>
