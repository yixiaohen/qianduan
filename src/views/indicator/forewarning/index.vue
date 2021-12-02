<template>
  <div>
    <div class="pg">
      <el-form
        :inline="true"
        size="mini"
      />

      <div
        v-if="device === 'desktop'"
        class="main"
      >

        <split-pane
          :default-percent="20"
          :min-percent="10"
          split="vertical"
        >
          <template slot="paneL">
            <div class="content_left">
              <div>
                <el-alert
                  :closable="false"
                  title="指标"
                  type="info"
                  style="font-weight: bolder;"
                />

              </div>
              <IndexNavTree
                ref="forewarning"
                :key="key"
                @nodeClickCatalog="nodeClickCatalog"
              />
            </div>
          </template>
          <template slot="paneR">
            <div class="content_right">
              <div class="middle">
                <div class="targetVis">
                  <div>指标名称：
                    <span v-if="nodeValue.name!==''">{{ nodeValue.name }}</span>
                  </div>
                  <div>指标编码：
                    <span v-if="nodeValue.formulaObj!==''">{{ nodeValue.formulaObj }}</span>
                  </div>
                  <div>
                    <el-button
                      :disabled="fwmRecord.addFwnBtn"
                      type="success"
                      size="mini"
                      class="el-icon-circle-plus-outline"
                      @click="openFwmDia"
                    >{{ addFwnBtnName }}
                    </el-button>

                    <el-button
                      type="success"
                      size="mini"
                      class="el-icon-plus"
                      @click="openFwmGroupDia"
                    >添加组别
                    </el-button>
                  </div>
                </div>
                <el-card>
                  <el-table
                    v-loading="fwmListDataLoading"
                    :data="fwmListData"
                    border
                    style="width:100%;height:calc(100vh - 220px)"
                    highlight-current-row
                  >
                    <el-table-column
                      fixed
                      type="index"
                      label="序号"
                      align="center"
                      width="50"
                    />
                    <el-table-column
                      prop="formulaObj"
                      label="指标编码"
                      width="120"
                      align="center"
                    />
                    <el-table-column
                      prop="name"
                      label="指标名称"
                      align="center"
                    />
                    <el-table-column
                      prop="GroupName"
                      label="分组名称"
                      align="center"
                    />


                    <!--                    <el-table-column-->
                    <!--                      prop="AnticSql"-->
                    <!--                      label="sql预警语句"-->
                    <!--                    />-->

                    <el-table-column
                      prop="username"
                      label="操作人"
                      width="120"
                      align="center"
                    />
                    <el-table-column
                      fixed="right"
                      label="操作"
                      align="center"
                    >
                      <template slot-scope="{ row }">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="openEdiFwmDia(row)">编辑
                        </el-button>
                        <el-button
                          type="success"
                          size="mini"
                          icon="el-icon-edit-outline"
                          @click="openGraFwmDiaOut(row)"
                        >粒度
                        </el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="FwmDelBtn(row)">删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!--                        分页-->
                  <div class="block">
                    <el-pagination
                      style="margin: 6px 0 0 0"
                      :page-sizes="pagination.pageSizes"
                      :page-size="pagination.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :current-page="listQuery.pageIndex"
                      :total="pagination.Total"
                      @current-change="handleCurrentChange"
                      @size-change="handleSizeChange"
                    />
                  </div>
                </el-card>

              </div>
            </div>
          </template>
        </split-pane>
        <!--预警配置对话框-->
        <el-dialog
          :title="fwmRecord.configIndexTitle"
          :visible.sync="fwmRecord.visible"
          width="50%"
        >
          <div style="width: 100%;height: 100%">
            <el-form ref="form" label-width="100px" size="mini">
              <el-form-item label="编码:">
                {{ fwmFormData.formulaObj }}
              </el-form-item>
              <el-form-item label="指标名称:">
                {{ fwmFormData.AnticDeployName }}
              </el-form-item>
              <el-form-item label="数据源">
                <el-select v-model="fwmFormData.conn_id" placeholder="请选择指标" style="width: 200px">
                  <el-option
                    v-for="item in databaseSrc"
                    :key="item.conn_id"
                    :label="item.sqlcon"
                    :value="item.conn_id"
                  >
                    <span style="float: left">{{ item.sqlcon }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.type }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="分组">
                <el-select v-model="fwmFormData.AnticGroupID" placeholder="请选择分组" style="width: 200px">
                  <el-option
                    v-for="item in groupListData"
                    :key="item.AnticGroupID"
                    :label="item.GroupName"
                    :value="item.AnticGroupID"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>

          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="fwmRecord.visible = false">取消</el-button>
            <el-button
              v-if="fwmRecord.configIndexTitle==='添加预警'"
              size="mini"
              type="primary"
              @click="finishFwmBtn"
            >新增</el-button>
            <el-button v-else size="mini" type="primary" @click="updateFwmBtn">修改</el-button>
          </span>
        </el-dialog>
        <!--组别设置对话框-->
        <el-dialog
          :title="groupRecord.configIndexTitle"
          :visible.sync="groupRecord.visible"
          width="30%"
        >
          <el-button
            :disabled="!groupRecord.editVisible"
            icon="el-icon-circle-plus-outline"
            type="primary"
            size="small"
            @click="addGroup"
          >
            添加组别
          </el-button>
          <el-table
            v-loading="groupRecord.tableLoading"
            :data="groupListData"
            style="width: 100%"
            border
          >
            <el-table-column
              type="index"
              label="序号"
              width="50"
              align="center"
            />
            <el-table-column
              prop="GroupName"
              label="组别名"
              width="180"
              align="center"
            >
              <template slot-scope="{ row,$index }">
                <span v-if="groupRecord.indexes!==$index ">
                  {{ row.GroupName }}
                </span>
                <el-input v-if="groupRecord.indexes===$index " v-model="row.GroupName" size="mini" />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="{ row,$index }">
                <el-button
                  v-if="groupRecord.editVisible"
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editGroup(row,$index )"
                >编辑
                </el-button>
                <el-button
                  v-if="groupRecord.indexes===$index"
                  :loading="groupRecord.finishLoading"
                  type="success"
                  size="mini"
                  icon="el-icon-circle-check"
                  @click="finishGroup(row)"
                >完成
                </el-button>
                <el-button
                  v-if="groupRecord.indexes===$index "
                  type="warning"
                  size="mini"
                  icon="el-icon-circle-close"
                  @click="giveUpGroup"
                >放弃
                </el-button>

                <el-button
                  v-if="groupRecord.editVisible"
                  :loading="groupRecord.delLoading"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delGroup(row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="groupRecord.visible=false">取消</el-button>
            <el-button size="mini" type="primary" @click="groupRecord.visible=false">确定</el-button>
          </span>
        </el-dialog>
        <!--粒度设置对话框-->
        <el-dialog title="粒度列表" :visible.sync="GraRecord.visibleOut" width="70%">
          <el-dialog
            width="30%"
            :title="GraRecord.configIndexTitle"
            :visible.sync="GraRecord.visibleIn"
            append-to-body
          >
            <el-form
              :model="GraFormData"
              label-width="100px"
            >
              <el-form-item
                label="年份"
                prop="Year"
              >
                <el-input
                  v-model="GraFormData.Year"
                  style="width:50%"
                  size="small"
                  clearable
                />
              </el-form-item>
              <el-form-item
                label="粒度"
              >
                <el-input
                  v-model="GraFormData.Granularity"
                  style="width:50%"
                  size="small"
                  clearable
                />
              </el-form-item>
              <el-form-item
                label="周期类型"
              >
                <el-select
                  v-model="GraFormData.Cycleid"
                  filterable
                  clearable
                  style="width:50%"
                  placeholder="请选择"
                  size="mini">
                  <el-option
                    v-for="item in cycle"
                    :key="item.Cycleid"
                    :value="item.Cycleid"
                    :label="
                      item.Starway === 0 ? item.Type+' | '+'结束日期往前' +
                        ' | '+
                        item.Cycle +
                        ' | '+
                        item.Num : item.Starway === 10 ?item.Type+ ' | '+'今年' +
                        ' | '+
                        item.Cycle +
                        ' | '+
                        item.Num : item.Starway === 11 ?item.Type+ ' | '+'当季' +
                          ' | '+
                          item.Cycle +
                          ' | '+
                          item.Num : item.Starway === 12 ? item.Type+' | '+'当月' +
                            ' | '+
                            item.Cycle +
                             ' | '+
                          item.Num : item.Starway === 20 ? item.Type+' | '+'去年' +
                            ' | '+
                            item.Cycle +
                            ' | '+
                            item.Num : item.Starway
                    "
                  >
                    <span style="float: left">{{ item.Type }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                    >{{
                      item.Starway === 0 ? '结束日期往前' : item.Starway === 10 ? '今年' : item.Starway === 11 ? '当季' : item.Starway === 12 ? '当月'  : item.Starway === 20 ? '去年': item.Starway
                    }}{{ ' | ' + item.Cycle + ' | ' + item.Num }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="上限"
                prop="UpperLimit"
              >
                <el-input
                  v-model.number="GraFormData.UpperLimit"
                  style="width:50%"
                  size="small"
                  type="number"
                  clearable
                />
              </el-form-item>
              <el-form-item
                label="下限"
                prop="LowerLimit"
              >
                <el-input
                  v-model.number="GraFormData.LowerLimit"
                  style="width:50%"
                  size="small"
                  type="number"
                  clearable
                />
              </el-form-item>
            </el-form>
            <!--      添加粒度确认按钮-->
            <div v-if="GraRecord.configIndexTitle==='添加粒度'" slot="footer" class="dialog-footer">
              <el-button @click="GraRecord.visibleIn = false">取消</el-button>
              <el-button
                type="primary"
                @click="addGra()"
              >添加
              </el-button>
            </div>

            <!--      更新粒度确认按钮-->
            <div v-else slot="footer" class="dialog-footer">
              <el-button @click="GraRecord.visibleIn = false">取消</el-button>
              <el-button
                type="primary"
                @click="eidtGra()"
              >修改
              </el-button>
            </div>
            <span slot="footer" class="dialog-footer" />
          </el-dialog>
          <el-button
            icon="el-icon-circle-plus-outline"
            type="primary"
            size="mini"
            @click="openAddGra"
          >
            添加粒度
          </el-button>
          <el-card style="width: 100%;text-align: center">

            <el-table
              :data="GraListData"
              border
              style="width: 90%;margin: 20px"
              size="mini"
              highlight-current-row
            >
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="50"
              />
              <el-table-column
                sortable
                prop="Year"
                label="年份"
                width="150"
                align="center"
              />
              <el-table-column
                prop="Granularity"
                label="粒度"
                align="center"
                width="120"
              />
              <el-table-column
                prop="type"
                label="类型"
                width="120"
                align="center"
              />
              <el-table-column
                prop="UpperLimit"
                label="上限"
                align="center"
              />
              <el-table-column
                prop="LowerLimit"
                label="下限"
                align="center"
              />
              <el-table-column
                prop="AnticState"
                label="状态"
                align="center"
              />
              <el-table-column
                prop="CreateDate"
                label="创建时间"
                align="center"
              >
                <template slot-scope="{ row }">{{
                  row.CreateDate ? row.CreateDate.replace('T', ' ')
                  : ''
                }}
                </template>
              </el-table-column>
              <el-table-column
                prop="username"
                label="操作人"
                width="120"
                align="center"
              />
              <el-table-column
                label="操作"
                width="120"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="openGraFwmDiaIn(row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    @click="delGraRow(row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--                        分页-->
            <div class="block">
              <el-pagination
                :page-sizes="pagination2.pageSizes"
                :page-size="pagination2.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :current-page="listQuery2.pageIndex"
                :total="pagination2.Total"
                @current-change="handleCurrentChange2"
                @size-change="handleSizeChange2"
              />
              <!-- :current-page="listQuery.pageIndex"为当前页-->
            </div>
          </el-card>
          <div slot="footer" class="dialog-footer">
            <el-button @click="GraRecord.visibleOut = false">取 消</el-button>

          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import splitPane from 'vue-splitpane';
import { mapGetters } from 'vuex';
import IndexNavTree from '@/views/indicator/components/IndexNavTree';
import {
  DeleteAnticDeploy,
  DeleteAnticGroup,
  InsertAnticDeploy,
  InsertAnticGroup,
  SelectAnticDeploy,
  SelectAnticGroup,
  UpdateAnticDeploy,
  UpdateAnticGroup
} from '@/api/indicator/I_AnticDeploy';
import { SelectConn } from '@/api/indicatorSet/I_Conn';
import { DeletePaSize, InsertPaSize, SelectPaSize, UpdatePaSize } from '@/api/indicator/I_ParticleSize';
import { SelectiCycle } from '@/api/indicatorSet/I_Cycle';

export default {
  components: {
    splitPane,
    IndexNavTree
  },
  data() {
    return {
      fwmListDataLoading: false, // 表格加载条控制
      listQuery2: { // 粒度分页数据
        pageIndex: 1,
        pageSize: 10
      },
      pagination2: { // 分页数据
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [5, 10, 20, 50, 100, 200],
        Total: null
      },
      addFwnBtnName: '添加预警', // 添加预警按钮名称
      key: 0,
      cycle: [], // 周期数据
      fwmListData: [
        {
          AnticDeployID: 0, // 预警配置id
          index_id: 0, // 指标id
          formulaObj: '', // 指标编码
          AnticDeployName: '', // 指标名称
          conn_id: 0, // 数据源id
          AnticGroupID: 0, // 组别id
          AnticSql: null, // sql预警语句
          CreateUser: window.userInfo[0].UserID, // 创建人
          GroupName: '', // 组别名称
          remarks: null // 备注
        }
      ], // 预警列表表格数据
      fwmFormData: {
        AnticDeployID: 0, // 预警配置id
        index_id: 0, // 指标id
        formulaObj: '', // 指标编码
        AnticDeployName: '', // 指标名称
        conn_id: null, // 数据源id
        AnticGroupID: null, // 组别id
        AnticSql: null, // sql预警语句
        CreateUser: window.userInfo[0].UserID, // 创建人
        // GroupName: '', // 组别名称
        remarks: null, // 备注
        PaSizeList: [] // 粒度
      }, // 预警填写表单数据
      fwmRecord: {
        visible: false, // 是否展示添加或者修改对话框
        configIndexTitle: '添加预警', // 对话框标题
        Loading: false, // 确认按钮等待圈控制
        addFwnBtn: true // 添加预警按钮可编辑控制，默认可编辑
      }, // 预警的记录
      listQuery: { // 预警分页数据
        pageIndex: 1,
        pageSize: 10
      },
      pagination: { // 预警分页数据
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [5, 10, 20, 50, 100, 200],
        Total: null
      },
      groupListData: [{
        AnticGroupID: 0, // 组别id
        GroupName: '' // 组别名字
      }
      ], // 组别表格的数据
      groupRecord: {
        visible: false, // 是否展示添加或者修改对话框
        configIndexTitle: '组别设置', // 对话框标题
        finishLoading: false, // 完成按钮等待圈控制
        tableLoading: false, // 加载全部组别等待圈控制
        delLoading: false, // 删除按钮等待圈控制
        editVisible: true, // 控制编辑显示与否
        indexes: -1, // 控制当前编辑条目的索引下标
        addOrUpdate: 1 // 是添加还是修改的状态，1为添加，2为修改
      }, // 组别的记录
      GraListData: [
        {
          ParticleSizeID: 0,
          AnticDeployID: 0,
          Year: 0,
          Granularity: '',
          Cycleid: 0,
          UpperLimit: 0,
          LowerLimit: 0,
          UserID: window.userInfo[0].UserID,
          type: ''
        }
      ], // 粒度列表表格数据
      GraFormData: {
        ParticleSizeID: 0,
        AnticDeployID: 0,
        Year: null,
        Granularity: '',
        Cycleid: null,
        UpperLimit: null,
        LowerLimit: null,
        AnticState: null, // 状态
        UserID: window.userInfo[0].UserID,
        // CreateDate: '',
        type: ''
      }, // 粒度表单数据
      GraRecord: {
        visibleIn: false, // 是否展示添加或者修改对话框,里层
        visibleOut: false, // 是否展示添加或者修改对话框，外层
        configIndexTitle: '添加粒度', // 对话框标题
        row: {} // 当前点击的预警条目数据
      }, // 粒度记录
      databaseSrc: [], // 数据库源
      nodeValue: {
        name: '',
        formulaObj: ''
      }, // 当前点击指标导航树的数据信息
      nowNode: '', // 现在所点击的指标导航树节点
      GuidelinesData: [], // 指标描述数据
      parameterData: [] // 指标中的参数数据
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    let h = window.innerHeight;
    if (h < 750) h = 750;
    this.middlePercent = ((h - 629) / (h - 183)) * 100;
    this.SelectFwmListData(); // 查询预警配置列表
    this.SelectConn(); // 数据库源
    this.SelectAnticGroup(); // 查询全部组别
    this.SelectiCycle(); // 获取周期数据
  },
  methods: {
    // 查询指标，获取指标导航树数据,// 单击指标导航树
    nodeClickCatalog(value) {
      this.nodeValue = value; // 点击指标导航树后就记录下该指标的信息
      this.fwmRecord.addFwnBtn = false; // 只有点击了指标导航树，添加预警按钮才可以编辑
      this.addFwnBtnName = '添加预警'; // 当前添加预警按钮名称
      // this.fwmListData.map((item) => { // 如果该指标已经有了预警信息，就无法点击预警按钮（通过指标编码的对比）
      //   if (item.formulaObj === this.nodeValue.formulaObj) {
      //     this.fwmRecord.addFwnBtn = true;
      //     this.addFwnBtnName = '已有预警信息'; // 将当前添加预警按钮名称改为提示
      //   }
      // });
    },
    /* 预警开始 */
    // 查询全部预警信息
    async SelectFwmListData() {
      // this.listQuery.pageIndex = 1; // 重置页码为1
      try {
        this.fwmListDataLoading = true; // 打开表格加载等待条
        const { data, code } = await SelectAnticDeploy({
          index_id: this.nodeValue.index_id,
          pageIndex: this.listQuery.pageIndex,
          pageSize: this.listQuery.pageSize
        });
        if (code === 200) {
          this.fwmListData = data.DataList;
          this.pagination.Total = data.Total; // 获取总条数
          this.fwmListDataLoading = false; // 关闭表格加载等待条
        }
      } catch (e) {
        console.log(e);
        this.fwmListDataLoading = false; // 关闭表格加载等待条
      }
    },
    // 查询全部的数据源
    async SelectConn() {
      try {
        const { data, code } = await SelectConn();
        if (code === 200) {
          this.databaseSrc = data.DataList;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 打开预警配置
    openFwmDia() {
      this.fwmRecord.visible = true; // 打开预警配置对话框
      this.fwmFormData.formulaObj = this.nodeValue.formulaObj;
      this.fwmFormData.AnticDeployName = this.nodeValue.name;
      this.fwmRecord.configIndexTitle = '添加预警'; // 更改预警对话框标题
    },
    // 点击确定按钮保存填写预警信息
    async finishFwmBtn() {
      this.listQuery.pageIndex = 1; // 重置页码为1
      this.fwmFormData.formulaObj = this.nodeValue.formulaObj; // 将节点所对应的指标编码加上
      this.fwmFormData.AnticDeployName = this.nodeValue.name; // 将节点所对应的指标名称加上
      this.fwmFormData.index_id = this.nodeValue.index_id; // 将节点所对应的指标名称加上
      this.fwmFormData.PaSizeList = []; // 加空粒度数组，不然后端传参错误
      console.log(this.fwmFormData);
      try {
        const { code } = await InsertAnticDeploy(this.fwmFormData);
        if (code === 200) {
          this.$message.success('添加成功');
          await this.SelectFwmListData(); // 刷新
          this.fwmRecord.visible = false; // 关闭对话框
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 打开编辑修改预警对话框
    openEdiFwmDia(row) {
      this.fwmRecord.visible = true; // 打开编辑修改预警对话框
      this.fwmRecord.configIndexTitle = '修改预警信息'; // 更改预警对话框标题
      this.fwmFormData = row; // 将传过来的的当前条目数据放在fwmFormData里面
      console.log(row);
    },
    // 点击编辑预警确认保存按钮
    async updateFwmBtn() {
      this.fwmFormData.PaSizeList = []; // 加空粒度数组，不然后端传参错误
      try {
        const { code } = await UpdateAnticDeploy(this.fwmFormData);
        if (code === 200) {
          this.$message.success('修改成功');
          await this.SelectFwmListData(); // 刷新
          this.fwmRecord.visible = false; // 关闭预警对话框
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 删除单条预警
    FwmDelBtn(row) {
      this.$confirm('此操作将永久删除该预警数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async() => {
        const { code } = await DeleteAnticDeploy({ AnticDeployID: row.AnticDeployID });
        if (code === 200) {
          await this.SelectFwmListData(); // 刷新预警列表
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    // 全部预警信息列表分页当前页
    handleCurrentChange(index) {
      this.listQuery.pageIndex = index;
      this.SelectFwmListData(); // 跳转页面后刷新列表
    },
    // 全部预警信息列表分页一页多少显示条数据
    handleSizeChange(page) {
      this.listQuery.pageSize = page;
      this.SelectFwmListData(); // 跳转页面后刷新列表
    },
    /* 预警结束 */

    /* 组别开始 */
    // 打开组别设置
    openFwmGroupDia() {
      this.groupRecord.visible = true; // 打开组别设置对话框
    },
    // 查询全部组别
    async SelectAnticGroup() {
      this.groupRecord.tableLoading = true; // 开启表格数据等待
      try {
        const { data, code } = await SelectAnticGroup();
        if (code === 200) {
          this.groupListData = data;
          this.groupRecord.tableLoading = false; // 关闭表格数据等待
        }
      } catch (e) {
        this.groupRecord.tableLoading = false; // 关闭表格数据等待

        console.log(e);
      }
    },
    // 点击添加组别按钮
    addGroup() {
      this.groupListData.unshift({
        AnticGroupID: 0, // 组别id
        GroupName: '' // 组别名字
      });
      this.groupRecord.indexes = 0;
      this.groupRecord.editVisible = false;
      this.groupRecord.addOrUpdate = 1; // 标记此时为添加组别
    },
    // 点击组别编辑按钮，显示input框
    editGroup(row, index) {
      this.groupRecord.editVisible = !this.groupRecord.editVisible; // 反向显示
      this.groupRecord.indexes = index;// 选定下标
      this.groupRecord.addOrUpdate = 2; // 进入编辑更新组别状态
    },
    // 点击组别完成按钮
    async finishGroup(row) {
      this.groupRecord.finisLoading = true; // 删除等待圈开启
      this.groupRecord.editVisible = !this.groupRecord.editVisible; // 反向显示
      this.groupRecord.indexes = -1; // 选定的下标取消
      if (this.groupListData[0].GroupName === '') { // 如果没有填就删除
        this.groupListData.shift();
        this.$message.info('为空，取消添加');
      }
      if (this.groupRecord.addOrUpdate === 1) { // 如果为1，代表为添加,其他则为编辑修改
        try {
          const { code } = await InsertAnticGroup({
            AnticGroupID: 0,
            GroupName: row.GroupName
          });
          if (code === 200) {
            this.groupRecord.finisLoading = false; // 删除等待圈关闭
            this.$message.success('添加成功');
            await this.SelectAnticGroup(); // 刷新
          }
        } catch (e) {
          this.groupRecord.finisLoading = false; // 删除等待圈关闭
          console.log(e);
        }
      } else {
        try {
          const { code } = await UpdateAnticGroup({
            AnticGroupID: row.AnticGroupID,
            GroupName: row.GroupName
          });
          if (code === 200) {
            this.groupRecord.finisLoading = false; // 删除等待圈关闭
            this.$message.success('修改成功');
            await this.SelectAnticGroup(); // 刷新
          }
        } catch (e) {
          this.groupRecord.finisLoading = false; // 删除等待圈关闭
          console.log(e);
        }
      }
    },
    // 点击组别放弃按钮
    giveUpGroup() {
      this.groupRecord.indexes = -1; // 选定的下标取消
      this.groupRecord.editVisible = !this.groupRecord.editVisible; // 反向显示
      if (this.groupRecord.addOrUpdate === 1) {
        this.groupListData.shift();// 如果是添加状态放弃，就删除
      } else {
        this.groupRecord.indexes = -1; // 如果为编辑状态就放弃隐藏input框
      }
    },
    // 点击删除组别按钮
    delGroup(row) {
      this.groupRecord.delLoading = true; // 删除等待圈开启
      this.$confirm('此操作将永久删除该组别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async() => {
        const { code } = await DeleteAnticGroup({
          AnticGroupID: row.AnticGroupID
        });
        if (code === 200) {
          this.groupRecord.delLoading = false; // 删除等待圈关闭
          await this.SelectAnticGroup(); // 刷新
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      }).catch(() => {
        this.groupRecord.delLoading = false; // 删除等待圈关闭
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    /* 组别结束 */

    /* 粒度开始 */
    // 获取指标中要选择的周期数据
    async SelectiCycle() {
      this.cycle = [];
      try {
        const { data, code } = await SelectiCycle();
        if (code === 200) {
          this.cycle = data;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 打开外层粒度设置对话框列表数据
    async openGraFwmDiaOut(row) {
      this.listQuery2.pageIndex = 1; // 重置页码为1
      this.GraRecord.row = row; // 将所点击的预警条目数据保存
      this.GraRecord.visibleOut = true; // 打开粒度外层设置对话框
      await this.SelectGra(this.GraRecord.row); // 加载数据
    },
    // 查询全部粒度
    async SelectGra(row) {
      try {
        const { data, code } = await SelectPaSize({
          anticDeployID: row.AnticDeployID,
          pageIndex: this.listQuery2.pageIndex,
          pageSize: this.listQuery2.pageSize
        });
        if (code === 200) {
          this.GraListData = data.DataList;
          this.pagination2.Total = data.Total; // 获取总条数
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 打开里层粒度单条新增粒度
    openAddGra() {
      this.GraRecord.configIndexTitle = '添加粒度'; // 改对话框标题
      this.GraRecord.visibleIn = true; // 打开里层对话框
      // this.GraFormData = {}; // 重置表单数据
    },
    // 打开里层粒度单条修改粒度
    async openGraFwmDiaIn(row) {
      this.GraFormData = row; // 将所要编辑修改的粒度数据放在表单中
      this.GraRecord.visibleIn = true; // 打开粒度里层设置对话框
      this.GraRecord.configIndexTitle = '修改粒度';
    },
    // 添加粒度
    async addGra() {
      this.GraFormData.AnticDeployID = this.GraRecord.row.AnticDeployID; // 预警id
      this.GraFormData.AnticDeployID;
      delete this.GraFormData.AnticState; // 添加粒度不用传以下两个
      delete this.GraFormData.CreateDate;
      try {
        const { code } = await InsertPaSize(this.GraFormData);
        if (code === 200) {
          this.$message.success('添加成功');
          await this.SelectGra(this.GraRecord.row); // 刷新粒度列表
          this.GraRecord.visibleIn = false; // 关闭粒度里层设置对话框
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 编辑修改粒度
    async eidtGra() {
      try {
        const { code } = await UpdatePaSize(this.GraFormData);
        if (code === 200) {
          this.$message.success('修改成功');
          await this.SelectGra(this.GraRecord.row); // 刷新粒度列表
          this.GraRecord.visibleIn = false; // 关闭粒度里层设置对话框
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 删除单个粒度
    delGraRow(row) {
      this.$confirm('此操作将永久删除该粒度, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async() => {
        const { code } = await DeletePaSize({ ParticleSizeID: row.ParticleSizeID });
        if (code === 200) {
          await this.SelectGra(this.GraRecord.row); // 刷新粒度列表
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 列表分页当前页
    // 全部信息列表分页当前页
    handleCurrentChange2(index) {
      this.listQuery2.pageIndex = index;
      this.SelectGra(this.GraRecord.row); // 跳转页面后刷新列表
    },
    // 全部信息列表分页一页多少显示条数据
    handleSizeChange2(page) {
      this.listQuery2.pageSize = page;
      this.SelectGra(this.GraRecord.row); // 跳转页面后刷新列表
    }

    /* 粒度结束 */
  }
};
</script>
<style lang="scss" scoped>
// 导入等待条样式
@import "src/styles/loading.scss";
//分页栏距离预警表格
.block {
  margin-top: 10px;
}

.targetVis {
  display: flex;
  width: 100%;
  height: 40px;
  line-height: 34px;
  padding-left: 50px;
  justify-content: flex-start;
  background-color: #f4f4f5;

  div {
    width: 33.3%;
    margin-top: 4px;
    display: flex;
    //margin-left: 10px;
    margin-bottom: 4px;
    font-weight: bolder;
  }
}

.lineTree {
  height: 76vh;
  overflow: auto;
  margin-top: 2px;
  border-top: 1px solid #c0bebe;
  border-bottom: 1px dotted #c0bebe;

  .el-tree-node__content {
    border-bottom: 1px solid rgb(235, 235, 235);
  }
}

.main {
  height: calc(100vh - 96px);

  .content_left {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    min-width: 170px;
    height: 100%;
    border: 1px solid whitesmoke;
  }

  .content_right {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    border: 1px solid whitesmoke;

    .top {
      font-size: 14px;
      min-height: 20px;
    }

    .middle {
      height: 100%;

      .middleHead {
        flex-basis: 20px;
      }

      .middleBody {
        height: calc(100% - 34px);
        overflow-y: hidden;

        .middleBodyTb {
          max-height: calc(100% - 37px);
        }
      }
    }

    .bottom {
      height: 100%;
      font-size: 14px;

      .bottomBody {
        height: calc(100% - 45px);
        overflow-y: hidden;

        .bottomBodyTb {
          max-height: calc(100% - 48px);
        }
      }
    }
  }
}

</style>
