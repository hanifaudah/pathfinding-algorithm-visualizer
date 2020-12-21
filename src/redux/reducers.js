import { combineReducers } from 'redux';
import { persistReducer } from "redux-persist"
import storage from 'redux-persist/lib/storage'
import grid from './modules/grid';

// reducers
import gridReducer from './modules/grid'

// const sideBarPersistConfig = {
//   key: "sidebar",
//   storage,
//   whitelist: ["role", "sideBarType"],
// }

const rootReducer = combineReducers({
  // sidebar: persistReducer(sideBarPersistConfig, sideBarReducer),
  grid: gridReducer,
})

export default rootReducer