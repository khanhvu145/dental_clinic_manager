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
                    <div class="col-md-4 col-lg-3 mt-4" style="pointer-events:none;">
                        <ImageUpload v-if="!dataLoading || data.imageFile" :value="data.img" @input="(newValue) => {data.imageFile = newValue;}"></ImageUpload>
                    </div>
                    <div class="col-md-8 col-lg-6">
                        <div v-loading="dataLoading">
                            <div class="row" style="pointer-events:none;">
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
                                    <!-- <button
                                        v-if="checkRight('create') || checkRight('update')"
                                        type="button" 
                                        class="control-btn green" 
                                        @click="submitForm"
                                    >
                                        <i class='bx bx-save' ></i>
                                        <span>Lưu cấu hình</span>
                                    </button> -->
                                    <button
                                        v-if="checkRight('create') || checkRight('update')"
                                        type="button" 
                                        class="control-btn green" 
                                        @click="openDialogDrawer(data)"
                                    >
                                        <i class='bx bxs-edit-alt'></i>
                                        <span>Chỉnh sửa</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <el-drawer
                    title="Chỉnh sửa"
                    :visible.sync="dialogDrawer.visible"
                    direction="rtl"
                    custom-class="demo-drawer"
                    ref="drawer"
                    :size="dialogDrawer.width"
                >
                    <div class="col-md-12" style="height:100%;">
                        <div class="d-flex flex-column justify-content-between" style="height:100%;">
                            <div class="demo-drawer__content">
                                <form class="col-md-12" v-on:submit.prevent="submitForm">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="col-form-label">Tên phòng khám *</div>
                                            <el-input 
                                                name="name"
                                                placeholder="Tên phòng khám"
                                                v-model="dialogDrawer.data.name"
                                            ></el-input>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="col-form-label">Số điện thoại</div>
                                            <el-input
                                                name="phone"
                                                placeholder="Số điện thoại"
                                                v-model="dialogDrawer.data.phone"
                                            ></el-input>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="col-form-label">Email</div>
                                            <el-input
                                                name="email"
                                                placeholder="Email"
                                                v-model="dialogDrawer.data.email"
                                            ></el-input>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="col-form-label">Địa chỉ</div>
                                            <el-input
                                                name="address"
                                                placeholder="Địa chỉ"
                                                v-model="dialogDrawer.data.address"
                                            ></el-input>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="col-form-label">Website</div>
                                            <el-input
                                                name="website"
                                                placeholder="Website"
                                                v-model="dialogDrawer.data.website"
                                            ></el-input>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="col-form-label">Logo</div>
                                            <div class="row">
                                                <div class="col-lg-2"></div>
                                                <div class="col-lg-8">
                                                    <ImageUpload v-if="!dataLoading || dialogDrawer.data.imageFile" :value="dialogDrawer.data.img" @input="(newValue) => {dialogDrawer.data.imageFile = newValue;}"></ImageUpload>
                                                </div>
                                                <div class="col-lg-2"></div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="demo-drawer__footer mt-5 pb-4">
                                <div class="col-md-12">
                                    <div class="row">
                                        <div class="col-6">
                                            <el-button @click="dialogDrawer.visible = false" style="width:100%">Đóng</el-button>
                                        </div>
                                        <div class="col-6">
                                            <el-button 
                                                v-if="checkRight('create') || checkRight('update')"
                                                type="primary" 
                                                @click="submitForm" 
                                                :loading="dataLoading"
                                                style="width:100%"
                                            >Lưu cấu hình</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-drawer>
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
            dataLoading: true,
            dialogDrawer: {
                visible: false,
                width: '40%',
                data: new InformationConfig()
            }
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
                var oldData = cloneDeep(_this.dialogDrawer.data);
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
                    _this.dialogDrawer.visible = false;
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
        }),
        openDialogDrawer(data){
            const _this = this;
            if(data){
                let width = window.innerWidth;
                if(width < 500){
                    _this.dialogDrawer.width = '100%';
                }
                else if(width < 768){
                    _this.dialogDrawer.width = '80%';
                }
                else if(width < 1000){
                    _this.dialogDrawer.width = '50%';
                }
                else{
                    _this.dialogDrawer.width = '40%';
                }
                _this.dialogDrawer.data = cloneDeep(data);;
                _this.dialogDrawer.visible = true;
            }
        }
    }
}
</script>