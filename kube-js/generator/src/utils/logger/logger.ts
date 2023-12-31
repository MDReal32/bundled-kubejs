export class Logger {
  private readonly prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  get templateLength() {
    return this.template("").length;
  }

  info(message: string) {
    console.log(this.template(message));
  }

  warn(message: string) {
    console.warn(this.template(message));
  }

  error(message: string) {
    console.error(this.template(message));
  }

  template(message: string) {
    return `[${this.prefix}] ${message}`;
  }
}
