<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Cấu hình chung</div>
                    </div>
                </div>
                <div class="row mt-3 mb-4">
                    <div class="col-md-12">
                        <el-tabs v-loading="dataLoading" v-model="activeName">
                            <el-tab-pane v-for="tab in generalCategory" :key="tab.key" :label="tab.label || ''" :name="tab.key">
                                <div v-for="type in tab.group" :key="type.key">
                                    <el-collapse id="custome-el-colapse" accordion class="percent-100" style="border: none;">
                                        <el-collapse-item name="1" class="mb-1">
                                            <template slot="title">
												<div class="pl-2 w-100 text-black">{{ type.label }}</div>
											</template>
                                            <div class="row mt-3">
                                                <div class="col-md-12">
                                                    <button
                                                        v-if="(checkRight('create'))"
                                                        type="button" 
                                                        class="control-btn blue" 
                                                        @click="addGeneralConfig(type.key)"
                                                    >
                                                        <i class='bx bx-plus' ></i>
                                                        <span>Thêm</span>
                                                    </button>
                                                    <button
                                                        v-if="(checkRight('update'))"
                                                        type="button" 
                                                        class="control-btn green" 
                                                        @click="onSaveGeneralConfig(type.key)"
                                                    >
                                                        <i class='bx bx-save' ></i>
                                                        <span>Lưu</span>
                                                    </button>
                                                    <button
                                                        v-if="(checkRight('update'))"
                                                        type="button" 
                                                        class="control-btn gray" 
                                                        @click="cancelGeneralConfig(type.key)"
                                                    >
                                                        <i class='bx bx-x'></i>
                                                        <span>Hủy</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="row mt-3">
                                                <div class="col-md-5" style="font-size: 14px; font-weight: bold;">
                                                    {{ type.planHolder }}
                                                </div>
                                                <div v-if="type.pickColor" class="col-md-1" style="font-size: 14px; font-weight: bold;">
                                                    Màu sắc
                                                </div>
                                                <div v-if="type.active" class="col-md-2" style="font-size: 14px; font-weight: bold;">
                                                    Thao tác
                                                </div>
                                            </div>
                                            <div class="row mt-3">
                                                <div class="col-md-12" v-for="(item, index) in data[type.key] || []" :key="index">
                                                    <div class="row mb-3">
                                                        <div class="col-md-5">
                                                            <el-input v-model="item.value"></el-input>
                                                        </div>
                                                        <div class="col-md-1" v-if="type.pickColor">
                                                            <el-color-picker v-model="item.color"></el-color-picker>
                                                        </div>
                                                        <div class="col-md-2 d-flex align-items-center" v-if="type.active">
                                                            <el-switch v-model="item.isActive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </el-collapse-item>
                                    </el-collapse>
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
            activeName: 'customerGeneral',
            generalCategory: generalCategory,
            generalType: [],
            data: {},
            dataLoading: true
        }
    },
    async created() {
        const _this = this;
        _this.generalCategory.forEach(e => {
            e.group.forEach(item => {
                _this.generalType.push(item.key);
            })
        })
        await _this.$axios.$post('/api/generalconfig/getByQuery', { type: '', isActive: null }).then(
            (response) => {
                const mapped = _this.generalType.map((item) => ({ [item]: [] }));
                _this.data = Object.assign({}, ...mapped);
                _this.generalType.map((o) => {
                    return (
                        _this.data[o] = response.data[o] || []
                    );
                });
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
        async cancelGeneralConfig(type){
            const _this = this;
             await _this.$axios.$post('/api/generalconfig/getByQuery', { type: type, isActive: null }).then(
                (response) => {
                    _this.data[type] = response.data[type];
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
        onSaveGeneralConfig: debounce(async function (type) {
            const _this = this;
            _this.dataLoading = true;
            try{
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