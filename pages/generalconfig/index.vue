<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Cấu hình chung</div>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-md-12">
                        <el-tabs v-loading="dataLoading" v-model="activeName">
                            <el-tab-pane v-for="tab in generalCategory" :key="tab.key" :label="tab.label || ''" :name="tab.key">
                                <div class="row">
                                    <div class="col-md-12">
                                        <button
                                            v-if="(checkRight('create'))"
                                            type="button" 
                                            class="control-btn gray" 
                                            @click="addGeneralConfig(tab.key)"
                                        >
                                            <i class='bx bx-plus' ></i>
                                            <span>Thêm</span>
                                        </button>
                                        <button
                                            v-if="(checkRight('update'))"
                                            type="button" 
                                            class="control-btn green" 
                                            @click="onSaveGeneralConfig(tab.key)"
                                        >
                                            <i class='bx bx-save' ></i>
                                            <span>Lưu</span>
                                        </button>
                                    </div>
                                </div>
                                <div class="row mt-4">
                                    <div class="col-md-4" style="font-size: 14px; font-weight: bold;">
                                        {{ tab.planHolder }}
                                    </div>
                                    <div v-if="tab.pickColor" class="col-md-1" style="font-size: 14px; font-weight: bold;">
                                        Màu sắc
                                    </div>
                                    <div v-if="tab.active" class="col-md-2" style="font-size: 14px; font-weight: bold;">
                                        Thao tác
                                    </div>
                                </div>
                                <div class="row mt-4">
                                    <div class="col-md-12" v-for="(item, index) in data[tab.key] || []" :key="index">
                                        <div class="row mb-3">
                                            <div class="col-md-4">
                                                <el-input v-model="item.value"></el-input>
                                            </div>
                                            <div class="col-md-1" v-if="tab.pickColor">
                                                <el-color-picker v-model="item.color"></el-color-picker>
                                            </div>
                                            <div class="col-md-2 d-flex align-items-center" v-if="tab.active">
                                                <el-switch v-model="item.isActive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { generalCategory } from '@/utils/masterData';
import { debounce, map, cloneDeep, intersection, filter, find, forEach } from 'lodash';
export default {
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data() {
        return {
            activeName: 'customer_type',
            generalCategory: generalCategory,
            data: {},
            dataLoading: true
        }
    },
    async created() {
        const _this = this;
        await _this.$axios.$post('/api/generalconfig/getByQuery', { type: '', isActive: null }).then(
            (response) => {
                const mapped = _this.generalCategory.map((item) => {
                    return {
                        [item.key]: response.data[item.key] || []
                    }
                });
                _this.data = Object.assign({}, ...mapped);
                _this. dataLoading = false;
            },
            (error) => {
                console.log('Error: ', error);
                _this.$message({
                    type: 'error',
                    message: 'Có lỗi xảy ra',
                });
                _this. dataLoading = false;
            }
        );

    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['generalconfig.all', 'generalconfig.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        addGeneralConfig(type) {
			const _this = this;
			_this.data[type].push({
				_id: null,
				type: type,
				value: '',
				color: '#ffffff',
				isActive: true,
                createdBy: _this.userInfo.data.username
			});
		},
        onSaveGeneralConfig: debounce(async function (type) {
            const _this = this;
            var isValid = true;
            _this.data[type].forEach(function (item) {
                if (item.value === '') {
					isValid = false;
				}
            })

            if(isValid) {
                const response = await _this.$axios.post('/api/generalconfig/update', _this.data[type]);
                if (response.data.success) {
					_this.$message({
						message: response.data.message,
						type: 'success',
					});
					_this.data[type] = response.data.data;
				} else {
					_this.$message.error(response.data.error);
				}
            }
            else {
                _this.$message({
					type: 'error',
					message: 'Vui lòng nhập đầy đủ thông tin',
				});
            }
        })
    }
}
</script>