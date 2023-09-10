<template>
    <div class="wrapper" v-if="!dataLoading">
        <div class="content">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">
                            <nuxt-link to="/accessgroup" class="sidebar-nav-link" style="color:#364d67">Quản lý nhóm người dùng</nuxt-link>
                            <span> / </span> <span>{{titleType}}</span>
                        </div>
                    </div>
                </div>
                <form class="row mt-4 mb-5" v-on:submit.prevent="submitForm">
                    <div class="col-md-12" style="text-align: right;">
                        <button type="button" class="control-btn gray" @click="$router.push('/accessgroup')">
                            <i class='bx bx-arrow-back'></i>
                            <span>Quay lại</span>
                        </button>
                        <button
                            v-if="
                                (checkRight('create') && $route.params.id == 'create') ||
                                (checkRight('update') && $route.params.id != 'create')
                            "
                            type="button" 
                            class="control-btn green" 
                            @click="submitForm"
                        >
                            <i class='bx bx-save' ></i>
                            <span>Lưu</span>
                        </button>
                    </div>
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="col-form-label">Tên nhóm quyền *</div>
                                <el-input 
                                    name="name"
                                    placeholder="Tên nhóm quyền"
                                    v-model="formData.name"
                                    required=""
                                ></el-input>
                            </div>
                            <div class="col-md-6" style="display: flex; align-items: center;">
                                <div class="mt-4">
                                    <el-switch v-model="formData.isActive" active-color="#13ce66" inactive-color="#ff4949" style="margin-right:8px;"></el-switch>
                                    Hoạt động
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="col-form-label">Ghi chú</div>
                                <el-input 
                                    type="textarea"
                                    :rows="5"
                                    name="note"
                                    placeholder="Ghi chú"
                                    v-model="formData.note"
                                ></el-input>
                            </div>
                            <div class="col-md-12 mt-3">
                                <div class="col-form-label" style="font-size:20px;font-weight:bold;">Phân quyền</div>
                                <div v-for="page in pages" :key="page.app">
                                    <div class="mb-2" v-for="pageGroup in page['group']" :key="pageGroup.value">
                                        <el-collapse id="custome-el-colapse" class="percent-100" style="border: none;" v-model="activeName" accordion>
                                            <el-collapse-item :name="pageGroup.name">
                                                <template slot="title">
                                                    <div class="pl-2 w-100 text-black">
                                                        {{ pageGroup.name }}
                                                    </div>
                                                </template>
                                                <div v-for="pageSub in pageGroup['pages']" :key="pageSub.value" :name="pageSub.value" class="row mx-0 pt-4 pb-4" style="border-bottom: 2px solid #eee;align-items:center;">
                                                    <div class="col-md-2 text-dark">
                                                        <span style="font-weight:bold;">{{ pageSub.name }}</span>
                                                    </div>
                                                    <div class="col-md-10">
                                                        <div class="row">
                                                            <div :class="'col-md-2' + (pageSub.hideDefaultRights ? ' hideDefaultRights' : '')" v-for="defaultRight in defaultRights" :key="defaultRight.value">
                                                                <el-checkbox
                                                                    v-if="!pageSub.hideDefaultRights"
                                                                    name="accessgroupkey"
                                                                    :checked="checkAccessRight(`${pageSub.value}.${defaultRight.value}`)"
                                                                    :label="`${pageSub.value}.${defaultRight.value}`"
                                                                    >{{ defaultRight.name }}</el-checkbox
                                                                >
                                                            </div>
                                                            <div class="col-md-2" v-for="customRight in pageSub.customRights" :key="customRight.value">
                                                                <el-checkbox
                                                                    name="accessgroupkey"
                                                                    :checked="checkAccessRight(`${pageSub.value}.${customRight.value}`)"
                                                                    :label="`${pageSub.value}.${customRight.value}`"
                                                                    >{{ customRight.name }}</el-checkbox
                                                                >
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </el-collapse-item>
                                        </el-collapse>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import AccessRight from '@/models/tw_AccessGroup';
