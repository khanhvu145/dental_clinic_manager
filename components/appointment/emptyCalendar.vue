<template>
    <div class="row">
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-3">
                    <div class="col-form-label"></div>
                    <div class="col-form-label"></div>
                    <el-radio-group v-model="tabActive" style="margin-top:8px;" @change="changeCurrentDate">
                        <el-radio-button label="morning" :disabled="morningDisabled">Buổi sáng</el-radio-button>
                        <el-radio-button label="afternoon" :disabled="affternoonDisabled">Buổi chiều</el-radio-button>
                    </el-radio-group>
                </div>
                <div class="col-md-3">
                    <div class="col-form-label">Nha sĩ</div>
                    <el-select 
                        v-model="searchQuery.dentistsF" 
                        placeholder="Chọn nha sĩ" 
                        name="dentistsF" 
                        style="width: 100%"
                        clearable 
                        filterable
                        remote
                        multiple
                        :remote-method="(text) => filterDentist(text)"
                        @focus="filterDentist('')"
                        @change="getData"
                    >
                        <el-option
                            v-for="item in dentistData"
                            :key="item._id"
                            :label="`Ns ${item.name}`"
                            :value="item._id"
                        ></el-option>
                    </el-select>
                </div>
                <div class="col-md-3">
                    <div class="col-form-label">Thời gian</div>
                    <el-date-picker
                        name="dateF"
                        v-validate="'required'"
                        type="date"
                        :clearable="false"
                        v-model="searchQuery.dateF"
                        format="dd/MM/yyyy"
                        :picker-options="{ 
                            disabledDate: (time) => disabledDate(time) 
                        }"
                        @change="changeCurrentDate"
                    />
                </div>
                <div class="col-md-3" style="text-align:right;">
                    <div class="col-form-label"></div>
                    <div class="col-form-label"></div>
                    <el-button @click="changeCurrentDate('prev')"><i class='bx bx-left-arrow-alt font-20'></i></el-button>
				    <el-button @click="changeCurrentDate('next')"><i class='bx bx-right-arrow-alt font-20'></i></el-button>
                </div>
            </div>
        </div>
        <div v-loading="dataLoading" v-if="tabActive=='morning'" class="col-md-12 mt-4" :style="{ pointerEvents: morningDisabled ? 'none' : 'auto' }">
            <FullCalendar ref="fullCalendar" :options="calendarOptions" id="fullCalendar">
                <template #eventContent="item">
				    <el-tooltip content="Top center">
                        <div slot="content">
                            <div v-if="item.event.extendedProps.mainCustomer">
                                <div style="font-weigh:bold;margin-bottom:8px;">THÔNG TIN KHÁCH HÀNG</div>
                                <div style="margin-left:8px; margin-bottom:4px;">Mã KH: {{item.event.extendedProps.mainCustomer.code || ''}}</div>
                                <div style="margin-left:8px; margin-bottom:4px;">Họ tên: {{item.event.extendedProps.mainCustomer.name || ''}}</div>
                                <div style="margin-left:8px; margin-bottom:4px;">Số điện thoại: {{item.event.extendedProps.mainCustomer.phone || ''}}</div>
                                <div style="margin-left:8px; margin-bottom:4px;">CMND/CCCD: {{item.event.extendedProps.mainCustomer.physicalId || ''}}</div>
                                <div style="margin-left:8px;">Ngày sinh: {{item.event.extendedProps.mainCustomer.birthday ? $moment(item.event.extendedProps.mainCustomer.birthday).format('DD/MM/YYYY') : ''}}</div>
                            </div>
                            <div style="margin-top:8px;">
                                <div style="font-weigh:bold;margin-bottom:8px;">THÔNG TIN LỊCH HẸN</div>
                                <div style="margin-left:8px; margin-bottom:4px;">Mã lịch hẹn: {{item.event.extendedProps.code || ''}}</div>
                                <div style="margin-left:8px; margin-bottom:4px;">Trạng thái: {{getStatusName(item.event.extendedProps.status)}}</div>
                                <div style="margin-left:8px; margin-bottom:4px;">Ngày hẹn: {{item.event.extendedProps.date ? $moment(item.event.extendedProps.date).format('DD/MM/YYYY') : ''}}</div>
                                <div style="margin-left:8px; margin-bottom:4px;">Thời gian: {{item.event.extendedProps.timeFrom || ''}} - {{item.event.extendedProps.timeTo || ''}}</div>
                                <div style="margin-left:8px;">Nha sĩ phụ trách: {{item.event.extendedProps.dentistName || ''}}</div>
                            </div>
                        </div>
                        <div>
                            <div>{{item.event.extendedProps.code}}</div>
                            <div v-if="item.event.extendedProps.mainCustomer" style="margin-top:6px;">{{item.event.extendedProps.mainCustomer.name}}</div>
                        </div>
                    </el-tooltip>
                </template>
            </FullCalendar>
        </div>
        <div v-loading="dataLoading" v-if="tabActive=='afternoon'" class="col-md-12 mt-4" :style="{ pointerEvents: affternoonDisabled ? 'none' : 'auto' }">
            <FullCalendar ref="fullCalendar2" :options="calendarOptions2" id="fullCalendar2">
                <template #eventContent="item">
				    <el-tooltip content="Top center">
                        <div slot="content">
                            <div v-if="item.event.extendedProps.mainCustomer">
                                <div style="font-weigh:bold;margin-bottom:8px;">THÔNG TIN KHÁCH HÀNG</div>
                                <div style="margin-left:8px; margin-bottom:4px;">Mã KH: {{item.event.extendedProps.mainCustomer.code || ''}}</div>
                                <div style="margin-left:8px; margin-bottom:4px;">Họ tên: {{item.event.extendedProps.mainCustomer.name || ''}}</div>
                                <div style="margin-left:8px; margin-bottom:4px;">Số điện thoại: {{item.event.extendedProps.mainCustomer.phone || ''}}</div>
                                <div style="margin-left:8px; margin-bottom:4px;">CMND/CCCD: {{item.event.extendedProps.mainCustomer.physicalId || ''}}</div>
                                <div style="margin-left:8px;">Ngày sinh: {{item.event.extendedProps.mainCustomer.birthday ? $moment(item.event.extendedProps.mainCustomer.birthday).format('DD/MM/YYYY') : ''}}</div>
                            </div>
                            <div style="margin-top:8px;">
                                <div style="font-weigh:bold;margin-bottom:8px;">THÔNG TIN LỊCH HẸN</div>
                                <div style="margin-left:8px; margin-bottom:4px;">Mã lịch hẹn: {{item.event.extendedProps.code || ''}}</div>
                                <div style="margin-left:8px; margin-bottom:4px;">Trạng thái: {{getStatusName(item.event.extendedProps.status)}}</div>
                                <div style="margin-left:8px; margin-bottom:4px;">Ngày hẹn: {{item.event.extendedProps.date ? $moment(item.event.extendedProps.date).format('DD/MM/YYYY') : ''}}</div>
                                <div style="margin-left:8px; margin-bottom:4px;">Thời gian: {{item.event.extendedProps.timeFrom || ''}} - {{item.event.extendedProps.timeTo || ''}}</div>
                                <div style="margin-left:8px;">Nha sĩ phụ trách: {{item.event.extendedProps.dentistName || ''}}</div>
                            </div>
                        </div>
                        <div>
                            <div>{{item.event.extendedProps.code}}</div>
                            <div v-if="item.event.extendedProps.mainCustomer" style="margin-top:6px;">{{item.event.extendedProps.mainCustomer.name}}</div>
                        </div>
                    </el-tooltip>
                </template>
            </FullCalendar>
        </div>
    </div>
