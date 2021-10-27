<template>
  <div style="padding: 20px">
    <el-tag :type="type">培训签到{{ msg }}</el-tag>
  </div>
</template>

<script>
import { TrainSign } from '@/api/PX_Apply';

export default {
  name: 'TrainSign',
  data() {
    return {
      type: '',
      msg: ''
    };
  },
  created() {
    if (this.$route.query.id) this.trainSign();
  },
  methods: {
    async trainSign() {
      try {
        const { code, msg } = await TrainSign({
          planID: this.$route.query.id,
          UserID: window.userInfo[0].UserID
        });
        this.type = code == 200 ? 'success' : 'warning';
        this.msg = msg;
      } catch (error) {}
    }
  }
};
</script>
