<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Quản lý phiếu thu</div>
                    </div>
                </div>
                <div class="row" style="margin-top: 9px;">
                    <div class="col-md-4 col-lg-2">
                        <div class="col-form-label">Mã phiếu thu</div>
                        <el-input placeholder="Mã phiếu thu..." v-model="searchQuery.filters.codeF" name="codeF"></el-input>
                    </div>
                    <div class="col-md-4 col-lg-2">
                        <div class="col-form-label">Mã phiếu khám</div>
                        <el-input placeholder="Mã phiếu khám..." v-model="searchQuery.filters.examinationCodeF" name="examinationCodeF"></el-input>
                    </div>
                    <div class="col-md-4 col-lg-2">
                         <div class="col-form-label">Khách hàng</div>
                        <el-input placeholder="Mã, tên..." v-model="searchQuery.filters.customerF" name="customerF"></el-input>
                    </div>
                    <div class="col-md-4 col-lg-2">
                        <div class="col-form-label">Ngày thanh toán</div>
                        <el-date-picker
                            v-model="searchQuery.filters.dateF"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="Ngày bắt đầu"
                            end-placeholder="Ngày kết thúc"
                            format="dd/MM/yyyy">
                        </el-date-picker>
                    </div>
                    <div class="col-md-4 col-lg-2">
                        <div class="col-form-label">Trạng thái</div>
                        <el-select v-model="searchQuery.filters.statusF" placeholder="Trạng thái..." name="statusF">
                            <el-option label="Tất cả" value="all"></el-option>
                            <el-option label="Đã thanh toán" value="paid"></el-option>
                            <el-option label="Đã hủy" value="cancelled"></el-option>
                        </el-select>
                    </div>
                    <div class="col-md-4 col-lg-2">
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
                <div class="row mt-4">
                    <div class="col-md-3">
                        <el-select v-model="searchQuery.sorts" filterable name="sorts" v-on:change="onChangeSorts($event)">
                            <template slot="prefix">
                                <i class='el-input__icon bx bx-sort'></i>
                            </template>
                            <el-option
                                v-for="item in sortData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-md-12">
                        <el-table :data="data.data" v-loading="dataLoading" style="width: 100%" stripe border show-summary :summary-method="getSummaries">
                            <el-table-column label="Mã phiếu thu" min-width="70">
                                <template slot-scope="scope">
                                    {{ scope.row.code || 'N/A' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="Thanh toán lúc" min-width="80">
                                <template slot-scope="scope">
                                    <div>
                                        {{ scope.row.createdAt ? $moment(scope.row.createdAt).format('HH:mm') : '' }}
                                    </div>
                                    <div>
                                        {{ scope.row.createdAt ? $moment(scope.row.createdAt).format('DD/MM/YYYY') : '' }}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Số tiền" min-width="80" prop="amount" align="right">
                                <template slot-scope="scope">
                                    {{ (scope.row.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                </template>
                            </el-table-column>
                             <el-table-column label="Hình thức thanh toán" min-width="100">
                                <template slot-scope="scope">
                                    <div style="text-align:center;">
                                        <el-tag v-if="scope.row.methodFee == 'transfer'" type="danger">Chuyển khoản</el-tag>
                                        <el-tag v-if="scope.row.methodFee == 'cash'" type="warning">Tiền mặt</el-tag>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Mã phiếu khám" min-width="80">
                                <template slot-scope="scope">
                                    {{ scope.row.examinationCode || 'N/A' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="Khách hàng" min-width="100">
                                <template slot-scope="scope">
                                    <div>{{ `(${scope.row.customerCode})` || 'N/A' }}</div>
                                    <div>{{ scope.row.customerName || 'N/A' }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Trạng thái" min-width="80">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.status == 'paid'" style="text-align:center;">
                                        <el-tag type="success">Đã thanh toán</el-tag>
                                    </div>
                                    <div v-if="scope.row.status == 'cancelled'" style="text-align:center;">
                                        <el-tooltip class="item" effect="dark" placement="top">
                                            <div slot="content">
                                                <div>Hủy lúc: {{ scope.row.cancelledAt ? $moment(scope.row.cancelledAt).format('HH:mm DD/MM/YYYY') : '' }}</div>
                                                <div class="mt-1">Lý do: {{ scope.row.cancelReason || '' }}</div>
                                            </div>
                                            <el-tag type="info">Đã hủy</el-tag>
                                        </el-tooltip>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Tệp đính kèm" min-width="80">
                                <template slot-scope="scope">
                                    <div v-for="(item, index) in scope.row.attachFiles" :key="index">
                                        <a :href="item" target="_blank" style="font-style:italic;text-decoration:underline!important;">{{ 'Tệp đính kèm ' + (index + 1) }}</a> 
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Ghi chú" min-width="80">
                                <template slot-scope="scope">
                                    {{ scope.row.note || '' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="Thao tác" min-width="60">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.status != 'cancelled'" style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">
                                        <div v-if="checkRight('printReceipts')">
                                            <el-tooltip class="item" effect="dark" content="In phiếu thu" placement="top">
                                                <a class="btn control-btn yellow" style="padding: 4px 6px;" @click="printReceipts(scope.row)">
                                                    <i class='bx bxs-printer'></i>
                                                </a>
                                            </el-tooltip>
                                        </div>
                                        <div v-if="checkRight('cancelReceipts')">
                                            <el-tooltip class="item" effect="dark" content="Hủy phiếu thu" placement="top">
                                                <a class="btn control-btn red" style="padding: 4px 6px;" @click="cancelReceipts(scope.row._id)">
                                                    <i class='bx bx-x'></i>
                                                </a>
                                            </el-tooltip>
                                        </div>
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
                pdf-format="a5"
                pdf-orientation="landscape"
                pdf-content-width="100%"
                ref="html2Pdf_receipt"
            >
                <section slot="pdf-content">
                    <div v-if="receiptsData && receiptsData._id" class="container mt-3" style="color:#000;font-size:13px;">
                        <div class="row">
                            <div class="col-md-2">
                                <el-image
                                    style="width: 100%; height: auto"
                                    src="/images/logoclinic.png"
                                    fit="cover">
                                </el-image>
                            </div>
                            <div class="col-md-10">
                                <div style="font-weight:bold;font-size:16px;">NHA KHOA AN TÂM</div>
                                <div class="row">
                                    <div class="col-md-5">
                                        <div class="mt-3">
                                            <span style="font-weight:bold;">Địa chỉ:</span>
                                            <span>Quận 3, HCM</span>
                                        </div>
                                        <div class="mt-2">
                                            <span style="font-weight:bold;">Số điện thoại:</span>
                                            <span>0703260457</span>
                                        </div>
                                    </div>
                                    <div class="col-md-5">
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
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-md-12 text-center">
                                <div style="font-weight:bold;font-size:20px;">PHIẾU THU</div>
                            </div>
                            <div class="col-md-12 mt-2 text-center">
                                <div class="row">
                                    <div class="col-md-4"></div>
                                    <div class="col-md-4 text-center">Ngày {{$moment(receiptsData.createdAt).format('DD')}} tháng {{$moment(receiptsData.createdAt).format('MM')}} năm {{$moment(receiptsData.createdAt).format('YYYY')}}</div>
                                    <div class="col-md-4 text-right">Mã: {{receiptsData.code}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-md-4 mb-2">
                                <span style="font-weight: bold;">Mã khách hàng: </span>
                                {{ receiptsData.customerCode || '' }}
                            </div>
                            <div class="col-md-4 mb-2">
                                <span style="font-weight: bold;">Họ và tên: </span>
                                {{ receiptsData.customerName || '' }}
                            </div>
                            <div class="col-md-4 mb-2">
                                <span style="font-weight: bold;">Ngày sinh: </span>
                                {{ $moment(receiptsData.customerBirthday).format('DD/MM/YYYY') || '' }}
                            </div>
                            <div class="col-md-4 mb-2">
                                <span style="font-weight: bold;">Giới tính: </span>
                                {{ receiptsData.customerGender == 'male' ? 'Nam' : 'Nữ' || '' }}
                            </div>
                            <div class="col-md-4 mb-2">
                                <span style="font-weight: bold;">CMND/CCCD: </span>
                                {{ receiptsData.customerPhysicalId || '' }}
                            </div>
                            <div class="col-md-4 mb-2">
                                    <span style="font-weight: bold;">Số điện thoại: </span>
                                {{ receiptsData.customerPhone || '' }}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12" style="font-size:14px;font-weight:bold;">
                                <i class='bx bx-check-circle' style="font-size:18px;" ></i>
                                NỘI DUNG
                            </div>
                            <div class="col-md-12 mt-2">
                                <ul class="ml-3">
                                    <li>- Thu phí khám & điều trị theo phiếu khám <span style="font-weight:bold;">{{ receiptsData.examinationCode || 'N/A' }}</span></li>
                                </ul>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-md-12" style="font-size:14px;font-weight:bold;">
                                <i class='bx bx-check-circle' style="font-size:18px;" ></i>
                                THANH TOÁN
                            </div>
                            <div class="col-md-12 ml-2 mt-1">
                                <table class="table table-borderless" style="font-size:14px;margin-bottom:0;">
                                    <tbody>
                                        <tr>
                                            <td style="width:22%;font-weight:bold;padding-top:4px;padding-bottom:4px;">Số tiền thành toán</td>
                                            <td style="width:4%;padding-top:4px;padding-bottom:4px;">:</td>
                                            <td style="width:74%;padding-top:4px;padding-bottom:4px;">
                                                <span>{{ receiptsData.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }} VND</span>
                                                <span style="font-style: italic;">{{ `(${convertAmountToWord(receiptsData.amount)})` }}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="width:22%;font-weight:bold;padding-top:4px;padding-bottom:4px;">Hình thức thanh toán</td>
                                            <td style="width:4%;padding-top:4px;padding-bottom:4px;">:</td>
                                            <td style="width:74%;padding-top:4px;padding-bottom:4px;">
                                                {{ receiptsData.methodFee == 'transfer' ? 'Chuyển khoản' : 'Tiền mặt' }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="width:22%;font-weight:bold;padding-top:4px;padding-bottom:4px;">Ghi chú</td>
                                            <td style="width:4%;padding-top:4px;padding-bottom:4px;">:</td>
                                            <td style="width:74%;padding-top:4px;padding-bottom:4px;">
                                                {{ receiptsData.note || '' }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-md-6" style="text-align:center;">
                                <div>Người thu</div>
                                <div style="font-style:italic;">(Ký và ghi rõ họ tên)</div>
                            </div>
                            <div class="col-md-6" style="text-align:center;">
                                <div>Người nộp</div>
                                <div style="font-style:italic;">(Ký và ghi rõ họ tên)</div>
                            </div>
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
import { intersection } from 'lodash';
import readAmountByWord from '@/utils/functions/readAmountByWord';
export default {
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data() {
        return {
            data: {},
            dataLoading: true,
            currentPage: 1,
            searchQuery: {
                filters: {
                    codeF: '',
                    examinationCodeF: '',
                    customerF: '',
                    dateF: [],
                    statusF: 'paid'
                },
                sorts: -1,
                pages:{
                    from: 0,
                    size: 10
                }
            },
            sortData: [
                {
                    label: 'Thời gian thanh toán giảm dần',
                    value: -1,
                },
                {
                    label: 'Thời gian thanh toán tăng dần',
                    value: 1,
                },
            ],
            receiptsData: {}
        }
    },
    async created() {
        const _this = this;
        //Lấy danh sách dữ liệu
        await _this.getData(_this.searchQuery);
    },
     methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['receipts.all', 'receipts.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        async getData(searchQuery){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/receipts/getByQuery', searchQuery).then(
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
            _this.dataLoading = false;
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
                codeF: '',
                examinationCodeF: '',
                customerF: '',
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
        onChangeSorts(value){
            const _this = this;
            _this.searchQuery.sorts = value;
            _this.getData(_this.searchQuery);
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
            });
            return sums;
        },
        printReceipts(data){
            const _this = this;
            _this.receiptsData = data;
            _this.$refs.html2Pdf_receipt.generatePdf();
        },
        convertAmountToWord(number){
            return readAmountByWord(number);
        },
        async cancelReceipts(id){
            const _this = this;
            _this.
                $prompt('Lý do hủy *', 'Xác nhận hủy phiếu thu', {
                    confirmButtonText: 'Xác nhận',
					cancelButtonText: 'Hủy',
                    type: 'warning',
                    inputPlaceholder: 'Nhập lý do hủy',
                    inputValidator: this.validateInput
                }).then(async ({ value }) => {
                    if (value) {
                        const data = await _this.$axios.$post('/api/receipts/cancel', {
                            id: id,
                            cancelReason: value,
                            cancelledBy: _this.userInfo.data.username
                        });
                        if (data.success) {
                            await _this.getData(_this.searchQuery);
                            _this.$message({
                                message: 'Hủy phiếu thu thành công',
                                type: 'success',
                            });
                            _this.dataLoading = false;
                        } else {
                            _this.$message.error(data.error);
                            _this.dataLoading = false;
                        }
                    }
                    else{
                        _this.dataLoading = false;
                        _this.$message({
                            type: 'error',
                            message: 'Vui lòng nhập lý do hủy',
                        });
                    }
                })
                .catch((error) => {
                    _this.dataLoading = false;
                    console.log(error);
                });
        },
        validateInput (input) {
            if (input) return true;
            else return 'Vui lòng nhập lý do hủy.';
        },
    }
}
</script>