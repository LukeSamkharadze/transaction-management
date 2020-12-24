import { Scenario } from "./scenario"

class Property {
  constructor(public name: string, public validatorFn: (o: any) => boolean, public isRequired: boolean, public props: Property[] = []) { }
}

export class Validator {
  static _scenarioProps = [
    new Property("index", o => typeof o === "number", true),
    new Property("meta", o => typeof o === "object", true, [
      new Property("title", o => typeof o === "string", true),
      new Property("description", o => typeof o === "string", true)]),
    new Property("isCritical", o => typeof o === "boolean", false),
    new Property("call", o => o[Symbol.toStringTag] === "AsyncFunction", true),
    new Property("restore", o => o[Symbol.toStringTag] === "AsyncFunction", false),
  ]

  ValidateScenarios(scenarios: Scenario[]) {
    if (!scenarios.every(o => this.ValidateValidProps(o, Validator._scenarioProps) && this.ValidateUnknownProps(o, Validator._scenarioProps)))
      throw new Error("Scenario is not valid")
    if (!this.ValidateSequence(scenarios.map(o => o.index)))
      throw new Error("Indexing is not valid")
  }

  ValidateValidProps(obj: any, props: Property[]): boolean {
    return props.every(o => !(o.name in obj || o.isRequired) ||
      (o.name in obj && o.validatorFn(obj[o.name])) && props.length !== 0 && this.ValidateValidProps(obj[o.name], o.props))
  }

  ValidateUnknownProps(obj: any, props: Property[]): boolean {
    return Object.getOwnPropertyNames(obj).every(o => props.find(oo => oo.name === o) &&
      (props.find(oo => oo.name === o && this.ValidateUnknownProps(obj[o], props.find(oo => oo.name === o)!.props)) || (typeof obj[o] !== "object")))
  }

  ValidateSequence(sequence: number[]) {
    return sequence.sort().toString() === Array.from({ length: Math.max(...sequence) }, (x, i) => i + 1).toString()
  }
}