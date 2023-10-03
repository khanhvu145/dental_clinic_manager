<template>
    <div class="examinationContainer">
        <el-dialog
            :visible.sync='dialog.visible'
            width='95%'
            title="Thêm/sửa chẩn đoán và điều trị"
            :close-on-click-modal="false"
        >
            <div class="row">
                <div class="col-md-12">
                    <fieldset class="custom-fieldset">
                        <legend class="custom-legend">Sơ đồ răng *</legend>
                        <div class="row mt-3 mb-3">
                            <div class="col-md-12" style="text-align: right;">
                                <el-radio-group v-model="data.toothType" @change="toothDiagramTabChange">
                                    <el-radio-button label="permanentTeeth">Răng vĩnh viễn</el-radio-button>
                                    <el-radio-button label="milkTooth">Răng sữa</el-radio-button>
                                </el-radio-group>
                            </div>
                            <div class="col-md-12 mt-3" style="text-align: right;">
                                <el-checkbox-group v-model="jawList" :max="1" @change="handleChangeJawList">
                                    <el-checkbox label="twoJaw">Hai hàm</el-checkbox>
                                    <el-checkbox label="upperJaw">Hàm trên</el-checkbox>
                                    <el-checkbox label="lowerJaw">Hàm dưới</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                        <div v-if="toothDiagramActive=='permanentTeeth'" class="row">
                            <div v-for="item in permanentTeethData" :key="item.key" class="col-md-6 mb-2 col-custom">
                                <div class="toothDiagramItem">
                                    <el-checkbox-group v-model="data.toothList" size="mini" :disabled="(jawList != null && jawList.length > 0)" @change="handleChangeToothList">
                                        <template>
                                            <div class="permanentTeethGrid">
                                                <el-checkbox-button v-for="teeth in item.tooths" :label="teeth.value" :key="teeth.value">
                                                    <template>
                                                        <div class="tooth-icon" style="font-size:calc(100vw/40);">
                                                            <font-awesome-icon icon="fa-solid fa-tooth" />
                                                        </div>
                                                        <div class="tooth-name mt-2">
                                                            <span>{{ teeth.label }}</span>
                                                        </div>
                                                    </template>
                                                </el-checkbox-button>
                                            </div>
                                        </template>
                                    </el-checkbox-group>
                                </div>
                            </div>
                        </div>
                        <div v-else class="row">
                            <div v-for="item in milkToothData" :key="item.key" class="col-lg-6 mb-2 col-custom">
                                <div class="toothDiagramItem">
                                    <el-checkbox-group v-model="data.toothList" size="mini" :disabled="(jawList != null && jawList.length > 0)" @change="handleChangeToothList">
                                        <template>
                                            <div class="milkToothGrid">
                                                <el-checkbox-button v-for="teeth in item.tooths" :label="teeth.value" :key="teeth.value">
                                                    <template>
                                                        <div class="tooth-icon" style="font-size:calc(100vw/40);">
                                                            <font-awesome-icon icon="fa-solid fa-tooth" />
                                                        </div>
                                                        <div class="tooth-name mt-2">
                                                            <span>{{ teeth.label }}</span>
                                                        </div>
                                                    </template>
                                                </el-checkbox-button>
                                            </div>
                                        </template>
                                    </el-checkbox-group>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-md-7">
                    <fieldset class="custom-fieldset">
                        <legend class="custom-legend">Chẩn đoán và điều trị *</legend>
                            <div class="row mt-3">
                                <div class="col-md-3">Chẩn đoán:</div>
                                <div class="col-md-9">
                                    <el-input type="textarea" :rows="4" placeholder="Nhập chẩn đoán" v-model="data.diagnose"></el-input>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-md-3">Điều trị:</div>
                                <div class="col-md-9">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <el-select v-model="data.serviceGroupId" placeholder="Nhóm dịch vụ" name="serviceGroupId" clearable filterable @change="onSelectServiceGroup($event)">
                                                <el-option
                                                    v-for="item in serviceGroupData"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                        </div>
                                        <div class="col-md-12 mt-3">
                                            <el-select v-model="data.serviceId" placeholder="Dịch vụ" name="serviceId" clearable filterable :disabled="data.serviceGroupId == null || data.serviceGroupId == ''" @change="handleChangeService($event)">
                                                <el-option
                                                    v-for="item in serviceByGroupData"
                                                    :key="item._id"
                                                    :label="item.name"
                                                    :value="item._id"
                                                ></el-option>
                                            </el-select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </fieldset>
                </div>
                <div class="col-md-5">
                    <fieldset class="custom-fieldset">
                        <legend class="custom-legend">Thông tin thanh toán</legend>
                        <div class="row mt-3">
                            <div class="col-md-3">Số lượng:</div>
                            <div class="col-md-9">
                                <el-input 
                                    v-if="(jawList != null && jawList.length > 0)"
                                    name="quantity" 
                                    placeholder="Số lượng" 
                                    v-model="data.quantityJaw" 
                                    class="inputTextRight"
                                    readonly
                                >
                                    <template slot="append">Hàm</template>
                                </el-input>
                                <el-input 
                                    v-else
                                    name="quantity" 
                                    placeholder="Số lượng" 
                                    v-model="data.quantity" 
                                    class="inputTextRight"
                                    readonly
                                >
                                    <template slot="append">Răng</template>
                                </el-input>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-3">Đơn giá:</div>
                            <div class="col-md-9 inputTextRight">
                                <!-- <vue-autonumeric
                                    v-model="data.unitPrice"
                                    class="el-input__inner"
                                    placeholder="Đơn giá" 
                                    readonly
                                    :options="{
                                        decimalPlaces: 0,
                                        digitGroupSeparator: ',',
                                        decimalCharacter: '.',
                                        decimalCharacterAlternative: '.',
                                        currencySymbol: '\u00a0VND',
                                        currencySymbolPlacement: 's',
                                        roundingMethod: 'U',
                                        minimumValue: '0',
                                    }"
                                ></vue-autonumeric> -->
                                <!-- <el-input 
                                    name="quantity" 
                                    placeholder="Đơn giá" 
                                    v-model="data.toothData.length" 
                                    class="inputTextRight"
                                    disabled
                                >
                                    <template slot="append">VND</template>
                                </el-input> -->
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-3">Giảm giá:</div>
                            <div class="col-md-9 inputTextRight">
                                <!-- <vue-autonumeric
                                    placeholder="Giảm giá" 
                                    v-model="data.discount" 
                                    class="el-input__inner"
                                    @change.native="handleChangeDiscount"
                                    :options="{
                                        decimalPlaces: 0,
                                        digitGroupSeparator: ',',
                                        decimalCharacter: '.',
                                        decimalCharacterAlternative: '.',
                                        currencySymbol: '\u00a0VND',
                                        currencySymbolPlacement: 's',
                                        roundingMethod: 'U',
                                        minimumValue: '0',
                                    }"
                                ></vue-autonumeric> -->
                                <!-- <el-input 
                                    name="quantity" 
                                    placeholder="Giảm giá" 
                                    v-model="data.discount" 
                                    class="inputTextRight"
                                >
                                    <template slot="append">VND</template>
                                </el-input> -->
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-3">Thành tiền:</div>
                            <div class="col-md-9 inputTextRight">
                                <!-- <vue-autonumeric
                                    v-model="data.totalPrice"
                                    class="el-input__inner"
                                    placeholder="Thành tiền" 
                                    readonly
                                    :options="{
                                        decimalPlaces: 0,
                                        digitGroupSeparator: ',',
                                        decimalCharacter: '.',
                                        decimalCharacterAlternative: '.',
                                        currencySymbol: '\u00a0VND',
                                        currencySymbolPlacement: 's',
                                        roundingMethod: 'U',
                                    }"
                                ></vue-autonumeric> -->
                                <!-- <el-input 
                                    name="quantity" 
                                    placeholder="Thành tiền" 
                                    v-model="data.toothData.length" 
                                    class="inputTextRight"
                                    disabled
                                >
                                    <template slot="append">VND</template>
                                </el-input> -->
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <button type="button" class="control-btn gray" @click="dialog.visible = false;">
                    <span>Đóng</span>
                </button>
                <button
                    v-if="dialog.type == 'create'"
                    type="button" 
                    class="control-btn green"
                    @click="addItem()"
                >
                    <span>Thêm</span>
                </button>
                <button
                    v-else-if="dialog.type == 'update'"
                    type="button" 
                    class="control-btn green"
                    @click="updateItem"
                >
                    <span>Cập nhật</span>
                </button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { milkTooth, permanentTeeth } from '@/utils/masterData';
