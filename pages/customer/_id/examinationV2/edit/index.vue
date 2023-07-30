<template>
    <LeftMenu>
        <form class="row mt-3 mb-4" v-loading="dataLoading" v-on:submit.prevent="submitExaminationForm">
            <div class="col-md-12" style="text-align: right;">
                <button type="button" class="control-btn gray" @click="$router.push(`/customer/${$route.params.id}/examinationV2`)">
                    <i class='bx bx-arrow-back'></i>
                    <span>Quay lại</span>
                </button>
                <button
                    v-if="
                        (checkRight('createExamination') && $route.query.examinationId && $route.query.examinationId == 'create') ||
                        (checkRight('updateExamination') && $route.query.examinationId && $route.query.examinationId != 'create')
                    "
                    type="button" 
                    class="control-btn green" 
                    @click="submitExaminationForm"
                >
                    <i class='bx bx-save' ></i>
                    <span>Lưu phiếu khám</span>
                </button>
            </div>
            <div class="col-md-12 mt-3">
                <el-card class="box-card">
                    <div slot="header" class="card-header-custom" style="font-size:14px;font-weight:bold;">
                        <span>NGÀY KHÁM: {{ $moment().format('DD/MM/YYYY') }}</span>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <el-collapse v-model="activeCollapse" id="custome-el-colapse" class="percent-100" style="border: none;" accordion>
                                <!-- Khám tổng quát -->
                                    <el-collapse-item name="generalExam" class="mb-1">
                                        <template slot="title">
                                            <div class="pl-2 w-100 text-black">
                                                Khám tổng quát
                                            </div>
                                        </template>
                                        <div class="generalExam-content mt-3 mb-4" style="padding:0 12px;font-size: 13px !important;">
                                            <!-- Thông tin khách hàng -->
                                            <div class="row">
                                                <div class="col-md-12 mb-2">
                                                    <span style="font-weight: bold;font-size:16px;">Thông tin khách hàng:</span>
                                                </div>
                                                <div class="col-sm-6 col-lg-4 mb-2">
                                                    Mã khách hàng:
                                                    <span style="font-weight: bold;">{{ customerInfo.code || '' }}</span>
                                                </div>
                                                <div class="col-sm-6 col-lg-4 mb-2">
                                                    Họ và tên:
                                                    <span style="font-weight: bold;">{{ customerInfo.name || '' }}</span>
                                                </div>
                                                <div class="col-sm-6 col-lg-4 mb-2">
                                                    CMND/CCCD:
                                                    <span style="font-weight: bold;">{{ customerInfo.physicalId || '' }}</span>
                                                </div>
                                                <div class="col-sm-6 col-lg-4 mb-2">
                                                    Ngày sinh:
                                                    <span style="font-weight: bold;">{{ $moment(customerInfo.birthday).format('DD/MM/YYYY') || '' }}</span>
                                                </div>
                                                <div class="col-sm-6 col-lg-4 mb-2">
                                                    Giới tính:
                                                    <span style="font-weight: bold;">{{ customerInfo.gender == 'male' ? 'Nam' : 'Nữ' || '' }}</span>
                                                </div>
                                                <div class="col-sm-6 col-lg-4 mb-2">
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
                                                    <el-table :data="anamnesisData" style="width: 100%" border @selection-change="handleSelectionChange">
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
                                                <div class="col-lg-6 mb-3" v-for="(item, index) in fileList" :key="index">
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
                                                                @click="updateExamination()"
                                                            >
                                                                <i class='bx bxs-edit' ></i>
                                                                <span>Cập nhật</span>
                                                            </button>
                                                        </span>
                                                    </el-dialog>
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
                </el-card>
            </div>
        </form>
    </LeftMenu>
</template>

