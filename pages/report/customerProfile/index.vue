<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Báo cáo khách hàng</div>
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
                <!-- Độ tuổi, giới tính -->
                <div class="row mt-3">
                    <!-- Độ tuổi -->
                    <div class="col-xl-6 mb-3">
                        <el-card class="box-card" style="height:100%;">
                            <div slot="header" class="clearfix">
                                <span style="font-weight:bold;color:rgb(104 102 102);">Độ tuổi</span>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <bar-chart
                                        v-if="!dataLoading"
                                        :width="600"
                                        :height="300"
										:options="ageGroupReport.options"
										:labels="ageGroupReport.labels"
										:datasets="ageGroupReport.datasets"
									/>
                                </div>
                            </div>
                        </el-card>
                    </div>
                    <!-- Giới tính -->
                    <div class="col-xl-6 mb-3">
                        <el-card class="box-card" style="height:100%;">
                            <div slot="header" class="clearfix">
                                <span style="font-weight:bold;color:rgb(104 102 102);">Giới tính</span>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <doughnut-chart
                                        v-if="!dataLoading"
                                        :width="600"
                                        :height="300"
                                        :labels="genderReport.labels"
                                        :datasets="genderReport.datasets"
                                        :options="genderReport.options"
                                    />
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
                <!-- Tỉnh/Thành phố -->
                <div class="row">
                    <div class="col-md-12">
                        <el-card class="box-card" style="height:100%;">
                            <div slot="header" class="clearfix">
                                <span style="font-weight:bold;color:rgb(104 102 102);">Tỉnh, thành phố</span>
                            </div>
                            <div class="row" style="justify-content:center;">
                                <div class="col-xl-8 mb-3">
                                    <bar-chart
                                        v-if="!dataLoading"
                                        :width="500"
                                        :height="300"
										:options="cityReport.options"
										:labels="cityReport.labels"
										:datasets="cityReport.datasets"
									/>
                                </div>
                                <div class="col-sm-10 col-xl-4 mb-3">
                                    <el-table :data="cityReportTable" v-loading="dataLoading" max-height="350" style="width: 100%" stripe>
                                        <el-table-column type="index" width="60" label="#"></el-table-column>
                                        <el-table-column label="Tỉnh/thành phố">
                                            <template slot-scope="scope">
                                                {{scope.row.label}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Số lượng" width="100" align="center">
                                            <template slot-scope="scope">
                                                {{scope.row.count}}
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
                <div class="row mt-3">
                    <!-- Nhóm KH -->
                    <div class="col-md-6 mb-3">
                        <el-card class="box-card" style="height:100%;">
                            <div slot="header" class="clearfix">
                                <span style="font-weight:bold;color:rgb(104 102 102);">Nhóm khách hàng</span>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <pie-chart
                                        v-if="!dataLoading"
                                        :width="600"
                                        :height="300"
                                        :labels="groupReport.labels"
                                        :datasets="groupReport.datasets"
                                        :options="groupReport.options"
                                    />
                                </div>
                            </div>
                        </el-card>
                    </div>
                    <!-- Nguồn KH -->
                    <div class="col-md-6 mb-3">
                        <el-card class="box-card" style="height:100%;">
                            <div slot="header" class="clearfix">
                                <span style="font-weight:bold;color:rgb(104 102 102);">Nguồn khách hàng</span>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <pie-chart
                                        v-if="!dataLoading"
                                        :width="600"
                                        :height="300"
                                        :labels="sourceReport.labels"
                                        :datasets="sourceReport.datasets"
                                        :options="sourceReport.options"
                                    />
                                </div>
                            </div>
                        </el-card>
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
            ageGroupReport:{
                options: {
                    responsive: true,
                    legend: {
                        display: true,
                        position: 'bottom',
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
                                barThickness: 30, // number (pixels) or 'flex'
                                maxBarThickness: 30, //
                            },
                        ],
                        yAxes: [
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
                    },
                    plugins: {
                        datalabels: {
                            // align: 'end',
                            // anchor: 'end',
                            // offset: 2,
                            // color: '#aaaaaa',
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
                },
                labels: [],
                datasets: []
            },
            genderReport: {
                options: {
                    responsive: true,
				    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    legend: {
                        position: 'bottom',
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
            cityReport: {
                options: {
                    responsive: true,
                    legend: {
                        display: false,
                        position: 'bottom',
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
                                barThickness: 30, // number (pixels) or 'flex'
                                maxBarThickness: 30, //
                            },
                        ],
                        yAxes: [
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
                    },
                    plugins: {
                        datalabels: {
                            // align: 'end',
                            // anchor: 'end',
                            // offset: 2,
                            // color: '#aaaaaa',
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
                },
                labels: [],
                datasets: []
            },
            provinceMasterData: [],
            cityReportTable:[],
            groupReport: {
                options: {
                    responsive: true,
				    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    legend: {
                        position: 'bottom',
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
            sourceReport: {
                options: {
                    responsive: true,
				    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    legend: {
                        position: 'bottom',
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
        }
    },
    async created(){
        const _this = this;
        _this.provinceMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'provinceMasterData' })) || [];
        await _this.getData();
    },
    methods:{
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['customerProfile.all', 'customerProfile.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        async getData(){
            const _this = this;
            _this.dataLoading = true;
            await _this.getAgeGroupReport();
            await _this.getGenderReport();
            await _this.getCityReport();
            await _this.getGroupReport();
            await _this.getSourceReport();
            _this.dataLoading = false;
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
        async getAgeGroupReport(){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/report/getAgeGroupReport', _this.searchQuery).then(
                (response) => {
                    if(response.success){
                        let labels = _.map(response.data, (m) => {
                            return m?.label;
                        });
                        _this.ageGroupReport.labels = labels;
                        let backgroundColors = _this.generateColors(response.data);
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
                        _this.ageGroupReport.datasets = datasetOne || [];
                    }
                    else{
                        console.log('Error (Độ tuổi): ', error);
                        _this.$message({
                            type: 'error',
                            message: 'Có lỗi xảy ra',
                        });
                    }
                },
                (error) => {
                    console.log('Error (Độ tuổi): ', error);
                    _this.$message({
                        type: 'error',
                        message: 'Có lỗi xảy ra',
                    });
                }
            );
            _this.dataLoading = false;
        },
        async getGenderReport(){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/report/getGenderReport', _this.searchQuery).then(
                (response) => {
                    if(response.success){
                        let labels = _.map(response.data, (m) => {
                            return m?.label;
                        });
                        let countData = _.map(response.data, (m) => {
                            return m.value;
                        });
                        _this.genderReport.labels = labels;
                        let datasetOne = {
                            data: countData,
                            backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 99, 132)', 'rgb(255, 205, 86)'],
                        };
                        _this.genderReport.datasets = [datasetOne];
                    }
                    else{
                        console.log('Error (Giới tính): ', error);
                        _this.$message({
                            type: 'error',
                            message: 'Có lỗi xảy ra',
                        });
                    }
                },
                (error) => {
                    console.log('Error (Giới tính): ', error);
                    _this.$message({
                        type: 'error',
                        message: 'Có lỗi xảy ra',
                    });
                }
            );
            _this.dataLoading = false;
        },
        async getCityReport(){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/report/getCityReport', _this.searchQuery).then(
                (response) => {
                    if(response.success){
                        response.data = _.map(response.data, (m) => {
                            if(m.label){
                                var province = _this.provinceMasterData.find(f => f.value == m.label);
                                return {
                                    ...m,
                                    label: province.label
                                }
                            }
                            else{
                                return {
                                    ...m,
                                    label: 'Chưa xác định'
                                }
                            }
                        });
                        let labels = _.map(response.data, (m) => {
                            return m?.label;
                        });
                        _this.cityReport.labels = labels;
                        let backgroundColors = _this.generateColors(response.data);
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
                        _this.cityReport.datasets = datasetOne || [];
                        _this.cityReportTable = response.data || [];
                        _this.cityReportTable.sort((a, b) => { return b.count - a.count });
                    }
                    else{
                        console.log('Error (Tỉnh thành): ', error);
                        _this.$message({
                            type: 'error',
                            message: 'Có lỗi xảy ra',
                        });
                    }
                },
                (error) => {
                    console.log('Error (Tỉnh thành): ', error);
                    _this.$message({
                        type: 'error',
                        message: 'Có lỗi xảy ra',
                    });
                }
            );
            _this.dataLoading = false;
        },
        async getGroupReport(){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/report/getGroupReport', _this.searchQuery).then(
                (response) => {
                    if(response.success){
                        let labels = _.map(response.data, (m) => {
                            return m?.label;
                        });
                        _this.groupReport.labels = labels;
                        let backgroundColors = _this.generateColors(response.data);
                        let countData = _.map(response.data, (m) => {
                            return m.count;
                        });
                        let datasetOne = {
                            data: countData,
                            backgroundColor: backgroundColors,
                        };
                        _this.groupReport.datasets = [datasetOne];
                    }
                    else{
                        console.log('Error (Nhóm KH): ', error);
                        _this.$message({
                            type: 'error',
                            message: 'Có lỗi xảy ra',
                        });
                    }
                },
                (error) => {
                    console.log('Error (Nhóm KH): ', error);
                    _this.$message({
                        type: 'error',
                        message: 'Có lỗi xảy ra',
                    });
                }
            );
            _this.dataLoading = false;
        },
        async getSourceReport(){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/report/getSourceReport', _this.searchQuery).then(
                (response) => {
                    if(response.success){
                        let labels = _.map(response.data, (m) => {
                            return m?.label;
                        });
                        _this.sourceReport.labels = labels;
                        let backgroundColors = _this.generateColors(response.data);
                        let countData = _.map(response.data, (m) => {
                            return m.count;
                        });
                        let datasetOne = {
                            data: countData,
                            backgroundColor: backgroundColors,
                        };
                        _this.sourceReport.datasets = [datasetOne];
                    }
                    else{
                        console.log('Error (Nguồn KH): ', error);
                        _this.$message({
                            type: 'error',
                            message: 'Có lỗi xảy ra',
                        });
                    }
                },
                (error) => {
                    console.log('Error (Nguồn KH): ', error);
                    _this.$message({
                        type: 'error',
                        message: 'Có lỗi xảy ra',
                    });
                }
            );
            _this.dataLoading = false;
        },
    }
}
</script>