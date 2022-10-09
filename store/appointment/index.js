import mutations from './mutations';
import actions from './actions';
import getters from './getters';

const state = () => {
	return {
		calendarInfors: {
			layoutCalendarType: 'resourceTimeGridDay',
		},
	};
};

export default {
	namespaced: true,
	state: state,
	mutations: mutations,
	actions: actions,
	getters: getters,
};
