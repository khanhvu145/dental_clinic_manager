<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <div class="row">
                <div class="col-md-10">
                    <el-select v-model="data.type" placeholder="Loại chỉ định *" filterable>
                        <el-option
                            v-for="item in designationTypeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="col-md-2">
                    <a class="btn control-btn red" style="padding: 4px 6px;float:right;" @click="removeItem(data.key)">
                        <i class='bx bxs-trash'></i>
                    </a>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <el-upload 
                    :class="'designation-file-upload ' + data.key"
                    action="#" 
                    :auto-upload="false"
                    list-type="picture-card" 
                    :multiple="true" 
                    :on-change="handleChange" 
                    :file-list="data.fileList"
                >
                    <i slot="default" class='bx bxs-camera-plus'></i>
                    <!-- <i slot="default" class="el-icon-plus"></i> -->
                    <div slot="file" slot-scope="{file}" class="fileUploadDiv">
                        <img class="el-upload-list__item-thumbnail" :src="handleFile(file)" alt="">
                        <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-preview" @click="handlePreview(file)">
                                <el-tooltip class="item" effect="light" content="Xem" placement="top-start">
                                    <i class="el-icon-view"></i>
                                </el-tooltip>
                            </span>
                            <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                                <el-tooltip class="item" effect="light" content="Xóa" placement="top-end">
                                    <i class="el-icon-delete"></i>
                                </el-tooltip>
                            </span>
                        </span>
                    </div>
                </el-upload>
            </div>
        </div>
    </el-card>
</template>

<script>
export default {
    props: {
      data: { type: Object },
      designationTypeData: { type: Array },
    },
    data() {
      return {

      };
    },
    created() {
      const _this = this;
    },
    methods: {
        removeItem(key){
            const _this = this;
            _this.$emit('removeDesignation', key);
        },
        handleRemove(file) {
            const _this = this;
            _this.data.fileList = _this.data.fileList.filter(item => item.uid !== file.uid);
        },
        handleChange(file, fileList){
            const _this = this;
            _this.data.fileList = fileList;
        },
        handlePreview(file){
            const _this = this;
            var url = URL.createObjectURL(file.raw);
            window.open(url, '_blank');
        },
        handleFile(file){
            const _this = this;
            if(!file.raw.type.includes('image')) {
                return '/images/file.png';
            }
            else {
                var url = URL.createObjectURL(file.raw);
                return url;
            }
        }
    }
}
</script>

<style>
.fileUploadDiv{
    width:100%;
    height:100%;
    overflow: hidden;
    position: relative;
}
.el-upload-list--picture-card .el-upload-list__item-thumbnail{
    width: 100%;
    min-width: 100%;
    min-height: 100%;
    object-fit: cover;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.el-upload--picture-card{
    position: relative;
}
.el-upload--picture-card i{
    font-size: 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>