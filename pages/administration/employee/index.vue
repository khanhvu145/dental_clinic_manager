<template>
    <div class="wrapper">
        <div class="content">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Nhân viên</div>
                    </div>
                </div>
                <div class="row" style="margin-top: 9px;">
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-3">
                                <div class="col-form-label">Nhân viên</div>
                                <el-select v-model="input" clearable filterable placeholder="Mã, tên khách hàng" name="customerId">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                                </el-select>
                            </div>
                            <div class="col-md-3">
                                <div class="col-form-label">Trạng thái</div>
                                <el-select v-model="input" clearable filterable placeholder="Trạng thái" name="status">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                                </el-select>
                            </div>
                            <div class="col-md-3">
                                <div class="col-form-label">Chức vụ</div>
                                <el-select v-model="input" clearable filterable placeholder="Chức vụ" name="position">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                                </el-select>
                            </div>
                            <div class="col-md-2">
                                <div style="display: flex; height: 100%; align-items: end; gap: 8px;">
                                    <button type="submit" class="control-btn green">
                                        <i class='bx bx-search'></i>
                                        Tìm
                                    </button>
                                    <a href="" class="control-btn gray appointment__heading-refresh">
                                        <i class='bx bx-refresh'></i>
                                    </a>
                                    <button type="submit" class="control-btn blue" @click="$router.push('/administration/employee/create')">
                                        <i class='bx bx-user-plus'></i>
                                        Thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mt-4 mb-5">
                    <div class="col-md-12">
                        <el-table
                            :data="employeeData.data"
                            style="width: 100%"
                            border
                        >
                            <el-table-column align="center" type="selection"></el-table-column>
                            <el-table-column label="Mã nhân viên" min-width="150">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.code || '' }}</div>
								</template>
                            </el-table-column>
                            <el-table-column label="Thông tin nhân viên" min-width="150">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.name || '' }}</div>
								</template>
                            </el-table-column>
                            <el-table-column label="Trạng thái" min-width="80">
                                <template slot-scope="scope">
                                    <el-switch v-model="scope.row.isDel" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
								</template>
                            </el-table-column>
                            <el-table-column label="Chức vụ" min-width="150"></el-table-column>
                            <el-table-column label="Thao tác" min-width="120"></el-table-column>
                            <el-table-column label="Thông tin tạo chỉnh" min-width="200"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import User from '@/models/Employee';
export default {
    layout: 'admin',
    name: 'Employee',
    data() {
        return {
            employeeData: []
        }
    },
    async created() {
        const _this = this;
        const listEmployee = await _this.$axios.$get('/api/employee/getListEmployee') || [];
        _this.employeeData = listEmployee || [];
    },
}
</script>

<style>

</style>