<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Cấu hình lịch hẹn</div>
                    </div> 
                </div>
                <form class="mt-3 mb-5" v-loading="dataLoading" v-on:submit.prevent="submitForm">
                    <div class="row">
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
                                    <div class="col-md-6">
                                        <div class="col-form-label">Thời gian làm việc buổi sáng</div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <el-time-select
                                                    class="w-100"
                                                    v-model="WORKING_TIME_MORNING_START.value"
                                                    :picker-options="{
                                                        start: '00:00',
                                                        step: '00:30',
                                                        end: '12:00',
                                                    }"
                                                    placeholder="Chọn giờ bắt đầu"
                                                ></el-time-select>
                                            </div>
                                            <div class="col-md-6">
                                                <el-time-select
                                                    class="w-100"
                                                    v-model="WORKING_TIME_MORNING_END.value"
                                                    :picker-options="{
                                                        start: '00:00',
                                                        step: '00:30',
                                                        end: '12:00',
                                                    }"
                                                    placeholder="Chọn giờ kết thúc"
                                                ></el-time-select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="col-form-label">Thời gian làm việc buổi chiều</div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <el-time-select
                                                    class="w-100"
                                                    v-model="WORKING_TIME_AFTERNOON_START.value"
                                                    :picker-options="{
                                                        start: '12:00',
                                                        step: '00:30',
                                                        end: '23:30'
                                                    }"
                                                    placeholder="Chọn giờ bắt đầu"
                                                ></el-time-select>
                                            </div>
                                            <div class="col-md-6">
                                                <el-time-select
                                                    class="w-100"
                                                    v-model="WORKING_TIME_AFTERNOON_END.value"
                                                    :picker-options="{
                                                        start: '12:00',
                                                        step: '00:30',
                                                        end: '23:30'
                                                    }"
                                                    placeholder="Chọn giờ kết thúc"
                                                ></el-time-select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="col-form-label">Ngày làm trong tuần</div>
                                        <el-table :data="WORKING_TIME_DAY_OF_WEEK.value" style="width: 100%" border>
                                             <el-table-column label="#" width="80" align="center">
                                                <template slot-scope="scope">
                                                    {{ scope.row.key }}
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="Ngày làm việc" min-width="100">
                                                <template slot-scope="scope">
                                                    {{ scope.row.label }}
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="Buổi làm việc" min-width="150">
                                                <template slot-scope="scope">
                                                    <el-select v-model="scope.row.session" multiple clearable placeholder="Chọn buổi làm việc" :disabled="!scope.row.active">
                                                        <el-option label="Buổi sáng" value="morning"></el-option>
                                                        <el-option label="Buổi chiều" value="afternoon"></el-option>
                                                    </el-select>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="" width="100">
                                                <template slot-scope="scope">
                                                    <el-switch v-model="scope.row.active" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                                </template>
                                            </el-table-column>
                                        </el-table>
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
                                        <el-switch 
                                            active-value="on" 
                                            inactive-value="off" 
                                            active-color="#13ce66" 
                                            inactive-color="#ff4949"
                                            v-model="AUTO_REMIND_APPLY.value"
                                        ></el-switch>
                                        <span style="font-size:14px;font-weight:bold;margin-right:8px;">Áp dụng</span>
                                    </div>
                                    <div class="col-md-5">
                                        <div class="col-form-label">Nhắc trước</div>
                                        <div class="row">
                                            <div class="col-7">
                                                <el-input-number
                                                    class="w-100"
                                                    v-model="AUTO_REMIND_DURATION.value"
                                                    controls-position="right"
                                                    :min="0"
                                                ></el-input-number>
                                            </div>
                                            <div class="col-5">
                                                <el-select v-model="AUTO_REMIND_DURATION_TYPE.value" style="width: 100%">
                                                    <el-option value="day" label="Ngày"></el-option>
                                                    <el-option value="hour" label="Giờ"></el-option>
                                                    <el-option value="minute" label="Phút"></el-option>
                                                </el-select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="col-form-label">Thời gian</div>
                                        <el-time-select
                                            class="w-100"
                                            v-model="AUTO_REMIND_TIME.value"
                                            :picker-options="{
                                                start: '00:00',
                                                step: '00:30',
                                                end: '23:30',
                                            }"
                                            placeholder="Chọn thời gian"
                                            :disabled="AUTO_REMIND_DURATION_TYPE.value != 'day'"
                                        ></el-time-select>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="col-form-label">Gửi đến</div>
                                        <el-select v-model="AUTO_REMIND_TYPE.value">
                                            <el-option label="Email" value="email"></el-option>
                                            <!-- <el-option label="Tin nhắn" value="sms"></el-option> -->
                                            <!-- <el-option label="Tin nhắn và Email" value="smsEmail"></el-option> -->
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-12">
                            <div class="appointmentConfigContent blue">
                                Cấu hình hiện thị
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="appointmentConfigItem" style="font-size:14px;">
                                <div class="row">
                                    <div class="col-3 col-md-2" style="font-weight: bold;">
                                        Trạng thái
                                    </div>
                                    <div class="col-3 col-md-2" style="font-weight: bold;">
                                        Màu nền
                                    </div>
                                    <div class="col-3 col-md-2" style="font-weight: bold;">
                                        Màu chữ
                                    </div>
                                    <div class="col-3 col-md-2" style="font-weight: bold;">
                                        Màu viền
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-3 col-md-2">
                                        <span>{{ DISPLAY_CONFIG_NEW.value.label }}</span>
                                    </div>
                                    <div class="col-3 col-md-2">
                                        <el-color-picker v-model="DISPLAY_CONFIG_NEW.value.backgroundColor"></el-color-picker>
                                    </div>
                                    <div class="col-3 col-md-2">
                                        <el-color-picker v-model="DISPLAY_CONFIG_NEW.value.textColor"></el-color-picker>
                                    </div>
                                    <div class="col-3 col-md-2">
                                        <el-color-picker v-model="DISPLAY_CONFIG_NEW.value.borderColor"></el-color-picker>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-3 col-md-2">
                                        <span>{{ DISPLAY_CONFIG_ARRIVED.value.label }}</span>
                                    </div>
                                    <div class="col-3 col-md-2">
                                        <el-color-picker v-model="DISPLAY_CONFIG_ARRIVED.value.backgroundColor"></el-color-picker>
                                    </div>
                                    <div class="col-3 col-md-2">
                                        <el-color-picker v-model="DISPLAY_CONFIG_ARRIVED.value.textColor"></el-color-picker>
                                    </div>
                                    <div class="col-3 col-md-2">
                                        <el-color-picker v-model="DISPLAY_CONFIG_ARRIVED.value.borderColor"></el-color-picker>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-3 col-md-2">
                                        <span>{{ DISPLAY_CONFIG_NOTARRIVED.value.label }}</span>
                                    </div>
                                    <div class="col-3 col-md-2">
                                        <el-color-picker v-model="DISPLAY_CONFIG_NOTARRIVED.value.backgroundColor"></el-color-picker>
                                    </div>
                                    <div class="col-3 col-md-2">
                                        <el-color-picker v-model="DISPLAY_CONFIG_NOTARRIVED.value.textColor"></el-color-picker>
                                    </div>
                                    <div class="col-3 col-md-2">
                                        <el-color-picker v-model="DISPLAY_CONFIG_NOTARRIVED.value.borderColor"></el-color-picker>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-3 col-md-2">
                                        <span>{{ DISPLAY_CONFIG_COMPLETED.value.label }}</span>
                                    </div>
                                    <div class="col-3 col-md-2">
                                        <el-color-picker v-model="DISPLAY_CONFIG_COMPLETED.value.backgroundColor"></el-color-picker>
                                    </div>
                                    <div class="col-3 col-md-2">
                                        <el-color-picker v-model="DISPLAY_CONFIG_COMPLETED.value.textColor"></el-color-picker>
                                    </div>
                                    <div class="col-3 col-md-2">
                                        <el-color-picker v-model="DISPLAY_CONFIG_COMPLETED.value.borderColor"></el-color-picker>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-3 col-md-2">
                                        <span>{{ DISPLAY_CONFIG_CANCELLED.value.label }}</span>
                                    </div>
                                    <div class="col-3 col-md-2">
                                        <el-color-picker v-model="DISPLAY_CONFIG_CANCELLED.value.backgroundColor"></el-color-picker>
                                    </div>
                                    <div class="col-3 col-md-2">
                                        <el-color-picker v-model="DISPLAY_CONFIG_CANCELLED.value.textColor"></el-color-picker>
                                    </div>
                                    <div class="col-3 col-md-2">
                                        <el-color-picker v-model="DISPLAY_CONFIG_CANCELLED.value.borderColor"></el-color-picker>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-4">
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
import { appointmentStatus } from '@/utils/masterData';
export default {
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data(){
        return {
            dataLoading: true,
            WORKING_TIME_MORNING_START: {
                key: 'WORKING_TIME_MORNING_START',
                value: "07:00",
            },
            WORKING_TIME_MORNING_END: {
                key: 'WORKING_TIME_MORNING_END',
                value: "11:00",
            },
            WORKING_TIME_AFTERNOON_START: {
                key: 'WORKING_TIME_AFTERNOON_START',
                value: "13:00",
            },
            WORKING_TIME_AFTERNOON_END: {
                key: 'WORKING_TIME_AFTERNOON_END',
                value: "20:00",
            },
            WORKING_TIME_DAY_OF_WEEK: {
                key: 'WORKING_TIME_DAY_OF_WEEK',
                value: [
                    {
                        key: 1,
                        label: 'Thứ hai',
                        active: true,
                        session: [
                            'morning',
                            'afternoon'
                        ]
                    },
                    {
                        key: 2,
                        label: 'Thứ ba',
                        active: true,
                        session: [
                            'morning',
                            'afternoon'
                        ]
                    },
                    {
                        key: 3,
                        label: 'Thứ tư',
                        active: true,
                        session: [
                            'morning',
                            'afternoon'
                        ]
                    },
                    {
                        key: 4,
                        label: 'Thứ năm',
                        active: true,
                        session: [
                            'morning',
                            'afternoon'
                        ]
                    },
                    {
                        key: 5,
                        label: 'Thứ sáu',
                        active: true,
                        session: [
                            'morning',
                            'afternoon'
                        ]
                    },
                    {
                        key: 6,
                        label: 'Thứ bảy',
                        active: true,
                        session: [
                            'morning'
                        ]
                    },
                    {
                        key: 0,
                        label: 'Chủ nhật',
                        active: false,
                        session: []
                    },
                ],
            },
            AUTO_REMIND_APPLY: {
                key: 'AUTO_REMIND_APPLY',
                value: "on",
            },
            AUTO_REMIND_DURATION: {
                key: 'AUTO_REMIND_DURATION',
                value: "1",
            },
            AUTO_REMIND_TIME: {
                key: 'AUTO_REMIND_TIME',
                value: "07:00",
            },
            AUTO_REMIND_DURATION_TYPE: {
                key: 'AUTO_REMIND_DURATION_TYPE',
                value: "day",
            },
            AUTO_REMIND_TYPE: {
                key: 'AUTO_REMIND_TYPE',
                value: "email",
            },
            DISPLAY_CONFIG_NEW: {
                key: 'DISPLAY_CONFIG_NEW',
                value: {
                    label: 'Mới',
                    value: 'new',
                    backgroundColor: "#ecf5ff",
                    textColor: "#409eff",
                    borderColor: "#d9ecff"
                },
            },
            DISPLAY_CONFIG_ARRIVED: {
                key: 'DISPLAY_CONFIG_ARRIVED',
                value: {
                    label: 'Đã đến',
                    value: 'arrived',
                    backgroundColor: '#fff9ae',
                    borderColor: '#fff9ae',
                    textColor: '#f8ed62'
                },
            },
            DISPLAY_CONFIG_NOTARRIVED: {
                key: 'DISPLAY_CONFIG_NOTARRIVED',
                value: {
                    label: 'Không đến',
                    value: 'notarrived',
                    backgroundColor: '#fef0f0',
                    borderColor: '#fde2e2',
                    textColor: '#f56c6c'
                },
            },
            DISPLAY_CONFIG_COMPLETED: {
                key: 'DISPLAY_CONFIG_COMPLETED',
                value: {
                    label: 'Hoàn thành',
                    value: 'completed',
                    backgroundColor: "#f0f9eb",
                    borderColor: '#e1f3d8',
                    textColor: '#67c23a'
                },
            },
            DISPLAY_CONFIG_CANCELLED: {
                key: 'DISPLAY_CONFIG_CANCELLED',
                value: {
                    label: 'Đã hủy',
                    value: 'cancelled',
                    backgroundColor: "#f4f4f5",
                    borderColor: "#e9e9eb",
                    textColor: "#909399"
                },
            },
        }
    },
    async created(){
        const _this = this;
        await _this.getData();
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
            try{
                const response = await _this.$axios.$post('/api/appointmentConfig/update', [
                    _this.WORKING_TIME_MORNING_START,
                    _this.WORKING_TIME_MORNING_END,
                    _this.WORKING_TIME_AFTERNOON_START,
                    _this.WORKING_TIME_AFTERNOON_END,
                    {
                        key: _this.WORKING_TIME_DAY_OF_WEEK.key,
                        value: JSON.stringify(_this.WORKING_TIME_DAY_OF_WEEK.value),
                    },
                    _this.AUTO_REMIND_APPLY,
                    _this.AUTO_REMIND_DURATION,
                    _this.AUTO_REMIND_DURATION_TYPE,
                    _this.AUTO_REMIND_TIME,
                    _this.AUTO_REMIND_TYPE,
                    {
                        key: _this.DISPLAY_CONFIG_NEW.key,
                        value: JSON.stringify(_this.DISPLAY_CONFIG_NEW.value),
                    },
                    {
                        key: _this.DISPLAY_CONFIG_ARRIVED.key,
                        value: JSON.stringify(_this.DISPLAY_CONFIG_ARRIVED.value),
                    },
                    {
                        key: _this.DISPLAY_CONFIG_NOTARRIVED.key,
                        value: JSON.stringify(_this.DISPLAY_CONFIG_NOTARRIVED.value),
                    },
                    {
                        key: _this.DISPLAY_CONFIG_COMPLETED.key,
                        value: JSON.stringify(_this.DISPLAY_CONFIG_COMPLETED.value),
                    },
                    {
                        key: _this.DISPLAY_CONFIG_CANCELLED.key,
                        value: JSON.stringify(_this.DISPLAY_CONFIG_CANCELLED.value),
                    },
                ]);
                if (response.success) {
                    _this.$message({
                        message: response.message,
                        type: 'success',
                    });
                    _this.getData();
                } else {
                    _this.$message.error(response.error);
                }
            }
            catch(err){
                console.log(error);
                _this.$message.error(error);
            }
            _this.dataLoading = false;
        }),
        async getData(){
            const _this = this;
            _this.dataLoading = true;
            try{
                // const [
                //     WORKING_TIME_MORNING_START,
                //     WORKING_TIME_MORNING_END,
                //     WORKING_TIME_AFTERNOON_START,
                //     WORKING_TIME_AFTERNOON_END,
                //     WORKING_TIME_DAY_OF_WEEK,
                //     AUTO_REMIND_APPLY,
                //     AUTO_REMIND_DURATION,
                //     AUTO_REMIND_DURATION_TYPE,
                //     AUTO_REMIND_TYPE,
                //     DISPLAY_CONFIG_NEW,
                //     DISPLAY_CONFIG_ARRIVED,
                //     DISPLAY_CONFIG_NOTARRIVED,
                //     DISPLAY_CONFIG_COMPLETED,
                //     DISPLAY_CONFIG_CANCELLED
                // ] = await Promise.all([
                //     _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=${_this.WORKING_TIME_MORNING_START.key}`),
                //     _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=${_this.WORKING_TIME_MORNING_END.key}`),
                //     _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=${_this.WORKING_TIME_AFTERNOON_START.key}`),
                //     _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=${_this.WORKING_TIME_AFTERNOON_END.key}`),
                //     _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=${_this.WORKING_TIME_DAY_OF_WEEK.key}`),
                //     _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=${_this.AUTO_REMIND_APPLY.key}`),
                //     _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=${_this.AUTO_REMIND_DURATION.key}`),
                //     _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=${_this.AUTO_REMIND_DURATION_TYPE.key}`),
                //     _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=${_this.AUTO_REMIND_TYPE.key}`),
                //     _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=${_this.DISPLAY_CONFIG_NEW.key}`),
                //     _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=${_this.DISPLAY_CONFIG_ARRIVED.key}`),
                //     _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=${_this.DISPLAY_CONFIG_NOTARRIVED.key}`),
                //     _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=${_this.DISPLAY_CONFIG_COMPLETED.key}`),
                //     _this.$axios.$post(`/api/appointmentConfig/getDataByKey?key=${_this.DISPLAY_CONFIG_CANCELLED.key}`)
                // ]);

                const configs = await _this.$axios.$post(`/api/appointmentConfig/getDataByListKey`, [
                    _this.WORKING_TIME_MORNING_START.key,
                    _this.WORKING_TIME_MORNING_END.key,
                    _this.WORKING_TIME_AFTERNOON_START.key,
                    _this.WORKING_TIME_AFTERNOON_END.key,
                    _this.WORKING_TIME_DAY_OF_WEEK.key,
                    _this.AUTO_REMIND_APPLY.key,
                    _this.AUTO_REMIND_DURATION.key,
                    _this.AUTO_REMIND_DURATION_TYPE.key,
                    _this.AUTO_REMIND_TIME.key,
                    _this.AUTO_REMIND_TYPE.key,
                    _this.DISPLAY_CONFIG_NEW.key,
                    _this.DISPLAY_CONFIG_ARRIVED.key,
                    _this.DISPLAY_CONFIG_NOTARRIVED.key,
                    _this.DISPLAY_CONFIG_COMPLETED.key,
                    _this.DISPLAY_CONFIG_CANCELLED.key
                ]);

                if(configs && configs.length > 0){
                    _this.WORKING_TIME_MORNING_START = _.find(configs, f => {
                        return f.key === _this.WORKING_TIME_MORNING_START.key;
                    });
                    _this.WORKING_TIME_MORNING_END = _.find(configs, f => {
                        return f.key === _this.WORKING_TIME_MORNING_END.key;
                    });
                    _this.WORKING_TIME_AFTERNOON_START = _.find(configs, f => {
                        return f.key === _this.WORKING_TIME_AFTERNOON_START.key;
                    });
                    _this.WORKING_TIME_AFTERNOON_END = _.find(configs, f => {
                        return f.key === _this.WORKING_TIME_AFTERNOON_END.key;
                    });
                    _this.WORKING_TIME_DAY_OF_WEEK = _.find(configs, f => {
                        return f.key === _this.WORKING_TIME_DAY_OF_WEEK.key;
                    });
                    _this.WORKING_TIME_DAY_OF_WEEK.value = JSON.parse(_this.WORKING_TIME_DAY_OF_WEEK.value);
                    _this.AUTO_REMIND_APPLY = _.find(configs, f => {
                        return f.key === _this.AUTO_REMIND_APPLY.key;
                    });
                    _this.AUTO_REMIND_DURATION = _.find(configs, f => {
                        return f.key === _this.AUTO_REMIND_DURATION.key;
                    });
                    _this.AUTO_REMIND_DURATION_TYPE = _.find(configs, f => {
                        return f.key === _this.AUTO_REMIND_DURATION_TYPE.key;
                    });
                    _this.AUTO_REMIND_TIME = _.find(configs, f => {
                        return f.key === _this.AUTO_REMIND_TIME.key;
                    });
                    _this.AUTO_REMIND_TYPE = _.find(configs, f => {
                        return f.key === _this.AUTO_REMIND_TYPE.key;
                    });
                    _this.DISPLAY_CONFIG_NEW = _.find(configs, f => {
                        return f.key === _this.DISPLAY_CONFIG_NEW.key;
                    });
                    _this.DISPLAY_CONFIG_NEW.value = JSON.parse(_this.DISPLAY_CONFIG_NEW.value);
                    _this.DISPLAY_CONFIG_ARRIVED = _.find(configs, f => {
                        return f.key === _this.DISPLAY_CONFIG_ARRIVED.key;
                    });
                    _this.DISPLAY_CONFIG_ARRIVED.value = JSON.parse(_this.DISPLAY_CONFIG_ARRIVED.value);
                    _this.DISPLAY_CONFIG_NOTARRIVED = _.find(configs, f => {
                        return f.key === _this.DISPLAY_CONFIG_NOTARRIVED.key;
                    });
                    _this.DISPLAY_CONFIG_NOTARRIVED.value = JSON.parse(_this.DISPLAY_CONFIG_NOTARRIVED.value);
                    _this.DISPLAY_CONFIG_COMPLETED = _.find(configs, f => {
                        return f.key === _this.DISPLAY_CONFIG_COMPLETED.key;
                    });
                    _this.DISPLAY_CONFIG_COMPLETED.value = JSON.parse(_this.DISPLAY_CONFIG_COMPLETED.value);
                    _this.DISPLAY_CONFIG_CANCELLED = _.find(configs, f => {
                        return f.key === _this.DISPLAY_CONFIG_CANCELLED.key;
                    });
                    _this.DISPLAY_CONFIG_CANCELLED.value = JSON.parse(_this.DISPLAY_CONFIG_CANCELLED.value);
                }
            }
            catch(err){
                console.log(err);
                _this.$message.error(err);
            }
            _this.dataLoading = false;
        }
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
.appointmentConfigContent.blue{
    background-color: #659be0;
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