</template>

<script>
import '@fullcalendar/core/vdom';
import FullCalendar from '@fullcalendar/vue';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';
import moment from 'moment';
import scrollgridPlugin from '@fullcalendar/scrollgrid';
import 'bootstrap-icons/font/bootstrap-icons.css'
import { debounce, map, cloneDeep, intersection, filter, find, forEach } from 'lodash';
import { appointmentStatusV2 } from '@/utils/masterData';
export default {
    components: {
		FullCalendar,
	},
    props: {
        diaglogVisible: {
			type: Boolean,
			default: false
		},
        currentId: {
			type: String,
			default: null
		},
        currentDate: {
            type: Date,
            default: function () { return new Date() }
        },
        session: {
			type: String,
			default: 'morning'
		},
        dentistIds: {
			type: Array,
			default: function () { return [] }
		},
        dentistName: {
			type: String,
			default: ''
		},
    },
    watch: {
		diaglogVisible: {
			async handler(newVal, oldVal) {
				const _this = this;
                if(newVal == true) {
                    await _this.getAppointmentConfig();
                    _this.tabActive = _this.session;
                    _this.filterDentist(_this.dentistName);
                    _this.searchQuery = {
                        dentistsF: _this.dentistIds,
                        dateF: _this.checkCurrentDate(_this.currentDate),
                        currentId: _this.currentId
                    };
                    await _this.changeCurrentDate();
                }
			},
			immediate: true,
		},
	},
    data(){
        return {
            dataLoading: false,
            tabActive: 'morning',
            searchQuery: {
                dentistsF: [],
                dateF: new Date(),
                currentId: null
            },
            dentistData: [],
            calendarOptions: {
                schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                locales: [viLocale],
                titleFormat: {
                    month: '2-digit',
                    year: 'numeric',
                    day: '2-digit',
                    weekday: 'long'
                },
                plugins: [ resourceTimeGridPlugin, resourceTimelinePlugin, interactionPlugin, scrollgridPlugin ],
                initialView: 'resourceTimelineDay',
                datesAboveResources: true,
                dayMinWidth: 300,
                height: 600,
                resources: [],
                headerToolbar: {
                    right: false,
                    left: false,
                    center: 'title'
                },
                editable: false,
                resourceAreaHeaderContent: 'Nha sĩ',
                selectable: true,
                selectMirror: true,
                selectOverlap: false,
                expandRows: true,
                scrollTime: moment().format('HH:mm:ss'),
                events: [],
                slotDuration: "00:30:00",
                slotMinTime: "00:00:00",
                slotMaxTime: "12:00:00",
				slotLabelInterval: "00:30:00",
                resourceAreaWidth: "15%",
                hiddenDays: [],
                select: this.handleSelectDate,
            },
            calendarOptions2: {
                schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                locales: [viLocale],
                titleFormat: {
                    month: '2-digit',
                    year: 'numeric',
                    day: '2-digit',
                    weekday: 'long'
                },
                plugins: [ resourceTimeGridPlugin, resourceTimelinePlugin, interactionPlugin, scrollgridPlugin ],
                initialView: 'resourceTimelineDay',
                datesAboveResources: true,
                dayMinWidth: 300,
                height: 600,
                resources: [],
                headerToolbar: {
                    right: false,
                    left: false,
                    center: 'title'
                },
                editable: false,
                resourceAreaHeaderContent: 'Nha sĩ',
                selectable: true,
                selectMirror: true,
                selectOverlap: false,
                expandRows: true,
                scrollTime: moment().format('HH:mm:ss'),
                events: [],
                slotDuration: "00:30:00",
                slotMinTime: "12:00:00",
                slotMaxTime: "24:00:00",
				slotLabelInterval: "00:30:00",
                resourceAreaWidth: "15%",
                hiddenDays: [],
                select: this.handleSelectDate,
            },
            workingTimeDayOfWeek: [],
            dayOff: [],
            data: [],
            morningDisabled: false,
            affternoonDisabled: false,
            viewConfig: {
                new: {},
                arrived: {},
                notArrived: {},
                completed: {},
                cancelled: {}
            }
        }
    },
    async created() { 
        const _this = this;
        await _this.getAppointmentConfig();
        await _this.changeCurrentDate();
    },
    methods: {
        filterDentist: debounce(async function (text) {
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
            let dentists = await _this.$axios.$post('/api/user/getDentistByQuery', query);
            _this.dentistData = dentists && dentists.data;
        }, 200),
        async getAppointmentConfig(){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=WORKING_TIME_MORNING_START`).then(response => {
                _this.calendarOptions.slotMinTime = `${response.value}:00`;
            });
            await _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=WORKING_TIME_MORNING_END`).then(response => {
                _this.calendarOptions.slotMaxTime = `${response.value}:00`;
            });
            await _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=WORKING_TIME_AFTERNOON_START`).then(response => {
                _this.calendarOptions2.slotMinTime = `${response.value}:00`;
            });
            await _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=WORKING_TIME_AFTERNOON_END`).then(response => {
                _this.calendarOptions2.slotMaxTime = `${response.value}:00`;
            });
            await _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=WORKING_TIME_DAY_OF_WEEK`).then(response => {
                var config = JSON.parse(response.value);
                _this.workingTimeDayOfWeek = config;
                var day = config.filter(item => item.active == false);
                _this.dayOff = day.map(item => item.key);
                _this.calendarOptions.hiddenDays = _this.dayOff;
                _this.calendarOptions2.hiddenDays = _this.dayOff;
            });
            
            const viewConfigs = await _this.$axios.$post(`/api/appointmentConfig/getDataByListKey`, [
                'DISPLAY_CONFIG_NEW',
                'DISPLAY_CONFIG_ARRIVED',
                'DISPLAY_CONFIG_NOTARRIVED',
                'DISPLAY_CONFIG_COMPLETED',
                'DISPLAY_CONFIG_CANCELLED'
            ]);
            if(viewConfigs && viewConfigs.length > 0){
                _this.viewConfig.new = _.find(viewConfigs, f => {
                    return f.key === 'DISPLAY_CONFIG_NEW';
                });
                _this.viewConfig.new.value = JSON.parse(_this.viewConfig.new.value);

                _this.viewConfig.arrived = _.find(viewConfigs, f => {
                    return f.key === 'DISPLAY_CONFIG_ARRIVED';
                });
                _this.viewConfig.arrived.value = JSON.parse(_this.viewConfig.arrived.value);

                _this.viewConfig.notArrived = _.find(viewConfigs, f => {
                    return f.key === 'DISPLAY_CONFIG_NOTARRIVED';
                });
                _this.viewConfig.notArrived.value = JSON.parse(_this.viewConfig.notArrived.value);

                _this.viewConfig.completed = _.find(viewConfigs, f => {
                    return f.key === 'DISPLAY_CONFIG_COMPLETED';
                });
                _this.viewConfig.completed.value = JSON.parse(_this.viewConfig.completed.value);

                _this.viewConfig.cancelled = _.find(viewConfigs, f => {
                    return f.key === 'DISPLAY_CONFIG_CANCELLED';
                });
                _this.viewConfig.cancelled.value = JSON.parse(_this.viewConfig.cancelled.value);
            }

            _this.dataLoading = false;
        },
        disabledDate(date){
            const _this = this;
            return (moment(moment(date).format('YYYY/MM/DD')).isBefore(moment().format('YYYY/MM/DD')) || _this.dayOff.includes(moment(date).day()));
        },
        async changeCurrentDate(type){
            const _this = this;

            if(_this.searchQuery.dateF == null || _this.searchQuery.dateF == ''){
                _this.searchQuery.dateF = _this.checkCurrentDate(new Date());
            }

            if(type == "next")
			{
                var oldDate = new Date(_this.$moment(_.cloneDeep(_this.searchQuery.dateF)));
				var date = new Date(_this.$moment(_.cloneDeep(_this.searchQuery.dateF)).add(1, 'days'));
                if(_this.dayOff.includes(moment(date).day())){
                    date = new Date(_this.$moment(_.cloneDeep(date)).add(1, 'days'));
                }
                if(moment(moment(date).format('YYYY/MM/DD')).isBefore(moment().format('YYYY/MM/DD'))){
                    date = oldDate;
                }
                _this.searchQuery.dateF = date;
			}
			else if (type == "prev")
			{
                var oldDate = new Date(_this.$moment(_.cloneDeep(_this.searchQuery.dateF)));
				var date = new Date(_this.$moment(_.cloneDeep(_this.searchQuery.dateF)).add(-1, 'days'));
                 if(_this.dayOff.includes(moment(date).day())){
                    date = new Date(_this.$moment(_.cloneDeep(date)).add(-1, 'days'));
                }
                if(moment(moment(date).format('YYYY/MM/DD')).isBefore(moment().format('YYYY/MM/DD'))){
                    date = oldDate;
                }
                _this.searchQuery.dateF = date;
			}

            // Xử lý giờ làm việc sáng - chiều
            var currentDay = moment(_this.searchQuery.dateF).day();
            var dayConfig = _.find(_this.workingTimeDayOfWeek, f => {
                return f.key == currentDay;
            });
            if(dayConfig){
                if(dayConfig.active){
                    if(dayConfig.session && dayConfig.session.length > 0){
                        if(dayConfig.session.includes('morning') && dayConfig.session.includes('afternoon')){
                            _this.morningDisabled = false;
                            _this.affternoonDisabled = false;
                        }
                        else if(dayConfig.session.includes('morning')){
                            _this.morningDisabled = false;
                            _this.affternoonDisabled = true;
                            _this.tabActive = 'morning';
                        }
                        else if(dayConfig.session.includes('afternoon')){
                            _this.morningDisabled = true;
                            _this.affternoonDisabled = false;
                            _this.tabActive = 'afternoon';
                        }
                        else{
                            _this.morningDisabled = true;
                            _this.affternoonDisabled = true;
                            _this.tabActive = 'morning';
                        }
                    }
                    else{
                        _this.morningDisabled = true;
                        _this.affternoonDisabled = true;
                        _this.tabActive = 'morning';
                    }
                }
                else{
                    _this.morningDisabled = true;
                    _this.affternoonDisabled = true;
                    _this.tabActive = 'morning';
                }
            }

            //Xử lý chuyển lịch
            if(_this.$refs.fullCalendar){
                _this.$refs.fullCalendar.getApi().gotoDate(_this.searchQuery.dateF);
            }
            if(_this.$refs.fullCalendar2){
                _this.$refs.fullCalendar2.getApi().gotoDate(_this.searchQuery.dateF);
            }

            await _this.getData()
        },
        async getData(){
            const _this = this;
            _this.dataLoading = true;
            // Lấy danh sách nha sĩ
            var dentists = await _this.$axios.$get('/api/user/getDentist');
            var dentistList = dentists && dentists.data;
            if(_this.searchQuery.dentistsF && _this.searchQuery.dentistsF.length > 0){
                dentistList = _.filter(dentistList, function(item) {
                    return _this.searchQuery.dentistsF.includes(item._id);
                });
            }
            _this.calendarOptions.resources = dentistList.map(item => {
                return {
                    id: item._id,
                    title: `Ns.${item.name}`,
                }
            });
            _this.calendarOptions2.resources = dentistList.map(item => {
                return {
                    id: item._id,
                    title: `Ns.${item.name}`,
                }
            });

            // Lấy danh sách lịch hẹn
            await _this.$axios.$post('/api/appointmentBooking/getEmptyCalendar', _this.searchQuery).then(
                (response) => {
                    if(response.data.length > 0){
                        var dataMorning = response.data.filter(f => {
                            return f.session == 'morning';
                        });
                        if(dataMorning && dataMorning.length > 0){
                            _this.calendarOptions.events = _.map(dataMorning, item => {
                                var config = _this.getValueViewConfig(item.status);
                                return { 
                                    resourceId: item.dentistId,
                                    start: item.dateTimeFrom,
                                    end: item.dateTimeTo,
                                    color: config ? config.backgroundColor : '#8fdf82',
                                    textColor: config ? config.textColor : '#fff',
                                    borderColor: config ? config.borderColor : '#8fdf82',
                                    extendedProps: item
                                }
                            });
                        }
                        else{
                            _this.calendarOptions.events = [];
                        }

                        var dataAfternoon = response.data.filter(f => {
                            return f.session == 'afternoon';
                        });
                        if(dataAfternoon && dataAfternoon.length > 0){
                            _this.calendarOptions2.events = _.map(dataAfternoon, item => {
                                var config = _this.getValueViewConfig(item.status);
                                return { 
                                    resourceId: item.dentistId,
                                    start: item.dateTimeFrom,
                                    end: item.dateTimeTo,
                                    color: config ? config.backgroundColor : '#8fdf82',
                                    textColor: config ? config.textColor : '#fff',
                                    borderColor: config ? config.borderColor : '#8fdf82',
                                    extendedProps: item
                                }
                            });
                        }
                        else{
                            _this.calendarOptions2.events = [];
                        }
                    }
                    else{
                        _this.calendarOptions.events = [];
                        _this.calendarOptions2.events = [];
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

            _this.dataLoading = false;
        },
        handleSelectDate(clickInfo){
            const _this = this;
			var timesheetStart = _this.$moment(clickInfo.start).utc().unix();
			var timesheetEnd = _this.$moment(clickInfo.end).utc().unix();
			var timesheetNow = _this.$moment().utc().unix();
            if(timesheetNow > timesheetStart || timesheetNow > timesheetEnd)
			{
				_this.$message({
					type: 'error',
					message: 'Vui lòng không chọn ngày giờ hẹn quá khứ',
				});
				return;
			}
            _this.$confirm(`<div>Thời gian: <span style="font-weight:bold">${moment(clickInfo.start).format('DD/MM/YYYY')} ${moment(clickInfo.start).format('HH:mm')} - ${moment(clickInfo.end).format('HH:mm')}</span></div><div>Nha sĩ phụ trách: <span style="font-weight:bold">${clickInfo.resource.title}</span></div>`, 'Thời gian đã chọn', {
                dangerouslyUseHTMLString: true,
                distinguishCancelAndClose: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = 'Đang xử lý...';
                        setTimeout(() => {
                            done();
                            setTimeout(() => {
                                instance.confirmButtonLoading = false;
                            }, 30);
                        }, 300);
                    } else {
                        done();
                    }
                }
            }).then((action) => {
                if(action === 'confirm'){
                    clickInfo.session = _this.tabActive;
                    _this.$emit('selectEmptyCalendar', clickInfo);
                }
            });
        },
        getValueViewConfig(type){
            const _this = this;
            switch(type) {
                case 'new':
                    return _this.viewConfig.new.value;
                case 'arrived':
                    return _this.viewConfig.arrived.value;
                case 'notarrived':
                    return _this.viewConfig.notArrived.value;
                case 'completed':
                    return _this.viewConfig.completed.value;
                case 'cancelled':
                    return _this.viewConfig.cancelled.value;
                default:
                    return {
                        textColor: '#fff',
                        backgroundColor: '#8fdf82',
                        borderColor: '#8fdf82',
                    }
            }
        },
        checkCurrentDate(date){
            const _this = this;
            if(_this.dayOff.includes(moment(date).day())){
                date = new Date(_this.$moment(_.cloneDeep(date)).add(1, 'days'));
                _this.checkCurrentDate(date);
            }
            return date;
        },
        getStatusName(value){
            const _this = this;
            var data = _.find(appointmentStatusV2, item => {
                return item.value == value;
            });
            return data ? data.label : '';
        }
    }
}
</script>