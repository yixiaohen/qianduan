<template>
  <el-container class="Dept">
    <el-header style="height: auto">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="name"
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
            class="searchSelect"
            placeholder="职位"
            size="mini"
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
            size="mini"
            filterable
            clearable
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
        <el-form-item>
          <el-select
            v-model="RoleID"
            placeholder="角色(选择查询)"
            size="mini"
            filterable
            clearable
            @change="elSelectRole"
          >
            <el-option
              v-for="itemRole in RoleTable"
              :key="itemRole.RoleID"
              :label="itemRole.RoleName"
              :value="itemRole.RoleID"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-tree
        ref="userTrees"
        show-checkbox
        node-key="UserID"
        icon-class
        highlight-current
        :data="tableData"
        :props="props"
        :check-strictly="checkStrictly"
        :filter-node-method="filterNode"
        @check="getSelectDeptorUser"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>
            <i :class="data.icon" />
            &nbsp;
            {{ node.label }}
          </span>
        </span>
      </el-tree>
    </el-main>
  </el-container>
</template>
<script>
import { SelectDeptorUser } from '@/api/EvaluationUser';
// 职位组件
import { SelectPosition } from '@/api/position';
// 职称组件
import { SelectJob } from '@/api/job';
import { CA_SelectDeptorUser } from '@/api/CatalogAuthorization';
import { SelectRole } from '@/api/user';
import { mapGetters } from 'vuex';

