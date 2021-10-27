<template>
  <el-tabs
    v-model="activeName"
    type="border-card"
    style="height: 100%;
    margin-top: 20px;
    overflow: auto"
    @tab-click="Monitor"
  >
    <el-tab-pane
      v-for="item in monitorData"
      :label="item.Igroupname"
      :name="item.Igroupid?(item.Igroupid+''):'1'"
    >
      <div style="font-weight: bolder;">
        <span>年月：</span>
        <el-date-picker
          v-model="igroupMonth"
          :clearable="false"
          type="month"
          size="mini"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月"
          @change="Monitor"
        />
      </div>
      <div class="monitorContent">
        <monitor-table
          ref="mtb"
          :igroupid="item.Igroupid"
          :igroupname="item.Igroupname"
          :igroupname-data="igroupnameData"
          :igroup-count-data="igroupCountData"
          :igroup-l-count-data="igroupLCountData"
          :page-index="listQuery.pageIndex"
          :page-size="listQuery.pageSize"
          :total="pagination.Total"
          :monitor-data="MonitorData"
          @handleCurrentChange="Monitor"
          @handleSizeChange="Monitor"
        />
      </div>
    </el-tab-pane>

  </el-tabs>
</template>

<script>

import { GetmonthRatio, SelectMonGroup } from '@/api/indicatorSet/I_Monitor';
import monitorTable from '@/views/indicator/components/monitorTable';

export default {
  components: {
    monitorTable
  },
  data() {
    return {
      activeName: '1',
      monitoNameData: [], // 监测组别名称数组，
      monitorData: [], // 监测组别标签
      MonitorData: [],
      igroupnameData: [],
      igroupCountData: [], // 本月图表数据
      igroupLCountData: [], // 上月图表数据
      igroupMonth: new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
      // 选择显示数据的月份
      listQuery: { // 分页数据
        pageIndex: 1,
        pageSize: 10
      },
      pagination: { // 分页数据
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [5, 10, 20, 50, 100, 200],
        Total: null
      }

    };
  },
  created() {
    this.SelectMonGroup(); // 查询监测组别


  },
  methods: {
    // 查询监测组别
    async SelectMonGroup() {
      try {
        const { data, code } = await SelectMonGroup();
        if (code === 200) {
          this.monitorData = data;
          this.activeName = this.monitorData[0].Igroupid + '';
          this.monitorData.map((item) => {
            this.monitoNameData.push(item.name);
          });
          this.$nextTick(async() => {
            await this.Monitor(); // 查询监测组别
          });

          console.log(data);
        }
      } catch (e) {
        console.log(e);
      }
    },

    // 查询监测列表数据、监测返回list
    async Monitor(index, page) {
      console.log('这是', this.activeName);
      const isNum = /^\d+$/.test(index);
      if (!isNum) { // 如果是选择月份执行改函数，传入的参数因为是月份，不是页码数，所以要进行不同的赋值
        index = ''; // 选择月份进入，判断isNum为false，!isNum为true，就将参数清空，不赋值给this.listQuery.pageIndex,因此还是保存原来的页面数
        this.$refs.mtb[0].pageIndex = 1; // 点击了月份选择，将子组件里面显示的当前页改为第一页
        this.listQuery.pageIndex = 1; // 传递查询数据的页码也改为第一页
      } else { // 不是从选择月份进入，是从改变页码进来，当前页改变就赋值新的当前页，一页显示的数量改变就赋值新的值
        if (index) {
          this.listQuery.pageIndex = index;
        }
        if (page) {
          this.listQuery.pageSize = page;
        }
      }

      try {
        const { data, code } = await GetmonthRatio(
          {
            time: this.igroupMonth,
            igroupid: this.activeName,
            pageIndex: this.listQuery.pageIndex,
            pageSize: this.listQuery.pageSize
          }
        );
        if (code === 200) {
          this.igroupnameData = [];
          this.igroupCountData = [];
          this.MonitorData = data.DataList;
          this.pagination.Total = data.Total; // 获取总条数
          this.MonitorData.map((item) => {
            this.igroupnameData.push(item['指标名称']);
            this.igroupCountData.push(item['本月']);
            this.igroupLCountData.push(item['上个月']);
          });
          console.log('数组1', this.igroupnameData);
          console.log('数组2', this.igroupCountData);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style lang="scss">
.monitorContent {
  display: flex;
  height: 100%;
  overflow: auto;
}
</style>
