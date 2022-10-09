<template>
    <div class="wrapper">
        <div class="content">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">
                            <nuxt-link to="/customer" class="sidebar-nav-link" style="color:#364d67">Quản lý khách hàng</nuxt-link>
                            <span> / </span> <span>Thêm</span>
                        </div>
                    </div>
                </div>
                <form class="row mt-4 mb-5" v-loading="dataLoading" v-on:submit.prevent="submitForm">
                    <div class="col-md-12" style="text-align: right;">
                        <button type="button" class="control-btn gray" @click="$router.push('/customer')">
                            <i class='bx bx-arrow-back'></i>
                            <span>Quay lại</span>
                        </button>
                        <button
                            v-if="(checkRight('create'))"
                            type="button" 
                            class="control-btn green" 
                            @click="submitForm"
                        >
                            <i class='bx bx-save' ></i>
                            <span>Lưu</span>
                        </button>
                    </div>
                    <div class="col-md-3 mt-4">
                        <ImageUpload v-if="!dataLoading || formData.imageFile" :value="formData.img" @input="(newValue) => {formData.imageFile = newValue;}"></ImageUpload>
                    </div>
                    <div class="col-md-9 mt-4">
                        <div class="row">
                            <div class="col-md-10">
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="col-form-label">Họ và tên *</div>
                                        <el-input 
                                            name="name"
                                            placeholder="Họ và tên"
                                            v-model="formData.name"
                                        ></el-input>
                                    </div>
                                    <div class="col-md-4" style="display: flex; align-items: center;">
                                        <div class="mt-4">
                                            <el-switch v-model="formData.isActive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                            Hoạt động
                                        </div>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-4">
                                        <div class="col-form-label">CMND/CCCD *</div>
                                        <el-input 
                                            name="physicalId"
                                            placeholder="CMND/CCCD"
                                            v-model="formData.physicalId"
                                        ></el-input>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="col-form-label">Ngày cấp</div>
                                        <el-date-picker
                                            v-model="formData.dateOfIssue"
                                            type="date"
                                            name="dateOfIssue"
                                            format="dd/MM/yyyy"
                                            placeholder="Ngày/tháng/năm"
                                        ></el-date-picker>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="col-form-label">Nơi cấp</div>
                                        <el-input 
                                            name="placeOfIssue"
                                            placeholder="Nơi cấp"
                                            v-model="formData.placeOfIssue"
                                        ></el-input>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <div class="col-form-label">Số điện thoại *</div>
                                        <el-input
                                            name="phone"
                                            placeholder="Số điện thoại"
                                            v-model="formData.phone"
                                        ></el-input>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="col-form-label">Email</div>
                                        <el-input
                                            name="email"
                                            placeholder="Email"
                                            v-model="formData.email"
                                        ></el-input>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <div class="col-form-label">Ngày sinh</div>
                                        <el-date-picker
                                            v-model="formData.birthday"
                                            type="date"
                                            name="birthday"
                                            format="dd/MM/yyyy"
                                            placeholder="Ngày/tháng/năm"
                                        ></el-date-picker>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="col-form-label">Giới tính</div>
                                        <el-select v-model="formData.gender" placeholder="Giới tính" name="gender">
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
                                            placeholder="Số nhà, đường, khu phố"
                                            v-model="formData.address.building"
                                        ></el-input>
                                    </div>
                                    <div class="col-md-6">
                                        <el-select v-model="formData.address.provinceId" filterable clearable placeholder="Tỉnh/Thành phố" name="provinceId" v-on:change="onSelectProvince($event)">
                                            <el-option
                                                v-for="item in provinceMasterData"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-6 mt-4">
                                        <el-select v-model="formData.address.districtId" filterable clearable placeholder="Quận/Huyện" name="districtId" v-on:change="onSelectDistrict($event)" :disabled="formData.address.provinceId ? false : true">
                                            <el-option
                                                v-for="item in districtByProvince"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-6 mt-4">
                                        <el-select v-model="formData.address.wardId" filterable clearable placeholder="Phường/Xã/Ấp" name="wardId" :disabled="formData.address.districtId ? false : true">
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
                                    <div class="col-md-6">
                                        <div class="col-form-label">Nhóm khách hàng</div>
                                        <el-select v-model="formData.customerGroup" placeholder="Nhóm khách hàng" name="customerGroup">
                                            <el-option
                                                v-for="item in customerType"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="col-form-label">Nguồn</div>
                                        <el-select v-model="formData.source" placeholder="Nguồn" name="source">
                                            <el-option
                                                v-for="item in customerSource"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
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
import { cloneDeep, debounce, intersection } from 'lodash';
import { genderData } from '@/utils/masterData';
import ImageUpload from '@/components/common/ImageUpload.vue';
import Customer from '@/models/tw_Customer';
import buildFormData from '@/utils/buildFormData';
export default {
    components: { ImageUpload },
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data() {
        return {
            dataLoading: true,
            genderData: genderData,
            formData: new Customer(),
            provinceMasterData: [],
            districtMasterData: [],
            districtByProvince: [],
            wardMasterData: [],
            wardByDistrict: [],
            customerType: [],
            customerSource: []
        }
    },
    mounted() {
        
    },
    async created(){
        const _this = this;
        _this.provinceMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'provinceMasterData' })) || [];
        _this.districtMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'districtMasterData' })) || [];
        _this.wardMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'wardMasterData' })) || [];
        _this.customerType = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigCustomerType' })) || [];
        _this.customerSource = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigCustomerSource' })) || [];

        _this.dataLoading = false;
    },
     methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['customer.all', 'customer.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        onSelectProvince(value, check = true) {
            const _this = this;
            if(check) {
                _this.formData.address.districtId = null;
                _this.formData.address.wardId = null;
            }
            _this.districtByProvince = _.filter([..._this.districtMasterData] || [], {'province_code': value});
		},
        onSelectDistrict(value, check = true) {
            const _this = this;
            if(check) {
                _this.formData.address.wardId = null;
            }
            _this.wardByDistrict = _.filter([..._this.wardMasterData] || [], {'district_code': value});
		},
        submitForm: debounce(async function () {
            const _this = this;
            _this.dataLoading = true;
            _this.formData.createdBy = _this.userInfo.data.username;
            var oldData = cloneDeep(_this.formData);
            var newData = new FormData();
            buildFormData(newData, oldData);
            const data = await _this.$axios.$post('/api/customer/create', newData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (data.success) {
                _this.formData = data.data;
                _this.$message({
                    message: data.message,
                    type: 'success',
                });
                _this.$router.push(`/customer/${data.data._id}/profile`);
            } else {
                _this.$message.error(data.error);
            }
            _this.dataLoading = false;
        })
     }
}
</script>