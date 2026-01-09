import React from "react";
import {
  IconMail,
  Theme,
  ViewFloatingButton,
  ViewInputText,
  ViewPanel,
  ViewStrip,
} from "@tolokoban/ui";
import { Peer, PeerMessage } from "@tolokoban/p2p";

import Styles from "./Chat.module.css";

const $ = Theme.classNames;

export interface ChatProps {
  className?: string;
  peer: Peer;
}

interface Message {
  mine: boolean;
  text: string;
}

export default function Chat({ className, peer }: ChatProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [text, setText] = React.useState("");
  const handleSend = () => {
    peer.clear().putString(text).send();
    setMessages([{ mine: true, text }, ...messages]);
    setText("");
  };
  React.useEffect(() => {
    const callback = (message: PeerMessage) => {
      const text = message.getString();
      setMessages([{ mine: false, text }, ...messages]);
    };
    peer.eventMessage.addListener(callback);
    return () => peer.eventMessage.removeListener(callback);
  }, [peer, messages]);
  const closed = useClosed(peer);

  return (
    <ViewStrip
      className={$.join(className, Styles.chat)}
      orientation="column"
      template="-1"
    >
      {closed ? (
        <ViewPanel margin="S" color="error">
          Connection has been closed!
        </ViewPanel>
      ) : (
        <div className={Styles.prompt}>
          <ViewInputText
            value={text}
            onChange={setText}
            autofocus
            onEnterKeyPressed={handleSend}
          />
          <ViewFloatingButton
            size="S"
            icon={IconMail}
            enabled={text.trim().length > 0}
            onClick={handleSend}
          />
        </div>
      )}
      <div className={Styles.messages}>
        {messages.map((item, index) => (
          <div key={index} className={item.mine ? Styles.mine : Styles.theirs}>
            <div>{item.text}</div>
          </div>
        ))}
      </div>
    </ViewStrip>
  );
}

function useClosed(peer: Peer) {
  const [closed, setClosed] = React.useState(false);
  React.useEffect(() => {
    const callback = () => {
      setClosed(true);
    };
    peer.eventClose.addListener(callback);
    return () => peer.eventClose.removeListener(callback);
  }, [peer]);

  return closed;
}
