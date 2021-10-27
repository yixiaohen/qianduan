<template>
  <el-container class="treeFilter">
    <el-header>
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-input
            v-model="filterText"
            size="mini"
            clearable
            placeholder="关键字查询(回车查询)"
            @keyup.enter.native="filterName"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            ref="searchSelect"
            v-model="position"
            placeholder="职位(回车查询)"
            filterable
            allow-create
            default-first-option
            clearable
            @keyup.enter.native="filterData"
            @change="changePosition"
          >
            <el-option
              v-for="item in position_options"
              :key="item.PositionID"
              :label="item.PositionName"
              :value="item.PositionID"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="job"
            placeholder="职称(选择查询)"
            filterable
            clearable
            @keyup.enter.native="filterjob"
            @change="filterjob"
          >
            <el-option
              v-for="item in job_options"
              :key="item.JobID"
              :label="item.JobName"
              :value="item.JobID"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <div class="dept-tree">
        <el-tree
          ref="Trees"
          show-checkbox
          :node-key="TreeData.key"
          icon-class
          highlight-current
          :data="treeData"
          :props="props"
          :filter-node-method="filterNode"
          @check-change="handleCheckChange"
        />
      </div>
    </el-main>
  </el-container>
</template>
<script>
// 职位组件
import { SelectPosition } from '@/api/position';
// 职称组件
import { SelectJob } from '@/api/job';

export default {
  props: ['TreeData'],
  data() {
    return {
      props: {
        children: this.TreeData.children,
        label: this.TreeData.label
      },
      treeData: [] /* 树控Data */,
      filterText: '',
      position_options: '',
      position: '',
      job_options: '',
      job: '',
      setVs: [] /* 原来勾选的默认值 */
    };
  },
  created() {
    this.$nextTick(() => {
      this.treeData = this.filtterData(this.TreeData.treeData);
    });
    this.SelectPosition();
    this.SelectJob();
  },
  methods: {
    filtterData(data, parentName) {
      const tableData = [];
      data.map(item => {
        const children = {};
        if (item.UserID === 0) {
          children.UserID = -item.ID;
          children.DeptID = item.DeptID;
          children.Name = item.Name;
          children.label = item.Name;
          children.PositionID = 0;
          children.JobID = 0;
          children.ID = item.ID;
          children.icon = 'el-icon-s-home';
        } else {
          children.UserID = item.ID;
          children.DeptID = item.DeptID;
          children.Name = item.Name;
          children.label = `${item.Name} 【${item.PositionName}/${item.JobName}/${parentName}】`;
          children.PositionID = item.PositionID;
          children.JobID = item.JobID;
          children.ID = item.ID;
          children.icon = 'el-icon-user-solid';
        }
        if (item.children && item.children.length > 0) {
          children.children = this.filtterData(item.children, item.Name);
        }
        tableData.push(children);
      });
      return tableData;
    },
    // 查询过滤功能，由于lable可能是不同的，label或Name...
    filterNode(value, data, node) {
      if (!value) return true;
      if (this.filterText) {
        const one = data.Name.indexOf(value) !== -1;
        const two =
          node.parent &&
          node.parent.data &&
          node.parent.data.Name &&
          node.parent.data.Name.indexOf(value) !== -1;
        const three =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.data &&
          node.parent.parent.data.Name &&
          node.parent.parent.data.Name.indexOf(value) !== -1;
        const four =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.parent &&
          node.parent.parent.parent.data &&
          node.parent.parent.parent.data.Name &&
          node.parent.parent.parent.data.Name.indexOf(value) !== -1;
        const five =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.parent &&
          node.parent.parent.parent.parent &&
          node.parent.parent.parent.parent.data &&
          node.parent.parent.parent.parent.data.Name &&
          node.parent.parent.parent.parent.data.Name.indexOf(value) !== -1;
        let result_one = false;
        let result_two = false;
        let result_three = false;
        let result_four = false;
        let result_five = false;
        if (node.level === 1) {
          result_one = one;
        } else if (node.level === 2) {
          result_two = one || two;
        } else if (node.level === 3) {
          result_three = one || two || three;
        } else if (node.level === 4) {
          result_four = one || two || three || four;
        } else if (node.level === 5) {
          result_five = one || two || three || four || five;
        }
        return (
          result_one || result_two || result_three || result_four || result_five
        );
      }
      if (this.label) {
        const one = data.label.indexOf(this.label) !== -1;
        const two =
          node.parent &&
          node.parent.label &&
          node.parent.data.label &&
          node.parent.data.label.indexOf(this.label) !== -1;
        const three =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.data &&
          node.parent.parent.data.label &&
          node.parent.parent.data.label.indexOf(this.label) !== -1;
        const four =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.parent &&
          node.parent.parent.parent.data &&
          node.parent.parent.parent.data.label &&
          node.parent.parent.parent.data.label.indexOf(this.label) !== -1;
        const five =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.parent &&
          node.parent.parent.parent.parent &&
          node.parent.parent.parent.parent.data &&
          node.parent.parent.parent.parent.data.label &&
          node.parent.parent.parent.parent.data.label.indexOf(this.label) !==
          -1;
        let result_one = false;
        let result_two = false;
        let result_three = false;
        let result_four = false;
        let result_five = false;
        if (node.level === 1) {
          result_one = one;
        } else if (node.level === 2) {
          result_two = one || two;
        } else if (node.level === 3) {
          result_three = one || two || three;
        } else if (node.level === 4) {
          result_four = one || two || three || four;
        } else if (node.level === 5) {
          result_five = one || two || three || four || five;
        }
        return (
          result_one || result_two || result_three || result_four || result_five
        );
      }
      let re = 1;
      if (this.position) {
        re = re && data.PositionID == this.position;
        return re;
      }
      if (this.job) {
        re = re && data.JobID == this.job;
        return re;
      }
      // 后续可根据不同的label增加if
      // if (this.TreeData.label == "Name") {
      //   return data.Name.indexOf(value) !== -1;
      // } else if (this.TreeData.label == "label")
      //   return data.label.indexOf(value) !== -1;
    },
    /* 获取当前选中的UserID */
    handleCheckChange(data, checked, indeterminate, getHalfCheckedKeys) {
      const checkData = this.$refs.Trees.getCheckedNodes();
      let arrs = [];
      if (this.TreeData.key == 'ID') {
        arrs = checkData.map(item => {
          return item.ID;
        });
      } else if (this.TreeData.key == 'UserID') {
        if (this.label) {
          checkData.map(item => {
            if (
              item.ID === item.UserID &&
              item.label.indexOf(this.label) > -1
            ) {
              arrs.push(item.UserID);
            }
            this.setVs.map((item2, index2) => {
              if (item.UserID == item2) {
                arrs.push(item.UserID);
              }
            });
          });
        } else if (this.position) {
          checkData.map(item => {
            if (item.ID === item.UserID && this.position == item.PositionID) {
              arrs.push(item.UserID);
            }
            this.setVs.map((item2, index2) => {
              if (item.UserID == item2) {
                arrs.push(item.UserID);
              }
            });
          });
        } else {
          checkData.map(item => {
            if (item.ID === item.UserID) {
              arrs.push(item.UserID);
            }
            this.setVs.map((item2, index2) => {
              if (item.UserID == item2) {
                arrs.push(item.UserID);
              }
            });
          });
        }
      }
      const compact = arr => arr.filter(Boolean); // 过滤掉为假的值：0、undefined、null、NaN、''、false，比如部门的userID=0，人员则有具体的userID
      const strInstAduitUser = compact(arrs).join(',');
      this.$emit('getSelect', strInstAduitUser);
    },
    // 父组件中设置树形结构中当前选中的item
    setDeptorUser(v) {
      v = typeof v === 'string' ? v.split(',') : v;
      const vs = v.map(item => parseInt(item));
      this.setVs = vs;
      this.$refs.Trees.setCheckedKeys(vs);
    },
    async SelectPosition() {
      try {
        const { data } = await SelectPosition({
          pageSize: 1000,
          pageIndex: 1,
          condition: ''
        });
        this.position_options = data.DataList;
      } catch {}
    },
    async SelectJob() {
      try {
        const { data } = await SelectJob({
          pageSize: 1000,
          pageIndex: 1,
          condition: ''
        });
        this.job_options = data.DataList;
      } catch {}
    },
    filterData() {
      const str = this.$refs.searchSelect.$data.selectedLabel; // 此属性得到输入的文字
      this.label = str;
      this.job = '';
      this.filterText = '';
      if (!str) {
        return;
      }
      this.$refs.Trees.filter({ label: str });
    },
    filterName() {
      this.job = '';
      this.position = '';
      this.$refs.Trees.filter(this.filterText);
    },
    filterjob() {
      this.filterText = '';
      this.position = '';
      this.label = '';
      this.$refs.Trees.filter({ job: this.job });
    },
    changePosition(val) {
      this.filterText = '';
      this.job = '';
      this.label = '';
      if (typeof val !== 'string') {
        this.$refs.Trees.filter({ position: val });
      }
    }
  }
};
</script>
<style lang="scss">
.treeFilter {
  height: calc(100vh - 380px);
  .el-header {
    height: 30px !important;
  }
  .el-header,
  .el-main {
    margin: 0;
    padding: 0;
  }

  .dept-tree {
    overflow-y: auto;
  }
}
</style>

