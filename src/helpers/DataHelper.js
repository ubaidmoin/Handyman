class DataHelper {
  store = undefined;

  setStore(store) {
    this.store = store;
  }

  getStore() {
    return this.store;
  }
}

export default new DataHelper();
