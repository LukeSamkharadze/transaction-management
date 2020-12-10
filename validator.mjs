class Property {
  constructor(name, valueType, isRequired, props = []) {
    this.name = name;
    this.valueType = valueType;
    this.isRequired = isRequired;
    this.props = props;
  }
}

class Validator {
  static _scenarioProps = [
    new Property("index", "number", true),
    new Property("meta", "object", true, [
      new Property("title", "string", true),
      new Property("description", "string", true)]),
    new Property("call", "function", true),
    new Property("restore", "function", false),
  ]

  ValidateScenarios(scenarios) {
    if (!scenarios.every(o => this.ValidateObject(o, Validator._scenarioProps))) throw new Error("Scenario is not valid");
    if (!this.ValidateSequence(scenarios.map(o => o.index), Validator._scenarioProps)) throw new Error("Indexing is not valid");
    return true;
  }

  ValidateObject(obj, props) {
    return props.every(o => !o.isRequired || (o.name in obj && o.valueType === typeof obj[o.name] && props.length !== 0 && this.ValidateObject(obj[o.name], o.props)));
  }

  ValidateSequence(sequence) {
    return sequence.sort().toString() === Array.from({ length: Math.max(...sequence) }, (x, i) => i + 1).toString();
  }
}

export { Validator };