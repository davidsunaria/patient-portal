import { action, thunk } from "easy-peasy";
const commonModel = {
  isLoading: false,
  setLoadingAction: action((state, payload) => {
    state.isLoading = payload;
  }),
  setLoading: thunk((actions, payload) => {
    actions.setLoadingAction(payload);
  })
};

export default commonModel;
