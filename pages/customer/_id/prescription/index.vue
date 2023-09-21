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
                                    <div class="col-form-label" style="font-weight:bold;">Nội dung</div>
                                    <el-input type="textarea" :rows="3" placeholder="Nhập nội dung" v-model="data.content"></el-input>
                                </div>
                                <div class="col-md-12 mt-3">
                                    <div class="col-form-label" style="font-weight:bold;">Đơn thuốc</div>
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
                                                <template slot-scope="scope">
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
                                                </template>
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

                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </LeftMenu>
</template>

<script>
import { mapState } from 'vuex';
import LeftMenu from '@/components/customer/LeftMenu';
import { debounce, map, cloneDeep, intersection, filter, find, forEach } from 'lodash';
import Prescription from '@/models/tw_Prescription';
import buildFormData from '@/utils/buildFormData';
import VueAutonumeric from 'vue-autonumeric';
import TinyEditor from '@/components/common/TinyEditor';
import Customer from '@/models/tw_Customer';
export default {
    components: {
		LeftMenu,
        'vue-autonumeric': VueAutonumeric,
		'tiny-editor': TinyEditor,
	},
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
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
        }
    }
}
</script>