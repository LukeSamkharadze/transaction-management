function InitStores(storeBefore, storeAfter) {
  this.storeBefore = storeBefore;
  this.storeAfter = storeAfter;
}

function InitError(error) {
  this.error = { name: error.name, message: error.message, stack: error.stack };
}

class Log {
  constructor(index, meta) {
    this.index = index;
    this.meta = meta;
  }
}

class SuccessfulLog extends Log {
  constructor(index, meta, storeBefore, storeAfter) {
    super(index, meta);
    InitStores.apply(this, [storeBefore, storeAfter]);
  }
}

class FailedLog extends Log {
  constructor(index, meta, error) {
    super(index, meta);
    InitError.apply(this, [error]);
  }
}

class SilentFailedLog extends Log {
  constructor(index, meta, storeBefore, storeAfter, error) {
    super(index, meta);
    InitStores.apply(this, [storeBefore, storeAfter]);
    InitError.apply(this, [error]);
  }
}

class RollbackLog extends Log {
  constructor(index, meta, storeBefore, storeAfter) {
    super(index, meta);
    InitStores.apply(this, [storeBefore, storeAfter]);
  }
}

export { SuccessfulLog, FailedLog, SilentFailedLog, RollbackLog };