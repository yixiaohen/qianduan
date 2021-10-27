<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive
        :include="cachedViews"
        :exclude="[
          'EvaluationThree',
          'EvaluationOne',
          'EvaluationTwo',
          'Article',
          'KMQualitySupervision',
          'AdverseEventsReport',
          'AdverseEventsMine',
        ]"
      >
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
