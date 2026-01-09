import { isType } from "@tolokoban/type-guards";
import { GenericEvent } from "./event";
import { Message, PeerMessage } from "./message";

type SignalParameters =
  | {
      service: "get-offer" | "get-answer";
      key: string;
    }
  | { service: "set-offer"; input: string }
  | { service: "set-answer"; input: string; key: string };

const SIZES = {
  Uint8: 1,
  Uint16: 2,
  Uint32: 4,
  Int8: 1,
  Int16: 2,
  Int32: 4,
  Float32: 4,
  Float64: 8,
};

type MessageChunk =
  | string
  | ArrayBuffer
  | {
      type: keyof typeof SIZES;
      value: number;
    };

export abstract class Peer {
  public readonly eventConnected = new GenericEvent<Peer>();
  public readonly eventMessage = new GenericEvent<PeerMessage>();
  public readonly eventClose = new GenericEvent<Peer>();

  protected readonly peerConnection: RTCPeerConnection;
  protected readonly dataChannel: RTCDataChannel;

  private remoteChannel: RTCDataChannel | null = null;
  private readonly messageToBeSent: MessageChunk[] = [];

  protected constructor(protected readonly signalServerURL: string) {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun.l.google.com:5349" },
        { urls: "stun:stun1.l.google.com:3478" },
        { urls: "stun:stun1.l.google.com:5349" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:5349" },
        { urls: "stun:stun3.l.google.com:3478" },
        { urls: "stun:stun3.l.google.com:5349" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:5349" },
      ],
    });
    this.dataChannel = this.peerConnection.createDataChannel("p2p");
    this.peerConnection.ondatachannel = (evt: RTCDataChannelEvent) => {
      const { channel } = evt;
      this.remoteChannel = channel;
      channel.onmessage = this.handleMessage;
      channel.onclose = () => this.eventClose.dispatch(this);
    };
  }

  close() {
    this.remoteChannel?.close();
    this.dataChannel.close();
  }

  clear() {
    this.messageToBeSent.splice(0);
    return this;
  }

  putString(message: string) {
    this.messageToBeSent.push(message);
    return this;
  }

  putArrayBuffer(arrayBuffer: ArrayBuffer) {
    this.messageToBeSent.push(arrayBuffer);
    return this;
  }

  putNumber(type: keyof typeof SIZES, value: number) {
    this.messageToBeSent.push({ type, value });
    return this;
  }

  send() {
    const { messageToBeSent } = this;
    if (messageToBeSent.length === 0) return;

    let byteLength = 0;
    const chunks: Uint8Array[] = [];
    for (const item of messageToBeSent) {
      if (typeof item === "string") {
        byteLength += 4;
        const chunk = new TextEncoder().encode(item);
        chunks.push(chunk);
        byteLength += chunk.byteLength;
      } else if (item instanceof ArrayBuffer) {
        byteLength += 4;
        const chunk = new Uint8Array(item);
        chunks.push(chunk);
        byteLength += chunk.byteLength;
      } else {
        byteLength += SIZES[item.type];
      }
    }
    const array = new Uint8Array(byteLength);
    const view = new DataView(array.buffer);
    let byteOffset = 0;
    for (const item of messageToBeSent) {
      if (typeof item === "string" || item instanceof ArrayBuffer) {
        const chunk = chunks.shift();
        if (!chunk) throw new Error("Missing chunk!");

        view.setUint32(byteOffset, chunk.byteLength);
        byteOffset += 4;
        array.set(chunk, byteOffset);
        byteOffset += chunk.byteLength;
      } else {
        switch (item.type) {
          case "Float32":
            view.setFloat32(byteOffset, item.value);
            break;
          case "Float64":
            view.setFloat64(byteOffset, item.value);
            break;
          case "Int16":
            view.setInt16(byteOffset, item.value);
            break;
          case "Int32":
            view.setInt32(byteOffset, item.value);
            break;
          case "Int8":
            view.setInt8(byteOffset, item.value);
            break;
          case "Uint16":
            view.setUint16(byteOffset, item.value);
            break;
          case "Uint32":
            view.setUint16(byteOffset, item.value);
            break;
          case "Uint8":
            view.setUint16(byteOffset, item.value);
            break;
          default:
            throw new Error(`Unknown type "${item.type}"!`);
        }
        byteOffset += SIZES[item.type];
      }
    }
    this.remoteChannel?.send(array);
  }

  sendString(message: string) {
    this.clear().putString(message).send();
  }

  private readonly handleMessage = (evt: MessageEvent) => {
    const { data } = evt;
    console.log("RECEIVED:", data); // @FIXME: Remove this line written on 2026-01-09 at 11:02
    const message = new Message(data);
    this.eventMessage.dispatch(message);
  };

  protected async signal(
    args: SignalParameters,
  ): Promise<Record<string, string>> {
    const data: { s: string; i?: string; k?: string } = {
      s: args.service,
    };
    if (hasInput(args)) data.i = args.input;
    if (hasKey(args)) data.k = args.key;
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    const resp = await fetch(this.signalServerURL, {
      method: "POST",
      headers,
      mode: "cors",
      cache: "no-cache",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    return await resp.json();
  }

  protected readonly onMessage = (data: unknown) => {
    console.log("🐞 [peer@187] data =", data); // @FIXME: Remove this line written on 2026-01-09 at 12:07
    if (data instanceof ArrayBuffer) {
      this.eventMessage.dispatch(new Message(data));
    } else {
      throw new Error("Unexpected message type!");
    }
  };
}

function hasInput(args: unknown): args is { input: string } {
  return isType(args, { input: "string" });
}

function hasKey(args: unknown): args is { key: string } {
  return isType(args, { key: "string" });
}
