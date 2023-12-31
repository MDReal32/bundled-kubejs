export class CommandBuilder {
  private readonly commands: string[] = [];
  private isMutated = false;

  constructor(private readonly command: string) {}

  addCommand(command: string) {
    this.commands.push(command);
    return this;
  }

  addArgument(key: string, value?: string) {
    this.commands.push(key);
    if (value) {
      this.commands.push(value);
    }
    return this;
  }

  addOption(key: string, value?: string) {
    const prefix = key.length === 1 ? "-" : "--";
    this.commands.push(`${prefix}${key}`);
    if (value) {
      this.commands.push(value);
    }
    return this;
  }

  addFlag(flag: string, available = true) {
    const prefix = flag.length === 1 ? "-" : "--";
    available && this.commands.push(`${prefix}${flag}`);
    return this;
  }

  build() {
    if (this.isMutated) {
      throw new Error("CommandBuilder is mutated, use clone() to create a new instance");
    }
    this.mutate();
    return `${this.command} ${this.commands.join(" ")}`;
  }

  clone() {
    return new CommandBuilder([this.command, ...this.commands].join(" "));
  }

  private mutate() {
    this.isMutated = true;
  }
}
