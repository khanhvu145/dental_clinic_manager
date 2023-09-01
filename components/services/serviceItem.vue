<template>
    <div class="row">
        <div class="col-md-12">
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
                    <div class="col-form-label">Nhóm dịch vụ</div>
                    <el-select v-model="searchQuery.filters.groupF" clearable filterable name="groupF">
                        <el-option
                            v-for="item in groupData"
                            :key="item.key"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
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
                        <button class="control-btn blue" @click="openCreateDialog" v-if="(checkRight('create'))">
                            <i class='bx bx-plus' ></i>
                            Thêm
                        </button>
                    </div>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-md-12">
                    <el-table :data="data.data" v-loading="dataLoading" style="width: 100%" stripe border>
                        <el-table-column v-if="columns[0].isShow" label="Mã dịch vụ" min-width="120">
                            <template slot-scope="scope">
                                <div>{{ scope.row.code || '' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[1].isShow" label="Tên dịch vụ" min-width="120">
                            <template slot-scope="scope">
                                <div>{{ scope.row.name || '' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[2].isShow" label="Nhóm dịch vụ" min-width="120">
                            <template slot-scope="scope">
                                <div>{{ groupData.find(e => e.value == scope.row.groupId) ? groupData.find(e => e.value == scope.row.groupId).label : '' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[3].isShow" label="Giá dịch vụ" min-width="120">
                            <template slot-scope="scope">
                                <div>{{ (scope.row.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[4].isShow" label="Đơn vị tính" min-width="80">
                            <template slot-scope="scope">
                                <div>{{ scope.row.unit == 'unit1' ? 'Răng' : scope.row.unit == 'unit2' ? 'Hàm' : '' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[5].isShow" label="Trạng thái" min-width="80">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.isActive ? 'success' : 'danger'">
                                    {{ scope.row.isActive ? 'Hoạt động' : 'Ngưng hoạt động' }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[6].isShow" label="Thao tác" width="100">
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
                        <el-table-column v-if="columns[7].isShow" label="Tạo bởi-lúc" min-width="120">
                            <template slot-scope="scope">
                                <div>{{ scope.row.createdBy || 'System' }}</div>
                                <div>{{ scope.row.createdAt ? $moment(scope.row.createdAt).format('HH:mm DD/MM/YYYY') : '' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[8].isShow" label="Cập nhật bởi-lúc" min-width="120">
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
            <!-- Dialog create service -->
            <el-dialog title="Tạo loại hình dịch vụ" :visible.sync="dialogCreateService" :close-on-click-modal="false" width="50%">
                <form class="row" v-on:submit.prevent="submitCreateService">
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="col-form-label">Mã dịch vụ *</div>
                                <el-input 
                                    name="code"
                                    placeholder="Mã dịch vụ"
                                    v-model="createData.code"
                                ></el-input>
                            </div>
                            <div class="col-md-6" style="display: flex; align-items: center;">
                                <div class="mt-4">
                                    <el-switch v-model="createData.isActive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                    Hoạt động
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-6">
                                <div class="col-form-label">Tên dịch vụ *</div>
                                <el-input 
                                    name="name"
                                    placeholder="Tên dịch vụ"
                                    v-model="createData.name"
                                ></el-input>
                            </div>
                            <div class="col-md-6">
                                <div class="col-form-label">Nhóm dịch vụ *</div>
                                <el-select v-model="createData.groupId" placeholder="Nhóm dịch vụ" name="groupId" filterable>
                                    <el-option
                                        v-for="item in groupData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-6">
                                <div class="col-form-label">Giá dịch vụ</div>
                                <vue-autonumeric
                                    v-model="createData.price"
                                    class="el-input__inner"
                                    placeholder="Giá dịch vụ"
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
                                <!-- <el-input 
                                    name="price"
                                    placeholder="Giá dịch vụ"
                                    v-model="createData.price"
                                >
                                    <template slot="append">VND</template>
                                </el-input> -->
                            </div>
                            <div class="col-md-6">
                                <div class="col-form-label">Đơn vị tính</div>
                                <el-select v-model="createData.unit" name="unit">
                                    <el-option label="Răng" value="unit1"></el-option>
                                    <el-option label="Hàm" value="unit2"></el-option>
                                    <!-- <el-option
                                        v-for="item in unitData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option> -->
                                </el-select>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <div class="col-form-label">Mô tả</div>
                                <el-input
                                    type="textarea"
                                    placeholder="Mô tả"
                                    v-model="createData.description"
                                    :rows="4"
                                    >
                                </el-input>
                            </div>
                        </div>
                    </div>
                </form>
                <span slot="footer" class="dialog-footer">
                    <button type="button" class="control-btn gray" @click="dialogCreateService = false">
                        <i class='bx bx-x'></i>
                        <span>Đóng</span>
                    </button>
                    <button
                        type="button" 
                        class="control-btn green"
                        @click="submitCreateService"
                    >
                        <i class='bx bx-save' ></i>
                        <span>Lưu</span>
                    </button>
                </span>
            </el-dialog>
            <!-- Dialog update service -->
            <el-dialog title="Cập nhật loại hình dịch vụ" :visible.sync="dialogUpdateService" :close-on-click-modal="false" width="50%">
                <form class="row" v-on:submit.prevent="submitUpdateService">
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="col-form-label">Mã dịch vụ *</div>
                                <el-input 
                                    name="code"
                                    placeholder="Mã dịch vụ"
                                    v-model="updateData.code"
                                ></el-input>
                            </div>
                            <div class="col-md-6" style="display: flex; align-items: center;">
                                <div class="mt-4">
                                    <el-switch v-model="updateData.isActive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                    Hoạt động
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-6">
                                <div class="col-form-label">Tên dịch vụ *</div>
                                <el-input 
                                    name="name"
                                    placeholder="Tên dịch vụ"
                                    v-model="updateData.name"
                                ></el-input>
                            </div>
                            <div class="col-md-6">
                                <div class="col-form-label">Nhóm dịch vụ *</div>
                                <el-select v-model="updateData.groupId" placeholder="Nhóm dịch vụ" name="groupId" filterable>
                                    <el-option
                                        v-for="item in groupData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-6">
                                <div class="col-form-label">Giá dịch vụ *</div>
                                <vue-autonumeric
                                    v-model="updateData.price"
                                    class="el-input__inner"
                                    placeholder="Giá dịch vụ"
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
                                <!-- <el-input 
                                    name="price"
                                    placeholder="Giá dịch vụ"
                                    v-model="updateData.price"
                                >
                                    <template slot="append">VND</template>
                                </el-input> -->
                            </div>
                            <div class="col-md-6">
                                <div class="col-form-label">Đơn vị tính</div>
                                <el-select v-model="updateData.unit" name="unit">
                                    <el-option label="Răng" value="unit1"></el-option>
                                    <el-option label="Hàm" value="unit2"></el-option>
                                    <!-- <el-option
                                        v-for="item in unitData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option> -->
                                </el-select>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <div class="col-form-label">Mô tả</div>
                                <el-input
                                    type="textarea"
                                    placeholder="Mô tả"
                                    v-model="updateData.description"
                                    :rows="4"
                                    >
                                </el-input>
                            </div>
                        </div>
                    </div>
                </form>
                <span slot="footer" class="dialog-footer">
                    <button type="button" class="control-btn gray" @click="dialogUpdateService = false">
                        <i class='bx bx-x'></i>
                        <span>Đóng</span>
                    </button>
                    <button
                        type="button" 
                        class="control-btn green"
                        @click="submitUpdateService"
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
import Service from '@/models/tw_Service';
import VueAutonumeric from 'vue-autonumeric';
import { columns } from '@/utils/filter/service';
export default {
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    components: {
        'vue-autonumeric': VueAutonumeric,
    },
    data() {
        return {
            data: {},
            createData: new Service(),
            updateData: new Service(),
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
            searchQuery: {
                filters: {
                    codeF: '',
                    nameF: '',
                    groupF: '',
                    statusF: true
                },
                sorts: 'createdAt&&-1',
                pages:{
                    from: 0,
                    size: 10
                }
            },
            currentPage: 1,
            dialogCreateService: false,
            dialogUpdateService: false,
            unitData: [],
            groupData: []
        }
    },
    async created() {
        const _this = this;
        _this.getData(_this.searchQuery);
        _this.groupData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'serviceGroupData' })) || [];
        // _this.unitData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigUnit' })) || [];
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['service.all', 'service.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        submitCreateService: debounce(async function (){
            const _this = this;
            try{
                _this.createData.createdBy = _this.userInfo.data.username;
                var newData = cloneDeep(_this.createData);
                const data = await _this.$axios.$post('/api/service/create', newData);
                if (data.success) {
                    _this.$message({
                        message: data.message,
                        type: 'success',
                    });
                    _this.dialogCreateService = false;
                    _this.createData = new Service(),
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
        async getData(searchQuery){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/service/getByQuery', searchQuery).then(
                (response) => {
					_this.data = response;
                    _this.dataLoading = false;
				},
				(error) => {
					console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: error,
					});
                    _this.dataLoading = false;
				}
            );
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
                groupF: '',
                statusF: true
            }
            _this.searchQuery.pages.from = 0;
            _this.currentPage = 1;
            _this.getData(_this.searchQuery);
        },
        async onEdit(val){
            const _this = this;
            await _this.$axios.$get(`/api/service/getById/${val}`).then(
				(response) => {
                    _this.updateData = response.data || new Service();
                    _this.dialogUpdateService = true;
				},
				(error) => {
                    console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: 'Có lỗi xảy ra',
					});
					 _this.formData = new Service();
				}
			);
        },
        submitUpdateService: debounce(async function (){
            const _this = this;
            try{
                _this.updateData.updatedBy = _this.userInfo.data.username;
                var newData = cloneDeep(_this.updateData);
                const data = await _this.$axios.$put('/api/service/update', newData);
                if (data.success) {
                    _this.updateData = data.data;
                    _this.$message({
                        message: data.message,
                        type: 'success',
                    });
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
        openCreateDialog(){
            const _this = this;
            _this.createData = new Service();
            _this.dialogCreateService = true;
        }
    }
}
</script>