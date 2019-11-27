import { combineReducers } from "redux";

import networkInfo from "./networkInfo";
import user from "./user";

export default combineReducers({
  networkInfo,
  user
});
