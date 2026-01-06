import React from "react"
import { IconPlug, ViewButton, ViewPanel } from "@tolokoban/ui"
import { PeerOffer } from "@tolokoban/p2p"

export default function Page() {
    const [busy, setBusy] = React.useState(false)
    const handleconnect = async()=>{
        setBusy(true)
        const peer = await PeerOffer.connect("http://localhost:55555")
        console.log('🐞 [page@10] peer =', peer) // @FIXME: Remove this line written on 2026-01-06 at 16:09
        setBusy(false)
    }

    return (
        <ViewPanel position="absolute" fullsize color="neutral-1" display="grid" placeItems="center">
            <ViewPanel color="neutral-5" padding="L">
                <h1>@tolokoban/p2p</h1>
                <ViewButton icon={IconPlug} enabled={!busy} onClick={handleconnect}>Connect</ViewButton>
            </ViewPanel>
        </ViewPanel>
    )
}
