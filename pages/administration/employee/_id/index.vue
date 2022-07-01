<template>
    <div class="wrapper">
        <div class="content">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">
                            <nuxt-link to="/administration/employee" class="sidebar-nav-link" style="color:#364d67">Nhân viên</nuxt-link>
                            <span> / </span> <span>{{titleType}}</span>
                        </div>
                    </div>
                </div>
                <form class="row mt-4 mb-5">
                    <div class="col-md-12" style="text-align: right;">
                        <button type="button" class="control-btn gray" @click="$router.go(-1)">
                            <i class='bx bx-arrow-back'></i>
                            <span>Quay lại</span>
                        </button>
                        <button type="button" class="control-btn green">
                            <i class='bx bx-save' ></i>
                            <span>Lưu</span>
                        </button>
                    </div>
                    <div class="col-md-3 mt-4">
                        <ImageUpload></ImageUpload>
                    </div>
                    <div class="col-md-9 mt-4">
                        <div class="row">
                            <div class="col-md-10">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="col-form-label">Mã nhân viên</div>
                                        <el-input 
                                            name="code"
                                            v-model="employeeData.code"
                                            :disabled="true"
                                        ></el-input>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="col-form-label">Họ và tên *</div>
                                        <el-input 
                                            name="name"
                                            v-validate="'required'"
                                            data-vv-as="Họ và tên"
                                            placeholder="Họ và tên"
                                            v-model="employeeData.name"
                                        ></el-input>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <div class="col-form-label">Tài khoản *</div>
                                        <el-input 
                                            name="username"
                                            v-validate="'required'"
                                            data-vv-as="Tài khoản"
                                            placeholder="Tài khoản"
                                            v-model="accountData.username"
                                            :disabled="true"
                                            v-if="titleType == 'Sửa'"
                                        ></el-input>
                                        <el-input 
                                            name="username"
                                            v-validate="'required'"
                                            data-vv-as="Tài khoản"
                                            placeholder="Tài khoản"
                                            v-model="accountData.username"
                                            v-else
                                        ></el-input>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="col-form-label">Mật khẩu *</div>
                                        <el-input 
                                            name="password"
                                            v-validate="'required'"
                                            data-vv-as="Mật khẩu"
                                            placeholder="Mật khẩu"
                                            v-model="accountData.password"
                                            show-password
                                        ></el-input>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-4">
                                        <div class="col-form-label">CMND/CCCD *</div>
                                        <el-input 
                                            name="physicalId"
                                            v-validate="'required'"
                                            data-vv-as="CMND/CCCD"
                                            placeholder="CMND/CCCD"
                                            v-model="employeeData.physicalId"
                                        ></el-input>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="col-form-label">Ngày cấp</div>
                                        <el-date-picker
                                            v-model="employeeData.dateOfIssue"
                                            type="date"
                                            name="dateOfIssue"
                                            format="dd/MM/yyyy"
                                            value-format="dd/MM/yyyy"
                                            placeholder="Ngày/tháng/năm"
                                        ></el-date-picker>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="col-form-label">Nơi cấp</div>
                                        <el-input 
                                            name="placeOfIssue"
                                            data-vv-as="Nơi cấp"
                                            placeholder="Nơi cấp"
                                            v-model="employeeData.placeOfIssue"
                                        ></el-input>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <div class="col-form-label">Số điện thoại *</div>
                                        <el-input
                                            name="phone"
                                            v-validate="'required'"
                                            data-vv-as="Số điện thoại"
                                            placeholder="Số điện thoại"
                                            v-model="employeeData.phone"
                                        ></el-input>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="col-form-label">Email</div>
                                        <el-input
                                            name="email"
                                            v-validate="'required'"
                                            data-vv-as="Email"
                                            placeholder="Email"
                                            v-model="employeeData.email"
                                        ></el-input>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <div class="col-form-label">Ngày sinh</div>
                                        <el-date-picker
                                            v-model="employeeData.birthday"
                                            type="date"
                                            name="birthday"
                                            format="dd/MM/yyyy"
                                            value-format="dd/MM/yyyy"
                                            placeholder="Ngày/tháng/năm"
                                        ></el-date-picker>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="col-form-label">Giới tính</div>
                                        <el-select v-model="employeeData.gender" placeholder="Giới tính" name="gender" data-vv-as="Giới tính">
                                            <el-option
                                                v-for="item in genderData"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-12">
                                        <div class="col-form-label">Địa chỉ</div>
                                    </div>
                                    <div class="col-md-6">
                                        <el-input
                                            name="building"
                                            v-validate="'required'"
                                            data-vv-as="Số nhà, đường, khu phố"
                                            placeholder="Số nhà, đường, khu phố"
                                            v-model="employeeData.address.building"
                                        ></el-input>
                                    </div>
                                    <div class="col-md-6">
                                        <el-select v-model="employeeData.address.provinceId" clearable filterable placeholder="Tỉnh/Thành phố" name="provinceId" v-validate="'required'" v-on:change="onSelectProvince($event)">
                                            <el-option
                                                v-for="item in provinceMasterData"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-6 mt-4">
                                        <el-select v-model="employeeData.address.districtId" clearable filterable placeholder="Quận/Huyện" name="districtId" v-validate="'required'" v-on:change="onSelectDistrict($event)" :disabled="employeeData.address.provinceId ? false : true">
                                            <el-option
                                                v-for="item in districtByProvince"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-6 mt-4">
                                        <el-select v-model="employeeData.address.wardId" clearable filterable placeholder="Phường/Xã/Ấp" name="wardId" v-validate="'required'" :disabled="employeeData.address.districtId ? false : true">
                                            <el-option
                                                v-for="item in wardByDistrict"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-4">
                                        <div class="col-form-label">Chức vụ *</div>
                                        <el-select v-model="employeeData.position" placeholder="Chức vụ" name="position" data-vv-as="Chức vụ">
                                            <el-option
                                                v-for="item in positionMasterData"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="col-form-label">Quyền tài khoản *</div>
                                        <el-select v-model="accountData.roleId" placeholder="Quyền tài khoản" name="roleId" data-vv-as="Quyền tài khoản">
                                            <el-option
                                                v-for="item in roleMasterData"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-4" style="display: flex; align-items: center;">
                                        <div class="mt-4">
                                            <el-switch v-model="employeeData.isActive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                            Hoạt động
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { genderData } from '@/utils/masterData';
import ImageUpload from '@/components/common/ImageUpload.vue';
import Employee from '@/models/Employee';
import Account from '@/models/Account';

