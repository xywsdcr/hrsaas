<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <el-button slot="after" type="primary" size="small" @click="addPermission(1, '0')">添加权限</el-button>
      </page-tools>
      <!-- 权限表 树形结构-->
      <el-table border :data="list" row-key="id">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column align="center" label="标识" prop="code"></el-table-column>
        <el-table-column align="center" label="描述" prop="description"></el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <!-- 添加按钮只在访问权层级显示 -->
            <el-button v-if="row.type === 1" type="text" @click="addPermission(2, row.id)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增和编辑弹窗 -->
    <el-dialog :visible="showDialog" :title="showText" @close="btnCancel">
      <el-form ref="permForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开关">
          <el-switch v-model="formData.enVisible" inactive-value="0" active-value="1" />
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center" slot="footer">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  updatePermission,
  addPermission,
  getPermissionDetail,
  delPermission,
  getPermissionList,
} from "@/api/permission";
import { tranListToTreeData } from "@/utils";

export default {
  data() {
    return {
      list: [],
      formData: {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      },
      showDialog: false,
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "权限标识不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    showText() {
      return this.formData.id ? "编辑权限" : "新增权限";
    },
  },
  created() {
    this.getPermissionList();
  },
  methods: {
    async getPermissionList() {
      //将数据转化为树形结构
      this.list = tranListToTreeData(await getPermissionList(), "0");
    },
    delPermission(id) {
      this.$confirm("确认删除该权限点吗")
        .then(() => {
          return delPermission(id);
        })
        .then(() => {
          this.$message.success("删除成功");
          this.getPermissionList();
        });
    },
    addPermission(type, pid) {
      this.formData.type = type;
      this.formData.pid = pid;
      this.showDialog = true;
    },
    async editPermission(id) {
      this.formData = await getPermissionDetail(id);
      this.showDialog = true;
    },
    btnOk() {
      this.$refs.permForm
        .validate()
        .then(() => {
          //校验成功
          if (this.formData.id) {
            return updatePermission(this.formData);
          }
          return addPermission(this.formData);
        })
        .then(() => {
          this.$message.success("添加成功");
          this.getPermissionList();
          this.showDialog = false;
        });
    },
    btnCancel() {
      this.formData = {
        name: "",
        code: "",
        description: "",
        type: "",
        pid: "",
        enVisible: "0",
      };
      //重置表单数据
      this.$refs.permForm.resetFields();
      this.showDialog = false;
    },
  },
};
</script>

<style>
</style>