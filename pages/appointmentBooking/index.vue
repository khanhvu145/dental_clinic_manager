<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('create')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <el-tabs v-loading="dataLoading" v-model="activeName">
                            <!-- Đăng ký offline -->
                            <el-tab-pane label="Đặt hẹn offline" name="offline">
                                <form class="row mb-4" v-on:submit.prevent="submitForm">
                                    <!-- Thông tin khách hàng -->
                                    <div class="col-md-5 mb-3">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="col-form-label" style="font-size: 16px; font-weight: bold;">Thông tin khách hàng</div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="col-form-label">Khách hàng *</div>
                                                <div class="row">
                                                    <div class="col-md-8">
                                                        <el-select 
                                                            v-model="data.mainCustomer._id" 
                                                            placeholder="Chọn khách hàng" 
                                                            name="customerId" 
                                                            style="width: 100%"
                                                            clearable 
                                                            filterable
                                                            remote
                                                            :remote-method="(text) => filterCustomer(text)"
                                                            @focus="filterCustomer('')"
                                                            @change="handleChangeCustomer($event)"
                                                        >
                                                            <el-option
                                                                v-for="item in customerData"
                                                                :key="item._id"
                                                                :label="`${item.code} | ${item.name} | ${item.phone}`"
                                                                :value="item._id"
                                                            ></el-option>
                                                        </el-select>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <button
                                                            type="button" 
                                                            class="control-btn blue"
                                                            @click="createCustomer"
                                                        >
                                                            <i class='bx bx-plus-circle'></i>
                                                            <span>Tạo</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row mt-3">
                                            <div class="col-md-6">
                                                <div class="col-form-label">Mã khách hàng</div>
                                                <el-input 
                                                    name="code"
                                                    v-model="data.mainCustomer.code"
                                                    placeholder="Mã khách hàng"
                                                    disabled
                                                ></el-input>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="col-form-label">Họ và tên</div>
                                                <el-input 
                                                    name="name"
                                                    v-model="data.mainCustomer.name"
                                                    placeholder="Họ và tên"
                                                    disabled
                                                ></el-input>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="col-form-label">CMND/CCCD</div>
                                                <el-input 
                                                    name="physicalId"
                                                    placeholder="CMND/CCCD"
                                                    v-model="data.mainCustomer.physicalId"
                                                    disabled
                                                ></el-input>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="col-form-label">Số điện thoại</div>
                                                <el-input
                                                    name="phone"
                                                    placeholder="Số điện thoại"
                                                    v-model="data.mainCustomer.phone"
                                                    disabled
                                                ></el-input>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="col-form-label">Ngày sinh</div>
                                                <el-date-picker
                                                    v-model="data.mainCustomer.birthday"
                                                    type="date"
                                                    name="birthday"
                                                    format="dd/MM/yyyy"
                                                    placeholder="Ngày/tháng/năm"
                                                    disabled
                                                ></el-date-picker>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="col-form-label">Giới tính</div>
                                                <el-select v-model="data.mainCustomer.gender" placeholder="Giới tính" name="gender" disabled>
                                                    <el-option
                                                        v-for="item in genderData"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value"
                                                    ></el-option>
                                                </el-select>
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
                                                    <div class="col-md-6">
                                                        <el-select v-model="data.dentistId" placeholder="Nha sĩ" name="dentistId" disabled>
                                                            <el-option
                                                                v-for="item in dentistData"
                                                                :key="item._id"
                                                                :label="`Ns ${item.name}`"
                                                                :value="item._id"
                                                            ></el-option>
                                                        </el-select>
                                                    </div>
                                                    <div class="col-md-6">
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
                                        <button type="button" class="control-btn gray" @click="cancelForm">
                                            <i class='bx bx-refresh'></i>
                                            <span>Mới</span>
                                        </button>
                                        <button
                                            type="button" 
                                            class="control-btn green"
                                            @click="submitForm"
                                            v-if="checkRight('create')"
                                        >
                                            <i class='bx bxs-calendar-plus'></i>
                                            <span>Đặt hẹn</span>
                                        </button>
                                    </div>
                                </form>
                            </el-tab-pane>
                            <!-- Đăng ký online -->
                            <el-tab-pane label="Đặt hẹn online" name="online">

                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
                <!-- Dialog view empty calendar -->
                <el-dialog title="Xem lịch trống" :visible.sync="dialogViewEmptyCalendar.visible" :close-on-click-modal="false" width="95%">
                    <EmptyCalendar ref="emptyCalendarComponent" @selectEmptyCalendar = "selectEmptyCalendar" :diaglogVisible="dialogViewEmptyCalendar.visible" />
                    <span slot="footer" class="dialog-footer">
                        <button type="button" class="control-btn gray" @click="dialogViewEmptyCalendar.visible = false">
                            <span>Đóng</span>
                        </button>
                    </span>
                </el-dialog>
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
            activeName: 'offline',
            dataLoading: true,
            data: new Appointment(),
            customerData: [],
            genderData: genderData,
            dentistData: [],
            apointmentType: [],
            appointmentContent: [],
            appointmentConfig: {},
            dialogViewEmptyCalendar: {
                visible: false,
                data: [],
                configs: {}
            }
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
        //Lấy cấu hình lịch hẹn
        // await _this.getAppointmentConfig();
        _this.dataLoading = false;
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['appointment.all', 'appointment.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        submitForm: debounce(async function () {
            const _this = this;
            _this.dataLoading = true;
            try{
                console.log(_this.data)
                var newData = cloneDeep(_this.data);
                const response = await _this.$axios.$post('/api/appointmentBooking/create', newData);
                if (response.success) {
                    _this.data = response.data;
                    _this.$message({
                        message: response.message,
                        type: 'success',
                    });
                } else {
                    _this.$message.error(response.error);
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
        handleChangeCustomer: async function (value) {
            const _this = this;
            if(value){
                _this.data.mainCustomer = _.find(_this.customerData, f => {
                    return f._id == value;
                });
            }
            else{
                _this.data.mainCustomer = new Customer();
            }
        },
        filterCustomer: debounce(async function (text) {
            const _this = this;
            let query = {
                filters: {
                    textSearch: text
                },
                sorts: 'createdAt&&-1',
                pages:{
                    from: 0,
                    size: 10
                }
            };
            let customers = await _this.$axios.$post('/api/customer/getByTextSearch', query);
            _this.customerData = customers && customers.data;
        }, 200),
        createCustomer(){
            const _this = this;
            let route = _this.$router.resolve({path: '/customer/create'});
            window.open(route.href, '_blank');
        },
        viewEmptyCalendar(){
            const _this = this;
            _this.dialogViewEmptyCalendar.configs = _this.appointmentConfig;
            _this.dialogViewEmptyCalendar.visible = true;
        },
        async getAppointmentConfig(){
            const _this = this;
            const configs = await _this.$axios.$post(`/api/appointmentConfig/getDataByListKey`, [
                'WORKING_TIME_MORNING_START',
                'WORKING_TIME_MORNING_END',
                'WORKING_TIME_AFTERNOON_START',
                'WORKING_TIME_AFTERNOON_END',
                'WORKING_TIME_DAY_OF_WEEK'
            ]);
            if(configs && configs.length > 0){
                var WORKING_TIME_MORNING_START = _.find(configs, f => {
                    return f.key == 'WORKING_TIME_MORNING_START';
                });
                _this.appointmentConfig.WORKING_TIME_MORNING_START = WORKING_TIME_MORNING_START.value;
                var WORKING_TIME_MORNING_END = _.find(configs, f => {
                    return f.key == 'WORKING_TIME_MORNING_END';
                });
                _this.appointmentConfig.WORKING_TIME_MORNING_END = WORKING_TIME_MORNING_END.value;
                var WORKING_TIME_AFTERNOON_START = _.find(configs, f => {
                    return f.key == 'WORKING_TIME_AFTERNOON_START';
                });
                _this.appointmentConfig.WORKING_TIME_AFTERNOON_START = WORKING_TIME_AFTERNOON_START.value;
                var WORKING_TIME_AFTERNOON_END = _.find(configs, f => {
                    return f.key == 'WORKING_TIME_AFTERNOON_END';
                });
                _this.appointmentConfig.WORKING_TIME_AFTERNOON_END = WORKING_TIME_AFTERNOON_END.value;
                var WORKING_TIME_DAY_OF_WEEK = _.find(configs, f => {
                    return f.key == 'WORKING_TIME_DAY_OF_WEEK';
                });
                _this.appointmentConfig.WORKING_TIME_DAY_OF_WEEK = JSON.parse(WORKING_TIME_DAY_OF_WEEK.value);
            }
        },
        selectEmptyCalendar(e){
            const _this = this;
            _this.data.dentistId = e.resource.id;
            _this.data.date = new Date(moment(e.start).format('YYYY/MM/DD'));
            _this.data.timeFrom = moment(e.start).format('HH:mm');
            _this.data.timeTo = moment(e.end).format('HH:mm');
            _this.data.session = e.session;
            _this.dialogViewEmptyCalendar.visible = false;
        },
        cancelForm(){
            const _this = this;
            _this.dataLoading = true;
            setTimeout(() => {
                _this.data = new Appointment();
                _this.dataLoading = false;
            }, 250);
        },
    }
}
</script>