export default {
    layout: 'admin',
    name: 'EmployeeCreateUpdate',
    components: { ImageUpload },
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
		}),
	},
    data() {
      return {
        isAvatar: false,
        genderData: genderData,
        titleType: '',
        employeeData: new Employee(),
        accountData: new Account(),
        positionMasterData: [],
        roleMasterData: [],
        provinceMasterData: [],
        districtMasterData: [],
        districtByProvince: [],
        wardMasterData: [],
        wardByDistrict: [],
      };
    },
    async created() {
        const _this = this;
        _this.provinceMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'provinceMasterData' })) || [];
        _this.districtMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'districtMasterData' })) || [];
        _this.wardMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'wardMasterData' })) || [];
        _this.roleMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'roleMasterData' })) || [];
        _this.positionMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'positionMasterData' })) || [];
    },
    mounted() {
        if(this.$nuxt.$route.params.id == 'create') this.titleType = 'Thêm';
        else this.titleType = 'Sửa';
    },
	methods: {
        onSelectProvince(value) {
            const _this = this;
            _this.employeeData.address.districtId = null;
            _this.employeeData.address.wardId = null;
            _this.districtByProvince = _.filter([..._this.districtMasterData] || [], {'province_code': value});
		},
        onSelectDistrict(value) {
            const _this = this;
            _this.employeeData.address.wardId = null;
            _this.wardByDistrict = _.filter([..._this.wardMasterData] || [], {'district_code': value});
		},
	}
}
</script>

<style>

</style>