export class Meta {
  constructor(public title: string, public description: string) { }
}

export class Scenario {
  meta: Meta;
  isCritical?: boolean;

  constructor(
    public index: number,
    title: string,
    description: string,
    public call: (store: any) => void,
    public restore?: (store: any) => void,
    isCritical?: boolean) {
    this.meta = new Meta(title, description);
    this.isCritical = isCritical || true;
  }
}