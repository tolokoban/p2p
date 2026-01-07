import { isType } from "@tolokoban/type-guards";
import { GenericEvent } from "./event";

type SignalParameters =
  | {
      service: "get-offer" | "get-answer";
      key: string;
    }
  | { service: "set-offer"; input: string }
  | { service: "set-answer"; input: string; key: string };

export class Peer {
  public readonly eventConnected = new GenericEvent<this>();

  protected readonly peerConnection: RTCPeerConnection;
  protected readonly dataChannel: RTCDataChannel;

  protected constructor(protected readonly signalServerURL: string) {
    this.peerConnection = new RTCPeerConnection({ iceServers: [] });
    this.dataChannel = this.peerConnection.createDataChannel("p2p");
  }

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