<script>
import { mapState } from 'vuex';
import Customer from '@/models/tw_Customer';
import Examination from '@/models/tw_Examination';
import LeftMenu from '@/components/customer/LeftMenu';
import Designation from '@/components/customer/DesignationV2.vue';
import DiagnosisTreatment from '@/components/customer/DiagnosisTreatment.vue';
import { cloneDeep, debounce, intersection, remove } from 'lodash';
import { xquangList, testList } from '@/utils/masterData';
import buildFormData from '@/utils/buildFormData';
import moment from 'moment';
export default {
    components: {
		LeftMenu,
        Designation,
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
            dataLoading: false,
            activeCollapse: ['generalExam'],
            customerInfo: new Customer(),
            anamnesisData: [],
            anamnesisSelected: [],
            formData: new Examination(),
            fileList: [],
            allergyData: [],
            xquangData: xquangList,
            testData: testList,
            designationTypeData: [],
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
            tableData: [],
            tableLoading: false,
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
        }
        //Lấy danh sách tiền sử bệnh
        var anamnesisArr = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamAnamnesis' })) || [];
        _this.anamnesisList = anamnesisArr.map(item => {
            return {
                value: item.value,
                label: item.label,
                note: ''
            }
        });
        //Lấy danh sách dị ứng
        _this.allergyData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamAllergy' })) || [];
        _this.anamnesisData = _this.anamnesisList;
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
        async submitExaminationForm() {
            const _this = this;
            if(_this.checkRight('createExamination') && _this.$route.query.examinationId && _this.$route.query.examinationId == 'create'){
                await _this.createExaminationForm();
            }
            else if(_this.checkRight('updateExamination') && _this.$route.query.examinationId && _this.$route.query.examinationId != 'create'){
                await _this.updateExaminationForm();
            }
        },
        createExaminationForm: debounce(async function () {
            const _this = this;
            _this
                .$confirm(`Bạn có chắc muốn tạo phiếu khám?`, 'Xác nhận', {
					confirmButtonText: 'Xác nhận',
					cancelButtonText: 'Hủy',
					type: 'confirm',
				})
                .then(async () => {
                    try{
                        _this.dataLoading = true;
                        _this.formData.dentistId = _this.userInfo.data._id;
                        _this.formData.createdBy = _this.userInfo.data.username;
                        _this.formData.anamnesis = _this.anamnesisSelected;
                        _this.formData.diagnosisTreatment = _this.tableData;
                        _this.formData.customerId = _this.$route.params.id;
                        var oldData = cloneDeep(_this.formData);
                        var newData = new FormData();
                        buildFormData(newData, oldData);
                        const data = await _this.$axios.$post('/api/customer/createExamination', newData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        if (data.success) {
                            _this.$message({
                                message: data.message,
                                type: 'success',
                            });
                            _this.formData = data.data;
                            _this.dataLoading = false;
                        } else {
                            _this.$message.error(data.error);
                            _this.dataLoading = false;
                        }
                    }
                    catch (e){
                        console.log(e);
                        _this.$message.error(e);
                        _this.dataLoading = false;
                    }
                })
        }),
        updateExaminationForm: debounce(async function () {
            const _this = this;
            _this
                .$confirm(`Bạn có chắc muốn cập nhật phiếu khám?`, 'Xác nhận', {
					confirmButtonText: 'Xác nhận',
					cancelButtonText: 'Hủy',
					type: 'confirm',
				})
                .then(async () => {
                    try{

                    }
                    catch (e){
                        console.log(e);
                        _this.$message.error(e);
                        _this.dataLoading = false;
                    }
                })
        }),
        handleSelectionChange(val) {
            const _this = this;
            _this.anamnesisSelected = val;
            console.log(_this.anamnesisSelected)
        },
        addDesignation(){
            const _this = this;
            var index = _this.fileList.length <= 0 ? 1 : _this.fileList[_this.fileList.length - 1].key + 1;
            _this.fileList.push({
                key: index,
                type: '',
                files: [],
            });
        },
        removeDesignation(key) {
            const _this = this;
            var newArr = _this.fileList.filter(item => item.key !== key);
            _this.fileList = newArr;
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