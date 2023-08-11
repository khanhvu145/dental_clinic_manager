<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Quản lý người dùng</div>
                    </div>
                </div>
                <div class="row" style="margin-top: 9px;">
                    <div class="col-md-2">
                        <div class="col-form-label">Mã</div>
                        <el-input placeholder="Mã..." v-model="searchQuery.filters.codeF" name="codeF"></el-input>
                    </div>
                    <div class="col-md-2">
                        <div class="col-form-label">Tên</div>
                        <el-input placeholder="Tên..." v-model="searchQuery.filters.nameF" name="nameF"></el-input>
                    </div>
                    <div class="col-md-2">
                        <div class="col-form-label">Tài khoản</div>
                        <el-input placeholder="Tài khoản..." v-model="searchQuery.filters.usernameF" name="usernameF"></el-input>
                    </div>
                    <div class="col-md-2">
                        <div class="col-form-label">Trạng thái</div>
                        <el-select v-model="searchQuery.filters.statusF" filterable name="statusF">
                            <el-option
                                v-for="item in statusData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="col-md-2">
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
                    <div class="col-md-7 mt-2"></div>
                    <div class="col-md-2">
                        <div style="display: flex; height: 100%; align-items: end; justify-content: right;">
                            <button class="control-btn blue" @click="$router.push('/users/create')">
                                <i class='bx bx-plus' ></i>
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-md-12">
                        <el-table :data="data.data" v-loading="dataLoading" style="width: 100%" stripe>
                            <el-table-column label="Tài khoản" min-width="150">
                                <template slot-scope="scope">
                                    <div style="font-weight: bold;">
                                        <i class='bx bx-code-alt'></i>
                                        {{ scope.row.code || '' }}
                                    </div>
                                    <div style="font-weight: bold;">
                                        <i class='bx bxs-user-account'></i>
                                        {{ scope.row.username || '' }}
                                    </div>
                                    <div>
                                        <i class='bx bx-group' ></i>
                                        {{ accessMasterData.find(e => e.value == scope.row.accessId).label || '' }}
                                    </div>
								</template>
                            </el-table-column>
                            <el-table-column label="Thông tin" min-width="150">
                                <template slot-scope="scope">
                                    <div style="font-weight: bold;">
                                        <i class='bx bx-user'></i>
                                        {{ scope.row.name || '' }}
                                    </div>
                                    <div>
                                        <i class='bx bx-id-card'></i>
                                        {{ scope.row.physicalId || '' }}
                                    </div>
                                    <div>
                                        <i class='bx bx-calendar-event'></i>
                                        {{ $moment(scope.row.birthday).format('DD/MM/YYYY') }}
                                    </div>
                                    <div>
                                        <i class='bx bx-phone' ></i>
                                        {{ scope.row.phone || '' }}
                                    </div>
								</template>
                            </el-table-column>
                            <el-table-column label="Trạng thái" min-width="80">
                                <template slot-scope="scope">
                                    <el-tag :type="scope.row.isActive ? 'success' : 'danger'">
                                        {{ scope.row.isActive ? 'Hoạt động' : 'Ngưng hoạt động' }}
                                    </el-tag>
								</template>
                            </el-table-column>
                            <el-table-column label="Thao tác" width="150">
                                <template slot-scope="scope">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="row">
                                                <div class="col-md-6 mb-1">
                                                    <el-tooltip effect="dark" content="Chỉnh sửa" placement="right-start">
                                                        <nuxt-link :to="`/users/${scope.row._id}`">
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
                            <el-table-column label="Tạo bởi-lúc" min-width="150">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.createdBy || 'System' }}</div>
                                    <div>{{ scope.row.createdAt ? $moment(scope.row.createdAt).format('HH:mm DD/MM/YYYY') : '' }}</div>
								</template>
                            </el-table-column>
                            <el-table-column label="Cập nhật bởi-lúc" min-width="150">
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
            searchQuery: {},
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
                    usernameF: '',
                    statusF: true
                },
                sorts: 'createdAt&&-1',
                pages:{
                    from: 0,
                    size: 10
                }
            },
            currentPage: 1,
            accessMasterData: [],
            genderData: genderData
        }
    },
    async created() {
        const _this = this;
        _this.accessMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'accessMasterData' })) || [];
        _this.getData(_this.searchQuery);
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['users.all', 'users.' + right];
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
            await _this.$axios.$post('/api/user/getByQuery', searchQuery).then(
                (response) => {
					_this.data = response;
                    _this.dataLoading = false;
				},
				(error) => {
					console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: 'Có lỗi xảy ra',
					});
                    _this.dataLoading = false;
				}
            );
        },
        refreshData(){
            const _this = this;
            _this.searchQuery.filters = {
                codeF: '',
                nameF: '',
                usernameF: '',
                statusF: true
            }
            _this.searchQuery.pages = {
                from: 0,
                size: 10
            }
            _this.getData(_this.searchQuery);
        }
    }
}
</script>