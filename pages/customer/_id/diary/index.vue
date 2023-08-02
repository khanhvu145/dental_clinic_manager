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
                        <button type="button" class="control-btn green" @click="getData(searchQuery)">
                            <i class='bx bx-search'></i>
                            Tìm
                        </button>
                    </div>
                </div>
            </div>
            <div class="row mt-4" v-loading="dataLoading">
                <div v-if="data.total > 0" class="col-md-12">
                    <el-timeline>
                        <el-timeline-item v-for="(item, index) in data.data" :key="index" color="#64dd17" size="large">
                            <div class="row">
                                <div class="col-md-12">
                                     <a v-if="item.type == 'examination'" style="font-weight:bold;color:#60c248;cursor:pointer;">
                                        <div>
                                            Khám và điều trị ({{ item.content ? item.content.code : '' }})
                                            <i class='bx bxs-edit-alt'></i>
                                        </div>
                                    </a>
                                    <a v-else-if="item.type == 'payment'" style="font-weight:bold;color:#60c248;cursor:pointer;">
                                        <div>
                                            Thanh toán ({{ item.content ? item.content.code : '' }})
                                            <i class='bx bxs-edit-alt'></i>
                                        </div>
                                    </a>
                                    <a v-else-if="item.type == 'booking'" style="font-weight:bold;color:#60c248;cursor:pointer;">
                                        <div>
                                            Đặt hẹn ({{ item.content ? item.content.code : '' }})
                                            <i class='bx bxs-edit-alt'></i>
                                        </div>
                                    </a>
                                </div>
                                <div class="col-md-12 mt-3" style="font-style: italic;color:#98a6ad;">
                                    {{ item.createdBy }} - {{ $moment(item.createdAt).fromNow() }} ({{ $moment(item.createdAt).format('DD/MM/YY HH:mm') }})
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
                    // codeF: '',
                    // dentistsF: [],
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
            viewDialog: {
                visible: false,
                data: null,
                width: '60%'
            },
            xquangData: [],
            testData: [],
            allergyData: [],
            serviceData: [],
            viewReceiptDialog: {
                visible: false,
                data: null,
            },
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
        refreshData(){
            const _this = this;
            _this.searchQuery.filters = {
                // codeF: '',
                // dentistsF: [],
                typeF: 'all',
                dateF: []
            }
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
        async viewExamination(data){
            const _this = this;
            //#region Set độ rộng dialog
            var w = window.innerWidth;
            if(w >= 1200 && w <= 1500){
                _this.viewDialog.width = '60%'
            }
            else if(w >= 1100 && w < 1200){
                _this.viewDialog.width = '70%'
            }
            else if(w >= 900 && w < 1100){
                _this.viewDialog.width = '80%'
            }
            else if(w < 900){
                _this.viewDialog.width = '90%'
            }
            else{
                _this.viewDialog.width = '50%'
            }
            //#endregion
            if (data && data.targetId) {
                await _this.$axios.$get(`/api/customer/getExaminationById/${data.targetId}`).then(
                    async (response) => {
                        _this.viewDialog.data = response.data[0];
                        _this.viewDialog.visible = true;
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
    }
}
</script>