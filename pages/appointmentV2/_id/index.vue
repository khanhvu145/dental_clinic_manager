<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">
                            <nuxt-link to="/accessgroup" class="sidebar-nav-link" style="color:#364d67">Quản lý lịch hẹn</nuxt-link>
                            <span> / </span> <span>Chỉnh sửa</span>
                        </div>
                    </div>
                </div>
                <form class="row mt-4 mb-5" v-loading="dataLoading" v-on:submit.prevent="submitForm">
                    <!-- Thông tin khách hàng -->
                    <div class="col-md-5 mb-3">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="col-form-label" style="font-size: 16px; font-weight: bold;">Thông tin khách hàng</div>
                            </div>
                        </div>
                        <div class="row mt-3" style="font-size:14px;">
                            <div class="col-sm-6 col-md-6 mb-3">
                                Mã khách hàng:
                                <span style="font-weight: bold;">{{ data.mainCustomer.code || '' }}</span>
                            </div>
                            <div class="col-sm-6 col-md-6 mb-3">
                                Họ và tên:
                                <span style="font-weight: bold;">{{ data.mainCustomer.name || '' }}</span>
                            </div>
                            <div class="col-sm-6 col-md-6 mb-3">
                                CMND/CCCD:
                                <span style="font-weight: bold;">{{ data.mainCustomer.physicalId || '' }}</span>
                            </div>
                            <div class="col-sm-6 col-md-6 mb-3">
                                Số điện thoại:
                                <span style="font-weight: bold;">{{ data.mainCustomer.phone || '' }}</span>
                            </div>
                            <div class="col-sm-6 col-md-6 mb-3">
                                Ngày sinh:
                                <span style="font-weight: bold;">{{ $moment(data.mainCustomer.birthday).format('DD/MM/YYYY') || '' }}</span>
                            </div>
                            <div class="col-sm-6 col-md-6 mb-3">
                                Giới tính:
                                <span style="font-weight: bold;">{{ data.mainCustomer.gender == 'male' ? 'Nam' : 'Nữ' || '' }}</span>
                            </div>
                            <div class="col-md-12 mb-3">
                                Địa chỉ:
                                <span style="font-weight: bold;">{{ data.mainCustomer.fullAddress || '' }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- Thông tin lịch hẹn -->
                    <div class="col-md-7 mb-4" style="border-left: 2px solid rgb(232, 231, 231)">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="col-form-label" style="font-size: 16px; font-weight: bold;">Thông tin đặt hẹn</div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="col-form-label">Nha sĩ *</div>
                                <div class="row">
                                    <div class="col-sm-7 col-md-6">
                                        <el-select v-model="data.dentistId" placeholder="Nha sĩ" name="dentistId" disabled>
                                            <el-option
                                                v-for="item in dentistData"
                                                :key="item._id"
                                                :label="`Ns ${item.name}`"
                                                :value="item._id"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-sm-5 col-md-6">
                                        <button
                                            type="button" 
                                            class="control-btn blue"
                                            @click="viewEmptyCalendar()"
                                            v-if="checkRight('view')"
                                        >
                                            <i class='bx bxs-calendar'></i>
                                            <span>Xem lịch trống</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <div class="col-form-label">Thời gian *</div>
                                <div class="row">
                                    <div class="col-md-4">
                                        <el-date-picker
                                            v-model="data.date"
                                            type="date"
                                            name="date"
                                            format="dd/MM/yyyy"
                                            placeholder="Ngày hẹn"
                                            disabled
                                        ></el-date-picker>
                                    </div>
                                    <div class="col-md-4">
                                        <el-time-picker
                                            v-model="data.timeFrom"
                                            value-format="HH:mm"
                                            name="time"
                                            placeholder="Từ"
                                            disabled
                                        ></el-time-picker>
                                    </div>
                                    <div class="col-md-4">
                                        <el-time-picker
                                            v-model="data.timeTo"
                                            value-format="HH:mm"
                                            name="time"
                                            placeholder="Đến"
                                            disabled
                                        ></el-time-picker>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="col-form-label">Loại lịch hẹn</div>
                                        <el-select v-model="data.type" placeholder="Loại lịch hẹn" name="type" filterable>
                                            <el-option
                                                v-for="item in apointmentType"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="col-form-label">Nội dung *</div>
                                        <el-select v-model="data.content" placeholder="Nội dung" name="content" filterable>
                                            <el-option
                                                v-for="item in appointmentContent"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="col-form-label">Ghi chú</div>
                                        <el-input
                                            type="textarea"
                                            :rows="6"
                                            placeholder="Ghi chú"
                                            v-model="data.note">
                                        </el-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Thao tác -->
                    <div class="col-md-12 mt-4" style="text-align: right;">
                        <button type="button" class="control-btn gray" @click="$router.push('/appointmentV2')">
                            <i class='bx bx-arrow-back'></i>
                            <span>Quay lại</span>
                        </button>
                        <button
                            type="button" 
                            class="control-btn green"
                            @click="submitForm"
                            v-if="checkRight('create')"
                        >
                            <i class='bx bxs-calendar-plus'></i>
                            <span>Lưu lại</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <div v-else>
            <el-empty description="Bạn không có quyền !!"></el-empty>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { genderData, appointmentStatusV2 } from '@/utils/masterData';
import Customer from '@/models/tw_Customer';
import Appointment from '@/models/tw_Appointment_Booking';
import { debounce, map, cloneDeep, intersection, filter, find, forEach } from 'lodash';
import buildFormData from '@/utils/buildFormData';
import EmptyCalendar from '@/components/appointment/emptyCalendar.vue';
import moment from 'moment';
export default {
    components: {
		EmptyCalendar
	},
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data(){
        return {
            dataLoading: true,
            data: new Appointment(),
            dentistData: [],
            apointmentType: [],
            appointmentContent: [],
        }
    },
    async created(){
        const _this = this;
        // Lấy danh sách nha sĩ
        let dentists = await _this.$axios.$get('/api/user/getDentist');
        _this.dentistData = dentists && dentists.data;
        // Lấy danh sách loại lịch hẹn
        _this.apointmentType = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigAppointmentType' })) || [];
        //Lấy danh sách nội dung lịch hẹn
        _this.appointmentContent = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigAppointmentContent' })) || [];
        await _this.getData();
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['appointment.all', 'appointment.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        async getData(){
            const _this = this;
            _this.dataLoading = true;
            if (_this.$route.params.id) {
                await _this.$axios.$post('/api/appointmentBooking/getById', { 
                    id: _this.$route.params.id
                }).then(
                    (response) => {
                        if(response.success){
                            _this.data = response.data || new Appointment();
                        }
                        else{
                            _this.$message({
                                type: 'error',
                                message: response.error
                            });
                        }
                    },
                    (error) => {
                        console.log('Error: ', error);
                        _this.$message({
                            type: 'error',
                            message: error,
                        });
                    }
                );
            }
            _this.dataLoading = false;
        },
        viewEmptyCalendar(){
            const _this = this;
        },
        submitForm: debounce(async function () {
            const _this = this;
        }),
    }
}
</script>