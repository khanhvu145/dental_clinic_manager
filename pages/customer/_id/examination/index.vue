<template>
    <LeftMenu>
        <div class="row mt-4">
            <div class="col-md-12" style="text-align: right;">
                <button type="button" class="control-btn gray" @click="$router.push('/customer')">
                    <i class='bx bx-arrow-back'></i>
                    <span>Quay lại</span>
                </button>
            </div>
        </div>
        <div v-if="isExam" class="row mt-3 mb-4">
            <div class="col-md-12">
                <el-card class="box-card">
                    <div slot="header" class="card-header-custom" style="font-size:14px;font-weight:bold;">
                        <span>NGÀY KHÁM: {{ $moment().format('DD/MM/YYYY') }}</span>
                        <button class="control-btn red" @click="deleteExamForm">
                            <i class='bx bxs-trash mr-1'></i>
                            Xóa
                        </button>
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
                                                <button class="control-btn green" style="float:right;" @click="addDesignation">
                                                    <i class='bx bxs-file-plus'></i>
                                                    Thêm chỉ định mới
                                                </button>
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
                                                <button class="control-btn green" style="float:right;" @click="addExamination">
                                                    <i class='bx bx-list-plus'></i>
                                                    Thêm mới
                                                </button>
                                                <ExaminationDialog 
                                                    :dialog="addExaminationDialog"
                                                ></ExaminationDialog>
                                            </div>
                                        </div>
                                        <div class="row mt-3">
                                            <div class="col-md-12">
                                                <el-table :data="tableData" style="width: 100%" stripe>
                                                    <el-table-column label="Răng" min-width="60">

                                                    </el-table-column>
                                                    <el-table-column label="Tình trạng răng" min-width="120">
                                                        
                                                    </el-table-column>
                                                    <el-table-column label="Thủ thuật điều trị" min-width="120">
                                                        
                                                    </el-table-column>
                                                    <el-table-column label="Đơn giá" min-width="100">
                                                        
                                                    </el-table-column>
                                                    <el-table-column label="Giảm giá" min-width="100">
                                                        
                                                    </el-table-column>
                                                    <el-table-column label="Thành tiền" min-width="100">
                                                        
                                                    </el-table-column>
                                                    <el-table-column label="Ghi chú" min-width="100">
                                                        
                                                    </el-table-column>
                                                    <el-table-column label="Thao tác" min-width="60">
                                                        
                                                    </el-table-column>
                                                </el-table>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- <div class="row mx-0 pt-4 pb-4">
                                        <div class="col-md-12">
                                            <el-checkbox-group v-model="checkboxGroup1" size="mini">
                                                <el-checkbox-button>
                                                    <template>
                                                        <div class="tooth-content">
                                                            <i class='bx bx-sushi'></i>
                                                            <img class="tooth-img" src="/images/tooth.png" alt="">
                                                        </div>
                                                    </template>
                                                </el-checkbox-button>
                                            </el-checkbox-group>
                                            <button class="control-btn green mb-3" style="float:right;" @click="addDesignation">
                                                <i class='bx bx-list-plus'></i>
                                                Thêm mới
                                            </button>
                                            <ExaminationDialog 
                                                :dialogVisible="examinationDialog"
                                            ></ExaminationDialog>
                                        </div>
                                        <div class="col-md-12">
                                            <el-table :data="tableData" style="width: 100%" stripe>
                                                <el-table-column label="Răng" min-width="60">

                                                </el-table-column>
                                                <el-table-column label="Tình trạng răng" min-width="120">
                                                    
                                                </el-table-column>
                                                <el-table-column label="Thủ thuật điều trị" min-width="120">
                                                    
                                                </el-table-column>
                                                <el-table-column label="Đơn giá" min-width="100">
                                                    
                                                </el-table-column>
                                                <el-table-column label="Giảm giá" min-width="100">
                                                    
                                                </el-table-column>
                                                <el-table-column label="Thành tiền" min-width="100">
                                                    
                                                </el-table-column>
                                                <el-table-column label="Ghi chú" min-width="100">
                                                    
                                                </el-table-column>
                                                <el-table-column label="Thao tác" min-width="60">
                                                    
                                                </el-table-column>
                                            </el-table>
                                        </div>
                                    </div> -->
                                </el-collapse-item>
                            </el-collapse>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-12">
                            <div class="col-form-label" style="font-weight:bold;">TỔNG CHI PHÍ ĐIỀU TRỊ</div>
                            <div class="row">
                                <div class="col-md-12 ml-3" style="font-size:14px;">
                                    Chi phí điều trị: <span style="font-weight:bold;"></span>
                                </div>
                                <div class="col-md-12 mt-3 ml-3" style="font-size:14px;">
                                    Giảm giá: <span style="font-weight:bold;"></span>
                                </div>
                                <div class="col-md-12 mt-3 ml-3" style="font-size:14px;">
                                    Tổng chi phí điều trị: <span style="font-weight:bold;"></span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12">
                            
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
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
import { cloneDeep, debounce, intersection, remove } from 'lodash';
import { genderData, anamnesisList, xquangList, testList, milkTooth, permanentTeeth } from '@/utils/masterData';
import buildFormData from '@/utils/buildFormData';
import moment from 'moment';
export default {
    components: {
		LeftMenu,
        ImageUpload,
        Designation,
        ExaminationDialog
	},
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data(){
        return {
            isExam: false,
            tableData: [],
            checkboxGroup1: false,
            customerInfo: new Customer(),
            anamnesisData: [],
            allergyData: anamnesisList,
            xquangData: xquangList,
            testData: testList,
            formData: new Examination(),
            designationTypeData: [],
            permanentTeethData: permanentTeeth,
            milkToothData: milkTooth,
            addExaminationDialog: {
                visible: false,
                type: 'create'
            },
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
        var anamnesisList = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamAnamnesis' })) || [];
        _this.anamnesisData = anamnesisList.map(item => {
            return {
                value: item.value,
                label: item.label,
                note: '',
                isCheck: false
            }
        });
        //Lấy danh sách dị ứng
        _this.allergyData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamAllergy' })) || [];
        //Lấy danh sách loại x-quang
        _this.xquangData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamXquang' })) || [];
        //Lấy danh sách loại xét nghiệm
        _this.testData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamTest' })) || [];
        //Lấy danh sách loại chỉ định
        _this.designationTypeData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigDesignationType' })) || [];
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['examination.all', 'examination.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        async addExamForm(){
            const _this = this;
            _this.isExam = true;
        },
        async deleteExamForm(){
            const _this = this;
            console.log(_this.formData)
            // _this.isExam = false;
        },
        addDesignation(){
            const _this = this;
            var index = _this.formData.attachFiles.length <= 0 ? 1 : _this.formData.attachFiles[_this.formData.attachFiles.length - 1].key + 1;
            _this.formData.attachFiles.push({
                key: index,
                type: '',
                files: [],
                fileList: [],
            });
        },
        removeDesignation(key) {
            const _this = this;
            var newArr = _this.formData.attachFiles.filter(item => item.key !== key);
            _this.formData.attachFiles = newArr
        },
        addExamination(){
            const _this = this;
            _this.addExaminationDialog.visible = true;
            _this.addExaminationDialog.type = 'create';
        }
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