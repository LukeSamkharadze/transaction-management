import { Scenario } from "./scenario"

type ValidatorFn = (o: any) => boolean;

export class ValidatableProperty {
  constructor(public name: string, public validatorFn: ValidatorFn, public isRequired: boolean, public props: ValidatableProperty[] = []) { }
}

export interface Validator<T> {
  Validate(obj: T): boolean;
}

export class ScenarioValidator implements Validator<Scenario>
{
  private static validatableProperties = [
    new ValidatableProperty("index", o => typeof o === "number", true),
    new ValidatableProperty("meta", o => typeof o === "object", true, [
      new ValidatableProperty("title", o => typeof o === "string", true),
      new ValidatableProperty("description", o => typeof o === "string", true)]),
    new ValidatableProperty("isCritical", o => typeof o === "boolean", false),
    new ValidatableProperty("call", o => o[Symbol.toStringTag] === "AsyncFunction", true),
    new ValidatableProperty("restore", o => o[Symbol.toStringTag] === "AsyncFunction", false),
  ]

  Validate(obj: Scenario): boolean {
    if (this.ValidateValidProps(obj, ScenarioValidator.validatableProperties) && this.ValidateUnknownProps(obj, ScenarioValidator.validatableProperties))
      return true;
    throw new Error(`Scenario with ID: ${obj.index} is not valid`);
  }

  private IsValidPropertyName(propertyKey: string, obj: Scenario): propertyKey is keyof typeof obj {
    return propertyKey in obj;
  }

  private GetPropertyValue(propertyKey: string, obj: Scenario): any {
    if (this.IsValidPropertyName(propertyKey, obj))
      return obj[propertyKey];
    throw new Error("Property is not defined");
  }

  private ValidateProperty(propertyKey: string, obj: Scenario, validatorFn: ValidatorFn): boolean {
    if (this.IsValidPropertyName(propertyKey, obj))
      return validatorFn(obj[propertyKey])
    return false;
  }


  private ValidateValidProps(obj: Scenario, props: ValidatableProperty[]): boolean {
    return props.every(o => !(o.name in obj || o.isRequired) ||
      this.ValidateProperty(o.name, obj, o.validatorFn) && props.length !== 0 && this.ValidateValidProps(this.GetPropertyValue(o.name, obj), o.props));
  }

  private ValidateUnknownProps(obj: Scenario, props: ValidatableProperty[]): boolean {
    return Object.getOwnPropertyNames(obj).every(o => props.find(oo => oo.name === o) &&
      (props.find(oo => oo.name === o && this.ValidateUnknownProps(this.GetPropertyValue(o, obj), props.find(oo => oo.name === o)!.props)) ||
        (typeof this.GetPropertyValue(o, obj) !== "object")))
  }
}

export class ScenariosValidator implements Validator<Scenario[]>
{
  constructor(private scenarioValidator: ScenarioValidator) { }

  Validate(scenarios: Scenario[]): boolean {
    if (!scenarios.every(o => this.scenarioValidator.Validate(o)))
      throw new Error("Scenario is not valid")
    if (!this.ValidateSequence(scenarios.map(o => o.index)))
      throw new Error("Indexing is not valid")
    return true;
  }

  private ValidateSequence(sequence: number[]) {
    return sequence.sort().toString() === Array.from({ length: Math.max(...sequence) }, (x, i) => i + 1).toString()
  }
}