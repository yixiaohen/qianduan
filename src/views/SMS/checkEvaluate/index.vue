<template>
  <div>
    <div class="leiXing">
      <span>评审考评类型：</span>
      <el-radio-group
        v-model="checkEvaluateStatus"
        size="small"
        label=""
        @change="changeCheckEvaluateStatus"
      >
        <el-radio
          :label="1"
          border
        >等级制
        </el-radio>
        <el-radio
          :label="2"
          border
        >分数制
        </el-radio>
      </el-radio-group>
    </div>
  </div>
</template>
<script>
import { DoStyleSwitchOn, GetCatalogCfgInfo } from '@/api/SMS';

export default {
  data() {
    return {
      checkEvaluateStatus: 1 // 考评配置状态，1为等级制，2为分数制
    };
  },
  created() {
    this.chaKan();
  },
  methods: {
    // 模式切换
    async changeCheckEvaluateStatus() {
      try {
        const { code } = await DoStyleSwitchOn({
          CurrentStatus: this.checkEvaluateStatus,
          UserID: window.userInfo[0].UserID
        });
        if (code === 200) {
          this.$message.success('已更改');
        }
      } catch (e) {
        this.$message.error('出现未知错误。');
      }
    },
    // 获取评审考评类型，等级还是分数制
    async chaKan() {
      const { data } = await GetCatalogCfgInfo({});
      this.checkEvaluateStatus = data[0].CurrentStatus;
    }
  }
};
</script>

<style lang="scss">
.leiXing {
  margin-top: 5vh;
  border-bottom: 1px solid #3daacf;
  padding-bottom: 1vh;
  padding-left: 2vh;
  .el-radio-group{
    margin-left: 5vh;
  }
}
</style>
