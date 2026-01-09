export interface PeerMessage {
  getString(): string;
}

export class Message implements PeerMessage {
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

  getArrayBuffer(): ArrayBuffer {
    const byteLength = this.view.getUint32(this.offset);
    this.offset += 4;
    const chunk = this.buffer.slice(this.offset, this.offset + byteLength);
    this.offset += chunk.byteLength;
    return chunk;
  }

  getUint8(): number {
    const value = this.view.getUint8(this.offset);
    this.offset += 1;
    return value;
  }

  getInt8(): number {
    const value = this.view.getInt8(this.offset);
    this.offset += 1;
    return value;
  }

  getUint16(): number {
    const value = this.view.getUint16(this.offset);
    this.offset += 2;
    return value;
  }

  getInt16(): number {
    const value = this.view.getInt16(this.offset);
    this.offset += 2;
    return value;
  }

  getUint32(): number {
    const value = this.view.getUint32(this.offset);
    this.offset += 4;
    return value;
  }

  getInt32(): number {
    const value = this.view.getInt32(this.offset);
    this.offset += 4;
    return value;
  }

  getFloat32(): number {
    const value = this.view.getFloat32(this.offset);
    this.offset += 4;
    return value;
  }

  getFloat64(): number {
    const value = this.view.getFloat64(this.offset);
    this.offset += 8;
    return value;
  }
}