export default {
  name: 'GetSelectDeptorUser',
  props: {
    value: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      props: {
        label: 'label',
        children: 'children',
        multiple: this.multiple
      },
      name: '',
      position: '',
      position_options: [],
      job: '',
      job_options: [],
      tableData: [],
      checkStrictly: false,
      treeDeptValue: this.value,
      label: '',
      setVs: [] /* 原来勾选的默认值 */,
      RoleTable: [],
      RoleID: '',
      nodeLength: 0
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectDeptorUser();
    this.SelectPosition();
    this.SelectJob();
    this.SelectRole();
  },
  methods: {
    getSelectDeptorUser(value) {
      const Nodes = this.$refs.userTrees.getCheckedNodes();
      this.nodeLength = Nodes.length;
      // console.log(Nodes.length);
      const NodesID = [];
      const NodesItem = [];
      if (this.label) {
        Nodes.map(item => {
          if (item.ID === item.UserID && item.label.indexOf(this.label) > -1) {
            NodesID.push(item.UserID);
            NodesItem.push(item);
          }
          this.setVs.map((item2, index2) => {
            if (item.UserID == item2) {
              NodesID.push(item.UserID);
            }
          });
        });
      } else if (this.position) {
        Nodes.map(item => {
          if (item.ID === item.UserID && this.position == item.PositionID) {
            NodesID.push(item.UserID);
            NodesItem.push(item);
          }
          this.setVs.map((item2, index2) => {
            if (item.UserID == item2) {
              NodesID.push(item.UserID);
            }
          });
        });
      } else {
        Nodes.map(item => {
          if (item.ID === item.UserID) {
            NodesID.push(item.UserID);
            NodesItem.push(item);
          }
          this.setVs.map((item2, index2) => {
            if (item.UserID == item2) {
              NodesID.push(item.UserID);
            }
          });
        });
      }
      this.$emit('getSelectDeptorUser', NodesID, NodesItem);
    },
    filterNode(val, data, node) {
      if (
        !this.name &&
        !this.position &&
        !this.job &&
        !this.label &&
        !this.RoleID
      ) { return true; }
      if (this.name) {
        const one = data.Name.indexOf(this.name) !== -1;
        const two =
          node.parent &&
          node.parent.data &&
          node.parent.data.Name &&
          node.parent.data.Name.indexOf(this.name) !== -1;
        const three =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.data &&
          node.parent.parent.data.Name &&
          node.parent.parent.data.Name.indexOf(this.name) !== -1;
        const four =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.parent &&
          node.parent.parent.parent.data &&
          node.parent.parent.parent.data.Name &&
          node.parent.parent.parent.data.Name.indexOf(this.name) !== -1;
        const five =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.parent &&
          node.parent.parent.parent.parent &&
          node.parent.parent.parent.parent.data &&
          node.parent.parent.parent.parent.data.Name &&
          node.parent.parent.parent.parent.data.Name.indexOf(this.name) !== -1;
        const six =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.parent &&
          node.parent.parent.parent.parent &&
          node.parent.parent.parent.parent.parent &&
          node.parent.parent.parent.parent.parent.data &&
          node.parent.parent.parent.parent.parent.data.Name &&
          node.parent.parent.parent.parent.parent.data.Name.indexOf(this.name) !== -1;
        const seven =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.parent &&
          node.parent.parent.parent.parent &&
          node.parent.parent.parent.parent.parent &&
          node.parent.parent.parent.parent.parent.parent &&
          node.parent.parent.parent.parent.parent.parent.data &&
          node.parent.parent.parent.parent.parent.parent.data.Name &&
          node.parent.parent.parent.parent.parent.parent.data.Name.indexOf(this.name) !== -1;
        let result_one = false;
        let result_two = false;
        let result_three = false;
        let result_four = false;
        let result_five = false;
        let result_six = false;
        let result_seven = false;
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
        } else if (node.level === 6) {
          result_six = one || two || three || four || five || six;
        } else if (node.level === 7) {
          result_seven = one || two || three || four || five || six || seven;
        }
        return (
          result_one || result_two || result_three || result_four || result_five || result_six || result_seven
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
          node.parent.parent.parent.parent.data.label.indexOf(this.label) !== -1;
        const six =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.parent &&
          node.parent.parent.parent.parent &&
          node.parent.parent.parent.parent.parent &&
          node.parent.parent.parent.parent.parent.data &&
          node.parent.parent.parent.parent.parent.data.label &&
          node.parent.parent.parent.parent.parent.data.label.indexOf(this.label) !== -1;
        const seven =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.parent &&
          node.parent.parent.parent.parent &&
          node.parent.parent.parent.parent.parent &&
          node.parent.parent.parent.parent.parent.parent &&
          node.parent.parent.parent.parent.parent.parent.data &&
          node.parent.parent.parent.parent.parent.parent.data.label &&
          node.parent.parent.parent.parent.parent.parent.data.label.indexOf(this.label) !== -1;
        let result_one = false;
        let result_two = false;
        let result_three = false;
        let result_four = false;
        let result_five = false;
        let result_six = false;
        let result_seven = false;
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
        } else if (node.level === 6) {
          result_six = one || two || three || four || five || six;
        } else if (node.level === 7) {
          result_seven = one || two || three || four || five || six || seven;
        }
        return (
          result_one || result_two || result_three || result_four || result_five || result_six || result_seven
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
      if (this.RoleID) {
        let Role = false;
        data.RoleIDArray.map(item => {
          if (item == this.RoleID) {
            Role = true;
          }
        });
        re = re && Role;

        return re;
      }
    },
    async SelectDeptorUser() {
      try {
        if (this.value == '资料录入员分配') {
          const { data } = await CA_SelectDeptorUser({
            UserID: window.userInfo[0].UserID
          });
          this.tableData = this.filtterData(data);
        } else {
          const { data } = await SelectDeptorUser();
          this.tableData = this.filtterData(data);
        }
      } catch (error) {
        console.log(error);
      }
    },
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
          children.RoleIDArray = item.RoleIDArray;
        } else {
          children.UserID = item.ID;
          children.DeptID = item.DeptID;
          children.Name = item.Name;
          children.label = `${item.Name} 【${item.PositionName}/${item.JobName}/${parentName}】`;
          children.PositionID = item.PositionID;
          children.JobID = item.JobID;
          children.ID = item.ID;
          children.icon = 'el-icon-user-solid';
          children.RoleIDArray = item.RoleIDArray;
        }
        if (item.children && item.children.length > 0) {
          children.children = this.filtterData(item.children, item.Name);
        }
        tableData.push(children);
      });
      return tableData;
    },
    setDeptorUser(v) {
      const vs = v.map(item => parseInt(item));
      this.$refs.userTrees.setCheckedKeys(vs);
      this.setVs = vs;
      this.$emit('getSelectDeptorUser', vs);
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
      } catch (error) {
        console.log(error);
      }
    },
    filterData() {
      const str = this.$refs.searchSelect.$data.selectedLabel; // 此属性得到输入的文字
      this.label = str;
      this.job = '';
      this.name = '';
      if (!str) {
        this.$refs.userTrees.filter();
        return;
      }
      this.$refs.userTrees.filter({ label: str });
    },
    filterName() {
      this.job = '';
      this.position = '';
      this.$refs.userTrees.filter({ name: this.name });
    },
    filterjob(val) {
      this.name = '';
      this.position = '';
      this.label = '';
      this.job = val;
      this.$refs.userTrees.filter({ job: val });
    },
    changePosition(val) {
      this.name = '';
      this.job = '';
      this.label = '';
      if (typeof val !== 'string') {
        this.$refs.userTrees.filter({ position: val });
      }
    },
    async SelectRole() {
      try {
        const { data } = await SelectRole({
          pageSize: 100,
          pageIndex: 1,
          condition: ''
        });
        this.RoleTable = data.DataList;
      } catch (error) {
        console.log(error);
      }
    },
    elSelectRole(val) {
      this.name = '';
      this.position = '';
      this.label = '';
      this.job = '';
      this.$refs.userTrees.filter({ RoleID: val });
    }
  }
};
</script>

<style lang="scss">
.Dept {
  height: calc(100vh - 400px);
  .el-header {
    padding: 0px;
    margin: 0px;
    .el-form-item {
      margin-bottom: 1px !important;
    }
  }
  .el-main {
    padding: 0px;
    margin: 0px;
    overflow-y: auto;
    height: calc(100vh - 300px);
  }
}
</style>
