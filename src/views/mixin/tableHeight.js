export default {
  data() {
    return {
      resizeHeight: 740
    };
  },
  mounted() {
    window.addEventListener('load', this.$_resizeHeight);
    window.addEventListener('resize', this.$_resizeHeight);
  },
  beforeDestroy() {
    window.removeEventListener('load', this.$_resizeHeight);
    window.removeEventListener('resize', this.$_resizeHeight);
  },
  methods: {
    $_resizeHeight() {
      const html_height = document.querySelector('html').clientHeight;
      const fixed_header = document.querySelector('.fixed-header') == null ? '' : document.querySelector('.fixed-header').offsetHeight;
      const card_header = document.querySelector('.el-card__header') == null ? '' : document.querySelector('.el-card__header').offsetHeight;
      if (fixed_header && fixed_header) {
        this.resizeHeight = html_height - fixed_header - card_header - 66;
      }
    }
  }
};
