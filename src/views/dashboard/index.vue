<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <PageTools :showBefore="true">
      <span slot="before">sdfdfgd</span>
      <el-button slot="after" type="primary">导入excel</el-button>
    </PageTools>
    <ImageUpload></ImageUpload>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
