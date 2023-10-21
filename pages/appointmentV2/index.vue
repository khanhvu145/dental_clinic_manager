<template>
    <div class="wrapper">
        <div class="content" v-if="checkRight('view')">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="title titleAfter mb-0">Quản lý lịch hẹn</div>
                    </div>
                </div>
                <div class="row" style="margin-top: 9px;">
                    <div class="col-md-9">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="col-form-label">Mã lịch hẹn</div>
                                <el-input placeholder="Mã lịch hẹn..." v-model="searchQuery.filters.codeF" name="codeF"></el-input>
                            </div>
                            <div class="col-md-4">
                                <div class="col-form-label">Khách hàng</div>
                                <el-input placeholder="Mã, tên, số điện thoại, cmnd/cccd..." v-model="searchQuery.filters.customersF" name="customersF"></el-input>
                            </div>
                            <div class="col-md-4">
                                <div class="col-form-label">Nha sĩ</div>
                                <el-select 
                                    v-model="searchQuery.filters.dentistsF" 
                                    placeholder="Chọn nha sĩ" 
                                    name="dentistsF" 
                                    style="width: 100%"
                                    clearable 
                                    filterable
                                    remote
                                    multiple
                                    :remote-method="(text) => filterDentist(text)"
                                    @focus="filterDentist('')"
                                >
                                    <el-option
                                        v-for="item in dentistData"
                                        :key="item._id"
                                        :label="`Ns ${item.name}`"
                                        :value="item._id"
                                    ></el-option>
                                </el-select>
                            </div>
                            <div class="col-md-5">
                                <div class="col-form-label">Trạng thái</div>
                                <el-select v-model="searchQuery.filters.statusF" placeholder="Trạng thái..." filterable multiple clearable name="statusF">
                                    <el-option
                                        v-for="item in statusData"
                                        :key="item.key"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </div>
                             <div class="col-md-5">
                                <div class="col-form-label">Ngày đặt hẹn</div>
                                <el-date-picker
                                    v-model="searchQuery.filters.dateF"
                                    type="datetimerange"
                                    :picker-options="pickerOptions"
                                    range-separator="-"
                                    start-placeholder="Từ"
                                    end-placeholder="Đến"
                                    align="right"
                                    format="dd/MM/yyyy HH:mm"
                                ></el-date-picker>
                                <!-- <el-date-picker
                                    v-model="searchQuery.filters.dateF"
                                    type="daterange"
                                    range-separator="-"
                                    start-placeholder="Từ ngày"
                                    end-placeholder="Đến ngày"
                                    format="dd/MM/yyyy">
                                </el-date-picker> -->
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div style="display: flex; gap: 8px; margin-top: 36px;">
                            <button type="button" class="control-btn gray" @click="refreshData()">
                                <i class='bx bx-refresh'></i>
                            </button>
                            <button type="button" class="control-btn green" @click="searchData()">
                                <i class='bx bx-search'></i>
                                Tìm
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-md-3 mb-2">
                        <el-select v-model="searchQuery.sorts" filterable name="sorts" v-on:change="onChangeSorts($event)">
                            <template slot="prefix">
                                <i class='el-input__icon bx bx-sort'></i>
                            </template>
                            <el-option
                                v-for="item in sortData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="col-md-3 mb-2">
                        <el-dropdown :hide-on-click="false" trigger="click" style="width:100%;">
                            <el-button class="elButtonCustom" style="width:100%; text-align:left;font-weight:400;padding:12px 10px">
                                <i class="el-icon-view el-icon--left" style="color:#C0C4CC;"></i>
                                Ẩn hiện cột
                                <i class="el-icon-arrow-down el-icon--right" style="float:right;color:#C0C4CC;"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="item in columns" :key="item.name">
                                    <el-checkbox v-model="item.isShow">{{ item.name }}</el-checkbox>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="col-md-6">
                        <div style="text-align:right;">
                            <button v-if="checkRight('sendMail')" class="control-btn mb-2 red" @click="cancelBookingMultiple">
                                <i class='bx bx-calendar-x' ></i>
                            <span>Hủy hẹn</span>
                            </button>
                            <button v-if="checkRight('sendMail')" class="control-btn mb-2 yellow" @click="sendMailMultiple">
                                <i class='bx bx-mail-send'></i>
                                <span>Gửi nhắc hẹn</span>
                            </button>
                            <button v-if="checkRight('sendMail')" class="control-btn mb-2 blue2" @click="confirmBookingMultiple">
                                <i class='bx bx-check'></i>
                                <span>Xác nhận đến khám</span>
                            </button>
                            <button v-if="checkRight('sendMail')" class="control-btn mb-2 blue" @click="completeBookingMultiple">
                                <i class='bx bx-calendar-check'></i>
                                <span>Hoàn thành</span>
                            </button>
                            <button v-if="checkRight('create')" class="control-btn mb-2 green" @click="createAppointment">
                                <i class='bx bx-plus' ></i>
                                <span>Đặt hẹn</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row mt-3">
                    <el-table :data="data.data" v-loading="dataLoading" style="width: 100%" @selection-change="handleSelectionChange" stripe border>
                        <el-table-column type="selection" width="50" align="center"></el-table-column>
                        <el-table-column v-if="columns[0].isShow" :label="columns[0].name" min-width="200">
                            <template slot-scope="scope">
                                <div style="font-weight: bold;"> 
                                    <i class='bx bx-code-alt' ></i>
                                    {{ scope.row.code || '' }}
                                </div>
                                <div> 
                                    <i class='bx bx-calendar-event'></i>
                                    {{ scope.row.date ? $moment(scope.row.date).format('DD/MM/YYYY') : '' }}
                                </div>
                                <div> 
                                    <i class='bx bx-time-five' ></i>
                                    {{ scope.row.timeFrom ? scope.row.timeFrom : '' }} - 
                                    {{ scope.row.timeTo ? scope.row.timeTo : '' }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[1].isShow" :label="columns[1].name" min-width="280">
                            <template slot-scope="scope">
                                <div style="font-weight: bold;">  
                                    <i class='bx bx-user'></i>
                                    {{ '(' + scope.row.mainCustomer.code + ')' || '' }} {{ scope.row.mainCustomer.name || '' }}
                                </div>
                                <div>
                                    <i class='bx bx-id-card'></i>
                                    {{ scope.row.mainCustomer.physicalId || '' }}
                                </div>
                                <div>
                                    <i class='bx bx-calendar-event'></i>
                                    {{ scope.row.mainCustomer.birthday ? $moment(scope.row.mainCustomer.birthday).format('DD/MM/YYYY') : '' }}
                                </div>
                                <div>
                                    <i class='bx bx-phone' ></i>
                                    {{ scope.row.mainCustomer.phone || '' }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[2].isShow" :label="columns[2].name" min-width="280">
                            <template slot-scope="scope">
                                <div style="font-weight: bold; word-break: break-word;">  
                                    <i class='bx bx-user'></i>
                                    {{ '(' + scope.row.dentistCode + ')' || '' }} Ns. {{ scope.row.dentistName || '' }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[6].isShow" :label="columns[6].name" width="100">
                            <template slot-scope="scope">
                                <div class="row" style="width:100%;">
                                    <div v-if="checkRight('view')" class="col-6 mb-1">
                                        <el-tooltip effect="dark" content="Chỉnh sửa" placement="right-start">
                                            <nuxt-link :to="`/appointmentV2/${scope.row._id}`">
                                                <button class="control-btn blue2" style="padding: 4px 6px;">
                                                    <i class="el-icon-edit-outline"></i>
                                                </button>
                                            </nuxt-link>
                                        </el-tooltip>
                                    </div>
                                    <div v-if="checkRight('view')" class="col-6 mb-1">
                                        <el-tooltip effect="dark" content="Xem lịch sử" placement="top-start">
                                            <button class="control-btn yellow" style="padding: 4px 6px;" @click="openDialogLogs(scope.row._id)">
                                                <i class='bx bx-history' ></i>
                                            </button>
                                        </el-tooltip>
                                    </div>
                                    <div 
                                        class="col-md-6 mb-1"
                                        v-if="
                                            checkRight('sendMail') 
                                            && scope.row.status == 'new'
                                        " 
                                    >
                                        <el-tooltip effect="dark" content="Gửi nhắc hẹn" placement="top-start">
                                            <button class="control-btn blue" style="padding: 4px 6px;" @click="sendMail(scope.row._id)">
                                                <i class='bx bx-mail-send'></i>
                                            </button>
                                        </el-tooltip>
                                    </div>
                                    <div class="col-md-6 mb-1">
                                        <el-tooltip effect="dark" content="Gọi điện KH" placement="top-start">
                                            <a class="control-btn green" style="padding: 4px 6px;" :href="`tel:${scope.row.mainCustomer.phone}`">
                                                <i class='bx bx-phone'></i>
                                            </a>
                                        </el-tooltip>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[3].isShow" :label="columns[3].name" min-width="150">
                            <template slot-scope="scope">
                                <div>
                                    <el-tooltip effect="dark" content="Loại lịch hẹn" placement="left">
                                        <div>
                                            <i class='bx bxs-circle'
                                                v-bind:style="{
                                                    color: appointmentType.find(e => e.value == scope.row.type) ? appointmentType.find(e => e.value == scope.row.type).color : '#ccc',
                                                }"
                                            ></i>
                                            {{ appointmentType.find(e => e.value == scope.row.type) ? appointmentType.find(e => e.value == scope.row.type).label : '' }}
                                        </div>
                                    </el-tooltip>
                                </div>
                                <div>
                                    <el-tooltip effect="dark" content="Nội dung lịch hẹn" placement="left">
                                        <div>
                                            <i class='bx bx-notepad'
                                                v-bind:style="{
                                                    color: appointmentContent.find(e => e.value == scope.row.content) ? appointmentContent.find(e => e.value == scope.row.content).color : '#ccc',
                                                }"
                                            ></i>
                                            {{ appointmentContent.find(e => e.value == scope.row.content) ? appointmentContent.find(e => e.value == scope.row.content).label : '' }}
                                        </div>
                                    </el-tooltip>
                                </div>
                                <div>
                                    <el-tooltip effect="dark" content="Ghi chú" placement="left">
                                        <div>
                                            <i class='bx bx-edit' ></i>
                                            {{ scope.row.note || '' }}
                                        </div>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[5].isShow" :label="columns[5].name" min-width="120" align="center" header-align="left">
                            <template slot-scope="scope">
                                <el-tag :style="getValueViewConfig(scope.row.status)">
                                    {{ getStatusName(scope.row.status) }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[7].isShow" :label="columns[7].name" min-width="200">
                            <template slot-scope="scope">
                                <div>{{ scope.row.createdBy || 'System' }}</div>
                                <div>{{ scope.row.createdAt ? $moment(scope.row.createdAt).format('HH:mm DD/MM/YYYY') : '' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="columns[8].isShow" :label="columns[8].name" min-width="200">
                            <template slot-scope="scope">
                                <div>{{ scope.row.updatedBy }}</div>
                                <div>{{ scope.row.updatedAt ? $moment(scope.row.updatedAt).format('HH:mm DD/MM/YYYY') : '' }}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="row mt-4 mb-4">
                    <div class="col-md-12">
                        <el-pagination
                            @size-change="handleSizeChange"
							@current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
							:page-sizes="[1, 10, 20, 50, 100]"
                            background
                            layout="total, sizes, prev, pager, next"
                            :total="data.total">
                        </el-pagination>
                    </div>
                </div>
            </div>
            <!-- Dialog logs appointment -->
            <el-dialog title="Xem lịch sử" :visible.sync="dialogLogsAppointment.visible" :close-on-click-modal="false" width="70%">
                <div class="row">
                    <div class="col-md-12">
                        <el-table :data="dialogLogsAppointment.data" v-loading="dataLoading" style="width: 100%" stripe border>
                            <el-table-column label="Thời gian" min-width="60">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.createdAt ? $moment(scope.row.createdAt).format('HH:mm DD/MM/YYYY') : '' }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Tạo/Cập nhật bởi" min-width="60">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.createdBy || 'System' }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Ghi chú" min-width="60">
                                <template slot-scope="scope">
                                    <div>{{ getLogsType(scope.row.type) }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Nội dung" min-width="120">
                                <template slot-scope="scope">
                                    <ul v-if="scope.row.note.length > 0">
                                        <li v-for="(item, index) in scope.row.note" :key="index">
                                            <div>
                                                &#9900; 
                                                <span style="font-weight: bold;">
                                                    {{ item.column }}: 
                                                </span>
                                                {{ (item.oldvalue != '') ? (item.oldvalue + ' &#10142;') : '' }}  {{ item.newvalue }}
                                            </div>
                                        </li>
                                    </ul>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <button type="button" class="control-btn gray" @click="dialogLogsAppointment.visible = false">
                        <span>Đóng</span>
                    </button>
                </span>
            </el-dialog>
        </div>
        <div v-else>
            <el-empty description="Bạn không có quyền !!"></el-empty>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { appointmentStatusV2 } from '@/utils/masterData';
import { columns } from '@/utils/filter/appointment';
import moment from 'moment';
import { debounce, map, cloneDeep, intersection, filter, find, forEach } from 'lodash';
import Appointment from '@/models/tw_Appointment_Booking';
import QrcodeVue from 'qrcode.vue';
export default {
    components: {
        QrcodeVue,
    },
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user
		}),
	},
    data(){
        return{
            searchQuery: {
                filters: {
                    codeF: '',
                    customersF: '',
                    dentistsF: [],
                    statusF: ['new', 'arrived', 'completed'],
                    dateF: [moment().startOf('day'), moment().endOf('day')]
                },
                sorts: 'dateTimeFrom&&1',
                pages:{
                    from: 0,
                    size: 10
                }
            },
            sortData: [
                {
                    label: 'Ngày hẹn giảm dần',
                    value: 'dateTimeFrom&&-1',
                },
                {
                    label: 'Ngày hẹn tăng dần',
                    value: 'dateTimeFrom&&1',
                },
                {
                    label: 'Thời gian tạo giảm dần',
                    value: 'createdAt&&-1',
                },
                {
                    label: 'Thời gian tạo tăng dần',
                    value: 'createdAt&&1',
                }
            ],
            currentPage: 1,
            dentistData: [],
            statusData: appointmentStatusV2,
            columns: columns,
            data: {},
            dataLoading: true,
            appointmentType: [],
            appointmentContent: [],
            viewConfig: {
                new: {},
                arrived: {},
                notArrived: {},
                completed: {},
                cancelled: {}
            },
            dialogLogsAppointment: {
                visible: false,
                data: []
            },
            multipleSelection: [],
            pickerOptions: {
                shortcuts: [
                    {
                        text: 'Today',
                        onClick(picker) {
                            const start = moment().startOf('day');
                            const end = moment().endOf('day');
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: 'This week',
                        onClick(picker) {
                            const startOfWeek = moment().startOf('week');
                            const endOfWeek   = moment().endOf('week');
                            picker.$emit('pick', [startOfWeek, endOfWeek]);
                        },
                    },
                    {
                        text: 'This month',
                        onClick(picker) {
                            const start = moment().startOf('month');
                            const end   = moment().endOf('month');
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: 'This year',
                        onClick(picker) {
                            const start = moment().startOf('year');
                            const end   = moment().endOf('year');
                            picker.$emit('pick', [start, end]);
                        },
                    },
                ]
            }
        }
    },
    async created(){
        const _this = this;
        //Lấy danh sách loại lịch hẹn
        _this.appointmentType = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigAppointmentType' })) || [];
        //Lấy danh sách nội dung lịch hẹn
        _this.appointmentContent = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigAppointmentContent' })) || [];
        //Lấy các cấu hình lịch hẹn
        await _this.getAppointmentConfig();

        //Lấy danh sách lịch hẹn
        _this.getData(_this.searchQuery);
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['appointment.all', 'appointment.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        filterDentist: debounce(async function (text) {
            const _this = this;
            let query = {
                filters: {
                    textSearch: text
                },
                sorts: 'createdAt&&-1',
                pages:{
                    from: 0,
                    size: 10
                }
            };
            let dentists = await _this.$axios.$post('/api/user/getDentistByQuery', query);
            _this.dentistData = dentists && dentists.data;
        }, 200),
        refreshData(){
            const _this = this;
            _this.searchQuery.filters = {
                codeF: '',
                customersF: '',
                dentistsF: [],
                statusF: ['new', 'arrive', 'completed'],
                dateF: [new Date(moment().format('YYYY-MM-DD')), new Date(moment().add(10, 'd').format('YYYY-MM-DD'))]
            }
            _this.searchQuery.pages.from = 0;
            _this.currentPage = 1;
            _this.getData(_this.searchQuery);
        },
        searchData(){
            const _this = this;
            _this.currentPage = 1;
            _this.searchQuery.pages.from = 0;
            _this.getData(_this.searchQuery);
        },
        onChangeSorts(value){
            const _this = this;
            _this.searchQuery.sorts = value;
            _this.getData(_this.searchQuery);
        },
        async getData(searchQuery){
            const _this = this;
            _this.dataLoading = true;
            await _this.$axios.$post('/api/appointmentBooking/getByQuery', searchQuery).then( 
                (response) => {
                    if(response.success){
                        _this.data = response;
                    }
                    else{
                        _this.$message({
                            type: 'error',
                            message: response.error
                        });
                    }
				},
				(error) => {
					console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: error,
					});
				}
            );
            _this.dataLoading = false;
        },
        handleSizeChange(val) {
            const _this = this;
            _this.searchQuery.pages.size = val;
            _this.getData(_this.searchQuery);
        },
        handleCurrentChange(val) {
            const _this = this;
            _this.searchQuery.pages.from = (_this.currentPage - 1) * _this.searchQuery.pages.size;
            _this.getData(_this.searchQuery);
        },
        async getAppointmentConfig(){
            const _this = this;
            _this.dataLoading = true;
            const viewConfigs = await _this.$axios.$post(`/api/appointmentConfig/getDataByListKey`, [
                'DISPLAY_CONFIG_NEW',
                'DISPLAY_CONFIG_ARRIVED',
                'DISPLAY_CONFIG_NOTARRIVED',
                'DISPLAY_CONFIG_COMPLETED',
                'DISPLAY_CONFIG_CANCELLED'
            ]);
            if(viewConfigs && viewConfigs.length > 0){
                _this.viewConfig.new = _.find(viewConfigs, f => {
                    return f.key === 'DISPLAY_CONFIG_NEW';
                });
                _this.viewConfig.new.value = JSON.parse(_this.viewConfig.new.value);

                _this.viewConfig.arrived = _.find(viewConfigs, f => {
                    return f.key === 'DISPLAY_CONFIG_ARRIVED';
                });
                _this.viewConfig.arrived.value = JSON.parse(_this.viewConfig.arrived.value);

                _this.viewConfig.notArrived = _.find(viewConfigs, f => {
                    return f.key === 'DISPLAY_CONFIG_NOTARRIVED';
                });
                _this.viewConfig.notArrived.value = JSON.parse(_this.viewConfig.notArrived.value);

                _this.viewConfig.completed = _.find(viewConfigs, f => {
                    return f.key === 'DISPLAY_CONFIG_COMPLETED';
                });
                _this.viewConfig.completed.value = JSON.parse(_this.viewConfig.completed.value);

                _this.viewConfig.cancelled = _.find(viewConfigs, f => {
                    return f.key === 'DISPLAY_CONFIG_CANCELLED';
                });
                _this.viewConfig.cancelled.value = JSON.parse(_this.viewConfig.cancelled.value);
            }
        },
        getValueViewConfig(type){
            const _this = this;
            switch(type) {
                case 'new':
                    var config = _this.viewConfig.new.value;
                    return {
                        'background-color': config ? config.backgroundColor : '#8fdf82',
                        'border-color': config ? config.borderColor : '#8fdf82',
                        'color': config ? config.textColor : '#fff'
                    }
                case 'arrived':
                    var config = _this.viewConfig.arrived.value;
                    return {
                        'background-color': config ? config.backgroundColor : '#8fdf82',
                        'border-color': config ? config.borderColor : '#8fdf82',
                        'color': config ? config.textColor : '#fff'
                    }
                case 'notarrived':
                    var config = _this.viewConfig.notArrived.value;
                    return {
                        'background-color': config ? config.backgroundColor : '#8fdf82',
                        'border-color': config ? config.borderColor : '#8fdf82',
                        'color': config ? config.textColor : '#fff'
                    }
                case 'completed':
                    var config = _this.viewConfig.completed.value;
                    return {
                        'background-color': config ? config.backgroundColor : '#8fdf82',
                        'border-color': config ? config.borderColor : '#8fdf82',
                        'color': config ? config.textColor : '#fff'
                    }
                case 'cancelled':
                    var config = _this.viewConfig.cancelled.value;
                    return {
                        'background-color': config ? config.backgroundColor : '#8fdf82',
                        'border-color': config ? config.borderColor : '#8fdf82',
                        'color': config ? config.textColor : '#fff'
                    }
                default:
                    return {
                        'color': '#fff',
                        'background-color': '#8fdf82',
                        'border-color': '#8fdf82',
                    }
            }
        },
        getStatusName(type){
            const _this = this;
            return _.find(_this.statusData, item => item.value == type).label || '';
        },
        async createAppointment(){
            const _this = this;
            let route = _this.$router.resolve({path: '/appointmentBooking'});
            window.open(route.href, '_blank');
            // if (_this.$socket) {
            //     _this.$socket.emit('handleUpdateAppointment');
            // }
        },
        async openDialogLogs(id){
            const _this = this;
            _this.dialogLogsAppointment.visible = true;
            await _this.$axios.$get(`/api/appointmentBooking/getLogs/${id}`).then(
				(response) => {
                    _this.dialogLogsAppointment.data = response.data || [];
				},
				(error) => {
                    console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: error,
					});
				}
			);

            _this.dataLoading = false;
        },
        getLogsType(type){
            if(type == 'create'){
                return 'Đặt hẹn';
            }
            else if(type == 'update'){
                return 'Chỉnh sửa';
            }
            else if(type == 'cancel'){
                return 'Hủy';
            }
            else {
                return type;
            }
        },
        async sendMail(id){
            const _this = this;
            _this.$confirm('Bạn có chắc muốn gửi email nhắc hẹn cho lịch hẹn này?', 'Xác nhận', {
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Đóng',
                type: 'warning',
                closeOnClickModal: false
            }).then(async () => {
                _this.dataLoading = true;
                try{
                    const data = await _this.$axios.$post('/api/appointmentBooking/sendMail', { ids: [id] });
                    if(data.success && data.successCount > 0){
                        _this.$message({
                            message: 'Gửi nhắc hẹn thành công',
                            type: 'success',
                        });
                        _this.getData(_this.searchQuery);
                    }else {
                        _this.$message.error('Gửi nhắc hẹn thất bại');
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
            }).catch(() => {});
        },
        async sendMailMultiple(){
            const _this = this;
            var ids = _.map(_.filter(_this.multipleSelection, { status: 'new' }), (item) => {
				return item._id;
			});
            if (ids && ids.length > 0) {
                _this.$confirm(`Bạn có chắc muốn gửi email nhắc hẹn cho ${ids.length} lịch hẹn?`, 'Xác nhận', {
                    confirmButtonText: 'Xác nhận',
                    cancelButtonText: 'Đóng',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(async () => {
                    _this.dataLoading = true;
                    try{
                        const data = await _this.$axios.$post('/api/appointmentBooking/sendMail', { ids: ids });
                        if(data.success){
                            _this.$message({
                                message: `Gửi nhắc hẹn thành công ${data.successCount} lịch hẹn, thất bại ${data.errorCount} lịch hẹn`,
                                type: 'success',
                            });
                            _this.getData(_this.searchQuery);
                        }else {
                            _this.$message.error('Có lỗi xảy ra');
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
                }).catch(() => {});
            }
            else {
				_this.$message({
					type: 'error',
					message: 'Hãy chọn dữ liệu',
				});
			}
        },
        handleSelectionChange(val) {
			const _this = this;
			_this.multipleSelection = val;
		},
        async confirmBookingMultiple(){
            const _this = this;
            var ids = _.map(_.filter(_this.multipleSelection, { status: 'new' }), (item) => {
				return item._id;
			});
            if (ids && ids.length > 0) {
                _this.$confirm(`Bạn có chắc muốn xác nhận đến khám cho ${ids.length} lịch hẹn?`, 'Xác nhận', {
                    confirmButtonText: 'Xác nhận',
                    cancelButtonText: 'Đóng',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(async () => {
                    _this.dataLoading = true;
                    try{
                        const data = await _this.$axios.$post('/api/appointmentBooking/confirmBooking', { ids: ids });
                        if(data.success){
                            _this.$message({
                                message: `Xác nhận đến khám thành công ${data.successCount} lịch hẹn, thất bại ${data.errorCount} lịch hẹn`,
                                type: 'success',
                            });
                            _this.getData(_this.searchQuery);
                        }else {
                            _this.$message.error('Có lỗi xảy ra');
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
                }).catch(() => {});
            }
            else {
				_this.$message({
					type: 'error',
					message: 'Hãy chọn dữ liệu',
				});
			}
        },
        async completeBookingMultiple(){
            const _this = this;
            var ids = _.map(_.filter(_this.multipleSelection, { status: 'arrived' }), (item) => {
				return item._id;
			});
            if (ids && ids.length > 0){
                _this.$confirm(`Bạn có chắc muốn hoàn thành ${ids.length} lịch hẹn?`, 'Xác nhận', {
                    confirmButtonText: 'Xác nhận',
                    cancelButtonText: 'Đóng',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(async () => {
                    _this.dataLoading = true;
                    try{
                        const data = await _this.$axios.$post('/api/appointmentBooking/completeBooking', { ids: ids });
                        if(data.success){
                            _this.$message({
                                message: `Hoàn thành lịch hẹn thành công ${data.successCount} lịch hẹn, thất bại ${data.errorCount} lịch hẹn`,
                                type: 'success',
                            });
                            _this.getData(_this.searchQuery);
                        }else {
                            _this.$message.error('Có lỗi xảy ra');
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
                }).catch(() => {});;
            }
            else {
				_this.$message({
					type: 'error',
					message: 'Hãy chọn dữ liệu',
				});
			}
        },
        async cancelBookingMultiple(){
            const _this = this;
            var ids = _.map(_this.multipleSelection.filter(f => f.status == 'new' || f.status == 'arrived'), (item) => {
				return item._id;
			});
            if (ids && ids.length > 0){
                _this.$prompt('Lý do hủy *', `Xác nhận hủy ${ids.length} lịch hẹn`, {
                    confirmButtonText: 'Xác nhận',
					cancelButtonText: 'Hủy',
                    type: 'warning',
                    inputPlaceholder: 'Nhập lý do hủy',
                    inputValidator: _this.validateInput
                }).then(async ({ value }) => {
                    _this.dataLoading = true;
                    try{
                        const data = await _this.$axios.$post('/api/appointmentBooking/cancelBooking', { ids: ids, cancelReason: value });
                        if(data.success){
                            _this.$message({
                                message: `Hủy thành công ${data.successCount} lịch hẹn, thất bại ${data.errorCount} lịch hẹn`,
                                type: 'success',
                            });
                            _this.getData(_this.searchQuery);
                        }else {
                            _this.$message.error('Có lỗi xảy ra');
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
                }).catch(() => {});
            }
            else {
				_this.$message({
					type: 'error',
					message: 'Hãy chọn dữ liệu',
				});
			}
        },
        validateInput (input) {
            if (input) return true;
            else return 'Vui lòng nhập lý do hủy.';
        },
    }
}
</script>