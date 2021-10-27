<template>
  <div id="selectCatalog" class="selectCatalog">
    <el-backtop target=".selectCatalog" />
    <Headers @changeCatalogID2="changeCatalogID2" />
    <mainHeader ref="mainHeader" @changeCatalogID="changeCatalogID" />
    <mains ref="catalogID" />
  </div>
</template>
<script>
import Headers from './components/Header.vue';
import mainHeader from './components/mainHeader.vue';
import mains from './components/main.vue';

export default {
  name: 'Indexs',
  components: {
    Headers,
    mainHeader,
    mains
  },
  data() {
    return {
      test: 'tests',
      tableData: [],
      catalogID: 0,
      catalogID2: ''
    };
  },
  methods: {
    async changeCatalogID(val) {
      this.catalogID = val;
      console.log(this.catalogID);
      this.$nextTick(() => {
        this.$refs.catalogID.GetcatalogSecond(val);
      });
    },
    async changeCatalogID2(val) {
      console.log('执行了');
      this.$nextTick(() => {
        this.$refs.catalogID.GetcatalogSecond(this.catalogID);
      });
    }
  }
};
</script>
<style lang="scss">
.selectCatalog {
  height: 85vh;
  overflow: auto;
}
</style>
