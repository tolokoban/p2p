import React from "react";
import {
  IconSpaceInvader,
  ViewButton,
  ViewInputText,
  ViewPanel,
  ViewSpinner,
} from "@tolokoban/ui";
import { PeerOffer } from "@tolokoban/p2p";
import { State } from "@/state";

export interface InviteProps {
  onPeer(peer: PeerOffer): void;
}

export function Invite({ onPeer }: InviteProps) {
  const [busy, setBusy] = React.useState(false);
  const [signalServer, setsignalServer] = State.signalServer.useState();
  const handleconnect = async () => {
    setBusy(true);
    const peer = await PeerOffer.connect(signalServer);
    onPeer(peer);
    setBusy(false);
  };

  if (busy) {
    return <ViewSpinner>Contacting STUN server...</ViewSpinner>;
  }

  return (
    <ViewPanel
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      padding="M"
      gap="M"
    >
      <ViewInputText
        label="Signal server"
        value={signalServer}
        onChange={setsignalServer}
      />
      <ViewButton
        icon={IconSpaceInvader}
        enabled={!busy}
        onClick={handleconnect}
      >
        Invite
      </ViewButton>
    </ViewPanel>
  );
}
