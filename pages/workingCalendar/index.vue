<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Lịch làm việc</div>
                    </div>
                </div>
                <div class="row mt-4" v-loading="dataLoading">
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
            await _this.$axios.$post(`/api/workingCalendar/getWorkingCalendarByDentist`, { dentistId: _this.userInfo.data._id }).then(
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
        }
    }
}
</script>