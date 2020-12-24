export class Meta {
  constructor(public title: string, public description: string) { }
}

export class Scenario {
  meta: Meta;

  constructor(
    public index: number,
    title: string,
    description: string,
    public call: (store: any) => void,
    public restore: (store: any) => void,
    public isCritical: boolean = true) {
    this.meta = new Meta(title, description);
  }
}