import { HttpException, Logger } from "@nestjs/common";

export function TryCatchHandler(): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        Logger.log(error);
        throw new HttpException(`Something went wrong: ${error.message}`, 400);
      }
    };
    return descriptor;
  };
}
