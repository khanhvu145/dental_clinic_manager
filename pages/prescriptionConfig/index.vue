<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Quản lý danh mục thuốc</div>
                    </div>
                </div>
                <div class="row" style="margin-top: 9px;">
                    <div class="col-md-3">
                        <div class="col-form-label">Tiêu đề</div>
                        <el-input placeholder="Tiêu đề..." v-model="searchQuery.filters.titleF" name="titleF"></el-input>
                    </div>
                    <div class="col-md-3">
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
                    <div class="col-md-4">
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
                    <div class="col-md-3">
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
                    <div class="col-md-3 mt-2"></div>
                    <div class="col-md-3">
                        <div style="display: flex; height: 100%; align-items: end; justify-content: right;">
                            <button class="control-btn blue" @click="openDialogCreate" v-if="(checkRight('create'))">
                                <i class='bx bx-plus' ></i>
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-md-12">
                        <el-table :data="data.data" v-loading="dataLoading" style="width: 100%" stripe border>
                            <el-table-column v-if="columns[0].isShow" label="Tiêu đề" min-width="150">
                                <template slot-scope="scope">
                                    {{ scope.row.title || '' }}
								</template>
                            </el-table-column>
                            <el-table-column v-if="columns[1].isShow" label="Thuốc" min-width="150">
                                <template slot-scope="scope">
                                    <div v-for="(item, index) in scope.row.medicines" :key="index">
                                        {{ `${index + 1}/ ` }} {{ getMedicinesString(item) }}
                                    </div>
								</template>
                            </el-table-column>
                            <el-table-column v-if="columns[2].isShow" label="Trạng thái" min-width="100">
                                <template slot-scope="scope">
                                    <el-tag :type="scope.row.isActive ? 'success' : 'danger'">
                                        {{ scope.row.isActive ? 'Hoạt động' : 'Ngưng hoạt động' }}
                                    </el-tag>
								</template>
                            </el-table-column>
                            <el-table-column v-if="columns[3].isShow" label="Thao tác" width="100">
                                <template slot-scope="scope">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="row">
                                                <div class="col-md-6 mb-1">
                                                    <el-tooltip effect="dark" content="Chỉnh sửa" placement="right-start">
                                                        <button class="control-btn blue2" style="padding: 4px 6px;" @click="openDialogUpdate(scope.row._id)">
                                                            <i class="el-icon-edit-outline"></i>
                                                        </button>
                                                    </el-tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
								</template>
                            </el-table-column>
                            <el-table-column v-if="columns[4].isShow" label="Tạo bởi-lúc" min-width="150">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.createdBy || 'System' }}</div>
                                    <div>{{ scope.row.createdAt ? $moment(scope.row.createdAt).format('HH:mm DD/MM/YYYY') : '' }}</div>
								</template>
                            </el-table-column>
                            <el-table-column v-if="columns[5].isShow" label="Cập nhật bởi-lúc" min-width="150">
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
                <!-- Dialog -->
                <el-dialog :title="dialogCreate.type == 'create' ? 'Thêm mới' : 'Chỉnh sửa'" :visible.sync="dialogCreate.visible" :close-on-click-modal="false" width="70%">
                    <form class="row" v-on:submit.prevent="dialogCreate.type == 'create' ? submitCreate : submitUpdate">
                        <div class="col-md-6">
                            <div class="col-form-label">Tiêu đề *</div>
                            <el-input 
                                name="title"
                                placeholder="Tiêu đề"
                                v-model="dialogCreate.data.title"
                            ></el-input>
                        </div>
                        <div class="col-md-6" style="display: flex; align-items: center;">
                            <div class="mt-4">
                                <el-switch v-model="dialogCreate.data.isActive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                Hoạt động
                            </div>
                        </div>
                        <div class="col-md-12 mt-3">
                            <div class="col-form-label" style="font-weight:bold;">Đơn thuốc</div>
                            <template>
                                <el-table :data="dialogCreate.data.medicines" style="width: 100%" border stripe>
                                    <el-table-column prop="order" label="#" width="50" align="center"></el-table-column>
                                    <el-table-column label="Tên thuốc" min-width="120">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.medicine" placeholder="Chọn thuốc" filterable>
                                                <el-option
                                                    v-for="item in medicineData"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Số lượng" width="100">
                                        <template slot-scope="scope">
                                            <div class="inputTextRight">
                                                <InputNumber 
                                                    style="width:100%;"
                                                    inputClass="el-input__inner"
                                                    v-model="scope.row.quantity" 
                                                    placeholder="0"
                                                    :min="0"
                                                    mode="decimal"
                                                    locale="en-US"
                                                    @input="()=>{
                                                        if(scope.row.quantity == null || scope.row.quantity == ''){
                                                            scope.row.quantity = 0;
                                                        }
                                                    }"
                                                />
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Đơn vị" width="100">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.unit" filterable>
                                                <el-option
                                                    v-for="item in unitData"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Ghi chú" min-width="150">
                                        <template slot-scope="scope">
                                            <el-input
                                                type="textarea"
                                                placeholder="Nhập ghi chú"
                                                v-model="scope.row.note"
                                                :rows="2"
                                            ></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column width="50">
                                        <template slot="header">
                                            <span @click="addPrescription()" style="cursor:pointer;">
                                                <i class="el-icon-circle-plus font-20"></i>
                                            </span>
                                        </template>
                                        <template slot-scope="scope">
                                            <span @click="removePrescription(scope.row.idForEdit, scope.row.order)" style="cursor:pointer;">
                                                <i class="el-icon-remove font-20"></i>
                                            </span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </div>
                        <div class="col-md-12 mt-3">
                            <div class="col-form-label" style="font-weight:bold;">Lời dặn</div>
                            <tiny-editor
                                data-vv-as='Lời dặn'
                                v-model='dialogCreate.data.advice'
                            >
                            </tiny-editor>
                        </div>
                    </form>
                    <span slot="footer" class="dialog-footer">
                        <button type="button" class="control-btn gray" @click="dialogCreate.visible = false">
                            <i class='bx bx-x'></i>
                            <span>Đóng</span>
                        </button>
                        <button
                            v-if="dialogCreate.type == 'create'"
                            type="button" 
                            class="control-btn green"
                            @click="submitCreate"
                        >
                            <i class='bx bx-save' ></i>
                            <span>Lưu</span>
                        </button>
                        <button
                            v-if="dialogCreate.type == 'update'"
                            type="button" 
                            class="control-btn green"
                            @click="submitUpdate"
                        >
                            <i class='bx bx-save' ></i>
                            <span>Lưu</span>
                        </button>
                    </span>
                </el-dialog>
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
import { debounce, map, cloneDeep, intersection, filter, find, forEach } from 'lodash';
import { columns } from '@/utils/filter/prescriptionConfig';
import Prescription from '@/models/tw_Prescription';
import TinyEditor from '@/components/common/TinyEditor';
export default {
    components: {
		'tiny-editor': TinyEditor,
	},
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
		}),
	},
    data() {
        return {
            data: {},
            dataLoading: true,
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
                    titleF: '',
                    statusF: true
                },
                sorts: 'createdAt&&-1',
                pages:{
                    from: 0,
                    size: 10
                }
            },
            currentPage: 1,
            statusData: statusData,
            medicineData: [],
            unitData: [],
            dialogCreate: {
                visible: false,
                data: new Prescription(),
                type: 'create'
            }
        }
    },
    async created() {
        const _this = this;
        //Lấy danh sách thuốc
        _this.medicineData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamMedicine' })) || [];

        _this.unitData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigPrescriptionUnit' })) || [];

        await _this.getData(_this.searchQuery);
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['prescriptionConfig.all', 'prescriptionConfig.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        async getData(searchQuery){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/prescriptionConfig/getByQuery', searchQuery).then(
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
                titleF: '',
                statusF: true
            }
            _this.searchQuery.pages.from = 0;
            _this.currentPage = 1;
            _this.getData(_this.searchQuery);
        },
        openDialogCreate(){
            const _this = this;
            _this.dialogCreate.data = new Prescription();
            _this.dialogCreate.type = 'create';
            _this.dialogCreate.visible = true;
        },
        async openDialogUpdate(id){
            const _this = this;
            await _this.$axios.$get(`/api/prescriptionConfig/getById/${id}`).then(
				(response) => {
                    _this.dialogCreate.data = response.data || new Prescription();
                    if(_this.dialogCreate.data.medicines && _this.dialogCreate.data.medicines.length > 0){
                        _this.dialogCreate.data.medicines = _.map(_this.dialogCreate.data.medicines, (e) => {
                            return {
                                ...e,
                                idForEdit: e._id
                            };
                        });
                    }
                    _this.dialogCreate.type = 'update';
                    _this.dialogCreate.visible = true;
				},
				(error) => {
                    console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: 'Có lỗi xảy ra',
					});
				}
			);
        },
        submitCreate: debounce(async function () {
            const _this = this;
            try{
                var newData = cloneDeep(_this.dialogCreate.data);
                const data = await _this.$axios.$post('/api/prescriptionConfig/create', newData);
                if (data.success) {
                    _this.$message({
                        message: data.message,
                        type: 'success',
                    });
                    _this.dialogCreate.data = new Prescription();
                    _this.dialogCreate.visible = false;
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
        submitUpdate: debounce(async function () {
            const _this = this;
            try{
                var newData = cloneDeep(_this.dialogCreate.data);
                const data = await _this.$axios.$put('/api/prescriptionConfig/update', newData);
                if (data.success) {
                    _this.dialogCreate.data = data.data;
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
        addPrescription(){
            const _this = this;
            var order = _this.dialogCreate.data.medicines.length + 1;
            _this.dialogCreate.data.medicines.push({
                idForEdit: `new_${order}_${_this.$moment().format('DDMMYYYYHHmmssSSS')}`,
                order: order,
                medicine: '',
                quantity: 0,
                note: ''
            });
        },
        removePrescription(id, order){
            const _this = this;
            var arr = _this.dialogCreate.data.medicines.filter(obj => obj.idForEdit != id);
            for(var i = order - 1; i < arr.length; i++){
                arr[i].order = i + 1;
                arr[i].idForEdit = `new_${i + 1}_${_this.$moment().format('DDMMYYYYHHmmssSSS')}`;
            }
            _this.dialogCreate.data.medicines = arr;
        },
        getMedicinesString(item){
            const _this = this;
            var result = '';
            let medicineItem = _.find(_this.medicineData, { value: item.medicine });
            let unitItem = _.find(_this.unitData, { value: item.unit });

            var name = medicineItem ? medicineItem.label : '';
            var unit = unitItem ? unitItem.label : '';
            result = `${name} - ${item.quantity} ${unit}`;
            // if(data && data.length > 0){
            //     var arr = [];
            //     data.forEach(item => {
            //         let data = _.find(_this.medicineData, { value: item.medicine });
            //         arr.push(data ? data.label : '');
            //     })
            //     result = arr.join(", ");
            // }

            return result;
        }
    }
}
</script>