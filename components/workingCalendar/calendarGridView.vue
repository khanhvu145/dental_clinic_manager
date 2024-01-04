<template>
    <div class="row" v-loading="dataLoading">
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-6 mt-2" style="font-weight:500;font-size:27px;text-transform:capitalize;">
                    {{$moment(dateF).format("dddd, DD/MM/YYYY")}}
                </div>
                <div v-if="!dataLoading" class="col-md-6 mt-2" style="text-align:right;">
                    <el-tag :style="getValueViewConfigV2('new')">
                        {{ getStatusName('new') }}
                    </el-tag>
                    <el-tag :style="getValueViewConfigV2('arrived')">
                        {{ getStatusName('arrived') }}
                    </el-tag>
                    <el-tag :style="getValueViewConfigV2('notarrived')">
                        {{ getStatusName('notarrived') }}
                    </el-tag>
                    <el-tag :style="getValueViewConfigV2('completed')">
                        {{ getStatusName('completed') }}
                    </el-tag>
                    <el-tag :style="getValueViewConfigV2('cancelled')">
                        {{ getStatusName('cancelled') }}
                    </el-tag>
                </div>
            </div>
        </div>
        <div class="col-md-12">
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
                        <div style="height:100%;cursor:pointer;">
                            <span>{{item.event.extendedProps.timeFrom || ''}} - {{item.event.extendedProps.timeTo || ''}}</span> - 
                            <span style="margin-left:6px;">{{item.event.extendedProps.code || ''}}</span> - 
                            <span v-if="item.event.extendedProps.mainCustomer" style="margin-left:6px;">{{item.event.extendedProps.mainCustomer.name || ''}}</span>
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
import timegrid from '@fullcalendar/timegrid';
import daygrid from '@fullcalendar/daygrid';
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
        appointmentData: {
			type: Array,
			default() {
            	return []
        	},
		},
        dateF: {
            type: Date,
            default: function () { return new Date() }
        },
        dataLoading: {
            type: Boolean,
            default: function () { return true }
        },
    },
    watch: {
        appointmentData: {
			async handler(newVal, oldVal) {
				const _this = this;
                //Xử lý chuyển lịch
                if(_this.$refs.fullCalendar){
                    _this.$refs.fullCalendar.getApi().gotoDate(_this.dateF);
                }
                await _this.getData();
			},
			immediate: true,
		},
    },
    data(){
        return {
            calendarOptions: {
                schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                locales: [viLocale],
                titleFormat: {
                    month: '2-digit',
                    year: 'numeric',
                    day: '2-digit',
                    weekday: 'long'
                },
                plugins: [timegrid, daygrid, scrollgridPlugin, interactionPlugin],
                initialView: 'timeGridDay',
                dayMinWidth: 'auto',
                height: 'auto',
                headerToolbar: {
                    right: false,
                    left: false,
                    center: false,
                },
                editable: false,
                droppable:false,
                scrollTime: moment().format('HH:mm:ss'),
                events: [],
                slotDuration: "00:30:00",
                slotMinTime: "00:00:00",
                slotMaxTime: "12:00:00",
				slotLabelInterval: "00:30:00",
                hiddenDays: [],
                eventClick: this.handleEventClick,
                allDaySlot: false
            },
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
        await _this.getData();
    },
    methods: {
        async getAppointmentConfig(){
            const _this = this;
            await _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=WORKING_TIME_MORNING_START`).then(response => {
                _this.calendarOptions.slotMinTime = `${response.value}:00`;
            });
            await _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=WORKING_TIME_AFTERNOON_END`).then(response => {
                _this.calendarOptions.slotMaxTime = `${response.value}:00`;
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
        },
        async getData(){
            const _this = this;
            if(_this.appointmentData && _this.appointmentData.length > 0){
                _this.calendarOptions.events =  _.map(_this.appointmentData, e => {
                    var config = _this.getValueViewConfig(e.status);
					return { 
						resourceId: e._id, 
						start: e.dateTimeFrom, 
						end: e.dateTimeTo,
                        color: config ? config.backgroundColor : '#8fdf82',
                        textColor: config ? config.textColor : '#fff',
                        borderColor: config ? config.borderColor : '#8fdf82',
						extendedProps: e
					}
				});
            }
            else{
                _this.calendarOptions.events = [];
            }
        },
        getStatusName(value){
            const _this = this;
            var data = _.find(appointmentStatusV2, item => {
                return item.value == value;
            });
            return data ? data.label : '';
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
        getValueViewConfigV2(type){
            const _this = this;
            switch(type) {
                case 'new':
                    var config = _this.viewConfig.new.value;
                    return {
                        'background-color': config ? config.backgroundColor : '#8fdf82',
                        'border-color': config ? config.borderColor : '#8fdf82',
                        'color': config ? config.textColor : '#fff'
                    }
                case 'arrived':
                    var config = _this.viewConfig.arrived.value;
                    return {
                        'background-color': config ? config.backgroundColor : '#8fdf82',
                        'border-color': config ? config.borderColor : '#8fdf82',
                        'color': config ? config.textColor : '#fff'
                    }
                case 'notarrived':
                    var config = _this.viewConfig.notArrived.value;
                    return {
                        'background-color': config ? config.backgroundColor : '#8fdf82',
                        'border-color': config ? config.borderColor : '#8fdf82',
                        'color': config ? config.textColor : '#fff'
                    }
                case 'completed':
                    var config = _this.viewConfig.completed.value;
                    return {
                        'background-color': config ? config.backgroundColor : '#8fdf82',
                        'border-color': config ? config.borderColor : '#8fdf82',
                        'color': config ? config.textColor : '#fff'
                    }
                case 'cancelled':
                    var config = _this.viewConfig.cancelled.value;
                    return {
                        'background-color': config ? config.backgroundColor : '#8fdf82',
                        'border-color': config ? config.borderColor : '#8fdf82',
                        'color': config ? config.textColor : '#fff'
                    }
                default:
                    return {
                        'color': '#fff',
                        'background-color': '#8fdf82',
                        'border-color': '#8fdf82',
                    }
            }
        },
        handleEventClick(evenInfo){
			const _this = this;
            if(evenInfo.event.extendedProps && evenInfo.event.extendedProps._id){
                _this.$emit('openDialogDetail', evenInfo.event.extendedProps._id);
            }
		},
    }
}
</script>