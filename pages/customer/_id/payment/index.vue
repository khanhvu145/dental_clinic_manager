<template>
    <LeftMenu>
        <div v-if="checkRight('viewPayment')">
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
                    <div class="col-form-label">Mã phiếu khám</div>
                    <el-input placeholder="Mã phiếu khám..." v-model="searchQuery.filters.examinationCodeF" name="examinationCodeF"></el-input>
                </div>
                <div class="col-md-4">
                    <div class="col-form-label">Trạng thái</div>
                    <el-select v-model="searchQuery.filters.statusF" placeholder="Trạng thái..." name="statusF" multiple clearable filterable>
                        <el-option label="Chưa thanh toán" value="unpaid"></el-option>
                        <el-option label="Thanh toán một phần" value="partialPaid"></el-option>
                        <el-option label="Đã thanh toán" value="paid"></el-option>
                    </el-select>
                </div>
                <div class="col-md-3">
                    <div class="col-form-label">Ngày lập</div>
                    <el-date-picker
                        v-model="searchQuery.filters.createdAtF"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="Ngày bắt đầu"
                        end-placeholder="Ngày kết thúc"
                        format="dd/MM/yyyy">
                    </el-date-picker>
                </div>
                <div class="col-md-2">
                    <button type="button" class="control-btn green" @click="getData(searchQuery)" style="margin-top:34px;">
                        <i class='bx bx-search'></i>
                        Tìm
                    </button>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-md-12">
                    <el-table :data="data.data" v-loading="dataLoading" style="width: 100%" max-height="385" stripe border show-summary :summary-method="getSummaries">
                        <el-table-column label="Mã phiếu khám" min-width="80">
                            <template slot-scope="scope">
                                {{scope.row.examinationCode}}
                            </template>
                        </el-table-column>
                        <el-table-column label="Ngày lập" min-width="80">
                            <template slot-scope="scope">
                                {{ scope.row.createdAt ? $moment(scope.row.createdAt).format('DD/MM/YYYY') : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Số tiền" min-width="100" prop="amount" align="right">
                            <template slot-scope="scope">
                                {{ (scope.row.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Đã thanh toán" min-width="100" prop="paidAmount" align="right">
                            <template slot-scope="scope">
                                {{ (scope.row.paidAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Còn lại" min-width="100" prop="remainAmount" align="right">
                            <template slot-scope="scope">
                                {{ (scope.row.remainAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Trạng thái" min-width="100">
                            <template slot-scope="scope">
                                <div style="text-align:center;">
                                    <el-tag v-if="scope.row.status == 'unpaid'" type="danger">Chưa thanh toán</el-tag>
                                    <el-tag v-if="scope.row.status == 'partialPaid'" type="warning">Thanh toán một phần</el-tag>
                                    <el-tag v-if="scope.row.status == 'paid'" type="success">Đã thanh toán</el-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="Thao tác" min-width="60">
                            <template slot-scope="scope">
                                <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">
                                    <div v-if="checkRight('confirmPayment') && scope.row.status != 'paid'">
                                        <el-tooltip class="item" effect="dark" content="Thanh toán" placement="top">
                                            <a class="btn control-btn red" style="padding: 4px 6px;" @click="viewPayment(scope.row)">
                                                <i class='bx bxl-paypal'></i>
                                            </a>
                                        </el-tooltip>
                                    </div>
                                    <!-- <div v-if="checkRight('printPayment')">
                                        <el-tooltip class="item" effect="dark" content="In phiếu thu" placement="top">
                                            <a class="btn control-btn yellow" style="padding: 4px 6px;" @click="printPayment(scope.row)">
                                            <i class='bx bxs-printer'></i>
                                            </a>
                                        </el-tooltip>
                                    </div> -->
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
                        :total="data.total">
                    </el-pagination>
                </div>
            </div>

            <el-dialog
                :visible.sync='paymentDialog.visible'
                title="Ghi nhận thanh toán"
                :close-on-click-modal="false"
                width="65%"
            >
                <div v-if="paymentDialog.data" class="container">
                    <div class="row">
                        <div style="font-weight:bold;font-size:16px;">Thông tin chung</div>
                        <div class="col-md-12 mt-3" style="background-color: #f8f8f8;">
                            <div class="row" style="border-bottom: dotted 1px #ddd;">
                                <div class="col-md-4 pt-2 pb-2">
                                    Mã phiếu khám
                                </div>
                                <div class="col-md-8 pt-2 pb-2" style="font-weight:bold;">
                                    {{paymentDialog.data.examinationCode}}
                                </div>
                            </div>
                            <div class="row" style="border-bottom: dotted 1px #ddd;">
                                <div class="col-md-4 pt-2 pb-2">
                                    Khách hàng
                                </div>
                                <div class="col-md-8 pt-2 pb-2" style="font-weight:bold;">
                                    {{'(' + customerInfo.code + ') ' + customerInfo.name}}
                                </div>
                            </div>
                            <div class="row" style="border-bottom: dotted 1px #ddd;">
                                <div class="col-md-4 pt-2 pb-2">
                                    Ngày lập phiếu thu
                                </div>
                                <div class="col-md-8 pt-2 pb-2" style="font-weight:bold;">
                                    {{ paymentDialog.data.createdAt ? $moment(paymentDialog.data.createdAt).format('DD/MM/YYYY') : '' }}
                                </div>
                            </div>
                            <div class="row" style="border-bottom: dotted 1px #ddd;">
                                <div class="col-md-4 pt-2 pb-2">
                                    Số tiền
                                </div>
                                <div class="col-md-8 pt-2 pb-2" style="font-weight:bold;">
                                    {{ (paymentDialog.data.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }}
                                </div>
                            </div>
                            <div class="row" style="border-bottom: dotted 1px #ddd;">
                                <div class="col-md-4 pt-2 pb-2">
                                    Đã thanh toán
                                </div>
                                <div class="col-md-8 pt-2 pb-2" style="font-weight:bold;">
                                    {{ (paymentDialog.data.paidAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }}
                                </div>
                            </div>
                            <div class="row" style="border-bottom: dotted 1px #ddd;">
                                <div class="col-md-4 pt-2 pb-2">
                                    Còn lại
                                </div>
                                <div class="col-md-8 pt-2 pb-2" style="font-weight:bold;">
                                    {{ (paymentDialog.data.remainAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }}
                                </div>
                            </div>
                            <div class="row" style="border-bottom: dotted 1px #ddd;">
                                <div class="col-md-4 pt-2 pb-2">
                                    Ghi chú
                                </div>
                                <div class="col-md-8 pt-2 pb-2" style="font-weight:bold;">
                                    {{ paymentDialog.data.note }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div style="font-weight:bold;font-size:16px;">Thông tin thanh toán</div>
                        <div class="col-md-12">
                            <div class="row">
                                <div class="col-lg-6">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="col-form-label">Số tiền còn lại</div>
                                            <el-input 
                                                name="remainAmount"
                                                placeholder="Số tiền còn lại"
                                                v-model="paymentDialog.data.remainAmount"
                                                readonly
                                            >
                                                <template slot="append">VND</template>
                                            </el-input>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="col-form-label">Số tiền thanh toán *</div>
                                            <el-input 
                                                name="receiptAmount"
                                                placeholder="Số tiền thanh toán"
                                                v-model="paymentDialog.data.receiptAmount"
                                            >
                                                <template slot="append">VND</template>
                                            </el-input>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="col-form-label">Hình thức thanh toán *</div>
                                            <el-select v-model="paymentDialog.data.methodFee" placeholder="Hình thức thanh toán" name="methodFee">
                                                <el-option label="Tiền mặt" value="cash"></el-option>
                                                <el-option label="Chuyển khoản" value="transfer"></el-option>
                                            </el-select>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="col-form-label">Ghi chú</div>
                                            <el-input type="textarea" :rows="4" placeholder="Ghi chú" v-model="paymentDialog.data.note"></el-input>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="col-form-label">Tệp đính kèm</div>
                                    <div>
                                        <el-upload
                                            class="upload-demo"
                                            drag
                                            multiple
                                            style="width: 100%"
                                            :limit="10"
                                            :on-preview="handlePreview"
                                            :on-remove="handleRemove"
                                            ref="uploadFiles"
                                            action="#"
                                            :auto-upload="false"
                                            :show-file-list="true"
                                            list-type="text"
                                        >
                                            <i class="el-icon-upload"></i>
                                            <div class="el-upload__text">
                                                Kéo thả file vào đây hoặc <em>nhấn vào để tải lên</em>
                                            </div>
                                        </el-upload>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <button type="button" class="control-btn gray" @click="paymentDialog.visible = false">
                        <i class='bx bx-x'></i>
                        <span>Đóng</span>
                    </button>
                    <button
                        v-if="checkRight('confirmPayment') && data.status != 'paid'"
                        type="button" 
                        class="control-btn blue"
                        @click="confirmPayment()"
                    >
                        <i class='bx bxs-save' ></i>
                        <span>Xác nhận thanh toán</span>
                    </button>
                </span>
            </el-dialog>
        </div>
        <div v-else>
            <el-empty description="Bạn không có quyền !!"></el-empty>
        </div>
    </LeftMenu>
</template>

<script>
import { mapState } from 'vuex';
import LeftMenu from '@/components/customer/LeftMenu';
import { cloneDeep, debounce, intersection, remove } from 'lodash';
import Customer from '@/models/tw_Customer';
import Payment from '@/models/tw_Payment';
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
                    examinationCodeF: '',
                    statusF: ['unpaid', 'partialPaid'],
                    dateF: [],
                },
                sorts: -1,
                pages:{
                    from: 0,
                    size: 10
                }
            },
            dataLoading: true,
            data: {},
            currentPage: 1,
            customerInfo: new Customer(),
            paymentDialog: {
                visible: false,
                data: null,
            }
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
                examinationCodeF: '',
                statusF: [],
                createdAtF: [],
            }
            _this.getData(_this.searchQuery);
        },
        async getData(searchQuery){
            const _this = this;
            _this.dataLoading = true;
            if (_this.$route.params.id) {
                _this.data.data = [
                    {
                        examinationCode: 'A001',
                        createdAt: new Date(),
                        amount: 2500000,
                        paidAmount: 0,
                        remainAmount: 2500000,
                        status: 'unpaid',
                    },
                    {
                        examinationCode: 'A002',
                        createdAt: new Date(),
                        amount: 3000000,
                        paidAmount: 2000000,
                        remainAmount: 1000000,
                        status: 'partialPaid',
                    },
                    {
                        examinationCode: 'A003',
                        createdAt: new Date(),
                        amount: 1800000,
                        paidAmount: 1800000,
                        remainAmount: 0,
                        status: 'paid',
                    },
                    {
                        examinationCode: 'A003',
                        createdAt: new Date(),
                        amount: 1800000,
                        paidAmount: 1800000,
                        remainAmount: 0,
                        status: 'paid',
                    },
                    {
                        examinationCode: 'A003',
                        createdAt: new Date(),
                        amount: 1800000,
                        paidAmount: 1800000,
                        remainAmount: 0,
                        status: 'paid',
                    },
                    {
                        examinationCode: 'A003',
                        createdAt: new Date(),
                        amount: 1800000,
                        paidAmount: 1800000,
                        remainAmount: 0,
                        status: 'paid',
                    },
                    {
                        examinationCode: 'A003',
                        createdAt: new Date(),
                        amount: 1800000,
                        paidAmount: 1800000,
                        remainAmount: 0,
                        status: 'paid',
                    },
                ];
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
        viewPayment(data){
            const _this = this;
            _this.paymentDialog.data = data;
            _this.paymentDialog.visible = true;
        },
        async confirmPayment(){
            const _this = this;
            const files = _this.$refs.uploadFiles.uploadFiles;
            console.log(files)
        },
        getSummaries(param){
            const { columns, data } = param;
			const _this = this;
            let sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = 'Tổng';
                    return;
                }
                if (index === 2) {
                    const values = data.map(item => Number(item[column.property]));
                    var total = values.reduce((partialSum, a) => partialSum + a, 0);
                    var totalString = (total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
                    sums[index] = totalString;
                    return;
                }
                if (index === 3) {
                    const values = data.map(item => Number(item[column.property]));
                    var total = values.reduce((partialSum, a) => partialSum + a, 0);
                    var totalString = (total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
                    sums[index] = totalString;
                    return;
                }
                if (index === 4) {
                    const values = data.map(item => Number(item[column.property]));
                    var total = values.reduce((partialSum, a) => partialSum + a, 0);
                    var totalString = (total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
                    sums[index] = totalString;
                    return;
                }
            });
            return sums;
        },
        handlePreview(file) {
			console.log(file);
		},
        handleRemove(file, fileList) {
			console.log(file, fileList);
		},
    }
}
</script>