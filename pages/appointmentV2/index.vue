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
                            <div class="col-md-4">
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
                             <div class="col-md-4">
                                <div class="col-form-label">Ngày đặt hẹn</div>
                                <el-date-picker
                                    v-model="searchQuery.filters.dateF"
                                    type="daterange"
                                    range-separator="-"
                                    start-placeholder="Từ ngày"
                                    end-placeholder="Đến ngày"
                                    format="dd/MM/yyyy">
                                </el-date-picker>
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
                    <div class="col-md-3">
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
                    <div class="col-md-3">
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
                    <div class="col-md-3"></div>
                    <div class="col-md-3">
                        <div v-if="checkRight('create')" style="display: flex; height: 100%; align-items: end; justify-content: right;">
                            <button class="control-btn blue" @click="createAppointment">
                                <i class='bx bx-plus' ></i>
                                Đặt lịch hẹn
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row mt-4">
                    <el-table :data="data.data" v-loading="dataLoading" style="width: 100%" stripe border>
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
                                <div class="row">
                                    <div class="col-6 mb-1">
                                        <el-tooltip effect="dark" content="Chỉnh sửa" placement="right-start">
                                            <nuxt-link :to="`/appointmentV2/${scope.row._id}`">
                                                <button class="control-btn blue2" style="padding: 4px 6px;">
                                                    <i class="el-icon-edit-outline"></i>
                                                </button>
                                            </nuxt-link>
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
export default {
    components: {
		
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
                    dateF: [new Date(moment().format('YYYY-MM-DD')), new Date(moment().add(10, 'd').format('YYYY-MM-DD'))]
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
        createAppointment(){
            const _this = this;
            let route = _this.$router.resolve({path: '/appointmentBooking'});
            window.open(route.href, '_blank');
        },
    }
}
</script>