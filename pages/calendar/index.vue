<template>
    <div class="wrapper">
        <div class="content">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Lịch làm việc</div>
                    </div>
                </div>
                <div class="row" style="margin-top: 9px;">
                    <div class="col-md-12" style="text-align: right;">
                        <el-tooltip class="item" effect="light" content="Dạng lịch" placement="top-start">
                            <button type="button" class="control-btn calendar-type-btn" :class="{ active: isActiveBtn }" v-on:click="calendarView">
                                <i class='bx bx-calendar'></i>
                            </button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="Dạng danh sách" placement="top-start">
                            <button type="button" class="control-btn calendar-type-btn" :class="{ active: !isActiveBtn }" v-on:click="gridView">
                                <i class='bx bx-list-ul' ></i>
                            </button>
                        </el-tooltip>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3" style="margin-top: 46px;">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="col-form-label">Khách hàng</div>
                                <el-select v-model="input" clearable filterable placeholder="Mã, tên khách hàng" name="customerId">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                                </el-select>
                            </div>
                             <div class="col-md-12">
                                <div class="col-form-label">Ngày hẹn</div>
                                <div class="block">
                                    <el-date-picker
                                        v-model="value1"
                                        type="date"
                                        format="dd/MM/yyyy"
                                        value-format="yyyy-MM-dd"
                                        placeholder="Ngày hẹn">
                                    </el-date-picker>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="col-form-label">Trạng thái</div>
                                <el-select v-model="input" multiple filterable placeholder="Trạng thái" name="status">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </div>
                            <div class="col-md-12 mt-3">
                                <div style="display: flex; height: 100%; align-items: end; gap: 8px;">
                                    <button type="submit" class="control-btn green" style="flex: 1;">
                                        <i class='bx bx-search'></i>
                                        Tìm
                                    </button>
                                    <a href="" class="control-btn gray appointment__heading-refresh">
                                        <i class='bx bx-refresh'></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-9">
                        <div class="row mt-3 mb-5" >
                            <div class="col-md-12">
                                <FullCalendar
                                    ref="calendar"
                                    :layoutCalendarType="layoutCalendarType"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FullCalendar from '@/components/calendar/Calendar';
import { mapState } from 'vuex';
export default {
    components: {
		FullCalendar,
	},

    data(){
        return {
            isActiveBtn: true,
            input: '',
            value1: ''
        }
    },
    
    computed: {
		...mapState({
			layoutCalendarType: (state) => state.calendar.layoutCalendarType,
		}),
	},

    methods: {
        async gridView() {
			const _this = this;
            _this.isActiveBtn = false;
			await _this.$store.commit('calendar/SET_CALENDAR_VIEW_TYPE', 'grid');
            this.$refs.calendar.changeViewCalendar('listWeek');
		},
		async calendarView() {
			const _this = this;
            _this.isActiveBtn = true;
			await _this.$store.commit('calendar/SET_CALENDAR_VIEW_TYPE', 'calendar');
            this.$refs.calendar.changeViewCalendar('timeGridWeek');
		},
    }
}
</script>

<style>
.control-btn.calendar-type-btn{
    background-color: #fff;
    color: #2C3E50;
    border: 2px solid #2C3E50;
}
.control-btn.calendar-type-btn.active{
    background-color: #2C3E50;
    color: #fff;
    border: 2px solid #2C3E50;
}
.control-btn.calendar-type-btn:hover{
    background-color: #2C3E50;
    color: #fff;
    border: 2px solid #2C3E50;
}
.control-btn.calendar-type-btn > i{
    margin: 0;
}
</style>