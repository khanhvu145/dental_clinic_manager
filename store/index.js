import commonModule from './common';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

export default {
	strict: false,
	getters,
	mutations,
	state,
	actions,
	modules: {
		common: commonModule,
	},
};
