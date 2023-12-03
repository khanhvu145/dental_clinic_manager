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
                    <div class="col-md-3 mb-2">
                        <el-select v-model="searchQuery.typeF" filterable name="typeF" @change="getData()">
                            <el-option label="Theo ngày" value="day"></el-option>
                            <el-option label="Theo tháng" value="month"></el-option>
                            <el-option label="Theo năm" value="year"></el-option>
                        </el-select>
                    </div>
                    <div v-if="searchQuery.typeF == 'day'" class="col-md-4 mb-2">
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
                    <div v-if="searchQuery.typeF == 'month'" class="col-md-4 mb-2">
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
                    <div v-if="searchQuery.typeF == 'year'" class="col-md-4 mb-2">
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
                    <div class="col-md-5 mb-2 text-right text-md-left">
                        <button type="button" class="control-btn green" @click="getData()">
                            Xem báo cáo
                        </button>
                        <button type="button" v-loading="exportReportLoading" class="control-btn yellow" @click="exportReport()">
                            Xuất báo cáo
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
                        <el-card id="revenueReport" class="box-card" style="height:100%;">
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
                    <el-dialog :title="revenueReportDetail.title" :visible.sync="revenueReportDetail.visible" :close-on-click-modal="false" width="95%">
                        <div class="row">
                            <div v-if="revenueReportDetail.data && revenueReportDetail.data.revenue" class="col-md-12">
                                <fieldset class="custom-fieldset">
                                    <legend class="custom-legend">Chi tiết doanh thu</legend>
                                    <el-table class="mt-3" :data="revenueReportDetail.data.revenue" style="width: 100%" max-height="400" stripe border show-summary :summary-method="getSummariesRevenue">
                                        <el-table-column label="Ngày thanh toán" min-width="150">
                                            <template slot-scope="scope">
                                                <div>
                                                    {{ scope.row.createdAt ? $moment(scope.row.createdAt).format('DD/MM/YYYY') : '' }}
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Số tiền" min-width="150" prop="amount" align="right">
                                            <template slot-scope="scope">
                                                {{ (scope.row.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Hình thức thanh toán" min-width="180">
                                            <template slot-scope="scope">
                                                <div style="text-align:center;">
                                                    <el-tag v-if="scope.row.methodFee == 'transfer'" type="danger">Chuyển khoản</el-tag>
                                                    <el-tag v-if="scope.row.methodFee == 'cash'" type="warning">Tiền mặt</el-tag>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Khách hàng" min-width="150">
                                            <template slot-scope="scope">
                                                {{ `(${scope.row.customerCode})` || 'N/A' }}
                                                {{ scope.row.customerName || 'N/A' }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Ghi chú" min-width="150">
                                            <template slot-scope="scope">
                                                {{ scope.row.note || '' }}
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </fieldset>
                            </div>
                            <div v-if="revenueReportDetail.data && revenueReportDetail.data.expenditure" class="col-md-12 mt-3">
                                <fieldset class="custom-fieldset">
                                    <legend class="custom-legend">Chi tiết chi phí</legend>
                                    <el-table class="mt-3" :data="revenueReportDetail.data.expenditure" style="width: 100%" max-height="400" stripe border show-summary :summary-method="getSummariesExpenditure">
                                        <el-table-column label="Ngày chi" min-width="150">
                                            <template slot-scope="scope">
                                                {{ scope.row.date ? $moment(scope.row.date).format('DD/MM/YYYY') : '' }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Số tiền" min-width="150" prop="amount" align="right">
                                            <template slot-scope="scope">
                                                {{ (scope.row.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Chứng từ gốc" min-width="180">
                                            <template slot-scope="scope">
                                                <div v-for="(item, index) in scope.row.originalDocuments" :key="index">
                                                    <span style="font-family:Wingdings">&#118;</span>
                                                    {{ item }}
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Đơn vị nhận tiền" min-width="150">
                                            <template slot-scope="scope">
                                                <div>
                                                    <i class='bx bx-user'></i>
                                                    {{ scope.row.receivingUnit || '' }}
                                                </div>
                                                <div>
                                                    <i class='bx bx-location-plus' ></i>
                                                    {{ scope.row.addressUnit || '' }}
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Nội dung" min-width="150">
                                            <template slot-scope="scope">
                                                {{ scope.row.content || '' }}
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </fieldset>
                            </div>
                        </div>
                        <span slot="footer" class="dialog-footer">
                            <button type="button" class="control-btn gray" @click="revenueReportDetail.visible = false">
                                <i class='bx bx-x'></i>
                                <span>Đóng</span>
                            </button>
                        </span>
                    </el-dialog>
                </div>
                <div class="row mt-3">
                    <!-- Công nợ -->
                    <div class="col-md-6">
                        <el-card id="debtReport" class="box-card" style="height:100%;">
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
                        <el-card id="appointmentReport" class="box-card" style="height:100%;">
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
                        <el-card id="examinationReport" class="box-card" style="height:100%;">
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
                        <el-card id="serviceGroupReport" class="box-card" style="height:100%;">
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
                        <el-card id="serviceReport" class="box-card" style="height:100%;">
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
                                        v-if="!dataLoading && !serviceReport.loading"
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
            <!-- Report template pdf -->
            <vue-html2pdf
				class="export-report-template"
				id="export-report-template"
				:show-layout="false"
				:float-layout="true"
				:preview-modal="true"
				:enable-download="false"
				:paginate-elements-by-height="1000"
				filename="reportFile"
				:pdf-quality="2"
				:manual-pagination="true"
				pdf-format="A4"
				pdf-content-width="100%"
				ref="exportReportTemplate"
				pdf-orientation="landscape"
			>
                <section class="col-12 px-0" slot="pdf-content">
                    <div id="export-report-template-content" class="content-print px-3 py-3" style="height:100%;background-color:white;">
                        <div class="row mt-3">
                            <div class="col-3 mb-2">
                                <el-select v-model="searchQuery.typeF" filterable name="typeF">
                                    <el-option label="Theo ngày" value="day"></el-option>
                                    <el-option label="Theo tháng" value="month"></el-option>
                                    <el-option label="Theo năm" value="year"></el-option>
                                </el-select>
                            </div>
                            <div v-if="searchQuery.typeF == 'day'" class="col-4 mb-2">
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
                            <div v-if="searchQuery.typeF == 'month'" class="col-4 mb-2">
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
                            <div v-if="searchQuery.typeF == 'year'" class="col-4 mb-2">
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
                        </div>
                        <div class="row mt-4">
                            <div class="col-12 text-center" style="font-weight:bold;font-size:24px;">
                                BÁO CÁO TỔNG QUAN
                            </div>
                        </div>
                        <div class="row mt-3">
							<div class="col-12">
                                <div class="row">
                                    <div class="col-8" style="margin: 0 auto;">
                                        <el-card class="box-card">
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
                                </div>
                                <div class="row mt-3">
                                    <div class="col-8" style="margin: 0 auto;">
                                        <el-card class="box-card">
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
                                                    </div>
                                                </div>
                                            </div>
                                        </el-card>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-8" style="margin: 0 auto;">
                                        <el-card class="box-card">
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
                                                    </div>
                                                </div>
                                            </div>
                                        </el-card>
                                    </div>
                                </div>
                            </div>
						</div>
                        <div class="html2pdf__page-break"/>
                        <div class="row export-report-template-item revenueReportChart mt-3">
							<div class="col-md-12 export-report-template-chart"></div>
						</div>
                        <div class="html2pdf__page-break"/>
                        <div class="row export-report-template-item debtReportChart mt-3">
							<div class="col-md-12 export-report-template-chart"></div>
						</div>
                        <div class="html2pdf__page-break"/>
                        <div class="row export-report-template-item appointmentReportChart mt-3">
							<div class="col-md-12 export-report-template-chart"></div>
						</div>
                        <div class="html2pdf__page-break"/>
                        <div class="row export-report-template-item examinationReportChart mt-3">
							<div class="col-md-12 export-report-template-chart"></div>
						</div>
                        <div class="html2pdf__page-break"/>
                        <div class="row export-report-template-item serviceGroupReportChart mt-3">
							<div class="col-md-12 export-report-template-chart"></div>
						</div>
                        <div class="html2pdf__page-break"/>
                        <div class="row export-report-template-item serviceReportChart mt-3">
							<div class="col-md-12 export-report-template-chart"></div>
						</div>
                    </div>
                </section>
            </vue-html2pdf>
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
                    onClick: async(e) => {
                        const _this = this;
                        if(e){
                            const chart = _this.$refs.revenueReportChart.chart;
                            var bar = chart.getElementsAtEvent(e)[0];
                            if(bar){
                                var index = bar._index;
                                var label = chart.data.labels[index];
                                await _this.$axios.$post('/api/report/getRevenueExpenditureReportDetail', {
                                    typeF: _this.searchQuery.typeF,
                                    label: label
                                }).then(
                                    (response) => {
                                        if(response.success){
                                            _this.revenueReportDetail.title = `Chi tiết thu chi - ${label}`;
                                            _this.revenueReportDetail.data = response;
                                            _this.revenueReportDetail.visible = true;
                                        }
                                        else{
                                            console.log('Error (Chi tiết thu chi): ', error);
                                        }
                                    },
                                    (error) => {
                                        console.log('Error (Chi tiết thu chi): ', error);
                                    }
                                );
                            }
                        }
                    }
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
                            },
                        ],
                    },
                    plugins: {
                        datalabels: {
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
                                if(tooltipItem.xLabel){
                                    var label = data.datasets[tooltipItem.datasetIndex].label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += Number(tooltipItem.xLabel).toLocaleString();
                                    return label;
                                }
                                else{
                                    return '';
                                }
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
                            },
                        ],
                    },
                    plugins: {
                        datalabels: {
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
                                if(tooltipItem.xLabel){
                                    var label = data.datasets[tooltipItem.datasetIndex].label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += Number(tooltipItem.xLabel).toLocaleString();
                                    return label;
                                }
                                else{
                                    return '';
                                }
                            },
                        },
                    },
                },
                labels: [],
                datasets: [],
                loading: false,
            },
            serviceGroupId: '',
            serviceGroupData: [],
            revenueReportDetail: {
                title: '',
                visible: false,
                data: {}
            },
            exportReportLoading: false,
        }
    },
    async created(){
        const _this = this;
        await _this.getData();
        console.log(new Date(new Date(moment('01/10/2023', 'DD MM YYYY').format('YYYY/MM/DD')).setHours(0,0,0,0)))
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
        getSummariesRevenue(param){
            const { columns, data } = param;
			const _this = this;
            let sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = 'Tổng';
                    return;
                }
                if (index === 1) {
                    const values = data.map(item => Number(item[column.property]));
                    var total = values.reduce((partialSum, a) => partialSum + a, 0);
                    var totalString = (total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
                    sums[index] = totalString;
                    return;
                }
            });
            return sums;
        },
        getSummariesExpenditure(param){
            const { columns, data } = param;
			const _this = this;
            let sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = 'Tổng';
                    return;
                }
                if (index === 1) {
                    const values = data.map(item => Number(item[column.property]));
                    var total = values.reduce((partialSum, a) => partialSum + a, 0);
                    var totalString = (total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
                    sums[index] = totalString;
                    return;
                }
            });
            return sums;
        },
        async exportReport(){
            const _this = this;
            window.scrollTo(0, 0);
            _this.exportReportLoading = true;
            _this.$message({
                type: "warning",
                message: "Quá trình xuất dữ liệu đang diễn ra, xin đợi trong giây lát",
                duration: 0
            });
            _this.getReportTemplateContent().then(() => {
                _this.$refs.exportReportTemplate.generatePdf();
                _this.exportReportLoading = false;
                _this.$message.closeAll();
                _this.$notify({
                    title: "Thành công",
                    message: "Xuất báo cáo thành công",
                    type: 'success',
                });
            }).catch(() => {
                _this.exportReportLoading = false;
                _this.$message.closeAll();
                _this.$notify({
                    title: "Thất bại",
                    message: "Xuất báo cáo không thành công",
                    type: 'error',
                });
            });;
        },
        async getReportTemplateContent(){
            const _this = this;
            //#region Thu/chi
            const printElerevenueReport = _this.$refs.exportReportTemplate.$el.querySelector("#export-report-template-content .revenueReportChart .export-report-template-img");
            if (printElerevenueReport) {
                printElerevenueReport.remove();
            }
            var revenueReportCanvas = await this.$html2canvas(document.getElementById("revenueReport"), { type: 'dataURL' });
            var revenueReportElement = _this.$refs.exportReportTemplate.$el.querySelector("#export-report-template-content .revenueReportChart .export-report-template-chart");
            if(revenueReportElement && revenueReportCanvas){
                let revenueReportImg = document.createElement('img');
                revenueReportImg.classList.add('export-report-template-img');
                revenueReportImg.src = revenueReportCanvas;
                revenueReportImg.style.height = "100%";
                revenueReportImg.style.width = "100%";
                revenueReportElement.appendChild(revenueReportImg);
            }
            //#endregion
            //#region Công nợ
            const printEledebtReport = _this.$refs.exportReportTemplate.$el.querySelector("#export-report-template-content .debtReportChart .export-report-template-img");
            if (printEledebtReport) {
                printEledebtReport.remove();
            }
            var debtReportCanvas = await this.$html2canvas(document.getElementById("debtReport"), { type: 'dataURL' });
            var debtReportElement = _this.$refs.exportReportTemplate.$el.querySelector("#export-report-template-content .debtReportChart .export-report-template-chart");
            if(debtReportElement && debtReportCanvas){
                let debtReportImg = document.createElement('img');
                debtReportImg.classList.add('export-report-template-img');
                debtReportImg.src = debtReportCanvas;
                debtReportImg.style.height = "100%";
                debtReportImg.style.width = "100%";
                debtReportElement.appendChild(debtReportImg);
            }
            //#endregion
            //#region Lịch hẹn
            const printEleappointmentReport = _this.$refs.exportReportTemplate.$el.querySelector("#export-report-template-content .appointmentReportChart .export-report-template-img");
            if (printEleappointmentReport) {
                printEleappointmentReport.remove();
            }
            var appointmentReportCanvas = await this.$html2canvas(document.getElementById("appointmentReport"), { type: 'dataURL' });
            var appointmentReportElement = _this.$refs.exportReportTemplate.$el.querySelector("#export-report-template-content .appointmentReportChart .export-report-template-chart");
            if(appointmentReportElement && appointmentReportCanvas){
                let appointmentReportImg = document.createElement('img');
                appointmentReportImg.classList.add('export-report-template-img');
                appointmentReportImg.src = appointmentReportCanvas;
                appointmentReportImg.style.height = "100%";
                appointmentReportImg.style.width = "100%";
                appointmentReportElement.appendChild(appointmentReportImg);
            }
            //#endregion
            //#region Khám và điều trị
            const printEleexaminationReport = _this.$refs.exportReportTemplate.$el.querySelector("#export-report-template-content .examinationReportChart .export-report-template-img");
            if (printEleexaminationReport) {
                printEleexaminationReport.remove();
            }
            var examinationReportCanvas = await this.$html2canvas(document.getElementById("examinationReport"), { type: 'dataURL' });
            var examinationReportElement = _this.$refs.exportReportTemplate.$el.querySelector("#export-report-template-content .examinationReportChart .export-report-template-chart");
            if(examinationReportElement && examinationReportCanvas){
                let examinationReportImg = document.createElement('img');
                examinationReportImg.classList.add('export-report-template-img');
                examinationReportImg.src = examinationReportCanvas;
                examinationReportImg.style.height = "100%";
                examinationReportImg.style.width = "100%";
                examinationReportElement.appendChild(examinationReportImg);
            }
            //#endregion
            //#region Nhóm dịch vụ
            const printEleserviceGroupReport = _this.$refs.exportReportTemplate.$el.querySelector("#export-report-template-content .serviceGroupReportChart .export-report-template-img");
            if (printEleserviceGroupReport) {
                printEleserviceGroupReport.remove();
            }
            var serviceGroupReportCanvas = await this.$html2canvas(document.getElementById("serviceGroupReport"), { type: 'dataURL' });
            var serviceGroupReportElement = _this.$refs.exportReportTemplate.$el.querySelector("#export-report-template-content .serviceGroupReportChart .export-report-template-chart");
            if(serviceGroupReportElement && serviceGroupReportCanvas){
                let serviceGroupReportImg = document.createElement('img');
                serviceGroupReportImg.classList.add('export-report-template-img');
                serviceGroupReportImg.src = serviceGroupReportCanvas;
                serviceGroupReportImg.style.height = "100%";
                serviceGroupReportImg.style.width = "100%";
                serviceGroupReportElement.appendChild(serviceGroupReportImg);
            }
            //#endregion
            //#region Dịch vụ
            const printEleserviceReport = _this.$refs.exportReportTemplate.$el.querySelector("#export-report-template-content .serviceReportChart .export-report-template-img");
            if (printEleserviceReport) {
                printEleserviceReport.remove();
            }
            var serviceReportCanvas = await this.$html2canvas(document.getElementById("serviceReport"), { type: 'dataURL' });
            var serviceReportElement = _this.$refs.exportReportTemplate.$el.querySelector("#export-report-template-content .serviceReportChart .export-report-template-chart");
            if(serviceReportElement && serviceReportCanvas){
                let serviceReportImg = document.createElement('img');
                serviceReportImg.classList.add('export-report-template-img');
                serviceReportImg.src = serviceReportCanvas;
                serviceReportImg.style.height = "100%";
                serviceReportImg.style.width = "100%";
                serviceReportElement.appendChild(serviceReportImg);
            }
            //#endregion
        }
    }
}
</script>