<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Quản lý phiếu chi</div>
                    </div>
                </div>
                <div class="row" style="margin-top: 9px;">
                    <div class="col-md-4 col-lg-3">
                        <div class="col-form-label">Mã phiếu chi</div>
                        <el-input placeholder="Mã phiếu chi..." v-model="searchQuery.filters.codeF" name="codeF"></el-input>
                    </div>
                    <div class="col-md-4 col-lg-3">
                        <div class="col-form-label">Ngày tạo</div>
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
                            <el-option label="Tất cả..." value="all"></el-option>
                            <el-option label="Mới" value="new"></el-option>
                            <el-option label="Hoàn tất" value="completed"></el-option>
                        </el-select>
                    </div>
                    <!-- <div class="col-md-4 col-lg-2">
                        <div class="col-form-label">Loại</div>
                        <el-select v-model="searchQuery.filters.typeF" placeholder="Trạng thái..." name="typeF">
                            <el-option label="Tất cả..." value="all"></el-option>
                            <el-option label="Thuốc men" value="medicine"></el-option>
                            <el-option label="Khác" value="other"></el-option>
                        </el-select>
                    </div> -->
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
                    <div class="col-md-2">
                        <el-dropdown :hide-on-click="false" trigger="click" style="width:100%;">
                            <el-button class="elButtonCustom" style="width:100%; text-align:left;font-weight:400;padding:12px 10px">
                                <i class="el-icon-view el-icon--left" style="color:#C0C4CC;"></i>
                                Ẩn hiện cột
                                <i class="el-icon-arrow-down el-icon--right" style="float:right;color:#C0C4CC;"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="item in columns" :key="item.name">
                                    <el-checkbox v-model="item.isShow">{{ item.name }}</el-checkbox>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="col-md-7">
                        <div style="display: flex; height: 100%; align-items: end; justify-content: right;">
                            <button v-if="(checkRight('create'))" class="control-btn blue" @click="openCreateDialog()">
                                <i class='bx bx-plus' ></i>
                                Tạo phiếu chi
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-md-12">
                        <el-table :data="data.data" v-loading="dataLoading" style="width: 100%" stripe border show-summary :summary-method="getSummaries">
                            <el-table-column v-if="columns[0].isShow" label="Mã phiếu chi" min-width="100">
                                <template slot-scope="scope">
                                    {{ scope.row.code || 'N/A' }}
                                </template>
                            </el-table-column>
                            <el-table-column v-if="columns[1].isShow" label="Ngày chi" min-width="100">
                                <template slot-scope="scope">
                                        {{ scope.row.date ? $moment(scope.row.date).format('DD/MM/YYYY') : '' }}
                                </template>
                            </el-table-column>
                            <el-table-column v-if="columns[2].isShow" label="Số tiền" min-width="100" prop="amount" align="right">
                                <template slot-scope="scope">
                                    {{ (scope.row.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                </template>
                            </el-table-column>
                            <el-table-column v-if="columns[3].isShow" label="Đơn vị nhận tiền" min-width="150">
                                <template slot-scope="scope">
                                    <div>
                                        <i class='bx bx-user'></i>
                                        {{ scope.row.receivingUnit || '' }}
                                    </div>
                                    <div>
                                        <i class='bx bx-location-plus' ></i>
                                        {{ scope.row.addressUnit || '' }}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="columns[4].isShow" label="Chứng từ gốc" min-width="150">
                                <template slot-scope="scope">
                                    <div v-for="(item, index) in scope.row.originalDocuments" :key="index">
                                        <span style="font-family:Wingdings">&#118;</span>
                                        {{ item }}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="columns[5].isShow" label="Nội dung" min-width="150">
                                <template slot-scope="scope">
                                    {{ scope.row.content || '' }}
                                </template>
                            </el-table-column>
                            <el-table-column v-if="columns[6].isShow" label="Trạng thái" min-width="100">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.status == 'new'" style="text-align:center;">
                                        <el-tag>Mới</el-tag>
                                    </div>
                                    <div v-if="scope.row.status == 'completed'" style="text-align:center;">
                                        <el-tag type="success">Hoàn tất</el-tag>
                                    </div>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column v-if="columns[4].isShow" label="Loại" min-width="100">
                                <template slot-scope="scope">
                                    {{ scope.row.type == 'medicine' ? 'Thuốc men' : 'Khác' }}
                                </template>
                            </el-table-column> -->
                            <el-table-column v-if="columns[7].isShow" label="Thao tác" min-width="80">
                                <template slot-scope="scope">
                                    <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">
                                        <div v-if="checkRight('update')">
                                            <el-tooltip class="item" effect="dark" content="Cập nhật" placement="top">
                                                <a class="btn control-btn blue2" style="padding: 4px 6px;" @click="edit(scope.row)">
                                                    <i class="el-icon-edit-outline"></i>
                                                </a>
                                            </el-tooltip>
                                        </div>
                                        <div v-if="(checkRight('update') && scope.row.status == 'new')">
                                            <el-tooltip class="item" effect="dark" content="Chỉnh sửa chứng từ gốc" placement="top">
                                                <a class="btn control-btn blue" style="padding: 4px 6px;" @click="editOriginalDocuments(scope.row)">
                                                    <i class='bx bxs-note' ></i>
                                                </a>
                                            </el-tooltip>
                                        </div>
                                        <div v-if="(checkRight('print') && scope.row.status == 'completed')">
                                            <el-tooltip class="item" effect="dark" content="In phiếu chi" placement="top">
                                                <a class="btn control-btn yellow" style="padding: 4px 6px;" @click="printPayment(scope.row)">
                                                    <i class='bx bxs-printer'></i>
                                                </a>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="columns[8].isShow" label="Tạo bởi-lúc" min-width="150">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.createdBy || 'System' }}</div>
                                    <div>{{ scope.row.createdAt ? $moment(scope.row.createdAt).format('HH:mm DD/MM/YYYY') : '' }}</div>
								</template>
                            </el-table-column>
                            <el-table-column v-if="columns[9].isShow" label="Cập nhật bởi-lúc" min-width="150">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.updatedBy || '' }}</div>
                                    <div>{{ scope.row.updatedAt ? $moment(scope.row.updatedAt).format('HH:mm DD/MM/YYYY') : '' }}</div>
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
            <!-- Dialog tạo phiếu chi -->
            <el-dialog title="Tạo phiếu chi" :visible.sync="dialogPayment.visible" :close-on-click-modal="false" width="40%">
                <form class="row" v-on:submit.prevent="submitCreatePayment">
                    <div class="col-md-12">
                        <div class="col-form-label">Đơn vị nhận tiền *</div>
                        <el-input
                            name="receivingUnit"
                            placeholder="Đơn vị nhận tiền"
                            v-model="dialogPayment.data.receivingUnit"
                        >
                        </el-input>
                    </div>
                    <div class="col-md-12">
                        <div class="col-form-label">Địa chỉ đơn vị</div>
                        <el-input
                            name="addressUnit"
                            placeholder="Địa chỉ đơn vị"
                            v-model="dialogPayment.data.addressUnit"
                        >
                        </el-input>
                    </div>
                    <div class="col-md-12">
                        <div class="col-form-label">Số tiền chi *</div>
                        <vue-autonumeric
                            v-model="dialogPayment.data.amount"
                            class="el-input__inner"
                            placeholder="Số tiền chi"
                            :options="{
                                decimalPlaces: 0,
                                digitGroupSeparator: ',',
                                decimalCharacter: '.',
                                decimalCharacterAlternative: '.',
                                currencySymbol: '\u00a0VND',
                                currencySymbolPlacement: 's',
                                roundingMethod: 'U',
                                minimumValue: '0',
                            }"
                        ></vue-autonumeric>
                    </div>
                    <div class="col-md-12">
                        <div class="col-form-label">Chứng từ gốc</div>
                        <el-select
                            v-model="dialogPayment.data.originalDocuments"
                            multiple
                            class="w-100"
                            filterable
                            allow-create
                            default-first-option
                            placeholder="Chứng từ gốc"
                        >
                        </el-select>
                    </div>
                    <div class="col-md-12">
                        <div class="col-form-label">Nội dung chi *</div>
                        <el-input
                            type="textarea"
                            placeholder="Nội dung chi"
                            v-model="dialogPayment.data.content"
                            :rows="8"
                        >
                        </el-input>
                    </div>
                </form>
                <span slot="footer" class="dialog-footer">
                    <button type="button" class="control-btn gray" @click="dialogPayment.visible = false">
                        <i class='bx bx-x'></i>
                        <span>Đóng</span>
                    </button>
                    <button
                        type="button" 
                        class="control-btn green"
                        @click="submitCreatePayment"
                        v-if="(checkRight('create'))"
                    >
                        <i class='bx bx-save' ></i>
                        <span>Lưu</span>
                    </button>
                </span>
            </el-dialog>
            <!-- Dialog edit -->
            <el-dialog title="Phiếu chi" :visible.sync="dialogEdit.visible" :close-on-click-modal="false" width="50%">
                <form class="row" v-on:submit.prevent="submitEditPayment">
                    <div class="col-md-6">
                        <div class="col-form-label">Mã phiếu chi</div>
                        <el-input 
                            name="code"
                            placeholder="Mã phiếu chi"
                            v-model="dialogEdit.data.code"
                            readonly
                        ></el-input>
                    </div>
                    <div class="col-md-6">
                        <div class="col-form-label">Trạng thái</div>
                        <el-input 
                            name="status"
                            placeholder="Trạng thái"
                            :value="dialogEdit.data.status == 'completed' ? 'Hoàn tất' : 'Mới'"
                            readonly
                        ></el-input>
                    </div>
                    <div class="col-md-6">
                        <div class="col-form-label">Đơn vị nhận tiền</div>
                        <el-input 
                            name="receivingUnit"
                            placeholder="Đơn vị nhận tiền"
                            v-model="dialogEdit.data.receivingUnit"
                            readonly
                        ></el-input>
                    </div>
                    <div class="col-md-6">
                        <div class="col-form-label">Địa chỉ</div>
                        <el-input 
                            name="addressUnit"
                            placeholder="Địa chỉ"
                            v-model="dialogEdit.data.addressUnit"
                            readonly
                        ></el-input>
                    </div>
                    <div class="col-md-6">
                        <div class="col-form-label">Số tiền chi</div>
                        <vue-autonumeric
                            v-model="dialogEdit.data.amount"
                            class="el-input__inner"
                            placeholder="Số tiền chi"
                            disabled
                            :options="{
                                decimalPlaces: 0,
                                digitGroupSeparator: ',',
                                decimalCharacter: '.',
                                decimalCharacterAlternative: '.',
                                currencySymbol: '\u00a0VND',
                                currencySymbolPlacement: 's',
                                roundingMethod: 'U',
                                minimumValue: '0',
                            }"
                        ></vue-autonumeric>
                    </div>
                    <div class="col-md-6">
                        <div class="col-form-label">Ngày chi</div>
                        <el-date-picker
                            v-model="dialogEdit.data.date"
                            type="date"
                            name="date"
                            format="dd/MM/yyyy"
                            placeholder="Ngày/tháng/năm"
                            readonly
                        ></el-date-picker>
                    </div>
                    <div class="col-md-12">
                        <div class="col-form-label">Chứng từ gốc</div>
                        <el-select
                            v-model="dialogEdit.data.originalDocuments"
                            multiple
                            class="w-100"
                            filterable
                            allow-create
                            default-first-option
                            placeholder="Chứng từ gốc"
                            disabled
                        >
                        </el-select>
                    </div>
                    <div class="col-md-12">
                        <div class="col-form-label">Nội dung</div>
                        <el-input
                            type="textarea"
                            placeholder="Nội dung chi"
                            v-model="dialogEdit.data.content"
                            :rows="6"
                            readonly
                        >
                        </el-input>
                    </div>
                </form>
                <span slot="footer" class="dialog-footer">
                    <button type="button" class="control-btn gray" @click="dialogEdit.visible = false">
                        <i class='bx bx-x'></i>
                        <span>Đóng</span>
                    </button>
                    <button
                        type="button" 
                        class="control-btn green"
                        @click="submitEditPayment"
                        v-if="(checkRight('update') && dialogEdit.data.status == 'new')"
                    >
                        <i class='bx bx-save' ></i>
                        <span>Hoàn tất</span>
                    </button>
                    <button
                        type="button" 
                        class="control-btn yellow"
                        @click="printPayment(dialogEdit.data)"
                        v-if="(checkRight('print') && dialogEdit.data.status == 'completed')"
                    >
                        <i class='bx bx-save' ></i>
                        <span>In phiếu chi</span>
                    </button>
                </span>
            </el-dialog>
            <!-- Dialog chỉnh sửa chứng từ gốc -->
            <el-dialog :title="`Phiếu chi | ${dialogEditOriginalDocuments.data.code}`" :visible.sync="dialogEditOriginalDocuments.visible" :close-on-click-modal="false" width="40%">
                <div class="row">
                    <div class="col-md-12">
                        <div class="col-form-label">Chứng từ gốc</div>
                        <el-select
                            v-model="dialogEditOriginalDocuments.data.originalDocuments"
                            multiple
                            class="w-100"
                            filterable
                            allow-create
                            default-first-option
                            placeholder="Chứng từ gốc"
                        >
                        </el-select>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <button type="button" class="control-btn gray" @click="dialogEditOriginalDocuments.visible = false">
                        <i class='bx bx-x'></i>
                        <span>Đóng</span>
                    </button>
                    <button
                        type="button" 
                        class="control-btn green"
                        @click="submitEditOriginalDocuments"
                        v-if="(checkRight('update') && dialogEditOriginalDocuments.data.status == 'new')"
                    >
                        <i class='bx bx-save' ></i>
                        <span>Lưu</span>
                    </button>
                </span>
            </el-dialog>
            <!-- Template pdf -->
            <vue-html2pdf 
                class="print-content"
                id="print-content-pdf"
                :show-layout="false"
                :float-layout="true"
                :preview-modal="true"
                :enable-download="false"
                :paginate-elements-by-height="1500"
                :filename="'paymentForm'"
                :pdf-quality="2"
                :manual-pagination="false"
                pdf-format="a5"
                pdf-orientation="landscape"
                pdf-content-width="100%"
                ref="html2Pdf_payment"
            >
                <section slot="pdf-content">
                    <div v-if="printData && printData._id" class="container mt-3" style="color:#000;font-size:13px;">
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
                                        <div class="mt-2">
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
                                <div style="font-weight:bold;font-size:20px;">PHIẾU CHI</div>
                            </div>
                            <div class="col-md-12 mt-2 text-center">
                                <div class="row">
                                    <div class="col-md-4"></div>
                                    <div class="col-md-4 text-center">Ngày {{$moment(printData.date).format('DD')}} tháng {{$moment(printData.date).format('MM')}} năm {{$moment(printData.date).format('YYYY')}}</div>
                                    <div class="col-md-4 text-right">Mã: {{printData.code}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-md-12 mb-3">
                                <span style="font-weight: bold;">Đơn vị nhận tiền: </span>
                                {{ printData.receivingUnit || '' }}
                            </div>
                            <div class="col-md-12 mb-3">
                                <span style="font-weight: bold;">Địa chỉ: </span>
                                {{ printData.addressUnit || '' }}
                            </div>
                            <div class="col-md-12 mb-3">
                                <span style="font-weight: bold;">Nội dung chi: </span>
                                {{ printData.content || '' }}
                            </div>
                            <div class="col-md-4 mb-3">
                                <span style="font-weight: bold;">Số tiền: </span>
                                <span>{{ printData.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')  }} VND</span>
                            </div>
                            <div class="col-md-8 mb-3">
                                <span style="font-weight: bold;font-style: italic;">(Viết bằng chữ): </span>
                                <span style="font-style: italic;">{{ `(${convertAmountToWord(printData.amount)})` }}</span>
                            </div>
                            <div class="col-md-4 mb-3">
                                <span style="font-weight: bold;">Kèm theo: </span>
                                {{ printData.originalDocuments.length || 0 }}
                            </div>
                            <div class="col-md-8 mb-3">
                                <span style="font-weight: bold;">Chứng từ gốc: </span>
                                {{ printData.originalDocuments.join(', ') || '' }}
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-md-4" style="text-align:center;">
                                <div>Chủ phòng khám</div>
                                <div style="font-style:italic;">(Ký và ghi rõ họ tên)</div>
                            </div>
                            <div class="col-md-4" style="text-align:center;">
                                <div>Kế toán</div>
                                <div style="font-style:italic;">(Ký và ghi rõ họ tên)</div>
                            </div>
                            <div class="col-md-4" style="text-align:center;">
                                <div>Đơn vị nhận tiền</div>
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
import { debounce, cloneDeep, intersection } from 'lodash';
import readAmountByWord from '@/utils/functions/readAmountByWord';
import { columns } from '@/utils/filter/payment';
import PaymentSlip from '@/models/tw_PaymentSlip';
import VueAutonumeric from 'vue-autonumeric';
export default {
    components: {
        'vue-autonumeric': VueAutonumeric,
    },
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data(){
        return {
            data: {},
            dataLoading: true,
            currentPage: 1,
            columns: columns,
            searchQuery: {
                filters: {
                    codeF: '',
                    dateF: [],
                    statusF: 'new',
                    typeF: 'all',
                },
                sorts: 'createdAt&&-1',
                pages:{
                    from: 0,
                    size: 10
                }
            },
            sortData: [
                {
                    label: 'Thời gian tạo giảm dần',
                    value: 'createdAt&&-1',
                },
                {
                    label: 'Thời gian tạo tăng dần',
                    value: 'createdAt&&1',
                },
                {
                    label: 'Thời gian chi giảm dần',
                    value: 'date&&-1',
                },
                {
                    label: 'Thời gian chi tăng dần',
                    value: 'date&&1',
                },
            ],
            dialogPayment: {
                visible: false,
                data: {}
            },
            dialogEdit: {
                visible: false,
                data: {}
            },
            printData: new PaymentSlip(),
            dialogEditOriginalDocuments: {
                visible: false,
                data: {}
            },
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
			const values = ['payment.all', 'payment.' + right];
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
                codeF: '',
                dateF: [],
                statusF: 'new',
                typeF: 'all',
            }
            _this.searchQuery.pages.from = 0;
            _this.currentPage = 1;
            _this.getData(_this.searchQuery);
        },
        onChangeSorts(value){
            const _this = this;
            _this.searchQuery.sorts = value;
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
            await _this.$axios.$post('/api/paymentSlip/getByQuery', searchQuery).then(
                (response) => {
                    _this.data = response;
                },
                (error) => {
                    console.log('Error: ', error);
                    _this.$message({
                        type: 'error',
                        message: error,
                    });
                }
            );
            _this.dataLoading = false;
        },
        openCreateDialog(){
            const _this = this;
            _this.dialogPayment.data = new PaymentSlip();
            _this.dialogPayment.visible = true;
        },
        submitCreatePayment: debounce(async function (){
            const _this = this;
            try{
                _this.dialogPayment.data.createdBy = _this.userInfo.data.username;
                var newData = cloneDeep(_this.dialogPayment.data);
                const data = await _this.$axios.$post('/api/paymentSlip/create', newData);
                if (data.success) {
                    _this.$message({
                        message: data.message,
                        type: 'success',
                    });
                    _this.dialogPayment.visible = false;
                    _this.dialogPayment.data = new PaymentSlip();
                    _this.getData(_this.searchQuery);
                } else {
                    _this.$message.error(data.error);
                }
            }
            catch(error){
                console.log('Error: ', error);
                _this.$message({
                    type: 'error',
                    message: error,
                });
            }
        }),
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
        async edit(data){
            const _this = this;
            if(data){
                await _this.$axios.$get(`/api/paymentSlip/getById/${data._id}`).then(
                    (response) => {
                        _this.dialogEdit.data = response.data || new PaymentSlip();
                        if(_this.dialogEdit.data.status == 'new'){
                            _this.dialogEdit.data.date = new Date();
                        }
                        _this.dialogEdit.visible = true;
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
        submitEditPayment: debounce(async function (){
            const _this = this;
            _this
                .$confirm(`Bạn có chắc muốn hoàn tất phiếu chi này?`, 'Xác nhận', {
					confirmButtonText: 'Xác nhận',
					cancelButtonText: 'Hủy',
					type: 'warning',
				})
                .then(async () => {
                    try{
                        _this.dataLoading = true;
                        _this.dialogEdit.data.updatedBy = _this.userInfo.data.username;
                        var newData = cloneDeep(_this.dialogEdit.data);
                        const data = await _this.$axios.$post('/api/paymentSlip/complete', newData);
                        if (data.success) {
                            _this.$message({
                                message: data.message,
                                type: 'success',
                            });
                            // _this.dialogEdit.visible = false;
                            _this.dialogEdit.data = data.data || new PaymentSlip(),
                            _this.getData(_this.searchQuery);
                            setTimeout(async function () {
                                _this.printPayment(data.data);
                            }, 200);
                        } else {
                            _this.$message.error(data.error);
                        }
                        _this.dataLoading = false;
                    }
                    catch (e){
                        console.log(e);
                        _this.$message.error(e);
                        _this.dataLoading = false;
                    }
                });
        }),
        printPayment(data){
            const _this = this;
            _this.printData = data;
            _this.$refs.html2Pdf_payment.generatePdf();
        },
        convertAmountToWord(number){
            return readAmountByWord(number);
        },
        async editOriginalDocuments(data){
            const _this = this;
            if(data){
                await _this.$axios.$get(`/api/paymentSlip/getById/${data._id}`).then(
                    (response) => {
                        _this.dialogEditOriginalDocuments.data = response.data || new PaymentSlip();
                        _this.dialogEditOriginalDocuments.visible = true;
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
        async submitEditOriginalDocuments(){
            const _this = this;
            if(_this.dialogEditOriginalDocuments.data && _this.dialogEditOriginalDocuments.data._id){
                _this.dataLoading = true;
                try{
                    const data = await _this.$axios.$post('/api/paymentSlip/updateOriginalDocuments', {
                        id: _this.dialogEditOriginalDocuments.data._id,
                        originalDocuments: _this.dialogEditOriginalDocuments.data.originalDocuments,
                        updatedBy: _this.userInfo.data.username
                    });
                    if (data.success) {
                        _this.dialogEditOriginalDocuments.data = new PaymentSlip();
                        _this.dialogEditOriginalDocuments.visible = false;
                        await _this.getData(_this.searchQuery);
                        _this.$message({
                            message: 'Cập nhật thành công',
                            type: 'success',
                        });
                    } else {
                        _this.$message.error(data.error);
                    }
                }
                catch(err){
                    console.log(error);
                    _this.$message.error(error);
                }
                _this.dataLoading = false;
            }
        }
    }
}
</script>