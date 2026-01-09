import { assertType, assertType$ } from "@tolokoban/type-guards";
import { Peer } from "./peer";

export class PeerOffer extends Peer {
  static async connect(signalServerURL: string): Promise<PeerOffer> {
    const peerOffer = new PeerOffer(signalServerURL);
    await peerOffer.connect();
    return peerOffer;
  }

  private _id = "";
  private _address = "";

  private constructor(signalServerURL: string) {
    super(signalServerURL);
  }

  get id() {
    return this._id;
  }

  get address() {
    return this._address;
  }

  private async connect() {
    const offer = await this.createOffer();
    await this.signalOffer(offer);
    this.pollAnswer();
  }

  private pollAnswer() {
    globalThis.setTimeout(async () => {
      try {
        const answer = await this.readAnswer();
        if (answer) {
          this.peerConnection.setRemoteDescription(answer);
        } else {
          this.pollAnswer();
        }
      } catch (ex) {
        console.error("Error in PeerOffer.pollAnswer():", ex);
      }
    }, 1000);
  }

  private async readAnswer(): Promise<RTCSessionDescriptionInit | null> {
    try {
      const data = await this.signal({
        service: "get-answer",
        key: this.id,
      });
      assertType$<{ answer: string | null }>(data, {
        answer: ["|", "string", "null"],
      });
      if (!data.answer) return null;

      const answer = JSON.parse(data.answer);

      assertType$<RTCSessionDescriptionInit>(answer, {
        type: ["literal", "answer"],
        sdp: "string",
      });
      return answer;
    } catch (ex) {
      console.error("Error in PeerOffer.readAnswer():", ex);
      throw ex;
    }
  }

  private async signalOffer(offer: unknown) {
    const offerAsString = JSON.stringify(offer);
    const response = await this.signal({
      service: "set-offer",
      input: offerAsString,
    });
    assertType(response, { id: "string", address: "string" });
    this._id = response.id;
    this._address = response.address;
  }

  private async createOffer(): Promise<RTCSessionDescription> {
    return new Promise((resolve, reject) => {
      const action = async () => {
        try {
          const { peerConnection, dataChannel } = this;
          dataChannel.onopen = () => {
            console.log("OFFER: Connection established!");
            this.eventConnected.dispatch(this);
          };
          dataChannel.onmessage = (e) => this.onMessage(e.data);
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          peerConnection.onicecandidate = (event) => {
            if (!event.candidate) {
              if (peerConnection.localDescription) {
                resolve(peerConnection.localDescription);
              } else {
                reject(new Error("Unable to create Offer!"));
              }
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
}
