<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Quản lý khách hàng</div>
                    </div>
                </div>
                <div class="row" style="margin-top: 9px;">
                    <div class="col-md-3">
                        <div class="col-form-label">Mã</div>
                        <el-input placeholder="Mã..." v-model="searchQuery.filters.codeF" name="codeF"></el-input>
                    </div>
                    <div class="col-md-2">
                        <div class="col-form-label">Tên</div>
                        <el-input placeholder="Tên..." v-model="searchQuery.filters.nameF" name="nameF"></el-input>
                    </div>
                    <div class="col-md-2">
                        <div class="col-form-label">Số điện thoại</div>
                        <el-input placeholder="Số điện thoại..." v-model="searchQuery.filters.phoneF" name="phoneF"></el-input>
                    </div>
                    <div class="col-md-2">
                        <div class="col-form-label">Trạng thái</div>
                        <el-select v-model="searchQuery.filters.statusF" filterable name="statusF">
                            <el-option
                                v-for="item in statusData"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="col-md-3">
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
                            <button class="control-btn blue" @click="$router.push('/customer/create')">
                                <i class='bx bx-plus' ></i>
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-md-12">
                        <el-table :data="data.data" v-loading="dataLoading" style="width: 100%" stripe border>
                            <el-table-column v-if="columns[0].isShow" label="Khách hàng" min-width="150">
                                <template slot-scope="scope">
                                    <div style="font-weight: bold;">  
                                        <i class='bx bx-code-alt'></i>
                                        {{ scope.row.code || '' }}
                                    </div>
                                    <div style="font-weight: bold;">  
                                        <i class='bx bx-user'></i>
                                        {{ scope.row.name || '' }}
                                    </div>
                                    <div>
                                        <i class='bx bx-phone' ></i>
                                        <a class="href-custom" v-if="scope.row.phone" :href="`tel:${scope.row.phone}`">{{scope.row.phone}}</a>
                                    </div>
								</template>
                            </el-table-column>
                            <el-table-column v-if="columns[1].isShow" label="Thông tin thêm" min-width="220">
                                <template slot-scope="scope">
                                    <div>
                                        <i class='bx bx-id-card'></i>
                                        <span>{{ scope.row.physicalId || '' }}</span>
                                        <span v-if="scope.row.dateOfIssue"> | {{ $moment(scope.row.dateOfIssue).format('DD/MM/YYYY') }}</span>
                                        <span v-if="scope.row.placeOfIssue"> | {{ scope.row.placeOfIssue }}</span>
                                    </div>
                                    <div>
                                        <i class='bx bx-cake'></i>
                                        {{ scope.row.birthday ? $moment(scope.row.birthday).format('DD/MM/YYYY') : '' }}
                                    </div>
                                    <div>
                                        <i class="el-icon-location-information"></i>
                                        {{ scope.row.fullAddress || '' }}
                                    </div>
								</template>
                            </el-table-column>
                            <el-table-column v-if="columns[2].isShow" label="Trạng thái" min-width="80">
                                <template slot-scope="scope">
                                    <el-tag :type="scope.row.isActive ? 'success' : 'danger'">
                                        {{ scope.row.isActive ? 'Hoạt động' : 'Ngưng hoạt động' }}
                                    </el-tag>
								</template>
                            </el-table-column>
                            <el-table-column v-if="columns[3].isShow" label="Nhóm/Nguồn" min-width="120">
                                <template slot-scope="scope">
                                    <div>  
                                        <i class='bx bx-heart-circle'
                                            v-bind:style="{
												color: customerType.find(e => e.value == scope.row.customerGroup) ? customerType.find(e => e.value == scope.row.customerGroup).color : '#ccc',
											}"
                                        ></i>
                                        {{ customerType.find(e => e.value == scope.row.customerGroup) ? customerType.find(e => e.value == scope.row.customerGroup).label : 'Chưa có nhóm' }}
                                    </div>
                                    <div>
                                        <i class='bx bxs-circle'
                                            v-bind:style="{
												color: customerSource.find(e => e.value == scope.row.source) ? customerSource.find(e => e.value == scope.row.source).color : '#ccc',
											}"
                                        ></i>
                                        {{ customerSource.find(e => e.value == scope.row.source) ? customerSource.find(e => e.value == scope.row.source).label : 'Chưa có nguồn' }}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="columns[4].isShow" label="Hoạt động" min-width="150">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.recentActivity ? $moment(scope.row.recentActivity).format('DD/MM/YYYY HH:mm') : 'Chưa có hoạt động' }}</div>
                                    <div style="font-style: italic;color:#98a6ad;">{{ scope.row.recentActivity ? `Hoạt động - ${$moment(scope.row.recentActivity).fromNow()}` : '' }}</div>
								</template>
                            </el-table-column>
                            <el-table-column v-if="columns[5].isShow" label="Thao tác" min-width="80">
                                <template slot-scope="scope">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="row">
                                                <div class="col-md-6 mb-1">
                                                    <el-tooltip effect="dark" content="Chỉnh sửa" placement="right-start">
                                                        <nuxt-link :to="`/customer/${scope.row._id}/profile`">
                                                            <button class="control-btn blue2" style="padding: 4px 6px;">
                                                                <i class="el-icon-edit-outline"></i>
                                                            </button>
                                                        </nuxt-link>
                                                    </el-tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
								</template>
                            </el-table-column>
                            <el-table-column v-if="columns[6].isShow" label="Tạo bởi-lúc" min-width="120">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.createdBy || 'System' }}</div>
                                    <div>{{ scope.row.createdAt ? $moment(scope.row.createdAt).format('HH:mm DD/MM/YYYY') : '' }}</div>
								</template>
                            </el-table-column>
                            <el-table-column v-if="columns[7].isShow" label="Cập nhật bởi-lúc" min-width="120">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.updatedBy }}</div>
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
import { statusData } from '@/utils/masterData';
import { genderData } from '@/utils/masterData';
import { intersection } from 'lodash';
import { columns } from '@/utils/filter/customer';
export default {
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
		}),
	},
    data() {
        return {
            data: {},
            dataLoading: true,
            statusData: statusData,
            genderData: genderData,
            columns: columns,
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
                    label: 'Thời gian cập nhật giảm dần',
                    value: 'updatedAt&&-1',
                },
                {
                    label: 'Thời gian cập nhật tăng dần',
                    value: 'updatedAt&&1',
                },
            ],
            searchQuery: {
                filters: {
                    codeF: '',
                    nameF: '',
                    phoneF: '',
                    statusF: true
                },
                sorts: 'createdAt&&-1',
                pages:{
                    from: 0,
                    size: 10
                }
            },
            currentPage: 1,
            customerType: [],
            customerSource: []
        }
    },
    async created() {
        const _this = this;
        _this.customerType = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigCustomerType' })) || [];
        _this.customerSource = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigCustomerSource' })) || [];

        _this.getData(_this.searchQuery);
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['customer.all', 'customer.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
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
        async getData(searchQuery){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/customer/getByQuery', searchQuery).then(
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
                nameF: '',
                phoneF: '',
                statusF: true
            }
            _this.searchQuery.pages.from = 0;
            _this.currentPage = 1;
            _this.getData(_this.searchQuery);
        }
    }
}
</script>

<style scoped>
.href-custom{
    color: #00a582;
}
.href-custom:hover{
    color: #015d49;
}
</style>