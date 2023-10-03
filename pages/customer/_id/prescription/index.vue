<template>
    <LeftMenu>
        <div class="row mt-3">
            <div class="col-md-12" style="text-align: right;">
                <button type="button" class="control-btn gray" @click="$router.push(`/customer`)">
                    <i class='bx bx-arrow-back'></i>
                    <span>Quay lại</span>
                </button>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-12">
                <el-tabs v-model="activeName">
                    <!-- Cập nhật đơn thuốc -->
                    <el-tab-pane label="Cập nhật đơn thuốc" name="createUpdate">
                        <form v-if="checkRight('createUpdatePrescription')" class="mt-3 mb-4" v-loading="dataLoading" v-on:submit.prevent="submitForm">
                            <div class="row" style="font-size:13px;line-height: 1.7;">
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
                            <div class="row mt-3">
                                <div class="col-md-12">
                                    <div class="col-form-label" style="font-weight:bold;">Nội dung *</div>
                                    <el-input type="textarea" :rows="3" placeholder="Nhập nội dung" v-model="data.content"></el-input>
                                </div>
                                <div class="col-md-12 mt-3">
                                    <div class="col-form-label" style="font-weight:bold;">Đơn thuốc *</div>
                                    <template>
                                        <el-table :data="data.medicines" style="width: 100%" border stripe>
                                            <el-table-column prop="order" label="#" width="50" align="center"></el-table-column>
                                            <el-table-column label="Tên thuốc" min-width="120">
                                                <template slot-scope="scope">
                                                    <el-select v-model="scope.row.medicine" placeholder="Chọn thuốc">
                                                        <el-option
                                                            v-for="item in medicineData"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.value"
                                                        ></el-option>
                                                    </el-select>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="Số lượng" width="100">
                                                <!-- <template slot-scope="scope">
                                                    <div class="inputTextRight">
                                                        <vue-autonumeric
                                                            v-model="scope.row.quantity"
                                                            placeholder="0"
                                                            class="el-input__inner"
                                                            :options="{
                                                                decimalPlaces: 0,
                                                                digitGroupSeparator: ',',
                                                                decimalCharacter: '.',
                                                                decimalCharacterAlternative: '.',
                                                                currencySymbolPlacement: 's',
                                                                roundingMethod: 'U',
                                                                minimumValue: '0',
                                                                maximumValue: '1000',
                                                                emptyInputBehavior: '0'
                                                            }"
                                                        >
                                                        </vue-autonumeric>
                                                    </div>
                                                </template> -->
                                            </el-table-column>
                                            <el-table-column label="Ghi chú" min-width="150">
                                                <template slot-scope="scope">
                                                    <el-input
                                                        type="textarea"
                                                        placeholder="Nhập ghi chú"
                                                        v-model="scope.row.note"
                                                        :rows="2"
                                                    ></el-input>
                                                </template>
                                            </el-table-column>
                                            <el-table-column width="50">
                                                <template slot="header">
                                                    <span @click="addPrescription()" style="cursor:pointer;">
                                                        <i class="el-icon-circle-plus font-20"></i>
                                                    </span>
                                                </template>
                                                <template slot-scope="scope">
                                                    <span @click="removePrescription(scope.row.idForEdit, scope.row.order)" style="cursor:pointer;">
                                                        <i class="el-icon-remove font-20"></i>
                                                    </span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </template>
                                </div>
                                <div class="col-md-12 mt-3">
                                    <div class="col-form-label" style="font-weight:bold;">Lời dặn của nha sĩ</div>
                                    <tiny-editor
                                        data-vv-as='Lời dặn của nha sĩ'
                                        v-model='data.advice'
                                    >
                                    </tiny-editor>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-md-12" style="text-align: right;">
                                    <button type="button" class="control-btn gray" @click="refreshForm()">
                                        <i class='bx bx-refresh'></i>
                                        <span>Làm mới</span>
                                    </button>
                                    <button
                                        v-if="checkRight('createUpdatePrescription')"
                                        type="button" 
                                        class="control-btn green" 
                                        @click="submitForm"
                                    >
                                        <i class='bx bx-save' ></i>
                                        <span>Lưu thông tin</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div v-else>
                            <el-empty description="Bạn không có quyền !!"></el-empty>
                        </div>
                    </el-tab-pane>
                    <!-- Lịch sử đơn thuốc -->
                    <el-tab-pane label="Lịch sử đơn thuốc" name="history">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="col-form-label">Nha sĩ kê đơn</div>
                                <el-select 
                                    v-model="searchQuery.filters.dentistsF" 
                                    placeholder="Chọn nha sĩ" 
                                    name="dentistsF" 
                                    style="width: 100%"
                                    clearable 
                                    filterable
                                    remote
                                    multiple
                                    :remote-method="(text) => filterDentist(text)"
                                    @focus="filterDentist('')"
                                >
                                    <el-option
                                        v-for="item in dentistData"
                                        :key="item._id"
                                        :label="`Ns ${item.name}`"
                                        :value="item._id"
                                    ></el-option>
                                </el-select>
                            </div>
                            <div class="col-md-4">
                                <div class="col-form-label">Ngày kê đơn</div>
                                <el-date-picker
                                    v-model="searchQuery.filters.dateF"
                                    type="daterange"
                                    range-separator="-"
                                    start-placeholder="Từ"
                                    end-placeholder="Đến"
                                    format="dd/MM/yyyy">
                                </el-date-picker>
                            </div>
                            <div class="col-md-4" style="margin-top:36px;">
                                <button type="button" class="control-btn gray" @click="refreshData()">
                                    <i class='bx bx-refresh'></i>
                                </button>
                                <button type="button" class="control-btn green" @click="searchData()">
                                    <i class='bx bx-search'></i>
                                    Tìm
                                </button>
                            </div>
                        </div>
                        <div class="row mt-4">
                            <div class="col-md-12">
                                <el-table :data="datas.data" v-loading="dataLoading" style="width: 100%" stripe border>
                                    <el-table-column label="Ngày kê đơn" min-width="120">
                                        <template slot-scope="scope">
                                            {{ scope.row.createdAt ? $moment(scope.row.createdAt).format('DD/MM/YYYY') : '' }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Nha sĩ kê đơn" min-width="120">
                                        <template slot-scope="scope">
                                            Ns. {{scope.row.dentistName}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Nội dung" min-width="150">
                                        <template slot-scope="scope">
                                            {{scope.row.content}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Thao tác" min-width="80">
                                        <template slot-scope="scope">
                                            <div v-if="checkRight('printPrescription')">
                                                <el-tooltip class="item" effect="dark" content="In đơn thuốc" placement="top">
                                                    <a class="btn control-btn blue2" style="padding: 4px 6px;" @click="printPrescription(scope.row._id)">
                                                        <i class='bx bx-printer'></i>
                                                    </a>
                                                </el-tooltip>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                        <div class="row mt-4 mb-4">
                            <div class="col-md-12">
                                <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page.sync="currentPage"
                                    :page-sizes="[1, 10, 20, 50, 100]"
                                    background
                                    layout="total, sizes, prev, pager, next"
                                    :total="datas.total">
                                </el-pagination>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <!-- Template in đơn thuốc -->
        <vue-html2pdf 
            class="print-content"
            id="print-content-pdf-2"
            :show-layout="false"
            :float-layout="true"
            :preview-modal="true"
            :enable-download="false"
            :paginate-elements-by-height="1500"
            filename="prescription"
            :pdf-quality="2"
            :manual-pagination="false"
            pdf-format="a5"
            pdf-orientation="portrait"
            pdf-content-width="100%"
            ref="html2Pdf_prescription"
        >
            <section slot="pdf-content">
                <div v-if="prescriptionData" class="container mt-3" style="color:#000;font-size:12px;">
                    <div class="row">
                        <div class="col-md-2">
                            <img style="width:100%;height:auto;object-fit: cover;" :src="informationConfig.img" crossorigin="anonymous" />
                        </div>
                        <div class="col-md-10">
                            <div style="font-weight:bold;font-size:15px;text-transform: uppercase;">{{ informationConfig.name }}</div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mt-2">
                                        <span style="font-weight:bold;">Số điện thoại:</span>
                                        <span>{{ informationConfig.phone }}</span>
                                    </div>
                                    <div class="mt-2">
                                        <span style="font-weight:bold;">Địa chỉ:</span>
                                        <span>{{ informationConfig.address }}</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mt-2">
                                        <span style="font-weight:bold;">Email:</span>
                                        <span>{{ informationConfig.email }}</span>
                                    </div>
                                    <div class="mt-2">
                                        <span style="font-weight:bold;">Website:</span>
                                        <span>{{ informationConfig.website }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-12 text-center">
                            <div style="font-weight:bold;font-size:15px;">ĐƠN THUỐC</div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-6 mb-2">
                            <span>Mã khách hàng: </span>
                            {{ prescriptionData.customerCode || '' }}
                        </div>
                        <div class="col-md-6 mb-2">
                            <span>Họ và tên: </span>
                            {{ prescriptionData.customerName || '' }}
                        </div>
                        <div class="col-md-6 mb-2">
                            <span>CMND/CCCD: </span>
                            {{ prescriptionData.customerPhysicalId || '' }}
                        </div>
                        <div class="col-md-6 mb-2">
                            <span>Ngày sinh: </span>
                            {{ $moment(prescriptionData.customerBirthday).format('DD/MM/YYYY') || '' }}
                        </div>
                        <div class="col-md-6 mb-2">
                            <span>Số điện thoại: </span>
                            {{ prescriptionData.customerPhone || '' }}
                        </div>
                        <div class="col-md-6 mb-2">
                            <span>Giới tính: </span>
                            {{ prescriptionData.customerGender == 'male' ? 'Nam' : 'Nữ' || '' }}
                        </div>
                        <!-- <div class="col-md-12 mb-2">
                            <span>Địa chỉ: </span>
                            {{ prescriptionData.customerFullAddress || '' }}
                        </div> -->
                    </div>
                    <div class="row mt-2">
                        <div v-for="item in prescriptionData.medicines" :key="item._id" class="col-md-12 mb-2">
                            <div class="row" style="font-weight:bold;">
                                <div class="col-md-8">
                                    {{ item.order }}. {{ getMedicineName(item.medicine) }}
                                </div>
                                <div class="col-md-4">
                                    Số lượng: {{ item.quantity }}
                                </div>
                            </div>
                            <div class="row mt-1">
                                <div class="col-md-12 ml-4" style="font-style: italic;opacity:0.8;">
                                    {{ item.note }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-md-7">
                            <div class="row">
                                <div class="col-md-12" style="font-weight:bold;font-style:italic;text-decoration:underline;">Lời dặn của nha sĩ:</div>
                                <div class="adviceContent col-md-12 mt-1 ml-2">
                                    <div class="adviceItem">

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div class="row mt-3" style="text-align:center;">
                                <div class="col-md-12">
                                    Ngày {{$moment(prescriptionData.createdAt).format('DD')}} tháng {{$moment(prescriptionData.createdAt).format('MM')}} năm {{$moment(prescriptionData.createdAt).format('YYYY')}}
                                </div>
                                <div class="col-md-12 mt-2">
                                    <div style="font-weight:bold;margin-bottom:80px;">Nha sĩ điều trị</div>
                                    <div style="font-weight:bold;">{{ prescriptionData.dentistName }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </vue-html2pdf>
    </LeftMenu>
</template>

<script>
import { mapState } from 'vuex';
import LeftMenu from '@/components/customer/LeftMenu';
import { debounce, map, cloneDeep, intersection, filter, find, forEach } from 'lodash';
import Prescription from '@/models/tw_Prescription';
import buildFormData from '@/utils/buildFormData';
// import VueAutonumeric from 'vue-autonumeric';
import TinyEditor from '@/components/common/TinyEditor';
import Customer from '@/models/tw_Customer';
export default {
    components: {
		LeftMenu,
        // 'vue-autonumeric': VueAutonumeric,
		'tiny-editor': TinyEditor,
	},
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
            informationConfig: (state) => state.informationConfig,
		}),
	},
    data(){
        return {
            searchQuery: {
                filters: {
                    dentistsF: [],
                    dateF: []
                },
                sorts: -1,
                pages:{
                    from: 0,
                    size: 10
                }
            },
            dentistData: [],
            dataLoading: false,
            data: new Prescription(),
            currentPage: 1,
            activeName: 'createUpdate',
            medicineData: [],
            customerInfo: new Customer(),
            datas: {},
            prescriptionData: new Prescription()
        }
    },
    async created(){
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
        //Lấy danh sách thuốc
        _this.medicineData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamMedicine' })) || [];
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
        filterDentist: debounce(async function (text) {
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
            let dentists = await _this.$axios.$post('/api/user/getDentistByQuery', query);
            _this.dentistData = dentists && dentists.data;
        }, 200),
        searchData(){
            const _this = this;
            _this.currentPage = 1;
            _this.searchQuery.pages.from = 0;
            _this.getData(_this.searchQuery)
        },
        refreshData(){
            const _this = this;
            _this.searchQuery.filters = {
                dentistsF: [],
                dateF: [],
            }
            _this.searchQuery.pages.from = 0;
            _this.currentPage = 1;
            _this.getData(_this.searchQuery);
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
        async getData(searchQuery){
            const _this = this;
            _this.dataLoading = true;
            if (_this.$route.params.id){
                searchQuery.filters.customerF = _this.$route.params.id;
                await _this.$axios.$post('/api/customer/getByQueryPrescription', searchQuery).then(
                    (response) => {
                        _this.datas = response;
                    },
                    (error) => {
                        console.log('Error: ', error);
                        _this.$message({
                            type: 'error',
                            message: error,
                        });
                    }
                );
            }
            _this.dataLoading = false;
        },
        getMedicineName(value){
            const _this = this;
            let data = _.find(_this.medicineData, { value: value });
			return data ? data.label : '';
        },
        addPrescription(){
            const _this = this;
            var order = _this.data.medicines.length + 1;
            _this.data.medicines.push({
                idForEdit: `new_${order}_${_this.$moment().format('DDMMYYYYHHmmssSSS')}`,
                order: order,
                medicine: '',
                quantity: 0,
                note: ''
            });
        },
        removePrescription(id, order){
            const _this = this;
            var arr = _this.data.medicines.filter(obj => obj.idForEdit != id);
            for(var i = order - 1; i < arr.length; i++){
                arr[i].order = i + 1;
                arr[i].idForEdit = `new_${i + 1}_${_this.$moment().format('DDMMYYYYHHmmssSSS')}`;
            }
            _this.data.medicines = arr;
        },
        submitForm: debounce(async function () {
            const _this = this;
            _this.dataLoading = true;
            try{
                if(_this.customerInfo._id){
                    _this.data.customerId = _this.customerInfo._id;
                    var newData = cloneDeep(_this.data);
                    const data = await _this.$axios.$post('/api/customer/createPrescription', newData);
                    if (data.success) {
                        _this.$message({
                            message: 'Lưu đơn thuốc thành công',
                            type: 'success',
                        });
                        if(data.data){
                            setTimeout(() => {
                                _this.printPrescription(data.data._id);
                                _this.getData(_this.searchQuery);
                            }, 100);
                        }
                    } 
                    else {
                        _this.$message.error(data.error);
                    }
                }
            }
            catch (e){
                console.log(e);
                _this.$message.error(e);
            }
            _this.dataLoading = false;
        }),
        refreshForm(){
            const _this = this;
            _this.dataLoading = true;
            setTimeout(() => {
                _this.data = new Prescription();
                _this.dataLoading = false;
            }, 300);
        },
        async printPrescription(id){
            const _this = this;
            if(id){
                await _this.$axios.$get(`/api/customer/getPrescriptionById/${id}`).then(
                    async (response) => {
                        if(response.success){
                            _this.prescriptionData = response.data || new Prescription();
                            if(_this.prescriptionData.medicines && _this.prescriptionData.medicines.length > 0){
                                _this.prescriptionData.medicines = _.map(_this.prescriptionData.medicines, (e) => {
                                    return {
                                        ...e,
                                        idForEdit: e._id
                                    };
                                });
                            }
                            if(_this.prescriptionData){
                                const printEle = _this.$refs.html2Pdf_prescription.$el.querySelector(".adviceContent .adviceItem");
                                if (printEle) {
                                    printEle.remove();
                                }
                                const myElement = _this.$refs.html2Pdf_prescription.$el.querySelector(".adviceContent");
                                var divContent = document.createElement("div");
                                divContent.classList.add('adviceItem');
                                divContent.innerHTML = _this.prescriptionData.advice || '';
                                myElement.appendChild(divContent);
                                setTimeout(() => {
                                    _this.$refs.html2Pdf_prescription.generatePdf();
                                }, 500);
                            }
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
            }
        },
    }
}
</script>