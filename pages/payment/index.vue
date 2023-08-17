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
                    <div class="col-md-4 col-lg-2">
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
                            <el-option label="thuốc men" value="medicine"></el-option>
                            <el-option label="Khác" value="other"></el-option>
                        </el-select>
                    </div>
                    <div class="col-md-4 col-lg-3">
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
        }
    },
    async created() {
        const _this = this;
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
            // _this.currentPage = 1;
            // _this.searchQuery.pages.from = 0;
            // _this.getData(_this.searchQuery)
        },
        refreshData(){
            const _this = this;
            // _this.searchQuery.filters = {
            //     codeF: '',
            //     examinationCodeF: '',
            //     customerF: '',
            //     dateF: [],
            // }
            // _this.searchQuery.pages.from = 0;
            // _this.currentPage = 1;
            // _this.getData(_this.searchQuery);
        },
    }
}
</script>