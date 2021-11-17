<template>
  <div class="root">
    <div class="top-container">
      <div class="top-container-head">
        <el-select
          style="margin-top: 6px;"
          v-model="h_id"
          placeholder="请选择"
          size="mini"
          @change="SelectCo"
        >
          <el-option
            v-for="item in h_name"
            :key="item.vcID"
            :label="item.MenuName"
            :value="item.vcID"
          />
        </el-select>
      </div>
      <div class="top-container-body">
        <el-table
          size="mini"
          :data="h_tb"
          style="width:100%;margin-top: 6px"
          height="calc(100vh - 180px)"
          row-key="vcItemID"
          border
        >
          <el-table-column type="index" />
          <el-table-column prop="vcName" label="字段名称" width="150" />
          <el-table-column prop="intWidth" label="宽度" width="100" />
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="updateDlg(row)"
              />
              <el-button
                v-if="row.ParentID != 0"
                size="mini"
                type="info"
                icon="el-icon-top"
                circle
                @click="upRow(row)"
              />
              <el-button
                v-if="row.ParentID != 0"
                size="mini"
                type="info"
                icon="el-icon-bottom"
                circle
                @click="downRow(row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      title="修改字段"
      :visible.sync="dlgUpdate"
      width="400px"
    >
      <el-form
        ref="formCo"
        :model="formCo"
        :rules="rules"
        size="mini"
        label-width="80px"
      >
        <el-form-item label="字段名称" prop="name">
          <el-input v-model="formCo.name" />
        </el-form-item>
        <el-form-item label="字段宽度" prop="width">
          <el-input v-model="formCo.width" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dlgUpdate = false">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="doUpdateTemplate()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { CoMove, SelectAllMenuName, SelectCo, UpdateTemplate } from '@/api/co';

export default {
  name: 'Menu',
  data() {
    return {
      dlgUpdate: false,
      h_id: '',
      h_itemID: '',
      h_name: {},
      h_tb: [],
      formCo: {
        name: '',
        width: ''
      },
      rules: {
        name: [{ required: true, message: '请输入字段名称', trigger: 'blur' }],
        width: [{ required: true, message: '请输入字段宽度', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.SelectAllMenuName();
  },
  methods: {
    doUpdateTemplate() {
      this.$refs.formCo.validate(async v => {
        if (v) {
          try {
            const { data } = await UpdateTemplate({
              vcID: this.h_id,
              vcItemID: this.h_itemID,
              vcName: this.formCo.name,
              intWidth: this.formCo.width
            });
            data === 1
              ? this.$message({
                type: 'success',
                message: '修改成功!'
              })
              : this.$message({
                type: 'error',
                message: '修改失败!'
              });
          } catch {}
          this.dlgUpdate = false;
          this.SelectCo();
        }
      });
    },
    updateDlg(row) {
      this.formCo.name = row.vcName;
      this.formCo.width = row.intWidth;
      this.h_itemID = row.vcItemID;
      this.dlgUpdate = true;
    },
    async SelectAllMenuName() {
      try {
        const { data } = await SelectAllMenuName();
        this.h_name = data;
        if (this.h_name.length) this.h_id = this.h_name[0].vcID;
        this.SelectCo();
      } catch {}
    },
    async SelectCo() {
      try {
        const { data } = await SelectCo({
          pageIndex: 1,
          pageSize: 1000,
          vcID: this.h_id
        });
        this.h_tb = data.DataList;
      } catch {}
    },
    async upRow(row) {
      CoMove({ vcID: this.h_id, vcItemID: row.vcItemID, MoveType: 1 });
      setTimeout(() => {
        this.SelectCo();
      }, 200);
    },
    async downRow(row) {
      CoMove({ vcID: this.h_id, vcItemID: row.vcItemID, MoveType: 2 });
      setTimeout(() => {
        this.SelectCo();
      }, 200);
    }
  }
};
</script>
<style lang="scss">
.root {
  height: calc(100vh - 100px);
  .top-container {
    width: 100%;
    height: 100%;
    .top-container-head {
      height: 32px;
    }
    .top-container-body {
      height: 100%;
      overflow-y: hidden;
    }
  }
}
</style>
