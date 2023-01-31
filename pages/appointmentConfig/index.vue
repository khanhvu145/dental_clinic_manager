<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Cấu hình lịch hẹn</div>
                    </div>
                </div>
                <form v-on:submit.prevent="submitForm">
                    <div class="row" style="margin-top: 9px;">
                        <div class="col-md-12" style="text-align: right;">
                            <button
                                v-if="checkRight('create') || checkRight('update')"
                                type="button" 
                                class="control-btn green" 
                                @click="submitForm"
                            >
                                <i class='bx bx-save' ></i>
                                <span>Lưu cấu hình</span>
                            </button>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-12">
                            <div class="appointmentConfigContent yellow">
                                Thời gian làm việc
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="appointmentConfigItem">
                                <div class="row">
                                    <div class="col-md-12 mb-1">
                                        <el-switch v-model="data.workingTime.apply" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                        <span style="font-size:14px; font-weight:bold;">Áp dụng</span>
                                        <!-- <el-checkbox v-model="data.workingTime.apply">Áp dụng</el-checkbox> -->
                                    </div>
                                    <div class="col-md-4">
                                        <div class="col-form-label">Thời gian làm việc buổi sáng</div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <el-time-select
                                                    v-model="data.workingTime.timeAM.timeFrom"
                                                    :picker-options="{
                                                        start: '00:00',
                                                        step: '00:30',
                                                        end: '12:00'
                                                    }"
                                                    placeholder="Bắt đầu làm">
                                                </el-time-select>
                                            </div>
                                            <div class="col-md-6">
                                                <el-time-select
                                                    v-model="data.workingTime.timeAM.timeTo"
                                                    :picker-options="{
                                                        start: '00:00',
                                                        step: '00:30',
                                                        end: '12:00'
                                                    }"
                                                    placeholder="Kết thúc làm">
                                                </el-time-select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="col-form-label">Thời gian làm việc buổi chiều</div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <el-time-select
                                                    v-model="data.workingTime.timePM.timeFrom"
                                                    :picker-options="{
                                                        start: '12:00',
                                                        step: '00:30',
                                                        end: '24:00'
                                                    }"
                                                    placeholder="Bắt đầu làm">
                                                </el-time-select>
                                            </div>
                                            <div class="col-md-6">
                                                <el-time-select
                                                    v-model="data.workingTime.timePM.timeTo"
                                                    :picker-options="{
                                                        start: '12:00',
                                                        step: '00:30',
                                                        end: '24:00'
                                                    }"
                                                    placeholder="Kết thúc làm">
                                                </el-time-select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="col-form-label">Ngày làm trong tuần</div>
                                        <div class="row">
                                            <div class="col-md-3" v-for="(item, index) in data.workingTime.dayOfWeek" :key="item.key">
                                                <el-checkbox v-model="data.workingTime.dayOfWeek[index].value">
                                                    {{ item.label }}
                                                </el-checkbox>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-12">
                            <div class="appointmentConfigContent green">
                                Cấu hình nhắc hẹn tự động
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="appointmentConfigItem">
                                <div class="row">
                                    <div class="col-md-12">
                                        <el-switch v-model="data.autoRemind.apply" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                        <span style="font-size:14px;font-weight:bold;margin-right:8px;">Áp dụng</span>

                                        <el-switch v-model="data.autoRemind.repeat" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                        <span style="font-size:14px; font-weight:bold;">Lặp lại</span>
                                        <!-- <el-checkbox v-model="data.autoRemind.apply">Áp dụng</el-checkbox> -->
                                        <!-- <el-checkbox v-model="data.autoRemind.repeat">Lặp lại</el-checkbox> -->
                                    </div>
                                    <div class="col-md-3">
                                        <div class="col-form-label">Trước ngày hẹn</div>
                                        <el-input placeholder="0" v-model="data.autoRemind.duration" class="input-with-select" style="text-align:right;" type="number" name="duration">
                                            <div style="width:60px; text-align:center;" slot="append">Ngày</div>
                                        </el-input>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="col-form-label">Thời gian</div>
                                        <el-time-select
                                            v-model="data.autoRemind.time"
                                            :picker-options="{
                                                start: '00:00',
                                                step: '00:30',
                                                end: '24:00'
                                            }"
                                            placeholder="Chọn giờ">
                                        </el-time-select>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="col-form-label">Gửi đến</div>
                                        <el-select v-model="data.autoRemind.type">
                                            <el-option label="Tin nhắn" value="type1"></el-option>
                                            <el-option label="Email" value="type2"></el-option>
                                            <el-option label="Tin nhắn và Email" value="type3"></el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3 mb-5">
                        <div class="col-md-12">
                            <div class="appointmentConfigContent red">
                                Cấu hình hủy hẹn tự động
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="appointmentConfigItem">
                                <div class="row">
                                    <div class="col-md-12">
                                        <el-switch v-model="data.autoCancel.apply" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                        <span style="font-size:14px;font-weight:bold;margin-right:8px;">Áp dụng</span>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="col-form-label">Tự động hủy hẹn sau</div>
                                        <el-input placeholder="0" v-model="data.autoCancel.duration" class="input-with-select" style="text-align:right;" type="number" name="duration">
                                            <el-select v-model="data.autoCancel.type" slot="append" style="width:95px;" name="durationType">
                                                <el-option label="Phút" value="minutes"></el-option>
                                                <el-option label="Giờ" value="hours"></el-option>
                                                <el-option label="Ngày" value="day"></el-option>
                                            </el-select>
                                        </el-input>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="col-form-label">Gửi thông báo cho khách hàng</div>
                                        <el-radio-group v-model="data.autoCancel.notification">
                                            <el-radio-button :label="true">Có</el-radio-button>
                                            <el-radio-button :label="false">Không</el-radio-button>
                                        </el-radio-group>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="col-form-label">Gửi đến</div>
                                        <el-select v-model="data.autoCancel.notificationType">
                                            <el-option label="Tin nhắn" value="type1"></el-option>
                                            <el-option label="Email" value="type2"></el-option>
                                            <el-option label="Tin nhắn và Email" value="type3"></el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div v-else>
            <el-empty description="Bạn không có quyền !!"></el-empty>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { debounce, map, cloneDeep, intersection, filter, find, forEach } from 'lodash';
