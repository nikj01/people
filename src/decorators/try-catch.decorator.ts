import { BadRequestException, Logger } from "@nestjs/common";
import { ValidationError } from "class-validator";

export function TryCatchHandler(): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (error instanceof ValidationError) {
          Logger.log(error);
          throw new BadRequestException(`Something went wrong: ${error}`);
        } else {
          return error;
        }
      }
    };
    return descriptor;
  };
}
