<template>
  <el-container class="sms">
    <el-main>
      <el-form
        ref="formLabelAlign"
        label-position="right"
        :model="formLabelAlign"
        prop="Url"
        size="small"
        :rules="rules"
      >
        <el-form-item
          label="短信接口地址"
          label-width="170px"
          prop="Url"
        >
          <el-input v-model="formLabelAlign.Url" />
        </el-form-item>
        <el-form-item
          label="短信日志接口地址"
          label-width="170px"
          prop="ReceiveUrl"
        >
          <el-input v-model="formLabelAlign.ReceiveUrl" />
        </el-form-item>
        <el-form-item
          label="自动发送短信"
          label-width="170px"
        >
          <el-radio-group
            v-model="formLabelAlign.Status"
            size="small"
          >
            <el-radio
              :label="1"
              border
            >开启</el-radio>
            <el-radio
              :label="0"
              border
            >关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label-width="170px"
          :label="para.menu_one+'通过'"
          prop="Content1"
        >
          <el-input
            v-model="formLabelAlign.Content1"
            type="textarea"
            clearable
          />
        </el-form-item>
        <el-form-item
          label-width="170px"
          :label="para.menu_two+'通过'"
          prop="Content2"
        >
          <el-input
            v-model="formLabelAlign.Content2"
            type="textarea"
            clearable
          />
        </el-form-item>
        <el-form-item
          label-width="170px"
          :label="para.menu_two+'退回'"
          prop="Content3"
        >
          <el-input
            v-model="formLabelAlign.Content3"
            type="textarea"
            clearable
          />
        </el-form-item>
        <el-form-item
          label-width="170px"
          :label="para.menu_three+'退回'"
          prop="Content4"
        >
          <el-input
            v-model="formLabelAlign.Content4"
            type="textarea"
            clearable
          />
        </el-form-item>
        <el-form-item label-width="170px">
          <el-button
            type="success"
            size="small"
            @click="InsertOrUpdateSMS"
          >提交</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <!-- <el-footer>Footer</el-footer> -->
  </el-container>
</template>
<script>
import { InsertOrUpdateSMS, SelectSMS } from '@/api/SMS';

export default {
  data() {
    return {
      formLabelAlign: {
        Url: '',
        ReceiveUrl: '',
        Status: 1,
        Content1: '',
        Content2: '',
        Content3: '',
        Content4: ''
      },
      para: '',
      rules: {
        Url: [{ required: true, message: '请输入', trigger: 'blur' }],
        ReceiveUrl: [{ required: true, message: '请输入', trigger: 'blur' }],
        Content1: [{ required: true, message: '请输入', trigger: 'blur' }],
        Content2: [{ required: true, message: '请输入', trigger: 'blur' }],
        Content3: [{ required: true, message: '请输入', trigger: 'blur' }],
        Content4: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.SelectSMS();
  },
  methods: {
    async SelectSMS() {
      this.para = this.$store.getters.iniPara;
      const { code, data } = await SelectSMS();
      if (code === 200) {
        this.formLabelAlign = data;
      }
    },
    InsertOrUpdateSMS() {
      this.$refs.formLabelAlign.validate(async(valid) => {
        if (valid) {
          const { code } = await InsertOrUpdateSMS(this.formLabelAlign);
          if (code === 200) {
            this.$message.success('更新成功');
            window.SMSStatus = this.formLabelAlign.Status;
            this.SelectSMS();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.sms {
  // background: rgb(228, 237, 240);
  .el-header {
    height: 30px !important;
    padding: 0px 0 0 0px;
  }

  .el-main {
    margin-top: 30px;
    padding: 0 0px;
  }
  .el-footer {
    height: 35px !important;
  }
  .el-input__inner,
  .el-textarea__inner {
    border-radius: 0px;
    width: 17rem;
  }
  .el-button--small {
    border-radius: 0px;
  }
  .el-button--success {
    background-color: rgb(52, 162, 201);
    border-color: rgb(52, 162, 201);
  }
  .el-button--success:hover {
    background-color: #3daacf;
    border-color: #3daacf;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: rgb(52, 162, 201);
    background: rgb(52, 162, 201);
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: rgb(52, 162, 201);
  }
  .el-radio.is-bordered.is-checked {
    border-color: rgb(52, 162, 201);
  }
}
</style>
