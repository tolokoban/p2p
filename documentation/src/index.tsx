import * as React from "react"
import App from "./app"
import { createRoot } from "react-dom/client"
import { Theme } from "@tolokoban/ui"

import "./index.css"

function start() {
    new Theme({
        colors: {
            neutral: ["#111", "#999"],
        },
    }).apply()
    const container = document.getElementById("app")
    if (!container) throw Error(`No element with id "app"!`)

    const root = createRoot(container)
    root.render(<App />)

    const splash = document.getElementById("splash-screen")
    if (!splash) throw Error("Unable to find element #splash-screen!")

    splash.classList.add("vanish")
    window.setTimeout(() => splash.parentNode?.removeChild(splash), 1000)
}

start()

