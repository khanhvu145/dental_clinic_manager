const actions = {
	async getAccesses({ commit, rootState }) {
		const data = await this.$axios.$get(`api/account/info`);
		await commit('SET_ACCESSES', data.data.data.accesses || []);
	}
};

export default actions;
