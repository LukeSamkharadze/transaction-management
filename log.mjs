class Log {
  constructor(index, meta) {
    this.index = index;
    this.meta = meta;
  }
}

class SuccessfulLog extends Log {
  constructor(index, meta, storeBefore, storeAfter) {
    super(index, meta);
    this.storeBefore = storeBefore;
    this.storeAfter = storeAfter;
  }
}

class FailedLog extends Log {
  constructor(index, meta, error) {
    super(index, meta);
    this.error = { name: error.name, message: error.message, stack: error.stack };
  }
}

class SilentFailedLog extends Log {
  constructor(index, meta, storeBefore, storeAfter, error) {
    super(index, meta);
    this.storeBefore = storeBefore;
    this.storeAfter = storeAfter;
    this.error = { name: error.name, message: error.message, stack: error.stack };
  }
}

class RollbackLog extends Log {
  constructor(index, meta, storeBefore, storeAfter) {
    super(index, meta);
    this.storeBefore = storeBefore;
    this.storeAfter = storeAfter;
  }
}

export { SuccessfulLog, FailedLog, SilentFailedLog, RollbackLog};