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
                    <div class="col-md-5 mt-2"></div>
                    <div class="col-md-2">
                        <div style="display: flex; height: 100%; align-items: end; justify-content: right;">
                            <button class="control-btn blue">
                                <i class='bx bx-plus' ></i>
                                Tạo phiếu chi
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-md-12">
                        <el-table :data="data.data" v-loading="dataLoading" style="width: 100%" stripe border show-summary>
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
import { columns } from '@/utils/filter/payment';
export default {
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
                sorts: -1,
                pages:{
                    from: 0,
                    size: 10
                }
            },
            sortData: [
                {
                    label: 'Thời gian chi giảm dần',
                    value: -1,
                },
                {
                    label: 'Thời gian chi tăng dần',
                    value: 1,
                },
            ],
        }
    },
    async created() {
        const _this = this;
        _this.dataLoading = false;
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

        },
    }
}
</script>