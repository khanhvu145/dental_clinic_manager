import * as _ from 'lodash';
import axios from 'axios';

async function getDataForFilter({ commit, rootState, state }, filters) {
    switch (filters.actionName) {
        case 'provinceMasterData':
            const provinceData = await axios.get('https://provinces.open-api.vn/api/p/');
            var provinces = provinceData.data;
            return provinces.map(item => {
                return {
                    value: item.code,
                    label: item.name
                }
            })
        case 'districtMasterData':
            const districtData = await axios.get('https://provinces.open-api.vn/api/d/');
            var districts = districtData.data;
            return districts.map(item => {
            return {
                value: item.code,
                label: item.name,
                province_code: item.province_code
            }
            })
        case 'wardMasterData':
            const wardData = await axios.get('https://provinces.open-api.vn/api/w/');
            var wards = wardData.data;
            return wards.map(item => {
            return {
                value: item.code,
                label: item.name,
                district_code: item.district_code
            }
            })
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
        case 'serviceGroupData':
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
    }
    return [];
}

export default {
    getDataForFilter,
};