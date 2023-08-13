<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Lịch làm việc</div>
                    </div>
                </div>
                <div class="row" style="margin-top: 9px;">
                    <div class="col-md-4">
                        <div class="col-form-label">Trạng thái</div>
                        <el-select v-model="searchQuery.statusF" placeholder="Trạng thái..." filterable multiple clearable name="statusF">
                            <el-option
                                v-for="item in statusData"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value"
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
                        <div style="display: flex; height: 100%;align-items: end;">
                            <button type="button" class="control-btn green" @click="searchData()">
                                <i class='bx bx-search'></i>
                                Tìm
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row mt-5 mb-4" v-loading="dataLoading">
                    <div class="col-md-12">
                        <WorkingCalendar v-if="isCheck" :listAppointments="listAppointments" ref="workingCalendarComponent" />
                    </div>
                </div>
            </div>
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
import Appointment from '@/models/tw_Appointment';
import WorkingCalendar from '@/components/workingCalendar/workingCalendar';
import AppointmentConfig from '@/models/tw_AppointmentConfig';
import { appointmentStatus } from '@/utils/masterData';
export default {
    components: {
		WorkingCalendar,
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
            isCheck: false,
            listAppointments: [],
            statusData: appointmentStatus,
            searchQuery: {
                statusF: ['Booked', 'Checkin', 'Completed'],
                dateF: new Date()
            },
        }
    },
    async created(){
        const _this = this;
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
            await _this.$axios.$post(`/api/workingCalendar/getWorkingCalendarByDentist`, { 
                dentistId: _this.userInfo.data._id ,
                statusF: _this.searchQuery.statusF
            }).then(
                (response) => {
                    _this.listAppointments = response.data;
                    _this.dataLoading = false;
                    _this.isCheck = true;
                },
                (error) => {
                    console.log('Error: ', error);
                    _this.$message({
                        type: 'error',
                        message: 'Có lỗi xảy ra',
                    });
                    _this.dataLoading = false;
                    _this.isCheck = true;
                }
            );
        },
        searchData(){
            const _this = this;
            _this.getData();
        },
    }
}
</script>