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
                    <div class="col-md-3">
                        <div class="col-form-label">Mã lịch hẹn</div>
                        <el-input placeholder="Mã lịch hẹn..." v-model="searchQuery.filters.codeF" name="codeF"></el-input>
                    </div>
                    <div class="col-md-3">
                        <div class="col-form-label">Khách hàng</div>
                        <el-input placeholder="Mã, tên, số điện thoại, cmnd/cccd..." v-model="searchQuery.filters.customersF" name="customersF"></el-input>
                    </div>
                    <div class="col-md-3">
                        <div class="col-form-label">Nha sĩ</div>
                        <el-select v-model="searchQuery.filters.dentistsF" placeholder="Chọn nha sĩ..." name="dentistsF" multiple clearable filterable>
                            <el-option
                                v-for="item in dentistsData"
                                :key="item._id"
                                :label="`Ns ${item.name}`"
                                :value="item._id"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="col-md-3">
                        <div style="display: flex; height: 100%; align-items: end; gap: 8px;">
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
                <div class="row">
                    <div class="col-md-3">
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
                    <div class="col-md-3">
                        <div class="col-form-label">Ngày đặt hẹn</div>
                        <el-date-picker
                            v-model="searchQuery.filters.dateF"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="Ngày bắt đầu"
                            end-placeholder="Ngày kết thúc"
                            format="dd/MM/yyyy">
                        </el-date-picker>
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
                    <div class="col-md-2">
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
                    <div class="col-md-4"></div>
                    <div class="col-md-3">
                        <div style="display: flex; height: 100%; align-items: end; justify-content: right;">
                            <button class="control-btn blue" @click="$router.push('/register')">
                                <i class='bx bx-plus' ></i>
                                Thêm lịch hẹn
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-md-12">
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
                                        {{ scope.row.timeFrom ? $moment(scope.row.timeFrom).format('HH:mm') : '' }} - 
                                        {{ scope.row.timeTo ? $moment(scope.row.timeTo).format('HH:mm') : '' }}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="columns[1].isShow" :label="columns[1].name" min-width="280">
                                <template slot-scope="scope">
                                    <div style="font-weight: bold;">  
                                        <i class='bx bx-user'></i>
                                        {{ '(' + scope.row.customerCode + ')' || '' }} {{ scope.row.customerName || '' }}
                                    </div>
                                    <div>
                                        <i class='bx bx-id-card'></i>
                                        {{ scope.row.customerPhysicalId || '' }}
                                    </div>
                                    <div>
                                        <i class='bx bx-calendar-event'></i>
                                        {{ scope.row.customerBirthday ? $moment(scope.row.customerBirthday).format('DD/MM/YYYY') : '' }}
                                    </div>
                                    <div>
                                        <i class='bx bx-phone' ></i>
                                        {{ scope.row.customerPhone || '' }}
                                    </div>
								</template>
                            </el-table-column>
                            <el-table-column v-if="columns[2].isShow" :label="columns[2].name" min-width="280">
                                <template slot-scope="scope">
                                    <div style="font-weight: bold; word-break: break-word;">  
                                        <i class='bx bx-user'></i>
                                        {{ '(' + scope.row.dentistCode + ')' || '' }} Ns. {{ scope.row.dentistName || '' }}
                                    </div>
                                    <div>
                                        <i class='bx bx-phone' ></i>
                                        {{ scope.row.dentistPhone || '' }}
                                    </div>
                                    <div v-if="scope.row.dentistGender == 'male'">
                                        <i class='bx bx-male-sign'></i>
                                        Nam
                                    </div>
                                    <div v-else>
                                        <i class='bx bx-female-sign' ></i>
                                        Nữ
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="columns[6].isShow" :label="columns[6].name" width="100">
                                <template slot-scope="scope">
                                    <div class="row">
                                        <div class="col-md-8">
                                            <div class="row">
                                                <div 
                                                    class="col-md-6 mb-1"
                                                    v-if="
                                                        checkRight('confirmBooking') 
                                                        && scope.row.status == 'Booked'
                                                    " 
                                                >
                                                    <el-tooltip effect="dark" content="Xác nhận đến khám" placement="top-start">
                                                        <button class="control-btn green2" style="padding: 4px 6px;" @click="changeStatusBooking(scope.row._id, 'Checkin')">
                                                            <i class='bx bx-check'></i>
                                                        </button>
                                                    </el-tooltip>
                                                </div>
                                                <div 
                                                    class="col-md-6 mb-1"
                                                    v-if="
                                                        checkRight('update') 
                                                        && (scope.row.status == 'Booked' || scope.row.status == 'Checkin')
                                                    " 
                                                >
                                                    <el-tooltip effect="dark" content="Chỉnh sửa" placement="top-start">
                                                        <button class="control-btn blue2" style="padding: 4px 6px;" @click="openDialogUpdate(scope.row._id)">
                                                            <i class="el-icon-edit-outline"></i>
                                                        </button>
                                                    </el-tooltip>
                                                </div>
                                                <div 
                                                    class="col-md-6 mb-1"
                                                    v-if="scope.row.status == 'Completed' && scope.row.examinationId" 
                                                >
                                                    <el-tooltip effect="dark" content="Xem phiếu khám" placement="top-start">
                                                        <button class="control-btn blue2" style="padding: 4px 6px;" @click="viewExamination(scope.row)">
                                                            <i class='bx bx-detail'></i>
                                                        </button>
                                                    </el-tooltip>
                                                </div>
                                                <div 
                                                    class="col-md-6 mb-1"
                                                    v-if="
                                                        checkRight('sendMail') 
                                                        && scope.row.status == 'Booked'
                                                    " 
                                                >
                                                    <el-tooltip effect="dark" content="Gửi nhắc hẹn" placement="top-start">
                                                        <button class="control-btn blue" style="padding: 4px 6px;" @click="sendMail(scope.row._id)">
                                                            <i class='bx bx-mail-send'></i>
                                                        </button>
                                                    </el-tooltip>
                                                </div>
                                                <div 
                                                    class="col-md-6 mb-1"
                                                    v-if="
                                                        checkRight('transferBooking')
                                                        && scope.row.status == 'Booked'
                                                    " 
                                                >
                                                    <el-tooltip effect="dark" content="Chuyển lịch hẹn" placement="top-start">
                                                        <button class="control-btn orange" style="padding: 4px 6px;" @click="openDialogTransfer(scope.row)">
                                                            <i class='bx bxs-chevrons-left'></i>
                                                        </button>
                                                    </el-tooltip>
                                                </div>
                                                <div class="col-md-6 mb-1">
                                                    <el-tooltip effect="dark" content="Xem lịch sử" placement="top-start">
                                                        <button class="control-btn yellow" style="padding: 4px 6px;" @click="openDialogLogs(scope.row._id)">
                                                            <i class='bx bx-history' ></i>
                                                        </button>
                                                    </el-tooltip>
                                                </div>
                                                <div v-if="scope.row.status != 'Cancelled'" class="col-md-6 mb-1">
                                                    <el-tooltip effect="dark" content="Gọi điện KH" placement="top-start">
                                                        <a class="control-btn green" style="padding: 4px 6px;" :href="`tel:${scope.row.customerPhone}`">
                                                            <i class='bx bx-phone'></i>
                                                        </a>
                                                    </el-tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
								</template>
                            </el-table-column>
                            <el-table-column v-if="columns[3].isShow" :label="columns[3].name" min-width="150">
                                <template slot-scope="scope">
                                    <div>
                                        <el-tooltip effect="dark" content="Loại lịch hẹn" placement="top-start">
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
                                        <el-tooltip effect="dark" content="Nội dung lịch hẹn" placement="top-start">
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
                                        <el-tooltip effect="dark" content="Ghi chú" placement="top-start">
                                            <div>
                                                <i class='bx bx-edit' ></i>
                                                {{ scope.row.note || '' }}
                                            </div>
                                        </el-tooltip>
                                    </div>
                                    <div v-if="scope.row.refId">
                                        <span style="font-weight:bold;">Được chuyển từ lịch hẹn {{ scope.row.refCode }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="columns[5].isShow" :label="columns[5].name" min-width="150">
                                <template slot-scope="scope">
                                    <el-tag v-if="scope.row.status == 'Booked'" :style="{
                                        'background-color': appointmentConfig.views.find(e => e.value == 'Booked').apply ? appointmentConfig.views.find(e => e.value == 'Booked').backgroundColor : statusData.find(e => e.value == 'Booked').backgroundColor,
                                        'border-color': appointmentConfig.views.find(e => e.value == 'Booked').apply ? appointmentConfig.views.find(e => e.value == 'Booked').borderColor : statusData.find(e => e.value == 'Booked').borderColor,
                                        'color': appointmentConfig.views.find(e => e.value == 'Booked').apply ? appointmentConfig.views.find(e => e.value == 'Booked').textColor : statusData.find(e => e.value == 'Booked').textColor,
                                    }">
                                        Đặt hẹn
                                    </el-tag>
                                    <el-tag v-else-if="scope.row.status == 'Checkin'" :style="{
                                        'background-color': appointmentConfig.views.find(e => e.value == 'Checkin').apply ? appointmentConfig.views.find(e => e.value == 'Checkin').backgroundColor : statusData.find(e => e.value == 'Checkin').backgroundColor,
                                        'border-color': appointmentConfig.views.find(e => e.value == 'Checkin').apply ? appointmentConfig.views.find(e => e.value == 'Checkin').borderColor : statusData.find(e => e.value == 'Checkin').borderColor,
                                        'color': appointmentConfig.views.find(e => e.value == 'Checkin').apply ? appointmentConfig.views.find(e => e.value == 'Checkin').textColor : statusData.find(e => e.value == 'Checkin').textColor,
                                    }">
                                        Đã đến
                                    </el-tag>
                                    <el-tag v-else-if="scope.row.status == 'Completed'" :style="{
                                        'background-color': appointmentConfig.views.find(e => e.value == 'Completed').apply ? appointmentConfig.views.find(e => e.value == 'Completed').backgroundColor : statusData.find(e => e.value == 'Completed').backgroundColor,
                                        'border-color': appointmentConfig.views.find(e => e.value == 'Completed').apply ? appointmentConfig.views.find(e => e.value == 'Completed').borderColor : statusData.find(e => e.value == 'Completed').borderColor,
                                        'color': appointmentConfig.views.find(e => e.value == 'Completed').apply ? appointmentConfig.views.find(e => e.value == 'Completed').textColor : statusData.find(e => e.value == 'Completed').textColor,
                                    }">
                                        Hoàn thành
                                    </el-tag>
                                    <el-tag v-else :style="{
                                        'background-color': appointmentConfig.views.find(e => e.value == 'Cancelled').apply ? appointmentConfig.views.find(e => e.value == 'Cancelled').backgroundColor : statusData.find(e => e.value == 'Cancelled').backgroundColor,
                                        'border-color': appointmentConfig.views.find(e => e.value == 'Cancelled').apply ? appointmentConfig.views.find(e => e.value == 'Cancelled').borderColor : statusData.find(e => e.value == 'Cancelled').borderColor,
                                        'color': appointmentConfig.views.find(e => e.value == 'Cancelled').apply ? appointmentConfig.views.find(e => e.value == 'Cancelled').textColor : statusData.find(e => e.value == 'Cancelled').textColor,
                                    }">
                                        Đã hủy
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

                <!-- Dialog edit appointment -->
                <el-dialog :visible.sync="dialogUpdateAppointment" :close-on-click-modal="false" width="55%">
                    <span slot="title" class="dialog-title">
                        Chi tiết lịch hẹn | 
                        <span style="color: #FFCC33; font-weight: bold;">
                            {{ statusData.find(x => x.value == updateData.status) ? statusData.find(x => x.value == updateData.status).label : '' }}
                        </span>
                    </span>
                    <form v-on:submit.prevent="submitUpdate">
                        <div class="row">
                            <div class="col-md-12">
                                <span style="font-weight: bold;">Thông tin khách hàng</span>
                            </div>
                            <div class="col-md-12 mt-3 ml-3">
                                <div class="row">
                                    <div class="col-xl-4 col-lg-6 mb-3">
                                        Mã khách hàng:
                                        <span style="font-weight: bold;">{{ updateData.customerCode || '' }}</span>
                                    </div>
                                    <div class="col-xl-4 col-lg-6 mb-3">
                                        Họ tên:
                                        <span style="font-weight: bold;">{{ updateData.customerName || '' }}</span>
                                    </div>
                                    <div class="col-xl-4 col-lg-6 mb-3">
                                        Ngày sinh:
                                        <span style="font-weight: bold;">{{ $moment(updateData.customerBirthday).format('DD/MM/YYYY') || '' }}</span>
                                    </div>
                                    <div class="col-xl-4 col-lg-6 mb-3">
                                        CMND/CCCD:
                                        <span style="font-weight: bold;">{{ updateData.customerPhysicalId || '' }}</span>
                                    </div>
                                    <div class="col-xl-4 col-lg-6 mb-3">
                                        Số điện thoại:
                                        <span style="font-weight: bold;">{{ updateData.customerPhone || '' }}</span>
                                    </div>
                                    <div class="col-xl-4 col-lg-6 mb-3">
                                        Giới tính:
                                        <span style="font-weight: bold;">{{ updateData.customerGender == 'male' ? 'Nam' : 'Nữ' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-md-12">
                                <span style="font-weight: bold;">Thông tin lịch hẹn</span>
                            </div>
                            <div class="col-md-12 mt-3">
                                <div class="row">
                                    <div class="col-md-6 mb-2">
                                        <div class="col-form-label">Mã lịch hẹn</div>
                                        <el-input 
                                            name="code"
                                            placeholder="Mã lịch hẹn"
                                            v-model="updateData.code"
                                            disabled
                                        ></el-input>
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <div class="col-form-label">Nha sĩ phụ trách</div>
                                        <el-select v-model="updateData.dentistId" placeholder="Chọn nha sĩ" name="dentistId" filterable disabled>
                                            <el-option
                                                v-for="item in dentistsData"
                                                :key="item._id"
                                                :label="`Ns ${item.name}`"
                                                :value="item._id"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-12 mb-2">
                                        <div class="col-form-label">Thời gian</div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <el-date-picker
                                                    v-model="updateData.date"
                                                    type="date"
                                                    name="date"
                                                    format="dd/MM/yyyy"
                                                    placeholder="Chọn ngày hẹn"
                                                    disabled>
                                                </el-date-picker>
                                            </div>
                                            <div class="col-md-4">
                                                <el-time-select
                                                    v-model="updateData.time"
                                                    :picker-options="{
                                                        start: '00:00',
                                                        step: '00:05',
                                                        end: '24:00'
                                                    }"
                                                    name="time"
                                                    placeholder="Chọn thời gian"
                                                    disabled>
                                                </el-time-select>
                                            </div>
                                            <div class="col-md-4">
                                                <el-input placeholder="0" v-model="updateData.duration" class="input-with-select" style="text-align: right;" name="duration" type="number" disabled>
                                                    <el-select v-model="updateData.durationType" slot="append" style="width:80px;" name="durationType" disabled>
                                                        <el-option label="Phút" value="minutes"></el-option>
                                                        <el-option label="Giờ" value="hours"></el-option>
                                                    </el-select>
                                                </el-input>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- <div class="col-md-6">
                                        <div class="col-form-label">Dịch vụ</div>
                                        <el-select v-model="updateData.serviceGroupId" placeholder="Chọn dịch vụ" name="serviceGroupId" filterable :disabled="updateData.status != 'Booked'">
                                            <el-option
                                                v-for="item in serviceData"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div> -->
                                    <div class="col-md-6">
                                        <div class="col-form-label">Loại lịch hẹn</div>
                                        <el-select v-model="updateData.type" placeholder="Loại lịch hẹn" name="type" filterable :disabled="updateData.status != 'Booked'">
                                            <el-option
                                                v-for="item in appointmentType"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="col-form-label">Nội dung *</div>
                                        <el-select v-model="updateData.content" placeholder="Nội dung" name="content" :disabled="updateData.status != 'Booked'" filterable>
                                            <el-option
                                                v-for="item in appointmentContent"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="col-form-label">Ghi chú</div>
                                        <el-input
                                            type="textarea"
                                            :rows="6"
                                            placeholder="Ghi chú"
                                            v-model="updateData.note" 
                                            :disabled="updateData.status != 'Booked'">
                                        </el-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <span slot="footer" class="dialog-footer">
                        <button type="button" class="control-btn gray" @click="dialogUpdateAppointment = false">
                            <span>Đóng</span>
                        </button>
                        <button
                            type="button" 
                            class="control-btn red"
                            @click="cancelBooking(updateData._id)"
                            v-if="checkRight('cancelBooking')"
                        >
                            <span>Hủy</span>
                        </button>
                        <button
                            v-if="checkRight('update') && updateData.status == 'Booked'"
                            type="button" 
                            class="control-btn green"
                            @click="submitUpdate"
                        >
                            <span>Lưu</span>
                        </button>
                    </span>
                </el-dialog>

                <!-- Dialog cancel appointment -->
                <!-- <el-dialog title="Hủy lịch hẹn" :visible.sync="dialogCancelAppointment" :close-on-click-modal="false" width="40%">
                    <form v-on:submit.prevent="cancelBooking">
                        <div class="row">
                            <div class="col-md-12">
                                <span style="font-weight: bold;">Hãy nhập lý do hủy *</span>
                            </div>
                            <div class="col-md-12 mt-3">
                                <el-input
                                    type="textarea"
                                    :rows="6"
                                    placeholder="Nhập lý do"
                                    v-model="cancelBookingData.cancelReason">
                                </el-input>
                            </div>
                        </div>
                    </form>
                    <span slot="footer" class="dialog-footer">
                        <button type="button" class="control-btn gray" @click="dialogCancelAppointment = false">
                            <span>Đóng</span>
                        </button>
                        <button
                            type="button" 
                            class="control-btn red"
                            @click="cancelBooking"
                            v-if="checkRight('cancelBooking')"
                        >
                            <span>Hủy</span>
                        </button>
                    </span>
                </el-dialog> -->

                <!-- Dialog logs appointment -->
                <el-dialog title="Xem lịch sử" :visible.sync="dialogLogsAppointment" :close-on-click-modal="false" width="70%">
                    <div class="row">
                        <div class="col-md-12">
                            <el-table :data="logsData" v-loading="dataLoading" style="width: 100%" stripe border>
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
                        <button type="button" class="control-btn gray" @click="dialogLogsAppointment = false">
                            <span>Đóng</span>
                        </button>
                    </span>
                </el-dialog>

                <!-- Dialog transfer -->
                <el-dialog :visible.sync="dialogTransfer" :close-on-click-modal="false" width="55%">
                    <span slot="title" class="dialog-title">
                        Chuyển lịch hẹn | 
                        <span style="color: #FFCC33; font-weight: bold;">
                            {{ transferData.code }}
                        </span>
                    </span>
                    <form v-on:submit.prevent="submitTransfer">
                        <div class="row">
                            <div class="col-md-12">
                                <div style="font-size:16px;font-weight:bold;" class="col-form-label">Thông tin lịch hẹn</div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="col-form-label">Loại lịch hẹn</div>
                                        <el-select v-model="transferData.type" placeholder="Loại lịch hẹn" name="type" filterable>
                                            <el-option
                                                v-for="item in appointmentType"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="col-form-label">Nội dung</div>
                                        <el-select v-model="transferData.content" placeholder="Nội dung" name="content" filterable>
                                            <el-option
                                                v-for="item in appointmentContent"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="col-form-label">Ghi chú</div>
                                        <el-input
                                            type="textarea"
                                            :rows="4"
                                            placeholder="Ghi chú"
                                            v-model="transferData.note">
                                        </el-input>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12 mt-2">
                                <div style="font-size:16px;font-weight:bold;" class="col-form-label">Thông tin chuyển hẹn *</div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="col-form-label">Nha sĩ phụ trách</div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <el-select v-model="transferData.dentistId" placeholder="Chọn nha sĩ" name="dentistId" filterable>
                                                    <el-option
                                                        v-for="item in dentistsData"
                                                        :key="item._id"
                                                        :label="`Ns ${item.name}`"
                                                        :value="item._id"
                                                    ></el-option>
                                                </el-select>
                                            </div>
                                            <div class="col-md-6">
                                                <button
                                                    v-if="transferData.dentistId"
                                                    type="button" 
                                                    class="control-btn blue"
                                                    @click="openCalendar()"
                                                >
                                                    <i class='bx bxs-calendar'></i>
                                                    <span>Xem lịch trống</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="col-form-label">Thời gian</div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <el-date-picker
                                                    v-model="transferData.date"
                                                    type="date"
                                                    name="date"
                                                    format="dd/MM/yyyy"
                                                    placeholder="Chọn ngày hẹn">
                                                </el-date-picker>
                                            </div>
                                            <div class="col-md-4">
                                                <el-time-select
                                                    v-model="transferData.time"
                                                    :picker-options="{
                                                        start: '00:00',
                                                        step: '00:05',
                                                        end: '24:00'
                                                    }"
                                                    name="time"
                                                    placeholder="Chọn thời gian">
                                                </el-time-select>
                                            </div>
                                            <div class="col-md-4">
                                                <el-input placeholder="0" v-model="transferData.duration" class="input-with-select" style="text-align: right;" name="duration" type="number">
                                                    <el-select v-model="transferData.durationType" slot="append" style="width:80px;" name="durationType" :default-first-option="true">
                                                        <el-option label="Phút" value="minutes"></el-option>
                                                        <el-option label="Giờ" value="hours"></el-option>
                                                    </el-select>
                                                </el-input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="col-form-label">Lý do</div>
                                        <el-input
                                            type="textarea"
                                            :rows="4"
                                            placeholder="Lý do"
                                            v-model="transferData.transferReason">
                                        </el-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <span slot="footer" class="dialog-footer">
                        <button type="button" class="control-btn gray" @click="dialogTransfer = false">
                            <span>Đóng</span>
                        </button>
                        <button
                            type="button" 
                            class="control-btn green"
                            @click="submitTransfer"
                            v-if="checkRight('transferBooking')"
                        >
                            <span>Xác nhận</span>
                        </button>
                    </span>
                </el-dialog>

                <!-- Dialog calendar -->
                <el-dialog title="Xem lịch trống" :visible.sync="dialogCalendarByDentist" :close-on-click-modal="false" width="80%">
                    <CalendarByDentist 
                        :dentistId="transferData.dentistId" 
                        :appointmentConfig="appointmentConfig"  
                        :currentPage="`appointment`"
                        :appointmentId="transferData._id"
                        @select-empty-calendar = "selectEmptyCalendar" 
                        ref="calendarByDentistComponent" 
                    />
                    <span slot="footer" class="dialog-footer">
                        <button type="button" class="control-btn gray" @click="dialogCalendarByDentist = false">
                            <span>Đóng</span>
                        </button>
                    </span>
                </el-dialog>
            </div>
        </div>
        <div v-else>
            <el-empty description="Bạn không có quyền !!"></el-empty>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { genderData, appointmentStatus } from '@/utils/masterData';
