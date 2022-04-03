<template>
  <div>
    <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
      <!-- 多选框组 -->
      <el-checkbox-group v-model="roleIds">
        <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <!-- 定义footer插槽 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList } from "@/api/setting";
import { getUserDetailsById } from "@/api/user";
import { assignRoles } from "@/api/employees";

export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
    },
    userId: {
      //当前用户id
      type: String,
      default: "",
      required: true,
    },
  },
  data() {
    return {
      list: [], //存储所有角色
      roleIds: [], //负责存储用户所拥有的角色
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 });
      this.list = rows;
    },
    //取到用户所拥有的角色
    async getUserDetailsById(id) {
      // props传值是异步的 不能用this.userId
      const { roleIds } = await getUserDetailsById(id);
      this.roleIds = roleIds;
    },
    btnCancel() {
      this.roleIds = []; //重置
      this.$emit("update:showRoleDialog", false);
    },
    async btnOk() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds });
      //关闭弹窗
      this.$emit("update:showRoleDialog", false);
    },
  },
};
</script>

<style>
</style>