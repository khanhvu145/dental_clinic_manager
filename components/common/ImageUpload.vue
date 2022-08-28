<template>
	<div class="row">
        <div class="col-md-12" style="display: flex; justify-content: center;">
            <el-upload
                :class="imageUrl || value ? '' : 'avatar-uploader'"
                :auto-upload="false"
                :multiple="false"
                action="#"
                :show-file-list="false"
                :on-change="handleChange"
            >
                <img v-if="imageUrl || value" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
		    </el-upload>
        </div>
        <div class="col-md-12" style="display: flex; justify-content: center;" v-if="isImage">
            <button type="button" class="control-btn red" style="padding: 6px 8px;" @click="clearImage()">
                <i class='bx bx-x'></i>
            </button>
        </div>
	</div>
</template>

<script>
import { cloneDeep } from 'lodash';
export default {
    props: {
      value: { type: String },
      type: { type: String },
    },
    data() {
      return {
        imageUrl: '',
        isImage: false
      };
    },
    watch: {
      value() {
        this.$emit('input', this.value);
      },
    },
    created() {
      const _this = this;
      _this.imageUrl = cloneDeep(_this.value);
      _this.isImage = _this.imageUrl ? true : false;
    },
    methods: {
      handleChange(file, fileList) {
          const _this = this;
          const imageType = ['image/png', 'image/jpeg'].includes(file.raw.type);
          const isLt5M = file.raw.size / 1024 / 1024 < 5;

          if (!imageType) return this.$message.error('Hình ảnh phải ở định dạng JPG/PNG!');
          if (!isLt5M) return this.$message.error('Kích thước hình ảnh không được vượt quá 5MB!');

          _this.$emit('input', file.raw);
          _this.imageUrl = URL.createObjectURL(file.raw);
          _this.isImage = true;
      },
      clearImage(){
          const _this = this;
          _this.$emit('input', '');
          _this.imageUrl = '';
          _this.isImage = false;
      }
    }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 200px;
    line-height: 200px;
    text-align: center;
  }
  .avatar {
    width: 80%;
    min-width: 80%;
    min-height: 100%;
    object-fit: cover;
  }
</style>