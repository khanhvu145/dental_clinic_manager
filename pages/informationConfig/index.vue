<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Cấu hình thông tin phòng khám</div>
                    </div>
                </div>
                <div class="row mt-4 mb-4">
                    <div class="col-md-4 col-lg-3 mt-4">
                        <ImageUpload v-if="!dataLoading || data.imageFile" :value="data.img" @input="(newValue) => {data.imageFile = newValue;}"></ImageUpload>
                    </div>
                    <div class="col-md-8 col-lg-6">
                        <form v-loading="dataLoading" v-on:submit.prevent="submitForm">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="col-form-label">Tên phòng khám *</div>
                                    <el-input 
                                        name="name"
                                        placeholder="Tên phòng khám"
                                        v-model="data.name"
                                    ></el-input>
                                </div>
                                <div class="col-md-6">
                                    <div class="col-form-label">Số điện thoại</div>
                                    <el-input
                                        name="phone"
                                        placeholder="Số điện thoại"
                                        v-model="data.phone"
                                    ></el-input>
                                </div>
                                <div class="col-md-6">
                                    <div class="col-form-label">Email</div>
                                    <el-input
                                        name="email"
                                        placeholder="Email"
                                        v-model="data.email"
                                    ></el-input>
                                </div>
                                <div class="col-md-6">
                                    <div class="col-form-label">Địa chỉ</div>
                                     <el-input
                                        name="address"
                                        placeholder="Địa chỉ"
                                        v-model="data.address"
                                    ></el-input>
                                </div>
                                <div class="col-md-6">
                                    <div class="col-form-label">Website</div>
                                     <el-input
                                        name="website"
                                        placeholder="Website"
                                        v-model="data.website"
                                    ></el-input>
                                </div>
                            </div>
                            <div class="row mt-3 pt-3">
                                <div class="col-md-12" style="text-align:right;">
                                    <button
                                        v-if="checkRight('create') || checkRight('update')"
                                        type="button" 
                                        class="control-btn green" 
                                        @click="submitForm"
                                    >
                                        <i class='bx bx-save' ></i>
                                        <span>Lưu cấu hình</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <el-empty description="Bạn không có quyền !!"></el-empty>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { debounce, map, cloneDeep, intersection, filter, find, forEach } from 'lodash';
import InformationConfig from '@/models/tw_InformationConfig';
import ImageUpload from '@/components/common/ImageUpload.vue';
import buildFormData from '@/utils/buildFormData';
export default {
    components: { ImageUpload },
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data() {
        return {
            data: new InformationConfig(),
            dataLoading: true
        }
    },
    async created() {
        const _this = this;
        _this.getData();
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['informationConfig.all', 'informationConfig.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        async getData(){
            const _this = this;
            await _this.$axios.$get('/api/informationConfig/getData').then(
                (response) => {
					_this.data = (response.data.length > 0 && response.data != null) ? response.data[0] : new InformationConfig();
                    _this.dataLoading = false;
				},
				(error) => {
					console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: error,
					});
                    _this.dataLoading = false;
				}
            );
        },
        submitForm: debounce(async function (){
            const _this = this;
            _this.dataLoading = true;
            try{
                 var oldData = cloneDeep(_this.data);
                 var newData = new FormData();
                 buildFormData(newData, oldData);
                const data = await _this.$axios.$post('/api/informationConfig/createUpdate', newData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (data.success) {
                    _this.$message({
                        message: data.message,
                        type: 'success',
                    });
                    _this.getData();
                } else {
                    _this.$message.error(data.error);
                }
            }
            catch(error){
                console.log('Error: ', error);
                _this.$message({
                    type: 'error',
                    message: error,
                });
            }
            _this.dataLoading = false;
        })
    }
}
</script>