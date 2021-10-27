<template>
  <!-- /* 燕尾流程图 */ -->
  <el-row class="flow">
    <div class="step-container">
      <!-- step代表选中时的样式, step2未选中的样式-->
      <div
        v-for="(item, index) in flowTitle"
        :key="index"
        :class="[
          index == 0 && cssIndex == 0
            ? 'step'
            : index == cssIndex
              ? 'step'
              : 'step2',
        ]"
        @click="opt(item, index)"
      >
        <span>{{ item }}</span>
      </div>
    </div>
  </el-row>
</template>
<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return [1, 2, 3, 4, 5];
      }
    }
  },
  data() {
    return {
      flowTitle: this.value,
      cssIndex: 0,
      checkedData: ''
    };
  },
  methods: {
    opt(item, indexs) {
      this.cssIndex = indexs;
      this.checkedData = item;
      this.$emit('checked', { title: this.checkedData, index: this.cssIndex });
    }
  }
};
</script>
<style lang="scss">
.flow {
  div.step-container {
    display: flex;
    overflow: hidden;
    align-items: center;
  }

  div.step-container div.step,
  div.step-container div.step2 {
    background-color: rgb(52, 98, 147);
    position: relative;
    display: inline-block;
    flex-basis: 120px;
    height: 20px;
    padding: 0px;
    text-align: center;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      color: white;
    }
  }

  div.step-container div.step:after,
  div.step-container div.step2:after {
    content: '';
    position: absolute;
    right: -10px;
    background: rgb(52, 98, 147);
    width: 20px;
    height: 20px;
    transform: rotate(-45deg);
    z-index: 1;
    box-shadow: 3px 3px 0px 0px white;
  }

  div.step-container div.step2 {
    background-color: rgb(199, 205, 218);
  }

  div.step-container div.step2:after {
    background: rgb(199, 205, 218);
  }
}
</style>
