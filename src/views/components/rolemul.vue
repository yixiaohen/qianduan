<template>
  <el-select
    v-model="role_value"
    placeholder="角色"
    :multiple="multipleR"
    collapse-tags
    size="mini"
    clearable
    :style="'width:' + width"
    @change="getRoleValue"
  >
    <el-option
      v-for="item in options"
      :key="item.RoleID"
      :label="item.RoleName"
      :value="item.RoleID"
    />
  </el-select>
</template>

<script>
// 角色组件
import { SelectRole } from '@/api/user';

export default {
  name: 'RoleComponent',
  props: {
    value: {
      type: Array,
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    w: {
      type: String,
      default: '120px'
    }
  },
  data() {
    return {
      options: [],
      multipleR: this.multiple,
      role_value: this.value,
      width: this.w,
      listQuery: {
        pageSize: 1000,
        pageIndex: 1,
        condition: ''
      }
    };
  },
  watch: {
    value(x) {
      this.role_value = x;
    }
  },
  created() {
    this.SelectRole();
  },
  methods: {
    getRoleValue(value) {
      this.$emit('getRoleValue', value);
    },
    async SelectRole() {
      try {
        const { data } = await SelectRole(this.listQuery);
        this.options = data.DataList;
      } catch {}
    }
  }
};
</script>
