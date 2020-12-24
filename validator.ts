import { Scenario } from "./scenario"

type Scen = Scenario.Scenario;

export namespace Validator {
  type ValidatorFn = (o: any) => boolean;

  export class Property {
    constructor(public name: string, public validatorFn: ValidatorFn, public isRequired: boolean, public props: Property[] = []) { }
  }

  export interface Validator<T> {
    Validate(obj: T): boolean;
  }

  export class ScenarioValidator implements Validator<Scen>
  {
    private static props = [
      new Property("index", o => typeof o === "number", true),
      new Property("meta", o => typeof o === "object", true, [
        new Property("title", o => typeof o === "string", true),
        new Property("description", o => typeof o === "string", true)]),
      new Property("isCritical", o => typeof o === "boolean", false),
      new Property("call", o => o[Symbol.toStringTag] === "AsyncFunction", true),
      new Property("restore", o => o[Symbol.toStringTag] === "AsyncFunction", false),
    ]

    Validate(obj: Scen): boolean {
      if (this.ValidateValidProps(obj, ScenarioValidator.props) && this.ValidateUnknownProps(obj, ScenarioValidator.props))
        return true;
      throw new Error(`Scenario with ID: ${obj.index} is not valid`);
    }

    private IsValidPropertyName(propertyKey: string | number | symbol, obj: Scen): propertyKey is keyof typeof obj {
      return propertyKey in obj;
    }

    private GetPropertyValue(propertyKey: string, obj: Scen): any {
      if (this.IsValidPropertyName(propertyKey, obj))
        return obj[propertyKey];
      throw new Error("Property is not defined");
    }

    private ValidateProperty(prop: Property, obj: Scen): boolean {

      if (this.IsValidPropertyName(prop.name, obj))
        if (obj[prop.name] !== undefined || prop.isRequired)
          return prop.validatorFn(obj[prop.name]);
        else if (obj[prop.name] === undefined || prop.isRequired === false)
          return true;
      throw new Error(`Scenario with ID: ${obj.index} on ${prop.name} is not valid`);
    }

    private ValidateValidProps(obj: Scen, props: Property[]): boolean {
      return props.every(o => !(o.name in obj || o.isRequired) ||
        this.ValidateProperty(o, obj) && props.length !== 0 && this.ValidateValidProps(this.GetPropertyValue(o.name, obj), o.props));
    }

    private ValidateUnknownProps(obj: Scen, props: Property[]): boolean {
      if (obj == null) return false;
      return Object.getOwnPropertyNames(obj).every(o => props.find(oo => oo.name === o) &&
        (props.find(oo => oo.name === o && this.ValidateUnknownProps(this.GetPropertyValue(o, obj), props.find(oo => oo.name === o)!.props)) ||
          (typeof this.GetPropertyValue(o, obj) !== "object")))
    }
  }

  export class ScenariosValidator implements Validator<Scen[]>
  {
    constructor(private scenarioValidator: ScenarioValidator) { }

    Validate(scenarios: Scen[]): boolean {
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
}