import { cloneDeep, debounce, intersection } from 'lodash';
import buildFormData from '@/utils/buildFormData';
export default {
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data() {
        return {
            dataLoading: true,
            formData: new AccessRight(),
            titleType: '',
            activeName: '',
            defaultRights: [
				{
					name: 'Tất cả',
					value: 'all',
				},
				{
					name: 'Xem',
					value: 'view',
				},
				{
					name: 'Thêm mới',
					value: 'create',
				},
				{
					name: 'Chỉnh sửa',
					value: 'update',
				}
			],
            pages:[
                {
                    app: 'dental-clinic-manager',
                    group: [
                        {
                            name: 'Báo cáo',
                            value: 'g_report_role',
                            pages: [
                                {
									name: 'Tổng quan',
									value: 'overview',
									customRights: [],
                                    hideDefaultRights: false,
								},
                                {
									name: 'Khách hàng',
									value: 'customerProfile',
									customRights: [],
                                    hideDefaultRights: false,
								}
                            ]
                        },
                        {
                            name: 'Khách hàng',
                            value: 'g_customer_role',
                            pages: [
                                {
									name: 'Khách hàng',
									value: 'customer',
									customRights: [
                                        {
											name: 'Xem phiếu khám',
											value: 'viewExamination',
										},
                                        {
											name: 'Tạo phiếu khám',
											value: 'createExamination',
										},
                                        {
											name: 'Cập nhật phiếu khám',
											value: 'updateExamination',
										},
                                        {
											name: 'In phiếu khám',
											value: 'printExamination',
										},
                                        {
											name: 'Hủy phiếu khám',
											value: 'cancelExamination',
										},
                                        {
											name: 'Xem nhật ký',
											value: 'viewDiary',
										},
                                        {
											name: 'Theo dõi thanh toán',
											value: 'viewPayment',
										},
                                        {
											name: 'Xác nhận thanh toán',
											value: 'confirmPayment',
										},
                                        {
											name: 'In phiếu thu',
											value: 'printReceipt',
										},
                                        {
											name: 'Thêm đơn thuốc',
											value: 'createPrescription',
										},
                                        {
											name: 'In đơn thuốc',
											value: 'printPrescription',
										},
                                    ],
                                    hideDefaultRights: false,
								},
                            ]
                        },
                        {
                            name: 'Lịch hẹn',
                            value: 'g_apointment_role',
                            pages: [
                                {
                                    name: 'Đăng ký khám',
									value: 'register',
                                    customRights: [
                                        {
                                            name: 'Tất cả',
                                            value: 'all',
                                        },
                                        {
                                            name: 'Xem',
                                            value: 'view',
                                        },
                                        {
                                            name: 'Tạo lịch hẹn',
                                            value: 'create',
                                        },
                                    ],
                                    hideDefaultRights: true,
                                },
                                {
									name: 'Quản lý lịch hẹn',
									value: 'appointment',
									customRights: [
                                        {
											name: 'Xác nhận đến khám',
											value: 'confirmBooking',
										},
                                        {
											name: 'Hoàn thành lịch hẹn',
											value: 'completeBooking',
										},
                                        {
											name: 'Hủy lịch hẹn',
											value: 'cancelBooking',
										},
                                        {
											name: 'Gửi nhắc hẹn',
											value: 'sendMail',
										},
                                    ],
                                    hideDefaultRights: false,
								},
                                {
									name: 'Lịch làm việc',
									value: 'workingCalendar',
									customRights: [],
                                    hideDefaultRights: false,
								},
                                {
                                    name: 'Cấu hình lịch hẹn',
									value: 'appointmentConfig',
                                    customRights: [],
                                    hideDefaultRights: false,
                                },
                            ]
                        },
                        {
                            name: 'Quản lý thu chi',
                            value: 'g_receipts_payment_role',
                            pages: [
                                {
									name: 'Phiếu thu',
									value: 'receipts',
									customRights: [
                                        {
                                            name: 'Tất cả',
                                            value: 'all',
                                        },
                                        {
                                            name: 'Xem',
                                            value: 'view',
                                        },
                                        {
											name: 'Hủy phiếu thu',
											value: 'cancelReceipts',
										},
                                        {
											name: 'In phiếu thu',
											value: 'printReceipts',
										},
                                    ],
                                    hideDefaultRights: true,
								},
                                {
                                    name: 'Phiếu chi',
									value: 'payment',
                                    customRights: [
                                        {
											name: 'In phiếu chi',
											value: 'print',
										},
                                    ],
                                    hideDefaultRights: false,
                                }
                            ]
                        },
                        {
                            name: 'Thiết lập',
                            value: 'g_establish_role',
                            pages: [
                                {
									name: 'Loại hình dịch vụ',
									value: 'service',
									customRights: [],
                                    hideDefaultRights: false,
								}
                            ]
                        },
                        {
                            name: 'Hệ thống',
                            value: 'g_system_role',
                            pages: [
                                {
									name: 'Nhóm quyền',
									value: 'accessgroup',
									customRights: [],
                                    hideDefaultRights: false,
								},
                                {
									name: 'Người dùng',
									value: 'users',
									customRights: [],
                                    hideDefaultRights: false,
								},
                            ]
                        },
                        {
                            name: 'Cấu hình',
                            value: 'g_config_role',
                            pages: [
                                {
									name: 'Cấu hình chung',
									value: 'generalconfig',
									customRights: [],
                                    hideDefaultRights: false,
								},
                                {
                                    name: 'Cấu hình thông tin',
									value: 'informationConfig',
                                    customRights: [],
                                    hideDefaultRights: false,
                                },
                                {
                                    name: 'Cấu hình SMTP',
									value: 'smtpConfig',
                                    customRights: [],
                                    hideDefaultRights: false,
                                },
                            ]
                        }
                    ]
                }
            ],
        }
    },
    mounted() {
        if(this.$nuxt.$route.params.id == 'create') this.titleType = 'Thêm';
        else this.titleType = 'Sửa';
    },
    async created() {
        const _this = this;
        if (_this.$route.params.id && _this.$route.params.id != 'create') {
            await _this.$axios.$get(`/api/accessgroup/getById/${_this.$route.params.id}`).then(
				(response) => {
                    _this.formData = response.data || new AccessRight();
				},
				(error) => {
                    console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: 'Có lỗi xảy ra',
					});
					 _this.formData = new AccessRight();
				}
			);
        }

        _this.dataLoading = false;
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['accessgroup.all', 'accessgroup.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        checkAccessRight(value) {
			const _this = this;
			return _.includes(_this.formData.accesses, value);
		},
        submitForm: debounce(async function () {
			const _this = this;
            _this.dataLoading = true;
            try{
                _this.formData.accesses = [];
                document.getElementsByName('accessgroupkey').forEach((e) => {
                    if (e.checked) {
                        _this.formData.accesses.push(e.value);
                    }
                });
                if (_this.$route.params.id != 'create') {
                    _this.formData.updatedBy = _this.userInfo.data.username;
                    var newData = cloneDeep(_this.formData);
                    const data = await _this.$axios.$put('/api/accessgroup/update', newData);
                    if (data.success) {
                        _this.formData = data.data;
                        _this.$message({
                            message: data.message,
                            type: 'success',
                        });
                        _this.$router.push(`/accessgroup/${data.data._id}`);
                        _this.$router.go();
                    } else {
                        _this.$message.error(data.error);
                    }
                } 
                else {
                    _this.formData.createdBy = _this.userInfo.data.username;
                    var newData = cloneDeep(_this.formData);
                    const data = await _this.$axios.$post('/api/accessgroup/create', newData);
                    if (data.success) {
                        _this.formData = data.data;
                        _this.$message({
                            message: data.message,
                            type: 'success',
                        });
                        _this.$router.push(`/accessgroup/${data.data._id}`);
                    } else {
                        _this.$message.error(data.error);
                    }
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
		}, 500),
    }
}
</script>

<style>
.hideDefaultRights{
    display: none;
}
</style>