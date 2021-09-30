export class ReadParams {
  private entitySetName: string;

  public constructor(entitySetName: string) {
    this.entitySetName = entitySetName;
  }

  public getEntitySetName(): string {
    return this.entitySetName;
  }

  // This is overriden in sub classes
  public isTargetCreatedInSameChangeSet(): boolean {
    return false;
  }
}
