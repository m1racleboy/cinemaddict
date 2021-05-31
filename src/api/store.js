export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items, dataType) {
    const store = this.getItems();

    this._storage.setItem(
      this._storeKey,
      JSON.stringify(
        Object.assign({}, store, { [dataType]: items }),
      ),
    );
  }

  setItem(key, value, dataType) {
    const store = this.getItems();

    let data = store[dataType];

    data = Object.assign({}, data, { [key]: value });

    this._storage.setItem(
      this._storeKey,
      JSON.stringify(
        Object.assign({}, store, { [dataType]: data }),
      ),
    );
  }

  removeItem(key, dataType) {
    const store = this.getItems();

    delete store[dataType][key];

    this._storage.setItem(
      this._storeKey,
      JSON.stringify(store),
      dataType,
    );
  }
}
