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
                        <form v-loading="dataLoading" v-on:submit.prevent="submitForm">
                            <div class="row mt-3">
                                <div class="col-md-12">
                                    <div class="col-form-label">Tên phòng khám *</div>
                                    <el-input 
                                        name="name"
                                        placeholder="Tên phòng khám"
                                        v-model="data.name"
                                    ></el-input>
                                </div>
                            </div>
                            <div class="row mt-3">
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
                            <div class="row mt-3">
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
			const values = ['smtpConfig.all', 'smtpConfig.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        submitForm: debounce(async function (){
            const _this = this;
            _this.dataLoading = true;
            _this.data.createdBy = _this.userInfo.data.username;
            var newData = cloneDeep(_this.data);
            const data = await _this.$axios.$post('/api/smtpConfig/createUpdate', newData);
            if (data.success) {
                _this.$message({
                    message: data.message,
                    type: 'success',
                });
                _this.getData();
            } else {
                _this.$message.error(data.error);
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
						message: 'Có lỗi xảy ra',
					});
                    _this.dataLoading = false;
				}
            );
        }
    }
}
</script>