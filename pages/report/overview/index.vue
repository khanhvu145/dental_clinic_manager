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
                        <el-select v-model="searchQuery.typeF" filterable name="typeF" @change="getData()">
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
                                    required
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
                        <el-card class="box-card" v-loading="dataLoading">
                            <div class="row">
                                <div class="col-4">
                                    <div class="avatar-lg rounded-circle" style="background-color:#278664;">
                                        <i class='bx bx-dollar font-26 avatar-title'></i>
                                    </div>
                                </div>
                                <div class="col-8">
                                    <div class="text-right d-flex flex-column" style="height:100%;">
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
                        <el-card class="box-card" v-loading="dataLoading">
                            <div class="row">
                                <div class="col-4">
                                    <div class="avatar-lg rounded-circle" style="background-color:#f0bc68;">
                                        <i class='bx bx-calendar-plus font-26 avatar-title'></i>
                                    </div>
                                </div>
                                <div class="col-8">
                                    <div class="text-right d-flex flex-column" style="height:100%;">
                                        <div style="font-weight:bold;color:rgb(104 102 102);">Tổng số cuộc hẹn (Lịch hẹn)</div>
                                        <div class="mt-2" style="font-weight:bold;color:#f0bc68;font-size:24px;">{{ replaceNumber(overviewData.appointment) }}</div>
                                        <!-- <div class="mt-2" style="font-style:italic;color:rgb(152, 166, 173);font-size:14px;">
                                           <span>Đã đến: {{ overviewData.appointment.checkin }}</span> |
                                           <span>Hoàn thành: {{ overviewData.appointment.completed }}</span> |
                                           <span>Đã hủy: {{ overviewData.appointment.cancelled }}</span>
                                        </div> -->
                                    </div>
                                </div>
                            </div>
                        </el-card>
                    </div>
                    <!-- Khách mới -->
                    <div class="col-md-6 col-xl-4 mb-2">
                        <el-card class="box-card" v-loading="dataLoading">
                            <div class="row">
                                <div class="col-4">
                                    <div class="avatar-lg rounded-circle" style="background-color:#55cbcd;">
                                        <i class='bx bx-user font-26 avatar-title'></i>
                                    </div>
                                </div>
                                <div class="col-8">
                                    <div class="text-right d-flex flex-column" style="height:100%;">
                                        <div style="font-weight:bold;color:rgb(104 102 102);">Khách hàng mới (Khách hàng)</div>
                                        <div class="mt-2" style="font-weight:bold;color:#55cbcd;font-size:24px;">{{ replaceNumber(overviewData.customer) }}</div>
                                        <!-- <div class="mt-2" style="font-style:italic;color:rgb(152, 166, 173);font-size:14px;">
                                           <span>Tổng khách hàng: {{ overviewData.customer.total }}</span>
                                        </div> -->
                                    </div>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
                <!-- Doanh thu -->
                <div class="row mt-3">
                    <!-- Thu/chi -->
                    <div class="col-md-12">
                        <el-card class="box-card" style="height:100%;">
                            <div slot="header" class="clearfix">
                                <span style="font-weight:bold;color:rgb(104 102 102);">Thu/chi phòng khám</span>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <bar-chart
                                        v-if="!dataLoading"
                                        :width="500"
                                        :height="200"
										:options="revenueReport.options"
										:labels="revenueReport.labels"
										:datasets="revenueReport.datasets"
                                        ref="revenueReportChart"
									/>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
                <div class="row mt-3">
                    <!-- Công nợ -->
                    <div class="col-md-6">
                        <el-card class="box-card" style="height:100%;">
                            <div slot="header" class="clearfix">
                                <span style="font-weight:bold;color:rgb(104 102 102);">Công nợ phòng khám</span>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <pie-chart
                                        v-if="!dataLoading"
                                        :width="600"
                                        :height="300"
                                        :labels="debtReport.labels"
                                        :datasets="debtReport.datasets"
                                        :options="debtReport.options"
                                    />
                                </div>
                            </div>
                        </el-card>
                    </div>
                    <!-- Lịch hẹn -->
                    <div class="col-md-6">
                        <el-card class="box-card" style="height:100%;">
                            <div slot="header" class="clearfix">
                                <span style="font-weight:bold;color:rgb(104 102 102);">Thống kê lịch hẹn</span>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <pie-chart
                                        v-if="!dataLoading"
                                        :width="600"
                                        :height="300"
                                        :labels="appointmentReport.labels"
                                        :datasets="appointmentReport.datasets"
                                        :options="appointmentReport.options"
                                    />
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
                <!-- Khám và điều trị -->
                <div class="row mt-3">
                    <!-- Thời gian điều trị -->
                    <div class="col-md-12">
                        <el-card class="box-card" style="height:100%;">
                        <div slot="header" class="clearfix">
                            <span style="font-weight:bold;color:rgb(104 102 102);">Khám và điều trị</span>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <line-chart
                                    v-if="!dataLoading"
                                    :options="examinationReport.options"
                                    :labels="examinationReport.labels"
                                    :datasets="examinationReport.datasets"
                                    :width="500"
                                    :height="200"
                                />
                            </div>
                        </div>
                        </el-card>
                    </div>
                </div>
                <!-- Dịch vụ -->
                <div class="row mt-3">
                    <div class="col-md-6">
                        <!-- Nhóm dịch vụ -->
                        <el-card class="box-card" style="height:100%;">
                            <div slot="header" class="clearfix" style="padding: 12px 0;">
                                <span style="font-weight:bold;color:rgb(104 102 102);">Nhóm dịch vụ</span>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <bar-chart
                                        v-if="!dataLoading"
										:options="serviceGroupReport.options"
										:labels="serviceGroupReport.labels"
										:datasets="serviceGroupReport.datasets"
                                        :type="`horizontalBar`"
									/>
                                </div>
                            </div>
                        </el-card>
                    </div>
                    <div class="col-md-6">
                        <el-card class="box-card" style="height:100%;">
                            <div slot="header" class="clearfix">
                                <div class="row" style="align-items:center;">
                                    <div class="col-md-4">
                                        <span style="font-weight:bold;color:rgb(104 102 102);">Dịch vụ</span>
                                    </div>
                                    <div class="col-md-8">
                                        <el-select 
                                            v-model="serviceGroupId" 
                                            placeholder="Chọn nhóm dịch vụ" 
                                            name="serviceGroupId" 
                                            style="width: 100%"
                                            clearable 
                                            filterable
                                            remote
                                            :remote-method="(text) => filterServiceGroup(text)"
                                            @focus="filterServiceGroup('')"
                                            @change="handleChangeServiceGroup($event)"
                                        >
                                            <el-option
                                                v-for="item in serviceGroupData"
                                                :key="item._id"
                                                :label="`${item.code} | ${item.name}`"
                                                :value="item._id"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <bar-chart
                                        v-if="!dataLoading"
                                        v-loading="serviceReport.loading"
										:options="serviceReport.options"
										:labels="serviceReport.labels"
										:datasets="serviceReport.datasets"
                                        :type="`horizontalBar`"
									/>
                                </div>
                            </div>
                        </el-card>
                    </div>
                    <!-- <div class="col-md-6">
                        <el-card class="box-card" style="height:100%;">
                            <div slot="header" class="clearfix">
                                <span style="font-weight:bold;color:rgb(104 102 102);">Nha sĩ</span>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <bar-chart
                                        v-if="!dataLoading"
										:options="dentistReport.options"
										:labels="dentistReport.labels"
										:datasets="dentistReport.datasets"
                                        :type="`horizontalBar`"
									/>
                                </div>
                            </div>
                        </el-card>
                    </div> -->
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
import BarChart from '@/components/report/BarChart.vue';
import LineChart from '@/components/report/LineChart.vue';
import PieChart from '@/components/report/PieChart.vue';
import DoughnutChart from '@/components/report/DoughnutChart.vue';
import moment from 'moment';
import readAmountByWord from '@/utils/functions/readAmountByWord';
import { debounce, map, cloneDeep, intersection, filter, find, forEach } from 'lodash';
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
                typeF: 'month'
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
                appointment: 0,
                customer: 0
            },
            revenueReport: {
                options: {
                    responsive: true,
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            boxWidth: 50,
                            padding: 20,
						    fontStyle: '700',
                        },
                    },
                    title: {
                        display: false
                    },
                    scales: {
                        xAxes: [
                            {
                                barThickness: 33, // number (pixels) or 'flex'
                                maxBarThickness: 30, // number (pixels)
                            },
                        ],
                        yAxes: [
                            {
                                id: 'y-axis-density',
                                ticks: {
                                    min: 0, // minimum value
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
                    },
                    plugins: {
                        datalabels: {
                            display: false,
                            align: 'end',
                            anchor: 'end',
                            offset: 2,
                            color: '#aaaaaa',
                            font: function (context) {
                                var w = context.chart.width;
                                return {
                                    size: w < 512 ? 12 : 14,
                                    weight: 'bold',
                                };
                            },
                            formatter: function (value, index, values) {
                                if (value > 0) {
                                    return Number(value).toLocaleString();
                                } else {
                                    return '';
                                }
                            },
                        },
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                var label = data.datasets[tooltipItem.datasetIndex].label || '';

                                if (label) {
                                    label += ': ';
                                }
                                label += Number(tooltipItem.yLabel).toLocaleString();
                                return label;
                            },
                        },
                    },
                    // onClick: (e) => {
                    //     const chart = this.$refs.revenueReportChart.chart;
                    //     var bar = chart.getElementsAtEvent(e)[0];
                    //     var index = bar._index;
                    //     var datasetIndex = bar._datasetIndex;
                    //     var label = chart.data.labels[index];
                    //     var dataset = chart.data.datasets;
                    //     // console.log(this.$refs.revenueReportChart.chart.getElementsAtEvent(e))
                    //     console.log(chart.getElementsAtEvent(e))
                    //     console.log(bar)
                    //     console.log(index)
                    //     console.log(datasetIndex)
                    //     console.log(label)
                    //     console.log(dataset)
                    // }
                },
                labels: [],
                datasets: []
            },
            debtReport: {
                options: {
                    responsive: true,
				    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            boxWidth: 50,
                            padding: 20,
						    fontStyle: '700',
                        },
                        fullSize: true
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                var label = data.labels[tooltipItem.index] || '';

                                if (label) {
                                    label += ': ';
                                }
                                label += Number(data.datasets[0].data[tooltipItem.index] || 0).toLocaleString();
                                return label;
                            },
                        },
                    },
                    plugins: {
                        datalabels: {
                            formatter: (value, ctx) => {
                                if (value > 0) {
                                    let sum = 0;
                                    let dataArr = ctx.chart.data.datasets[0].data;
                                    dataArr.map((data) => {
                                        sum += data;
                                    });
                                    return ((value * 100) / sum).toFixed(2) + '%';
                                } else {
                                    value = '';
                                    return value;
                                }
                            },
                            display: true,
                            color: '#fff',
                        },
                    },
                },
                labels: [],
                datasets: []
            },
            appointmentReport: {
                options: {
                    responsive: true,
				    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            boxWidth: 50,
                            padding: 20,
						    fontStyle: '700',
                        },
                        fullSize: true
                    },
                    tooltips: {
                        enabled: true,
                    },
                    plugins: {
                        datalabels: {
                            formatter: (value, ctx) => {
                                if (value > 0) {
                                    let sum = 0;
                                    let dataArr = ctx.chart.data.datasets[0].data;
                                    dataArr.map((data) => {
                                        sum += data;
                                    });
                                    return ((value * 100) / sum).toFixed(2) + '%';
                                } else {
                                    value = '';
                                    return value;
                                }
                            },
                            display: true,
                            color: '#fff',
                        },
                    },
                },
                labels: [],
                datasets: []
            },
            examinationReport: {
                options: {
                    responsive: true,
                    // maintainAspectRatio: false,
                    legend: {
                        display: false,
                        position: 'top',
                        labels: {
                            boxWidth: 50,
                            padding: 20,
						    fontStyle: '700',
                        },
                    },
                    title: {
                        display: false
                    },
                    plugins: {
                        datalabels: {
                            display: false,
                            align: 'end',
                            anchor: 'end',
                            offset: 2,
                            color: '#aaaaaa',
                            font: function (context) {
                                var w = context.chart.width;
                                return {
                                    size: w < 512 ? 12 : 14,
                                    weight: 'bold',
                                };
                            },
                            formatter: function (value, index, values) {
                                if (value > 0) {
                                    return Number(value).toLocaleString();
                                } else {
                                    return '';
                                }
                            },
                        },
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                var label = 'Hoàn thành: '
                                label += Number(tooltipItem.yLabel).toLocaleString();
                                return label;
                            },
                        },
                    },
                },
                labels: [],
                datasets: []
            },
            serviceGroupReport: {
                options: {
                    responsive: true,
                    legend: {
                        display: false,
                        position: 'top',
                        labels: {
                            boxWidth: 50,
                            padding: 20,
						    fontStyle: '700',
                        },
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
                                barThickness: 30, // number (pixels) or 'flex'
                                maxBarThickness: 30, // number (pixels)
                                // autoSkip: false,
                                // maxRotation: 90,
                                // ticks: {
                                //     minRotation: 35
                                // }
                            },
                        ],
                    },
                    plugins: {
                        datalabels: {
                            // display: false,
                            // align: 'end',
                            // anchor: 'end',
                            // offset: 2,
                            // color: '#aaaaaa',
                            formatter: function (value) {
                                return Number(value).toLocaleString();
                            },
                        },
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                var label = data.datasets[tooltipItem.datasetIndex].label || '';

                                if (label) {
                                    label += ': ';
                                }
                                label += Number(tooltipItem.xLabel).toLocaleString();
                                return label;
                            },
                        },
                    },
                },
                labels: [],
                datasets: []
            },
            dentistReport: {
                options: {
                    responsive: true,
                    legend: {
                        display: false,
                        position: 'top',
                        labels: {
                            boxWidth: 50,
                            padding: 20,
						    fontStyle: '700',
                        },
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
                                barThickness: 40, // number (pixels) or 'flex'
                                maxBarThickness: 40, // number (pixels)
                                // autoSkip: false,
                                // maxRotation: 90,
                                // ticks: {
                                //     minRotation: 35
                                // }
                            },
                        ],
                    },
                    plugins: {
                        datalabels: {
                            // display: false,
                            // align: 'end',
                            // anchor: 'end',
                            // offset: 2,
                            // color: '#aaaaaa',
                            formatter: function (value) {
                                return Number(value).toLocaleString();
                            },
                        },
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                var label = data.datasets[tooltipItem.datasetIndex].label || '';

                                if (label) {
                                    label += ': ';
                                }
                                label += Number(tooltipItem.xLabel).toLocaleString();
                                return label;
                            },
                        },
                    },
                },
                labels: [],
                datasets: []
            },
            serviceReport: {
                options: {
                    responsive: true,
                    legend: {
                        display: false,
                        position: 'top',
                        labels: {
                            boxWidth: 50,
                            padding: 20,
						    fontStyle: '700',
                        },
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
                                barThickness: 30, // number (pixels) or 'flex'
                                maxBarThickness: 30, // number (pixels)
                                // autoSkip: false,
                                // maxRotation: 90,
                                // ticks: {
                                //     minRotation: 35
                                // }
                            },
                        ],
                    },
                    plugins: {
                        datalabels: {
                            // display: false,
                            // align: 'end',
                            // anchor: 'end',
                            // offset: 2,
                            // color: '#aaaaaa',
                            formatter: function (value) {
                                return Number(value).toLocaleString();
                            },
                        },
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                var label = data.datasets[tooltipItem.datasetIndex].label || '';

                                if (label) {
                                    label += ': ';
                                }
                                label += Number(tooltipItem.xLabel).toLocaleString();
                                return label;
                            },
                        },
                    },
                },
                labels: [],
                datasets: [],
                loading: true,
            },
            serviceGroupId: '',
            serviceGroupData: []
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
			const values = ['overview.all', 'overview.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        async getData(){
            const _this = this;
            _this.dataLoading = true;
            await _this.getOverviewReport();
            await _this.getRevenueExpenditureReport();
            await _this.getDebtReport();
            await _this.getAppointmentReport();
            await _this.getExaminationReport();
            await _this.getServiceGroupReport();
            await _this.getServiceReport(_this.serviceGroupId);
            // await _this.getDentistReport();
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
                    if(response.success){
                        _this.overviewData = response.data;
                    }
                    else{
                        console.log('Error (Báo cáo chung): ', error);
                        _this.$message({
                            type: 'error',
                            message: 'Có lỗi xảy ra',
                        });
                    }
                },
                (error) => {
                    console.log('Error (Báo cáo chung): ', error);
                    _this.$message({
                        type: 'error',
                        message: 'Có lỗi xảy ra',
                    });
                }
            );
            _this.dataLoading = false;
        },
        async getRevenueExpenditureReport(){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/report/getRevenueExpenditureReport', _this.searchQuery).then(
                (response) => {
                    if(response.success){
                        // _this.overviewData = response.data;
                        let labels = _.map(response.data, (m) => {
                            return m?.label;
                        });
                        let revenueData = _.map(response.data, (m) => {
                            return m.revenue;
                        });
                        let expenditureData = _.map(response.data, (m) => {
                            return m.expenditure;
                        });
                        _this.revenueReport.labels = labels;
                        _this.revenueReport.datasets = [
                            {
                                label: 'Doanh thu',
                                backgroundColor: 'rgba(137, 196, 244)',
                                borderColor: 'rgba(3, 138, 255)',
                                borderWidth: 1,
                                data: revenueData,
                            },
                            {
                                label: 'Chi phí',
                                backgroundColor: 'rgba(251, 192, 147)',
                                borderColor: 'rgba(255, 148, 112)',
                                borderWidth: 1,
                                data: expenditureData,
                            }
                        ];
                    }
                    else{
                        console.log('Error (Thu chi): ', error);
                        _this.$message({
                            type: 'error',
                            message: 'Có lỗi xảy ra',
                        });
                    }
                },
                (error) => {
                    console.log('Error (Thu chi): ', error);
                    _this.$message({
                        type: 'error',
                        message: 'Có lỗi xảy ra',
                    });
                }
            );
            _this.dataLoading = false;
        },
        async getDebtReport(){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/report/getDebtReport', _this.searchQuery).then(
                (response) => {
                    if(response.success){
                        // _this.overviewData = response.data;
                        let labels = _.map(response.data, (m) => {
                            return m?.label;
                        });
                        let amountData = _.map(response.data, (m) => {
                            return m.value;
                        });
                        _this.debtReport.labels = labels;
                        let datasetOne = {
                            data: amountData,
                            backgroundColor: ['rgba(137, 196, 244)', 'rgba(251, 192, 147)', 'rgba(147, 250, 165)'],
                        };
                        _this.debtReport.datasets = [datasetOne];
                    }
                    else{
                        console.log('Error (Công nợ): ', error);
                        _this.$message({
                            type: 'error',
                            message: 'Có lỗi xảy ra',
                        });
                    }
                },
                (error) => {
                    console.log('Error (Công nợ): ', error);
                    _this.$message({
                        type: 'error',
                        message: 'Có lỗi xảy ra',
                    });
                }
            );
            _this.dataLoading = false;
        },
        async getAppointmentReport(){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/report/getAppointmentReport', _this.searchQuery).then(
                (response) => {
                    if(response.success){
                        // _this.overviewData = response.data;
                        let labels = _.map(response.data, (m) => {
                            return m?.label;
                        });
                        let countData = _.map(response.data, (m) => {
                            return m.value;
                        });
                        _this.appointmentReport.labels = labels;
                        let datasetOne = {
                            data: countData,
                            backgroundColor: ['rgba(147, 250, 165)', 'rgba(246, 71, 71)', 'rgba(171, 183, 183)'],
                        };
                        _this.appointmentReport.datasets = [datasetOne];
                    }
                    else{
                        console.log('Error (Lịch hẹn): ', error);
                        _this.$message({
                            type: 'error',
                            message: 'Có lỗi xảy ra',
                        });
                    }
                },
                (error) => {
                    console.log('Error (Lịch hẹn): ', error);
                    _this.$message({
                        type: 'error',
                        message: 'Có lỗi xảy ra',
                    });
                }
            );
            _this.dataLoading = false;
        },
        async getExaminationReport(){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/report/getExaminationReport', _this.searchQuery).then(
                (response) => {
                    if(response.success){
                        // _this.overviewData = response.data;
                        let labels = _.map(response.data, (m) => {
                            return m?.label;
                        });
                        let countData = _.map(response.data, (m) => {
                            return m.count;
                        });
                        _this.examinationReport.labels = labels;
                        let datasetOne = {
                            data: countData,
                            backgroundColor: ['rgba(147, 250, 165)'],
                        };
                        _this.examinationReport.datasets = [datasetOne];
                    }
                    else{
                        console.log('Error (Khám và điều trị): ', error);
                        _this.$message({
                            type: 'error',
                            message: 'Có lỗi xảy ra',
                        });
                    }
                },
                (error) => {
                    console.log('Error (Khám và điều trị): ', error);
                    _this.$message({
                        type: 'error',
                        message: 'Có lỗi xảy ra',
                    });
                }
            );
            _this.dataLoading = false;
        },
        async getServiceGroupReport(){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/report/getServiceGroupReport', _this.searchQuery).then(
                (response) => {
                    if(response.success){
                        let backgroundColors = _this.generateColors(response.data);
                        let labels = _.map(response.data, (m) => {
                            return m?.label;
                        });
                        _this.serviceGroupReport.labels = labels;
                        let datasetOne = _.map(response.data, (m, index) => {
                            let countData = _.map(response.data, (n) => {
                                if(n.label === m.label) return n?.count;
                            });
                            return {
                                label: m.label,
                                backgroundColor: backgroundColors[index],
                                data: countData,
                            };
                        });
                        _this.serviceGroupReport.datasets = datasetOne || [];
                    }
                    else{
                        console.log('Error (Nhóm dịch vụ): ', error);
                        _this.$message({
                            type: 'error',
                            message: 'Có lỗi xảy ra',
                        });
                    }
                },
                (error) => {
                    console.log('Error (Nhóm dịch vụ): ', error);
                    _this.$message({
                        type: 'error',
                        message: 'Có lỗi xảy ra',
                    });
                }
            );
            _this.dataLoading = false;
        },
        async getDentistReport(){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/report/getDentistReport', _this.searchQuery).then(
                (response) => {
                    if(response.success){
                        let labels = _.map(response.data, (m) => {
                            return m?.label;
                        });
                        let countData = _.map(response.data, (m) => {
                            return m.count;
                        });
                        _this.dentistReport.labels = labels;
                        let datasetOne = {
                            data: countData,
                            backgroundColor: 'rgba(251, 192, 147)',
                            // backgroundColor: _this.random_rgba(countData.length),
                        };
                        _this.dentistReport.datasets = [datasetOne];
                    }
                    else{
                        console.log('Error (Nha sĩ): ', error);
                        _this.$message({
                            type: 'error',
                            message: 'Có lỗi xảy ra',
                        });
                    }
                },
                (error) => {
                    console.log('Error (Nha sĩ): ', error);
                    _this.$message({
                        type: 'error',
                        message: 'Có lỗi xảy ra',
                    });
                }
            );
            _this.dataLoading = false;
        },
        async getServiceReport(groupId){
            const _this = this;
            _this.serviceReport.loading = true;
            if(groupId){
                _this.searchQuery.groupId = groupId;
                await _this.$axios.$post('/api/report/getServiceReport', _this.searchQuery).then(
                    (response) => {
                        if(response.success){
                            let backgroundColors = _this.generateColors(response.data);
                            let labels = _.map(response.data, (m) => {
                                return m?.label;
                            });
                            _this.serviceReport.labels = labels;
                            let datasetOne = _.map(response.data, (m, index) => {
                                let countData = _.map(response.data, (n) => {
                                    if(n.label === m.label) return n?.count;
                                });
                                return {
                                    label: m.label,
                                    backgroundColor: backgroundColors[index],
                                    data: countData,
                                };
                            });
                            _this.serviceReport.datasets = datasetOne || [];
                        }
                        else{
                            console.log('Error (Dịch vụ): ', error);
                            _this.$message({
                                type: 'error',
                                message: 'Có lỗi xảy ra',
                            });
                        }
                    },
                    (error) => {
                        console.log('Error (Dịch vụ): ', error);
                        _this.$message({
                            type: 'error',
                            message: 'Có lỗi xảy ra',
                        });
                    }
                );
            }
            else{
                _this.serviceReport.labels = [];
                _this.serviceReport.datasets = [];
            }
            _this.serviceReport.loading = false;
        },
        filterServiceGroup: debounce(async function (text) {
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
            let serviceGroups = await _this.$axios.$post('/api/service/groupGetByTextSearch', query);
            _this.serviceGroupData = serviceGroups && serviceGroups.data;
        }, 200),
        async handleChangeServiceGroup(e){
            const _this = this;
            _this.getServiceReport(e);
        },
        generateColors(data) {
            var ict_unit = [];
            var sampleColor = [
                '#FFCAB7',
                '#F4989B',
                '#EBC559',
                '#F9BB7E',
                '#D6694D',
                '#EE4040',
                '#5DA1CA',
                '#A9B5DD',
                '#9187C6',
                '#D16BA8',
                '#A04DAD',
                '#75C9CC',
                '#A6C99F',
                '#7AC5A1',
                '#54938B',
            ];

            var efficiency = [];
            var coloR = _.sampleSize(sampleColor, data.length);
            if (coloR.length === data.length) {
                return coloR;
            } else {
                var dynamicColors = function () {
                    var r = Math.floor(Math.random() * 127 + 70);
                    var g = Math.floor(Math.random() * 127 + 80);
                    var b = Math.floor(Math.random() * 127 + 50);
                    return 'rgb(' + r + ',' + g + ',' + b + ')';
                };
                var arrayList = [...data].slice(0, data.length - coloR.length);
                for (var i in arrayList) {
                    ict_unit.push('ICT Unit ' + data[i].ict_unit);
                    efficiency.push(data[i].efficiency);
                    coloR.push(dynamicColors());
                }
            }

            return coloR;
        },
    }
}
</script>