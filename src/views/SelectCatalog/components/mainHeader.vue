<template>
  <div class="mainHeader">
    <el-row type="flex" justify="center" style="margin-top: 20px">
      <el-col :span="16" :xs="24">
        <el-radio-group v-model="radio" @change="radioGroup">
          <el-radio-button
            v-for="(item, index) in headerData"
            :key="index"
            :label="index"
          >{{ item.CatalogName }}
          </el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      justify="center"
      style="margin-top: 20px; align-items: center"
    >
      <el-col
        :span="16"
        :xs="24"
        style="
          display: flex;
          border-bottom: 1px solid #dfdfdf;
          padding: 0 0 5px 0;
        "
      >
        <div class="catalogName">{{ CatalogName }}</div>
        <div style="flex: 1; display: flex; flex-wrap: wrap">
          <div
            v-for="(itemTow, indexTow) in headerData[radio]
              ? headerData[radio].Children
              : []"
            :key="indexTow"
            style="
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              margin: 3px;
            "
          >
            <el-link
              v-if="typeof itemTow!==undefined"
              target="_blank"
              class="fontColor"
              @click="clickTwo(itemTow.CatalogID, indexTow)"
            >{{ itemTow.CatalogCode }}
            </el-link>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="16" :xs="24">
        <h2>
          <p style="font-weight: 700">
            {{
              headerData[radio]
                ? headerData[radio].Children[redio2].CatalogName
                : '空'
            }}
          </p>
        </h2>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { GetCatalogFirst } from '@/api/catalog';

export default {
  data() {
    return {
      fullscreenLoading: false,
      headerData: [],
      CatalogName: '',
      TwoHeader: '',
      TwoNum: '',
      radio: 0,
      redio2: 0
    };
  },
  created() {
    this.GetCatalogFirst();
  },
  mounted() {
  },
  methods: {

    async GetCatalogFirst() {
      try {
        const { data } = await GetCatalogFirst();
        this.headerData = data;
        this.CatalogName = data[0].CatalogName;
        console.log(data[8].Children);
        const CatalogID = data[0].Children ? data[0].Children[0].CatalogID : 0;
        this.clickTwo(CatalogID, 0);
      } catch (error) {
        console.log(error);
      }
    },
    async radioGroup(val) {
      this.CatalogName = this.headerData[val].CatalogName;
      this.clickTwo(this.headerData[val].Children[0].CatalogID, 0);
    },
    clickTwo(CatalogID, key = 0) {
      this.fullscreenLoading = true;
      this.redio2 = key;
      this.$nextTick(() => {
        const fontColor = document.querySelectorAll('.fontColor');
        for (let i = 0; i < fontColor.length; i++) {
          fontColor[i].style.color = '#9f9f9f';
          fontColor[i].style.fontWeight = 'normal';
        }
        fontColor[key].style.color = '#0066cc';
        fontColor[key].style.fontWeight = 'bold';
        this.$emit('changeCatalogID', CatalogID);

        this.$forceUpdate();
      });
    }
  }
};
</script>

<style lang="scss">
.mainHeader {
  .el-radio-button {
    border-radius: 20px;
    margin: 15px 15px 5px 0;
    box-shadow: 1px 1px 5px 1px #dfdfdf;

    .el-radio-button__inner {
      border-radius: 20px;
      font-weight: bold;
      font-size: 16px;
      color: rgb(0, 102, 204) !important;
    }

    .el-radio-button__inner:hover {
      background: #D2E9FF;
      color: white;
    }

    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background: rgb(0, 102, 204) !important;
      color: rgb(255, 255, 255) !important;
    }
  }

  .el-radio-button:hover {
    background: #00ff80;
  }

  .catalogName {
    border-radius: 20px;
    height: 34px;
    padding: 4px;
    text-align: center;
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
    margin-right: 20px;
    background: #0066cc;
    color: #fff;
  }

  .fontColor {
    background-image: url(~@/assets/SelectCatalog_b.jpg);
    background-repeat: no-repeat;
    padding-left: 15px;
    color: rgb(159, 159, 159);
    font-weight: normal;
  }

  .el-col.el-col-16.el-col-xs-24 {
    border-radius: 20px;
    //border-bottom: 1px solid  #0066cc ;
    font-size: 14px !important;
    color: #0066cc;

    .h2 {
      color: red;
    }
  }

}

</style>
