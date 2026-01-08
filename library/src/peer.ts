import { isType } from "@tolokoban/type-guards";
import { GenericEvent } from "./event";
import { Message, MessageInterface } from "./message";

type SignalParameters =
  | {
      service: "get-offer" | "get-answer";
      key: string;
    }
  | { service: "set-offer"; input: string }
  | { service: "set-answer"; input: string; key: string };

type MessageChunk = string;

export abstract class Peer {
  public readonly eventConnected = new GenericEvent<this>();
  public readonly eventMessage = new GenericEvent<MessageInterface>();

  protected readonly peerConnection: RTCPeerConnection;
  protected readonly dataChannel: RTCDataChannel;

  private readonly messageToBeSent: MessageChunk[] = [];

  protected constructor(protected readonly signalServerURL: string) {
    this.peerConnection = new RTCPeerConnection({ iceServers: [] });
    this.dataChannel = this.peerConnection.createDataChannel("p2p");
    this.dataChannel.onmessage = this.handleMessage;
  }

  clear() {
    this.messageToBeSent.splice(0);
    return this;
  }

  putString(message: string) {
    this.messageToBeSent.push(message);
    return this;
  }

  send() {
    const { messageToBeSent } = this;
    if (messageToBeSent.length === 0) return;

    let byteLength = 0;
    const stringChunks: Uint8Array[] = [];
    for (const item of messageToBeSent) {
      if (typeof item === "string") {
        byteLength += 4;
        const chunk = new TextEncoder().encode(item);
        stringChunks.push(chunk);
        byteLength += chunk.byteLength;
      }
    }
    const array = new Uint8Array(byteLength);
    const view = new DataView(array.buffer);
    let byteOffset = 0;
    for (const item of messageToBeSent) {
      if (typeof item === "string") {
        const chunk = stringChunks.shift();
        if (!chunk) throw new Error("Missing string chunk!");

        view.setUint32(byteOffset, chunk.byteLength);
        byteOffset += 4;
        array.set(chunk, byteOffset);
        byteOffset += chunk.byteLength;
      }
    }
    this.dataChannel.send(array);
  }

  sendString(message: string) {
    this.clear().putString(message).send();
  }

  private readonly handleMessage = (evt: MessageEvent) => {
    const message = new Message(evt.data);
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
}

function hasInput(args: unknown): args is { input: string } {
  return isType(args, { input: "string" });
}

function hasKey(args: unknown): args is { key: string } {
  return isType(args, { key: "string" });
}