// 组件使用方法
<!--
<template>
  <div>
    <tree-filter
      ref="TreeID"
      :TreeData="TreeFilterData"
      @getSelect="getSelect"
    ></tree-filter>
  </div>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="修改"
                  placement="right"
                >
                  <el-button
                    size="mini"
                    circle
                    type="info"
                    icon="el-icon-edit"
                    @click="edit(scope.row)"
                  />
                </el-tooltip>
              </template>
            </el-table-column>
</template>
-->
/* import treeFilter from "@/views/components/treeFilter"; export default { components: {
treeFilter }, data() { return { TreeFilterData: { label: "label", children: "children",
key: "userID", treeData: [ { userID: 10, id: 1, label: "一级 1", children: [ { userID: 9,
id: 4, label: "二级 1-1", children: [ { userID: 8, id: 9, label: "三级 1-1-1", }, {
userID: 7, id: 10, label: "三级 1-1-2", }, ], }, ], }, { userID: 6, id: 2, label: "一级
2", children: [ { userID: 5, id: 5, label: "二级 2-1", }, { userID: 4, id: 6, label: "二级
2-2", }, ], }, { userID: 3, id: 3, label: "一级 3", children: [ { userID: 2, id: 7, label:
"二级 3-1", }, { userID: 1, id: 8, label: "二级 3-2", children: [ { userID: 11, id: 11,
label: "三级 3-2-1", }, { userID: 12, id: 12, label: "三级 3-2-2", }, { userID: 13, id:
13, label: "三级 3-2-3", }, ], }, ], }, ], }, }; }, methods: { edit(row) { setTimeout(()
=> {
this.$refs.TreeID.setDeptorUser(row.UserID);这里是后端返回的表中每行的UserID，每行row可有多个，用逗号分隔
}, 0); this.dialogVisible = true; }, getSelect(val) { this.UserID = val; } } */
