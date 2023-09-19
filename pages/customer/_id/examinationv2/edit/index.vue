<template>
    <LeftMenu>
        <form class="mt-3 mb-4" v-loading="dataLoading" v-on:submit.prevent="submitExaminationForm">
            <!-- Thao tác -->
            <div class="row mt-3">
                <div class="col-md-12" style="text-align: right;">
                    <button type="button" class="control-btn gray" @click="$router.push(`/customer/${$route.params.id}/examination`)">
                        <i class='bx bx-arrow-back'></i>
                        <span>Quay lại</span>
                    </button>
                </div>
            </div>
            <!-- Form data -->
            <div class="row mt-3">
                <div class="col-md-12">
                    <el-tabs v-model="activeName">
                        <!-- Tổng quan -->
                        <el-tab-pane label="Tổng quan" name="generalExam">
                            <el-card class="box-card mb-4" :style="{ 'pointer-events': formData.status == 'new' ? 'auto' : 'none' }">
                                <div slot="header" class="card-header-custom" style="font-size:14px;font-weight:bold;">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <span>{{ formData.code ? `${formData.code} | ` : ''}}</span> 
                                            <span v-if="formData.status == 'new'" style="color:#409eff;">Mới</span>
                                            <span v-else-if="formData.status == 'confirm'" style="color:#67c23a;">Xác nhận</span>
                                            <span v-else-if="formData.status == 'completed'" style="color:#e6a23c;">Hoàn thành</span>
                                            <span v-else-if="formData.status == 'cancelled'" style="color:#909399;">Đã hủy</span>
                                        </div>
                                        <div class="col-sm-6" style="text-align:right;">
                                            <span>NGÀY KHÁM: {{ formData.createdAt ? $moment(formData.createdAt).format('DD/MM/YYYY') : '' }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="generalExam-content mt-3 mb-4" style="padding:0 12px;font-size:13px;line-height: 1.7;">
                                            <!-- Thông tin khách hàng -->
                                            <div class="row">
                                                <div class="col-md-12 mb-2">
                                                    <span style="font-weight: bold;font-size:16px;">Thông tin khách hàng:</span>
                                                </div>
                                                <div class="col-sm-6 col-lg-4 mb-2">
                                                    Mã khách hàng:
                                                    <span style="font-weight: bold;">{{ formData.customerCode || '' }}</span>
                                                </div>
                                                <div class="col-sm-6 col-lg-4 mb-2">
                                                    Họ và tên:
                                                    <span style="font-weight: bold;">{{ formData.customerName || '' }}</span>
                                                </div>
                                                <div class="col-sm-6 col-lg-4 mb-2">
                                                    CMND/CCCD:
                                                    <span style="font-weight: bold;">{{ formData.customerPhysicalId || '' }}</span>
                                                </div>
                                                <div class="col-sm-6 col-lg-4 mb-2">
                                                    Ngày sinh:
                                                    <span style="font-weight: bold;">{{ formData.customerBirthday ? $moment(formData.customerBirthday).format('DD/MM/YYYY') : '' }}</span>
                                                </div>
                                                <div class="col-sm-6 col-lg-4 mb-2">
                                                    Giới tính:
                                                    <span style="font-weight: bold;">{{ formData.customerGender == 'male' ? 'Nam' : 'Nữ' || '' }}</span>
                                                </div>
                                                <div class="col-sm-6 col-lg-4 mb-2">
                                                    Số điện thoại:
                                                    <span style="font-weight: bold;">{{ formData.customerPhone || '' }}</span>
                                                </div>
                                            </div>
                                            <!-- Tiền sử bệnh -->
                                            <div class="row">
                                                <div class="col-md-12 mb-2">
                                                    <span style="font-weight: bold;font-size:16px;">Tiền sử bệnh:</span>
                                                </div>
                                                <div class="col-md-12">
                                                    <el-table ref="anamnesisTable" :data="anamnesisData" style="width: 100%" border @selection-change="handleSelectionChange">
                                                        <el-table-column type="index" width="50" align="center"></el-table-column>
                                                        <el-table-column label="Tiền sử" min-width="100">
                                                            <template slot-scope="scope">
                                                                {{ scope.row.label }}
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column label="Nội dung" min-width="130">
                                                            <template slot-scope="scope">
                                                                <el-input placeholder="Nhập nội dung chi tiết (nếu có)" v-model="scope.row.note" :disabled="!anamnesisSelected.some(e => e.value == scope.row.value)"></el-input>
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column type="selection" width="60" align="center"></el-table-column>
                                                    </el-table>
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
                                                                    <div class="col-sm-5 col-md-4 col-lg-3 col-xl-2" v-for="(item, index) in xquangData" :key="index">
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
                                                                    <div class="col-sm-5 col-md-4 col-lg-3 col-xl-2" v-for="(item, index) in testData" :key="index">
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
                                    </div>
                                </div>
                            </el-card>
                        </el-tab-pane>
                        <!-- File và hình ảnh chỉ định -->
                        <el-tab-pane label="File và hình ảnh chỉ định" name="fileAndImg">
                            <el-card class="box-card mb-4">
                                <div slot="header" class="card-header-custom" style="font-size:14px;font-weight:bold;">
                                    <div class="row">
                                        <div v-if="formData.status == 'new'" class="col-md-12">
                                            <a class="btn control-btn green" style="float:right;" @click="addDesignation('create')">
                                                <i class='bx bxs-file-plus'></i>
                                                Thêm chỉ định mới
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="attachFile-content mt-3 mb-4" style="padding:0 12px;font-size:13px;line-height: 1.7;">
                                            <div v-if="formData.attachFiles && formData.attachFiles.length > 0" class="row">
                                                <div v-for="item in formData.attachFiles" :key="item.key" class="col-lg-6 mb-2">
                                                    <el-card class="box-card" style="height:100%;">
                                                        <div slot="header" class="clearfix">
                                                            <div class="row" style="align-items:center;">
                                                                <div class="col-sm-6">
                                                                    <span style="font-weight:bold;">{{ getDesignationTypeName(item.type) }}</span>
                                                                </div>
                                                                <div v-if="formData.status == 'new'" class="col-sm-6" style="text-align:right;">
                                                                    <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
                                                                        <a class="btn control-btn yellow" style="padding: 4px 6px;" @click="addDesignation('update', item)">
                                                                            <i class='bx bxs-edit'></i>
                                                                        </a>
                                                                    </el-tooltip>
                                                                    <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
                                                                        <a class="btn control-btn red" style="padding: 4px 6px;" @click="removeDesignation(item)">
                                                                            <i class='bx bx-trash'></i>
                                                                        </a>
                                                                    </el-tooltip>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="col-md-12">
                                                                <div class="col-form-label">Danh sách file:</div>
                                                                <div class="row">
                                                                    <div v-for="(file, index) in item.files" :key="index" class="col-md-12">
                                                                        <span style="font-family:Wingdings">&#119;</span>
                                                                        <a :href="file.url" target="_blank" style="font-style:italic;text-decoration:underline!important;">
                                                                            {{ file.name || 'File' }}
                                                                        </a> 
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="col-md-12">
                                                                <div class="col-form-label">Mô tả thêm:</div>
                                                                <div style="font-style: italic;color:#747272;font-weight:400;">
                                                                    {{ item.description || '' }}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </el-card>
                                                </div>
                                            </div>
                                            <div v-else class="row">
                                                <div class="col-md-12">
                                                    <el-empty description="Không có dữ liệu"></el-empty>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-card>
                        </el-tab-pane>
                        <!-- Khám và điều trị -->
                        <el-tab-pane label="Khám và điều trị" name="diagnosisAndTreatment">
                            <el-card class="box-card mb-4" :style="{ 'pointer-events': formData.status == 'new' ? 'auto' : 'none' }">
                                <div slot="header" class="card-header-custom" style="font-size:14px;font-weight:bold;">
                                    <div v-if="formData.status == 'new'" class="row">
                                        <div class="col-md-12">
                                            <a class="btn control-btn green" style="float:right;" @click="openExaminationDialog('create')">
                                                <i class='bx bx-list-plus'></i>
                                                Thêm mới
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <el-table :data="tableData" v-loading="tableLoading" style="width: 100%" border stripe>
                                            <el-table-column label="#" min-width="40">
                                                <template slot-scope="scope">
                                                    {{ scope.row.key }}
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="Răng/hàm" min-width="150">
                                                <template slot-scope="scope">
                                                    {{ getToothName(scope.row.isJaw, scope.row.toothList, scope.row.jaw ? scope.row.jaw[0] : '') }}
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
                                            <el-table-column label="Đơn giá" min-width="120" align="right">
                                                <template slot-scope="scope">
                                                    {{ (scope.row.unitPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="Số lượng" min-width="80">
                                                <template slot-scope="scope">
                                                    {{ scope.row.isJaw ? scope.row.quantityJaw : scope.row.quantity }}
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="Giảm giá" min-width="120" align="right">
                                                <template slot-scope="scope">
                                                    {{ (scope.row.discount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="Tổng chi phí" min-width="120" align="right">
                                                <template slot-scope="scope">
                                                    {{ (scope.row.totalPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                                </template>
                                            </el-table-column>
                                            <el-table-column v-if="formData.status == 'new'" label="Thao tác" min-width="100">
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
                                    <div class="col-md-12 mt-3">
                                        <div class="row">
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
                                    </div>
                                </div>
                            </el-card>
                        </el-tab-pane>
                        <!-- Đơn thuốc -->
                        <el-tab-pane label="Đơn thuốc" name="prescription">
                            <el-card class="box-card mb-4">
                                <div slot="header" class="card-header-custom" style="font-size:14px;font-weight:bold;">
                                    
                                </div>
                            </el-card>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
            <!-- Thao tác -->
            <div class="row mt-3">
                <div class="col-md-12" style="text-align: right;">
                    <button type="button" class="control-btn gray" @click="$router.push(`/customer/${$route.params.id}/examination`)">
                        <i class='bx bx-arrow-back'></i>
                        <span>Quay lại</span>
                    </button>
                </div>
            </div>
        </form>

        <!-- ------------------ Dialog ------------------- -->
        <!-- Dialog thêm/chỉnh sửa chỉ định -->
        <el-dialog
            :visible.sync='designationDialog.visible'
            width='50%'
            title="Thêm/sửa chỉ định"
            :close-on-click-modal="false"
        >
            <form class="row" v-if="designationDialog.data" v-on:submit.prevent="submitDesignation">
                <div class="col-md-12">
                    <div class="col-form-label">Loại chỉ định *</div>
                    <el-select v-model="designationDialog.data.type" placeholder="Chọn loại chỉ định" filterable>
                        <el-option
                            v-for="item in designationTypeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div v-if="designationDialog.data.files && designationDialog.data.files.length > 0" class="col-md-12 mt-2">
                    <div class="col-form-label">Danh sách file</div>
                    <div class="row">
                        <div v-for="(file, index) in designationDialog.data.files" :key="index" class="col-md-12 mb-2">
                            <div class="row">
                                <div class="col-10">
                                    <span style="font-family:Wingdings">&#119;</span>
                                    <a :href="file.url" target="_blank" style="font-style:italic;text-decoration:underline!important;">
                                        {{ file.name || 'File' }}
                                    </a> 
                                </div>
                                <div class="col-2" style="text-align:right;">
                                    <el-tooltip class="item" effect="dark" content="Xóa file" placement="right">
                                        <span class="btn-remove-file" @click="removeFile(designationDialog.data._id, file)">
                                            <i class='bx bx-x-circle'></i>
                                        </span>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="col-form-label">File</div>
                    <el-upload
                        class="upload-demo"
                        action="#"
                        :multiple="true"
                        :show-file-list="true"
                        :on-change="handleChangeFile"
                        ref="uploadFiles"
                    >
                        <a class="btn control-btn blue">
                            <i class='bx bxs-cloud-upload'></i>
                            <span>Click to upload</span>
                        </a>
                    </el-upload>
                </div>
                <div class="col-md-12 mt-3">
                    <div class="col-form-label">Mô tả thêm</div>
                    <el-input type="textarea" :rows="5" placeholder="Nhập mô tả" v-model="designationDialog.data.description"></el-input>
                </div>
            </form>
            <span slot="footer" class="dialog-footer">
                <button type="button" class="control-btn gray" @click="designationDialog.visible=false">
                    <i class='bx bx-x'></i>
                    <span>Đóng</span>
                </button>
                <button
                    type="button" 
                    class="control-btn green"
                    @click="submitDesignation()"
                >
                    <i class='bx bxs-file-plus'></i>
                    <span>Lưu</span>
                </button>
            </span>
        </el-dialog>
        <!-- Dialog thêm/chỉnh sửa khám và điều trị -->
        <el-dialog
            :visible.sync='diagnosisTreatmentDialog.visible'
            width='95%'
            title="Thêm/sửa chẩn đoán và điều trị"
            :close-on-click-modal="false"
        >
            <div class="row" v-if="diagnosisTreatmentDialog.data">
                <div class="col-md-12">
                    <DiagnosisTreatment 
                        :data="diagnosisTreatmentDialog.data"
                        :serviceGroupData="serviceGroupData"
                        :serviceData="serviceData"
                        :diaglogVisible="diagnosisTreatmentDialog.visible"
                    ></DiagnosisTreatment>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <button type="button" class="control-btn gray" @click="resetDiagnosisTreatment">
                    <i class='bx bx-x'></i>
                    <span>Đóng</span>
                </button>
                <button
                    v-if="diagnosisTreatmentDialog.type == 'create'"
                    type="button" 
                    class="control-btn green"
                    @click="addExamination()"
                >
                    <i class='bx bx-list-plus'></i>
                    <span>Thêm</span>
                </button>
                <button
                    v-else-if="diagnosisTreatmentDialog.type == 'update'"
                    type="button" 
                    class="control-btn green"
                    @click="updateExamination()"
                >
                    <i class='bx bxs-edit' ></i>
                    <span>Cập nhật</span>
                </button>
            </span>
        </el-dialog>

    </LeftMenu>
</template>

<script>
import { mapState } from 'vuex';
import Customer from '@/models/tw_Customer';
import Examination from '@/models/tw_Examination';
import ExaminationDesignation from '@/models/tw_Examination_Designation';
import Prescription from '@/models/tw_Prescription';
import LeftMenu from '@/components/customer/LeftMenu';
import Designation from '@/components/customer/DesignationV2.vue';
import DiagnosisTreatment from '@/components/customer/DiagnosisTreatment.vue';
import { cloneDeep, debounce, intersection, remove } from 'lodash';
import buildFormData from '@/utils/buildFormData';
import moment from 'moment';
import VueAutonumeric from 'vue-autonumeric';
import TinyEditor from '@/components/common/TinyEditor';
export default {
    components: {
		LeftMenu,
        Designation,
        DiagnosisTreatment,
        'vue-autonumeric': VueAutonumeric,
		'tiny-editor': TinyEditor,
	},
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
            informationConfig: (state) => state.informationConfig,
		}),
	},
    watch: {
		'designationDialog.visible': {
			async handler(newVal, oldVal) {
				const _this = this;
                if (_this.$refs.uploadFiles) {
                    _this.$refs.uploadFiles.clearFiles();
                }
			},
			immediate: true,
		},
	},
    data(){
        return {
            dataLoading: true,
            activeName: 'generalExam',
            formData: new Examination(),
            anamnesisData: [],
            anamnesisSelected: [],
            allergyData: [],
            xquangData: [],
            testData: [],
            designationTypeData: [],
            designationDialog: {
                visible: false,
                type: 'create',
                data: new ExaminationDesignation()
            },
            tableData: [],
            tableLoading: false,
            serviceGroupData: [],
            serviceData: [],
            diagnosisTreatmentDialog: {
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
        }
    },
    async created(){
        const _this = this;
        //Lấy danh sách tiền sử bệnh
        var anamnesisArr = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamAnamnesis' })) || [];
        _this.anamnesisList = anamnesisArr.map(item => {
            return {
                value: item.value,
                label: item.label,
                note: ''
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
        //Lấy thông tin phiếu khám
        await _this.getData();
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['customer.all', 'customer.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        async getData(){
            const _this = this;
            _this.dataLoading = true;
            if (_this.$route.query.examinationId){
                await _this.$axios.$get(`/api/customer/getExaminationById/${_this.$route.query.examinationId}`).then(
                    async (response) => {
                        if(response.success){
                            _this.formData = response.data || new Examination();
                        }
                        else{
                            _this.$message({
                                type: 'error',
                                message: response.error
                            });
                        }
                    },
                    (error) => {
                        console.log('Error: ', error);
                        _this.$message({
                            type: 'error',
                            message: error,
                        });
                    }
                );
            
                //#region Select tiền sử bệnh
                if(_this.$refs.anamnesisTable){
                    _this.$refs.anamnesisTable.clearSelection();
                    if(_this.formData && _this.formData.anamnesis && _this.formData.anamnesis.length > 0){
                        _this.formData.anamnesis.forEach(item => {
                            var index = _this.anamnesisData.findIndex(e => e.value == item.value);
                            _this.anamnesisData[index] = item;
                            _this.$refs.anamnesisTable.toggleRowSelection(_this.anamnesisData[index]);
                        });
                    }
                    else{
                        _this.$refs.anamnesisTable.clearSelection();
                    }
                }
                //#endregion

                //#region Lấy danh sách khám và điều trị
                if(_this.formData && _this.formData.diagnosisTreatment && _this.formData.diagnosisTreatment.length > 0){
                    _this.tableData = _this.formData.diagnosisTreatment;
                }
                else{
                    _this.tableData = [];
                }
                //#endregion
            }
            _this.dataLoading = false;
        },
        submitExaminationForm: debounce(async function () {
            const _this = this;
        }),
        handleSelectionChange(val) {
            const _this = this;
            _this.anamnesisSelected = val;
        },
        addDesignation(type, data){
            const _this = this;
            if(type == 'create'){
                _this.designationDialog = {
                    visible: true,
                    type: 'create',
                    data: new ExaminationDesignation()
                }
            }
            else if(type == 'update'){
                _this.designationDialog = {
                    visible: true,
                    type: 'update',
                    data: data
                }
            }
        },
        getDesignationTypeName(id){
            const _this = this;
            let data = _.find(_this.designationTypeData, { value: id });
			return data ? data.label : '';
        },
        async removeDesignation(data) {
            const _this = this;
            _this
                .$confirm(`Bạn có chắc muốn xóa chỉ định này?`, 'Xác nhận', {
					confirmButtonText: 'Xác nhận',
					cancelButtonText: 'Hủy',
					type: 'warning',
				})
                .then(async () => {
                    _this.dataLoading = true;
                    try{
                        await _this.$axios.$delete(`/api/customer/removeDesignation/${data._id}`).then(
                            async (response) => {
                                if (response.success) {
                                    _this.$message({
                                        message: 'Xóa chỉ định thành công',
                                        type: 'success',
                                    });
                                    await _this.getData();
                                }
                                else {
                                    _this.$message.error(response.error);
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
                    catch (e){
                        console.log(e);
                        _this.$message.error(e);
                    }
                    _this.dataLoading = false;
                })
        },
        submitDesignation: debounce(async function (){
            const _this = this;
            _this.dataLoading = true;
            try{
                _this.designationDialog.data.examinationId = _this.$route.query.examinationId;
                var oldData = cloneDeep(_this.designationDialog.data);
                var newData = new FormData();
                buildFormData(newData, oldData);
                const data = await _this.$axios.$post('/api/customer/uploadDesignation', newData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                if (data.success) {
                    _this.$message({
                        message: data.message,
                        type: 'success',
                    });
                    _this.designationDialog = {
                        visible: false,
                        type: 'create',
                        data: new ExaminationDesignation()
                    }
                    await _this.getData();
                } 
                else {
                    _this.$message.error(data.error);
                }
            }
            catch (e){
                console.log(e);
                _this.$message.error(e);
            }
            _this.dataLoading = false;
        }),
        async removeFile(id, file){
            const _this = this;
            _this.dataLoading = true;
            try{
                const data = await _this.$axios.$post('/api/customer/removeDesignationFile', {
                    id: id,
                    file: file
                });
                if (data.success) {
                    await _this.getData();
                    _this.$message({
                        message: 'Xóa file thành công',
                        type: 'success',
                    });
                    _this.designationDialog.data = data.data;
                } 
                else {
                    _this.$message.error(data.error);
                }
            }
            catch(e){
                console.log(e);
                _this.$message.error(e);
            }
            _this.dataLoading = false;
        },
        handleChangeFile(file, fileList) {
			const _this = this;
			// _this.designationDialog.data.fileList = _.map(fileList, file => {
            //     return new File([file.raw], `${Date.now().toString()}`, {
            //         type: file.raw.type
            //     });
            // });
			_this.designationDialog.data.fileList = fileList;
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
        openExaminationDialog(type, data){
            const _this = this;
            if(type == 'create'){
                _this.diagnosisTreatmentDialog = {
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
                _this.diagnosisTreatmentDialog = {
                    visible: true,
                    type: 'update',
                    data: {
                        ...data
                    }
                };
            }
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
        resetDiagnosisTreatment(){
            const _this = this;
            _this.tableLoading = true;
            _this.diagnosisTreatmentDialog= {
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
        addExamination(){
            const _this = this;
            //#region Kiểm tra điều kiện
            if(_this.diagnosisTreatmentDialog.data.serviceId == null || _this.diagnosisTreatmentDialog.data.serviceId == ''){
                return _this.$message({
                    message: 'Vui lòng chọn thủ thuật điều trị',
                    type: 'error',
                });
            }
            else{
                var service = _.find(_this.serviceData, function(item) {
                    if (item._id == _this.diagnosisTreatmentDialog.data.serviceId) {
                        return item;
                    }
                });
                if(service){
                    if(service.unit == 'unit2'){
                        if(!_this.diagnosisTreatmentDialog.data.isJaw){
                            return _this.$message({
                                message: 'Dịch vụ đã chọn được điều trị và thanh toán theo số hàm!',
                                type: 'error',
                            });
                        }
                    }
                    else{
                        if(_this.diagnosisTreatmentDialog.data.isJaw){
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
            if(_this.diagnosisTreatmentDialog.data.quantity == 0 && _this.diagnosisTreatmentDialog.data.quantityJaw == 0){
                return _this.$message({
                    message: 'Vui lòng chọn răng/hàm điều trị',
                    type: 'error',
                });
            }
            //#endregion

            //#region Xử lý
            if(_this.tableData.length == 0){
                _this.diagnosisTreatmentDialog.data.key = 1;
            }
            else{
                _this.diagnosisTreatmentDialog.data.key = _this.tableData.length + 1;
            }
            _this.tableData.push(_this.diagnosisTreatmentDialog.data);
            _this.resetDiagnosisTreatment();
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
            if(_this.diagnosisTreatmentDialog.data.serviceId == null || _this.diagnosisTreatmentDialog.data.serviceId == ''){
                return _this.$message({
                    message: 'Vui lòng chọn thủ thuật điều trị',
                    type: 'error',
                });
            }
            else{
                var service = _.find(_this.serviceData, function(item) {
                    if (item._id == _this.diagnosisTreatmentDialog.data.serviceId) {
                        return item;
                    }
                });
                if(service){
                    if(service.unit == 'unit2'){
                        if(!_this.diagnosisTreatmentDialog.data.isJaw){
                            return _this.$message({
                                message: 'Dịch vụ đã chọn được điều trị và thanh toán theo số hàm!',
                                type: 'error',
                            });
                        }
                    }
                    else{
                        if(_this.diagnosisTreatmentDialog.data.isJaw){
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
            if(_this.diagnosisTreatmentDialog.data.quantity == 0 && _this.diagnosisTreatmentDialog.data.quantityJaw == 0){
                return _this.$message({
                    message: 'Vui lòng chọn răng/hàm điều trị',
                    type: 'error',
                });
            }
            //#endregion

            //#region Xử lý
            _this.tableData = _.map(_this.tableData, item => {
                if(item.key == _this.diagnosisTreatmentDialog.data.key){
                    return _this.diagnosisTreatmentDialog.data;
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
    }
}
</script>

<style scoped>
.btn-remove-file{
    cursor: pointer;
    font-size: 16px;
}
.btn-remove-file:hover{
    color: #74bc20;
}
</style>