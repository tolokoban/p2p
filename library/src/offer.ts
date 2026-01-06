import { assertType } from "@tolokoban/type-guards"
import { Peer } from "./peer";

export class PeerOffer extends Peer {
  static async connect(signalServerURL: string): Promise<PeerOffer> {
    const peerOffer = new PeerOffer(signalServerURL);
    await peerOffer.connect();
    return peerOffer;
  }

  private _id = ""

  private constructor(signalServerURL: string) {
    super(signalServerURL);
  }

  get id() { return this._id }

  private async connect() {
    const offer = await this.createOffer()
    console.log('🐞 [offer@16] offer =', offer) // @FIXME: Remove this line written on 2026-01-06 at 16:18
    this._id = await this.signalOffer(offer)
    console.log('🐞 [offer@23] this.id =', this.id) // @FIXME: Remove this line written on 2026-01-06 at 16:30
  }

  private  async   signalOffer(offer: unknown) {
    const offerAsString = JSON.stringify(offer)
    const response = await this.signal({
        service: "set-offer",
        input: offerAsString
    })
    assertType(response, { id: "string" })
    return response.id
  }

  private async createOffer() {
      return new Promise((resolve, reject) => {
            const action = async ()=> {
                try {
                    const peerConnection = new RTCPeerConnection({ iceServers: [] });
                    const dataChannel = peerConnection.createDataChannel("p2p");
                    dataChannel.onopen = () => {
                        console.log("SYSTEM: Connection established!");
                    };
                    dataChannel.onmessage = (e) => this.onMessage(e.data);
                    const offer = await peerConnection.createOffer();
                    console.log('🐞 [offer@30] offer =', offer) // @FIXME: Remove this line written on 2026-01-06 at 16:20
                    await peerConnection.setLocalDescription(offer);
                    peerConnection.onicecandidate = (event) => {
                        if (!event.candidate) {
                            resolve(peerConnection.localDescription)
                        }
                    };
                } catch (ex) {
                    console.error("Unable to create an offer:", ex)
                    reject(ex)
                }
            }
            action()
        })
  }

  private readonly onMessage = (data: unknown) => {
    console.log('🐞 [offer@35] data =', data) // @FIXME: Remove this line written on 2026-01-06 at 13:45
  };
}
