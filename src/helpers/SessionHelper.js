import { logout } from "../actions/userActions";
import { DataHelper } from "./";

class SessionHelper {
  getUserObject = () => {
    const store = DataHelper.getStore();

    const user = store && store.getState() ? store.getState().user : undefined;

    if (user && user.data) {
      return user.data;
    }

    return undefined;
  };

  isUserAuthenticated = () => {
    return this.getUserObject !== undefined;
  };

  onLogout = () => {
    DataHelper.getStore().dispatch(logout());
  };
}

export default new SessionHelper();
