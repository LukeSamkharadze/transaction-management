class Property {
  constructor(name, valueType, isRequired, props = []) {
    this.name = name;
    this.valueType = valueType;
    this.isRequired = isRequired;
    this.props = props;
  }
}

class Validator {
  static _scenarioMaxPropsCount = 7;
  static _scenarioProps = [
    new Property("index", "number", true),
    new Property("meta", "object", true, [
      new Property("title", "string", true),
      new Property("description", "string", true)]),
    new Property("isCritical", "boolean", false),
    new Property("call", "function", true),
    new Property("restore", "function", false),
  ]

  ValidateScenarios(scenarios) {
    if (!scenarios.every(o => this.ValidateValidProps(o, Validator._scenarioProps) && this.ValidateUnknownProps(o, Validator._scenarioProps)))
      throw new Error("Scenario is not valid");
    if (!this.ValidateSequence(scenarios.map(o => o.index), Validator._scenarioProps))
      throw new Error("Indexing is not valid");
  }

  ValidateValidProps(obj, props) {
    return props.every(o => !(o.name in obj || o.isRequired) || (o.name in obj && o.valueType === typeof obj[o.name] && props.length !== 0 && this.ValidateValidProps(obj[o.name], o.props)));
  }

  ValidateUnknownProps(obj, props) {
    return Object.getOwnPropertyNames(obj).every(o => (typeof obj[o] !== "object" || (props.find(oo => oo.name === o && this.ValidateUnknownProps(obj[o], props.find(oo => oo.name === o).props)))) && props.find(oo => oo.name === o))
  }

  ValidateSequence(sequence) {
    return sequence.sort().toString() === Array.from({ length: Math.max(...sequence) }, (x, i) => i + 1).toString();
  }

}

export { Validator };