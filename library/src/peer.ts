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
    console.log('🐞 [peer@15] args =', args) // @FIXME: Remove this line written on 2026-01-06 at 13:44
    return {};
  }
}
