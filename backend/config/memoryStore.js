const crypto = require('crypto');

const generateId = () => crypto.randomBytes(12).toString('hex');

class MemoryDocument {
  constructor(data, store, collectionName) {
    Object.assign(this, data);
    if (!this._id) {
      this._id = generateId();
    }
    // Make store references non-enumerable so JSON.stringify never encounters circular references
    Object.defineProperty(this, '_store', {
      value: store,
      enumerable: false,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(this, '_collectionName', {
      value: collectionName,
      enumerable: false,
      writable: true,
      configurable: true,
    });
  }

  toJSON() {
    const plain = {};
    for (const key of Object.keys(this)) {
      if (!key.startsWith('_') || key === '_id') {
        plain[key] = this[key];
      }
    }
    return plain;
  }

  async save() {
    const list = this._store.collections[this._collectionName];
    const index = list.findIndex(item => String(item._id) === String(this._id));
    const plain = this.toJSON();

    if (index >= 0) {
      list[index] = plain;
    } else {
      list.push(plain);
    }
    return this;
  }
}

class MemoryQuery {
  constructor(items, store, collectionName) {
    this._items = items;
    this._store = store;
    this._collectionName = collectionName;
    this._sortObj = null;
    this._skipCount = 0;
    this._limitCount = null;
  }

  sort(sortObj) {
    this._sortObj = sortObj;
    return this;
  }

  skip(count) {
    this._skipCount = count || 0;
    return this;
  }

  limit(count) {
    this._limitCount = count;
    return this;
  }

  select(fields) {
    return this;
  }

  populate(fields) {
    return this;
  }

  _execute() {
    let result = [...this._items];

    if (this._sortObj) {
      result.sort((a, b) => {
        for (const [key, order] of Object.entries(this._sortObj)) {
          let valA = a[key];
          let valB = b[key];
          if (valA instanceof Date) valA = valA.getTime();
          if (valB instanceof Date) valB = valB.getTime();

          if (valA < valB) return order === -1 ? 1 : -1;
          if (valA > valB) return order === -1 ? -1 : 1;
        }
        return 0;
      });
    }

    if (this._skipCount > 0) {
      result = result.slice(this._skipCount);
    }

    if (this._limitCount !== null && this._limitCount !== undefined) {
      result = result.slice(0, this._limitCount);
    }

    return result.map(item => new MemoryDocument(item, this._store, this._collectionName));
  }

  then(resolve, reject) {
    try {
      resolve(this._execute());
    } catch (err) {
      if (reject) reject(err);
      else throw err;
    }
  }
}

class MemorySingleDocQuery {
  constructor(item, store, collectionName) {
    this._item = item;
    this._store = store;
    this._collectionName = collectionName;
  }

  select(fields) {
    return this;
  }

  populate(fields) {
    return this;
  }

  _execute() {
    return this._item ? new MemoryDocument(this._item, this._store, this._collectionName) : null;
  }

  then(resolve, reject) {
    try {
      resolve(this._execute());
    } catch (err) {
      if (reject) reject(err);
      else throw err;
    }
  }
}

class MemoryCollection {
  constructor(name, store) {
    this.name = name;
    this.store = store;
  }

  _getItems() {
    return this.store.collections[this.name] || [];
  }

  _matchQuery(item, query = {}) {
    for (const [key, val] of Object.entries(query)) {
      if (key === '$or') {
        const matchesAny = val.some(subQuery => this._matchQuery(item, subQuery));
        if (!matchesAny) return false;
        continue;
      }

      if (key === '_id') {
        const itemDocId = String(item._id || '');
        const targetDocId = String(val?._id || val || '');
        if (itemDocId !== targetDocId) return false;
        continue;
      }

      if (key === 'userId') {
        const itemUserId = String(item.userId?._id || item.userId || '');
        const targetUserId = String(val?._id || val || '');
        if (itemUserId !== targetUserId) return false;
        continue;
      }

      if (val instanceof RegExp) {
        if (!val.test(String(item[key] || ''))) return false;
        continue;
      }

      if (val && typeof val === 'object' && !(val instanceof Date)) {
        if (val.$gte !== undefined) {
          const itemVal = item[key] instanceof Date ? item[key] : new Date(item[key]);
          const targetVal = val.$gte instanceof Date ? val.$gte : new Date(val.$gte);
          if (itemVal < targetVal) return false;
        }
        if (val.$lte !== undefined) {
          const itemVal = item[key] instanceof Date ? item[key] : new Date(item[key]);
          const targetVal = val.$lte instanceof Date ? val.$lte : new Date(val.$lte);
          if (itemVal > targetVal) return false;
        }
        if (val.$regex !== undefined) {
          const reg = new RegExp(val.$regex, val.$options || 'i');
          if (!reg.test(String(item[key] || ''))) return false;
        }
        continue;
      }

      if (String(item[key] || '').toLowerCase() !== String(val || '').toLowerCase()) {
        return false;
      }
    }
    return true;
  }

  find(query = {}) {
    const matched = this._getItems().filter(item => this._matchQuery(item, query));
    return new MemoryQuery(matched, this.store, this.name);
  }

  findOne(query = {}) {
    const matched = this._getItems().find(item => this._matchQuery(item, query));
    return new MemorySingleDocQuery(matched, this.store, this.name);
  }

  findById(id) {
    const targetId = String(id?._id || id);
    const matched = this._getItems().find(item => String(item._id) === targetId);
    return new MemorySingleDocQuery(matched, this.store, this.name);
  }

  async create(data) {
    const docData = { ...data, _id: generateId() };
    if (!docData.createdAt) docData.createdAt = new Date();
    this.store.collections[this.name].push(docData);
    return new MemoryDocument(docData, this.store, this.name);
  }

  async insertMany(docs) {
    const inserted = [];
    for (const d of docs) {
      const item = { ...d, _id: generateId() };
      this.store.collections[this.name].push(item);
      inserted.push(new MemoryDocument(item, this.store, this.name));
    }
    return inserted;
  }

  async findOneAndUpdate(query, update, options = {}) {
    const doc = await this.findOne(query);
    if (!doc) {
      if (options.upsert) {
        return await this.create({ ...query, ...update });
      }
      return null;
    }
    Object.assign(doc, update);
    await doc.save();
    return doc;
  }

  async findOneAndDelete(query) {
    const list = this.store.collections[this.name];
    const index = list.findIndex(item => this._matchQuery(item, query));
    if (index >= 0) {
      const [removed] = list.splice(index, 1);
      return new MemoryDocument(removed, this.store, this.name);
    }
    return null;
  }

  async countDocuments(query = {}) {
    return this._getItems().filter(item => this._matchQuery(item, query)).length;
  }

  async aggregate(pipeline = []) {
    let data = [...this._getItems()];

    for (const stage of pipeline) {
      if (stage.$match) {
        data = data.filter(item => this._matchQuery(item, stage.$match));
      }

      if (stage.$group) {
        const groupKey = stage.$group._id;
        const groups = {};

        for (const item of data) {
          let keyVal = null;
          if (typeof groupKey === 'string' && groupKey.startsWith('$')) {
            keyVal = item[groupKey.slice(1)];
          } else {
            keyVal = groupKey;
          }

          if (!groups[keyVal]) {
            groups[keyVal] = { _id: keyVal, count: 0 };
            for (const [field, expr] of Object.entries(stage.$group)) {
              if (field === '_id') continue;
              if (expr.$sum !== undefined) {
                groups[keyVal][field] = 0;
              }
            }
          }

          groups[keyVal].count += 1;

          for (const [field, expr] of Object.entries(stage.$group)) {
            if (field === '_id') continue;
            if (expr.$sum !== undefined) {
              if (typeof expr.$sum === 'string' && expr.$sum.startsWith('$')) {
                const num = Number(item[expr.$sum.slice(1)]) || 0;
                groups[keyVal][field] += num;
              } else if (typeof expr.$sum === 'number') {
                groups[keyVal][field] += expr.$sum;
              }
            }
          }
        }

        data = Object.values(groups);
      }

      if (stage.$sort) {
        data.sort((a, b) => {
          for (const [key, order] of Object.entries(stage.$sort)) {
            if (a[key] < b[key]) return order === -1 ? 1 : -1;
            if (a[key] > b[key]) return order === -1 ? -1 : 1;
          }
          return 0;
        });
      }
    }

    return data;
  }
}

class MemoryStore {
  constructor() {
    this.collections = {
      users: [],
      transactions: [],
      budgets: [],
      savingsgoals: [],
      categories: [],
    };

    this.User = new MemoryCollection('users', this);
    this.Transaction = new MemoryCollection('transactions', this);
    this.Budget = new MemoryCollection('budgets', this);
    this.SavingsGoal = new MemoryCollection('savingsgoals', this);
    this.Category = new MemoryCollection('categories', this);
  }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;
