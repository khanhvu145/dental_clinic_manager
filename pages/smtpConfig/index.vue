<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Cấu hình SMTP</div>
                    </div>
                </div>
                <div class="row mb-4">
                    <div class="col-md-8 col-lg-6">
                        <div v-loading="dataLoading">
                            <div class="row mt-3" style="pointer-events:none;">
                                <div class="col-md-12">
                                    <div class="col-form-label">Tên phòng khám *</div>
                                    <el-input 
                                        name="name"
                                        placeholder="Tên phòng khám"
                                        v-model="data.name"
                                    ></el-input>
                                </div>
                            </div>
                            <div class="row mt-3" style="pointer-events:none;">
                                <div class="col-md-6">
                                    <div class="col-form-label">Email *</div>
                                    <el-input 
                                        name="email"
                                        placeholder="Email"
                                        v-model="data.email"
                                    ></el-input>
                                </div>
                                <div class="col-md-6">
                                    <div class="col-form-label">Mật khẩu *</div>
                                    <el-input 
                                        name="password"
                                        placeholder="password"
                                        v-model="data.password"
                                        show-password
                                    ></el-input>
                                </div>
                            </div>
                            <div class="row mt-3" style="pointer-events:none;">
                                <div class="col-md-6">
                                    <div class="col-form-label">Máy chủ *</div>
                                    <el-input 
                                        name="host"
                                        placeholder="host"
                                        v-model="data.host"
                                    ></el-input>
                                </div>
                                <div class="col-md-6" style="display: flex; align-items: center;">
                                    <div class="mt-4">
                                        <el-switch v-model="data.isActive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                        Hoạt động
                                    </div>
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
                                    <div class="row mt-3">
                                        <div class="col-md-12">
                                            <div class="col-form-label">Tên phòng khám *</div>
                                            <el-input 
                                                name="name"
                                                placeholder="Tên phòng khám"
                                                v-model="dialogDrawer.data.name"
                                            ></el-input>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="col-form-label">Email *</div>
                                            <el-input 
                                                name="email"
                                                placeholder="Email"
                                                v-model="dialogDrawer.data.email"
                                            ></el-input>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="col-form-label">Mật khẩu *</div>
                                            <el-input 
                                                name="password"
                                                placeholder="password"
                                                v-model="dialogDrawer.data.password"
                                                show-password
                                            ></el-input>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="col-form-label">Máy chủ *</div>
                                            <el-input 
                                                name="host"
                                                placeholder="host"
                                                v-model="dialogDrawer.data.host"
                                            ></el-input>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="mt-4">
                                                <el-switch v-model="dialogDrawer.data.isActive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                                Hoạt động
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
import SMTPConfig from '@/models/tw_SMTPConfig';
export default {
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data() {
        return {
            data: new SMTPConfig(),
            dataLoading: true,
            dialogDrawer: {
                visible: false,
                width: '40%',
                data: new SMTPConfig()
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
			const values = ['smtpConfig.all', 'smtpConfig.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        submitForm: debounce(async function (){
            const _this = this;
            _this.dataLoading = true;
            try{
                var newData = cloneDeep(_this.dialogDrawer.data);
                const data = await _this.$axios.$post('/api/smtpConfig/createUpdate', newData);
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
        async getData(){
            const _this = this;
            await _this.$axios.$get('/api/smtpConfig/getData').then(
                (response) => {
					_this.data = (response.data.length > 0 && response.data != null) ? response.data[0] : new SMTPConfig();
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