import { ViewPanel, ViewStrip } from "@tolokoban/ui";

import Content from "./Content";

export default function Page() {
  return (
    <ViewPanel
      position="absolute"
      fullsize
      color="neutral-1"
      display="grid"
      placeItems="center"
    >
      <ViewStrip orientation="column" template="-1">
        <ViewPanel color="primary-5" padding={["S", "M"]} fontSize="L">
          @tolokoban/p2p (answer)
        </ViewPanel>
        <ViewPanel
          color="neutral-5"
          padding="L"
          display="grid"
          placeItems="center"
        >
          <Content />
        </ViewPanel>
      </ViewStrip>
    </ViewPanel>
  );
}
