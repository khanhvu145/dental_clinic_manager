<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Cấu hình lịch hẹn</div>
                    </div>
                </div>
                <form>
                    <div class="row" style="margin-top: 9px;">
                        <div class="col-md-12" style="text-align: right;">
                            <button
                                v-if="checkRight('create') || checkRight('update')"
                                type="button" 
                                class="control-btn green" 
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
                                    <div class="col-md-12">
                                        <el-checkbox v-model="data.workingTime.apply">Áp dụng</el-checkbox>
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
                                        <el-checkbox v-model="data.autoRemind.apply">Áp dụng</el-checkbox>
                                        <el-checkbox v-model="data.autoRemind.repeat">Lặp lại</el-checkbox>
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
                    <div class="row mt-3">
                        <div class="col-md-12">
                            <div class="appointmentConfigContent red">
                                Cấu hình chung
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="appointmentConfigItem">
                                <div class="row">
                                    <div class="col-md-3">
                                        <div class="col-form-label">Tự động hủy hẹn</div>
                                        <el-input placeholder="0" v-model="data.autoCancelDuration" class="input-with-select" style="text-align:right;" type="number" name="duration">
                                            <el-select v-model="data.autoCancelDurationType" slot="append" style="width:80px;" name="durationType">
                                                <el-option label="Phút" value="minutes"></el-option>
                                                <el-option label="Giờ" value="hours"></el-option>
                                            </el-select>
                                        </el-input>
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
export default {
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data() {
        return {
            data: {
                autoCancelDuration: 30, 
                autoCancelType: 'minutes', 
                workingTime: {
                    apply: true,
                    timeAM: {
                        timeFrom: null,
                        timeTo: null
                    },
                    timePM: {
                        timeFrom: null,
                        timeTo: null
                    },
                    dayOfWeek: [
                        {
                            key: 'monday',
                            label: 'Thứ hai',
                            value: true
                        },
                        {
                            key: 'tuesday',
                            label: 'Thứ ba',
                            value: true
                        },
                        {
                            key: 'wednesday',
                            label: 'Thứ tư',
                            value: true
                        },
                        {
                            key: 'thursday',
                            label: 'Thứ năm',
                            value: true
                        },
                        {
                            key: 'friday',
                            label: 'Thứ sáu',
                            value: true
                        },
                        {
                            key: 'saturday',
                            label: 'Thứ bảy',
                            value: true
                        },
                        {
                            key: 'sunday',
                            label: 'Chủ nhật',
                            value: false
                        },
                    ]
                },
                autoRemind: {
                    apply: true,
                    repeat: true,
                    duration: 1,
                    time: null,
                    type: 'type3'
                }
            }
        }
    },
    async created() {

    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['appointmentConfig.all', 'appointmentConfig.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
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
    background-color: rgb(30, 224, 160);
}
.appointmentConfigItem{
    border: 1px solid rgb(219, 219, 219);
    border-top: none;
    padding: 12px 24px;
}
</style>