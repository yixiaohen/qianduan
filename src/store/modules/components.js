const state = {
  dialog: false
};

const mutations = {
  CHANGE_DIALOG: (state, value) => {
    state.dialog = value;
  }
};

const actions = {
  changeDialog({ commit }, value) {
    commit('CHANGE_DIALOG', value);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
