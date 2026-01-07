import React from "react";
import { Theme } from "@tolokoban/ui";
import { PeerOffer } from "@tolokoban/p2p";
import { Invite } from "./Invite";
import QrCodeButton from "./QrCodeButton";

const $ = Theme.classNames;

export default function Content() {
  const [peer, setPeer] = React.useState<PeerOffer | null>(null);

  if (!peer) return <Invite onPeer={setPeer} />;

  return <QrCodeButton peer={peer} />;
}
