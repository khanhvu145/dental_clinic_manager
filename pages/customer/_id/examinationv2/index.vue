<template>
    <LeftMenu>
        <div v-if="checkRight('viewExamination')">
            <div class="row mt-4">
                <div class="col-md-12" style="text-align: right;">
                    <button type="button" class="control-btn gray" @click="$router.push('/customer')">
                        <i class='bx bx-arrow-back'></i>
                        <span>Quay lại</span>
                    </button>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-md-6 col-lg-3">
                    <div class="col-form-label">Mã phiếu khám</div>
                    <el-input placeholder="Mã..." v-model="searchQuery.filters.codeF" name="codeF"></el-input>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="col-form-label">Nha sĩ phụ trách</div>
                    <el-select 
                        v-model="searchQuery.filters.dentistsF" 
                        placeholder="Chọn nha sĩ" 
                        name="dentistsF" 
                        style="width: 100%"
                        clearable 
                        filterable
                        remote
                        multiple
                        :remote-method="(text) => filterDentist(text)"
                        @focus="filterDentist('')"
                    >
                        <el-option
                            v-for="item in dentistData"
                            :key="item._id"
                            :label="`Ns ${item.name}`"
                            :value="item._id"
                        ></el-option>
                    </el-select>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="col-form-label">Ngày khám</div>
                    <el-date-picker
                        v-model="searchQuery.filters.dateF"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="Từ"
                        end-placeholder="Đến"
                        format="dd/MM/yyyy">
                    </el-date-picker>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="col-form-label">Trạng thái</div>
                    <el-select v-model="searchQuery.filters.statusF" placeholder="Trạng thái..." name="statusF" multiple clearable filterable>
                        <el-option label="Mới" value="new"></el-option>
                        <el-option label="Xác nhận" value="confirm"></el-option>
                        <el-option label="Hoàn thành" value="completed"></el-option>
                        <el-option label="Đã hủy" value="cancelled"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-md-12">
                    <div style="display: flex; height: 100%; align-items: end; gap: 8px;justify-content: space-between;">
                        <div>
                            <button class="control-btn blue" v-if="checkRight('createExamination')" @click="createExamination()">
                                <i class='bx bx-plus' ></i>
                                Tạo phiếu khám
                            </button>
                        </div>
                        <div>
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
            </div>
            <div class="row mt-4">
                <div class="col-md-12">
                    <el-table :data="data.data" v-loading="dataLoading" style="width: 100%" stripe border>
                        <el-table-column label="Mã phiếu khám" min-width="80">
                            <template slot-scope="scope">
                                {{scope.row.code}}
                            </template>
                        </el-table-column>
                        <el-table-column label="Ngày khám" min-width="80">
                            <template slot-scope="scope">
                                {{ scope.row.createdAt ? $moment(scope.row.createdAt).format('DD/MM/YYYY') : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Nha sĩ phụ trách" min-width="80">
                            <template slot-scope="scope">
                                Ns. {{scope.row.dentistName}}
                            </template>
                        </el-table-column>
                        <el-table-column label="Chi phí điều trị" min-width="80" align="right">
                            <template slot-scope="scope">
                                {{ (scope.row.totalAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Trạng thái" min-width="60">
                            <template slot-scope="scope">
                                <div v-if="scope.row.status == 'new'" style="text-align:center;">
                                    <el-tag>Mới</el-tag>
                                </div>
                                <div v-if="scope.row.status == 'confirm'" style="text-align:center;">
                                    <el-tag type="success">Xác nhận</el-tag>
                                </div>
                                <div v-if="scope.row.status == 'completed'" style="text-align:center;">
                                    <el-tag type="warning">Hoàn thành</el-tag>
                                </div>
                                <div v-if="scope.row.status == 'cancelled'" style="text-align:center;">
                                    <el-tag type="info">Đã hủy</el-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="Thao tác" min-width="40">
                             <template slot-scope="scope">
                                <div v-if="checkRight('viewExamination')">
                                    <el-tooltip class="item" effect="dark" content="Chi tiết phiếu khám" placement="top">
                                        <a class="btn control-btn blue2" style="padding: 4px 6px;" @click="viewExamination(scope.row)">
                                            <i class='bx bxs-edit'></i>
                                        </a>
                                    </el-tooltip>
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
        <div v-else>
            <el-empty description="Bạn không có quyền !!"></el-empty>
        </div>
    </LeftMenu>
</template>

<script>
import { mapState } from 'vuex';
import LeftMenu from '@/components/customer/LeftMenu';
import { cloneDeep, debounce, intersection, remove } from 'lodash';
import Examination from '@/models/tw_Examination';
import buildFormData from '@/utils/buildFormData';
import moment from 'moment';
export default {
    components: {
		LeftMenu,
	},
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data(){
        return {
            searchQuery: {
                filters: {
                    codeF: '',
                    dentistsF: [],
                    dateF: [moment().subtract(1, 'months'), moment()],
                    statusF: ['new', 'completed'],
                },
                sorts: -1,
                pages:{
                    from: 0,
                    size: 10
                }
            },
            dentistData: [],
            dataLoading: true,
            data: {},
            currentPage: 1,
        }
    },
    async created(){
        const _this = this;
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
        filterDentist: debounce(async function (text) {
            const _this = this;
            let query = {
                filters: {
                    textSearch: text
                },
                sorts: 'createdAt&&-1',
                pages:{
                    from: 0,
                    size: 10
                }
            };
            let dentists = await _this.$axios.$post('/api/user/getDentistByQuery', query);
            _this.dentistData = dentists && dentists.data;
        }, 200),
        async getData(searchQuery){
            const _this = this;
            _this.dataLoading = true;
            if (_this.$route.params.id){
                searchQuery.filters.customerF = _this.$route.params.id;
                await _this.$axios.$post('/api/customer/getByQueryExamination', searchQuery).then(
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
            }
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
                dentistsF: [],
                dateF: [new Date(), new Date()],
                statusF: ['new', 'completed'],
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
        async createExamination(){
            const _this = this;
            if(_this.$route.params.id){
                _this
                    .$confirm(`Bạn muốn tạo phiếu khám mới?`, 'Xác nhận', {
                        confirmButtonText: 'Xác nhận',
                        cancelButtonText: 'Hủy',
                        type: 'warning',
                    })
                    .then(async () => {
                        _this.dataLoading = true;
                        try{
                            var formData = new Examination();
                            formData.customerId = _this.$route.params.id;
                            var oldData = cloneDeep(formData);
                            var newData = new FormData();
                            buildFormData(newData, oldData);
                            const data = await _this.$axios.$post('/api/customer/createExamination', newData, {
                                headers: { 'Content-Type': 'multipart/form-data' },
                            });
                            if (data.success) {
                                _this.$message({
                                    message: data.message,
                                    type: 'success',
                                });
                                setTimeout(() => {
                                    _this.$router.push({
                                        path: `/customer/${_this.$route.params.id}/examinationV2/edit`,
                                        query: { examinationId: data.data._id }
                                    });
                                }, 500);
                            }
                            else {
                                _this.$message.error(data.error);
                            }
                        }
                        catch (e){
                            console.log(e);
                            _this.$message.error(e);
                        }
                        _this.dataLoading = false;
                    });
            }
        },
        viewExamination(data){
            const _this = this;
            if(_this.$route.params.id && data){
                _this.$router.push({
                    path: `/customer/${_this.$route.params.id}/examinationV2/edit`,
                    query: { examinationId: data._id }
                });
            }
        }
    }
}
</script>