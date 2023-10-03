<template>
    <div class="examinationContainer">
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
                            <el-checkbox-group v-model="data.jaw" :max="1" @change="handleChangeJawList">
                                <el-checkbox label="twoJaw">Hai hàm</el-checkbox>
                                <el-checkbox label="upperJaw">Hàm trên</el-checkbox>
                                <el-checkbox label="lowerJaw">Hàm dưới</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <div v-if="data.toothType=='permanentTeeth'" class="row">
                        <div v-for="item in permanentTeethData" :key="item.key" class="col-md-6 mb-2 col-custom">
                            <div class="toothDiagramItem">
                                <el-checkbox-group v-model="data.toothList" size="mini" :disabled="(data.jaw != null && data.jaw.length > 0)" @change="handleChangeToothList">
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
                                <el-checkbox-group v-model="data.toothList" size="mini" :disabled="(data.jaw != null && data.jaw.length > 0)" @change="handleChangeToothList">
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
                                v-if="(data.jaw != null && data.jaw.length > 0)"
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
                            <InputNumber 
                                style="width:100%;pointer-events:none;"
                                inputClass="el-input__inner"
                                v-model="data.unitPrice" 
                                placeholder="0"
                                :min="0"
                                mode="decimal"
                                locale="en-US"
                                suffix=" VND"
                                readonly
                                @input="()=>{
                                    if(data.unitPrice == null || data.unitPrice == ''){
                                        data.unitPrice = 0;
                                    }
                                }"
                            />
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
                                    emptyInputBehavior: '0'
                                }"
                            ></vue-autonumeric> -->
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-3">Giảm giá:</div>
                        <div class="col-md-9 inputTextRight">
                            <InputNumber 
                                style="width:100%;"
                                inputClass="el-input__inner"
                                v-model="data.discount" 
                                placeholder="0"
                                :min="0"
                                mode="decimal"
                                locale="en-US"
                                suffix=" VND"
                                @input="()=>{
                                    if(data.discount == null || data.discount == ''){
                                        data.discount = 0;
                                    }
                                    handleChangeDiscount();
                                }"
                            />
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
                                    emptyInputBehavior: '0'
                                }"
                            ></vue-autonumeric> -->
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-3">Thành tiền:</div>
                        <div class="col-md-9 inputTextRight">
                            <InputNumber 
                                style="width:100%;pointer-events:none;"
                                inputClass="el-input__inner"
                                v-model="data.totalPrice" 
                                placeholder="0"
                                :min="0"
                                mode="decimal"
                                locale="en-US"
                                suffix=" VND"
                                readonly
                                @input="()=>{
                                    if(data.totalPrice == null || data.totalPrice == ''){
                                        data.totalPrice = 0;
                                    }
                                }"
                            />
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
                                    emptyInputBehavior: '0'
                                }"
                            ></vue-autonumeric> -->
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { milkTooth, permanentTeeth } from '@/utils/masterData';
// import VueAutonumeric from 'vue-autonumeric';
export default {
    components: {
        // 'vue-autonumeric': VueAutonumeric,
    },
    props: {
        data: {
            type: Object,
        },
        serviceGroupData: {
            type: Array,
        },
        serviceData: {
            type: Array,
        },
        diaglogVisible: {
			type: Boolean,
			default: false
		},
    },
    watch: {
		diaglogVisible: {
			async handler(newVal, oldVal) {
				const _this = this;
                if(_this.data && _this.data.serviceGroupId){
                    var service = _.filter([..._this.serviceData] || [], {'groupId': _this.data.serviceGroupId});
                    _this.serviceByGroupData = service.map(item => {
                        return {
                            ...item,
                        }
                    })
                }
			},
			immediate: true,
		},
	},
    data(){
        return {
            permanentTeethData: permanentTeeth,
            milkToothData: milkTooth,
            serviceByGroupData: []
        }
    },
    async created() {
        const _this = this;
    },
    methods: {
        toothDiagramTabChange(){
            const _this = this;
            _this.data.toothList = [];
            _this.data.quantity = 0;
        },
        handleChangeJawList(e){
            const _this = this;
            if(e.length > 0){
                _this.data.quantity = 0;
                _this.data.isJaw = true;
                _this.data.toothList = [];
                _this.data.quantityJaw = e[0] == 'twoJaw' ? 2 : 1;
            }
            else{
                _this.data.isJaw = false;
                _this.data.quantityJaw = 0;
            }

            _this.calcTotalPrice();
        },
        handleChangeToothList(){
            const _this = this;
            _this.data.quantity = _this.data.toothList.length;
            _this.calcTotalPrice();
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
            _this.handleChangeService(_this.data.serviceId);
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
            if(_this.data.discount > (_this.data.unitPrice*quantity)){
                _this.data.discount = _this.data.unitPrice*quantity
            }
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