// import VueAutonumeric from 'vue-autonumeric';
export default {
    name: 'AddExamination',
    props: {
        dialog: {
            type: Object,
            default: {
                visible: false,
                type: 'create',
                data: {
                    key: 0,
                    toothType: 'permanentTeeth',
                    isJaw: false,
                    jaw: '',
                    toothList: [],
                    diagnose: '',
                    serviceGroupId: '',
                    serviceId: '',
                    quantity: 0,
                    quantityJaw: 0,
                    unitPrice: 0,
                    discount: 0,
                    totalPrice: 0,
                }
            }
        },
    },
    components: {
        // 'vue-autonumeric': VueAutonumeric,
    },
     data() {
        return {
            data: {},
            dialogVisible: false,
            toothDiagramActive: 'permanentTeeth',
            permanentTeethData: permanentTeeth,
            milkToothData: milkTooth,
            serviceGroupData: [],
            serviceData: [],
            serviceByGroupData: [],
            jawList: [],
        }
    },
    watch: {
        'dialog.visible': {
            immediate: true,
            async handler(newVal, oldVal) {
                const _this = this;
                if (newVal) {
                    const _this = this;
                    _this.resetDialog();
                }
            }
        },
    },
    async created() {
        const _this = this;
        _this.serviceGroupData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'serviceGroupData' })) || [];
        const services = await this.$axios.$post('/api/service/getByQuery', {
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
        // _this.resetDialog();
        _this.serviceData = services.data;
        // _this.data = _this.dialog.data;
    },
    methods: {
        resetDialog() {
            const _this = this;
            if(_this.dialog.type == 'update'){
                _this.data = _this.dialog.data;
                if(_this.dialog.data.jaw != null && _this.dialog.data.jaw != ''){
                    _this.jawList.push(_this.dialog.data.jaw);
                }
                else{
                    _this.jawList = [];
                }
            }
            else{
                _this.data = {
                    key: 0,
                    toothType: 'permanentTeeth',
                    isJaw: false,
                    jaw: '',
                    toothList: [],
                    diagnose: '',
                    serviceGroupId: '',
                    serviceId: '',
                    quantity: 0,
                    quantityJaw: 0,
                    unitPrice: 0,
                    discount: 0,
                    totalPrice: 0,
                };
                _this.jawList = [];
            }
        },
        toothDiagramTabChange(){
            const _this = this;
            _this.data.toothList = [];
            _this.data.quantity = 0;
        },
        onSelectServiceGroup(value) {
            const _this = this;
            _this.data.serviceId = '';
            if(value){
                var service = _.filter([..._this.serviceData] || [], {'groupId': value});
                _this.serviceByGroupData = service.map(item => {
                    return {
                        ...item,
                    }
                })
            }
            else{
                _this.serviceByGroupData = [];
            }
		},
        addItem(){
            const _this = this;
            //Kiểm tra điều kiện
            if(_this.data.serviceId == null || _this.data.serviceId == ''){
                return _this.$message({
                    message: 'Vui lòng chọn thủ thuật điều trị',
                    type: 'error',
                });
            }
            else{
                var service = _.find(_this.serviceByGroupData, function(item) {
                    if (item._id == _this.data.serviceId) {
                        return item;
                    }
                });
                if(service){
                    if(service.unit == 'unit2'){
                        if(!_this.data.isJaw){
                            return _this.$message({
                                message: 'Dịch vụ đã chọn được điều trị và thanh toán theo số hàm!',
                                type: 'error',
                            });
                        }
                    }
                    else{
                        if(_this.data.isJaw){
                            return _this.$message({
                                message: 'Dịch vụ đã chọn được điều trị và thanh toán theo số răng!',
                                type: 'error',
                            });
                        }
                    }
                }
                else{
                    return _this.$message({
                        message: 'Có lỗi xảy ra.',
                        type: 'error',
                    });
                }
            }
            if(_this.data.quantity == 0 && _this.data.quantityJaw == 0){
                return _this.$message({
                    message: 'Vui lòng chọn răng/hàm điều trị',
                    type: 'error',
                });
            }
            //Xử lý
            _this.$emit('addExamination', _this.data);
            _this.dialog.visible = false;
            // _this.resetDialog();
        },
        updateItem(){
            const _this = this;
        },
        handleChangeJawList(e){
            const _this = this;
            if(e.length > 0){
                _this.data.isJaw = true;
                _this.data.toothList = [];
                _this.data.jaw = e[0];
                _this.data.quantityJaw = e[0] == 'twoJaw' ? 2 : 1;
            }
            else{
                _this.data.isJaw = false;
                _this.data.jaw = '';
                _this.data.quantityJaw = 0;
            }

            _this.calcTotalPrice();
        },
        handleChangeToothList(){
            const _this = this;
            _this.data.quantity = _this.data.toothList.length;
            _this.calcTotalPrice();
        },
        handleChangeService(value){
            const _this = this;
            if(value != null && value != ''){
                var service = _.find(_this.serviceByGroupData, function(item) {
                    if (item._id == value) {
                        return item;
                    }
                });

                if(service){
                    if(service.unit == 'unit2'){
                        if(!_this.data.isJaw){
                            _this.$message({
                                message: 'Dịch vụ này được điều trị và thanh toán theo số hàm!',
                                type: 'warning',
                            });
                        }
                    }
                    else{
                        if(_this.data.isJaw){
                            _this.$message({
                                message: 'Dịch vụ này được điều trị và thanh toán theo số răng!',
                                type: 'warning',
                            });
                        }
                    }
                }

                _this.data.unitPrice = service ? (service.price || 0) : 0;
            }
            else{
                _this.data.unitPrice = 0;
            }
            _this.calcTotalPrice();
        },
        handleChangeDiscount(){
            const _this = this;
            _this.calcTotalPrice();
        },
        calcTotalPrice(){
            const _this = this;
            _this.data.totalPrice = 0;
            var quantity = _this.data.isJaw ? _this.data.quantityJaw : _this.data.quantity;
            _this.data.totalPrice = (_this.data.unitPrice*quantity) - _this.data.discount;
        },
    }
}
</script>

