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
                        <div class="col-form-label">Ngày chi</div>
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
                    <div class="col-md-4 col-lg-2">
                        <div class="col-form-label">Loại</div>
                        <el-select v-model="searchQuery.filters.typeF" placeholder="Trạng thái..." name="typeF">
                            <el-option label="Tất cả..." value="all"></el-option>
                            <el-option label="Thuốc men" value="medicine"></el-option>
                            <el-option label="Khác" value="other"></el-option>
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
                            <el-table-column v-if="columns[3].isShow" label="Trạng thái" min-width="100">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.status == 'new'" style="text-align:center;">
                                        <el-tag>Mới</el-tag>
                                    </div>
                                    <div v-if="scope.row.status == 'completed'" style="text-align:center;">
                                        <el-tag type="success">Hoàn tất</el-tag>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="columns[4].isShow" label="Loại" min-width="100">
                                <template slot-scope="scope">
                                    {{ scope.row.type == 'medicine' ? 'Thuốc men' : 'Khác' }}
                                </template>
                            </el-table-column>
                            <el-table-column v-if="columns[5].isShow" label="Nội dung" min-width="150">
                                <template slot-scope="scope">
                                    {{ scope.row.content || '' }}
                                </template>
                            </el-table-column>
                            <el-table-column v-if="columns[6].isShow" label="Thao tác" min-width="80">

                            </el-table-column>
                            <el-table-column v-if="columns[7].isShow" label="Tạo bởi-lúc" min-width="150">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.createdBy || 'System' }}</div>
                                    <div>{{ scope.row.createdAt ? $moment(scope.row.createdAt).format('HH:mm DD/MM/YYYY') : '' }}</div>
								</template>
                            </el-table-column>
                            <el-table-column v-if="columns[8].isShow" label="Cập nhật bởi-lúc" min-width="150">
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
                sorts: 'date&&-1',
                pages:{
                    from: 0,
                    size: 10
                }
            },
            sortData: [
                {
                    label: 'Thời gian chi giảm dần',
                    value: 'date&&-1',
                },
                {
                    label: 'Thời gian chi tăng dần',
                    value: 'date&&1',
                },
                {
                    label: 'Thời gian tạo giảm dần',
                    value: 'createdAt&&-1',
                },
                {
                    label: 'Thời gian tạo tăng dần',
                    value: 'createdAt&&1',
                },
            ],
            dialogPayment: {
                visible: false,
                data: {}
            }
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
                        message: 'Có lỗi xảy ra',
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
            _this.dialogPayment.data.createdBy = _this.userInfo.data.username;
            var newData = cloneDeep(_this.dialogPayment.data);
            const data = await _this.$axios.$post('/api/paymentSlip/create', newData);
            if (data.success) {
                _this.$message({
                    message: data.message,
                    type: 'success',
                });
                _this.dialogPayment.visible = false;
                _this.dialogPayment.data = new PaymentSlip(),
                _this.getData(_this.searchQuery);
            } else {
                _this.$message.error(data.error);
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
    }
}
</script>