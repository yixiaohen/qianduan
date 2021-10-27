<template>
  <div>

    <!--      v-if="device === 'desktop'"-->
    <div

      class="box-card-view"
    >
      <split-pane
        :min-percent="10"
        :default-percent="24"
        split="vertical"
      >
        <template slot="paneL">
          <div class="letf-box-card">
            <div style="display: flex; justify-content: space-between">
              <el-button
                type="success"
                size="mini"
                icon="el-icon-plus"
                @click="addIndexDia(node=0)"
              >添加指标
              </el-button>
            </div>
            <el-tree
              ref="dirTree"
              v-loading="treeLoading"
              class="lineTree"
              :data="treeData"
              :props="defaultProps"
              node-key="index_id"
              :default-expand-all="isExpandAll"
              :default-expanded-key="defaultKey"
              highlight-current
              @node-click="handleNodeClick"
            >
              <span
                slot-scope="{ node, data }"
                class="custom-tree-node"
              >

                <span>
                  <svg-icon
                    icon-class="Green_folder"
                  />
                  {{ node.label }}</span>
                <span v-show="treeCurrentEdit===node.key" class="border-left">
                  <el-link
                    class="custom-tree-node-link"
                    icon="el-icon-thumb"
                    @click="calIndexDia(node)"
                  />
                  <el-link
                    class="custom-tree-node-link"
                    icon="el-icon-plus"
                    @click="addIndexDia(node)"
                  />

                  <el-link
                    style="margin-right: 4px"
                    icon="el-icon-edit"
                    class="custom-tree-node-link"
                    @click="eidtIndexDia(node)"
                  />
                  <el-popconfirm
                    class="custom-tree-node-link"
                    icon-color="red"
                    :title="'确定删除：' + node.label"
                    @confirm="deleteIndexDia(data.index_id)"
                  >
                    <el-link
                      slot="reference"
                      icon="el-icon-delete"
                    />
                  </el-popconfirm>
                </span>
              </span>
            </el-tree>
          </div>
        </template>
        <template slot="paneR">
          <el-divider content-position="left">指标参数</el-divider>
          <!--     <div  v-if="isShowinfo" type="danger"> {{ indexInfo }}</div>-->
          <el-card
            shadow="never"
            class="right-box-card"
          >
            <div
              slot="header"
              class="text flex"
            >
              <div class="action-view">
                <el-button
                  :disabled="isShowParabtn"
                  type="success"
                  size="mini"
                  icon="el-icon-plus"
                  class="item"
                  @click="addIndexParam()"
                >添加参数
                </el-button>
              </div>
            </div>

            <el-table
              v-if="isShowParaTab"
              :loading="listLoading"
              :data="parameterData"
              height="calc(100vh - 500px)"
              border
              style="overflow: scroll;"
              highlight-current-row
              :row-key="getRowKeys"
              :expand-row-keys="expand"
              size="mini"
              @selection-change="handleSelectionChange"
              @current-change="test1"
              @expand-change="unfoldTable"
            >
              <el-table-column
                type="index"
                width="50"
                label="序号"
                align="center"
              />
              <el-table-column
                width="350"
                label="数据库源"
                align="center"
              >
                <template slot-scope="{row,$index}">
                  <!--                  已知conn_id，又知-->
                  <span
                    v-for="item in sourceData"
                    v-show="currentEdit!== $index "
                  >
                    {{ row.conn_id === item.conn_id ? item.sqlcon : '' }}</span>
                  <el-select
                    v-show="currentEdit === $index "
                    v-model="row.conn_id"
                    placeholder="请选择"
                    size="mini"
                    style="width: 350px"
                    clearable
                    filterable
                  >

                    <el-option
                      v-for="item in sourceData"
                      :key="item.conn_id"
                      :label="item.sqlcon"
                      :value="item.conn_id"
                    >
                      <span style="float: left">{{ item.sqlcon }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.type }}</span>
                    </el-option>
                  </el-select>

                </template>

              </el-table-column>
              <el-table-column
                prop="name"
                label="参数"
                align="center"
              >
                <template slot-scope="{ row, $index }">
                  <el-input v-show="currentEdit === $index " v-model="row.name" size="mini" />
                  <span v-show="currentEdit !== $index">
                    {{ row.name }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="para_value"
                align="center"
                label="参数值"
              >
                <template slot-scope="{ row, $index }">
                  <el-input v-show="currentEdit === $index " v-model="row.para_value" size="mini" />
                  <span v-show="currentEdit !== $index">
                    {{ row.para_value }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="130"
                align="center"
              >
                <template slot-scope="{ row, $index }">
                  <!--                  如果没有选中当前行-->
                  <!--                  出现编辑和删除按钮-->
                  <el-button
                    v-show="currentEdit !== $index"
                    size="mini"
                    circle
                    type="success"
                    icon="el-icon-edit"
                    @click="editParams($index)"
                  />
                  <el-button
                    v-show="currentEdit !== $index"
                    size="mini"
                    circle
                    type="primary"
                    icon="el-icon-thumb"
                    @click="openSql(row)"
                  />

                  <el-popconfirm
                    v-show="currentEdit !== $index"
                    class="custom-tree-node-link"
                    icon-color="red"
                    :title="'确定删除：' + row.name"
                    @confirm="deleteParams(row)"
                  >
                    <el-button
                      slot="reference"
                      size="mini"
                      type="danger"
                      circle
                      :loading="deleteParamsLoading"
                      icon="el-icon-delete"
                    />
                  </el-popconfirm>


                  <!--                  <el-button-->
                  <!--                    v-show="currentEdit !== $index"-->
                  <!--                    size="mini"-->
                  <!--                    circle-->
                  <!--                    type="danger"-->
                  <!--                    icon="el-icon-delete"-->
                  <!--                    @click="deleteParams(row)"-->
                  <!--                  />-->
                  <!--                  如果选中当前行-->
                  <!--                  出现新增完成，编辑完成和放弃按钮-->
                  <el-button
                    v-show="currentEdit === $index"
                    size="mini"
                    circle
                    type="primary"
                    :loading="finishParaLoading"
                    icon="el-icon-circle-check"
                    @click="finishPara(row)"
                  />

                  <el-button
                    v-show="currentEdit === $index"
                    size="mini"
                    circle
                    type="warning"
                    icon="el-icon-circle-close"
                    @click="giveUp(row,$index)"
                  />
                </template>
              </el-table-column>
            </el-table>
            <!--            <el-pagination-->
            <!--              style="margin: 6px 0 0 0"-->
            <!--              background-->
            <!--              :current-page.sync="pagination.pageIndex"-->
            <!--              :page-size="pagination.pageSize"-->
            <!--              :page-sizes="pagination.pageSizes"-->
            <!--              :total="pagination.total"-->
            <!--              layout="total, sizes, prev, pager, next, jumper"-->
            <!--            />-->
            <!--              @size-change="handleSizeChange"-->
            <!--              @current-change="handleCurrentChange"-->
            <div v-else>
              <div style="width: 100%;text-align: right">
                <el-button type="success" @click="isShowParaTab=true">返回</el-button>
              </div>
              <el-form
                ref="dynamicValidateForm"
                label-position="left"
                label-width="50px"
                class="demo-table-expand"
              >
                <el-form-item
                  v-for="(item, index) in paraDynamicValidateForm"
                  :key="index"
                  :label="(index+1)+'、'"
                >
                  <div style="border-bottom:1px solid #d0f5e0;border-top:2px solid #d0f5e0;">
                    <span>周期：</span>
                    <el-select
                      v-model="item.cycle_id"
                      :disabled="sqlCurrentEdit!==index"
                      placeholder="请选择"
                      size="mini"
                    >
                      <el-option
                        v-for="item2 in cycle"
                        :key="item2.Cycleid"
                        :value="item2.Cycleid"
                        :label="item2.Type+' | '+item2.Cycle +' | '+item2.Num"
                      >
                        <span style="float: left">{{ item2.Type }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item2.Cycle + ' | ' + item2.Num }}</span>
                      </el-option>
                    </el-select>
                    <br>
                    <span>sql语句: </span>
                    <el-tag v-if="sqlCurrentEdit!==index" type="success">
                      {{ item.sqlsen|| '暂无' }}
                    </el-tag>
                    <el-input
                      v-else
                      v-model="item.sqlsen"
                      size="mini"
                      type="textarea"
                      :rows="10"
                      style="width: 600px;"
                    />
                    <br>
                    <span>描述说明：</span>
                    <el-tag v-if="sqlCurrentEdit!==index">
                      {{ item.remarks || '暂无' }}
                    </el-tag>
                    <el-input
                      v-else
                      v-model="item.remarks"
                      size="mini"
                      style="width: 600px"
                    />
                    <br>
                    <el-button
                      v-if="sqlCurrentEdit!==index"
                      size="mini"
                      type="info"
                      icon="el-icon-top"
                      circle
                      @click="upRow(item)"
                    />
                    <el-button
                      v-if="sqlCurrentEdit!==index"
                      size="mini"
                      type="info"
                      icon="el-icon-bottom"
                      circle
                      @click="downRow(item)"
                    />


                    <el-button v-if="sqlCurrentEdit!==index" size="mini" type="success" @click="editSql(index,item)">
                      编辑
                    </el-button>
                    <el-button v-else size="mini" type="primary" @click="submitForm(index,item)">保存
                    </el-button>
                    <el-popconfirm
                      class="custom-tree-node-link"
                      icon-color="red"
                      title="确定删除此sql语句？"
                      @confirm="removeDomain(item,index)"
                    >
                      <el-button
                        slot="reference"
                        size="mini"
                        type="danger"
                      >删除
                      </el-button>
                    </el-popconfirm>
                  </div>
                </el-form-item>
                <el-form-item>
                  <div style="border-top:1px solid #d0f5e0;">
                    <el-button :disabled="isShowBtn" size="mini" type="primary" @click="addDomain">新增sql语句
                    </el-button>
                  </div>
                </el-form-item>
              </el-form>
            </div>

            <el-divider content-position="left">指标描述</el-divider>
            <el-table
              v-if="GuidelinesData.length>0"
              :data="GuidelinesData"
              border
              style="width: 100%;margin-bottom: 20px"
            >
              <el-table-column
                label="周期"
                align="center"
              >
                <template slot-scope="{ row }">
                  <span
                    v-for="item in cycle"
                  >{{ item.Cycleid === row.Cycle_ID ? item.Type + ' | ' + item.Cycle + ' | ' + item.Num : '' }}</span>

                </template>
              </el-table-column>
              <el-table-column
                prop="Igroupname"
                label="监测组别"
                width="180"
                align="center"
              />
              <el-table-column
                prop="name"
                label="指标名称"
                width="180"
                align="center"
              />
              <el-table-column
                prop="formula"
                label="指标公式"
                align="center"
              />
              <el-table-column
                prop="formulaObj"
                label="公式编译目标码"
                align="center"
              />
              <el-table-column
                prop="iattribute"
                label="指标属性"
                align="center"
              />
              <el-table-column
                prop="idefinition"
                label="指标定义"
                align="center"
              />
              <el-table-column
                prop="index_refvalue"
                label="指标参考值"
                align="center"
              />
            </el-table>
          </el-card>
        </template>
      </split-pane>


    </div>
    <!--    <div v-show="isShowAddIndexPage" class="addIndexPage">-->
    <!--      <el-card>-->
    <!--        <el-form-->
    <!--          :inline="true"-->
    <!--          size="mini"-->
    <!--        >-->
    <!--          <el-form-item>-->
    <!--            <el-button-->
    <!--              type="success"-->
    <!--              plain-->
    <!--              icon="el-icon-refresh-left"-->
    <!--              size="mini"-->
    <!--              style="margin: 7px auto"-->
    <!--              @click="isShowAddIndexPage=false"-->
    <!--            >返回-->
    <!--            </el-button>-->
    <!--          </el-form-item>-->
    <!--        </el-form>-->
    <!--      </el-card>-->
    <!--    </div>-->

    <!--添加指标弹框-->
    <el-dialog :title="configIndexTitle" :visible.sync="showConfig">
      <el-form ref="addDia" :model="dynamicValidateForm" label-width="120px" status-icon>
        <el-form-item
          label="周期"
        >
          <el-select v-model="dynamicValidateForm.Cycle_ID" placeholder="请选择" size="mini">
            <el-option
              v-for="item in cycle"
              :key="item.Cycleid"
              :value="item.Cycleid"
              :label="item.Type+' | '+item.Cycle +' | '+item.Num"
            >
              <span style="float: left">{{ item.Type }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Cycle + ' | ' + item.Num }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="监测组别"
          prop="name"
        >
          <el-select v-model="dynamicValidateForm.Igroupid" placeholder="请选择" size="mini">
            <el-option
              v-for="item in monitor"
              :key="item.id"
              :value="item.Igroupid"
              :label="item.Igroupname"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="指标名称"
          prop="name"
        >
          <el-input
            v-model="dynamicValidateForm.name"
            style="width:30vh"
            size="small"
            clearable
          />
        </el-form-item>


        <el-form-item
          label="指标公式"
          prop="formula"
        >
          <el-input
            v-model="dynamicValidateForm.formula"
            style="width:30vh"
            size="small"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="公式编译目标码"
          prop="formulaObj"
        >
          <el-input
            v-model="dynamicValidateForm.formulaObj"
            style="width:30vh"
            size="small"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="指标属性"
          prop="iattribute"
        >
          <el-input
            v-model="dynamicValidateForm.iattribute"
            style="width:30vh"
            size="small"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="指标定义"
          prop="idefinition"
        >
          <el-input
            v-model="dynamicValidateForm.idefinition"
            style="width:30vh"
            size="small"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="指标参考值"
          prop="index_refvalue"
        >
          <el-input
            v-model="dynamicValidateForm.index_refvalue"
            style="width:30vh"
            size="small"
            clearable
          />
        </el-form-item>
      </el-form>
      <!--      添加指标确认按钮-->
      <div v-if="configIndexTitle==='添加指标'" slot="footer" class="dialog-footer">
        <el-button @click="showConfig = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="IndexSourceLoading"
          @click="addIndex('addDia')"
        >确 定
        </el-button>
      </div>
      <!--      更新指标确认按钮-->
      <div v-else slot="footer" class="dialog-footer">
        <el-button @click="showConfig = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="IndexSourceLoading"
          @click="eidtIndex()"
        >确 定
        </el-button>
      </div>
    </el-dialog>
    <!--    添加sql语句弹框-->

  </div>
</template>
<script>
import splitPane from 'vue-splitpane';
import { mapGetters } from 'vuex';
import { DeleteIndex, Get, InsertIndex, SelectIndexPara, SelectIndexs, UpdateIndex } from '@/api/indicatorSet/I_Index';
import { DeletePara, InsertPara, UpdatePara } from '@/api/indicatorSet/I_Para';
import { SelectConn } from '@/api/indicatorSet/I_Conn';
import { DeleteParaSql, InsertParaSql, ParaSqlMove, SelectParaSql, UpdateParaSql } from '@/api/indicatorSet/I_ParaSql';
import { SelectiCycle } from '@/api/indicatorSet/I_Cycle';
import { SaveWorkByHandsResult1 } from '@/api/indicatorSet/I_Timing';
import { SelectMonGroup } from '@/api/indicatorSet/I_Monitor';



export default {
  components: { splitPane },
  data() {
    return {
      isShowinfo: false, // 是否展示计算指标后的提示信息
      indexInfo: '', // 指标计算后的提示信息
      nowSqlRow: {},
      isShowParaTab: true, // 是否显示参数列表
      cycle: [
        {
          Cycle: '',
          Cycleid: '',
          Num: '',
          Starway: '',
          Type: ''
        }
      ], // 周期
      monitor: [
        {
          id: null, // 监测组别排序id
          Igroupid: null, // 监测组别id
          Igroupname: null// 监测组别名称
        }],

      // 获取row的key值
      getRowKeys(row) {
        return row.para_id;
      },
      expand: [],
      isShowBtn: false, // 新增sql按钮是否可用、默认false为可用
      isAddOrUpate: 0, // 判断是新增sql还是更新sql
      editSqlId: 0, // 记录当前编辑的sqlID
      sqlCurrentEdit: -1, // 当前选择sql所在行
      isShowInput: true, // 是否显示sql编辑的input框
      paraDynamicValidateForm: [
        {
          para_id: '',
          idx: '',
          sqlsen: '',
          remarks: '',
          conn_id: ''
        }
      ], // 参数取值数据如sql
      isEdit: 1, // 标识是否正在编辑参数,1为不在编辑
      isExpandAll: true, // 是否展开指标导航树
      defaultKey: [2], // 指标导航树选中节点id
      finishParaLoading: false, // 参数编辑完成按钮等待圈
      deleteParamsLoading: false, // 参数删除按钮等待圈
      treeLoading: false, // 指标导航树等待圈
      sourceData: [], // 数据库源数据
      nowNode: '', // 现在所点击的指标导航树节点
      isAddOrUpdate: 1, // 判断是新增参数还是更新参数，1为新增
      isShowParabtn: false, // 是否显示添加参数按钮,默认可以点击
      currentEdit: -1, // 当前选择参数所在行
      treeCurrentEdit: -1, // 当前选择指标导航树所在节点
      parameterData: [], // 参数数据
      GuidelinesData: [], // 指标描述数据
      // isShowAddIndexPage: false, // 是否展示添加参数页面
      IndexSourceLoading: false, // 添加指标确定按钮等待进度圈默认为关闭
      configIndexTitle: '添加指标', // 添加和编辑指标的对话框的标题值
      dynamicValidateForm: { // 添加和编辑指标对话框数据
        index_id: 0, // 指标索引id
        ParentID: 0, // 父级id
        Cycle_ID: 0, // 周期id
        name: '', // 指标名称
        formula: '', // 指标公式
        formulaObj: '', // 公式编译目标码
        iattribute: '', // 指标属性
        idefinition: '', // 指标定义
        index_refvalue: '', // 指标参考值
        Igroupid: null, // 监测组别id
        paralist: [ // 参数
          // {
          //   para_id: 0,
          //   index_id: 0,
          //   name: '',
          //   para_value: 0,
          //   conn_id: 0
          // }
        ]
      },
      showConfig: false, // 默认添加指标弹窗为隐藏
      tagPane: true,
      listLoading: false,
      templateDialog: false,
      dirVisible: false,
      dirTitle: '',
      templateDialogTitle: '',
      dirTitleSpan: null,
      listQuery: {
        CheckListID: 0,
        CheckListName: '',
        CreateUserID: window.userInfo[0].UserID,
        DirectoryID: 0,
        pageIndex: 1,
        pageSize: 15
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }, // 指标导航树叶子标识
      tableData: [],
      assignCheckLis: null,
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      }
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectIndex();
    this.SelectConn(); // 开始获取数据源数据
    this.SelectiCycle(); // 开始获取周期数据
    this.SelectMonGroup(); // 获取指标值要选择的监测组别数据
  },
  mounted() {
    this.$refs['dirTree'].setCurrentKey(3); // 默认打开的时候，选中一个根node
  },
  methods: {

    /* 指标开始 */
    // 单击指标导航树
    handleNodeClick(node) {
      this.treeCurrentEdit = node.index_id;
      this.nowNode = node; // 记录当前点击的树节点
      this.GuidelinesData = [];
      console.log('node', node);
      this.GuidelinesData.push(node); // 获取指标描述数据
      this.parameterData = node.paralist;
      this.isShowParabtn = false; // 点击指标导航树后可以点击添加参数按钮
      this.isShowParaTab = true; // 收起编辑sql语句状态，这个是用来当进入了新增sql语句后，又点击指标导航树，还是出于编辑sql语句状态的问题
      this.isShowinfo = false; // 关闭指标计算后的提示信息
    },
    // 查询指标
    async SelectIndex() {
      try {
        this.treeLoading = true;
        const { data, code } = await SelectIndexs();
        if (code === 200) {
          this.treeData = data;
          // 一开始进来不可以点击添加参数按钮
          // 新增和更新参数过后刷新页面可以点击添加参数按钮
          this.isShowParabtn = !(this.isAddOrUpdate === 1 || this.isAddOrUpdate === 2);
          this.treeLoading = false;
        } else {
          this.$message.error('加载出现错误');
        }
      } catch (e) {
        console.log(e);
      }
    },
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
    // 获取指标值要选择的监测组别数据
    async SelectMonGroup() {
      try {
        const { data, code } = await SelectMonGroup();
        if (code === 200) {
          this.monitor = data;
        }
      } catch (e) {
        console.log(e);
      }
    },

    // 计算指标
    async calIndexDia(node) {
      this.$message.info('已开始计算，请稍后');
      try {
        const { data } = await SaveWorkByHandsResult1({
          Index_ID: node.data.index_id,
          UserID: window.userInfo[0].UserID
        });

        if (data.result === false) {
          // this.isShowinfo = true; // 开启提示信息
          // this.indexInof = data.errorMsg;
          this.$notify({
            title: '失败',
            message: data.errorMsg,
            type: 'error'
          });
        } else {
          this.$message.success('计算完成，请在监测数据中查看相关信息。');
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 打开添加指标弹框
    addIndexDia(node) {
      console.log('node是', node);
      this.Igroupid = null; // 如果先点进编辑指标框，残留的监测组别id会加到添加指标框，所以清除
      this.dynamicValidateForm = {}; // 点击添加指标对话框后就清除数据
      this.dynamicValidateForm.children = []; // 为了对应后端防止不传递此参数格式出错
      this.dynamicValidateForm.paralist = [];
      this.nowNode = node;
      if (node === 0) { // 如果传值为0证明是点击左上角的按钮，总的添加，父级id为0
        this.dynamicValidateForm.ParentID = 0;
      } else {
        this.dynamicValidateForm.ParentID = node.data.index_id; // 将所点击的指标id作为父级id
      }
      this.showConfig = true;
      this.configIndexTitle = '添加指标';
    },
    // 添加指标提交数据
    async addIndex() {
      try {
        const { code } = await InsertIndex(this.dynamicValidateForm);
        if (code === 200) {
          this.$message.success('添加成功');
          await this.SelectIndex(); // 刷新整个指标导航树数据
          this.showConfig = false; // 关闭添加框
        }
      } catch (e) {
        console.log(e);
      }
    },

    // 打开编辑指标对话框
    async eidtIndexDia(node) {
      this.showConfig = true; // 打开编辑指标对话框
      this.configIndexTitle = '编辑指标'; // 更改对话框标题
      this.nowNode = node; // 保存index_id所点击的指标id
      try {
        const { data, code } = await Get({ index_id: node.data.index_id }); // 查询一条指标,展示在对话框中
        if (code === 200) {
          this.dynamicValidateForm = data;
          this.dynamicValidateForm.children = []; // 为了对应后端防止不传递此参数格式出错
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 更新编辑指标
    async eidtIndex() {
      this.dynamicValidateForm.paralist = this.parameterData; // 将参数列表加入指标的修改数组里
      try {
        const { code } = await UpdateIndex(this.dynamicValidateForm);
        if (code === 200) {
          this.$message.success('更新成功');
          this.showConfig = false; // 关闭添加框
          await this.SelectIndex(); // 刷新整个指标导航树数据
          await this.SelectIndexPara(); // 刷新参数列表
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 删除单个指标
    async deleteIndexDia(id) {
      this.$confirm('此操作将永久删除该指标, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async() => {
        await DeleteIndex({ index_id: id });
        await this.SelectIndex();
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    /* 指标结束 */

    /* 参数开始 */
    // 根据指标id查询参数
    async SelectIndexPara() {
      try {
        const { data, code } = await SelectIndexPara({ index_id: this.nowNode.index_id });
        this.parameterData = data.paralist;
        // this.parameterData.reverse();// 将数据倒序，刚创建的在上面
        if (code !== 200) {
          this.$message.warning('更新参数列表出现问题');
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 打开添加参数页
    addIndexParam() {
      console.log(this.treeData);
      // this.isShowAddIndexPage = true; // 显示添加参数页
      this.parameterData.unshift({ // 在头部添加
        name: '',
        para_value: ''
      });
      // this.currentEdit = this.parameterData.length - 1;
      this.currentEdit = 0;
      this.isShowParabtn = true; // 当点击了添加参数按钮，进入编辑状态把添加参数按钮无法点击
      this.isAddOrUpdate = 1; // 进入新增参数状态
    },
    // 确认保存编辑的参数
    async finishPara(row) {
      this.finishParaLoading = true; // 开启按钮等待
      try {
        // 点击新增参数按钮后再点击完成按钮，新增参数
        if (this.isAddOrUpdate === 1) { // 因为是新增参数，所以当前行的数据row,并没有index_id，，所以要从nowNode导入
          const { code } = await InsertPara({
            index_id: this.nowNode.index_id,
            name: row.name,
            para_value: row.para_value,
            conn_id: row.conn_id
          });
          if (code === 200) {
            this.isEdit = 2; // 标识为正在编辑
            this.$message.success('新增成功');
            this.currentEdit = -1; // 将input隐藏
            await this.SelectIndexPara(); // 刷新参数列表
            await this.SelectIndex(); // 刷新指标导航树页面
            this.isShowParabtn = false; // 可以点击添加参数按钮
            this.finishParaLoading = false; // 关闭按钮等待
          }
        } else { // 点击编辑参数按钮后再点击完成按钮，更新参数
          const { code } = await UpdatePara({
            index_id: row.index_id,
            para_id: row.para_id,
            name: row.name,
            para_value: row.para_value,
            conn_id: row.conn_id
          });
          if (code === 200) {
            this.isEdit = 2; // 标识为正在编辑
            this.$message.success('修改成功');
            this.currentEdit = -1; // 将input隐藏
            await this.SelectIndexPara(); // 刷新参数列表
            await this.SelectIndex(); // 刷新指标导航树页面
            this.isShowParabtn = false; // 可以点击添加参数按钮
            this.finishParaLoading = false; // 关闭按钮等待

            this.defaultKey = row.index_id;
            this.$nextTick(() => {
              this.$refs.dirTree.setCurrentKey(row.index_id);
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 点击参数放弃按钮
    giveUp(row, index) {
      this.currentEdit = -1; // 将input隐藏
      if (row.name === '' && row.para_value === '') {
        // this.parameterData[index]; // 删除最后一个参数
        this.parameterData.splice(index, 1);// 删除当前参数
      }
      // this.SelectIndexPara(); // 刷新参数列表
      // this.SelectIndex(); // 刷新整个指标导航树数据
      this.isShowParabtn = false; // 可以点击添加参数按钮
    },
    // 删除单个参数
    async deleteParams(row) {
      this.deleteParamsLoading = true; // 开启删除按钮等待圈
      try {
        const { code } = await DeletePara({ para_id: row.para_id });
        if (code === 200) {
          this.$message.success('删除成功');
          await this.SelectIndexPara(); // 刷新参数列表
          await this.SelectIndex(); // 刷新整个指标导航树数据
          this.deleteParamsLoading = false; // 关闭删除按钮等待圈
        }
      } catch (e) {
        console.log(e);
      }
    },
    /* 指标结束 */

    /* 参数取值sql语句开始 */
    // 编辑sql
    openSql(row) {
      this.SelectParaSql(row);
      this.isShowParaTab = false; //
      this.isShowBtn = false; // 新增sql语句按钮可用
      this.nowSqlRow = row;
      console.log('点击', row);
    },
    test1(row) {
      this.expand = [];
      this.expand.push(row.para_id);
    },
    // sql语句上移
    async upRow(item) {
      try {
        const { code } = await ParaSqlMove({
          id: item.id,
          para_id: item.para_id,
          MoveType: 1,
          idx: item.idx
        });
        if (code !== 200) {
          this.$message.warning('请刷新页面重新再试试。');
        }
        await this.SelectParaSql(item); // 刷新sql语句
      } catch (e) {
        console.log(e);
      }
    },
    // sql语句下移移
    async downRow(item) {
      try {
        const { code } = await ParaSqlMove({
          id: item.id,
          para_id: item.para_id,
          MoveType: 2,
          idx: item.idx
        });
        if (code !== 200) {
          this.$message.warning('请刷新页面重新再试试。');
        }
        await this.SelectParaSql(item); // 刷新sql语句
      } catch (e) {
        console.log(e);
      }
    },
    // 点击编辑按钮
    editSql(index, item) {
      this.isShowInput = false;
      this.sqlCurrentEdit = index;
      this.isAddOrUpate = 1; // 为1代表进入更新sql状态
      this.editSqlId = item.id;
    },
    // 展开表格,查询参数下方取值数据
    async unfoldTable(row) {
      console.log('单纯', row);
      this.isShowBtn = false; // 新增sql按钮可用
      await this.SelectParaSql(row);
    },
    async SelectParaSql(row) {
      const { data } = await SelectParaSql({ para_id: row.para_id });
      this.paraDynamicValidateForm = data.DataList;
    },
    // 插入新增参数取值，sql
    async InsertParaSql(index, item) {
      const { code } = await InsertParaSql(this.paraDynamicValidateForm[index]);
      if (code === 200) {
        this.$message.success('成功');
        await this.SelectParaSql(item); // 保存之后就重新获取当前的sql列表
      }
    },
    async UpdateParaSql(index, item) {
      const { code } = await UpdateParaSql(this.paraDynamicValidateForm[index]);
      if (code === 200) {
        this.$message.success('成功');
        this.isAddOrUpate = 0; // 重置一下编辑状态，为零代表为新增状态
        await this.SelectParaSql(item); // 保存之后就重新获取当前的sql列表
      }
    },
    // 插入新增参数取值，sql
    submitForm(index, item) {
      console.log('当前行数据', item);
      this.isShowInput = false;// 将input框隐藏起来
      this.sqlCurrentEdit = -1;// 将input框和保存按钮隐藏起来
      if (this.isAddOrUpate !== 0) { // 如果isAddOrUpate不为0 证明已经点击了编辑按钮就是修改sql,不然就是添加sql
        this.UpdateParaSql(index, item);
      } else {
        this.InsertParaSql(index, item);
      }

      this.isShowBtn = false; // 新增sql按钮可用
    },
    // 删除sql
    removeDomain(item) {
      var index = this.paraDynamicValidateForm.indexOf(item);
      if (index !== -1) {
        this.paraDynamicValidateForm.splice(index, 1);
        this.DeleteParaSql(item);
        this.isShowBtn = false; // 新增sql按钮可用
      }
    },
    // 根据参数取值数据的id删除对应sql
    async DeleteParaSql(item) {
      const { code } = await DeleteParaSql({ id: item.id });
      if (code === 200) {
        this.$message.success('删除成功');
      }
    },
    // 新增sql语句
    addDomain() {
      this.isShowBtn = true; // 禁用新增sql按钮
      this.sqlCurrentEdit = this.paraDynamicValidateForm.length; // 加载input框
      this.isAddOrUpate = 0; // 使得变为新增sql状态
      this.paraDynamicValidateForm.push({
        para_id: this.nowSqlRow.para_id,
        conn_id: this.nowSqlRow.conn_id,
        idx: this.paraDynamicValidateForm.length,
        sqlsen: '',
        remarks: ''
      });
    },

    // 获取数据库源
    async SelectConn() {
      const { data } = await SelectConn();
      this.sourceData = data.DataList;
    },
    // 点击参数的编辑按钮
    editParams(index) {
      this.currentEdit = index; // 将所点击行设定为当前行
      this.isAddOrUpdate = 2; // 进入编辑更新参数状态
      this.isShowParabtn = true; // 当点击了编辑参数按钮，进入编辑状态把添加参数按钮无法点击
    },
    handleSelectionChange(selection) {
      this.assignCheckLis = selection;
    }
    /* 参数取值sql语句结束*/
  }
};
</script>
<style lang="scss" scoped>
@import 'index.scss';

.el-table--scrollable-y .el-table__body-wrapper {
  overflow: scroll;
}

.demo-table-expand {
  font-size: 0;
  overflow: scroll;
  margin-left: 20px;
}

.demo-table-expand label {
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

// 添加参数页面
.addIndexPage {
  .el-card {
    width: 90%;
    height: 80%;
    //margin: 10vh;

  }

}

.lineTree {
  overflow: auto;
  margin-top: 2px;
  border-top: 1px solid #c0bebe;
  //border-bottom: 1px dotted #c0bebe;

  .el-tree-node__content {
    border-bottom: 1px solid rgb(235, 235, 235);
  }
}

.el-icon-s-order {
  color: #FFBA00;
}
</style>
