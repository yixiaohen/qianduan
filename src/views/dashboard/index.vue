<template>
  <div class="container">
    <!--    如果是宁海妇幼保健院，就把统计分析去掉-->
    <el-row v-if="CatalogVersion=== '宁海妇幼保健院'" :gutter="6">
      <el-col :xs="24" :sm="24" :md="12" :lg="24" :xl="24">
        <systemNotices />
      </el-col>
    </el-row>
    <el-row v-else :gutter="6">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <systemNotices />
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <todo />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import systemNotices from './components/systemNotices/index';
import todo from './components/Todo/index';

export default {
  name: 'DashboardAdmin',
  components: { systemNotices, todo },
  data() {
    return {
      CatalogVersion: window.CatalogVersion
    };
  },
  created() {
    let path = '/';
    if (window.location.search) {
      let op = '';
      let id = '';
      const a = window.location.search.substr(1); // 去掉第一个字符？

      a.split('&').forEach(para => {
        const b = para.split('=');
        if (b.length == 2) {
          if (b[0] == 'trainplanId') {
            id = b[1];
          } else if (b[0] == 'op') {
            op = b[1];
          } else if (b[0] == 'examtaskId') {
            id = b[1];
            op = 'exam';
          }
        }
      });
      if (op == 'apply') {
        path = `/example-train/traning/myplan?id=${id}`;
      } else if (op == 'sign') {
        path = `/example-train/traning/trainSign?id=${id}`;
      } else if (op == 'exam') {
        path = `/example-train/example/examinterface?id=${id}`;
      } else if (op == 'meetings') {
        path = `/managementMeetings/meetingSign?id=${id}`;
      }

      this.$router.push(path);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  background-color: rgb(240, 242, 245);
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  height: calc(100vh - 85px);

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 8px;
  }

  .el-row {
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 360px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
