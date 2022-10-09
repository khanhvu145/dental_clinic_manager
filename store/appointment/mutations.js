export default {
	async SET_CALENDAR_INFORS(state, payload) {
		state.calendarInfors = payload;
	},
	async SET_CALENDAR_VIEW_TYPE(state, payload) {
		state.calendarInfors.layoutCalendarType = payload;
	},
};
