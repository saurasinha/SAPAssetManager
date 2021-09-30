import { ReadParams } from './ReadParams';
import { ChangeSetManager } from '../ChangeSetManager';

export class ReadLinkReadParams extends ReadParams {
  private readLink: string;
  
  public constructor(entitySetName: string, readLink: string) {
    super(entitySetName);
    this.readLink = readLink;
  }

  public getReadLink(): string {
    return this.readLink;
  }

  public isTargetCreatedInSameChangeSet(): boolean {
    return this.readLink.startsWith(ChangeSetManager.UNPROCESSEDPREFIX);
  }
}
