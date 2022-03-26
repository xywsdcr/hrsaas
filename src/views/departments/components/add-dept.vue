<template>
  <!-- 增加部门弹窗组件dialog -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单数据 -->
    <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          @focus="getEmployeeSimple"
          v-model="formData.manager"
          style="width:80%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in people"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width:80%"
          placeholder="1-300个字符"
          type="textarea"
          :row="3"
        />
      </el-form-item>
    </el-form>
    <!-- 确定取消 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updateDepartments,
} from "@/api/departments"; //获取部门信息接口
import { getEmployeeSimple } from "@/api/employees"; //获取员工简单列表接口

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    treeNode: {
      type: Object,
      default: null,
    },
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑部门" : "新增部门";
    },
  },
  methods: {
    async getEmployeeSimple() {
      this.people = await getEmployeeSimple();
    },
    //获取部门详情方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id);
    },
    btnOk() {
      this.$refs.deptForm.validate(async (checkAccess) => {
        if (checkAccess) {
          //校验通过
          if (this.formData.id) {
            //有id为编辑 调用保存编辑数据接口
            await updateDepartments(this.formData);
          } else {
            //无id 调用新增部门接口
            await addDepartments({ ...this.formData, pid: this.treeNode.id });
          }
          //告诉父组件更新数据
          this.$emit("addDept");
          //此时修改showDialog关闭弹窗
          this.$emit("update:showDialog", false);
        }
      });
    },
    btnCancel() {
      this.formData = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      };
      //关闭弹窗
      this.$emit("update:showDialog", false);
      //清除校验数据
      this.$refs.deptForm.resetFields();
    },
  },
  data() {
    //检查部门名称是否重复
    const checkNameRepeat = async (rule, value, callback) => {
      //value和同级部门比较 不能重复
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.formData.id) {
        //有id编辑模式校验
        isRepeat = depts
          .filter(
            (item) =>
              item.pid === this.treeNode.pid && item.id !== this.treeNode.id
          )
          .some((item) => item.name === value);
      } else {
        //无id新增模式校验
        isRepeat = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value); //如果为true 则找到重复
      }
      isRepeat ? callback(new Error(`同级部门下已经存在${value}`)) : callback();
    };

    //检查部门编码是否重复
    const checkCodeRepeat = async (rule, value, callback) => {
      //要求编码和所有部门编码不重复
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.formData.id) {
        //有id编辑模式校验
        isRepeat = depts
          .filter((item) => item.id !== this.treeNode.id)
          .some((item) => item.code === value && value);
      } else {
        //无id新增模式校验
        //由于历史数据可能没有code 加上value不能为空条件
        isRepeat = depts.some((item) => item.code === value && value);
      }
      isRepeat
        ? callback(new Error(`组织架构下已经存在${value}编码`))
        : callback();
    };

    return {
      formData: {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      },
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称长度为1-50字符",
            trigger: "blur",
          },
          { trigger: "blur", validator: checkNameRepeat },
        ],
        code: [
          { required: true, message: "部门编号不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编号长度为1-50字符",
            trigger: "blur",
          },
          { trigger: "blur", validator: checkCodeRepeat },
        ],
        manager: [
          { required: true, message: "负责人不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门负责人长度为1-50字符",
            trigger: "blur",
          },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            min: 1,
            max: 300,
            message: "部门介绍长度为1-50字符",
            trigger: "blur",
          },
        ],
      },
      people: [],
    };
  },
};
</script>

<style>
</style>