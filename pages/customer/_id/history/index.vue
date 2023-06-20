<template>
    <LeftMenu>
        <div class="">
            <div class="row mt-4">
                <div class="col-md-12" style="text-align: right;">
                    <button type="button" class="control-btn gray" @click="$router.push('/customer')">
                        <i class='bx bx-arrow-back'></i>
                        <span>Quay lại</span>
                    </button>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-md-3">
                    <div class="col-form-label">Mã phiếu</div>
                    <el-input placeholder="Mã..." v-model="searchQuery.filters.codeF" name="codeF"></el-input>
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
                    <div class="col-form-label">Ngày khám</div>
                    <el-date-picker
                        v-model="searchQuery.filters.dateF"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="Ngày bắt đầu"
                        end-placeholder="Ngày kết thúc"
                        format="dd/MM/yyyy">
                    </el-date-picker>
                </div>
                <div class="col-md-3">
                    <div style="display: flex; height: 100%; align-items: end; gap: 8px;">
                        <button type="button" class="control-btn gray" @click="refreshData()">
                            <i class='bx bx-refresh'></i>
                        </button>
                        <button type="button" class="control-btn green" @click="getData(searchQuery)">
                            <i class='bx bx-search'></i>
                            Tìm
                        </button>
                    </div>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-md-12">
                    <el-table :data="data.data" v-loading="dataLoading" style="width: 100%" stripe>
                        <el-table-column label="Mã" min-width="80">
                            <template slot-scope="scope">
                                {{scope.row.code}}
                            </template>
                        </el-table-column>
                        <el-table-column label="Ngày khám" min-width="80">
                            <template slot-scope="scope">
                                {{ scope.row.createdAt ? $moment(scope.row.createdAt).format('DD/MM/YYYY') : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Nha sĩ phụ trách" min-width="100">
                            <template slot-scope="scope">
                                Ns. {{scope.row.dentistName}}
                            </template>
                        </el-table-column>
                        <el-table-column label="Chi phí điều trị" min-width="100">
                            <template slot-scope="scope">
                                {{ (scope.row.totalAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Thao tác" min-width="60">
                             <template slot-scope="scope">
                                <a class="btn control-btn blue2" style="padding: 4px 6px;" @click="viewExamination(scope.row)">
                                    <i class='bx bx-show'></i>
                                </a>
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
            <el-dialog
                :visible.sync='viewDialog.visible'
                :width='viewDialog.width'
                :title="`Phiếu khám ${viewDialog.data ? viewDialog.data.code : ''}`"
                :close-on-click-modal="false"
            >
                <div v-if="viewDialog.data" class="container" style="color:#000;">
                    <div class="row">
                        <div class="col-md-3">
                            <el-image
                                style="width: 100%; height: auto"
                                src="/images/logoclinic.png"
                                fit="cover">
                            </el-image>
                        </div>
                        <div class="col-md-9">
                            <div style="font-weight:bold;font-size:16px;">NHA KHOA AN TÂM</div>
                            <div class="mt-3">
                                <span style="font-weight:bold;">Địa chỉ:</span>
                                <span>Quận 3, HCM</span>
                            </div>
                            <div class="mt-2">
                                <span style="font-weight:bold;">Số điện thoại:</span>
                                <span>0703260457</span>
                            </div>
                            <div class="mt-2">
                                <span style="font-weight:bold;">Email:</span>
                                <span>dentalclinic@gmail.com</span>
                            </div>
                            <div class="mt-2">
                                <span style="font-weight:bold;">Website:</span>
                                <span>https://www.google.com</span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-12 text-center">
                            <div style="font-weight:bold;font-size:24px;">PHIẾU KHÁM VÀ ĐIỀU TRỊ</div>
                        </div>
                        <div class="col-md-12 mt-2">
                            <div class="row">
                                <div class="col-md-4"></div>
                                <div class="col-md-4 text-center">Ngày {{$moment(viewDialog.data.createdAt).format('DD')}} tháng {{$moment(viewDialog.data.createdAt).format('MM')}} năm {{$moment(viewDialog.data.createdAt).format('YYYY')}}</div>
                                <div class="col-md-4 text-right">Mã: {{viewDialog.data.code}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-4">
                        <div class="col-md-6 mb-2">
                            <span style="font-weight: bold;">Mã khách hàng: </span>
                            {{ customerInfo.code || '' }}
                        </div>
                        <div class="col-md-6 mb-2">
                            <span style="font-weight: bold;">Họ và tên: </span>
                            {{ customerInfo.name || '' }}
                        </div>
                        <div class="col-md-6 mb-2">
                            <span style="font-weight: bold;">Ngày sinh: </span>
                            {{ $moment(customerInfo.birthday).format('DD/MM/YYYY') || '' }}
                        </div>
                        <div class="col-md-6 mb-2">
                            <span style="font-weight: bold;">Giới tính: </span>
                            {{ customerInfo.gender == 'male' ? 'Nam' : 'Nữ' || '' }}
                        </div>
                        <div class="col-md-6 mb-2">
                            <span style="font-weight: bold;">CMND/CCCD: </span>
                            {{ customerInfo.physicalId || '' }}
                        </div>
                        <div class="col-md-6 mb-2">
                                <span style="font-weight: bold;">Số điện thoại: </span>
                            {{ customerInfo.phone || '' }}
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-6 mt-2">
                            <div class="row">
                                <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                    <i class='bx bx-check-circle' style="font-size:20px;" ></i>
                                    TIỀN SỬ BỆNH
                                </div>
                                <div class="col-md-12 mt-2">
                                    <ul v-if="viewDialog.data.anamnesis != null && viewDialog.data.anamnesis.length > 0" class="ml-3">
                                        <li v-for="item in viewDialog.data.anamnesis" :key="item.value" class="mb-2">
                                            <span style="font-family:Wingdings">&#118;</span>
                                            {{item.label}} {{item.note ? ` - ${item.note}` : ''}}
                                        </li>
                                    </ul>
                                    <ul v-else class="ml-3">
                                        <li class="mb-5 pb-2">- Không có</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mt-2">
                            <div class="row">
                                <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                    <i class='bx bx-check-circle' style="font-size:20px;" ></i>
                                    DỊ ỨNG
                                </div>
                                <div class="col-md-12 mt-2">
                                    <ul v-if="viewDialog.data.allergy != null && viewDialog.data.allergy.allergies != null && viewDialog.data.allergy.allergies.length > 0" class="ml-3">
                                        <li v-for="item in viewDialog.data.allergy.allergies" :key="item" class="mb-2">
                                            <span style="font-family:Wingdings">&#118;</span>
                                            {{getAllergyName(item)}}
                                        </li>
                                        <li v-if="viewDialog.data.allergy.other" class="mb-2">
                                            <span style="font-family:Wingdings">&#118;</span>
                                            {{viewDialog.data.allergy.other}}
                                        </li>
                                    </ul>
                                    <ul v-else class="ml-3">
                                        <li class="mb-5 pb-2">- Không có</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mt-2">
                            <div class="row">
                                <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                    <i class='bx bx-check-circle' style="font-size:20px;" ></i>
                                    KHÁM LÂM SÀNG
                                </div>
                                <div class="col-md-12 mt-2">
                                    <ul v-if="viewDialog.data.clinicalExam" class="ml-3">
                                        <li  class="mb-2">
                                            <span style="font-family:Wingdings">&#118;</span>
                                            {{viewDialog.data.clinicalExam}}
                                        </li>
                                    </ul>
                                    <ul v-else class="ml-3">
                                        <li class="mb-5 pb-2">- Không có thông tin khám</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mt-2">
                            <div class="row">
                                <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                    <i class='bx bx-check-circle' style="font-size:20px;" ></i>
                                    KHÁM CẬN LÂM SÀNG
                                </div>
                                <div class="col-md-12 mt-2">
                                    <ul class="ml-3">
                                        <li class="mb-2">
                                            <span style="font-family:Wingdings">&#118;</span>
                                            X-quang:
                                            <span v-if="viewDialog.data.preclinicalExam != null && viewDialog.data.preclinicalExam.xquang != null && viewDialog.data.preclinicalExam.xquang.length > 0">
                                                <span v-for="(item, index) in viewDialog.data.preclinicalExam.xquang" :key="index">
                                                    {{index > 0 ? ', ' : ' '}} {{getXquangName(item)}}
                                                </span>
                                            </span> 
                                        </li>
                                        <li class="mb-2">
                                            <span style="font-family:Wingdings">&#118;</span>
                                            Xét nghiệm:
                                            <span v-if="viewDialog.data.preclinicalExam != null && viewDialog.data.preclinicalExam.test != null && viewDialog.data.preclinicalExam.test.length > 0">
                                                <span v-for="(item, index) in viewDialog.data.preclinicalExam.test" :key="index">
                                                    {{index > 0 ? ', ' : ' '}} {{getTestName(item)}}
                                                </span>
                                            </span>
                                        </li>
                                        <li class="mb-2">
                                            <span style="font-family:Wingdings">&#118;</span>
                                            Khác: 
                                            <span v-if="viewDialog.data.preclinicalExam != null && viewDialog.data.preclinicalExam.other != null">
                                                {{viewDialog.data.preclinicalExam.other}}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                            <i class='bx bx-check-circle' style="font-size:20px;" ></i>
                            CHẨN ĐOÁN VÀ ĐIỀU TRỊ
                        </div>
                        <div class="col-md-12 mt-2">
                            <table class="table table-bordered">
                                <thead>
                                    <tr class="table-secondary" style="text-align:center;font-weight:bold;"> 
                                        <th scope="col">Răng/hàm</th>
                                        <th scope="col">Chẩn đoán</th>
                                        <th scope="col">Điều trị</th>
                                        <th scope="col">Đơn giá</th>
                                        <th scope="col">SL</th>
                                        <th scope="col">Giảm giá</th>
                                        <th scope="col">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in viewDialog.data.diagnosisTreatment" :key="item.key">
                                        <td>
                                            {{ getToothName(item.isJaw, item.toothList, item.jaw ? item.jaw[0] : '') }}
                                        </td>
                                        <td>
                                            {{ item.diagnose }}
                                        </td>
                                        <td>
                                            {{ getServiceName(item.serviceId) }}
                                        </td>
                                        <td style="text-align:right;">
                                            {{ (item.unitPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                        </td>
                                        <td style="text-align:center;">
                                            {{ item.isJaw ? item.quantityJaw : item.quantity }}
                                        </td>
                                        <td style="text-align:right;">
                                            {{ (item.discount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                        </td>
                                        <td style="text-align:right;">
                                            {{ (item.totalPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                    <i class='bx bx-check-circle' style="font-size:20px;"></i>
                                    GHI CHÚ
                                </div>
                                <div class="col-md-12 ml-3 mt-2">
                                    {{viewDialog.data.note}}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                    <i class='bx bx-check-circle' style="font-size:20px;"></i>
                                    TỔNG CHI PHÍ ĐIỀU TRỊ
                                </div>
                                <div class="col-md-12 ml-2">
                                    <table class="table table-borderless" style="font-size:14px;">
                                        <tbody>
                                            <tr>
                                                <td style="width:40%;font-weight:bold;">Chi phí điều trị</td>
                                                <td style="width:5%">:</td>
                                                <td style="text-align:right;width:55%">
                                                    <span>{{ viewDialog.data.treatmentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }} VND</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width:40%;font-weight:bold;">Giảm giá</td>
                                                <td style="width:5%">:</td>
                                                <td style="text-align:right;width:55%">
                                                    <span>{{ viewDialog.data.totalDiscountAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }} VND</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width:40%;font-weight:bold;">Thành tiền</td>
                                                <td style="width:5%">:</td>
                                                <td style="text-align:right;width:55%">
                                                    <span>{{ viewDialog.data.totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }} VND</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row mt-4">
                        <div class="col-md-6" style="text-align:center;">
                            <div>Nha sĩ điều trị</div>
                            <div style="font-style:italic;">(Ký và ghi rõ họ tên)</div>
                            <div class="mt-3" style="font-weight:bold;font-size:16px;">
                                {{viewDialog.data.dentistName || ''}}
                            </div>
                        </div>
                        <div class="col-md-6" style="text-align:center;">
                            <div>Khách hàng</div>
                            <div style="font-style:italic;">(Ký và ghi rõ họ tên)</div>
                            <div class="mt-3" style="font-weight:bold;font-size:16px;">
                                {{customerInfo.name || ''}}
                            </div>
                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <button
                        type="button" 
                        class="control-btn yellow"
                        @click="printExamination()"
                    >
                        <span>In phiếu khám</span>
                    </button>
                    <button type="button" class="control-btn gray" @click="viewDialog.visible = false">
                        <span>Đóng</span>
                    </button>
                </span>
            </el-dialog>
            <vue-html2pdf 
                class="print-content"
                id="print-content-pdf"
                :show-layout="false"
                :float-layout="true"
                :preview-modal="true"
                :enable-download="false"
                :paginate-elements-by-height="1500"
                :filename="'test'"
                :pdf-quality="2"
                :manual-pagination="false"
                pdf-format="a4"
                pdf-orientation="portrait"
                pdf-content-width="100%"
                ref="html2Pdf_history"
            >
                <section slot="pdf-content">
                    <div v-if="viewDialog.data" class="container mt-3" style="color:#000;font-size:13px;">
                        <div class="row">
                            <div class="col-md-3">
                                <el-image
                                    style="width: 100%; height: auto"
                                    src="/images/logoclinic.png"
                                    fit="cover">
                                </el-image>
                            </div>
                            <div class="col-md-9">
                                <div style="font-weight:bold;font-size:16px;">NHA KHOA AN TÂM</div>
                                <div class="mt-3">
                                    <span style="font-weight:bold;">Địa chỉ:</span>
                                    <span>Quận 3, HCM</span>
                                </div>
                                <div class="mt-2">
                                    <span style="font-weight:bold;">Số điện thoại:</span>
                                    <span>0703260457</span>
                                </div>
                                <div class="mt-2">
                                    <span style="font-weight:bold;">Email:</span>
                                    <span>dentalclinic@gmail.com</span>
                                </div>
                                <div class="mt-2">
                                    <span style="font-weight:bold;">Website:</span>
                                    <span>https://www.google.com</span>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-md-12 text-center">
                                <div style="font-weight:bold;font-size:24px;">PHIẾU KHÁM VÀ ĐIỀU TRỊ</div>
                            </div>
                            <div class="col-md-12 mt-2">
                                <div class="row">
                                    <div class="col-md-4"></div>
                                    <div class="col-md-4 text-center">Ngày {{$moment(viewDialog.data.createdAt).format('DD')}} tháng {{$moment(viewDialog.data.createdAt).format('MM')}} năm {{$moment(viewDialog.data.createdAt).format('YYYY')}}</div>
                                    <div class="col-md-4 text-right">Mã: {{viewDialog.data.code}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-4">
                            <div class="col-md-6 mb-2">
                                <span style="font-weight: bold;">Mã khách hàng: </span>
                                {{ customerInfo.code || '' }}
                            </div>
                            <div class="col-md-6 mb-2">
                                <span style="font-weight: bold;">Họ và tên: </span>
                                {{ customerInfo.name || '' }}
                            </div>
                            <div class="col-md-6 mb-2">
                                <span style="font-weight: bold;">Ngày sinh: </span>
                                {{ $moment(customerInfo.birthday).format('DD/MM/YYYY') || '' }}
                            </div>
                            <div class="col-md-6 mb-2">
                                <span style="font-weight: bold;">Giới tính: </span>
                                {{ customerInfo.gender == 'male' ? 'Nam' : 'Nữ' || '' }}
                            </div>
                            <div class="col-md-6 mb-2">
                                <span style="font-weight: bold;">CMND/CCCD: </span>
                                {{ customerInfo.physicalId || '' }}
                            </div>
                            <div class="col-md-6 mb-2">
                                    <span style="font-weight: bold;">Số điện thoại: </span>
                                {{ customerInfo.phone || '' }}
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-6 mt-2">
                                <div class="row">
                                    <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                        <i class='bx bx-check-circle' style="font-size:20px;" ></i>
                                        TIỀN SỬ BỆNH
                                    </div>
                                    <div class="col-md-12 mt-2">
                                        <ul v-if="viewDialog.data.anamnesis != null && viewDialog.data.anamnesis.length > 0" class="ml-3">
                                            <li v-for="item in viewDialog.data.anamnesis" :key="item.value" class="mb-2">
                                                <span style="font-family:Wingdings">&#118;</span>
                                                {{item.label}} {{item.note ? ` - ${item.note}` : ''}}
                                            </li>
                                        </ul>
                                        <ul v-else class="ml-3">
                                            <li class="mb-5 pb-2">- Không có</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 mt-2">
                                <div class="row">
                                    <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                        <i class='bx bx-check-circle' style="font-size:20px;" ></i>
                                        DỊ ỨNG
                                    </div>
                                    <div class="col-md-12 mt-2">
                                        <ul v-if="viewDialog.data.allergy != null && viewDialog.data.allergy.allergies != null && viewDialog.data.allergy.allergies.length > 0" class="ml-3">
                                            <li v-for="item in viewDialog.data.allergy.allergies" :key="item" class="mb-2">
                                                <span style="font-family:Wingdings">&#118;</span>
                                                {{getAllergyName(item)}}
                                            </li>
                                            <li v-if="viewDialog.data.allergy.other" class="mb-2">
                                                <span style="font-family:Wingdings">&#118;</span>
                                                {{viewDialog.data.allergy.other}}
                                            </li>
                                        </ul>
                                        <ul v-else class="ml-3">
                                            <li class="mb-5 pb-2">- Không có</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 mt-2">
                                <div class="row">
                                    <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                        <i class='bx bx-check-circle' style="font-size:20px;" ></i>
                                        KHÁM LÂM SÀNG
                                    </div>
                                    <div class="col-md-12 mt-2">
                                        <ul v-if="viewDialog.data.clinicalExam" class="ml-3">
                                            <li  class="mb-2">
                                                <span style="font-family:Wingdings">&#118;</span>
                                                {{viewDialog.data.clinicalExam}}
                                            </li>
                                        </ul>
                                        <ul v-else class="ml-3">
                                            <li class="mb-5 pb-2">- Không có thông tin khám</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 mt-2">
                                <div class="row">
                                    <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                        <i class='bx bx-check-circle' style="font-size:20px;" ></i>
                                        KHÁM CẬN LÂM SÀNG
                                    </div>
                                    <div class="col-md-12 mt-2">
                                        <ul class="ml-3">
                                            <li class="mb-2">
                                                <span style="font-family:Wingdings">&#118;</span>
                                                X-quang:
                                                <span v-if="viewDialog.data.preclinicalExam != null && viewDialog.data.preclinicalExam.xquang != null && viewDialog.data.preclinicalExam.xquang.length > 0">
                                                    <span v-for="(item, index) in viewDialog.data.preclinicalExam.xquang" :key="index">
                                                        {{index > 0 ? ', ' : ' '}} {{getXquangName(item)}}
                                                    </span>
                                                </span> 
                                            </li>
                                            <li class="mb-2">
                                                <span style="font-family:Wingdings">&#118;</span>
                                                Xét nghiệm:
                                                <span v-if="viewDialog.data.preclinicalExam != null && viewDialog.data.preclinicalExam.test != null && viewDialog.data.preclinicalExam.test.length > 0">
                                                    <span v-for="(item, index) in viewDialog.data.preclinicalExam.test" :key="index">
                                                        {{index > 0 ? ', ' : ' '}} {{getTestName(item)}}
                                                    </span>
                                                </span>
                                            </li>
                                            <li class="mb-2">
                                                <span style="font-family:Wingdings">&#118;</span>
                                                Khác: 
                                                <span v-if="viewDialog.data.preclinicalExam != null && viewDialog.data.preclinicalExam.other != null">
                                                    {{viewDialog.data.preclinicalExam.other}}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                <i class='bx bx-check-circle' style="font-size:20px;" ></i>
                                CHẨN ĐOÁN VÀ ĐIỀU TRỊ
                            </div>
                            <div class="col-md-12 mt-2">
                                <table class="table table-bordered">
                                    <thead>
                                        <tr class="table-secondary" style="text-align:center;font-weight:bold;"> 
                                            <th scope="col">Răng/hàm</th>
                                            <th scope="col">Chẩn đoán</th>
                                            <th scope="col">Điều trị</th>
                                            <th scope="col">Đơn giá</th>
                                            <th scope="col">SL</th>
                                            <th scope="col">Giảm giá</th>
                                            <th scope="col">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in viewDialog.data.diagnosisTreatment" :key="item.key">
                                            <td>
                                                {{ getToothName(item.isJaw, item.toothList, item.jaw ? item.jaw[0] : '') }}
                                            </td>
                                            <td>
                                                {{ item.diagnose }}
                                            </td>
                                            <td>
                                                {{ getServiceName(item.serviceId) }}
                                            </td>
                                            <td style="text-align:right;">
                                                {{ (item.unitPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                            </td>
                                            <td style="text-align:center;">
                                                {{ item.isJaw ? item.quantityJaw : item.quantity }}
                                            </td>
                                            <td style="text-align:right;">
                                                {{ (item.discount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                            </td>
                                            <td style="text-align:right;">
                                                {{ (item.totalPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '' }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                        <i class='bx bx-check-circle' style="font-size:20px;"></i>
                                        GHI CHÚ
                                    </div>
                                    <div class="col-md-12 ml-3 mt-2">
                                        {{viewDialog.data.note}}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-12" style="font-size:16px;font-weight:bold;">
                                        <i class='bx bx-check-circle' style="font-size:20px;"></i>
                                        TỔNG CHI PHÍ ĐIỀU TRỊ
                                    </div>
                                    <div class="col-md-12 ml-2">
                                        <table class="table table-borderless" style="font-size:14px;">
                                            <tbody>
                                                <tr>
                                                    <td style="width:40%;font-weight:bold;">Chi phí điều trị</td>
                                                    <td style="width:5%">:</td>
                                                    <td style="text-align:right;width:55%">
                                                        <span>{{ viewDialog.data.treatmentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }} VND</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="width:40%;font-weight:bold;">Giảm giá</td>
                                                    <td style="width:5%">:</td>
                                                    <td style="text-align:right;width:55%">
                                                        <span>{{ viewDialog.data.totalDiscountAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }} VND</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="width:40%;font-weight:bold;">Thành tiền</td>
                                                    <td style="width:5%">:</td>
                                                    <td style="text-align:right;width:55%">
                                                        <span>{{ viewDialog.data.totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0' }} VND</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="row mt-4">
                            <div class="col-md-6" style="text-align:center;">
                                <div>Nha sĩ điều trị</div>
                                <div style="font-style:italic;">(Ký và ghi rõ họ tên)</div>
                            </div>
                            <div class="col-md-6" style="text-align:center;">
                                <div>Khách hàng</div>
                                <div style="font-style:italic;">(Ký và ghi rõ họ tên)</div>
                            </div>
                        </div>
                    </div>
                </section>
            </vue-html2pdf>
        </div>
    </LeftMenu>
</template>

<script>
import { mapState } from 'vuex';
import LeftMenu from '@/components/customer/LeftMenu';
import Customer from '@/models/tw_Customer';
import Examination from '@/models/tw_Examination';
export default {
    components: {
		LeftMenu,
	},
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
    data(){
        return{
            searchQuery: {
                filters: {
                    codeF: '',
                    dentistsF: [],
                    dateF: [],
                },
                sorts: -1,
                pages:{
                    from: 0,
                    size: 10
                }
            },
            dentistsData: [],
            dataLoading: true,
            data: {},
            currentPage: 1,
            customerInfo: new Customer(),
            viewDialog: {
                visible: false,
                data: null,
                width: '60%'
            },
            xquangData: [],
            testData: [],
            allergyData: [],
            serviceData: [],
        }
    },
    async created(){
        const _this = this;
        //Lấy danh sách nha sĩ
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
        //Lấy thông tin khách hàng
        if (_this.$route.params.id) {
            await _this.$axios.$get(`/api/customer/getById/${_this.$route.params.id}`).then(
				async (response) => {
                    _this.customerInfo = response.data || new Customer();
				},
				(error) => {
                    console.log('Error: ', error);
					_this.$message({
						type: 'error',
						message: 'Có lỗi xảy ra',
					});
					 _this.customerInfo = new Customer();
				}
			);
        }
         //Lấy danh sách loại x-quang
        _this.xquangData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamXquang' })) || [];
        //Lấy danh sách loại xét nghiệm
        _this.testData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamTest' })) || [];
        //Lấy danh sách dị ứng
        _this.allergyData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'generalConfigExamAllergy' })) || [];
        //Lấy danh sách dịch vụ
        const services = await _this.$axios.$post('/api/service/getByQuery', {
            filters: {
                nameF: '',
                codeF: '',
                groupF: '',
                statusF: true
            },
            sorts: 'name&&1',
            pages:{
                from: 0,
                size: 1000
            }
        });
        _this.serviceData = services.data;
        //Lấy danh sách dữ liệu
        await _this.getData(_this.searchQuery);
    },
    methods: {
        checkRight(right) {
			const _this = this;
			// If user have permission below
			const values = ['customer.all', 'customer.' + right];
			return !!(intersection(_this.accesses || [], values).length > 0);
		},
        refreshData(){
            const _this = this;
            _this.searchQuery.filters = {
                codeF: '',
                dentistsF: [],
                dateF: []
            }
            _this.getData(_this.searchQuery);
        },
        async getData(searchQuery){
            const _this = this;
            _this.dataLoading = true;
             if (_this.$route.params.id) {
                searchQuery.filters.customerF = _this.$route.params.id;
                await _this.$axios.$post('/api/customer/getByQueryExamination', searchQuery).then(
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
             }
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
        viewExamination(data){
            const _this = this;
            var w = window.innerWidth;
            if(w >= 1200 && w <= 1500){
                _this.viewDialog.width = '60%'
            }
            else if(w >= 1100 && w < 1200){
                _this.viewDialog.width = '70%'
            }
            else if(w >= 900 && w < 1100){
                _this.viewDialog.width = '80%'
            }
            else if(w < 900){
                _this.viewDialog.width = '90%'
            }
            else{
                _this.viewDialog.width = '50%'
            }
            _this.viewDialog.data = data;
            _this.viewDialog.visible = true;
        },
        printExamination(id){
            const _this = this;
            _this.$refs.html2Pdf_history.generatePdf();
        },
        getXquangName(value){
            const _this = this;
            let data = _.find(_this.xquangData, { value: value });
			return data ? data.label : '';
        },
        getTestName(value){
            const _this = this;
            let data = _.find(_this.testData, { value: value });
			return data ? data.label : '';
        },
        getAllergyName(value){
            const _this = this;
            let data = _.find(_this.allergyData, { value: value });
			return data ? data.label : '';
        },
        getToothName(isJaw, toothList, jaw){
            const _this = this;
            if(isJaw){
                if(jaw == 'twoJaw'){
                    return 'Hai hàm';
                }
                else if(jaw == 'upperJaw'){
                    return 'Hàm trên';
                }
                else if(jaw == 'lowerJaw'){
                    return 'Hàm dưới';
                }
                else{
                    return '';
                }
            }
            else{
                if(toothList != null && toothList.length > 0){
                    var newArr = _.map(toothList, item => {
                        return `R${item}`;
                    })
                    var text = newArr.join(", ");
                    return text;
                }
                else{
                    return '';
                }
            }
        },
        getServiceName(serviceId){
            const _this = this;
            let data = _.find(_this.serviceData, { _id: serviceId });
			return data ? data.name : '';
        },
    }
}
</script>