<template>
  <div class="AdverseEvents_Home">
    <el-card
      v-for="(item, id) in eventData"
      :key="id"
      class="box-card-view"
      shadow="hover"
      @click="gotoReport(item)"
    >
      <div
        style="text-align: center; font-size: 15px"
        @click="gotoReport(item)"
      >
        {{ item.name }}
      </div>
      <div @click="gotoReport(item)">
        <el-image
          class="img"
          :src="getUrl(item.id)"
        ><div slot="error" class="image-slot">
          <i class="el-icon-picture-outline" /></div></el-image>
      </div>
    </el-card>
  </div>
</template>
<script>
import { SelectEventList } from '@/api/AE_Event';

export default {
  name: 'AdverseEventsHome',
  data() {
    return {
      eventData: []
    };
  },
  created() {
    this.getEvent();
  },
  methods: {
    gotoReport(item) {
      this.$router.push({
        name: 'AdverseEventsReport',
        params: { name: item.name, id: item.id }
      });
    },
    getUrl(id) {
      id > 6 ? (id = 2) : '';
      try {
        return require('@/assets/AdverseEvents/adverseevent_' + id + '.png');
      } catch (e) {
        console.log(e);
      }
    },
    async getEvent() {
      try {
        const { data } = await SelectEventList();
        data.forEach(element => {
          this.eventData.push({
            id: element.EventID,
            name: element.EventName
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
<style lang="scss">
.AdverseEvents_Home {
  display: flex;
  flex-direction: column;
  flex-flow: wrap;
  margin: 10px 0px 0 0px;
  overflow: auto;
  .box-card-view {
    height: 20vh;
    width: 12vw;
    margin: 1vh 1vw;
  }
  .box-card-view:hover {
    height: 22vh;
    width: 14vw;
    margin: 0px;
  }
  .img {
    background-repeat: no-repeat;
    background-size: cover;
  }
}
</style>
