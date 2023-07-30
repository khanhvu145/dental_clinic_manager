<template>
    <el-card class="box-card" style="height:100%;">
        <div slot="header" class="clearfix">
            <div class="row">
                <div class="col-10">
                    <el-select v-model="data.type" placeholder="Loại chỉ định *" filterable>
                        <el-option
                            v-for="item in designationTypeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="col-2">
                    <div style="display: flex; height: 100%; align-items: center; gap: 8px;justify-content: end;">
                        <el-tooltip class="item" effect="dark" content="Xóa chỉ định" placement="top">
                            <a class="btn control-btn red" style="padding: 4px 6px;float:right;" @click="removeItem(data.key)">
                                <i class='bx bxs-trash'></i>
                            </a>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <el-upload
                    class="upload-demo"
                    action="#"
                    multiple
                    :show-file-list="true"
                    :on-change="handleChange"
                    :on-remove="handleRemove"
                    :file-list="data.fileList"
                    :auto-upload="false"
                >
                    <a class="btn control-btn blue">
                        <i class='bx bxs-cloud-upload'></i>
                        <span>Thêm file chỉ định</span>
                    </a>
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
        handleChange(file, fileList) {
            const _this = this;
            _this.data.files = fileList;
        },
        handleRemove(file) {
            const _this = this;
            _this.data.files = _this.data.files.filter(item => item.uid !== file.uid);
        },
        removeItem(key){
            const _this = this;
            _this.$emit('removeDesignation', key);
        },
        handlePreview(file) {
            const _this = this;
            var url = URL.createObjectURL(file.raw);
            window.open(url, '_blank');
        }
    }
}
</script>

<style scoped>
.upload-demo{
    text-align: center;
}
</style>