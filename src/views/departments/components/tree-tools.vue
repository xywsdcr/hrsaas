<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <!-- 左侧 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 右侧 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span>
              操作
              <i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from "@/api/departments";

export default {
  props: {
    //定义传入属性
    treeNode: {
      required: true,
      type: Object,
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    operateDepts(type) {
      if (type === "add") {
        //添加子部门
        this.$emit("addDepts", this.treeNode); //告诉父组件 弹窗
      } else if (type === "edit") {
        //编辑部门
        this.$emit("editDepts", this.treeNode);
      } else {
        //删除部门
        this.$confirm("确定删除该部门吗？")
          .then(() => {
            return delDepartments(this.treeNode.id);
          })
          .then(() => {
            //删除成功 通知父组件 重新获取
            this.$emit("delDepts"); //触发自定义事件
            this.$message.success("删除成功");
          });
      }
    },
  },
};
</script>

<style>
</style>