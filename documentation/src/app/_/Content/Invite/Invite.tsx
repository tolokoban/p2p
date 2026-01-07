import React from "react";
import { IconSpaceInvader, ViewButton } from "@tolokoban/ui";
import { PeerOffer } from "@tolokoban/p2p";

export interface InviteProps {
  onPeer(peer: PeerOffer): void;
}

export function Invite({ onPeer }: InviteProps) {
  const [busy, setBusy] = React.useState(false);
  const handleconnect = async () => {
    setBusy(true);
    const peer = await PeerOffer.connect("http://localhost:55555");
    onPeer(peer);
    setBusy(false);
  };

  return (
    <ViewButton icon={IconSpaceInvader} enabled={!busy} onClick={handleconnect}>
      Invite
    </ViewButton>
  );
}
