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
    console.log("🐞 [offer@32] offer.sdp =", offer.sdp); // @FIXME: Remove this line written on 2026-01-07 at 10:27
    await this.signalOffer(offer);
    console.log("🐞 [offer@23] this.id =", this.id); // @FIXME: Remove this line written on 2026-01-06 at 16:30
    console.log("🐞 [offer@34] this._address =", this._address); // @FIXME: Remove this line written on 2026-01-07 at 09:57
    this.pollAnswer();
  }

  private pollAnswer() {
    globalThis.setTimeout(async () => {
      try {
        const answer = await this.readAnswer();
        console.log("🐞 [offer@41] answer =", answer); // @FIXME: Remove this line written on 2026-01-07 at 11:38
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

      console.log("🐞 [offer@56] answer =", answer); // @FIXME: Remove this line written on 2026-01-07 at 17:38
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
          console.log("🐞 [offer@30] offer =", offer); // @FIXME: Remove this line written on 2026-01-06 at 16:20
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

  private readonly onMessage = (data: unknown) => {
    console.log("🐞 [offer@35] data =", data); // @FIXME: Remove this line written on 2026-01-06 at 13:45
  };
}
