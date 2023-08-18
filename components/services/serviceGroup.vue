<template>
    <div class="row">
        <div class="col-md-12">
            <div class="row" style="margin-top: 9px;">
                <div class="col-md-3">
                    <div class="col-form-label">Mã</div>
                    <el-input placeholder="Mã..." v-model="searchQueryGroup.filters.codeF" name="codeF"></el-input>
                </div>
                <div class="col-md-3">
                    <div class="col-form-label">Tên</div>
                    <el-input placeholder="Tên..." v-model="searchQueryGroup.filters.nameF" name="nameF"></el-input>
                </div>
                <div class="col-md-3">
                    <div class="col-form-label">Trạng thái</div>
                    <el-select v-model="searchQueryGroup.filters.statusF" filterable name="statusF">
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
                    <el-select v-model="searchQueryGroup.sorts" filterable name="sorts" v-on:change="onChangeSorts($event)">
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
                        <button class="control-btn blue" @click="dialogCreateServiceGroup = true" v-if="(checkRight('create'))">
                            <i class='bx bx-plus' ></i>
                            Thêm
                        </button>
                    </div>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-md-12">
                    <el-table :data="data.data" v-loading="dataLoading" style="width: 100%" stripe>
                        <el-table-column v-if="columns[0].isShow" label="Mã" min-width="120">
                            <template slot-scope="scope">
                                <div>{{ scope.row.code || '' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[1].isShow" label="Tên nhóm dịch vụ" min-width="120">
                            <template slot-scope="scope">
                                <div>{{ scope.row.name || '' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[2].isShow" label="Trạng thái" min-width="80">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.isActive ? 'success' : 'danger'">
                                    {{ scope.row.isActive ? 'Hoạt động' : 'Ngưng hoạt động' }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[3].isShow" label="Thao tác" width="150">
                            <template slot-scope="scope">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="row">
                                            <div class="col-md-6 mb-1">
                                                <el-tooltip effect="dark" content="Chỉnh sửa" placement="right-start">
                                                    <button class="control-btn blue2" style="padding: 4px 6px;" @click="onEdit(scope.row._id)">
                                                        <i class="el-icon-edit-outline"></i>
                                                    </button>
                                                </el-tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[4].isShow" label="Tạo bởi-lúc" min-width="120">
                            <template slot-scope="scope">
                                <div>{{ scope.row.createdBy || 'System' }}</div>
                                <div>{{ scope.row.createdAt ? $moment(scope.row.createdAt).format('HH:mm DD/MM/YYYY') : '' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[5].isShow" label="Cập nhật bởi-lúc" min-width="120">
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
            <!-- Dialog create service group -->
            <el-dialog title="Tạo loại dịch vụ" :visible.sync="dialogCreateServiceGroup" :close-on-click-modal="false" width="50%">
                <form class="row" v-on:submit.prevent="submitCreateServiceGroup">
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="col-form-label">Mã *</div>
                                <el-input 
                                    name="code"
                                    placeholder="Mã"
                                    v-model="createDataGroup.code"
                                ></el-input>
                            </div>
                            <div class="col-md-6" style="display: flex; align-items: center;">
                                <div class="mt-4">
                                    <el-switch v-model="createDataGroup.isActive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                    Hoạt động
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <div class="col-form-label">Tên nhóm dịch vụ *</div>
                                <el-input 
                                    name="name"
                                    placeholder="Tên nhóm dịch vụ"
                                    v-model="createDataGroup.name"
                                ></el-input>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <div class="col-form-label">Mô tả</div>
                                <el-input
                                    type="textarea"
                                    placeholder="Mô tả"
                                    v-model="createDataGroup.description"
                                    :rows="4"
                                    >
                                </el-input>
                            </div>
                        </div>
                    </div>
                </form>
                <span slot="footer" class="dialog-footer">
                    <button type="button" class="control-btn gray" @click="dialogCreateServiceGroup = false">
                        <i class='bx bx-x'></i>
                        <span>Đóng</span>
                    </button>
                    <button
                        type="button" 
                        class="control-btn green"
                        @click="submitCreateServiceGroup"
                    >
                        <i class='bx bx-save' ></i>
                        <span>Lưu</span>
                    </button>
                </span>
            </el-dialog>
            <!-- Dialog update service group -->
            <el-dialog title="Cập nhật nhóm dịch vụ" :visible.sync="dialogUpdateServiceGroup" :close-on-click-modal="false" width="50%">
                <form class="row" v-on:submit.prevent="submitUpdateServiceGroup">
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="col-form-label">Mã *</div>
                                <el-input 
                                    name="code"
                                    placeholder="Mã"
                                    v-model="updateDataGroup.code"
                                ></el-input>
                            </div>
                            <div class="col-md-6" style="display: flex; align-items: center;">
                                <div class="mt-4">
                                    <el-switch v-model="updateDataGroup.isActive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                    Hoạt động
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <div class="col-form-label">Tên nhóm dịch vụ *</div>
                                <el-input 
                                    name="name"
                                    placeholder="Tên dịch vụ"
                                    v-model="updateDataGroup.name"
                                ></el-input>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <div class="col-form-label">Mô tả</div>
                                <el-input
                                    type="textarea"
                                    placeholder="Mô tả"
                                    v-model="updateDataGroup.description"
                                    :rows="4"
                                    >
                                </el-input>
                            </div>
                        </div>
                    </div>
                </form>
                <span slot="footer" class="dialog-footer">
                    <button type="button" class="control-btn gray" @click="dialogUpdateServiceGroup = false">
                        <i class='bx bx-x'></i>
                        <span>Đóng</span>
                    </button>
                    <button
                        type="button" 
                        class="control-btn green"
                        @click="submitUpdateServiceGroup"
                        v-if="(checkRight('update'))"
                    >
                        <i class='bx bx-save' ></i>
                        <span>Lưu</span>
                    </button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { statusData } from '@/utils/masterData';
import { debounce, map, cloneDeep, intersection, filter, find, forEach } from 'lodash';
import ServiceGroup from '@/models/tw_ServiceGroup';
import { columns } from '@/utils/filter/serviceGroup';
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
            createDataGroup: new ServiceGroup(),
            updateDataGroup: new ServiceGroup(),
            dataLoading: true,
            statusData: statusData,
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
            searchQueryGroup: {
                filters: {
                    codeF: '',
                    nameF: '',
                    statusF: true
                },
                sorts: 'createdAt&&-1',
                pages:{
                    from: 0,
                    size: 10
                }
            },
            currentPage: 1,
            dialogCreateServiceGroup: false,
            dialogUpdateServiceGroup: false,
        }
    },
    async created() {
        const _this = this;
        _this.getData(_this.searchQueryGroup);
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['service.all', 'service.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        submitCreateServiceGroup: debounce(async function (){
            const _this = this;
            _this.createDataGroup.createdBy = _this.userInfo.data.username;
            var newData = cloneDeep(_this.createDataGroup);
            const data = await _this.$axios.$post('/api/service/groupCreate', newData);
            if (data.success) {
                _this.$message({
                    message: data.message,
                    type: 'success',
                });
                _this.dialogCreateServiceGroup = false;
                _this.createDataGroup = new ServiceGroup();
                _this.getData(_this.searchQueryGroup);
            } else {
                _this.$message.error(data.error);
            }
        }),
        async getData(searchQueryGroup){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/service/groupGetByQuery', searchQueryGroup).then(
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
        handleSizeChange(val) {
            const _this = this;
            _this.searchQueryGroup.pages.size = val;
            _this.getData(_this.searchQueryGroup);
        },
        handleCurrentChange(val) {
            const _this = this;
            _this.searchQueryGroup.pages.from = (_this.currentPage - 1) * _this.searchQueryGroup.pages.size;
            _this.getData(_this.searchQueryGroup);
        },
        onChangeSorts(value){
            const _this = this;
            _this.searchQueryGroup.sorts = value;
            _this.getData(_this.searchQueryGroup);
        },
        searchData(){
            const _this = this;
            _this.currentPage = 1;
            _this.searchQueryGroup.pages.from = 0;
            _this.getData(_this.searchQueryGroup)
        },
        refreshData(){
            const _this = this;
            _this.searchQueryGroup.filters = {
                codeF: '',
                nameF: '',
                statusF: true
            }
            _this.searchQueryGroup.pages.from = 0;
            _this.currentPage = 1;
            _this.getData(_this.searchQueryGroup);
        },
        async onEdit(val){
            const _this = this;
            await _this.$axios.$get(`/api/service/groupGetById/${val}`).then(
				(response) => {
                    _this.updateDataGroup = response.data || new ServiceGroup();
				},
				(error) => {
                    console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: 'Có lỗi xảy ra',
					});
					 _this.formData = new ServiceGroup();
				}
			);
            _this.dialogUpdateServiceGroup = true;
        },
        submitUpdateServiceGroup: debounce(async function (){
            const _this = this;
            _this.updateDataGroup.updatedBy = _this.userInfo.data.username;
            var newData = cloneDeep(_this.updateDataGroup);
            const data = await _this.$axios.$put('/api/service/groupUpdate', newData);
            if (data.success) {
                _this.updateDataGroup = data.data;
                _this.$message({
                    message: data.message,
                    type: 'success',
                });
                _this.getData(_this.searchQueryGroup);
            } else {
                _this.$message.error(data.error);
            }
        }),
    }
}
</script>