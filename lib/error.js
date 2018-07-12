const ERR_UNKNOWN = Symbol();

class CallError extends Error {
  constructor(message, typ = ERR_UNKNOWN) {
    super(message);
    this.typ = typ;
  }
}

CallError.ERR_TIMEOUT = Symbol();
CallError.ERR_NORESP = Symbol();
CallError.ERR_BADCODE = Symbol();
CallError.ERR_NETWORK = Symbol();
CallError.ERR_BADDATA = Symbol();
CallError.ERR_UNKNOWN = ERR_UNKNOWN;

export { CallError as default };
