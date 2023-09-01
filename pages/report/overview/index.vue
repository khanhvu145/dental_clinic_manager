<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Báo cáo tổng quan</div>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-md-3">
                        <el-select v-model="searchQuery.typeF" filterable name="typeF">
                            <el-option label="Theo ngày" value="day"></el-option>
                            <el-option label="Theo tháng" value="month"></el-option>
                            <el-option label="Theo năm" value="year"></el-option>
                        </el-select>
                    </div>
                    <div v-if="searchQuery.typeF == 'day'" class="col-md-4">
                        <el-date-picker
                            v-model="searchQuery.dateF"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="-"
                            start-placeholder="Từ ngày"
                            end-placeholder="Đến ngày"
                            :picker-options="pickerOptions_Day"
                            format="dd/MM/yyyy"
                            style="width: 100%"
                            :clearable="false"
                        ></el-date-picker>
                    </div>
                    <div v-if="searchQuery.typeF == 'month'" class="col-md-4">
                        <el-date-picker
                            v-model="searchQuery.monthF"
                            type="monthrange"
                            align="right"
                            unlink-panels
                            range-separator="-"
                            start-placeholder="Từ tháng"
                            end-placeholder="Đến tháng"
                            :picker-options="pickerOptions_Month"
                            format="MM/yyyy"
                            style="width: 100%"
                            :clearable="false"
                        ></el-date-picker>
                    </div>
                    <div v-if="searchQuery.typeF == 'year'" class="col-md-4">
                        <div class="row">
                            <div class="col-6">
                                <el-date-picker
                                    v-model="searchQuery.yearF[0]"
                                    type="year"
                                    placeholder="Từ năm"
                                    align="right"
                                    style="width: 100%"
                                    :clearable="false"
                                ></el-date-picker>
                            </div>
                            <div class="col-6">
                                <el-date-picker
                                    v-model="searchQuery.yearF[1]"
                                    type="year"
                                    placeholder="Đến năm"
                                    align="right"
                                    style="width: 100%"
                                    :clearable="false"
                                ></el-date-picker>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <button type="button" class="control-btn green" @click="getData()">
                            Xem báo cáo
                        </button>
                    </div>
                </div>
                <hr>
                <!-- Tổng quan -->
                <div class="row mt-4">
                    <!-- Doanh thu -->
                    <div class="col-md-6 col-xl-4 mb-2">
                        <el-card class="box-card">
                            <div class="row">
                                <div class="col-4">
                                    <div class="avatar-lg rounded-circle" style="background-color:#278664;">
                                        <i class='bx bx-dollar font-26 avatar-title'></i>
                                    </div>
                                </div>
                                <div class="col-8">
                                    <div class="text-right d-flex flex-column justify-content-center" style="height:100%;">
                                        <div style="font-weight:bold;color:rgb(104 102 102);">Tổng doanh thu (VND)</div>
                                        <div class="mt-2" style="font-weight:bold;color:#278664;font-size:24px;">{{ replaceNumber(overviewData.revenue) }}</div>
                                        <div class="mt-2" style="font-style:italic;color:rgb(152, 166, 173);font-size:14px;">{{ `${convertAmountToWord(overviewData.revenue)}` }}</div>
                                    </div>
                                </div>
                            </div>
                        </el-card>
                    </div>
                    <!-- Lịch hẹn -->
                    <div class="col-md-6 col-xl-4 mb-2">
                        <el-card class="box-card">
                            <div class="row">
                                <div class="col-4">
                                    <div class="avatar-lg rounded-circle" style="background-color:#f0bc68;">
                                        <i class='bx bx-calendar-plus font-26 avatar-title'></i>
                                    </div>
                                </div>
                                <div class="col-8">
                                    <div class="text-right d-flex flex-column justify-content-center" style="height:100%;">
                                        <div style="font-weight:bold;color:rgb(104 102 102);">Tổng số cuộc hẹn (Lịch hẹn)</div>
                                        <div class="mt-2" style="font-weight:bold;color:#f0bc68;font-size:24px;">{{ replaceNumber(overviewData.appointment.total) }}</div>
                                        <div class="mt-2" style="font-style:italic;color:rgb(152, 166, 173);font-size:14px;">
                                           <span>Đã đến: {{ overviewData.appointment.checkin }}</span> |
                                           <span>Hoàn thành: {{ overviewData.appointment.completed }}</span> |
                                           <span>Đã hủy: {{ overviewData.appointment.cancelled }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-card>
                    </div>
                    <!-- Khách mới -->
                    <div class="col-md-6 col-xl-4 mb-2">
                        <el-card class="box-card">
                            <div class="row">
                                <div class="col-4">
                                    <div class="avatar-lg rounded-circle" style="background-color:#55cbcd;">
                                        <i class='bx bx-user font-26 avatar-title'></i>
                                    </div>
                                </div>
                                <div class="col-8">
                                    <div class="text-right d-flex flex-column justify-content-center" style="height:100%;">
                                        <div style="font-weight:bold;color:rgb(104 102 102);">Khách hàng mới (Khách hàng)</div>
                                        <div class="mt-2" style="font-weight:bold;color:#55cbcd;font-size:24px;">{{ replaceNumber(overviewData.customer.totalNew) }}</div>
                                        <div class="mt-2" style="font-style:italic;color:rgb(152, 166, 173);font-size:14px;">
                                           <span>Tổng khách hàng: {{ overviewData.customer.total }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
                <!-- Doanh thu -->
                <div class="row mt-3">
                    <!-- Thu/chi -->
                    <div class="col-md-9">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span style="font-weight:bold;color:rgb(104 102 102);">Thu/chi phòng khám</span>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <bar-chart
										:options="revenueReport.options"
										:labels="revenueReport.labels"
										:datasets="revenueReport.datasets"
									/>
                                </div>
                            </div>
                        </el-card>
                    </div>
                    <!-- Công nợ -->
                    <div class="col-md-3">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span style="font-weight:bold;color:rgb(104 102 102);">Công nợ phòng khám</span>
                            </div>
                        </el-card>
                    </div>
                </div>
                <!-- Khám và điều trị -->
                <div class="row mt-4">
                    <!-- Thời gian điều trị -->
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
import { intersection } from 'lodash';
import BarChart from '@/components/report/BarChart.vue';
import LineChart from '@/components/report/LineChart.vue';
import PieChart from '@/components/report/PieChart.vue';
import DoughnutChart from '@/components/report/DoughnutChart.vue';
import moment from 'moment';
import readAmountByWord from '@/utils/functions/readAmountByWord';
export default {
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
		}),
	},
    components: {
		'bar-chart': BarChart,
		'line-chart': LineChart,
		'pie-chart': PieChart,
		'doughnut-chart': DoughnutChart,
	},
    data(){
        return {
            dataLoading: true,
            searchQuery: {
                dateF: [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
                monthF: [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
                yearF: [moment().subtract(5, 'years').format('YYYY'), moment().format('YYYY')],
                typeF: 'day'
            },
            pickerOptions_Day: {
                shortcuts: [
                    {
                        text: 'Today',
                        onClick(picker) {
                            const end = moment();
                            const start = moment();
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: 'Yesterday',
                        onClick(picker) {
                            const end = moment().subtract(1, 'days');
                            const start = moment().subtract(1, 'days');
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: 'This week',
                        onClick(picker) {
                            const startOfWeek = moment().startOf('week').toDate();
                            const endOfWeek   = moment().endOf('week').toDate();
                            picker.$emit('pick', [startOfWeek, endOfWeek]);
                        },
                    },
                    {
                        text: 'Last week',
                        onClick(picker) {
                            const startOfWeek = moment().subtract(1, 'weeks').startOf('week');
                            const endOfWeek   = moment().subtract(1, 'weeks').endOf('week');
                            picker.$emit('pick', [startOfWeek, endOfWeek]);
                        },
                    },
                    {
                        text: 'This month',
                        onClick(picker) {
                            const start = moment().startOf('month').toDate();
                            const end   = moment().endOf('month').toDate();
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: 'Last month',
                        onClick(picker) {
                            const start = moment().subtract(1, 'months').startOf('month');
                            const end   = moment().subtract(1, 'months').endOf('month');
                            picker.$emit('pick', [start, end]);
                        },
                    }
                ],
            },
            pickerOptions_Month: {
                shortcuts: [
                    {
                        text: 'This month',
                        onClick(picker) {
                            const start = moment().startOf('month').toDate();
                            const end   = moment().endOf('month').toDate();
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: 'Last month',
                        onClick(picker) {
                            const start = moment().subtract(1, 'months').startOf('month');
                            const end   = moment().subtract(1, 'months').endOf('month');
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: 'This quarter',
                        onClick(picker) {
                            const start = moment().startOf('quarter').toDate();
                            const end   = moment().endOf('quarter').toDate();
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: 'Last quarter',
                        onClick(picker) {
                            const start = moment().subtract(1, 'quarters').startOf('quarter');
                            const end   = moment().subtract(1, 'quarters').endOf('quarter');
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: 'This year',
                        onClick(picker) {
                            const start = moment().startOf('year').toDate();
                            const end   = moment().endOf('year').toDate();
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: 'Last year',
                        onClick(picker) {
                            const start = moment().subtract(1, 'years').startOf('year');
                            const end   = moment().subtract(1, 'years').endOf('year');
                            picker.$emit('pick', [start, end]);
                        },
                    }
                ],
            },
            overviewData: {
                revenue: 0,
                appointment: {
                    total: 0,
                    checkin: 0,
                    completed: 0,
                    cancelled: 0
                },
                customer: {
                    total: 0,
                    totalNew: 0
                }
            },
            revenueReport: {
                options: {
                    responsive: true,
                    legend: {
                        display: true,
                    },
                    title: {
                        display: false
                    },
                    scales: {
                        xAxes: [
                            {
                                stacked: true,
                                ticks: {
                                    callback: function (label, index, labels) {
                                        if (label >= 1000000000) {
                                            return Number(label / 1000000000).toLocaleString() + 'B';
                                        } else if (label >= 1000000) {
                                            return Number(label / 1000000).toLocaleString() + 'M';
                                        }
                                        return Number(label).toLocaleString();
                                    },
                                },
                            },
                        ],
                        yAxes: [
                            {
                                stacked: true,
                            },
                        ],
                    },
                    plugins: {
                        datalabels: {
                            formatter: (value) => {
                                return Number(value).toLocaleString();
                            },
                        },
                    },
                },
                labels: [],
                datasets: []
            }
        }
    },
    async created(){
        const _this = this;
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['overview.all', 'overview.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        async getData(){
            const _this = this;
            _this.dataLoading = true;

            _this.dataLoading = false;
        },
        replaceNumber(value){
            const newValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            if(newValue) return newValue;
            else value;
        },
        convertAmountToWord(number){
            return readAmountByWord(number);
        },
        async getOverviewReport(){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/report/getOverviewReport', _this.searchQuery).then(
                (response) => {
                    
                },
                (error) => {
                    console.log('Error: ', error);
                    _this.$message({
                        type: 'error',
                        message: 'Có lỗi xảy ra (Báo cáo chung)',
                    });
                }
            );
            _this.dataLoading = false;
        }
    }
}
</script>