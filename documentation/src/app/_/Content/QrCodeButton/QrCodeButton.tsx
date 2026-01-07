import React from "react";
import { Theme } from "@tolokoban/ui";
import { PeerOffer } from "@tolokoban/p2p";
import QRCode from "qrcode";

import Styles from "./QrCodeButton.module.css";

const $ = Theme.classNames;

export interface QrCodeButtonProps {
  className?: string;
  peer: PeerOffer;
}

export default function QrCodeButton({ className, peer }: QrCodeButtonProps) {
  const connected = useConnected(peer);
  const { protocol, hostname, port, pathname } = globalThis.location;
  const url = `${protocol}//${hostname}:${port}${pathname}#/demo/${peer.id}`;
  const handleMount = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;

    QRCode.toCanvas(canvas, url);
  };

  if (!connected)
    return (
      <div className={$.join(className, Styles.qrCodeButton)}>
        <a href={url} target="_blank">
          <canvas ref={handleMount}></canvas>
        </a>
      </div>
    );

  return <h1>Connected!</h1>;
}

function useConnected(peer: PeerOffer) {
  const [connected, setConnected] = React.useState(false);
  React.useEffect(() => {
    const connect = () => setConnected(true);
    peer.eventConnected.addListener(connect);
    return () => peer.eventConnected.removeListener(connect);
  }, [peer]);
  return connected;
}
