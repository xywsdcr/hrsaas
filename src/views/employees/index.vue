<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :showBefore="true">
        <!-- 左侧 -->
        <span slot="before">共{{ page.total }}条记录</span>
        <!-- 右侧 -->
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 表格组件 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column type="index" label="序号" sortable />
          <el-table-column prop="username" label="姓名" sortable />
          <el-table-column label="头像" align="center" width="120px">
            <!-- 头像插槽 -->
            <template v-slot="{ row }">
              <img
                :src="row.staffPhoto"
                v-imageerror="require('@/assets/common/head.jpg')"
                alt
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                @click="showQrCode(row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column
            prop="formOfEmployment"
            label="聘用形式"
            :formatter="formatEmployment"
            sortable
          />
          <el-table-column prop="departmentName" label="部门" sortable />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable>
            <!-- 格式化时间 -->
            <template v-slot="{ row }">{{ row.timeOfEntry | formatDate }}</template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable>
            <template v-slot="{ row }">
              <el-switch :value="row.enableState===1"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="assignRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            :current-page="page.page"
            :page-size="page.size"
            :total="page.total"
            @current-change="changePage"
            layout="prev, pager, next"
          ></el-pagination>
        </el-row>
      </el-card>
    </div>
    <!-- 新增组件弹窗 -->
    <addEmployee :show-dialog.sync="showDialog"></addEmployee>
    <!-- 二维码 -->
    <el-dialog title="二维码" :visible.sync="showQrcodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas"></canvas>
      </el-row>
    </el-dialog>
    <!-- 分配角色组件 -->
    <AssignRole ref="assignRole" :showRoleDialog.sync="showRoleDialog" :userId="userId"></AssignRole>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "@/api/employees";
import employeeEnum from "@/api/constant/employees";
import addEmployee from "./components/add-employee.vue";
import { formatDate } from "@/filters";
import QrCode from "qrcode";
import AssignRole from "./components/assign-role.vue";

export default {
  data() {
    return {
      list: [], //接收员工列表
      page: {
        //分页信息
        page: 1,
        size: 10,
        total: 0,
      },
      loading: false, //显示遮罩层
      showDialog: false,
      showQrcodeDialog: false,
      showRoleDialog: false, //显示分配角色弹窗
      userId: null,
    };
  },
  components: {
    addEmployee,
    AssignRole,
  },
  created() {
    this.getEmployeeList();
  },
  methods: {
    async getEmployeeList() {
      this.loading = true;
      const { total, rows } = await getEmployeeList(this.page);
      this.page.total = total;
      this.list = rows;
      this.loading = false;
    },
    changePage(newPage) {
      this.page.page = newPage;
      this.getEmployeeList();
    },
    formatEmployment(row, column, cellValue, index) {
      //格式化聘用形式
      const obj = employeeEnum.hireType.find((item) => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
    async delEmployee(id) {
      try {
        await this.$confirm("确定删除该员工吗？");
        await delEmployee(id);
        this.$message.success("删除员工成功！");
        this.getEmployeeList();
      } catch (error) {
        console.log("点击了取消");
      }
    },
    exportData() {
      //导出excel
      const headers = {
        //表头
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      //懒加载导出excel
      import("@/vendor/Export2Excel").then(async (excel) => {
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total,
        });
        const data = this.formatJson(headers, rows);
        //复杂表头
        const multiHeader = [["姓名", "主要信息", "", "", "", "", "部门"]];
        //合并单元格
        const merges = ["A1:A2", "B1:F1", "G1:G2"];
        excel.export_json_to_excel({
          header: Object.keys(headers),
          multiHeader,
          merges,
          data,
          filename: "员工列表",
        });
      });
    },
    //对后端数据格式化
    formatJson(headers, rows) {
      return rows.map((item) => {
        return Object.keys(headers).map((key) => {
          if (
            headers[key] === "timeOfEntry" ||
            headers[key] === "correctionTime"
          ) {
            //格式化时间
            return formatDate(item[headers[key]]);
          } else if (headers[key] === "formOfEmployment") {
            const obj = employeeEnum.hireType.find(
              (obj) => obj.id === item[headers[key]]
            );
            return obj ? obj.value : "未知";
          }
          return item[headers[key]];
        });
      });
    },
    showQrCode(url) {
      if (url) {
        this.showQrcodeDialog = true;
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url); //将地址转化为二维码
        });
      } else {
        this.$message.warning("该用户未上传头像");
      }
    },
    async assignRole(id) {
      this.userId = id;
      await this.$refs.assignRole.getUserDetailsById(id); //调用子组件方法 传入id
      this.showRoleDialog = true;
    },
  },
};
</script>

<style>
</style>