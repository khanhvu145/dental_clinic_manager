<template>
    <div class="row">
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-4">
                    <div class="col-form-label">Nha sĩ</div>
                    <el-select v-model="searchQuery.dentistsF" placeholder="Chọn nha sĩ" name="dentistId" multiple clearable filterable>
                        <el-option
                            v-for="item in dentistList"
                            :key="item._id"
                            :label="`Ns ${item.name}`"
                            :value="item._id"
                        ></el-option>
                    </el-select>
                </div>
                <div class="col-md-4">
                    <div class="col-form-label">Thời gian</div>
                    <el-date-picker
                        v-model="searchQuery.dateF"
                        type="date"
                        format="dd/MM/yyyy"
                        placeholder="Chọn thời gian"
                    ></el-date-picker>
                </div>
                <div class="col-md-4">
                    <div class="col-form-label"></div>
                    <div class="col-form-label"></div>
                    <button type="button" class="control-btn green" style="margin-top: 8px;" @click="searchEmptyCalendar(searchQuery)">
                        <i class='bx bx-search'></i>
                        Tìm
                    </button>
                </div>
            </div>
        </div>
        <div class="col-md-12 mt-4">
            <FullCalendar ref="emptyCalendar" :options="options" />
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
export default {
    components: {
		FullCalendar,
	},
    data(){
        return {
            options: {
                schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                locales: [viLocale],
                plugins: [ resourceTimeGridPlugin, resourceTimelinePlugin, interactionPlugin, scrollgridPlugin ],
                initialView: 'resourceTimeGridDay',
                datesAboveResources: true,
                dayMinWidth: 300,
                aspectRatio: 2,
                resources: [],
                headerToolbar: {
                    right: 'type_1,type_2',
                    left: 'prev today next',
                    center: 'title'
                },
                views: {
                    type_1: {
                        type: 'resourceTimeGridDay',
                        buttonText: 'Dọc'
                    },
                    type_2: {
                        type: 'resourceTimelineDay',
                        buttonText: 'Ngang'
                    },
                },
                editable: false,
                resourceAreaHeaderContent: 'Nha sĩ',
                selectable: true,
                selectMirror: true,
                select: this.handleDateSelect,
                selectOverlap: false,
                selectAllow: function(selectInfo) {
                    return moment().diff(selectInfo.start) <= 0;
                },
                slotDuration: '00:05:00',
                slotLabelInterval: '00:15:00',
                expandRows: true,
                scrollTime: moment().format('HH:mm:ss'),
                events: [],
                eventTextColor: '#fff',
                eventBackgroundColor: '#8fdf82',
                eventBorderColor: '#8fdf82',
            },
            searchQuery: {
                dentistsF: [],
                dateF: ''
            },
            dentistList: [],
        }
    },
    async created() { 
        const _this = this;
        _this.getData();
    },
    methods: {
        searchEmptyCalendar(searchQuery){
            const _this = this;
            if(searchQuery.dentistsF.length > 0 && searchQuery.dentistsF != null){
                _this.options.resources = _this.searchQuery.dentistsF.map(item => {
                    return {
                        id: _this.dentistList.find(s => s._id == item)._id,
                        title: _this.dentistList.find(s => s._id == item).name,
                    }
                })
            }
            else{
                _this.options.resources = _this.dentistList.map(item => {
                    return {
                        id: item._id,
                        title: item.name,
                    }
                })
            }
            
            if(searchQuery.dateF != '' && searchQuery.dateF != null){
                _this.$refs.emptyCalendar.getApi().gotoDate(searchQuery.dateF);
            }
            else{
                _this.$refs.emptyCalendar.getApi().gotoDate(moment()._d);
            }
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
        async getData(){
            const _this = this;
            await _this.$axios.$get('/api/user/getDentist').then(
                (response) => {
                    _this.dentistList = response.data || [];
                },
                (error) => {
                    console.log('Error: ', error);
                    _this.$message({
                        type: 'error',
                        message: 'Có lỗi xảy ra',
                    });
                }
            );
            _this.options.resources = _this.dentistList.map(item => {
                return {
                    id: item._id,
                    title: item.name,
                }
            })
            await _this.$axios.$get('/api/appointment/getEmptyCalendar').then(
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
        }
    },
}
</script>