const actions = {
	async getAccesses({ commit, rootState }) {
		const data = await this.$axios.$get(`api/account/info`);
		await commit('SET_ACCESSES', data.data.data.accesses || []);
	},
	async getInformationConfig({ commit, rootState }) {
		const data = await this.$axios.$get(`/api/informationConfig/getData`);
		await commit('setInformationConfig', (data.data.length > 0 && data.data != null) ? data.data[0] : {});
	},
	async socketLogin({ commit }, data) {
		await commit("setSocketUser", data);
	},
};

export default actions;
