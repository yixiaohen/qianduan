<template>
  <el-container>
    <el-header style="height: 40px">
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-radio-group v-model="radio1" size="small">
            <el-radio-button label="表格统计" />
            <el-radio-button label="图形统计" />
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="radio1 == '表格统计'">
          <el-select
            v-model="value1"
            multiple
            collapse-tags
            style="margin-left: 20px"
            placeholder="请选择一般专科"
            clearable
            @change="elSelect1"
          >
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.DirectoryName"
              :value="item.DirectoryID"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="radio1 == '表格统计'">
          <el-select
            v-model="value2"
            multiple
            collapse-tags
            style="margin-left: 20px"
            placeholder="请选择重点专科"
            clearable
            @change="elSelect2"
          >
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.DirectoryName"
              :value="item.DirectoryID"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="radio1 == '表格统计'">
          <el-button icon="el-icon-search" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main style="height: calc(100vh - 200px)">
      <transition
        name="el-zoom-in-center"
      ><div
        v-show="radio1 == '图形统计'"
        ref="myChart"
        style="width: 1400px; height: 700px"
      />
      </transition>
      <transition name="el-zoom-in-center">
        <el-table
          v-show="radio1 == '表格统计'"
          v-loading="loading"
          :data="tableData"
          stripe
          style="width: 100%; height: clac(100vh - 250px)"
          size="mini"
          border
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
          />
          <el-table-column prop="DirectoryName" label="专科" width="300px" />
          <el-table-column
            prop="specialty"
            label="专科类型"
            width="100px"
            align="center"
          />
          <el-table-column
            prop="FullMarks"
            label="满分"
            align="center"
            width="150px"
          >
            <template slot-scope="{ row }">
              <h2 v-if="row.FullMarks.toString().indexOf('分') != -1">
                {{ row.FullMarks }}
              </h2>
              <span v-else>{{ row.FullMarks }}</span>
            </template></el-table-column>
          <el-table-column
            prop="score"
            label="得分"
            align="center"
            width="150px"
          >
            <template slot-scope="{ row }">
              <h2 v-if="row.score.toString().indexOf('分') != -1">
                {{ row.score }}
              </h2>
              <span v-else>{{ row.score }}</span>
            </template>
          </el-table-column>
        </el-table>
      </transition>
    </el-main>
    <el-footer />
  </el-container>
</template>
<script>
import echarts from 'echarts';
import { SelectDirectorys } from '@/api/TechnicalStandard/StandardDisplay';

