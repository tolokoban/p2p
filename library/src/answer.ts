import { assertType, assertType$ } from "@tolokoban/type-guards";
import { Peer } from "./peer";

export class PeerAnswer extends Peer {
  static async connect(
    signalServerURL: string,
    id: string,
  ): Promise<PeerAnswer> {
    const peerOffer = new PeerAnswer(signalServerURL, id);
    await peerOffer.connect();
    return peerOffer;
  }

  private _id = "";
  private _address = "";

  private constructor(signalServerURL: string, id: string) {
    super(signalServerURL);
    this._id = id;
  }

  get id() {
    return this._id;
  }

  get address() {
    return this._address;
  }

  private async connect() {
    const offer = await this.readOffer();
    console.log("🐞 [answer@35] offer.sdp =", offer.sdp); // @FIXME: Remove this line written on 2026-01-07 at 11:11
    const answer = await this.createAnswer(offer);
    await this.signalAnswer(answer);
  }

  private async readOffer() {
    const data = await this.signal({
      service: "get-offer",
      key: this.id,
    });
    console.log("🐞 [answer@42] data =", data); // @FIXME: Remove this line written on 2026-01-07 at 17:29
    assertType(data, { offer: "string" });
    const offer = JSON.parse(data.offer);
    console.log("🐞 [answer@45] offer =", offer); // @FIXME: Remove this line written on 2026-01-07 at 17:29
    assertType$<RTCSessionDescriptionInit>(offer, {
      type: ["literal", "offer"],
      sdp: "string",
    });
    return offer;
  }

  private async signalAnswer(answer: unknown) {
    const answerAsString = JSON.stringify(answer);
    const response = await this.signal({
      service: "set-answer",
      input: answerAsString,
      key: this.id,
    });
    assertType(response, { id: "string" });
  }

  private async createAnswer(offer: RTCSessionDescriptionInit) {
    return new Promise((resolve, reject) => {
      const action = async () => {
        try {
          const { peerConnection, dataChannel } = this;
          peerConnection.setRemoteDescription(offer);
          dataChannel.onopen = () => {
            console.log("ANSWER: Connection established!");
            this.eventConnected.dispatch(this);
          };
          dataChannel.onmessage = (e) => this.onMessage(e.data);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          peerConnection.onicecandidate = (event) => {
            if (!event.candidate) {
              resolve(peerConnection.localDescription);
            }
          };
        } catch (ex) {
          console.error("Unable to create an offer:", ex);
          reject(ex);
        }
      };
      action();
    });
  }

  private readonly onMessage = (data: unknown) => {
    console.log("🐞 [offer@35] data =", data); // @FIXME: Remove this line written on 2026-01-06 at 13:45
  };
}
