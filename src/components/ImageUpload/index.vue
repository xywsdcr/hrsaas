<template>
  <div>
    <el-upload
      list-type="picture-card"
      action="#"
      :limit="1"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="fileChange"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :http-request="upload"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress style="width: 180px" :percentage="percent" v-if="showProgress"></el-progress>
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imageUrl" alt style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
//腾讯云cos包
import COS from "cos-js-sdk-v5";
// 实例化cos
const cos = new COS({
  SecretId: "AKIDPdbJlwqTqwpRnsgJsDI5brqYy81cw0nJ",
  SecretKey: "GFzTfaGfnfHcgTzFEwNYS5QVKs98rISL",
});

export default {
  data() {
    return {
      showDialog: false,
      imageUrl: "",
      //当前上传图片的uid
      currentFileUid: null,
      fileList: [],
      percent: 0, //上传进度百分比
      showProgress: false, //显示进度条
    };
  },
  methods: {
    preview(file) {
      //点击预览
      this.imageUrl = file.url;
      this.showDialog = true;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    beforeUpload(file) {
      //上传之前格式检查
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.some((item) => item === file.type)) {
        this.$message.error("图片格式只能为jpeg,gif,bmp,png！");
        return false;
      }
      //限制图片大小
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.$message.error("图片不能大于5！");
        return false;
      }
      this.currentFileUid = file.uid;
      this.showProgress = true;
      return true;
    },
    //上传
    upload(params) {
      if (params.file) {
        cos.putObject(
          {
            Bucket: "immortalxu-1310636191", // 存储桶
            Region: "ap-nanjing", // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: "STANDARD", // 上传的模式类型 直接默认 标准模式即可
            onProgress: (params) => {
              //上传进度
              this.percent = params.percent * 100;
            },
          },
          (err, data) => {
            // data返回数据之后 应该如何处理
            if (!err && data.statusCode === 200) {
              //文件上传成功
              this.fileList = this.fileList.map((item) => {
                if (item.uid === this.currentFileUid) {
                  return { url: "http://" + data.Location, upload: true };
                  //upload为上传完成标记
                }
                return item;
              });
              //重置进度条
              this.showProgress = false;
              this.percent = 0;
            }
          }
        );
      }
    },
    fileChange(file, fileList) {
      this.fileList = fileList.map((item) => item);
    },
  },
  computed: {
    fileComputed() {
      //true表示不应该再显示加号
      return this.fileList.length === 1;
    },
  },
};
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>