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

export const LogPostActions = (name: string): MethodDecorator => {
  const decorator = <TObject extends { logger: Logger }, TKey extends keyof TObject>(
    _target: TObject,
    _propertyKey: TKey,
    descriptor: TypedPropertyDescriptor<TObject[TKey]>
  ) => {
    if (!descriptor.value) return descriptor;

    const originalMethod = descriptor.value as (...args: any[]) => any;
    descriptor.value = async function (this: TObject, ...args: any[]) {
      const loggerName = Reflect.get(this, __LOGGER_KEY__);
      this.logger = new Logger(`${loggerName}:${name}`);
      this.logger.info("Setting up");
      const actionFn = await originalMethod.call(this, ...args);
      this.logger.info("Git setup completed. Waiting post actions");
      const logger = this.logger;
      return async (...args: any[]) => {
        logger.info("Running post actions");
        await actionFn(...args);
        logger.info("Post actions completed");
      };
    } as TObject[TKey];

    return descriptor;
  };

  return decorator as MethodDecorator & ClassDecorator;
};