export default {
  data() {
    return {
      categoryData: [],
      errorData: [],
      barData: [],
      dataCount: 100,
      radio1: '表格统计',
      tableData: [],
      num: 0,
      options1: [],
      options2: [],
      value1: '',
      value2: '',
      loading: false
    };
  },
  mounted() {
    this.select();
    this.SelectDirectorys();
  },
  methods: {
    async SelectDirectorys() {
      try {
        this.loading = true;
        this.tableData = [];
        const { data } = await SelectDirectorys({ data: 'data' });
        data[0].Children.map((item, index) => {
          if (index < 16) {
            this.tableData.push({
              DirectoryID: item.DirectoryID,
              DirectoryName: item.DirectoryName.replace(
                /([1-9][0-9]{0,1}|100)./g,
                ''
              ),
              specialty: index < 8 ? '重点' : '一般',
              FullMarks: index < 8 ? 75 : 50,
              score:
                index < 8
                  ? Math.floor(Math.random() * (1 - 75) + 75)
                  : Math.floor(Math.random() * (1 - 50) + 50)
            });
            this.num += this.tableData[index].score;
          }
        });
        this.options2 = data[0].Children;
        this.options1 = data[0].Children;
        this.tableData.push({
          FullMarks: '总满分：1000',
          score: '得分：' + this.num
        });
      } catch (error) {
        console.log(error);
      }
      setTimeout(() => {
        this.loading = false;
      }, 150);
    },

    select() {
      const myChart = echarts.init(this.$refs.myChart);
      var option;

      var categoryData = [];

      var barData = [];
      var dataCount = 100;
      for (var i = 0; i < dataCount; i++) {
        var val = Math.random() * 1000;
        categoryData.push('category' + i);

        barData.push(echarts.number.round(val, 2));
      }

      function renderItem(params, api) {
        var xValue = api.value(0);
        var highPoint = api.coord([xValue, api.value(1)]);
        var lowPoint = api.coord([xValue, api.value(2)]);
        var halfWidth = api.size([1, 0])[0] * 0.1;
        var style = api.style({
          stroke: api.visual('color'),
          fill: null
        });

        return {
          type: 'group',
          children: [
            {
              type: 'line',
              transition: ['shape'],
              shape: {
                x1: highPoint[0] - halfWidth,
                y1: highPoint[1],
                x2: highPoint[0] + halfWidth,
                y2: highPoint[1]
              },
              style: style
            },
            {
              type: 'line',
              transition: ['shape'],
              shape: {
                x1: highPoint[0],
                y1: highPoint[1],
                x2: lowPoint[0],
                y2: lowPoint[1]
              },
              style: style
            },
            {
              type: 'line',
              transition: ['shape'],
              shape: {
                x1: lowPoint[0] - halfWidth,
                y1: lowPoint[1],
                x2: lowPoint[0] + halfWidth,
                y2: lowPoint[1]
              },
              style: style
            }
          ]
        };
      }

      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        title: {
          text: '统计'
        },
        legend: {
          data: ['bar']
        },
        dataZoom: [
          {
            type: 'slider',
            start: 50,
            end: 70
          },
          {
            type: 'inside',
            start: 50,
            end: 70
          }
        ],
        xAxis: {
          data: categoryData
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            name: 'bar',
            data: barData,
            itemStyle: {
              color: '#77bef7'
            }
          }
        ]
      };

      option && myChart.setOption(option, true);
    },
    elSelect1(val) {
      if (val.length > 8) {
        this.$message.warning('只能选择8个专科哦！');
      }
    },
    elSelect2(val) {
      if (val.length > 8) {
        this.$message.warning('只能选择8个专科哦！');
      }
    }
  }
};
</script>

<style lang="scss">
.el-header,
.el-main,
.el-footer {
  padding: 0px;
  margin: 0px;
}

.el-loading-spinner {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  -webkit-animation: typing 1s linear infinite alternate;
  -moz-animation: Typing 1s linear infinite alternate;
  animation: typing 1s linear infinite alternate;
  margin: 0px auto; /* Not necessary- its only for layouting*/
  position: relative;
  left: -40px;
}
@-webkit-keyframes typing {
  0% {
    background-color: rgba(247, 111, 73, 1);
    box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
  }
  25% {
    background-color: rgba(247, 111, 73, 0.4);
    box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
  }
  75% {
    background-color: rgba(247, 111, 73, 0.4);
    box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 1);
  }
}

@-moz-keyframes typing {
  0% {
    background-color: rgba(247, 111, 73, 1);
    box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
  }
  25% {
    background-color: rgba(247, 111, 73, 0.4);
    box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
  }
  75% {
    background-color: rgba(247, 111, 73, 0.4);
    box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 1);
  }
}
@keyframes typing {
  0% {
    background-color: rgba(247, 111, 73, 1);
    box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
  }
  25% {
    background-color: rgba(247, 111, 73, 0.4);
    box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
  }
  75% {
    background-color: rgba(0, 184, 220, 0.4);
    box-shadow: 40px 0px 0px 0px rgba(249, 54, 0, 0.2),
      80px 0px 0px 0px rgb(2, 243, 130);
  }
}
.el-loading-spinner .circular {
  display: none; //隐藏之前element-ui默认的loading动画
}
</style>
