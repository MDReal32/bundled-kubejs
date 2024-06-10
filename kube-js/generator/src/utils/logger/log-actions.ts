import { Logger } from "./logger";

const __LOGGER_KEY__ = Symbol("logger");

export const LogActions = (name: string): ClassDecorator => {
  const decorator = <TObject extends { logger: Logger }>(target: TObject) => {
    const Target = target as unknown as new (...args: any[]) => any;
    class LogPostActions extends Target {
      constructor(...args: any[]) {
        super(...args);

        const prevName = Reflect.get(this, __LOGGER_KEY__);
        const newName = prevName ? `${prevName}:${name}` : name;
        Reflect.set(this, __LOGGER_KEY__, newName);
        this.logger = new Logger(newName);
      }
    }

    return LogPostActions;
  };

  return decorator as ClassDecorator;
};
