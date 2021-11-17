<template>
  <el-tabs v-model="activeName" type="card">
    <!--    @tab-click="handleClick"-->
    <el-tab-pane label="定时指标数据采集" name="first">
      <div style="margin: 10px;">
        <el-button type="warning" size="mini" @click="calculate">立即触发全部计算</el-button>
        <el-tag v-if="isShowCal" style="margin-left: 10px" type="info">提示：已经开始计算，请稍等片刻在执行日志中查阅相关信息。</el-tag>
      </div>
      <el-form ref="form" label-width="80px" style="height: 680px;overflow: auto">
        <el-form-item
          v-for="(item, index) in setTimimg"
          :label="'定时'+(index+1)"
          :prop="item.TimingTime"
        >
          <el-time-picker
            v-model="item.TimingTime"
            :clearable="false"
            style="margin-right: 10px"
            size="mini"
            arrow-control
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            placeholder="任意时间点"
            @change="getTimingTime"
          >
          </el-time-picker>
          <br>
          <el-tag type="info" v-if="item.Createtime">
            <span>创建时间:{{ item.Createtime ? item.Createtime.replace('T', ' ') : '' }} </span>
            <span>
               创建人:{{ item.username }}
        </span>
          </el-tag>
          <br v-if="item.Createtime">
          <el-button type="primary" size="mini" @click="timingBtn(item,index)">保存定时</el-button>
          <el-button type="danger" size="mini" @click="offTimingBtn(item)">删除定时</el-button>

        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" @click="addTiming">添加定时</el-button>

        </el-form-item>
      </el-form>

    </el-tab-pane>
    <!--    <el-tab-pane label="手动触发计算" name="second">ip地址</el-tab-pane>-->

  </el-tabs>
</template>

<script>
import {
  DeleteTiming,
  InsertTiming,
  SaveWorkByHandsResult2,
  SelectTiming,
  UpdateTiming
} from '@/api/indicatorSet/I_Timing';

export default {
  data() {
    return {
      // TimingTime:'', // 获取当前选定的时间，用来判断更改前后时间一致性是否
      isShowCal: false,
      setTimimg: [ // 定时时间数据
        {
          TimingTime: '', // 定时时间
          Createtime: '', // 定时创建时间
          username: '', // 定时创建人
          Userid: window.userInfo[0].UserID
        }
      ],
      setTimimg2: [], // 定时时间的数据副本，主要用来对别修改后数据的异同
      activeName: 'first',
      form: { type: 'view' }
    };
  },
  created() {
    this.SelectTiming();
  },
  methods: {
    // // 获取当前改变的时间
    // getTimingTime(time) {
    //   this.TimingTime = time;
    //   console.log( this.TimingTime);
    // },
    // 立即出发全部计算
    calculate() {
      try {
        SaveWorkByHandsResult2({
          Index_ID: 0,
          UserID: window.userInfo[0].UserID
        });
        this.isShowCal = true;
        this.$message.success('已经开始计算,请稍等执行结束后在执行日志查看。');
      } catch (e) {
        console.log(e);
      }
    },

    // 查询定时
    async SelectTiming() {
      try {
        const { data, code } = await SelectTiming();
        if (code === 200) {
          this.setTimimg = data;
          this.setTimimg2 = JSON.parse(JSON.stringify(data)); // 要想用到 this.setTimimg2对别 this.setTimimg，就要深拷贝，使得改变了setTimimg，不会再改变setTimimg2，这样就可以对比前后的时间
          console.log('初始时间',this.setTimimg2);
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 添加一个定时项
    addTiming() {
      this.setTimimg.push({
        TimingTime: '', // 定时时间
        Createtime: '', // 定时创建时间
        Userid: window.userInfo[0].UserID // 定时创建人
      });
    },
    // 保存定时,新增和更新
    async timingBtn(item, index) {
      try {
        if (item.Createtime !== '') { // 如果创建时间不为空的代表是已经创建，可以更新
          if (item.TimingTime === null) { // 如果更新时清空了时间
            this.$message.warning('更新不能为空！');
            console.log(item.TimingTime);
          } else if (item.TimingTime === this.setTimimg2[index].TimingTime) { // 如果更新前后时间一致，更新失败
            console.log('旧的',this.setTimimg2[index].TimingTime);
            console.log('新的',this.TimingTime);
            this.$message.warning('更新前后时间一致，更新失败！');
          } else {
            console.log(item.TimingTime);
            const { code } = await UpdateTiming({
              TimingID: item.TimingID,
              TimingTime: item.TimingTime,
              Userid: window.userInfo[0].UserID
            });
            if (code === 200) {
              debugger
              console.log('旧的',this.setTimimg2[index].TimingTime);
              console.log('新的',this.TimingTime);
              this.$message.success('更新成功');
              await this.SelectTiming(); // 刷新
            }
          }
        } else { // 否则就添加
          if (item.TimingTime === '') {
            this.$message.warning('设定的时间不能为空！');
          } else {
            const { code } = await InsertTiming({
              TimingTime: item.TimingTime,
              Userid: window.userInfo[0].UserID
            });
            if (code === 200) {
              this.$message.success('设定成功');
              await this.SelectTiming(); // 刷新
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 删除定时
    offTimingBtn(item) {
      this.$confirm('此操作将永久删除该定时, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async() => {
        if (item.Createtime === '') { // 如果是没有保存定时就删除，就直接删除最后一项，不发送请求接口
          this.setTimimg.pop();
        } else {
          const { code } = await DeleteTiming({ TimingID: item.TimingID });
          if (code === 200) {
            await this.SelectTiming(); // 刷新
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
};
</script>

<style>
</style>
