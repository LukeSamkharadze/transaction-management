export { SuccessfulLog, FailedLog, SilentFailedLog, RollbackLog };

interface Meta {
  title: string;
  description: string;
}

interface Log {
  index: number;
  meta: Meta;
}

class ErrorLog implements Error {
  name: string;
  message: string;
  stack: string;

  constructor({ name, message, stack }: { name: string, message: string, stack?: string }) {
    this.name = name
    this.message = message;
    this.stack = stack || "NO STACK";
  }
}

class SuccessfulLog implements Log {
  constructor(public index: number, public meta: Meta, public storeBefore: any, public storeAfter: any) { }
}

class RollbackLog implements Log {
  constructor(public index: number, public meta: Meta, public storeBefore: any, public storeAfter: any) { }
}

class FailedLog extends ErrorLog implements Log {
  constructor(public index: number, public meta: Meta, public error: Error) {
    super(error);
  }
}

class SilentFailedLog extends ErrorLog implements Log {
  constructor(public index: number, public meta: Meta, public storeBefore: any, public storeAfter: any, public error: Error) {
    super(error);
  }
}