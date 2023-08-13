<template>
    <LeftMenu>
        <div v-if="checkRight('viewDiary')">
            <div class="row mt-4">
                <div class="col-md-12" style="text-align: right;">
                    <button type="button" class="control-btn gray" @click="$router.push('/customer')">
                        <i class='bx bx-arrow-back'></i>
                        <span>Quay lại</span>
                    </button>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-md-3">
                    <div class="col-form-label">Loại</div>
                    <el-select v-model="searchQuery.filters.typeF" placeholder="Loại..." name="typeF" filterable>
                        <el-option label="Tất cả" value="all"></el-option>
                        <el-option label="Thông tin" value="profile"></el-option>
                        <el-option label="Đặt hẹn" value="booking"></el-option>
                        <el-option label="Khám và điều trị" value="examination"></el-option>
                        <el-option label="Thanh toán" value="payment"></el-option>
                    </el-select>
                </div>
                <div class="col-md-3">
                    <div class="col-form-label">Ngày</div>
                    <el-date-picker
                        v-model="searchQuery.filters.dateF"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="Ngày bắt đầu"
                        end-placeholder="Ngày kết thúc"
                        format="dd/MM/yyyy">
                    </el-date-picker>
                </div>
                <div class="col-md-3">
                    <div style="display: flex; height: 100%; align-items: end; gap: 8px;">
                        <button type="button" class="control-btn gray" @click="refreshData()">
                            <i class='bx bx-refresh'></i>
                        </button>
                        <button type="button" class="control-btn green" @click="searchData()">
                            <i class='bx bx-search'></i>
                            Tìm
                        </button>
                    </div>
                </div>
            </div>
            <div class="row mt-4" v-loading="dataLoading">
                <div v-if="data.total > 0" class="col-md-12">
                    <el-timeline>
                        <el-timeline-item v-for="(item, index) in data.data" :key="index" :color="getColor(item.type)" size="large">
                            <div v-if="item.type == 'profile'" class="row">
                                <div class="col-md-12">
                                    <div style="font-weight:bold;">
                                        {{ item.action == 'create' ? 'Tạo mới thông tin' : 'Cập nhật thông tin' }}
                                        <i class='bx bxs-edit-alt'></i>
                                    </div>
                                    <div class="mt-2">
                                        <el-tooltip class="item" effect="dark" content="Xem chi tiết" placement="top">
                                            <a class='text-info' title="Xem sự thay đổi" href='javascript:void(0)'  @click='viewDetailProfileLog(item.note)'>
                                                Chi tiết dữ liệu <i class='el-icon-view'></i>
                                            </a>
                                        </el-tooltip>
                                    </div>
                                    <div class="mt-2" style="font-style: italic;color:#98a6ad;">
                                        {{ item.createdBy }} - {{ $moment(item.createdAt).fromNow() }} ({{ $moment(item.createdAt).format('DD/MM/YY HH:mm') }})
                                    </div>
                                    <el-dialog title="Chi tiết" :visible.sync="detailProfileLog.visible" :close-on-click-modal="false" width="60%">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <table class="table table-bordered">
                                                    <thead style="background-color:#f1f7fd;color:#909399;font-weight:bold;">
                                                        <tr>
                                                            <th style="width: 50%">Dữ liệu mới</th>
                                                            <th style="width: 50%">Dữ liệu cũ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th style="width: 50%">
                                                                <ul v-if="detailProfileLog.data.length > 0">
                                                                    <li class="mb-2" v-for="(item, index) in detailProfileLog.data" :key="index">
                                                                        <div v-if="item.newvalue">
                                                                            &#9900; 
                                                                            <span style="font-weight: bold;">
                                                                                {{ item.column }}: 
                                                                            </span>
                                                                            {{ item.newvalue }}
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </th>
                                                            <th style="width: 50%">
                                                                <tr>
                                                                    <ul v-if="detailProfileLog.data.length > 0">
                                                                        <li class="mb-2" v-for="(item, index) in detailProfileLog.data" :key="index">
                                                                            <div v-if="item.oldvalue">
                                                                                &#9900; 
                                                                                <span style="font-weight: bold;">
                                                                                    {{ item.column }}: 
                                                                                </span>
                                                                                {{ item.oldvalue }}
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                </tr>
                                                            </th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <span slot="footer" class="dialog-footer">
                                            <button type="button" class="control-btn gray" @click="detailProfileLog.visible = false">
                                                <span>Đóng</span>
                                            </button>
                                        </span>
                                    </el-dialog>
                                </div>
                            </div>
                            <div v-else-if="item.type == 'booking'" class="row">
                                <div class="col-md-12">
                                    <div style="font-weight:bold;">
                                        <span v-if="item.action == 'create'">Đặt hẹn</span>
                                        <span v-if="item.action == 'update'">Lịch hẹn được chỉnh sửa</span>
                                        <span v-if="item.action == 'cancel'">Hủy đặt hẹn</span>
                                        <span v-if="item.action == 'checkin'">Đã đến khám</span>
                                        <span v-if="item.action == 'transfer'">Chuyển lịch hẹn</span>
                                        <span v-if="item.action != 'transfer'">({{ (item.note && item.note.length > 0) ? item.note[0].newvalue : '' }})</span>
                                        <i class='bx bxs-edit-alt'></i>
                                    </div>
                                    <div v-if="item.action == 'transfer'" class="mt-2">
                                        <a class='text-info' href='javascript:void(0)'>
                                            {{ (item.note && item.note.length > 0) ? item.note[0].oldvalue : '' }}
                                        </a>
                                        {{ ' &#10142; ' }}
                                        <a class='text-info' href='javascript:void(0)'>
                                            {{ (item.note && item.note.length > 0) ? item.note[0].newvalue : '' }}
                                        </a>
                                    </div>
                                    <div class="mt-2" style="font-style: italic;color:#98a6ad;">
                                        {{ item.createdBy }} - {{ $moment(item.createdAt).fromNow() }} ({{ $moment(item.createdAt).format('DD/MM/YY HH:mm') }})
                                    </div>
                                </div>
                            </div>
                            <div v-else-if="item.type == 'examination'" class="row">
                                <div class="col-md-12">
                                    <div style="font-weight:bold;">
                                        <span v-if="item.action == 'create'">Tạo mới phiếu khám</span>
                                        <span v-if="item.action == 'update'">Cập nhật phiếu khám</span>
                                        <span v-if="item.action == 'confirm'">Xác nhận điều trị</span>
                                        <span v-if="item.action == 'cancel'">Hủy phiếu khám</span>
                                        <i class='bx bxs-edit-alt'></i>
                                    </div>
                                    <div v-if="item.action == 'create' || item.action == 'update'" class="mt-2">
                                        <el-tooltip class="item" effect="dark" content="Xem dữ liệu mới" placement="top">
                                            <a class='text-info' title="Xem sự thay đổi" href='javascript:void(0)' @click="viewExaminationLog(item.note, 'new')">
                                                Dữ liệu mới <i class='el-icon-view'></i>
                                            </a>
                                        </el-tooltip> | 
                                        <el-tooltip class="item" effect="dark" content="Xem dữ liệu cũ" placement="top">
                                            <a class='text-info' title="Xem sự thay đổi" href='javascript:void(0)' @click="viewExaminationLog(item.note, 'old')">
                                                Dữ liệu cũ <i class='el-icon-view'></i>
                                            </a>
                                        </el-tooltip>
                                    </div>
                                    <div v-else class="mt-2">
                                        <el-tooltip class="item" effect="dark" content="Xem dữ liệu" placement="top">
                                            <a class='text-info' title="Xem sự thay đổi" href='javascript:void(0)' @click="viewExaminationLog(item.note, 'new')">
                                                Chi tiết phiếu khám <i class='el-icon-view'></i>
                                            </a>
                                        </el-tooltip>
                                    </div>
                                    <div class="mt-2" style="font-style: italic;color:#98a6ad;">
                                        {{ item.createdBy }} - {{ $moment(item.createdAt).fromNow() }} ({{ $moment(item.createdAt).format('DD/MM/YY HH:mm') }})
                                    </div>
                                    <el-dialog
                                        :visible.sync='examinationLog.visible'
                                        :width='examinationLog.width'
                                        title="Chi tiết"
                                        :close-on-click-modal="false"
                                    >
                                        <div v-if="examinationLog.data" class="container" style="color:#000;">
                                            <div class="row">
                                                <div class="col-md-12 text-center">
                                                    <div style="font-weight:bold;font-size:24px;">PHIẾU KHÁM VÀ ĐIỀU TRỊ</div>
                                                </div>
                                                <div class="col-md-12 mt-2">
                                                    <div class="row">
                                                        <div class="col-md-4"></div>
                                                        <div class="col-md-4 text-center">Ngày {{$moment(examinationLog.data.createdAt).format('DD')}} tháng {{$moment(examinationLog.data.createdAt).format('MM')}} năm {{$moment(examinationLog.data.createdAt).format('YYYY')}}</div>
                                                        <div class="col-md-4 text-right">Mã: {{examinationLog.data.code}}</div>
                                                    </div>
                                                    <div class="row mt-3">
                                                        <div class="col-md-6 mt-2">
                                                            <div class="row">
                                                                <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                                                    <i class='bx bx-check-circle' style="font-size:20px;" ></i>
                                                                    TIỀN SỬ BỆNH
                                                                </div>
                                                                <div class="col-md-12 mt-2">
                                                                    <ul v-if="examinationLog.data.anamnesis != null && examinationLog.data.anamnesis.length > 0" class="ml-3">
                                                                        <li v-for="item in examinationLog.data.anamnesis" :key="item.value" class="mb-2">
                                                                            <span style="font-family:Wingdings">&#118;</span>
                                                                            {{item.label}} {{item.note ? ` - ${item.note}` : ''}}
                                                                        </li>
                                                                    </ul>
                                                                    <ul v-else class="ml-3">
                                                                        <li class="mb-5 pb-2">- Không có</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="row">
                                                                <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                                                    <i class='bx bx-check-circle' style="font-size:20px;" ></i>
                                                                    DỊ ỨNG
                                                                </div>
                                                                <div class="col-md-12 mt-2">
                                                                    <ul v-if="examinationLog.data.allergy != null && examinationLog.data.allergy.allergies != null && examinationLog.data.allergy.allergies.length > 0" class="ml-3">
                                                                        <li v-for="item in examinationLog.data.allergy.allergies" :key="item" class="mb-2">
                                                                            <span style="font-family:Wingdings">&#118;</span>
                                                                            {{getAllergyName(item)}}
                                                                        </li>
                                                                        <li v-if="examinationLog.data.allergy.other" class="mb-2">
                                                                            <span style="font-family:Wingdings">&#118;</span>
                                                                            {{examinationLog.data.allergy.other}}
                                                                        </li>
                                                                    </ul>
                                                                    <ul v-else class="ml-3">
                                                                        <li class="mb-5 pb-2">- Không có</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="row">
                                                                <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                                                    <i class='bx bx-check-circle' style="font-size:20px;" ></i>
                                                                    KHÁM LÂM SÀNG
                                                                </div>
                                                                <div class="col-md-12 mt-2">
                                                                    <ul v-if="examinationLog.data.clinicalExam" class="ml-3">
                                                                        <li  class="mb-2">
                                                                            <span style="font-family:Wingdings">&#118;</span>
                                                                            {{examinationLog.data.clinicalExam}}
                                                                        </li>
                                                                    </ul>
                                                                    <ul v-else class="ml-3">
                                                                        <li class="mb-5 pb-2">- Không có thông tin khám</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mt-2">
                                                            <div class="row">
                                                                <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                                                    <i class='bx bx-check-circle' style="font-size:20px;" ></i>
                                                                    KHÁM CẬN LÂM SÀNG
                                                                </div>
                                                                <div class="col-md-12 mt-2">
                                                                    <ul class="ml-3">
                                                                        <li class="mb-2">
                                                                            <span style="font-family:Wingdings">&#118;</span>
                                                                            X-quang:
                                                                            <span v-if="examinationLog.data.preclinicalExam != null && examinationLog.data.preclinicalExam.xquang != null && examinationLog.data.preclinicalExam.xquang.length > 0">
                                                                                <span v-for="(item, index) in examinationLog.data.preclinicalExam.xquang" :key="index">
                                                                                    {{index > 0 ? ', ' : ' '}} {{getXquangName(item)}}
                                                                                </span>
                                                                            </span> 
                                                                        </li>
                                                                        <li class="mb-2">
                                                                            <span style="font-family:Wingdings">&#118;</span>
                                                                            Xét nghiệm:
                                                                            <span v-if="examinationLog.data.preclinicalExam != null && examinationLog.data.preclinicalExam.test != null && examinationLog.data.preclinicalExam.test.length > 0">
                                                                                <span v-for="(item, index) in examinationLog.data.preclinicalExam.test" :key="index">
                                                                                    {{index > 0 ? ', ' : ' '}} {{getTestName(item)}}
                                                                                </span>
                                                                            </span>
                                                                        </li>
                                                                        <li class="mb-2">
                                                                            <span style="font-family:Wingdings">&#118;</span>
                                                                            Khác: 
                                                                            <span v-if="examinationLog.data.preclinicalExam != null && examinationLog.data.preclinicalExam.other != null">
                                                                                {{examinationLog.data.preclinicalExam.other}}
                                                                            </span>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row mt-2">
                                                        <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                                            <i class='bx bx-check-circle' style="font-size:20px;" ></i>
                                                            CHẨN ĐOÁN VÀ ĐIỀU TRỊ
                                                        </div>
                                                        <div class="col-md-12 mt-2">
                                                            <table class="table table-bordered">
                                                                <thead>
                                                                    <tr class="table-secondary" style="text-align:center;font-weight:bold;"> 
                                                                        <th scope="col">Răng/hàm</th>
                                                                        <th scope="col">Chẩn đoán</th>
                                                                        <th scope="col">Điều trị</th>
                                                                        <th scope="col">Đơn giá</th>
                                                                        <th scope="col">SL</th>
                                                                        <th scope="col">Giảm giá</th>
                                                                        <th scope="col">Thành tiền</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr v-for="item in examinationLog.data.diagnosisTreatment" :key="item.key">
                                                                        <td>
                                                                            {{ getToothName(item.isJaw, item.toothList, item.jaw ? item.jaw[0] : '') }}
                                                                        </td>
                                                                        <td>
                                                                            {{ item.diagnose }}
                                                                        </td>
                                                                        <td>
                                                                            {{ getServiceName(item.serviceId) }}
                                                                        </td>
                                                                        <td style="text-align:right;">
                                                                            {{ (item.unitPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                                                        </td>
                                                                        <td style="text-align:center;">
                                                                            {{ item.isJaw ? item.quantityJaw : item.quantity }}
                                                                        </td>
                                                                        <td style="text-align:right;">
                                                                            {{ (item.discount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                                                        </td>
                                                                        <td style="text-align:right;">
                                                                            {{ (item.totalPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    <div class="row mt-2">
                                                        <div class="col-md-6">
                                                            <div class="row">
                                                                <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                                                    <i class='bx bx-check-circle' style="font-size:20px;"></i>
                                                                    GHI CHÚ
                                                                </div>
                                                                <div class="col-md-12 ml-3 mt-2">
                                                                    {{examinationLog.data.note}}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="row">
                                                                <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                                                    <i class='bx bx-check-circle' style="font-size:20px;"></i>
                                                                    TỔNG CHI PHÍ ĐIỀU TRỊ
                                                                </div>
                                                                <div class="col-md-12 ml-2">
                                                                    <table class="table table-borderless" style="font-size:14px;">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td style="width:40%;font-weight:bold;">Chi phí điều trị</td>
                                                                                <td style="width:5%">:</td>
                                                                                <td style="text-align:right;width:55%">
                                                                                    <span>{{ examinationLog.data.treatmentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }} VND</span>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td style="width:40%;font-weight:bold;">Giảm giá</td>
                                                                                <td style="width:5%">:</td>
                                                                                <td style="text-align:right;width:55%">
                                                                                    <span>{{ examinationLog.data.totalDiscountAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }} VND</span>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td style="width:40%;font-weight:bold;">Thành tiền</td>
                                                                                <td style="width:5%">:</td>
                                                                                <td style="text-align:right;width:55%">
                                                                                    <span>{{ examinationLog.data.totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }} VND</span>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <span slot="footer" class="dialog-footer">
                                            <button type="button" class="control-btn gray" @click="examinationLog.visible = false">
                                                <i class='bx bx-x'></i>
                                                <span>Đóng</span>
                                            </button>
                                        </span>
                                    </el-dialog>
                                </div>
                            </div>
                            <div v-else-if="item.type == 'payment'" class="row">
                                <div class="col-md-12">
                                    <div style="font-weight:bold;">
                                        <span v-if="item.action == 'confirm'">Xác nhận thanh toán</span>
                                        <span v-if="item.action == 'cancel'">Hủy thanh toán</span>
                                        <i class='bx bxs-edit-alt'></i>
                                    </div>
                                    <div v-if="item.action == 'confirm'" class="mt-2">
                                        <el-tooltip class="item" effect="dark" content="Mã phiếu khám" placement="top">
                                            <a class='text-info' href='javascript:void(0)'>
                                                {{ (item.note && item.note.length > 0) ? item.note[0].newvalue.code : '' }}
                                            </a>
                                        </el-tooltip> | 
                                        <el-tooltip class="item" effect="dark" content="Số tiền thanh toán" placement="top">
                                            <a class='text-info' href='javascript:void(0)'>
                                                {{ (item.note && item.note.length > 0) ? `${item.note[0].newvalue.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VND` : '' }}
                                            </a>
                                        </el-tooltip>
                                    </div>
                                    <div v-if="item.action == 'cancel'" class="mt-2">
                                        <el-tooltip class="item" effect="dark" content="Mã phiếu khám" placement="top">
                                            <a class='text-info' href='javascript:void(0)'>
                                                {{ (item.note && item.note.length > 0) ? item.note[0].newvalue.code : '' }}
                                            </a>
                                        </el-tooltip> | 
                                        <el-tooltip class="item" effect="dark" content="Lý do hủy" placement="top">
                                            <a class='text-info' href='javascript:void(0)'>
                                                {{ (item.note && item.note.length > 0) ? item.note[0].newvalue.cancelReason : '' }}
                                            </a>
                                        </el-tooltip>
                                    </div>
                                    <div class="mt-2" style="font-style: italic;color:#98a6ad;">
                                        {{ item.createdBy }} - {{ $moment(item.createdAt).fromNow() }} ({{ $moment(item.createdAt).format('DD/MM/YY HH:mm') }})
                                    </div>
                                </div>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </div>
                <div v-else class="col-md-12">
                    <el-empty description="Không có dữ liệu"></el-empty>
                </div>
            </div>
            <div class="row mb-4">
                <div class="col-md-12">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="[1, 5, 10, 20, 50, 100]"
                        :page-size="5"
                        background
                        layout="total, sizes, prev, pager, next"
                        :total="data.total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div v-else>
            <el-empty description="Bạn không có quyền !!"></el-empty>
        </div>
    </LeftMenu>
</template>

<script>
import { mapState } from 'vuex';
import LeftMenu from '@/components/customer/LeftMenu';
import Customer from '@/models/tw_Customer';
import Examination from '@/models/tw_Examination';
import { cloneDeep, debounce, intersection, remove } from 'lodash';
export default {
    components: {
		LeftMenu,
	},
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data(){
        return{
            searchQuery: {
                filters: {
                    typeF: 'all',
                    dateF: [],
                },
                sorts: 'createdAt&&-1',
                pages:{
                    from: 0,
                    size: 5
                }
            },
            dentistsData: [],
            dataLoading: true,
            data: {},
            currentPage: 1,
            customerInfo: new Customer(),
            xquangData: [],
            testData: [],
            allergyData: [],
            serviceData: [],
            viewReceiptDialog: {
                visible: false,
                data: null,
            },
            detailProfileLog: {
                visible: false,
                data: []
            },
            examinationLog:{
                visible: false,
                data: null,
                width: '60%'
            }
        }
    },
    async created(){
        const _this = this;
        //Lấy danh sách nha sĩ
        await _this.$axios.$get('/api/user/getDentist').then(
            (response) => {
                _this.dentistsData = response.data || [];
            },
            (error) => {
                console.log('Error: ', error);
                _this.$message({
                    type: 'error',
                    message: 'Có lỗi xảy ra',
                });
            }
        );
        //Lấy thông tin khách hàng
        if (_this.$route.params.id) {
            await _this.$axios.$get(`/api/customer/getById/${_this.$route.params.id}`).then(
				async (response) => {
                    _this.customerInfo = response.data || new Customer();
				},
				(error) => {
                    console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: 'Có lỗi xảy ra',
					});
					 _this.customerInfo = new Customer();
				}
			);
        }
         //Lấy danh sách loại x-quang
        _this.xquangData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamXquang' })) || [];
        //Lấy danh sách loại xét nghiệm
        _this.testData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamTest' })) || [];
        //Lấy danh sách dị ứng
        _this.allergyData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamAllergy' })) || [];
        //Lấy danh sách dịch vụ
        const services = await _this.$axios.$post('/api/service/getByQuery', {
            filters: {
                nameF: '',
                codeF: '',
                groupF: '',
                statusF: true
            },
            sorts: 'name&&1',
            pages:{
                from: 0,
                size: 1000
            }
        });
        _this.serviceData = services.data;
        //Lấy danh sách dữ liệu
        await _this.getData(_this.searchQuery);
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['customer.all', 'customer.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        searchData(){
            const _this = this;
            _this.currentPage = 1;
            _this.searchQuery.pages.from = 0;
            _this.getData(_this.searchQuery)
        },
        refreshData(){
            const _this = this;
            _this.searchQuery.filters = {
                // codeF: '',
                // dentistsF: [],
                typeF: 'all',
                dateF: []
            }
            _this.searchQuery.pages.from = 0;
            _this.currentPage = 1;
            _this.getData(_this.searchQuery);
        },
        async getData(searchQuery){
            const _this = this;
            _this.dataLoading = true;
            if (_this.$route.params.id) {
                searchQuery.filters.customerF = _this.$route.params.id;
                await _this.$axios.$post('/api/customer/getByQueryDiary', searchQuery).then(
                    (response) => {
                        _this.data = response;
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
            _this.dataLoading = false;
        },
        handleSizeChange(val) {
            const _this = this;
            _this.searchQuery.pages.size = val;
            _this.getData(_this.searchQuery);
        },
        handleCurrentChange(val) {
            const _this = this;
            _this.searchQuery.pages.from = (_this.currentPage - 1) * _this.searchQuery.pages.size;
            _this.getData(_this.searchQuery);
        },
        printExamination(id){
            const _this = this;
            _this.$refs.html2Pdf_history.generatePdf();
        },
        getXquangName(value){
            const _this = this;
            let data = _.find(_this.xquangData, { value: value });
			return data ? data.label : '';
        },
        getTestName(value){
            const _this = this;
            let data = _.find(_this.testData, { value: value });
			return data ? data.label : '';
        },
        getAllergyName(value){
            const _this = this;
            let data = _.find(_this.allergyData, { value: value });
			return data ? data.label : '';
        },
        getToothName(isJaw, toothList, jaw){
            const _this = this;
            if(isJaw){
                if(jaw == 'twoJaw'){
                    return 'Hai hàm';
                }
                else if(jaw == 'upperJaw'){
                    return 'Hàm trên';
                }
                else if(jaw == 'lowerJaw'){
                    return 'Hàm dưới';
                }
                else{
                    return '';
                }
            }
            else{
                if(toothList != null && toothList.length > 0){
                    var newArr = _.map(toothList, item => {
                        return `R${item}`;
                    })
                    var text = newArr.join(", ");
                    return text;
                }
                else{
                    return '';
                }
            }
        },
        getServiceName(serviceId){
            const _this = this;
            let data = _.find(_this.serviceData, { _id: serviceId });
			return data ? data.name : '';
        },
        async viewPayment(data){
            const _this = this;
            if (data && data.targetId) {
                await _this.$axios.$get(`/api/receipts/getById/${data.targetId}`).then(
                    async (response) => {
                        _this.viewReceiptDialog.data = response.data[0];
                        _this.viewReceiptDialog.visible = true;
                        console.log(_this.viewReceiptDialog.data)
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
        printReceipt(id){
            const _this = this;
            _this.$refs.html2Pdf_receipt.generatePdf();
        },
        getColor(type){
            if(type == 'profile'){
                return '#659be0';
            }
            else if(type == 'booking'){
                return '#DC3545';
            }
            else if(type == 'examination'){
                return '#64dd17';
            }
            else if(type == 'FFCA2C'){
                return '#64dd17';
            }
            else{
                return '#64dd17';
            }
        },
        viewDetailProfileLog(data){
            const _this = this;
            _this.detailProfileLog.data = data;
            _this.detailProfileLog.visible = true;
        },
        viewExaminationLog(data, type){
            const _this = this;
            if(type == 'new'){
                if(data && data.length > 0){
                    _this.examinationLog.data = data[0].newvalue;
                    _this.examinationLog.visible = true;
                }
            }
            else if(type == 'old'){
                if(data && data.length > 0){
                    _this.examinationLog.data = data[0].oldvalue;
                    _this.examinationLog.visible = true;
                }
            }
        }
    }
}
</script>