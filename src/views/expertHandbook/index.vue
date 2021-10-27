<template>
  <div class="ExpertHandbook">
    <el-dialog
      title="专家手册"
      :visible="dialog"
      fullscreen
      :modal="true"
      @close="handleClose"
    >
      <div class="content">
        <el-card class="box-card" shadow="never">
          <el-tabs v-model="activeName" tab-position="left">
            <el-tab-pane label="手册查阅" name="first">手册查阅</el-tab-pane>
            <el-tab-pane label="手册填写" name="third">手册填写</el-tab-pane>
            <el-tab-pane label="手册制作" name="second">手册制作</el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
      <div class="footer">
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleClose">取 消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleClose"
          >确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ExpertHandbook',
  data() {
    return {
      activeName: 'second'
    };
  },
  computed: {
    ...mapGetters(['dialog'])
  },
  methods: {
    handleClose() {
      this.$store.dispatch('components/changeDialog', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.ExpertHandbook {
  .box-card {
    height: 800px;

    .el-card__body {
      padding: 8px !important;
      height: 100%;
    }

    .el-tabs,
    .el-tabs--left,
    .el-tabs--right {
      height: 780px;
      overflow: hidden;
    }
  }
  .footer {
    position: fixed;
    bottom: 20px;
    right: 40px;
  }
}
</style>
