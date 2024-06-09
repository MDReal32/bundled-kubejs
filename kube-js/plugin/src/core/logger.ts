export class Logger {
  private message = "";
  private readonly originalConsole = { ...console };

  private get cols() {
    return process.stdout.columns;
  }

  bindConsole() {
    console.log = (message: string, ...args: any[]) => {
      this.originalConsole.log(this.prepareMessage(message), ...args);
    };

    console.warn = (message: string, ...args: any[]) => {
      this.originalConsole.warn(this.prepareMessage(message), ...args);
    };

    console.error = (message: string, ...args: any[]) => {
      this.originalConsole.error(this.prepareMessage(message), ...args);
    };
  }

  log(message: string) {
    message = this.prepareMessage(message);

    this.message = message;
    this.originalConsole.log(this.message);
    const strings = message.split("\n");
    process.stdout.moveCursor(-this.cols + 2, -strings.length);
  }

  reset() {
    process.stdout.moveCursor(0, this.message.split("\n").length);
    console.log = this.originalConsole.log;
    console.warn = this.originalConsole.warn;
    console.error = this.originalConsole.error;
  }

  clear() {
    process.stdout.clearScreenDown();
  }

  private prepareMessage(message: string) {
    return message
      .split("\n")
      .map(line =>
        line.length > this.cols
          ? line.slice(0, this.cols - 5) + "..."
          : line + " ".repeat(Math.max(this.cols - line.length, 2) - 2)
      )
      .join("\n");
  }
}
