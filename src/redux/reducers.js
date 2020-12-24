import { combineReducers } from 'redux';
import { persistReducer } from "redux-persist"
import storage from 'redux-persist/lib/storage'
import grid from './modules/grid';

// reducers
import gridReducer from './modules/grid'
import {reducer as toastrReducer} from 'react-redux-toastr'

const rootReducer = combineReducers({
  grid: gridReducer,
  toastr: toastrReducer
})

export default rootReducer

// Template

// Persist Config:
// const sideBarPersistConfig = {
//   key: "sidebar",
//   storage,
//   whitelist: ["role", "sideBarType"],
// }
// Persist Reducer:
// sidebar: persistReducer(sideBarPersistConfig, sideBarReducer),

