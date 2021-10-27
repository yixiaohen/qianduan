<template>
  <el-container>
    <el-main>
      <el-row>
        <el-tag>手动数据采集，实时更新</el-tag>
      </el-row>
      <el-row style="height:10px" />
      <el-card>
        <el-row
          type="flex"
          align="middle"
        >
          <el-col :span="3">
            <el-button>从HIS系统数据采集</el-button>
          </el-col>
          <el-col
            :span="10"
          >
            <el-progress :percentage="10" />
          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <el-row
          type="flex"
          align="middle"
        >
          <el-col :span="3">
            <el-button>从不良事件模块数据采集</el-button>
          </el-col>
          <el-col
            :span="10"
          >
            <el-progress :percentage="10" />
          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <el-row
          type="flex"
          align="middle"
        >
          <el-col :span="3">
            <el-button>从绩效模块数据采集</el-button>
          </el-col>
          <el-col
            :span="10"
          >
            <el-progress :percentage="10" />
          </el-col>
        </el-row>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
export default {};
</script>

<style>
</style>
