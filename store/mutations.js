const mutations = {
  async SET_ACCESSES(state, payload) {
    state.accesses = payload;
  },
  async setSocketUser(state, user) {
    state.socketUser = user;
  },
};

export default mutations;