<style>
.custom-fieldset {
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    padding: 0 16px 16px;
}
.custom-legend {
    font-size: 12px;
    font-weight: bold;
    line-height: 1.5;
    margin: 0;
    padding: 0 8px;
    text-align: left;
    text-transform: uppercase;
    width: auto;
    color: #DC3545;
}
.toothDiagramItem{
    border: 1px solid #dcdfe6;
}
.el-checkbox-button__inner{
    border: none;
}
.permanentTeethGrid{
    display: grid;
    grid-template-columns: auto auto auto auto auto auto auto auto;
    gap: 4px;
    padding: 12px;
}
.milkToothGrid{
    display: grid;
    grid-template-columns: auto auto auto auto auto;
    gap: 4px;
    padding: 12px;
}
.examinationContainer .el-checkbox-button__inner{
    border: none !important;
}
.examinationContainer .el-checkbox-button__inner{
    border-radius: 4px !important;
    border: none !important;
    width: 100%;
}
.examinationContainer .el-checkbox-button.is-checked .el-checkbox-button__inner{
    color: #FFF;
    background-color: #9bc867 !important;
    box-shadow: none !important;
}
.examinationContainer .el-checkbox-button__inner:hover {
    color: #9bc867;
}
.examinationContainer .el-checkbox-button--mini .el-checkbox-button__inner{
    padding: 6px 5px;
}
@media only screen and (min-width: 768px) {
    .col-custom:nth-child(2n-1){
        padding-right: 4px;
    }
    .col-custom:nth-child(2n){
        padding-left: 4px;
    }
}
.tooth-icon{
    color: #ccc;
    transition: all .3s cubic-bezier(.645,.045,.355,1);
}
.examinationContainer .el-checkbox-button__inner:hover .tooth-icon{
    color: #9bc867;
}
.examinationContainer .el-checkbox-button.is-checked .tooth-icon{
    color: #FFF;
}
</style>