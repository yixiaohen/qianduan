<template />

<script>
import { PreviewFile } from '@/api/Article';

export default {
  mounted() {
    this.previewFile(this.$route.query.id);
  },
  methods: {
    async previewFile(val) {
      /* 资料预览 */
      const { data } = await PreviewFile({ Title: val });
      this.$nextTick(() => {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = data;
        document.body.appendChild(link);
        link.click();
      });
    }
  }
};
</script>

<style>
</style>
