<template>
  <div class="logCard">
    <el-divider content-position="left">版本日志</el-divider>
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :timestamp="activity.timestamp"
        placement="top"
      >
        <el-card>
          <span
          >
            {{ activity.content1 }}
            <br>
            {{ activity.content2 }}
            <br>
            {{ activity.content3 }}
            <br>
            {{ activity.content4 }}
            <br>
            {{ activity.content5 }}
            <br>
            {{ activity.content6 }}
            <br>
            {{ activity.content7 }}
            <br>
            {{ activity.content8 }}
          </span>

        </el-card>

      </el-timeline-item>

    </el-timeline>
  </div>
</template>

<script>
import { logData } from '@/views/versionLog/verLogMixins';

export default {
  mixins: [logData], // 引入更新版本日志的内容
  data() {
    return {};
  }

};
</script>

<style lang="scss">
.logCard {
  height: calc(100vh - 180px);
  overflow: auto;
  margin: 10px;
  border: 1px solid #eee;

  font-weight: bolder;

  .el-card {
    font-size: 16px;
    width: 90%;
    margin-left: 10px;
    margin-right: 10px;
  }

}
</style>
