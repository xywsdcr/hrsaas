<template>
  <el-dialog :visible="showDialog" title="新增员工" @close="btnCancel">
    <el-form ref="addEmployee" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width: 50%" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width: 50%" placeholder="请输入手机"></el-input>
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width: 50%" placeholder="请选择入职时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width: 50%" placeholder="请选择">
          <el-option
            v-for="item in employeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width: 50%" placeholder="请输入工号"></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          @focus="getDepartments"
          v-model="formData.departmentName"
          style="width: 50%"
          placeholder="请选择部门"
        ></el-input>
        <el-tree
          v-loading="loading"
          v-if="showTree"
          :data="treeData"
          :props="{ label: 'name' }"
          :default-expand-all="true"
          @node-click="selectNode"
        ></el-tree>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width: 50%" placeholder="请选择转正时间"></el-date-picker>
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils/index";
import employeeEnum from "@/api/constant/employees";
import { addEmployee } from "@/api/employees";

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      employeeEnum,
      treeData: [],
      showTree: false,
      loading: false,
      formData: {
        username: "",
        mobile: "",
        timeOfEntry: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        correctionTime: "",
      },
      rules: {
        //校验规则
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "用户姓名为1-4位",
          },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        timeOfEntry: [
          { required: true, message: "入职时间不能为空", trigger: "blur" },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        correctionTime: "",
      },
    };
  },
  methods: {
    async getDepartments() {
      this.showTree = true;
      this.loading = true;
      const { depts } = await getDepartments();
      this.treeData = tranListToTreeData(depts, "");
      this.loading = false;
    },
    selectNode(node) {
      this.formData.departmentName = node.name;
      this.showTree = false;
    },
    async btnOk() {
      try {
        //校验成功
        await this.$refs.addEmployee.validate();
        //调用新增接口
        await addEmployee(this.formData);
        //通知父组件更新数据 $parent父组件实例
        this.$parent.getEmployeeList();
        this.$parent.showDialog = false;
      } catch (error) {
        console.log(error);
      }
    },
    btnCancel() {
      this.formData = {
        username: "",
        mobile: "",
        timeOfEntry: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        correctionTime: "",
      };
      //移除校验
      this.$refs.addEmployee.resetFields();
      this.$emit("update:showDialog", false);
    },
  },
};
</script>

<style>
</style>