export interface MessageInterface {
  getString(): string;
}

export class Message implements MessageInterface {
  public readonly byteLength: number;

  private offset = 0;
  private readonly view: DataView;

  constructor(private readonly buffer: ArrayBuffer) {
    this.view = new DataView(buffer);
    this.byteLength = buffer.byteLength;
  }

  getString(): string {
    const byteLength = this.view.getUint32(this.offset);
    this.offset += 4;
    const chunk = this.buffer.slice(this.offset, this.offset + byteLength);
    this.offset += chunk.byteLength;
    return new TextDecoder().decode(chunk);
  }
}
