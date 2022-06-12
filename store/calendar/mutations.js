export default {
	async SET_CALENDAR_VIEW_TYPE(state, payload) {
		state.layoutCalendarType = payload;
	},
	async SET_USERID(state, payload) {
		state.userId = payload;
	},
};