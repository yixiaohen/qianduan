<template>
  <div class="SelectCatalogHeader">
    <div class="left">
      <router-link :to="{ path: '/' }">
        <el-image
          :src="require('@/assets/SelectCatalog_logo.gif')"
          fit="fill"
          style="cursor: pointer"
        />
      </router-link>
      <div>
        <router-link :to="{ path: '/' }">
          <h1 style="cursor: pointer">天智等级医院评审管理系统</h1>
        </router-link>
      </div>
    </div>
    <div class="right">
      <div>
        <el-input
          ref="keySelect"
          v-model="searchText"
          size="small"
          placeholder="请输入"
        >
          <button
            slot="append"
            class="selectButton"
            @click="Selectclick"
          >
            搜索
          </button>
        </el-input>

      </div>
      <div style="margin-left: 6px">
        <el-radio-group v-model="ShowRes" size="small" @change="changeState">
          <el-radio-button label="显示全部"  round/>
          <el-radio-button label="不显示退回资料" round/>
        </el-radio-group>
      </div>

      <!--      <el-button-group>-->
      <!--        <el-button type="primary"  size="medium" value="显示全部" @click="changeState">显示全部</el-button>-->
      <!--        <el-button type="primary" size="medium" value="不显示退回资料" @click="changeState" >不显示退回资料</el-button>-->

      <!--      </el-button-group>-->

    </div>
  </div>
</template>

<script>


import { GetRepVersion, UpdateRepVersion } from '@/api/catalog';

export default {
  name: 'Header',
  data() {
    return {
      searchText: '',
      pos: '',
      nextIndex: 0,
      timer: '',
      ShowRes: '显示全部',
      x: 0

    };
  },
  watch: {

    searchText(val) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.Selectclick();
      }, 1000);
    }
  },
  created() {
    this.GetRepVersion();
  },
  methods: {
    // 获取显示状态
    async GetRepVersion() {
      try {
        const { data } = await GetRepVersion();
        this.ShowRes = data[0].ReviewVersion;
        console.log('状态是：', this.ShowRes);
      } catch (e) {
        console.log(e);
      }
    },
    // 修改评审查阅显示状态
    async changeState() {
      this.$emit('changeCatalogID', this.ShowRes);
      try {
        const { code } = await UpdateRepVersion(
          { ReviewVersion: this.ShowRes }
        );
        if (code === 200) {
          this.$message.success('视图正在更新');
          console.log('现在状态', this.ShowRes);
          this.$router.go(0);
        }
      } catch (e) {
        console.log(e);
      }
    },
    handleClick() {
      this.id = this.id + 10;
    },
    Selectclick(flg) {
      if (!this.searchText) {
        this.pos = [];
        this.nextIndex = 0;
        const span = document.querySelectorAll('span');
        for (let i = 0; i < span.length; i++) {
          const content = span[i];
          content.style.background = '';
        }
      } else {
        this.pos = [];
        this.nextIndex = 0;
        const span = document.querySelectorAll('span');
        for (let i = 0; i < span.length; i++) {
          const content = span[i];
          content.style.background = '';
        }
        const p = document.querySelectorAll('p');
        for (let i = 0; i < p.length; i++) {
          const content = p[i];
          const text = content.innerHTML;

          if (text.indexOf(this.searchText) !== -1) {
            const cut = text.split(this.searchText);
            this.pos.push(this.getElementTop(content));
            content.innerHTML = cut.join(
              '<span style="background:#ffe89e;">' + this.searchText + '</span>'
            );
          }
        }
      }
    },
    getElementTop(element) {
      var actualTop = element.offsetTop; // 这是获取元素距父元素顶部的距离
      var current = element.offsetParent; // 这是获取父元素
      while (current !== null) {
        // 当它上面有元素时就继续执行
        actualTop += current.offsetTop; // 这是获取父元素距它的父元素顶部的距离累加起来
        current = current.offsetParent; // 继续找父元素
      }
      return actualTop;
    },
    Selectclicknext() {
    }
  }
};
</script>

<style lang="scss">
.SelectCatalogHeader {
  display: flex;
  align-self: center;
  flex-direction: column;
  flex-flow: wrap;
  background: #f2f2f2;
  box-shadow: 1px 1px 5px 1px #dfdfdf;
  min-height: 80px;

  .left {
    flex: 1;
    display: flex;
    justify-content: center;
    align-self: center;
  }

  .right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-self: center;

    .selectButton {
      border: 0px !important;
      color: white;
      background: rgb(36, 115, 183);
    }

    .selectButton:focus {
      outline: 0;
    }

    .selectButton:hover {
      cursor: pointer;
    }

    .el-input-group__append {
      background: #2473b7;
    }
  }
}
</style>
