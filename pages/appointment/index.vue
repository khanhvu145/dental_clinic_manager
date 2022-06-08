<template>
  <div class="wrapper">
    <div class="content">
      <div class="container-fluid">
        <div class="row mt-3">
          <div class="col-md-12">
            <div class="title titleAfter mb-0">Danh sách lịch hẹn</div>
          </div>
        </div>
        <div class="row" style="margin-top: 9px;">
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-2">
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
              <div class="col-md-2">
                <div class="col-form-label">Nha sĩ</div>
                <el-select v-model="input" clearable filterable placeholder="Mã, tên nha sĩ" name="dentistId">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="col-md-3">
                <div class="col-form-label">Ngày hẹn</div>
                <div class="block">
                  <el-date-picker
                    v-model="value1"
                    type="daterange"
                    name="dateAppointment"
                    format="dd/MM/yyyy"
                    value-format="yyyy-MM-dd"
                    range-separator="-"
                    start-placeholder="Từ"
                    end-placeholder="Đến">
                  </el-date-picker>
                </div>
              </div>
              <div class="col-md-3">
                <div class="col-form-label">Trạng thái</div>
                <el-select v-model="input" multiple filterable placeholder="Trạng thái" name="status">
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
                prop="date"
                label="Thời gian"
                resizable
                width="150">
              </el-table-column>
              <el-table-column
                prop="customer"
                label="Khách hàng"
                min-width="200">
              </el-table-column>
              <el-table-column
                prop="patient"
                label="Nha sĩ phụ trách"
                min-width="200">
              </el-table-column>
              <el-table-column
                prop="service"
                label="Dịch vụ sử dụng"
                width="200">
              </el-table-column>
              <el-table-column
                prop="status"
                label="Trạng thái"
                width="120">
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
	data() {
      return {
        input: '',
        value1: '',
        tableData: [],
      };
    },
	methods: {

	}
}
</script>

<style>

</style>