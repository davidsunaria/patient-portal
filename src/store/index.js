import { createStore } from "easy-peasy";
import storeModel from "patient-portal-model";

const store = createStore(storeModel);
export { store };
export default store;
