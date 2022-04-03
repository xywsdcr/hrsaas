<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 左边 -->
          <el-tab-pane label="角色管理">
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                type="primary"
                size="small"
                @click="showDialog=true"
              >新增角色</el-button>
            </el-row>
            <el-table border :data="list">
              <el-table-column prop="id" label="序号" type="index" width="120" align="center"></el-table-column>
              <el-table-column prop="name" label="角色名" width="240" align="center"></el-table-column>
              <el-table-column prop="description" label="描述" align="center"></el-table-column>
              <el-table-column prop="name" label="操作" align="center">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <el-pagination
                layout="prev,pager,next"
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="changePage"
              ></el-pagination>
            </el-row>
          </el-tab-pane>
          <!-- 右边 -->
          <el-tab-pane label="公司信息">
            <el-alert
              type="info"
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              :closable="false"
              :show-icon="true"
            ></el-alert>
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" disabled style="width: 400px"></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width: 400px"></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formData.companyPhone" disabled style="width: 400px"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width: 400px"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  disabled
                  type="textarea"
                  :row="3"
                  style="width: 400px"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 弹窗组件 -->
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" label-width="120px" :model="roleForm" :rules="rules">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 分配权限弹窗 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <!-- 权限是树形 -->
      <!-- check-strictly表示父子选项框是否不关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        ref="permissionTree"
        :data="premissionData"
        :props="defaultProps"
        :default-expand-all="true"
        :show-checkbox="true"
        :check-strictly="true"
        node-key="id"
        :default-checked-keys="selectCheck"
      ></el-tree>
      <!-- 按钮 -->
      <el-row type="flex" justify="center" slot="footer">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOk">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  updateRole,
  getRoleDetail,
  addRole,
  assignPerm,
} from "@/api/setting";
import { getPermissionList } from "@/api/permission";
import { tranListToTreeData } from "@/utils";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      list: [], //接数据
      page: {
        //放置页码相关
        page: 1,
        pagesize: 5,
        total: 0, //数据总数
      },
      formData: {
        //公司信息
      },
      premissionData: [], //权限数组
      showDialog: false, //控制弹窗显示
      showPermDialog: false, //控制权限分配弹窗
      selectCheck: [], //记录当前权限点的标识
      defaultProps: {
        //定义显示字段的名称 子属性的字段名称
        label: "name",
      },
      roleForm: {
        name: "",
        description: "",
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
      roleId: null, //记录当前角色id
    };
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo();
  },
  computed: {
    ...mapGetters(["companyId"]),
  },
  methods: {
    async getRoleList() {
      //获取角色信息
      const { total, rows } = await getRoleList(this.page);
      this.page.total = total;
      this.list = rows;
    },
    changePage(newPage) {
      //分页 页码改变重新获取数据
      this.page.page = newPage;
      this.getRoleList();
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId);
    },
    async deleteRole(id) {
      //删除角色
      try {
        await this.$confirm("确认删除该角色吗？");
        await deleteRole(id);
        this.getRoleList();
        this.$message.success("删除角色成功");
      } catch (error) {
        console.log(error);
      }
    },
    async editRole(id) {
      //编辑角色
      this.roleForm = await getRoleDetail(id);
      this.showDialog = true;
    },
    async assignPerm(id) {
      //获取权限点
      const result = await getPermissionList(); //所有权限点
      this.premissionData = tranListToTreeData(result, "0"); //转化为树形
      this.roleId = id;
      // 获取当前id的权限点
      const { permIds } = await getRoleDetail(id);
      this.selectCheck = permIds; //把角色的权限id赋值
      this.showPermDialog = true;
    },
    //编辑弹窗
    async btnOk() {
      try {
        await this.$refs.roleForm.validate();
        if (this.roleForm.id) {
          //有id为编辑
          await updateRole(this.roleForm);
        } else {
          //新增
          await addRole(this.roleForm);
        }
        this.getRoleList();
        this.$message.success("编辑成功");
        this.showDialog = false;
      } catch (error) {
        console.log("校验失败");
      }
    },
    btnCancel() {
      this.roleForm = { name: "", description: "" };
      this.$refs.roleForm.resetFields(); //移除校验
      this.showDialog = false;
    },
    //分配权限弹窗
    async btnPermOk() {
      await assignPerm({
        permIds: this.$refs.permissionTree.getCheckedKeys(),
        id: this.roleId,
      });
      this.$message.success("分配权限成功");
      this.showPermDialog = false;
    },
    btnPermCancel() {
      this.selectCheck = []; //重置数据
      this.showPermDialog = false;
    },
  },
};
</script>

<style>
</style>