<template>
    <LeftMenu>
        <div v-if="checkRight('createExamination')">
            <div class="row mt-4">
                <div class="col-md-12" style="text-align: right;">
                    <button type="button" class="control-btn gray" @click="$router.push('/customer')">
                        <i class='bx bx-arrow-back'></i>
                        <span>Quay lại</span>
                    </button>
                </div>
            </div>
            <form v-if="isExam" class="row mt-3 mb-4" v-loading="dataLoading" v-on:submit.prevent="submitForm">
                <div class="col-md-12">
                    <el-card class="box-card">
                        <div slot="header" class="card-header-custom" style="font-size:14px;font-weight:bold;">
                            <span>NGÀY KHÁM: {{ $moment().format('DD/MM/YYYY') }}</span>
                            <div v-if="formData._id" class="">
                                <a  class="btn control-btn gray" @click="isExam = false">
                                    <i class='bx bx-x'></i>
                                    <span>Đóng</span>
                                </a>
                                <a class="btn control-btn blue" @click="addExamForm">
                                    <i class='bx bx-plus' ></i>
                                    <span>Tạo phiếu khám mới</span>
                                </a>
                            </div>
                            <div v-else class="">
                                <a class="btn control-btn red" @click="deleteExamForm">
                                    <i class='bx bx-x'></i>
                                    <span>Hủy</span>
                                </a>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <el-collapse id="custome-el-colapse" class="percent-100" style="border: none;">
                                    <!-- Khám tổng quát -->
                                    <el-collapse-item name="generalExam" class="mb-1">
                                        <template slot="title">
                                            <div class="pl-2 w-100 text-black">
                                                Khám tổng quát
                                            </div>
                                        </template>
                                        <div class="generalExam-content mt-3 mb-4" style="padding:0 12px;">
                                            <!-- Thông tin khách hàng -->
                                            <div class="row">
                                                <div class="col-md-12 mb-2">
                                                    <span style="font-weight: bold;font-size:16px;">Thông tin khách hàng:</span>
                                                </div>
                                                <div class="col-md-6 mb-2">
                                                    Mã khách hàng:
                                                    <span style="font-weight: bold;">{{ customerInfo.code || '' }}</span>
                                                </div>
                                                <div class="col-md-6 mb-2">
                                                    Họ và tên:
                                                    <span style="font-weight: bold;">{{ customerInfo.name || '' }}</span>
                                                </div>
                                                <div class="col-md-6 mb-2">
                                                    Ngày sinh:
                                                    <span style="font-weight: bold;">{{ $moment(customerInfo.birthday).format('DD/MM/YYYY') || '' }}</span>
                                                </div>
                                                <div class="col-md-6 mb-2">
                                                    Giới tính:
                                                    <span style="font-weight: bold;">{{ customerInfo.gender == 'male' ? 'Nam' : 'Nữ' || '' }}</span>
                                                </div>
                                                <div class="col-md-6 mb-2">
                                                    CMND/CCCD:
                                                    <span style="font-weight: bold;">{{ customerInfo.physicalId || '' }}</span>
                                                </div>
                                                <div class="col-md-6 mb-2">
                                                    Số điện thoại:
                                                    <span style="font-weight: bold;">{{ customerInfo.phone || '' }}</span>
                                                </div>
                                            </div>
                                            <!-- Tiền sử bệnh -->
                                            <div class="row">
                                                <div class="col-md-12 mb-2">
                                                    <span style="font-weight: bold;font-size:16px;">Tiền sử bệnh:</span>
                                                </div>
                                                <div class="col-md-12">
                                                    <div class="row" style="border: 1px solid #dddddd;">
                                                        <div class="col-4" style="border-right: 1px solid #dddddd;">
                                                            <div style="font-weight: bold; padding: 12px 0">Tiền sử</div>
                                                        </div>
                                                        <div class="col-7" style="border-right: 1px solid #dddddd;">
                                                            <div style="font-weight: bold; padding: 12px 0">Nội dung</div>
                                                        </div>
                                                        <div class="col-1"></div>
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <div v-for="(item, index) in anamnesisData" :key="index" class="row" style="border-bottom: 1px solid #dddddd;">
                                                        <div class="col-4" style="border-right: 1px solid #dddddd;">
                                                            <div style="padding: 12px 0">{{ index + 1 }}. {{ item.label }}</div>
                                                        </div>
                                                        <div class="col-7" style="border-right: 1px solid #dddddd;">
                                                            <div style="padding: 12px 0">
                                                                <el-input placeholder="Nhập nội dung chi tiết (nếu có)" v-model="item.note" :disabled="!item.isCheck"></el-input>
                                                            </div>
                                                        </div>
                                                        <div class="col-1">
                                                            <div style="padding: 12px 0; text-align: center;">
                                                                <el-checkbox v-model="item.isCheck"></el-checkbox>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- Dị ứng -->
                                            <div class="row mt-3">
                                                <div class="col-md-12 mb-2">
                                                    <span style="font-weight: bold;font-size:16px;">Dị ứng:</span>
                                                </div>
                                                <div class="col-md-12">
                                                    <div class="row">
                                                        <div class="col-md-2">Dị ứng:</div>
                                                        <div class="col-md-10">
                                                            <el-select v-model="formData.allergy.allergies" multiple clearable placeholder="Chọn loại dị ứng (nếu có)">
                                                                <el-option
                                                                    v-for="item in allergyData"
                                                                    :key="item.value"
                                                                    :label="item.label"
                                                                    :value="item.value">
                                                                </el-option>
                                                            </el-select>
                                                        </div>
                                                    </div>
                                                    <div class="row mt-3">
                                                        <div class="col-md-2">Khác:</div>
                                                        <div class="col-md-10">
                                                            <el-input type="textarea" :rows="4" placeholder="Nhập nội dung" v-model="formData.allergy.other"></el-input>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- Khám lâm sàng -->
                                            <div class="row mt-3">
                                                <div class="col-md-12 mb-2">
                                                    <span style="font-weight: bold;font-size:16px;">Khám lâm sàng:</span>
                                                </div>
                                                <div class="col-md-12">
                                                    <el-input type="textarea" :rows="6" placeholder="Nhập nội dung" v-model="formData.clinicalExam"></el-input>
                                                </div>
                                            </div>
                                            <!-- Khám cận lâm sàng -->
                                            <div class="row mt-3">
                                                <div class="col-md-12 mb-2">
                                                    <span style="font-weight: bold;font-size:16px;">Khám cận lâm sàng:</span>
                                                </div>
                                                <div class="col-md-12">
                                                    <div class="row">
                                                        <div class="col-md-2">X-quang:</div>
                                                        <div class="col-md-10">
                                                            <el-checkbox-group v-model="formData.preclinicalExam.xquang">
                                                                <div class="row">
                                                                    <div class="col-md-2" v-for="(item, index) in xquangData" :key="index">
                                                                        <el-checkbox :label="item.value">{{item.label}}</el-checkbox>
                                                                    </div>
                                                                </div>
                                                            </el-checkbox-group>
                                                        </div>
                                                    </div>
                                                    <div class="row mt-3">
                                                        <div class="col-md-2">Xét nghiệm:</div>
                                                        <div class="col-md-10">
                                                            <el-checkbox-group v-model="formData.preclinicalExam.test">
                                                                <div class="row">
                                                                    <div class="col-md-2" v-for="(item, index) in testData" :key="index">
                                                                        <el-checkbox :label="item.value">{{item.label}}</el-checkbox>
                                                                    </div>
                                                                </div>
                                                            </el-checkbox-group>
                                                        </div>
                                                    </div>
                                                    <div class="row mt-3">
                                                        <div class="col-md-2">Khác:</div>
                                                        <div class="col-md-10">
                                                            <el-input type="textarea" :rows="4" placeholder="Nhập nội dung" v-model="formData.preclinicalExam.other"></el-input>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </el-collapse-item>
                                    <!-- File/hình ảnh chỉ định -->
                                    <el-collapse-item name="fileAndImg" class="mb-1">
                                        <template slot="title">
                                            <div class="pl-2 w-100 text-black">
                                                File và hình ảnh chỉ định
                                            </div>
                                        </template>
                                        <div class="attachFile-content mt-3 mb-4" style="padding:0 12px;">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <a class="btn control-btn green" style="float:right;" @click="addDesignation">
                                                        <i class='bx bxs-file-plus'></i>
                                                        Thêm chỉ định mới
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="row mt-3">
                                                <div class="col-xl-6 mb-3" v-for="(item, index) in formData.attachFiles" :key="index">
                                                    <Designation 
                                                        :data="item" 
                                                        :designationTypeData="designationTypeData"
                                                        @removeDesignation="(newValue) => removeDesignation(newValue)"
                                                    ></Designation>
                                                </div>
                                            </div>
                                        </div>
                                    </el-collapse-item>
                                    <!-- Chẩn đoán và điều trị -->
                                    <el-collapse-item name="diagnosisAndTreatment" class="mb-1">
                                        <template slot="title">
                                            <div class="pl-2 w-100 text-black">
                                                Chẩn đoán và điều trị
                                            </div>
                                        </template>
                                        <div class="examination-content mt-3 mb-4" style="padding:0 12px;">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <a class="btn control-btn green" style="float:right;" @click="openExaminationDialog('create')">
                                                        <i class='bx bx-list-plus'></i>
                                                        Thêm mới
                                                    </a>
                                                    <el-dialog
                                                        :visible.sync='diagnosisTreatment.visible'
                                                        width='95%'
                                                        title="Thêm/sửa chẩn đoán và điều trị"
                                                        :close-on-click-modal="false"
                                                    >
                                                        <div class="row">
                                                            <div class="col-md-12">
                                                                <DiagnosisTreatment 
                                                                    :data="diagnosisTreatment.data"
                                                                    :serviceGroupData="serviceGroupData"
                                                                    :serviceData="serviceData"
                                                                ></DiagnosisTreatment>
                                                            </div>
                                                        </div>
                                                        <span slot="footer" class="dialog-footer">
                                                            <button type="button" class="control-btn gray" @click="resetDiagnosisTreatment">
                                                                <i class='bx bx-x'></i>
                                                                <span>Đóng</span>
                                                            </button>
                                                            <button
                                                                v-if="diagnosisTreatment.type == 'create'"
                                                                type="button" 
                                                                class="control-btn green"
                                                                @click="addExamination()"
                                                            >
                                                                <i class='bx bx-list-plus'></i>
                                                                <span>Thêm</span>
                                                            </button>
                                                            <button
                                                                v-else-if="diagnosisTreatment.type == 'update'"
                                                                type="button" 
                                                                class="control-btn green"
                                                                @click="updateExamination"
                                                            >
                                                                <span>Cập nhật</span>
                                                            </button>
                                                        </span>
                                                    </el-dialog>
                                                    <!-- <ExaminationDialog 
                                                        :dialog="addExaminationDialog"
                                                        @addExamination="(data) => addExamination(data)"
                                                    ></ExaminationDialog> -->
                                                </div>
                                            </div>
                                            <div class="row mt-3">
                                                <div class="col-md-12">
                                                    <el-table :data="tableData" v-loading="tableLoading" style="width: 100%" stripe>
                                                        <el-table-column label="#" min-width="40">
                                                            <template slot-scope="scope">
                                                                {{ scope.row.key }}
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column label="Răng/hàm" min-width="150">
                                                            <template slot-scope="scope">
                                                                {{ getToothName(scope.row.isJaw, scope.row.toothList, scope.row.jaw[0]) }}
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column label="Chẩn đoán" min-width="200">
                                                            <template slot-scope="scope">
                                                                {{ scope.row.diagnose }}
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column label="Điều trị" min-width="150">
                                                            <template slot-scope="scope">
                                                                {{ getServiceName(scope.row.serviceId) }}
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column label="Đơn giá" min-width="120">
                                                            <template slot-scope="scope">
                                                                {{ (scope.row.unitPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column label="Số lượng" min-width="80">
                                                            <template slot-scope="scope">
                                                                {{ scope.row.isJaw ? scope.row.quantityJaw : scope.row.quantity }}
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column label="Giảm giá" min-width="120">
                                                            <template slot-scope="scope">
                                                                {{ (scope.row.discount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column label="Tổng chi phí" min-width="120">
                                                            <template slot-scope="scope">
                                                                {{ (scope.row.totalPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column label="Thao tác" min-width="100">
                                                            <template slot-scope="scope">
                                                                <a class="btn control-btn blue2" style="padding: 4px 6px;" @click="openExaminationDialog('update', scope.row)">
                                                                    <i class="el-icon-edit-outline"></i>
                                                                </a>
                                                                <a class="btn control-btn red" style="padding: 4px 6px;" @click="removeExamination(scope.row.key)">
                                                                    <i class='bx bx-trash'></i>
                                                                </a>
                                                            </template>
                                                        </el-table-column>
                                                    </el-table>
                                                </div>
                                            </div>
                                        </div>
                                    </el-collapse-item>
                                </el-collapse>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-5">
                                <div class="col-form-label" style="font-weight:bold;">TỔNG CHI PHÍ ĐIỀU TRỊ</div>
                                <table class="table table-borderless" style="font-size:14px;">
                                    <tbody>
                                        <tr>
                                            <td style="width:40%">Chi phí điều trị</td>
                                            <td style="width:5%">:</td>
                                            <td style="text-align:right;width:55%">
                                                <span style="font-weight:bold;">{{ formData.treatmentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }} VND</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="width:40%">Giảm giá</td>
                                            <td style="width:5%">:</td>
                                            <td style="text-align:right;width:55%">
                                                <span style="font-weight:bold;">{{ formData.totalDiscountAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }} VND</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="width:40%">Thành tiền</td>
                                            <td style="width:5%">:</td>
                                            <td style="text-align:right;width:55%">
                                                <span style="font-weight:bold;">{{ formData.totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }} VND</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-md-7">
                                <div class="col-form-label" style="font-weight:bold;">GHI CHÚ</div>
                                <el-input type="textarea" :rows="5" placeholder="Nhập nội dung" v-model="formData.note"></el-input>
                            </div>
                        </div>
                        <div class="row mt-4">
                            <div class="col-md-12" style="text-align: right;">
                                <button
                                    v-if="(checkRight('createExamination') && (formData._id == null || formData._id == ''))"
                                    type="button" 
                                    class="control-btn green" 
                                    @click="submitForm(false)"
                                >
                                    <i class='bx bx-save' ></i>
                                    <span>Lưu phiếu khám</span>
                                </button>
                                <button
                                    v-if="(checkRight('printExamination') && (formData._id != null && formData._id != ''))"
                                    type="button" 
                                    class="control-btn yellow" 
                                    @click="exportPDF"
                                >
                                    <i class='bx bx-printer'></i>
                                    <span>Xuất phiếu khám</span>
                                </button>
                            </div>
                        </div>
                    </el-card>
                </div>
            </form>
            <div v-else class="row">
                <div class="col-md-12">
                    <el-empty description="Tạo phiếu khám mới để bắt đầu khám và điều trị.">
                        <button class="control-btn blue" @click="addExamForm">
                            <i class='bx bx-plus' ></i>
                            Tạo phiếu khám mới
                        </button>
                    </el-empty>
                </div>
            </div>

            <vue-html2pdf 
                class="print-content"
                id="print-content-pdf"
                :show-layout="false"
                :float-layout="true"
                :preview-modal="true"
                :enable-download="false"
                :paginate-elements-by-height="1500"
                :filename="'test'"
                :pdf-quality="2"
                :manual-pagination="false"
                pdf-format="a4"
                pdf-orientation="portrait"
                pdf-content-width="100%"
                ref="html2Pdf"
            >
                <section slot="pdf-content">
                    <div class="container mt-3" style="color:#000;font-size:13px;">
                        <div class="row">
                            <div class="col-md-3">
                                <el-image
                                    style="width: 100%; height: auto"
                                    src="/images/logoclinic.png"
                                    fit="cover">
                                </el-image>
                            </div>
                            <div class="col-md-9">
                                <div style="font-weight:bold;font-size:16px;">NHA KHOA AN TÂM</div>
                                <div class="mt-3">
                                    <span style="font-weight:bold;">Địa chỉ:</span>
                                    <span>Quận 3, HCM</span>
                                </div>
                                <div class="mt-2">
                                    <span style="font-weight:bold;">Số điện thoại:</span>
                                    <span>0703260457</span>
                                </div>
                                <div class="mt-2">
                                    <span style="font-weight:bold;">Email:</span>
                                    <span>dentalclinic@gmail.com</span>
                                </div>
                                <div class="mt-2">
                                    <span style="font-weight:bold;">Website:</span>
                                    <span>https://www.google.com</span>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-md-12 text-center">
                                <div style="font-weight:bold;font-size:24px;">PHIẾU KHÁM VÀ ĐIỀU TRỊ</div>
                            </div>
                            <div class="col-md-12 mt-2">
                                <div class="row">
                                    <div class="col-md-4"></div>
                                    <div class="col-md-4 text-center">Ngày {{$moment().format('DD')}} tháng {{$moment().format('MM')}} năm {{$moment().format('YYYY')}}</div>
                                    <div class="col-md-4 text-right">Mã: {{formData.code}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-4">
                            <div class="col-md-6 mb-2">
                                <span style="font-weight: bold;">Mã khách hàng: </span>
                                {{ customerInfo.code || '' }}
                            </div>
                            <div class="col-md-6 mb-2">
                                <span style="font-weight: bold;">Họ và tên: </span>
                                {{ customerInfo.name || '' }}
                            </div>
                            <div class="col-md-6 mb-2">
                                <span style="font-weight: bold;">Ngày sinh: </span>
                                {{ $moment(customerInfo.birthday).format('DD/MM/YYYY') || '' }}
                            </div>
                            <div class="col-md-6 mb-2">
                                <span style="font-weight: bold;">Giới tính: </span>
                                {{ customerInfo.gender == 'male' ? 'Nam' : 'Nữ' || '' }}
                            </div>
                            <div class="col-md-6 mb-2">
                                <span style="font-weight: bold;">CMND/CCCD: </span>
                                {{ customerInfo.physicalId || '' }}
                            </div>
                            <div class="col-md-6 mb-2">
                                    <span style="font-weight: bold;">Số điện thoại: </span>
                                {{ customerInfo.phone || '' }}
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-6 mt-2">
                                <div class="row">
                                    <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                        <i class='bx bx-check-circle' style="font-size:20px;" ></i>
                                        TIỀN SỬ BỆNH
                                    </div>
                                    <div class="col-md-12 mt-2">
                                        <ul v-if="formData.anamnesis != null && formData.anamnesis.length > 0" class="ml-3">
                                            <li v-for="item in formData.anamnesis" :key="item.value" class="mb-2">
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
                                        <ul v-if="formData.allergy != null && formData.allergy.allergies != null && formData.allergy.allergies.length > 0" class="ml-3">
                                            <li v-for="item in formData.allergy.allergies" :key="item" class="mb-2">
                                                <span style="font-family:Wingdings">&#118;</span>
                                                {{getAllergyName(item)}}
                                            </li>
                                            <li v-if="formData.allergy.other" class="mb-2">
                                                <span style="font-family:Wingdings">&#118;</span>
                                                {{formData.allergy.other}}
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
                                        <ul v-if="formData.clinicalExam" class="ml-3">
                                            <li  class="mb-2">
                                                <span style="font-family:Wingdings">&#118;</span>
                                                {{formData.clinicalExam}}
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
                                                <span v-for="(item, index) in formData.preclinicalExam.xquang" :key="index">
                                                    {{index > 0 ? ', ' : ' '}} {{getXquangName(item)}}
                                                </span>
                                            </li>
                                            <li class="mb-2">
                                                <span style="font-family:Wingdings">&#118;</span>
                                                Xét nghiệm:
                                                <span v-for="(item, index) in formData.preclinicalExam.test" :key="index">
                                                    {{index > 0 ? ', ' : ' '}} {{getTestName(item)}}
                                                </span>
                                            </li>
                                            <li class="mb-2">
                                                <span style="font-family:Wingdings">&#118;</span>
                                                Khác: {{formData.preclinicalExam.other}}
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
                                        <tr v-for="item in tableData" :key="item.key">
                                            <td>
                                                {{ getToothName(item.isJaw, item.toothList, item.jaw[0]) }}
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
                                        {{formData.note}}
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
                                                        <span>{{ formData.treatmentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }} VND</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="width:40%;font-weight:bold;">Giảm giá</td>
                                                    <td style="width:5%">:</td>
                                                    <td style="text-align:right;width:55%">
                                                        <span>{{ formData.totalDiscountAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }} VND</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="width:40%;font-weight:bold;">Thành tiền</td>
                                                    <td style="width:5%">:</td>
                                                    <td style="text-align:right;width:55%">
                                                        <span>{{ formData.totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }} VND</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="row mt-4">
                            <div class="col-md-6" style="text-align:center;">
                                <div>Nha sĩ điều trị</div>
                                <div style="font-style:italic;">(Ký và ghi rõ họ tên)</div>
                            </div>
                            <div class="col-md-6" style="text-align:center;">
                                <div>Khách hàng</div>
                                <div style="font-style:italic;">(Ký và ghi rõ họ tên)</div>
                            </div>
                            <!-- <div class="col-md-4" style="text-align:center;">
                                <div>Nhân viên thu ngân</div>
                                <div style="font-style:italic;">(Ký và ghi rõ họ tên)</div>
                            </div> -->
                        </div>
                    </div>
                </section>
            </vue-html2pdf>
        </div>
        <div v-else>
            <el-empty description="Bạn không có quyền !!"></el-empty>
        </div>
    </LeftMenu>
</template>

<script>
import { mapState } from 'vuex';
import Customer from '@/models/tw_Customer';
import Examination from '@/models/tw_Examination';
import LeftMenu from '@/components/customer/LeftMenu';
import ImageUpload from '@/components/common/ImageUpload.vue';
import Designation from '@/components/customer/Designation.vue';
import ExaminationDialog from '@/components/customer/ExaminationDialog.vue';
import DiagnosisTreatment from '@/components/customer/DiagnosisTreatment.vue';
import { cloneDeep, debounce, intersection, remove } from 'lodash';
import { genderData, anamnesisList, xquangList, testList, milkTooth, permanentTeeth } from '@/utils/masterData';
import buildFormData from '@/utils/buildFormData';
import moment from 'moment';
import { jsPDF } from "jspdf";
import readFile from '@/utils/functions/readFile';
export default {
    components: {
		LeftMenu,
        ImageUpload,
        Designation,
        ExaminationDialog,
        DiagnosisTreatment
	},
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data(){
        return {
            dataLoading: true,
            isExam: false,
            tableData: [],
            tableLoading: false,
            checkboxGroup1: false,
            customerInfo: new Customer(),
            anamnesisData: [],
            anamnesisList: [],
            allergyData: anamnesisList,
            xquangData: xquangList,
            testData: testList,
            formData: new Examination(),
            designationTypeData: [],
            permanentTeethData: permanentTeeth,
            milkToothData: milkTooth,
            addExaminationDialog: {
                visible: false,
                type: 'create',
                data: {},
            },
            diagnosisTreatment: {
                visible: false,
                type: 'create',
                data: {
                    key: 0,
                    toothType: 'permanentTeeth',
                    isJaw: false,
                    jaw: [],
                    toothList: [],
                    diagnose: '',
                    serviceGroupId: '',
                    serviceId: '',
                    quantity: 0,
                    quantityJaw: 0,
                    unitPrice: 0,
                    discount: 0,
                    totalPrice: 0,
                }
            },
            serviceGroupData: [],
            serviceData: [],
            latestExamination: [],
        }
    },
    async created() { 
        const _this = this;
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
            //Lấy phiếu khám gần nhất của KH
            const exam = await _this.$axios.$post('/api/customer/getLatestExamination', { customerId: _this.$route.params.id });
            _this.latestExamination = exam.data || [];
        }
        //Lấy danh sách tiền sử bệnh
        var anamnesisArr = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamAnamnesis' })) || [];
        _this.anamnesisList = anamnesisArr.map(item => {
            return {
                value: item.value,
                label: item.label,
                note: '',
                isCheck: false
            }
        });
        _this.anamnesisData = _this.anamnesisList;
        //Lấy danh sách dị ứng
        _this.allergyData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamAllergy' })) || [];
        //Lấy danh sách loại x-quang
        _this.xquangData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamXquang' })) || [];
        //Lấy danh sách loại xét nghiệm
        _this.testData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamTest' })) || [];
        //Lấy danh sách loại chỉ định
        _this.designationTypeData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigDesignationType' })) || [];
        //Lấy danh sách nhóm dịch vụ
         _this.serviceGroupData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'serviceGroupData' })) || [];
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
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['customer.all', 'customer.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        async addExamForm(){
            const _this = this;
            _this.resetFormData();
            _this.isExam = true;
            _this.dataLoading = false;
        },
        async deleteExamForm(){
            const _this = this;
            _this
				.$confirm(`Bạn có chắc muốn hủy phiếu khám?`, 'Xác nhận', {
					confirmButtonText: 'Xác nhận',
					cancelButtonText: 'Hủy',
					type: 'confirm',
				})
                .then(async () => {
                    _this.isExam = false;
                });
        },
        addDesignation(){
            const _this = this;
            var index = _this.formData.attachFiles.length <= 0 ? 1 : _this.formData.attachFiles[_this.formData.attachFiles.length - 1].key + 1;
            _this.formData.attachFiles.push({
                key: index,
                type: '',
                fileList: [],
            });
        },
        removeDesignation(key) {
            const _this = this;
            var newArr = _this.formData.attachFiles.filter(item => item.key !== key);
            _this.formData.attachFiles = newArr
        },
        openExaminationDialog(type, data){
            const _this = this;
            if(type == 'create'){
                _this.diagnosisTreatment = {
                    visible: true,
                    type: 'create',
                    data: {
                        key: 0,
                        toothType: 'permanentTeeth',
                        isJaw: false,
                        jaw: [],
                        toothList: [],
                        diagnose: '',
                        serviceGroupId: '',
                        serviceId: '',
                        quantity: 0,
                        quantityJaw: 0,
                        unitPrice: 0,
                        discount: 0,
                        totalPrice: 0,
                    }
                };
            }
            else if(type == 'update'){
                _this.diagnosisTreatment = {
                    visible: true,
                    type: 'update',
                    data: {
                        ...data
                    }
                };
            }
        },
        addExamination(){
            const _this = this;
            _this.tableLoading = true;
            //#region Kiểm tra điều kiện
            if(_this.diagnosisTreatment.data.serviceId == null || _this.diagnosisTreatment.data.serviceId == ''){
                return _this.$message({
                    message: 'Vui lòng chọn thủ thuật điều trị',
                    type: 'error',
                });
            }
            else{
                var service = _.find(_this.serviceData, function(item) {
                    if (item._id == _this.diagnosisTreatment.data.serviceId) {
                        return item;
                    }
                });
                if(service){
                    if(service.unit == 'unit2'){
                        if(!_this.diagnosisTreatment.data.isJaw){
                            return _this.$message({
                                message: 'Dịch vụ đã chọn được điều trị và thanh toán theo số hàm!',
                                type: 'error',
                            });
                        }
                    }
                    else{
                        if(_this.diagnosisTreatment.data.isJaw){
                            return _this.$message({
                                message: 'Dịch vụ đã chọn được điều trị và thanh toán theo số răng!',
                                type: 'error',
                            });
                        }
                    }
                }
                else{
                    return _this.$message({
                        message: 'Có lỗi xảy ra.',
                        type: 'error',
                    });
                }
            }
            if(_this.diagnosisTreatment.data.quantity == 0 && _this.diagnosisTreatment.data.quantityJaw == 0){
                return _this.$message({
                    message: 'Vui lòng chọn răng/hàm điều trị',
                    type: 'error',
                });
            }
            //#endregion

            //#region Xử lý
            if(_this.tableData.length == 0){
                _this.diagnosisTreatment.data.key = 1;
            }
            else{
                _this.diagnosisTreatment.data.key = _this.tableData.length + 1;
            }
            _this.tableData.push(_this.diagnosisTreatment.data);
            _this.resetDiagnosisTreatment();
            console.log(_this.tableData)
            //#endregion
            setTimeout(async function () {
                _this.calculateAmount();
                _this.tableLoading = false;
            }, 500);
        },
        updateExamination(){
            const _this = this;
            _this.tableLoading = true;
            //#region Kiểm tra điều kiện
            if(_this.diagnosisTreatment.data.serviceId == null || _this.diagnosisTreatment.data.serviceId == ''){
                return _this.$message({
                    message: 'Vui lòng chọn thủ thuật điều trị',
                    type: 'error',
                });
            }
            else{
                var service = _.find(_this.serviceData, function(item) {
                    if (item._id == _this.diagnosisTreatment.data.serviceId) {
                        return item;
                    }
                });
                if(service){
                    if(service.unit == 'unit2'){
                        if(!_this.diagnosisTreatment.data.isJaw){
                            return _this.$message({
                                message: 'Dịch vụ đã chọn được điều trị và thanh toán theo số hàm!',
                                type: 'error',
                            });
                        }
                    }
                    else{
                        if(_this.diagnosisTreatment.data.isJaw){
                            return _this.$message({
                                message: 'Dịch vụ đã chọn được điều trị và thanh toán theo số răng!',
                                type: 'error',
                            });
                        }
                    }
                }
                else{
                    return _this.$message({
                        message: 'Có lỗi xảy ra.',
                        type: 'error',
                    });
                }
            }
            if(_this.diagnosisTreatment.data.quantity == 0 && _this.diagnosisTreatment.data.quantityJaw == 0){
                return _this.$message({
                    message: 'Vui lòng chọn răng/hàm điều trị',
                    type: 'error',
                });
            }
            //#endregion

            //#region Xử lý
            _this.tableData = _.map(_this.tableData, item => {
                if(item.key == _this.diagnosisTreatment.data.key){
                    return _this.diagnosisTreatment.data;
                }
                else{
                    return item;
                }
            });
            _this.resetDiagnosisTreatment();
            //#endregion

            setTimeout(async function () {
                _this.calculateAmount();
                _this.tableLoading = false;
            }, 500);
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
        resetDiagnosisTreatment(){
            const _this = this;
            _this.tableLoading = true;
            _this.diagnosisTreatment= {
                visible: false,
                type: 'create',
                data: {
                    key: 0,
                    toothType: 'permanentTeeth',
                    isJaw: false,
                    jaw: [],
                    toothList: [],
                    diagnose: '',
                    serviceGroupId: '',
                    serviceId: '',
                    quantity: 0,
                    quantityJaw: 0,
                    unitPrice: 0,
                    discount: 0,
                    totalPrice: 0,
                }
            };
            setTimeout(async function () {
                _this.tableLoading = false;
            }, 500);
        },
        removeExamination(key){
            const _this = this;
            _this.tableLoading = true;
            var arr = _this.tableData.filter(e => e.key != key);
            for(var i = key - 1; i < arr.length; i++){
                arr[i].key = i + 1;
            }
            _this.tableData = arr;
            setTimeout(async function () {
                _this.calculateAmount();
                _this.tableLoading = false;
            }, 500);
        },
        submitForm: debounce(async function (isPrint) {
            const _this = this;
            _this
                .$confirm(`Bạn có chắc muốn tạo phiếu khám?`, 'Xác nhận', {
					confirmButtonText: 'Xác nhận',
					cancelButtonText: 'Hủy',
					type: 'confirm',
				})
                .then(async () => {
                    _this.$router.push({
                        path: `/customer/${_this.$route.params.id}/examinationForm`,
                        query: { code: 'EXAM-0C89C' }
                    });
                    // _this.dataLoading = true;
                    // _this.formData.dentistId = _this.userInfo.data._id;
                    // _this.formData.createdBy = _this.userInfo.data.username;
                    // _this.formData.anamnesis = _.filter(_this.anamnesisData, ['isCheck', true]);
                    // _this.formData.diagnosisTreatment = _this.tableData;
                    // _this.formData.customerId = _this.$route.params.id;
                    // var oldData = cloneDeep(_this.formData);
                    // var newData = new FormData();
                    // buildFormData(newData, oldData);
                    // const data = await _this.$axios.$post('/api/customer/createExamination', newData, {
                    //     headers: { 'Content-Type': 'multipart/form-data' },
                    // });
                    // if (data.success) {
                    //     _this.$message({
                    //         message: data.message,
                    //         type: 'success',
                    //     });
                    //     _this.formData._id = data.data._id;
                    //     _this.formData.code = data.data.code;
                    //     setTimeout(async() => {
                    //         _this.dataLoading = false;
                    //         // await _this.exportPDF();
                    //     }, 200);
                    // } else {
                    //     _this.$message.error(data.error);
                    //     _this.dataLoading = false;
                    // }
                });
        }),
        calculateAmount(){
            const _this = this;
            _this.formData.treatmentAmount = _this.tableData.reduce((accumulator, object) => {
                return accumulator + (object.totalPrice + object.discount);
            }, 0);
            _this.formData.totalDiscountAmount = _this.tableData.reduce((accumulator, object) => {
                return accumulator + object.discount;
            }, 0);
            _this.formData.totalAmount = _this.formData.treatmentAmount - _this.formData.totalDiscountAmount;
        },
        async resetFormData(){
            const _this = this;
            _this.formData = new Examination();
            _this.tableData = [];
            if(_this.latestExamination != null && _this.latestExamination.length > 0){
                _this.anamnesisData = _this.anamnesisData.map(item => {
                    if(_this.latestExamination[0].anamnesis.some(x => x.value == item.value)){
                        var result  = _.find(_this.latestExamination[0].anamnesis, (obj) => {
                            return obj.value == item.value;
                        })
                        return {
                            ...item,
                            isCheck: result.isCheck,
                            note: result.note,
                        }
                    }
                    else{
                        return{
                            ...item
                        }
                    }
                });
                _this.formData.allergy.allergies = _this.latestExamination[0].allergy.allergies || [];
                _this.formData.allergy.other = _this.latestExamination[0].allergy.other || '';
            }
            else{
                _this.formData.allergy.allergies = [];
                _this.formData.allergy.other = '';
                _this.anamnesisData = _this.anamnesisList;
            }
        },
        async exportPDF(){
            const _this = this;
            _this.$refs.html2Pdf.generatePdf();
        },
        getAllergyName(value){
            const _this = this;
            let data = _.find(_this.allergyData, { value: value });
			return data ? data.label : '';
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
    }
}
</script>

<style scoped>
.card-header-custom{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
icon-add-schedule {
	position: absolute;
	right: 0px;
	bottom: 0px;
}
.table-column {
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: bold;
	min-height: 40px;
	border: 1px solid #EBEEF5;
	border-left: 0px;
    font-size: 14px;
    background-color: #f1f7fd;
    color: #909399;
}
.table-column:first-child {
	border-left: 1px solid #EBEEF5;
}
.tooth-content{
    width: 20px;
    height: 20px;
    overflow: hidden;
    position: relative;
}
.tooth-content .tooth-img{
    width: 100%;
    min-width: 100%;
    min-height: 100%;
    object-fit: cover;
    
    position: absolute;
    top: 50%;
    left: 51%;
    transform: translate(-51% , -50%);
}
.el-checkbox-button__inner{
    border: none;
}
</style>