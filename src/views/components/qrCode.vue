<template>
  <div id="qrCode" ref="qrCodeDiv" />
</template>

<script>
import QRCode from 'qrcodejs2';

export default {
  name: 'QrCode',
  props: ['text', 'width'],
  data() {
    return {};
  },
  watch: {
    text() {
      this.bindQRCode();
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.bindQRCode();
    });
  },
  methods: {
    bindQRCode: function() {
      this.$refs.qrCodeDiv.innerHTML = '';
      new QRCode(this.$refs.qrCodeDiv, {
        text: this.text,
        width: 200,
        height: 200,
        colorDark: '#333333', // 二维码颜色
        colorLight: '#ffffff', // 二维码背景色
        correctLevel: QRCode.CorrectLevel.L // 容错率，L/M/H
      });
    }
  }
};
</script>
