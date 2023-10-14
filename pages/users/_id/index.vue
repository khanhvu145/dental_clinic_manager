<template>
    <div class="wrapper">
        <div class="content">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">
                            <nuxt-link to="/users" class="sidebar-nav-link" style="color:#364d67">Quản lý người dùng</nuxt-link>
                            <span> / </span> <span>{{titleType}}</span>
                        </div>
                    </div>
                </div>
                <form v-loading="dataLoading" class="row mt-4 mb-5" v-on:submit.prevent="submitForm">
                    <div class="col-md-12" style="text-align: right;">
                        <button type="button" class="control-btn gray" @click="$router.push('/users')">
                            <i class='bx bx-arrow-back'></i>
                            <span>Quay lại</span>
                        </button>
                        <button
                            v-if="
                                (checkRight('create') && $route.params.id == 'create') ||
                                (checkRight('update') && $route.params.id != 'create')
                            "
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
                            <div class="col-md-11">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="col-form-label">Mã nhân viên</div>
                                        <el-input 
                                            name="code"
                                            v-model="formData.code"
                                            :disabled="true"
                                        ></el-input>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="col-form-label">Họ và tên *</div>
                                        <el-input 
                                            name="name"
                                            placeholder="Họ và tên"
                                            v-model="formData.name"
                                        ></el-input>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <div class="col-form-label">Tài khoản *</div>
                                        <el-input 
                                            name="username"
                                            placeholder="Tài khoản"
                                            v-model="formData.username"
                                            :disabled="true"
                                            v-if="titleType == 'Sửa'"
                                        ></el-input>
                                        <el-input 
                                            name="username"
                                            placeholder="Tài khoản"
                                            v-model="formData.username"
                                            v-else
                                        ></el-input>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="col-form-label">Mật khẩu *</div>
                                        <el-input 
                                            name="password"
                                            placeholder="Mật khẩu"
                                            value="**********"
                                            show-password
                                            :disabled="true"
                                            v-if="titleType == 'Sửa'"
                                        ></el-input>
                                        <el-input 
                                            name="password"
                                            placeholder="Mật khẩu"
                                            v-model="formData.password"
                                            show-password
                                            v-else
                                        ></el-input>
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
                                    <!-- <div class="col-md-4">
                                        <div class="col-form-label">Chức vụ</div>
                                        <el-select v-model="formData.position" placeholder="Chức vụ" name="position">
                                            <el-option
                                                v-for="item in userPositionData"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div> -->
                                    <div class="col-md-6">
                                        <div class="col-form-label">Nhóm người dùng *</div>
                                        <el-select v-model="formData.accessId" placeholder="Quyền tài khoản" name="accessId">
                                            <el-option
                                                v-for="item in accessMasterData"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="mt-5">
                                                    <el-switch v-model="formData.isDentist" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                                    Nha sĩ
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mt-5">
                                                    <el-switch v-model="formData.isAccountant" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                                    Lễ tân
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mt-5">
                                                    <el-switch v-model="formData.isActive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                                    Hoạt động
                                                </div>
                                            </div>
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
import { cloneDeep, debounce, intersection } from 'lodash';
import { genderData, userPositionData } from '@/utils/masterData';
import ImageUpload from '@/components/common/ImageUpload.vue';
import User from '@/models/tw_User';
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
            titleType: '',
            dataLoading: true,
            genderData: genderData,
            userPositionData: userPositionData,
            formData: new User(),
            accessMasterData: [],
            provinceMasterData: [],
            districtMasterData: [],
            districtByProvince: [],
            wardMasterData: [],
            wardByDistrict: [],
        }
    },
    mounted() {
        if(this.$nuxt.$route.params.id == 'create') this.titleType = 'Thêm';
        else this.titleType = 'Sửa';
    },
    async created(){
        const _this = this;
        _this.provinceMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'provinceMasterData' })) || [];
        _this.districtMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'districtMasterData' })) || [];
        _this.wardMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'wardMasterData' })) || [];
        _this.accessMasterData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'accessMasterData' })) || [];

        if (_this.$route.params.id && _this.$route.params.id != 'create') {
            await _this.$axios.$get(`/api/user/getById/${_this.$route.params.id}`).then(
				async (response) => {
                    _this.formData = response.data || new User();
                    await _this.onSelectProvince(_this.formData.address.provinceId, false);
                    await _this.onSelectDistrict(_this.formData.address.districtId, false);
				},
				(error) => {
                    console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: 'Có lỗi xảy ra',
					});
					 _this.formData = new User();
				}
			);
        }

        _this.dataLoading = false;
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['users.all', 'users.' + right];
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
            try{
                if (_this.$route.params.id != 'create') {
                    _this.formData.updatedBy = _this.userInfo.data.username;
                    var oldData = cloneDeep(_this.formData);
                    var newData = new FormData();
                    buildFormData(newData, oldData);
                    const data = await _this.$axios.$put('/api/user/update', newData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    if (data.success) {
                        _this.formData = data.data;
                        _this.$message({
                            message: data.message,
                            type: 'success',
                        });
                        _this.$router.push(`/users/${data.data._id}`);
                    } else {
                        _this.$message.error(data.error);
                    }
                }
                else{
                    _this.formData.createdBy = _this.userInfo.data.username;
                    var oldData = cloneDeep(_this.formData);
                    var newData = new FormData();
                    buildFormData(newData, oldData);
                    const data = await _this.$axios.$post('/api/user/create', newData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    if (data.success) {
                        _this.formData = data.data;
                        _this.$message({
                            message: data.message,
                            type: 'success',
                        });
                        _this.$router.push(`/users/${data.data._id}`);
                    } else {
                        _this.$message.error(data.error);
                    }
                }
            }
            catch(error){
                console.log('Error: ', error);
                _this.$message({
                    type: 'error',
                    message: error,
                });
            }
            _this.dataLoading = false;
        })
    }
}
</script>