import AppointmentConfig from '@/models/tw_AppointmentConfig';
export default {
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data() {
        return {
            data: new AppointmentConfig(),
            dataLoading: true
        }
    },
    async created() {
        const _this = this;
        _this.getData();
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['appointmentConfig.all', 'appointmentConfig.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        submitForm: debounce(async function (){
            const _this = this;
            _this.dataLoading = true;

            _this.data.createdBy = _this.userInfo.data.username;
            var newData = cloneDeep(_this.data);
            const data = await _this.$axios.$post('/api/appointmentConfig/createUpdate', newData);
            if (data.success) {
                _this.$message({
                    message: data.message,
                    type: 'success',
                });
                _this.getData();
            } else {
                _this.$message.error(data.error);
            }

            _this.dataLoading = false;
        }),
        async getData(){
            const _this = this;
            await _this.$axios.$get('/api/appointmentConfig/getData').then(
                (response) => {
					_this.data = (response.data.length > 0 && response.data != null) ? response.data[0] : new AppointmentConfig();
                    _this.dataLoading = false;
				},
				(error) => {
					console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: 'Có lỗi xảy ra',
					});
                    _this.dataLoading = false;
				}
            );
        },
    }
}
</script>

<style>
.appointmentConfigContent{
    padding: 12px 16px;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
}
.appointmentConfigContent.yellow{
    background-color: rgb(249, 181, 77);
}
.appointmentConfigContent.green{
    background-color: rgb(30, 224, 160);
}
.appointmentConfigContent.red{
    background-color: #E7505A;
}
.appointmentConfigItem{
    border: 1px solid rgb(219, 219, 219);
    border-top: none;
    padding: 12px 24px;
}
</style>