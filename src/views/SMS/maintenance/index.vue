<template>
  <div>
    <div class="maintenanceContainer">
      <span>1.覆盖保存评审条款分配人员部门：</span>
      <el-button
        :loading="ImmediatelyLoading"
        type="primary"
        size="mini"
        @click="Immediately"
      >
        立即覆盖
      </el-button>

    </div>
  </div>
</template>
<script>

import { UpdatetEvaluationUserDept } from '@/api/EvaluationUser';

export default {
  data() {
    return {
      ImmediatelyLoading: false, // 立即覆盖按钮等待圈
    };
  },
  created() {
  },
  methods: {
    async Immediately() {
      try {
        this.ImmediatelyLoading = true; // 开启按钮等待圈
        const { code } = await UpdatetEvaluationUserDept();
        if (code === 200) {
          this.$message.success('成功');
          this.ImmediatelyLoading = false; // 关闭按钮等待圈
        }
      } catch (e) {
        this.ImmediatelyLoading = false; // 关闭按钮等待圈
        console.log(e);
      }
    }
  }
};
</script>

<style lang="scss">
.maintenanceContainer {
  margin:20px;
  border: 1px solid #3daacf;
  padding:10px;
  span{
    font-weight: bolder;
  }


}
</style>
