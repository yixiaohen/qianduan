<template>
  <div class="task">
    <el-table
      ref="task"
      :data="stateData"
      border
      class="table-style"
      style="width: 100%"
      size="mini"
      height="60vh"
    >
      <el-table-column
        width="39"
        align="center"
      >
        <template slot-scope="{ row, $index }">
          <el-checkbox
            v-model="row.CheckState"
            @change="(val) => checkbox(row, $index)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="Title"
        label="任务名称"
      />
      <el-table-column
        prop="EndDate"
        label="截止时间"
        width="140"
        align="center"
      />
      <el-table-column
        prop="State"
        label="状态"
        width="90"
        align="center"
      />
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    stateData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    checkbox(row) {
      console.log('row', row);
      this.$emit('checkbox', row);
    }
  }
};
</script>
<style lang="scss">
.task {
  margin: 0;
  padding: 0;
}
.el-table {
  margin: 0;
  padding: 0;
}
</style>
