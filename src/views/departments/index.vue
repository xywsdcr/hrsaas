<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构 头部-->
      <el-card class="tree-card">
        <treeTools :treeNode="company" :isRoot="true" @addDepts="addDepts"></treeTools>
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <treeTools
            slot-scope="{ data }"
            :treeNode="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          ></treeTools>
        </el-tree>
      </el-card>
    </div>
    <addDept ref="addDept" :showDialog.sync="showDialog" :treeNode="node" @addDept="getDepartments"></addDept>
  </div>
</template>

<script>
import treeTools from "./components/tree-tools.vue";
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils";
import addDept from "./components/add-dept.vue";

export default {
  components: {
    treeTools,
    addDept,
  },
  data() {
    return {
      company: { name: "责任有限公司", manager: "负责人", id: "" }, //头部数据
      departs: [],
      defaultProps: {
        label: "name",
      },
      showDialog: false, //默认不显示添加弹窗
      node: null, //记录当前点击的部门节点
    };
  },
  created() {
    this.getDepartments();
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments(); //调用获取组织架构接口
      this.departs = tranListToTreeData(result.depts, "");
      //console.log(result);
    },
    addDepts(node) {
      //tree-tools组件触发的添加方法
      this.showDialog = true;
      this.node = node;
    },
    editDepts(node) {
      this.showDialog = true;
      this.node = node;
      //调用获取部门详情的接口
      this.$refs.addDept.getDepartDetail(node.id);
    },
  },
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>