import { inspect } from "node:util";

type LoggerMessageType = string | number | boolean | object | undefined | null | unknown;

interface LoggerOptions {
  objectDepth?: number;
}

export class Logger {
  constructor(
    private readonly prefix: string,
    private readonly options: LoggerOptions = { objectDepth: 2 }
  ) {}

  get templateLength() {
    return this.template("").length;
  }

  info(...messages: LoggerMessageType[]) {
    console.log(this.template(this.updateMessages(messages)));
  }

  warn(...messages: LoggerMessageType[]) {
    console.warn(this.template(this.updateMessages(messages)));
  }

  error(...messages: LoggerMessageType[]) {
    console.error(this.template(this.updateMessages(messages)));
  }

  template(message: string) {
    const messageLines = message.split("\n");
    return messageLines.map(line => `[${this.prefix}] ${line}`).join("\n");
  }

  private updateMessages(messages: LoggerMessageType[]) {
    return messages.map(message => this.updateMessage(message)).join("\n");
  }

  private updateMessage(message: LoggerMessageType) {
    if (typeof message === "object") {
      return inspect(message, { depth: this.options.objectDepth || 2, colors: true });
    }

    if (message === undefined) {
      return "undefined";
    }

    return message;
  }
}
