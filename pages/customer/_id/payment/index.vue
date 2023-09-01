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
                    <button type="button" class="control-btn green" @click="searchData()" style="margin-top:34px;">
                        <i class='bx bx-search'></i>
                        Tìm
                    </button>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-md-12">
                    <el-table :data="data.data" v-loading="dataLoading" style="width:100%" max-height="385" stripe border show-summary :summary-method="getSummaries">
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
                                    <div>
                                        <el-tooltip class="item" effect="dark" content="Chi tiết thanh toán" placement="top">
                                            <a class="btn control-btn yellow" style="padding: 4px 6px;" @click="viewDetailPayment(scope.row)">
                                            <i class='bx bxs-detail'></i>
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

            <el-dialog
                :visible.sync='paymentDialog.visible'
                title="Ghi nhận thanh toán"
                :close-on-click-modal="false"
                width="70%"
            >
                <form v-if="paymentDialog.data" class="container" v-on:submit.prevent="confirmPayment" v-loading="dataLoading">
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
                                    {{'(' + paymentDialog.data.customerCode + ') ' + paymentDialog.data.customerName}}
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
                                    Trạng thái thanh toán
                                </div>
                                <div class="col-md-8 pt-2 pb-2" style="font-weight:bold;">
                                    <div v-if="paymentDialog.data.status == 'unpaid'">Chưa thanh toán</div>
                                    <div v-if="paymentDialog.data.status == 'partialPaid'">Thanh toán một phần</div>
                                    <div v-if="paymentDialog.data.status == 'paid'">Đã thanh toán</div>
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
                                            <div class="inputTextRight">
                                                <vue-autonumeric
                                                    v-model="paymentDialog.receiptData.remainAmount"
                                                    class="el-input__inner"
                                                    placeholder="Số tiền còn lại"
                                                    readonly
                                                    :options="{
                                                        decimalPlaces: 0,
                                                        digitGroupSeparator: ',',
                                                        decimalCharacter: '.',
                                                        decimalCharacterAlternative: '.',
                                                        currencySymbol: '\u00a0VND',
                                                        currencySymbolPlacement: 's',
                                                        roundingMethod: 'U',
                                                        minimumValue: '0',
                                                        emptyInputBehavior: '0'
                                                    }"
                                                ></vue-autonumeric>
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="col-form-label">Số tiền thanh toán *</div>
                                            <div class="inputTextRight">
                                                <vue-autonumeric
                                                    class="el-input__inner"
                                                    name="receiptAmount"
                                                    placeholder="Số tiền thanh toán"
                                                    v-model="paymentDialog.receiptData.paidAmount"
                                                    @change.native="handleChangeReceiptAmount"
                                                    :options="{
                                                        decimalPlaces: 0,
                                                        digitGroupSeparator: ',',
                                                        decimalCharacter: '.',
                                                        decimalCharacterAlternative: '.',
                                                        currencySymbol: '\u00a0VND',
                                                        currencySymbolPlacement: 's',
                                                        roundingMethod: 'U',
                                                        minimumValue: '0',
                                                        emptyInputBehavior: '0'
                                                    }"
                                                ></vue-autonumeric>
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="col-form-label">Hình thức thanh toán *</div>
                                            <el-select v-model="paymentDialog.receiptData.methodFee" placeholder="Hình thức thanh toán" name="methodFee">
                                                <el-option label="Tiền mặt" value="cash"></el-option>
                                                <el-option label="Chuyển khoản" value="transfer"></el-option>
                                            </el-select>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="col-form-label">Ghi chú</div>
                                            <el-input type="textarea" :rows="4" placeholder="Ghi chú" v-model="paymentDialog.receiptData.note"></el-input>
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
                </form>
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

            <el-dialog
                :visible.sync='detailPaymentDialog.visible'
                title="Thông tin chi tiết thanh toán"
                :close-on-click-modal="false"
                width="70%"
            >
                <div v-if="detailPaymentDialog.data" class="container">
                    <div class="row">
                        <div style="font-weight:bold;font-size:16px;">Thông tin chung</div>
                        <div class="col-md-12 mt-3" style="background-color: #f8f8f8;">
                            <div class="row" style="border-bottom: dotted 1px #ddd;">
                                <div class="col-md-4 pt-2 pb-2">
                                    Mã phiếu khám
                                </div>
                                <div class="col-md-8 pt-2 pb-2" style="font-weight:bold;">
                                    {{detailPaymentDialog.data.examinationCode}}
                                </div>
                            </div>
                            <div class="row" style="border-bottom: dotted 1px #ddd;">
                                <div class="col-md-4 pt-2 pb-2">
                                    Khách hàng
                                </div>
                                <div class="col-md-8 pt-2 pb-2" style="font-weight:bold;">
                                    {{'(' + detailPaymentDialog.data.customerCode + ') ' + detailPaymentDialog.data.customerName}}
                                </div>
                            </div>
                            <div class="row" style="border-bottom: dotted 1px #ddd;">
                                <div class="col-md-4 pt-2 pb-2">
                                    Ngày lập phiếu thu
                                </div>
                                <div class="col-md-8 pt-2 pb-2" style="font-weight:bold;">
                                    {{ detailPaymentDialog.data.createdAt ? $moment(detailPaymentDialog.data.createdAt).format('DD/MM/YYYY') : '' }}
                                </div>
                            </div>
                            <div class="row" style="border-bottom: dotted 1px #ddd;">
                                <div class="col-md-4 pt-2 pb-2">
                                    Số tiền
                                </div>
                                <div class="col-md-8 pt-2 pb-2" style="font-weight:bold;">
                                    {{ (detailPaymentDialog.data.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }}
                                </div>
                            </div>
                            <div class="row" style="border-bottom: dotted 1px #ddd;">
                                <div class="col-md-4 pt-2 pb-2">
                                    Đã thanh toán
                                </div>
                                <div class="col-md-8 pt-2 pb-2" style="font-weight:bold;">
                                    {{ (detailPaymentDialog.data.paidAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }}
                                </div>
                            </div>
                            <div class="row" style="border-bottom: dotted 1px #ddd;">
                                <div class="col-md-4 pt-2 pb-2">
                                    Còn lại
                                </div>
                                <div class="col-md-8 pt-2 pb-2" style="font-weight:bold;">
                                    {{ (detailPaymentDialog.data.remainAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }}
                                </div>
                            </div>
                            <div class="row" style="border-bottom: dotted 1px #ddd;">
                                <div class="col-md-4 pt-2 pb-2">
                                    Trạng thái thanh toán
                                </div>
                                <div class="col-md-8 pt-2 pb-2" style="font-weight:bold;">
                                    <div v-if="detailPaymentDialog.data.status == 'unpaid'">Chưa thanh toán</div>
                                    <div v-if="detailPaymentDialog.data.status == 'partialPaid'">Thanh toán một phần</div>
                                    <div v-if="detailPaymentDialog.data.status == 'paid'">Đã thanh toán</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div style="font-weight:bold;font-size:16px;">Chi tiết thanh toán</div>
                        <div class="col-md-12 mt-3 pl-0 pr-0">
                            <el-table :data="detailPaymentDialog.receiptsData" style="width: 100%" stripe border show-summary :summary-method="getSummariesForDetail">
                                <el-table-column label="Ngày thanh toán" min-width="100">
                                    <template slot-scope="scope">
                                        <div>{{ scope.row.createdAt ? $moment(scope.row.createdAt).format('DD/MM/YYYY') : '' }}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Số tiền thanh toán" min-width="100" prop="amount" align="right">
                                    <template slot-scope="scope">
                                        {{ (scope.row.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="Hình thức thanh toán" min-width="100">
                                    <template slot-scope="scope">
                                        <div style="text-align:center;">
                                            <el-tag v-if="scope.row.methodFee == 'transfer'" type="success">Chuyển khoản</el-tag>
                                            <el-tag v-if="scope.row.methodFee == 'cash'" type="warning">Tiền mặt</el-tag>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Tệp đính kèm" min-width="100">
                                    <template slot-scope="scope">
                                        <div v-for="(item, index) in scope.row.attachFiles" :key="index">
                                            <a :href="item" target="_blank" style="font-style:italic;text-decoration:underline!important;">{{ 'Tệp đính kèm ' + (index + 1) }}</a> 
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Ghi chú" min-width="100">
                                    <template slot-scope="scope">
                                        {{ scope.row.note || '' }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="Thao tác" min-width="50">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item" effect="dark" content="In phiếu thu" placement="top">
                                            <a class="btn control-btn yellow" style="padding: 4px 6px;" @click="printReceipts(scope.row)">
                                                <i class='bx bxs-printer'></i>
                                            </a>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <button type="button" class="control-btn gray" @click="detailPaymentDialog.visible = false">
                        <i class='bx bx-x'></i>
                        <span>Đóng</span>
                    </button>
                </span>
            </el-dialog>

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
                                <img style="width:100%;height:auto;object-fit: cover;" :src="informationConfig.img" crossorigin="anonymous" />
                            </div>
                            <div class="col-md-10">
                                <div style="font-weight:bold;font-size:16px;text-transform: uppercase;">{{ informationConfig.name }}</div>
                                <div class="row">
                                    <div class="col-md-5">
                                        <div class="mt-2">
                                            <span style="font-weight:bold;">Số điện thoại:</span>
                                            <span>{{ informationConfig.phone }}</span>
                                        </div>
                                        <div class="mt-2">
                                            <span style="font-weight:bold;">Địa chỉ:</span>
                                            <span>{{ informationConfig.address }}</span>
                                        </div>
                                    </div>
                                    <div class="col-md-5">
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
                                    <li>- Thu phí khám & điều trị theo phiếu khám <span style="font-weight:bold;">{{ receiptsData.code || 'N/A' }}</span></li>
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
    </LeftMenu>
</template>

<script>
import { mapState } from 'vuex';
import LeftMenu from '@/components/customer/LeftMenu';
import { cloneDeep, debounce, intersection, remove } from 'lodash';
import Customer from '@/models/tw_Customer';
import Payment from '@/models/tw_Payment';
import VueAutonumeric from 'vue-autonumeric';
import buildFormData from '@/utils/buildFormData';
import readAmountByWord from '@/utils/functions/readAmountByWord';
export default {
    components: {
		LeftMenu,
        'vue-autonumeric': VueAutonumeric,
	},
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
            informationConfig: (state) => state.informationConfig,
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
                receiptData: null,
            },
            receiptsData: {},
            detailPaymentDialog: {
                visible: false,
                data: null,
                receiptsData: []
            },
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
        searchData(){
            const _this = this;
            _this.currentPage = 1;
            _this.searchQuery.pages.from = 0;
            _this.getData(_this.searchQuery)
        },
        refreshData(){
            const _this = this;
            _this.searchQuery.filters = {
                examinationCodeF: '',
                statusF: [],
                createdAtF: [],
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
                await _this.$axios.$post('/api/payment/getByQuery', searchQuery).then(
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
        viewPayment(data){
            const _this = this;
            if (_this.$refs.uploadFiles) {
                _this.$refs.uploadFiles.clearFiles();
            }
            _this.paymentDialog.data = data;
            _this.paymentDialog.receiptData = {
                paidAmount: 0,
                remainAmount: data.remainAmount,
                methodFee: '',
                note: '',
                files: [],
            };
            _this.paymentDialog.visible = true;
        },
        async confirmPayment(){
            const _this = this;
            _this.dataLoading = true;
            const files = _this.$refs.uploadFiles.uploadFiles;
            var receiptData = _this.paymentDialog.receiptData;
            if (files && files.length > 0) {
                files.forEach(element => {
                    receiptData.files.push(element.raw);
				});
            }
            receiptData.paymentId = _this.paymentDialog.data._id;
            receiptData.updatedBy = _this.userInfo.data.username;
            var oldData = cloneDeep(receiptData);
            var newData = new FormData();
            buildFormData(newData, oldData);
            const data = await _this.$axios.$post('/api/payment/confirmPayment', newData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (data.success) {
                _this.paymentDialog.visible = false;
                if (_this.$refs.uploadFiles) {
                    _this.$refs.uploadFiles.clearFiles();
                }
                await _this.getData(_this.searchQuery);
                _this.$message({
                    message: data.message,
                    type: 'success',
                });
                setTimeout(async() => {
                    if(data.receiptsData) {
                        await _this.printReceipts(data.receiptsData);
                    }
                }, 200);
            } else {
                _this.$message.error(data.error);
            }
            _this.dataLoading = false;
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
        handleChangeReceiptAmount(){
            const _this = this;
            if(_this.paymentDialog.receiptData.paidAmount > _this.paymentDialog.data.remainAmount){
                _this.paymentDialog.receiptData.paidAmount = _this.paymentDialog.data.remainAmount;
            }
            _this.paymentDialog.receiptData.remainAmount = _this.paymentDialog.data.remainAmount - _this.paymentDialog.receiptData.paidAmount;
        },
        async printReceipts(data){
            const _this = this;
            _this.receiptsData = data;
            _this.$refs.html2Pdf_receipt.generatePdf();
        },
        async viewDetailPayment(data){
            const _this = this;
            if(data && data._id){
                await _this.$axios.$get(`/api/receipts/getReceiptsByPaymentId/${data._id}`).then(
                    async (response) => {
                        _this.detailPaymentDialog.receiptsData = response.data || [];
                        _this.detailPaymentDialog.data = data;
                        _this.detailPaymentDialog.visible = true;
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
        getSummariesForDetail(param){
            const { columns, data } = param;
			const _this = this;
            let sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = 'Tổng';
                    return;
                }
                if (index === 1) {
                    const values = data.map(item => Number(item[column.property]));
                    var total = values.reduce((partialSum, a) => partialSum + a, 0);
                    var totalString = (total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
                    sums[index] = totalString;
                    return;
                }
            });
            return sums;
        },
        convertAmountToWord(number){
            return readAmountByWord(number);
        }
    }
}
</script>