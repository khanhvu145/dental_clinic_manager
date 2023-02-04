<template>
    <div class="row">
        <div class="col-md-12">
            <FullCalendar ref="calendarByDentist" :options="options" />
        </div>
    </div>
</template>

<script>
import '@fullcalendar/core/vdom';
import FullCalendar from '@fullcalendar/vue';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';
import moment from 'moment';
import scrollgridPlugin from '@fullcalendar/scrollgrid';
import User from '@/models/tw_User';
export default {
    components: {
		FullCalendar,
	},
    props: ['dentistId', 'appointmentConfig'],
    data(){
        var _this = this;
        var dayOff = _this.appointmentConfig.workingTime.dayOfWeek.filter(item => item.value == false);
        dayOff = dayOff.map(item => item.key);
        var timeAMFrom = _this.appointmentConfig.workingTime.timeAM.timeFrom + ':00';
        var timeAMTo = _this.appointmentConfig.workingTime.timeAM.timeTo + ':00';
        var timePMFrom = _this.appointmentConfig.workingTime.timePM.timeFrom + ':00';
        var timePMTo = _this.appointmentConfig.workingTime.timePM.timeTo + ':00';
        var applyConfig = _this.appointmentConfig.workingTime.apply;
        return {
            options: {
                schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                locales: [viLocale],
                plugins: [resourceTimeGridPlugin, scrollgridPlugin, interactionPlugin],
                initialView: 'resourceTimeGridWeek',
                dayMinWidth: 'auto',
                height: 600,
                resources: [],
                headerToolbar: {
                    right: 'prev today next',
                    left: 'title'
                },
                editable: false,
                selectable: true,
                selectMirror: true,
                select: this.handleDateSelect,
                selectOverlap: false,
                selectAllow: function(selectInfo) {
                    if(applyConfig){
                        var check = false;
                        if(
                            (
                                moment(selectInfo.start).isBetween((moment(selectInfo.start).format('YYYY-MM-DD') + ' ' + timeAMFrom), (moment(selectInfo.start).format('YYYY-MM-DD') + ' ' + timeAMTo), undefined, '[)') &&
                                moment(selectInfo.end).isBetween((moment(selectInfo.end).format('YYYY-MM-DD') + ' ' + timeAMFrom), (moment(selectInfo.end).format('YYYY-MM-DD') + ' ' + timeAMTo), undefined, '(]')
                            ) 
                            ||
                            (
                                moment(selectInfo.start).isBetween((moment(selectInfo.start).format('YYYY-MM-DD') + ' ' + timePMFrom), (moment(selectInfo.start).format('YYYY-MM-DD') + ' ' + timePMTo), undefined, '[)') &&
                                moment(selectInfo.end).isBetween((moment(selectInfo.end).format('YYYY-MM-DD') + ' ' + timePMFrom), (moment(selectInfo.end).format('YYYY-MM-DD') + ' ' + timePMTo), undefined, '(]')
                            )
                        ){
                            check = true;
                        }
                        if((moment().diff(selectInfo.start) <= 0) == false || dayOff.includes(moment(selectInfo.start).day()) == true || check == false) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                    else{
                        return moment().diff(selectInfo.start) <= 0;
                    }
                },
                hiddenDays: applyConfig ? dayOff : [],
                slotDuration: '00:05:00',
                slotLabelInterval: '00:15:00',
                expandRows: true,
                scrollTime: moment().format('HH:mm:ss'),
                events: [],
                eventTextColor: '#fff',
                eventBackgroundColor: '#8fdf82',
                eventBorderColor: '#8fdf82',
            },
            dentistInfo: new User()
        }
    },
    async created() { 
        const _this = this;
        _this.getData();
    },
    methods: {
        async getData(){
            const _this = this;
            _this.options.resources = [];
            await _this.$axios.$get(`/api/user/getById/${_this.dentistId}`).then(
				async (response) => {
                    _this.dentistInfo = response.data || new User();
				},
				(error) => {
                    console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: 'Có lỗi xảy ra',
					});
				}
			);
            _this.options.resources.push(
                {
                    id: _this.dentistInfo._id,
                    title: _this.dentistInfo.name,
                }
            );
            await _this.$axios.$get(`/api/appointment/getCalendarByDentist/${_this.dentistId}`).then(
                (response) => {
                    if(response.data.length > 0){
                        _this.options.events = response.data.map(item => {
                            return {
                                resourceId: item.dentistId,
                                start: item.timeFrom,
                                end: item.timeTo,
                            }
                        })
                    }
                    else{
                        _this.options.events = [];
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
        },
        handleDateSelect(clickInfo) {
            const _this = this;
            this.$confirm(`<div>Thời gian: <span style="font-weight:bold">${moment(clickInfo.start).format('DD/MM/YYYY HH:mm')} - ${moment(clickInfo.end).format('DD/MM/YYYY HH:mm')}</span></div><div>Nha sĩ phụ trách: <span style="font-weight:bold">${clickInfo.resource.title}</span></div>`, 'Thông tin đã chọn', {
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
                    _this.$emit('select-empty-calendar', clickInfo);
                }
            });
		},
    },
}
</script>