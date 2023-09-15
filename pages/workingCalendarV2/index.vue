<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Lịch làm việc</div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-3 mb-2">
                        <el-button @click="changeCurrentDate('prev')"><i class='bx bx-left-arrow-alt font-20'></i></el-button>
                        <el-button @click="changeCurrentDate('today')"><i class='bx bx-calendar-check font-20'></i></el-button>
                        <el-button @click="changeCurrentDate('next')"><i class='bx bx-right-arrow-alt font-20'></i></el-button>
                    </div>
                    <div class="col-md-3 mb-2">
                        <el-select v-model="searchQuery.statusF" placeholder="Trạng thái..." filterable multiple clearable name="statusF" @change="getData">
                            <el-option
                                v-for="item in statusData"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="col-md-3 mb-2">
                        <el-date-picker
                            name="dateF"
                            v-validate="'required'"
                            type="date"
                            :clearable="false"
                            v-model="searchQuery.dateF"
                            format="dd/MM/yyyy"
                            @change="changeCurrentDate"
                        />
                    </div>
                    <div class="col-md-3 mb-2" style="text-align:right;">
                        <el-radio-group v-model="tabActive" @change="changeCurrentDate">
                            <el-radio-button label="timeLine">
                                <i class='bx bxs-grid-alt' ></i>
                            </el-radio-button>
                            <el-radio-button label="grid">
                                <i class='bx bxs-calendar' ></i>
                            </el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <div v-if="tabActive=='timeLine'" class="row mt-2 mb-4">
                    <div class="col-md-12">
                        <CalendarTimeLineView
                            :appointmentData="data"
                            :dateF="searchQuery.dateF"
                            :dataLoading="dataLoading"
                            @openDialogDetail="openDialogDetail" 
                        ></CalendarTimeLineView>
                    </div>
                </div>
                <div v-if="tabActive=='grid'" class="row mt-2 mb-4">
                    <div class="col-md-12">
                        <CalendarTimeGridView
                            :appointmentData="data"
                            :dateF="searchQuery.dateF"
                            :dataLoading="dataLoading"
                            @openDialogDetail="openDialogDetail" 
                        ></CalendarTimeGridView>
                    </div>
                </div>
            </div>
            <!-- Dialog chi tiết lịch hẹn -->
            <el-dialog :visible.sync="dialogDetail.visible" :close-on-click-modal="false" width="40%">
                <span slot="title" class="dialog-title">
                    <span style="color: #FFF;">
                        Chi tiết lịch hẹn |
                    </span>
                    <span style="color: #FFCC33; font-weight: bold;">
                        {{ getStatusName(dialogDetail.data.status) }}
                    </span>
                </span>
                <div class="row">
                    <div class="col-md-12 customerInfo pb-2">
                        <div class="row">
                            <div class="col-md-12 mb-4">
                                <span style="font-weight: bold;">Thông tin khách hàng</span>
                            </div>
                            <div v-if="dialogDetail.data.mainCustomer" class="col-md-12">
                                <div class="row">
                                    <div class="col-md-6 mb-3" style="word-break: break-word;">
                                        Mã khách hàng:
                                        <span style="font-weight: bold;">{{ dialogDetail.data.mainCustomer.code || '' }}</span>
                                    </div>
                                    <div class="col-md-6 mb-3" style="word-break: break-word;">
                                        Họ tên:
                                        <span style="font-weight: bold;">{{ dialogDetail.data.mainCustomer.name || '' }}</span>
                                    </div>
                                    <div class="col-md-6 mb-3" style="word-break: break-word;">
                                        CMND/CCCD:
                                        <span style="font-weight: bold;">{{ dialogDetail.data.mainCustomer.physicalId || '' }}</span>
                                    </div>
                                    <div class="col-md-6 mb-3" style="word-break: break-word;">
                                        Số điện thoại:
                                        <span style="font-weight: bold;">{{ dialogDetail.data.mainCustomer.phone || '' }}</span>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        Ngày sinh:
                                        <span style="font-weight: bold;">{{ $moment(dialogDetail.data.mainCustomer.birthday).format('DD/MM/YYYY') || '' }}</span>
                                    </div>
                                    <div class="col-md-6 mb-3" style="word-break: break-word;">
                                        Giới tính:
                                        <span style="font-weight: bold;">{{ dialogDetail.data.mainCustomer.gender == 'male' ? 'Nam' : 'Nữ' }}</span>
                                    </div>
                                    <div class="col-md-12 mb-3" style="word-break: break-word;">
                                        Địa chỉ:
                                        <span style="font-weight: bold;">{{ dialogDetail.data.mainCustomer.fullAddress || '' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12 mt-3">
                        <div class="row">
                            <div class="col-md-12 mb-4">
                                <span style="font-weight: bold;">Thông tin lịch hẹn</span>
                            </div>
                            <div class="col-md-12">
                                <div class="row">
                                    <div class="col-md-6 mb-3" style="word-break: break-word;">
                                        Mã lịch hẹn:
                                        <span style="font-weight: bold;">{{ dialogDetail.data.code || '' }}</span>
                                    </div>
                                    <div class="col-md-6 mb-3" style="word-break: break-word;">
                                        Nha sĩ phụ trách:
                                        <span style="font-weight: bold;">{{ dialogDetail.data.dentistName || '' }}</span>
                                    </div>
                                    <div class="col-md-6 mb-3" style="word-break: break-word;">
                                        Ngày hẹn:
                                        <span style="font-weight: bold;">{{ $moment(dialogDetail.data.date).format('DD/MM/YYYY') || '' }}</span>
                                    </div>
                                    <div class="col-md-6 mb-3" style="word-break: break-word;">
                                        Thời gian:
                                        <span style="font-weight: bold;">{{ dialogDetail.data.timeFrom || '' }}</span>
                                        -
                                        <span style="font-weight: bold;">{{ dialogDetail.data.timeTo || '' }}</span>
                                    </div>
                                    <div class="col-md-6 mb-3" style="word-break: break-word;">
                                        Loại lịch hẹn:
                                        <span style="font-weight: bold;">
                                            {{ getTypeName(dialogDetail.data.type) }}
                                        </span>
                                    </div>
                                    <div class="col-md-6 mb-3" style="word-break: break-word;">
                                        Nội dung:
                                        <span style="font-weight: bold;">
                                            {{ getContentName(dialogDetail.data.content) }}
                                        </span>
                                    </div>
                                    <div class="col-md-12 mb-3" style="word-break: break-word;">
                                        Ghi chú:
                                        <span style="font-weight: bold;">{{ dialogDetail.data.note || '' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <a v-if="dialogDetail.data.mainCustomer" :href="`/customer/${dialogDetail.data.mainCustomer._id}/profile`" target="_blank" class="control-btn green">
                        Xem hồ sơ
                    </a>
                    <a v-if="dialogDetail.data.status == 'arrived'" href='javascript:void(0)' @click="completeBooking(dialogDetail.data._id)" class="control-btn yellow">
                        Hoàn thành
                    </a>
                    <button type="button" class="control-btn gray" @click="dialogDetail.visible = false">
                        <span>Đóng</span>
                    </button>
                </span>
            </el-dialog>
        </div>
        <div v-else>
            <el-empty description="Bạn không có quyền !!"></el-empty>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import { debounce, map, cloneDeep, intersection, filter, find, forEach } from 'lodash';
import CalendarTimeLineView from '@/components/workingCalendar/calendarTimeLineView';
import CalendarTimeGridView from '@/components/workingCalendar/calendarGridView';
import { appointmentStatusV2 } from '@/utils/masterData';
import Appointment from '@/models/tw_Appointment_Booking';
export default {
    components: {
		CalendarTimeLineView,
        CalendarTimeGridView
	},
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user
		}),
	},
    data(){
        return {
            dataLoading: true,
            searchQuery: {
                dateF: new Date(),
                statusF: ['new', 'arrived', 'completed'],
            },
            statusData: appointmentStatusV2,
            tabActive: 'timeLine',
            data: [],
            dialogDetail: {
                visible: false,
                data: new Appointment()
            },
            appointmentType: [],
            appointmentContent: [],
        }
    },
    async created(){
        const _this = this;
        //Lấy danh sách loại lịch hẹn
        _this.appointmentType = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigAppointmentType' })) || [];
        //Lấy danh sách nội dung lịch hẹn
        _this.appointmentContent = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigAppointmentContent' })) || [];
        
        //Lấy danh sách lịch hẹn
        await _this.getData();
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['workingCalendar.all', 'workingCalendar.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        async getData(){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/workingCalendar/getWorkingCalendar', _this.searchQuery).then( 
                (response) => {
                    if(response.success){
                        _this.data = response.data || [];
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
            setTimeout(() => {
                _this.dataLoading = false;
            }, 500);
        },
        async changeCurrentDate(type){
            const _this = this;
            if(_this.searchQuery.dateF == null || _this.searchQuery.dateF == ''){
                _this.searchQuery.dateF = _this.checkCurrentDate(new Date());
            }
            if(type == "next")
			{
                _this.searchQuery.dateF = new Date(_this.$moment(_.cloneDeep(_this.searchQuery.dateF)).add(1, 'days'));
			}
            else if (type == "prev")
			{
                _this.searchQuery.dateF = new Date(_this.$moment(_.cloneDeep(_this.searchQuery.dateF)).add(-1, 'days'));
			}
            else if (type == "today")
			{
                _this.searchQuery.dateF = new Date(_this.$moment());
			}

            await _this.getData()
        },
        getStatusName(value){
            const _this = this;
            var data = _.find(appointmentStatusV2, item => {
                return item.value == value;
            });
            return data ? data.label : '';
        },
        getTypeName(value){
            const _this = this;
            var data = _.find(_this.appointmentType, item => {
                return item.value == value;
            });
            return data ? data.label : '';
        },
        getContentName(value){
            const _this = this;
            var data = _.find(_this.appointmentContent, item => {
                return item.value == value;
            });
            return data ? data.label : '';
        },
        async openDialogDetail(e){
            const _this = this;
            if(e){
                await _this.$axios.$post('/api/workingCalendar/getById', { 
                    id: e
                }).then(
                    (response) => {
                        if(response.success){
                            _this.dialogDetail.data = response.data || new Appointment();
                            _this.dialogDetail.visible = true;
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
        },
        async completeBooking(id){
            const _this = this;
            if(id){
                _this.$confirm('Bạn có chắc muốn hoàn thành lịch hẹn này?', 'Xác nhận', {
                    confirmButtonText: 'Xác nhận',
                    cancelButtonText: 'Đóng',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(async () => {
                    _this.dataLoading = true;
                    try{
                        const data = await _this.$axios.$post('/api/appointmentBooking/completeBooking', { ids: [id] });
                        if(data.success && data.successCount > 0){
                            _this.$message({
                                message: 'Hoàn thành lịch hẹn thành công',
                                type: 'success',
                            });
                            _this.dialogDetail.visible = false;
                            _this.dialogDetail.data = new Appointment();
                            await _this.getData();
                        }else {
                            _this.$message.error('Hoàn thành lịch hẹn không thành công');
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
                }).catch(() => {});;
            }
        },
    }
}
</script>