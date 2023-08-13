<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('create')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <el-tabs v-loading="dataLoading" v-model="activeName">
                            <!-- Đăng ký offline -->
                            <el-tab-pane label="Đăng ký khám offline" name="offline">
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
                                                    <div class="col-md-6">
                                                        <el-select v-model="registerData.customerId" placeholder="Chọn khách hàng" name="customerId" clearable filterable v-on:change="onSelectCustomer($event)">
                                                            <el-option
                                                                v-for="item in customerList"
                                                                :key="item._id"
                                                                :label="`${item.code} | ${item.name} | ${item.phone}`"
                                                                :value="item._id"
                                                            ></el-option>
                                                        </el-select>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <button
                                                            type="button" 
                                                            class="control-btn blue"
                                                            @click="createCustomer()"
                                                            v-if="checkRightCustomer('create')"
                                                        >
                                                            <i class='bx bx-plus-circle'></i>
                                                            <span>Tạo khách hàng</span>
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
                                                    v-model="customerSelected.code"
                                                    placeholder="Mã khách hàng"
                                                    disabled
                                                ></el-input>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="col-form-label">Họ và tên</div>
                                                <el-input 
                                                    name="name"
                                                    v-model="customerSelected.name"
                                                    placeholder="Họ và tên"
                                                    disabled
                                                ></el-input>
                                            </div>
                                        </div>
                                        <div class="row mt-3">
                                            <div class="col-md-6">
                                                <div class="col-form-label">CMND/CCCD</div>
                                                <el-input 
                                                    name="physicalId"
                                                    placeholder="CMND/CCCD"
                                                    v-model="customerSelected.physicalId"
                                                    disabled
                                                ></el-input>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="col-form-label">Số điện thoại</div>
                                                <el-input
                                                    name="phone"
                                                    placeholder="Số điện thoại"
                                                    v-model="customerSelected.phone"
                                                    disabled
                                                ></el-input>
                                            </div>
                                        </div>
                                        <div class="row mt-3">
                                            <div class="col-md-6">
                                                <div class="col-form-label">Ngày sinh</div>
                                                <el-date-picker
                                                    v-model="customerSelected.birthday"
                                                    type="date"
                                                    name="birthday"
                                                    format="dd/MM/yyyy"
                                                    placeholder="Ngày/tháng/năm"
                                                    disabled
                                                ></el-date-picker>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="col-form-label">Giới tính</div>
                                                <el-select v-model="customerSelected.gender" placeholder="Giới tính" name="gender" disabled>
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
                                                <div class="col-form-label" style="font-size: 16px; font-weight: bold;">Thông tin đăng ký</div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="col-form-label">Nha sĩ *</div>
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <el-select v-model="registerData.dentistId" placeholder="Chọn nha sĩ" name="dentistId" clearable filterable>
                                                            <el-option
                                                                v-for="item in dentistList"
                                                                :key="item._id"
                                                                :label="`Ns ${item.name}`"
                                                                :value="item._id"
                                                            ></el-option>
                                                        </el-select>
                                                    </div>
                                                    <div class="col-md-6" style="">
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
                                                            v-model="registerData.date"
                                                            type="date"
                                                            name="date"
                                                            format="dd/MM/yyyy"
                                                            placeholder="Chọn ngày hẹn"
                                                            :picker-options="{ 
                                                                disabledDate: (time) => disabledDate(time) 
                                                            }">
                                                        </el-date-picker>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <el-time-picker
                                                            v-model="registerData.time"
                                                            :picker-options="{
                                                                selectableRange: selectableRange,
                                                                format: 'HH:mm',
                                                            }"
                                                            value-format="HH:mm"
                                                            name="time"
                                                            placeholder="Chọn thời gian"
                                                            @change="handleChangeTime">
                                                        </el-time-picker>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <el-input placeholder="0" v-model="registerData.duration" class="input-with-select" style="text-align: right;" name="duration" type="number">
                                                            <el-select v-model="registerData.durationType" slot="append" style="width:80px;" name="durationType">
                                                                <el-option label="Phút" value="minutes"></el-option>
                                                                <el-option label="Giờ" value="hours"></el-option>
                                                            </el-select>
                                                        </el-input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row mt-3">
                                            <!-- <div class="col-md-6">
                                                <div class="col-form-label">Dịch vụ *</div>
                                                <el-select v-model="registerData.serviceGroupId" placeholder="Chọn dịch vụ" name="serviceGroupId" clearable filterable>
                                                    <el-option
                                                        v-for="item in serviceList"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value"
                                                    ></el-option>
                                                </el-select>
                                            </div> -->
                                            <div class="col-md-6">
                                                <div class="col-form-label">Loại lịch hẹn</div>
                                                <el-select v-model="registerData.type" placeholder="Loại lịch hẹn" name="type" filterable>
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
                                                <el-select v-model="registerData.content" placeholder="Nội dung" name="content" filterable>
                                                    <el-option
                                                        v-for="item in appointmentContent"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value"
                                                    ></el-option>
                                                </el-select>
                                            </div>
                                        </div>
                                        <div class="row mt-3">
                                            <div class="col-md-12">
                                                <div class="col-form-label">Ghi chú</div>
                                                <el-input
                                                    type="textarea"
                                                    :rows="6"
                                                    placeholder="Ghi chú"
                                                    v-model="registerData.note">
                                                </el-input>
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
                            <el-tab-pane label="Đăng ký khám online" name="online">

                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
                <!-- Dialog create customer -->
                <el-dialog title="Tạo khách hàng" :visible.sync="dialogCreateCustomer" :close-on-click-modal="false" width="60%">
                    <form class="row" v-on:submit.prevent="submitCreateCustomer">
                        <div class="col-md-12">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="col-form-label">Họ và tên *</div>
                                    <el-input 
                                        name="name"
                                        placeholder="Họ và tên"
                                        v-model="customerCreated.name"
                                    ></el-input>
                                </div>
                                <div class="col-md-6" style="display: flex; align-items: center;">
                                    <div class="mt-4">
                                        <el-switch v-model="customerCreated.isActive" active-color="#13ce66" inactive-color="#ff4949" disabled></el-switch>
                                        Hoạt động
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-md-4">
                                    <div class="col-form-label">CMND/CCCD *</div>
                                    <el-input 
                                        name="physicalId"
                                        placeholder="CMND/CCCD"
                                        v-model="customerCreated.physicalId"
                                    ></el-input>
                                </div>
                                <div class="col-md-4">
                                    <div class="col-form-label">Ngày cấp</div>
                                    <el-date-picker
                                        v-model="customerCreated.dateOfIssue"
                                        type="date"
                                        name="dateOfIssue"
                                        format="dd/MM/yyyy"
                                        placeholder="Ngày/tháng/năm"
                                    ></el-date-picker>
                                </div>
                                <div class="col-md-4">
                                    <div class="col-form-label">Nơi cấp</div>
                                    <el-input 
                                        name="placeOfIssue"
                                        placeholder="Nơi cấp"
                                        v-model="customerCreated.placeOfIssue"
                                    ></el-input>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-md-6">
                                    <div class="col-form-label">Số điện thoại *</div>
                                    <el-input
                                        name="phone"
                                        placeholder="Số điện thoại"
                                        v-model="customerCreated.phone"
                                    ></el-input>
                                </div>
                                <div class="col-md-6">
                                    <div class="col-form-label">Email</div>
                                    <el-input
                                        name="email"
                                        placeholder="Email"
                                        v-model="customerCreated.email"
                                    ></el-input>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-md-6">
                                    <div class="col-form-label">Ngày sinh</div>
                                    <el-date-picker
                                        v-model="customerCreated.birthday"
                                        type="date"
                                        name="birthday"
                                        format="dd/MM/yyyy"
                                        placeholder="Ngày/tháng/năm"
                                    ></el-date-picker>
                                </div>
                                <div class="col-md-6">
                                    <div class="col-form-label">Giới tính</div>
                                    <el-select v-model="customerCreated.gender" placeholder="Giới tính" name="gender">
                                        <el-option
                                            v-for="item in genderData"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-md-12">
                                    <div class="col-form-label">Địa chỉ</div>
                                </div>
                                <div class="col-md-6">
                                    <el-input
                                        name="building"
                                        placeholder="Số nhà, đường, khu phố"
                                        v-model="customerCreated.address.building"
                                    ></el-input>
                                </div>
                                <div class="col-md-6">
                                    <el-select v-model="customerCreated.address.provinceId" filterable clearable placeholder="Tỉnh/Thành phố" name="provinceId" v-on:change="onSelectProvince($event)">
                                        <el-option
                                            v-for="item in provinceMasterData"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </div>
                                <div class="col-md-6 mt-4">
                                    <el-select v-model="customerCreated.address.districtId" filterable clearable placeholder="Quận/Huyện" name="districtId" v-on:change="onSelectDistrict($event)" :disabled="customerCreated.address.provinceId ? false : true">
                                        <el-option
                                            v-for="item in districtByProvince"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </div>
                                <div class="col-md-6 mt-4">
                                    <el-select v-model="customerCreated.address.wardId" filterable clearable placeholder="Phường/Xã/Ấp" name="wardId" :disabled="customerCreated.address.districtId ? false : true">
                                        <el-option
                                            v-for="item in wardByDistrict"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-md-6">
                                    <div class="col-form-label">Nhóm khách hàng</div>
                                    <el-select v-model="customerCreated.customerGroup" placeholder="Nhóm khách hàng" name="customerGroup">
                                        <el-option
                                            v-for="item in customerType"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </div>
                                <div class="col-md-6">
                                    <div class="col-form-label">Nguồn</div>
                                    <el-select v-model="customerCreated.source" placeholder="Nguồn" name="source">
                                        <el-option
                                            v-for="item in customerSource"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </div>
                        </div>
                    </form>
                    <span slot="footer" class="dialog-footer">
                        <button type="button" class="control-btn gray" @click="dialogCreateCustomer = false">
                            <span>Đóng</span>
                        </button>
                        <button
                            type="button" 
                            class="control-btn green"
                            @click="submitCreateCustomer"
                            v-if="checkRightCustomer('create')"
                        >
                            <span>Lưu</span>
                        </button>
                    </span>
                </el-dialog>
                <!-- Dialog view empty calendar -->
                <el-dialog title="Xem lịch trống" :visible.sync="dialogViewEmptyCalendar" :close-on-click-modal="false" width="90%">
                    <EmptyCalendar @select-empty-calendar = "selectEmptyCalendar" ref="emptyCalendarComponent" :appointmentConfig="appointmentConfig" />
                    <span slot="footer" class="dialog-footer">
                        <button type="button" class="control-btn gray" @click="dialogViewEmptyCalendar = false">
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
import { genderData, appointmentStatus } from '@/utils/masterData';
import Customer from '@/models/tw_Customer';
import Appointment from '@/models/tw_Appointment';
import { debounce, map, cloneDeep, intersection, filter, find, forEach } from 'lodash';
import buildFormData from '@/utils/buildFormData';
import EmptyCalendar from '@/components/register/emptyCalendar.vue';
import moment from 'moment';
import AppointmentConfig from '@/models/tw_AppointmentConfig';
export default {
    components: {
		EmptyCalendar,
	},
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data() {
        return {
            activeName: 'offline',
            genderData: genderData,
            customerSelected: new Customer(),
            customerCreated: new Customer(),
            registerData: new Appointment(),
            dataLoading: true,
            customerList: [],
            dentistList: [],
            serviceList: [],
            dialogCreateCustomer: false,
            provinceMasterData: [],
            districtMasterData: [],
            districtByProvince: [],
            wardMasterData: [],
            wardByDistrict: [],
            customerType: [],
            customerSource: [],
            apointmentType: [],
            apointmentStatus: appointmentStatus,
            dialogViewEmptyCalendar: false,
            appointmentConfig: new AppointmentConfig(),
            selectableRange: [],
            appointmentContent: [],
        }
    },
    async created() {
        const _this = this;
        _this.provinceMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'provinceMasterData' })) || [];
        _this.districtMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'districtMasterData' })) || [];
        _this.wardMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'wardMasterData' })) || [];
        _this.customerType = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigCustomerType' })) || [];
        _this.customerSource = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigCustomerSource' })) || [];
        _this.apointmentType = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigAppointmentType' })) || [];
        // _this.apointmentStatus = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigAppointmentStatus' })) || [];
        // _this.serviceList = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'serviceGroupData' })) || [];
        _this.appointmentContent = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigAppointmentContent' })) || [];
        await _this.$axios.$get('/api/customer/getAll').then(
            (response) => {
                _this.customerList = response.data || [];
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
        await _this.$axios.$get('/api/user/getDentist').then(
            (response) => {
                _this.dentistList = response.data || [];
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
        await _this.$axios.$get('/api/appointmentConfig/getData').then(
            (response) => {
                _this.appointmentConfig = (response.data.length > 0 && response.data != null) ? response.data[0] : new AppointmentConfig();
                if(_this.appointmentConfig.views == null || _this.appointmentConfig.views.length <= 0){
                    _this.appointmentConfig.views = _this.statusData;
                }
            },
            (error) => {
                console.log('Error: ', error);
                _this.$message({
                    type: 'error',
                    message: 'Có lỗi xảy ra',
                });
            }
        );

        if(_this.appointmentConfig.workingTime.apply){
            _this.selectableRange = [
                `${ _this.appointmentConfig.workingTime.timeAM.timeFrom + ':00' } - ${ _this.appointmentConfig.workingTime.timeAM.timeTo + ':00' }`, 
                `${ _this.appointmentConfig.workingTime.timePM.timeFrom + ':00' } - ${ _this.appointmentConfig.workingTime.timePM.timeTo + ':00' }`
            ]
        }

        _this.dataLoading = false;
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['appointment.all', 'appointment.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        checkRightCustomer(right) {
			const _this = this;
			// If user have permission below
			const values = ['customer.all', 'customer.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        createCustomer(){
            const _this = this;
            _this.customerCreated = new Customer();
            _this.dialogCreateCustomer = true;
        },
        async onSelectCustomer(value) {
            const _this = this;
            if(value){
                _this.registerData.customerId = value;
                _this.customerSelected = (await _this.$axios.$get(`/api/customer/getById/${value}`)).data || new Customer();
            }
            else{
                _this.registerData.customerId = '';
                _this.customerSelected = new Customer();
            }
        },
        onSelectProvince(value, check = true) {
            const _this = this;
            if(check) {
                _this.customerCreated.address.districtId = null;
                _this.customerCreated.address.wardId = null;
            }
            _this.districtByProvince = _.filter([..._this.districtMasterData] || [], {'province_code': value});
		},
        onSelectDistrict(value, check = true) {
            const _this = this;
            if(check) {
                _this.customerCreated.address.wardId = null;
            }
            _this.wardByDistrict = _.filter([..._this.wardMasterData] || [], {'district_code': value});
		},
        submitCreateCustomer: debounce(async function (){
            const _this = this;
            _this.dataLoading = true;
            _this.customerCreated.createdBy = _this.userInfo.data.username;
            var oldData = cloneDeep(_this.customerCreated);
            var newData = new FormData();
            buildFormData(newData, oldData);
            const data = await _this.$axios.$post('/api/customer/create', newData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (data.success) {
                await _this.$axios.$get('/api/customer/getAll').then(
                    (response) => {
                        _this.customerList = response.data || [];
                    },
                    (error) => {
                        console.log('Error: ', error);
                    }
                );
                _this.onSelectCustomer(data.data._id);
                // _this.customerCreated = new Customer();
                // _this.customerSelected = data.data;
                _this.$message({
                    message: data.message,
                    type: 'success',
                });
                _this.dialogCreateCustomer = false;
            } else {
                _this.$message.error(data.error);
            }
            _this.dataLoading = false;
        }),
        viewEmptyCalendar(){
            const _this = this;
            _this.dialogViewEmptyCalendar = true;
            if(_this.$refs.emptyCalendarComponent){
                _this.$refs.emptyCalendarComponent.getData();
            };
        },
        selectEmptyCalendar(e){
            const _this = this;
            _this.registerData.dentistId = e.resource.id;
            _this.registerData.date = new Date(moment(e.start).format('YYYY/MM/DD'));
            _this.registerData.time = moment(e.start).format('HH:mm');
            if(_this.registerData.durationType == 'hours'){
                _this.registerData.duration = Math.floor(Math.abs(e.end - e.start)/60000)/60;
            }
            else{
                _this.registerData.duration = Math.floor(Math.abs(e.end - e.start)/60000);
            }
            _this.dialogViewEmptyCalendar = false;
        },
        submitForm: debounce(async function () {
            const _this = this;
            _this.dataLoading = true;
            // _this.registerData.customerId = _this.customerSelected._id;
            _this.registerData.createdBy = _this.userInfo.data.username;
            var newData = cloneDeep(_this.registerData);
            const data = await _this.$axios.$post('/api/appointment/booking', newData);
            if (data.success) {
                _this.registerData = data.data;
                _this.$message({
                    message: data.message,
                    type: 'success',
                });
                console.log(data);
            } else {
                _this.$message.error(data.error);
            }

            _this.dataLoading = false;
        }),
        cancelForm(){
            const _this = this;
            _this.customerSelected = new Customer();
            _this.registerData = new Appointment();
        },
        handleChangeTime(){
            const _this = this;
            if(_this.registerData.duration == '' || _this.registerData.duration == null){
                _this.registerData.duration = 60;
            }
            // console.log(type, event)
            // if(type == 1 && _this.registerData.timeTo == '' && _this.registerData.timeFrom != ''){
            //     _this.registerData.timeTo = moment(event).add(30, 'm').format('HH:mm');
            //     console.log(moment(event).add(30, 'm'))
            // }
            // else if(type == 2 && _this.registerData.timeFrom == '' && _this.registerData.timeTo != ''){
            //     _this.registerData.timeFrom = moment(event).subtract(30, 'm')._d;
            // }
        },
        disabledDate(date){
            const _this = this;
            if(_this.appointmentConfig.workingTime.apply){
                var dayOff = _this.appointmentConfig.workingTime.dayOfWeek.filter(item => item.value == false);
                dayOff = dayOff.map(item => item.key);
                return (moment(moment(date).format('YYYY/MM/DD')).isBefore(moment().format('YYYY/MM/DD')) || dayOff.includes(moment(date).day()));
            }
            else{
                return false;
            }
        }
    }
}
</script>

<style>
input[name="duration"]{
    text-align: right;
    -moz-appearance: textfield;
}
input[name="duration"]::-webkit-outer-spin-button,
input[name="duration"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>