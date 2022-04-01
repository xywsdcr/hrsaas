<template>
  <UploadExcel :on-success="success"></UploadExcel>
</template>

<script>
import { importEmployee } from "@/api/employees";

export default {
  methods: {
    async success({ header, results }) {
      //数据为中文 转换为英文
      const userRelations = {
        入职日期: "timeOfEntry",
        手机号: "mobile",
        姓名: "username",
        转正日期: "correctionTime",
        工号: "workNumber",
      };
      let newArr = results.map((item) => {
        let userInfo = {};
        Object.keys(item).forEach((key) => {
          //将原来中文对应的值 赋给英文对应的值
          if (
            userRelations[key] === "timeOfEntry" ||
            userRelations[key] === "correctionTime"
          ) {
            //后端要求转换为时间类型
            userInfo[userRelations[key]] = new Date(
              this.formatDate(item[key], "/")
            );
          } else {
            userInfo[userRelations[key]] = item[key];
          }
        });
        return userInfo;
      });
      await importEmployee(newArr);
      this.$message.success("导入Excel成功!");
      this.$router.back();
    },
    //转化Excel的时间格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1);
      time.setYear(time.getFullYear() - 70);
      const year = time.getFullYear() + "";
      const month = time.getMonth() + 1 + "";
      const date = time.getDate() - 1 + "";
      if (format && format.length === 1) {
        return year + format + month + format + date;
      }
      return (
        year +
        (month < 10 ? "0" + month : month) +
        (date < 10 ? "0" + date : date)
      );
    },
  },
};
</script>

<style>
</style>