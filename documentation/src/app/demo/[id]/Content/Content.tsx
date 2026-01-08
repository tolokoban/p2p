import React from "react";
import { PeerAnswer } from "@tolokoban/p2p";

import { ViewSpinner } from "@tolokoban/ui";
import { Accept } from "./Accept";

export default function Content() {
  const [peer, setPeer] = React.useState<PeerAnswer | null>(null);
  const connected = useConnected(peer);

  if (!peer) {
    return <Accept onPeer={setPeer} />;
  }

  if (!connected) {
    return <ViewSpinner>Connecting...</ViewSpinner>;
  }

  return <h1>Connected!</h1>;
}

function useConnected(peer: PeerAnswer | null) {
  const [connected, setConnected] = React.useState(false);
  React.useEffect(() => {
    if (!peer) {
      setConnected(false);
      return;
    }

    const connect = () => setConnected(true);
    peer.eventConnected.addListener(connect);
    return () => peer.eventConnected.removeListener(connect);
  }, [peer]);
  return connected;
}
