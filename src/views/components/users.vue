<template>
  <el-select
    v-model="user_value"
    placeholder="用户"
    collapse-tags
    multiple
    size="mini"
    style="width: 280px;"
    clearable
    @change="getUsersValue"
  >
    <el-option
      v-for="item in options"
      :key="item.UserID"
      :label="item.UserName"
      :value="item.UserID"
    />
  </el-select>
</template>

<script>
// 职称组件
import { SelectUser } from '@/api/user';

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: [],
      user_value: this.value,
      listQuery: {
        pageSize: 1000,
        pageIndex: 1,
        condition: ''
      }
    };
  },
  watch: {
    value(x) {
      this.user_value = x;
    }
  },
  created() {
    this.SelectUser();
  },
  methods: {
    getUsersValue(value) {
      this.$emit('getUsersValue', value);
    },
    async SelectUser() {
      try {
        const { data } = await SelectUser(this.listQuery);
        this.options = data.DataList;
      } catch {}
    }
  }
};
</script>
