<template>
    <div class="row">
        <div class="col-md-12">
            <FullCalendar ref="workingCalendar" :options="options" />

            <!-- Dialog working calendar detail -->
            <el-dialog :visible.sync="dialogWorkingCalendarDetail" :close-on-click-modal="false" width="45%">
                <span slot="title" class="dialog-title">
                    Chi tiết lịch hẹn |
                    <span style="color: #FFCC33; font-weight: bold;">
                        {{ appointmentStatus.find(x => x.value == appointment.status) ? appointmentStatus.find(x => x.value == appointment.status).label : '' }}
                    </span>
                </span>
                <div class="row">
                    <div class="col-md-12 customerInfo pb-2">
                        <div class="row">
                            <div class="col-md-12 mb-4">
                                <span style="font-weight: bold;">Thông tin khách hàng</span>
                            </div>
                            <div class="col-md-12">
                                <div class="row">
                                    <div class="col-lg-6 mb-3">
                                         <el-avatar :size="100">
                                            <img :src="appointment.customerImg ? appointment.customerImg : '/images/user.png'" alt="">
                                        </el-avatar>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="row">
                                            <div class="col-md-12 mb-3">
                                                 Mã:
                                                <span style="font-weight: bold;">{{ appointment.customerCode || '' }}</span>
                                            </div>
                                            <div class="col-md-12 mb-3">
                                                Tên:
                                                <span style="font-weight: bold;">{{ appointment.customerName || '' }}</span>
                                            </div>
                                            <div class="col-md-12 mb-3">
                                                Ngày sinh:
                                                <span style="font-weight: bold;">{{ $moment(appointment.customerBirthday).format('DD/MM/YYYY') || '' }}</span>
                                            </div>
                                            <div class="col-md-12 mb-3" style="word-break: break-word;">
                                                Giới tính:
                                                <span style="font-weight: bold;">{{ appointment.customerGender == 'male' ? 'Nam' : 'Nữ' }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 mb-3" style="word-break: break-word;">
                                        CMND/CCCD:
                                        <span style="font-weight: bold;">{{ appointment.customerPhysicalId || '' }}</span>
                                    </div>
                                    <div class="col-lg-6 mb-3" style="word-break: break-word;">
                                        Số điện thoại:
                                        <span style="font-weight: bold;">{{ appointment.customerPhone || '' }}</span>
                                    </div>
                                    <div class="col-lg-6 mb-3" style="word-break: break-word;">
                                        Email:
                                        <span style="font-weight: bold;">{{ appointment.customerEmail || '' }}</span>
                                    </div>
                                    <div class="col-lg-6 mb-3" style="word-break: break-word;">
                                        Địa chỉ:
                                        <span style="font-weight: bold;">{{ appointment.fullAddress || '' }}</span>
                                    </div>
                                    <div class="col-lg-6 mb-3" style="word-break: break-word;">
                                        Nhóm:
                                        <span style="font-weight: bold;">
                                            {{ customerType.find(e => e.value == appointment.customerGroup) ? customerType.find(e => e.value == appointment.customerGroup).label : '' }}
                                        </span>
                                    </div>
                                    <div class="col-lg-6 mb-3" style="word-break: break-word;">
                                        Nguồn:
                                        <span style="font-weight: bold;">
                                            {{ customerSource.find(e => e.value == appointment.customerSource) ? customerSource.find(e => e.value == appointment.customerSource).label : '' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12 mt-4">
                        <div class="row">
                            <div class="col-md-12 mb-4">
                                <span style="font-weight: bold;">Thông tin lịch hẹn</span>
                            </div>
                            <div class="col-md-12">
                                <div class="row">
                                    <div class="col-lg-6 mb-3" style="word-break: break-word;">
                                        Mã lịch hẹn:
                                        <span style="font-weight: bold;">{{ appointment.code || '' }}</span>
                                    </div>
                                    <div class="col-lg-6 mb-3" style="word-break: break-word;">
                                        Nha sĩ phụ trách:
                                        <span style="font-weight: bold;">{{ appointment.dentistName || '' }}</span>
                                    </div>
                                    <div class="col-lg-6 mb-3" style="word-break: break-word;">
                                        Ngày hẹn:
                                        <span style="font-weight: bold;">{{ $moment(appointment.date).format('DD/MM/YYYY') || '' }}</span>
                                    </div>
                                    <div class="col-lg-6 mb-3" style="word-break: break-word;">
                                        Thời gian:
                                        <span style="font-weight: bold;">{{ $moment(appointment.timeFrom).format('HH:mm') || '' }}</span>
                                        -
                                        <span style="font-weight: bold;">{{ $moment(appointment.timeTo).format('HH:mm') || '' }}</span>
                                    </div>
                                    <div class="col-lg-6 mb-3" style="word-break: break-word;">
                                        Dịch vụ:
                                        <span style="font-weight: bold;">{{ appointment.serviceGroupName || '' }}</span>
                                    </div>
                                    <div class="col-lg-6 mb-3" style="word-break: break-word;">
                                        Loại lịch hẹn:
                                        <span style="font-weight: bold;">
                                            {{ appointmentType.find(e => e.value == appointment.type) ? appointmentType.find(e => e.value == appointment.type).label : '' }}
                                        </span>
                                    </div>
                                    <div class="col-lg-12 mb-3" style="word-break: break-word;">
                                        Ghi chú:
                                        <span style="font-weight: bold;">{{ appointment.note || '' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <a v-if="appointment.status != 'Cancelled'" :href="`/customer/${appointment.customerId}/profile`" target="_blank" class="control-btn green">
                        Xem hồ sơ
                    </a>
                    <a v-if="appointment.status == 'Checkin'" :href="`/customer/${appointment.customerId}/examination`" target="_blank" class="control-btn yellow">
                        Khám & điều trị
                    </a>
                    <button type="button" class="control-btn gray" @click="dialogWorkingCalendarDetail = false">
                        <span>Đóng</span>
                    </button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import '@fullcalendar/core/vdom';
import FullCalendar from '@fullcalendar/vue';
import timegrid from '@fullcalendar/timegrid';
import daygrid from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';
import moment from 'moment';
import scrollgridPlugin from '@fullcalendar/scrollgrid';
import User from '@/models/tw_User';
import AppointmentConfig from '@/models/tw_AppointmentConfig';
import Appointment from '@/models/tw_Appointment';
import { genderData, appointmentStatus } from '@/utils/masterData';
export default {
    components: {
		FullCalendar,
	},
    props: ['listAppointments'],
    data(){
        return {
            options: {
                schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                locales: [viLocale],
                plugins: [timegrid, daygrid, scrollgridPlugin, interactionPlugin],
                initialView: 'timeGridWeek',
                headerToolbar: {
                    left: 'prev today next',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                dayMinWidth: 'auto',
                // slotDuration: '00:05:00',
                // slotLabelInterval: '00:15:00',
                expandRows: true,
                scrollTime: moment().format('HH:mm:ss'),
                events: [],
                // eventTextColor: '#fff',
                // eventBackgroundColor: '#8fdf82',
                // eventBorderColor: '#8fdf82',
                eventClick: this.handleEventClick,
                // eventMaxStack: 2
            },
            appointmentConfig: new AppointmentConfig(),
            appointment: new Appointment(),
            dialogWorkingCalendarDetail: false,
            customerType: [],
            customerSource: [],
            provinceMasterData: [],
            districtMasterData: [],
            wardMasterData: [],
            districtByProvince: [],
            wardByDistrict: [],
            appointmentType: [],
            appointmentStatus: appointmentStatus
        }
    },
    async created() { 
        const _this = this;
        _this.provinceMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'provinceMasterData' })) || [];
        _this.districtMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'districtMasterData' })) || [];
        _this.wardMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'wardMasterData' })) || [];
        _this.customerType = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigCustomerType' })) || [];
        _this.customerSource = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigCustomerSource' })) || [];
        _this.appointmentType = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigAppointmentType' })) || [];
        await _this.$axios.$get('/api/appointmentConfig/getData').then(
            (response) => {
                _this.appointmentConfig = (response.data.length > 0 && response.data != null) ? response.data[0] : new AppointmentConfig();
                if(_this.appointmentConfig.views == null || _this.appointmentConfig.views.length <= 0){
                    _this.appointmentConfig.views = _this.appointmentStatus;
                }
                _this.options.slotMinTime = _this.appointmentConfig.workingTime.timeAM.timeFrom;
                _this.options.slotMaxTime = _this.appointmentConfig.workingTime.timePM.timeTo;
            },
            (error) => {
                console.log('Error: ', error);
                _this.$message({
                    type: 'error',
                    message: 'Có lỗi xảy ra',
                });
            }
        );
        await _this.getData();
    },
    methods: {
        async getData(){
            const _this = this;
            if(_this.listAppointments.length > 0){
                _this.options.events = _this.listAppointments.map(item => {
                    return {
                        id: item._id,
                        title: item.customerName,
                        start: item.timeFrom,
                        end: item.timeTo,
                        color: _this.appointmentConfig.views.find(e => e.value == item.status).apply ? _this.appointmentConfig.views.find(e => e.value == item.status).backgroundColor : _this.appointmentStatus.find(e => e.value == item.status).backgroundColor,
                        textColor: _this.appointmentConfig.views.find(e => e.value == item.status).apply ? _this.appointmentConfig.views.find(e => e.value == item.status).textColor : _this.appointmentStatus.find(e => e.value == item.status).textColor,
                        borderColor: _this.appointmentConfig.views.find(e => e.value == item.status).apply ? _this.appointmentConfig.views.find(e => e.value == item.status).borderColor : _this.appointmentStatus.find(e => e.value == item.status).borderColor
                    }
                });
            }
            else{
                _this.options.events = [];
            }
        },
        async handleEventClick(eventInfo){
            const _this = this;
            await _this.$axios.$get(`/api/appointment/getById/${eventInfo.event.id}`).then(
				(response) => {
                    _this.appointment = (response.data != null && response.data.length > 0) ? response.data[0] : new Appointment();
                    //Lấy danh sách quận theo tỉnh
                    _this.getDistrictByProvince(_this.appointment.customerAddress.provinceId);
                    //Lấy danh sách phường,xã theo quận
                    _this.getWardByDistrict(_this.appointment.customerAddress.districtId);
                    //Lấy địa chỉ đầy đủ của khách hàng
                    _this.appointment.fullAddress = _this.getFullAddress(_this.appointment.customerAddress.building, _this.appointment.customerAddress.provinceId, _this.appointment.customerAddress.districtId, _this.appointment.customerAddress.wardId);

                    _this.dialogWorkingCalendarDetail = true;
				},
				(error) => {
                    console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: 'Có lỗi xảy ra',
					});
				}
			);
        },
        getDistrictByProvince(value) {
            const _this = this;
            _this.districtByProvince = _.filter([..._this.districtMasterData] || [], {'province_code': value ? value : 0});
		},
        getWardByDistrict(value) {
            const _this = this;
            _this.wardByDistrict = _.filter([..._this.wardMasterData] || [], {'district_code': value ? value : 0});
		},
        getFullAddress(building, provinceId, districtId, wardId){
            const _this = this;
            building = building ? building : '';
            var ward = _this.wardByDistrict.find(e => e.value == wardId) ? _this.wardByDistrict.find(e => e.value == wardId).label : '';
            var district = _this.districtByProvince.find(e => e.value == districtId) ? _this.districtByProvince.find(e => e.value == districtId).label : '';
            var province = _this.provinceMasterData.find(e => e.value == provinceId) ? _this.provinceMasterData.find(e => e.value == provinceId).label : '';

            var fullAddress = building + " " + ward + " " + district + " " + province;

            return fullAddress;
        }
    },
}
</script>

<style scoped>
.dialog-title{
    color: #fff;
    line-height: 24px;
    font-size: 18px;
}
.el-avatar{
    position: relative;
}
.el-avatar>img{
    object-fit: cover;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
}
.customerInfo{
    position: relative;
}
.customerInfo::after{
    content: "";
    display: block;
    height:1px;
    background-color: #dcdcdc;
    width: 90%;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}
</style>