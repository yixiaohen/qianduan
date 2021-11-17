<template>
  <div>
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
          <span class="demonstration">查找:</span>
          <el-radio-group v-model="isYearOrMonth" size="mini" @change="isYearOrMonthc">
            <el-radio-button :label="1">按年份</el-radio-button>
            <el-radio-button :label="2">按年月</el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-if="isYearOrMonth===1"
            v-model="selectYear"
            type="year"
            size="mini"
            style="width: 120px"
            placeholder="选择年"
            value-format="yyyy"
            format="yyyy"
          />
          <span v-if="isYearOrMonth===1" class="demonstration">年</span>
          <el-button v-if="isYearOrMonth===1" type="primary" size="mini" @click="Monitor">搜索</el-button>
          <el-date-picker
            v-if="isYearOrMonth===2"
            v-model="selectYear"
            type="year"
            size="mini"
            style="width: 120px"
            placeholder="选择年"
            value-format="yyyy"
            format="yyyy"
          />
          <span v-if="isYearOrMonth===2" class="demonstration">年</span>
          <el-date-picker
            v-if="isYearOrMonth===2"
            v-model="selectMonth"
            type="month"
            size="mini"
            format="MM"
            style="width: 120px"
            value-format="MM"
            placeholder="选择月"
          />
          <span v-if="isYearOrMonth===2" class="demonstration">月</span>
          <el-button v-if="isYearOrMonth===2" type="primary" size="mini" @click="Monitor()">搜索</el-button>
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
            :monitor-table-data="monitorTableData"
            @handleCurrentChange="Monitor"
            @handleSizeChange="Monitor"
          />
        </div>
      </el-tab-pane>

    </el-tabs>

  </div>
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

      isYearOrMonth: 2, // 按照年份还是年月查找数据，这里默认展示按年月
      selectYear: '', // 选中的年份
      selectMonth: '', // 选中的月份
      activeName: '1',
      monitoNameData: [], // 监测组别名称数组，
      monitorData: [], // 监测组别标签
      monitorTableData: [],
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
    this.isYearOrMonth = 2;
    this.SelectMonGroup(); // 查询监测组别
  },
  methods: {
    // 切换查找条件，年份还是月份切换之后的处理事件
    isYearOrMonthc() {
      const times = new Date();
      this.selectYear = times.getFullYear() + ''; // 初始获取年份
      if (this.isYearOrMonth === 1) { // 如果是选中年份的，不传月份selectMonth
        this.selectMonth = null;
      } else {
        this.selectMonth = times.getMonth() + ''; // 默认展示上个月的数据所以不需要加1
      }

    },
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
          const times = new Date();
          /* 一定要注意，日期组件不能用数值，一定要转为字符串！！ */
          this.selectYear = times.getFullYear() + ''; // 初始获取年份
          this.selectMonth = times.getMonth() + ''; // 默认展示上个月的数据所以不需要加1

          this.$nextTick(async() => {
            this.isYearOrMonth = 2;
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
            year: this.selectYear,
            month: this.selectMonth,
            igroupid: this.activeName,
            pageIndex: this.listQuery.pageIndex,
            pageSize: this.listQuery.pageSize
          }
        );
        if (code === 200) {
          this.monitorTableData = data.DataList;
          this.pagination.Total = data.Total; // 获取总条数
          console.log('现在的数组', this.monitorTableData);
          this.igroupnameData = []; // 点击tab栏，先把上一栏的图标刻度名称、上月，本月数据先清空再更新数组
          this.igroupCountData = [];
          this.igroupLCountData = [];
          this.monitorTableData.map((item) => {
            this.igroupnameData.push(item.name);
            this.igroupCountData.push(item.number);
            this.igroupLCountData.push(item.lastNumber);
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

<style lang="scss" scoped>
.monitorContent {
  display: flex;
  height: 100%;
  //overflow: auto;
}
</style>
