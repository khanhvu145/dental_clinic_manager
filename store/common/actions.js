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
            case 'roleMasterData':
                const roleData = await this.$axios.$get('/api/account/listRole');
                var roles = roleData.data;
                return roles.map(item => {
                    return {
                        value: item._id,
                        label: item.name,
                    }
                })
            // case 'positionMasterData':
            //     const positionData = await this.$axios.$get('/api/employee/listposition');
            //     var positions = positionData.data;
            //     return positions.map(item => {
            //         return {
            //             value: item._id,
            //             label: item.name,
            //         }
            //     })
    }
    return [];
}

export default {
    getDataForFilter,
};