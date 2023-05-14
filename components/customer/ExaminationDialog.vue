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
                                <el-radio-group v-model="toothDiagramActive" @change="toothDiagramTabChange">
                                    <el-radio-button label="permanentTeeth">Răng vĩnh viễn</el-radio-button>
                                    <el-radio-button label="milkTooth">Răng sữa</el-radio-button>
                                </el-radio-group>
                            </div>
                        </div>
                        <div v-if="toothDiagramActive=='permanentTeeth'" class="row">
                            <div v-for="item in permanentTeethData" :key="item.key" class="col-md-6 mb-2 col-custom">
                                <div class="toothDiagramItem">
                                    <el-checkbox-group v-model="data.toothData" size="mini">
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
                                    <el-checkbox-group v-model="data.toothData" size="mini">
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
                                            <el-select v-model="data.serviceGroupId" placeholder="Nhóm dịch vụ" name="serviceGroupId" clearable filterable v-on:change="onSelectServiceGroup($event)">
                                                <el-option
                                                    v-for="item in serviceGroupData"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                        </div>
                                        <div class="col-md-12 mt-3">
                                            <el-select v-model="data.serviceId" placeholder="Dịch vụ" name="serviceId" clearable filterable>
                                                <el-option
                                                    v-for="item in serviceByGroupData"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
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
                                    name="quantity" 
                                    placeholder="Số lượng" 
                                    v-model="data.toothData.length" 
                                    class="inputTextRight"
                                    disabled
                                ></el-input>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-3">Đơn giá:</div>
                            <div class="col-md-9">
                                <el-input 
                                    name="quantity" 
                                    placeholder="Đơn giá" 
                                    v-model="data.toothData.length" 
                                    class="inputTextRight"
                                    disabled
                                >
                                    <template slot="append">VND</template>
                                </el-input>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-3">Giảm giá:</div>
                            <div class="col-md-9">
                                <el-input 
                                    name="quantity" 
                                    placeholder="Giảm giá" 
                                    v-model="data.discount" 
                                    class="inputTextRight"
                                >
                                    <template slot="append">VND</template>
                                </el-input>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-3">Thành tiền:</div>
                            <div class="col-md-9">
                                <el-input 
                                    name="quantity" 
                                    placeholder="Thành tiền" 
                                    v-model="data.toothData.length" 
                                    class="inputTextRight"
                                    disabled
                                >
                                    <template slot="append">VND</template>
                                </el-input>
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
export default {
    name: 'AddExamination',
    props: {
        dialog: {
            type: Object,
            default: {
                visible: false,
                type: 'create'
            }
        },
    },
    computed: {
		...mapState({
			accesses: (state) => state.accesses,
            userInfo: (state) => state.auth.user,
		}),
	},
     data() {
        return {
            data: {
                key: 0,
                toothData: [],
                diagnose: '',
                serviceGroupId: '',
                serviceId: '',
                discount: 0,
            },
            dialogVisible: false,
            toothDiagramActive: 'permanentTeeth',
            permanentTeethData: permanentTeeth,
            milkToothData: milkTooth,
            serviceGroupData: [],
            serviceData: [],
            serviceByGroupData: [],
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
        _this.serviceData = (await _this.$store.dispatch('common/getDataForFilter', { actionName: 'serviceData' })) || [];
        _this.serviceByGroupData = _this.serviceData;
        _this.resetDialog();
    },
    methods: {
        resetDialog() {
            const _this = this;
            _this.data = {
                key: 0,
                toothData: [],
                diagnose: '',
                serviceGroupId: '',
                serviceId: '',
                discount: 0,
            };
        },
        toothDiagramTabChange(){
            const _this = this;
            _this.data.toothDiagramData = [];
        },
        onSelectServiceGroup(value) {
            const _this = this;
            if(value){
                _this.serviceByGroupData = _.filter([..._this.serviceData] || [], {'serviceGroupId': value});
            }
            else{
                _this.serviceByGroupData = _this.serviceData;
            }
		},
        addItem(){
            const _this = this;
            console.log(_this.data)
        },
        updateItem(){
            const _this = this;
        }
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