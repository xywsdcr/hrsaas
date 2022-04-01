<template>
  <!-- 员工详情页 -->
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 登录账户设置表单 -->
            <el-form
              :rules="rules"
              :model="userInfo"
              ref="userInfo"
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
            >
              <el-form-item label="姓名：" prop="username">
                <el-input v-model="userInfo.username" style="width: 300px"></el-input>
              </el-form-item>
              <el-form-item label="密码：" prop="password2">
                <el-input v-model="userInfo.password2" style="width: 300px" type="password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <!-- 个人详情页 -->
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 动态组件 -->
            <component :is="UserComponent" />
          </el-tab-pane>
          <!-- 岗位信息 -->
          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="JobComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailsById } from "@/api/user";
import { saveUserDetailsById } from "@/api/employees";
import UserInfo from "./components/user-info.vue";
import JobInfo from "./components/job-info.vue";

export default {
  components: {
    UserInfo,
    JobInfo,
  },
  data() {
    return {
      UserComponent: "UserInfo",
      JobComponent: "JobInfo",
      userId: this.$route.params.id, //拿到路由参数
      userInfo: {
        username: "",
        password2: "", //后端读取的密码为加密后的密文 用临时变量替换
      },
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        password2: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 9, message: "密码长度6-9位", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserDetailsById();
  },
  methods: {
    async getUserDetailsById() {
      this.userInfo = await getUserDetailsById(this.userId);
    },
    saveUser() {
      this.$refs.userInfo.validate().then(async () => {
        await saveUserDetailsById({
          ...this.userInfo,
          password: this.userInfo.password2, //将密码替换为真正的密码
        });
        this.$message.success("修改成功！");
      });
    },
  },
};
</script>

<style>
</style>