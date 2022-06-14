export default {
	async SET_ROLE_USER(state, payload) {
		state.role = payload;
	},
	async SET_USERID(state, payload) {
		state.userId = payload;
	},
};