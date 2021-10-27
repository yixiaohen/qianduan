<template>
  <div id="content" style="width: 100%">
    <br>
    <canvas
      id="canvas"
      ref="canvas"
      style="
        width: 1500px;
        height: 1000px;
        background-color: rgb(255, 255, 255);
      "
    />
  </div>
</template>

<script>
export default {
  name: 'Jtopo',
  props: {
    fishboneData: {
      type: Object
    }
  },
  mounted() {
    this.initTopo();
  },
  methods: {
    initTopo() {
      const canvas = this.$refs.canvas;
      if (this.fishboneData) {
        const mfb = new MakFishBone(canvas, { data: this.fishboneData });
        mfb.start();
      }
    }
  }
};
</script>
<style lang="scss">
#content {
  height: calc(100vh - 100px);
}
</style>
