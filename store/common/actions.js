import * as _ from 'lodash';
import axios from 'axios';

async function getDataForFilter({ commit, rootState, state }, filters) {
    switch (filters.actionName) {
        case 'provinceMasterData':
            try{
                const provinceData = await axios.get('https://provinces.open-api.vn/api/p/');
                var provinces = provinceData.data;
                return provinces.map(item => {
                    return {
                        value: item.code,
                        label: item.name
                    }
                })
            }
            catch(err){
                return [];
            }
        case 'districtMasterData':
            try{
                const districtData = await axios.get('https://provinces.open-api.vn/api/d/');
                var districts = districtData.data;
                return districts.map(item => {
                    return {
                        value: item.code,
                        label: item.name,
                        province_code: item.province_code
                    }
                })
            }
            catch(err){
                return [];
            }
        case 'wardMasterData':
            try{
                const wardData = await axios.get('https://provinces.open-api.vn/api/w/');
                var wards = wardData.data;
                return wards.map(item => {
                    return {
                        value: item.code,
                        label: item.name,
                        district_code: item.district_code
                    }
                })
            }
            catch(err){
                return [];
            }
        case 'accessMasterData':
            var searchQuery = {
                filters: {
                    nameF: '',
                    statusF: true
                },
                sorts: 'name&&1',
                pages:{
                    from: 0,
                    size: 1000
                }
            };
            const accessData = await this.$axios.$post('/api/accessgroup/getByQuery', searchQuery);
            var accesses = accessData.data;
            return accesses.map(item => {
                return {
                    value: item._id,
                    label: item.name,
                }
            })
        case 'generalConfigCustomerType': // Loại KH
            const dataStatus = await this.$axios.$post('/api/generalconfig/getByQuery', { type: 'customer_type', isActive: true });
            var status = dataStatus.data['customer_type'];
            return status.map((item) => {
                return {
                    value: item._id,
                    label: item.value,
                    color: item.color,
                    isActive: item.isActive,
                };
            })
        case 'generalConfigCustomerSource': // Nguồn KH
            const dataSource = await this.$axios.$post('/api/generalconfig/getByQuery', { type: 'customer_source', isActive: true });
            var source = dataSource.data['customer_source'];
            return source.map((item) => {
                return {
                    value: item._id,
                    label: item.value,
                    color: item.color,
                    isActive: item.isActive,
                };
            })
        case 'generalConfigUnit': // Đơn vị tính
            const unitData = await this.$axios.$post('/api/generalconfig/getByQuery', { type: 'service_unit', isActive: true });
            var unit = unitData.data['service_unit'];
            return unit.map((item) => {
                return {
                    value: item._id,
                    label: item.value,
                    color: item.color,
                    isActive: item.isActive,
                };
            })
        case 'serviceGroupData': //Nhóm dịch vụ
            var searchQuery = {
                filters: {
                    nameF: '',
                    codeF: '',
                    statusF: true
                },
                sorts: 'name&&1',
                pages:{
                    from: 0,
                    size: 1000
                }
            };
            const serviceGroupData = await this.$axios.$post('/api/service/groupGetByQuery', searchQuery);
            var serviceGroup = serviceGroupData.data;
            return serviceGroup.map(item => {
                return {
                    value: item._id,
                    label: item.name,
                }
            })
        case 'serviceData': //Dịch vụ
            var searchQuery = {
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
            };
            const serviceData = await this.$axios.$post('/api/service/getByQuery', searchQuery);
            var service = serviceData.data;
            return service.map(item => {
                return {
                    value: item._id,
                    label: item.name,
                    serviceGroupId: item.groupId
                }
            })
        case 'generalConfigAppointmentType': // Loại lịch hẹn
            const appointmentTypeData = await this.$axios.$post('/api/generalconfig/getByQuery', { type: 'appointment_type', isActive: true });
            var appointmentType = appointmentTypeData.data['appointment_type'];
            return appointmentType.map((item) => {
                return {
                    value: item._id,
                    label: item.value,
                    color: item.color,
                    isActive: item.isActive,
                };
            })
        case 'generalConfigAppointmentStatus': // Trạng thái lịch hẹn
            const appointmentStatusData = await this.$axios.$post('/api/generalconfig/getByQuery', { type: 'appointment_status', isActive: true });
            var appointmentStatus = appointmentStatusData.data['appointment_status'];
            return appointmentStatus.map((item) => {
                return {
                    value: item._id,
                    label: item.value,
                    color: item.color,
                    isActive: item.isActive,
                };
            })
        case 'generalConfigAppointmentContent': // Nội dung lịch hẹn
            const appointmentContentData = await this.$axios.$post('/api/generalconfig/getByQuery', { type: 'appointment_content', isActive: true });
            var appointmentContent = appointmentContentData.data['appointment_content'];
            return appointmentContent.map((item) => {
                return {
                    value: item._id,
                    label: item.value,
                    color: item.color,
                    isActive: item.isActive,
                };
            })
        case 'generalConfigExamAnamnesis': // Tiền sử bệnh
            const examAnamnesisData = await this.$axios.$post('/api/generalconfig/getByQuery', { type: 'exam_anamnesis', isActive: true });
            var examAnamnesis = examAnamnesisData.data['exam_anamnesis'];
            return examAnamnesis.map((item) => {
                return {
                    value: item._id,
                    label: item.value,
                    color: item.color,
                    isActive: item.isActive,
                };
            })
        case 'generalConfigExamAllergy': // Dị ứng
            const examAllergyData = await this.$axios.$post('/api/generalconfig/getByQuery', { type: 'exam_allergy', isActive: true });
            var examAllergy = examAllergyData.data['exam_allergy'];
            return examAllergy.map((item) => {
                return {
                    value: item._id,
                    label: item.value,
                    color: item.color,
                    isActive: item.isActive,
                };
            })
        case 'generalConfigExamXquang': // Xquang
            const examXquangData = await this.$axios.$post('/api/generalconfig/getByQuery', { type: 'exam_xquang', isActive: true });
            var examXquang = examXquangData.data['exam_xquang'];
            return examXquang.map((item) => {
                return {
                    value: item._id,
                    label: item.value,
                    color: item.color,
                    isActive: item.isActive,
                };
            })
        case 'generalConfigExamTest': // Test
            const examTestData = await this.$axios.$post('/api/generalconfig/getByQuery', { type: 'exam_test', isActive: true });
            var examTest = examTestData.data['exam_test'];
            return examTest.map((item) => {
                return {
                    value: item._id,
                    label: item.value,
                    color: item.color,
                    isActive: item.isActive,
                };
            })
        case 'generalConfigDesignationType': // Loại chỉ định
            const examDesignationTypeData = await this.$axios.$post('/api/generalconfig/getByQuery', { type: 'exam_designationType', isActive: true });
            var examDesignationType = examDesignationTypeData.data['exam_designationType'];
            return examDesignationType.map((item) => {
                return {
                    value: item._id,
                    label: item.value,
                    color: item.color,
                    isActive: item.isActive,
                };
            })
        case 'generalConfigExamMedicine': // Medicine
            const examMedicineData = await this.$axios.$post('/api/generalconfig/getByQuery', { type: 'exam_medicine', isActive: true });
            var examMedicine = examMedicineData.data['exam_medicine'];
            return examMedicine.map((item) => {
                return {
                    value: item._id,
                    label: item.value,
                    color: item.color,
                    isActive: item.isActive,
                };
            })
        case 'generalConfigPrescriptionUnit': // Medicine
            const PrescriptionUnitData = await this.$axios.$post('/api/generalconfig/getByQuery', { type: 'prescription_unit', isActive: true });
            var PrescriptionUnit = PrescriptionUnitData.data['prescription_unit'];
            return PrescriptionUnit.map((item) => {
                return {
                    value: item._id,
                    label: item.value,
                    color: item.color,
                    isActive: item.isActive,
                };
            })
    }
    return [];
}

export default {
    getDataForFilter,
};