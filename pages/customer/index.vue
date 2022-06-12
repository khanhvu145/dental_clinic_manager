<template>
    <div class="wrapper">
        <div class="content">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Khách hàng</div>
                    </div>
                </div>
                <div class="row" style="margin-top: 9px;">
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-3">
                                <div class="col-form-label">Khách hàng</div>
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
                                <div class="col-form-label">Dịch vụ sử dụng</div>
                                <el-select v-model="input" clearable filterable placeholder="Dịch vụ" name="serviceId">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mt-4 mb-5">
                    <div class="col-md-12">
                        <el-table
                            :data="tableData"
                            style="width: 100%"
                            border
                        >
                            <el-table-column
                                prop="code"
                                label="Mã hồ sơ"
                                min-width="150">
                            </el-table-column>
                            <el-table-column
                                prop="customer"
                                label="Khách hàng"
                                min-width="200">
                            </el-table-column>
                            <el-table-column
                                prop="status"
                                label="Trạng thái"
                                width="150">
                            </el-table-column>
                            <el-table-column
                                prop="recentAppointment"
                                label="Cuộc hẹn gần nhất"
                                min-width="200">
                            </el-table-column>
                            <el-table-column
                                prop="control"
                                label="Thao tác"
                                width="120">
                            </el-table-column>
                            <el-table-column
                                prop="createUpdate"
                                label="Thông tin tạo chỉnh"
                                width="200">
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style>

</style>