import { columns } from '@/utils/filter/appointment';
import moment from 'moment';
import { debounce, map, cloneDeep, intersection, filter, find, forEach } from 'lodash';
import Appointment from '@/models/tw_Appointment';
import CalendarByDentist from '@/components/appointment/calendarByDentist';
import AppointmentConfig from '@/models/tw_AppointmentConfig';
export default {
    components: {
		CalendarByDentist,
	},
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
            socketUser: (state) => state.socketUser,
		}),
	},
    data() {
        return {
            data: {},
            dataLoading: true,
            statusData: appointmentStatus,
            columns: columns,
            sortData: [
                {
                    label: 'Thời gian tạo giảm dần',
                    value: 'createdAt&&-1',
                },
                {
                    label: 'Thời gian tạo tăng dần',
                    value: 'createdAt&&1',
                },
                {
                    label: 'Ngày hẹn giảm dần',
                    value: 'timeFrom&&-1',
                },
                {
                    label: 'Ngày hẹn tăng dần',
                    value: 'timeFrom&&1',
                },
            ],
            searchQuery: {
                filters: {
                    codeF: '',
                    customersF: '',
                    dentistsF: [],
                    statusF: ['Booked', 'Checkin', 'Completed'],
                    dateF: [new Date(moment().format('YYYY-MM-DD')), new Date(moment().add(30, 'd').format('YYYY-MM-DD'))]
                },
                sorts: 'createdAt&&-1',
                pages:{
                    from: 0,
                    size: 10
                }
            },
            dentistsData: [],
            currentPage: 1,
            appointmentType: [],
            dialogUpdateAppointment: false,
            updateData: new Appointment(),
            serviceData: [],
            dialogCancelAppointment: false,
            cancelBookingData: {
                id: 0,
                cancelReason: ''
            },
            dialogLogsAppointment: false,
            logsData: [],
            transferData: new Appointment(),
            dialogTransfer: false,
            dialogCalendarByDentist: false,
            appointmentConfig: new AppointmentConfig(),
            appointmentContent: [],
        }
    },
    async created() {
        const _this = this;
        console.log(_this.socketUser);
        await _this.$axios.$get('/api/user/getDentist').then(
            (response) => {
                _this.dentistsData = response.data || [];
            },
            (error) => {
                console.log('Error: ', error);
                _this.$message({
                    type: 'error',
                    message: 'Có lỗi xảy ra',
                });
            }
        );
        _this.appointmentType = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigAppointmentType' })) || [];
        // _this.serviceData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'serviceGroupData' })) || [];
        _this.appointmentContent = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigAppointmentContent' })) || [];
        await _this.$axios.$get('/api/appointmentConfig/getData').then(
            (response) => {
                _this.appointmentConfig = (response.data.length > 0 && response.data != null) ? response.data[0] : new AppointmentConfig();
                if(_this.appointmentConfig.views == null || _this.appointmentConfig.views.length <= 0){
                    _this.appointmentConfig.views = _this.statusData;
                }
            },
            (error) => {
                console.log('Error: ', error);
                _this.$message({
                    type: 'error',
                    message: 'Có lỗi xảy ra',
                });
            }
        );

        _this.getData(_this.searchQuery);
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['appointment.all', 'appointment.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        async getData(searchQuery){
            const _this = this;
            // if(searchQuery.filters.dateF == null || searchQuery.filters.dateF == ''){
            //     searchQuery.filters.dateF = [new Date(moment().format('YYYY-MM-DD')), new Date(moment().add(30, 'd').format('YYYY-MM-DD'))];
            // }
            _this.dataLoading = true;
            await _this.$axios.$post('/api/appointment/getByQuery', searchQuery).then(
                (response) => {
                    _this.data = response;
				},
				(error) => {
					console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: 'Có lỗi xảy ra',
					});
				}
            );

            _this.dataLoading = false;
        },
        searchData(){
            const _this = this;
            _this.currentPage = 1;
            _this.searchQuery.pages.from = 0;
            _this.getData(_this.searchQuery)
        },
        refreshData(){
            const _this = this;
            _this.searchQuery.filters = {
                codeF: '',
                customersF: '',
                dentistsF: [],
                statusF: ['Booked', 'Checkin', 'Completed'],
                dateF: [new Date(moment().format('YYYY-MM-DD')), new Date(moment().add(30, 'd').format('YYYY-MM-DD'))]
            }
            _this.searchQuery.pages.from = 0;
            _this.currentPage = 1;

            _this.getData(_this.searchQuery);
        },
        onChangeSorts(value){
            const _this = this;
            _this.searchQuery.sorts = value;
            _this.getData(_this.searchQuery);
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
        onChangeSorts(value){
            const _this = this;
            _this.searchQuery.sorts = value;
            _this.getData(_this.searchQuery);
        },
        async openDialogUpdate(val){
            const _this = this;
            await _this.$axios.$get(`/api/appointment/getById/${val}`).then(
				(response) => {
                    _this.updateData = (response.data != null && response.data.length > 0) ? response.data[0] : new Appointment();
                    // var expireTime = moment(_this.updateData.timeFrom).add(1, 'm')._d;
                    // const date = new Date(expireTime);
                    // const minutes = date.getMinutes();
                    // const hours = date.getHours();
                    // const days = date.getDate();
                    // const months = date.getMonth() + 1;
                    // const dayOfWeek = date.getDay();
                    // console.log(`00 ${minutes} ${hours} ${days} ${months} ${dayOfWeek}`)
				},
				(error) => {
                    console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: 'Có lỗi xảy ra',
					});
				}
			);
            _this.dialogUpdateAppointment = true;
        },
        submitUpdate: debounce(async function (){
            const _this = this;
            _this.dataLoading = true;
            _this.updateData.updatedBy = _this.userInfo.data.username;
            var newData = cloneDeep(_this.updateData);
            const data = await _this.$axios.$put('/api/appointment/updateBooking', newData);
            if (data.success) {
                _this.dialogUpdateAppointment = false;
                _this.updateData = new Appointment();
                _this.$message({
                    message: data.message,
                    type: 'success',
                });
                _this.getData(_this.searchQuery);
            } else {
                console.log('Error: ', data.error);
                _this.$message.error(data.error);
            }
            _this.dataLoading = false;
        }),
        // cancelBooking: debounce(async function(){
        //     const _this = this;
        //     _this.$confirm('Bạn có chắc muốn hủy lịch hẹn này?', 'Xác nhận hủy', {
        //         confirmButtonText: 'Xác nhận',
        //         cancelButtonText: 'Đóng',
        //         type: 'warning',
        //         closeOnClickModal: false
        //     }).then(async () => {
        //         _this.cancelBookingData.updatedBy = _this.userInfo.data.username;
        //         var newData = cloneDeep(_this.cancelBookingData);
        //         const data = await _this.$axios.$put('/api/appointment/cancelBooking', newData);
        //         if(data.success){
        //             _this.dialogUpdateAppointment = false;
        //             _this.dialogCancelAppointment = false;
        //             _this.updateData = new Appointment();
        //             _this.cancelBookingData = {
        //                 id: 0,
        //                 cancelReason: ''
        //             }
        //             _this.$message({
        //                 message: data.message,
        //                 type: 'success',
        //             });
        //             _this.getData(_this.searchQuery);
        //         }else {
        //             console.log('Error: ', data.error);
        //             _this.$message.error(data.error);
        //         }
        //     }).catch(() => {});
        // }),
        openDialogCancel(id){
            const _this = this;
            _this.cancelBookingData.id = id;
            _this.dialogCancelAppointment = true;
        },
        async openDialogLogs(id){
            const _this = this;
            _this.dialogLogsAppointment = true;
            await _this.$axios.$get(`/api/appointment/getLogs/${id}`).then(
				(response) => {
                    _this.logsData = response.data || [];
                    console.log(_this.logsData)
				},
				(error) => {
                    console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: 'Có lỗi xảy ra',
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
        async changeStatusBooking(id, action){
            const _this = this;
            var content = (action == 'Checkin') ? 'Xác nhận khách hàng đã đến khám' : (action == 'Booked') ? 'Hủy xác nhận khách hàng đã đến khám' : '';
            _this.$confirm(content, 'Xác nhận', {
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Đóng',
                type: 'warning',
                closeOnClickModal: false
            }).then(async () => {
                _this.dataLoading = true;
                const data = await _this.$axios.$put('/api/appointment/changeStatus', { id: id, action: action, currentUser: _this.userInfo.data.username });
                if(data.success){
                    _this.$message({
                        message: data.message,
                        type: 'success',
                    });
                    _this.getData(_this.searchQuery);
                }else {
                    _this.$message.error(data.error);
                }
                _this.dataLoading = false;
            }).catch(() => {});
        },
        openDialogTransfer(item){
            const _this = this;
            _this.transferData = new Appointment();
            _this.transferData.durationType = 'minutes';
            _this.transferData.code = item.code;
            _this.transferData._id = item._id;
            _this.transferData.type = item.type;
            _this.transferData.content = item.content;
            _this.transferData.note = item.note;
            _this.transferData.transferReason = '';
            _this.dialogTransfer = true;
        },
        submitTransfer: debounce(async function (){
            const _this = this;
            _this.transferData.updatedBy = _this.userInfo.data.username;
            var newData = cloneDeep(_this.transferData);
            const data = await _this.$axios.$post('/api/appointment/transferBooking', newData);
            if (data.success) {
                _this.dialogTransfer = false;
                _this.transferData = {};
                _this.$message({
                    message: data.message,
                    type: 'success',
                });
                _this.getData(_this.searchQuery);
            } else {
                console.log('Error: ', data.error);
                _this.$message.error(data.error);
            }
        }),
        openCalendar(){
            const _this = this;
            _this.dialogCalendarByDentist = true;
            if(_this.$refs.calendarByDentistComponent){
                _this.$refs.calendarByDentistComponent.getData();
            };
        },
        selectEmptyCalendar(e){
            const _this = this;
            _this.transferData.date = new Date(moment(e.start).format('YYYY/MM/DD'));
            _this.transferData.time = moment(e.start).format('HH:mm');
            if(_this.transferData.durationType == 'hours'){
                _this.transferData.duration = Math.floor(Math.abs(e.end - e.start)/60000)/60;
            }
            else{
                _this.transferData.duration = Math.floor(Math.abs(e.end - e.start)/60000);
            }
            _this.dialogCalendarByDentist = false;
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
                const data = await _this.$axios.$post('/api/appointment/sendMail', { id: id, currentUser: _this.userInfo.data.username });
                if(data.success){
                    _this.$message({
                        message: data.message,
                        type: 'success',
                    });
                    _this.getData(_this.searchQuery);
                }else {
                    _this.$message.error(data.error);
                }
                _this.dataLoading = false;
            }).catch(() => {});
        },
        getAppointmentContent(content){
            const _this = this;
            let data = _.find(_this.appointmentContent, { value: content });
			return data ? data.label : '';
        },
        async cancelBooking(id){
            const _this = this;
            _this.dataLoading = true;
            _this.
                $prompt('Lý do hủy *', 'Xác nhận hủy lịch hẹn', {
                    confirmButtonText: 'Xác nhận',
					cancelButtonText: 'Hủy',
                    type: 'warning',
                    inputPlaceholder: 'Nhập lý do hủy',
                    inputValidator: this.validateInput
                }).then(async ({ value }) => {
                    if (value) {
                        const data = await _this.$axios.$put('/api/appointment/cancelBooking', {
                            id: id,
                            cancelReason: value,
                            updatedBy: _this.userInfo.data.username
                        });
                        if (data.success) {
                            _this.dialogUpdateAppointment = false;
                            _this.updateData = new Appointment();
                            _this.$message({
                                message: 'Hủy lịch hẹn thành công',
                                type: 'success',
                            });
                            _this.dataLoading = false;
                            _this.getData(_this.searchQuery);
                        } else {
                            _this.$message.error(data.error);
                            _this.dataLoading = false;
                        }
                    }
                    else{
                        _this.dataLoading = false;
                        _this.$message({
                            type: 'error',
                            message: 'Vui lòng nhập lý do hủy',
                        });
                    }
                })
                .catch((error) => {
                    _this.dataLoading = false;
                    console.log(error);
                });
        },
        validateInput (input) {
            if (input) return true;
            else return 'Vui lòng nhập lý do hủy.';
        },
        viewExamination(data){
            const _this = this;
            if(data && data.examinationId && data.customerId){
                let routeData = _this.$router.resolve({
                    path: `/customer/${data.customerId}/examination/edit`,
                    query: { examinationId: data.examinationId }
                });
                window.open(routeData.href, '_blank');
            }
        }
    },
}
</script>

<style>
.dialog-title{
    color: #fff;
    line-height: 24px;
    font-size: 18px;
}
</style>