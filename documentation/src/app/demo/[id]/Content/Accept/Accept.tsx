import React from "react";
import { IconPlug, ViewButton, ViewInputText, ViewPanel } from "@tolokoban/ui";
import { PeerAnswer, PeerOffer } from "@tolokoban/p2p";
import { State } from "@/state";
import { useRouteParamAsString } from "@/app/routes";

export interface AcceptProps {
  onPeer(peer: PeerAnswer): void;
}

export function Accept({ onPeer }: AcceptProps) {
  const id = useRouteParamAsString("id");
  const [busy, setBusy] = React.useState(false);
  const [signalServer, setsignalServer] = State.signalServer.useState();
  const handleconnect = async () => {
    setBusy(true);
    const peer = await PeerAnswer.connect(signalServer, id);
    onPeer(peer);
    setBusy(false);
  };

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
      <ViewButton icon={IconPlug} enabled={!busy} onClick={handleconnect}>
        Accept
      </ViewButton>
    </ViewPanel>
  );
}
