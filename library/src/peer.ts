type SignalParameters =
  | {
      service: "get-offer" | "get-answer";
      key: string;
    }
  | { service: "set-offer"; input: string }
  | { service: "set-answer"; input: string; key: string };

export class Peer {
  protected constructor(protected readonly signalServerURL: string) {}

  protected async signal(
    args: SignalParameters,
  ): Promise<Record<string, string>> {
    const data: {s: string, i?: string, k?: string } = {
        s: args.service
    }
    const headers = new Headers({
        "Content-Type": "application/json",
    })
    const resp = await fetch(
        this.signalServerURL, {
            method: "POST",
            headers,
            mode: "cors",
            cache: "no-cache",
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data)
        }
    )
    return await resp.json();
  }
}
