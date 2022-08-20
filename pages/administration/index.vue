<template>
    <div class="wrapper">
        <div class="content">
            <div class="container-fluid">
                <form class="row" v-on:submit.prevent="submitForm">
                    <div class="col-md-3 mt-4">
                        <ImageUpload :value="formData.img" @input="
										(newValue) => {
											formData.imageFile = newValue;
										}
									"></ImageUpload>
                    </div>
                    <div class="col-md-3 mt-4">
                        <a
                            @click="submitForm"
                            type="submit"
                            class="btn btn-primary waves-effect waves-light mr-1 text-white"
                        >
                            Lưu lại
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import ImageUpload from '@/components/common/ImageUpload.vue';
import { cloneDeep, debounce } from 'lodash';
import buildFormData from '@/utils/buildFormData';
import axios from 'axios';
export default {
    layout: 'admin',
    name: 'Administration',
    components: { ImageUpload },
    data () {
        return {
            formData: {
                img : '',
                imageFile : null,
            }
        }
    },
    methods: {
		submitForm: debounce(async function () {
			const _this = this;
            var oldData = cloneDeep(_this.formData);
            var newData = new FormData();
            buildFormData(newData, oldData);
            console.log(newData);
            const data = await axios.post('http://localhost:8000/api/employee/uploadFile', newData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });
            if(data){
                console.log(data);
                _this.$message({
                    message: 'Tạo thành công',
                    type: 'success',
                });
            }
            else{
                _this.$message.error('Tạo thất bại');
            }
		}, 500),
	},
}
</script>