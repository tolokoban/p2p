import React from "react";
import { PeerAnswer } from "@tolokoban/p2p";

import { useRouteParamAsString } from "@/app/routes";
import { ViewSpinner } from "@tolokoban/ui";

export default function Content() {
  const id = useRouteParamAsString("id");
  const [peer, setPeer] = React.useState<PeerAnswer | null>(null);
  const connected = useConnected(peer);
  React.useEffect(() => {
    const action = async () => {
      setPeer(await PeerAnswer.connect("http://localhost:55555", id));
    };
    action();
  }, [id]);

  if (!peer) {
    return (
      <ViewSpinner>
        <b>{id}</b>
      </ViewSpinner>
    );
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
