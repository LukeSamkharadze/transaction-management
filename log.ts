import { Meta } from "./scenario"

export interface Log {
  index: number;
  meta: Meta;
}

export class ErrorLog implements Error {
  name: string;
  message: string;
  stack: string;

  constructor({ name, message, stack }: { name: string, message: string, stack?: string }) {
    this.name = name
    this.message = message;
    this.stack = stack || "NO STACK";
  }
}

export class SuccessfulLog implements Log {
  constructor(public index: number, public meta: Meta, public storeBefore: any, public storeAfter: any) { }
}

export class RollbackLog implements Log {
  constructor(public index: number, public meta: Meta, public storeBefore: any, public storeAfter: any) { }
}

export class FailedLog extends ErrorLog implements Log {
  constructor(public index: number, public meta: Meta, public error: Error) {
    super(error);
  }
}

export class SilentFailedLog extends ErrorLog implements Log {
  constructor(public index: number, public meta: Meta, public storeBefore: any, public storeAfter: any, public error: Error) {
    super(error);
  }
}