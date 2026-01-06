import React from "react"
import { Theme } from "@tolokoban/ui"

import Style from "./Spinner.module.css"

const $ = Theme.classNames

export interface SpinnerProps {
    className?: string
}

export default function Spinner({ className }: SpinnerProps) {
    return (
        <svg
            className={$.join(className, Style.Spinner)}
            xmlns="http://www.w3.org/2000/svg"
            height="100%"
            width="100%"
            version="1.1"
            viewBox="-200 -200 400 400"
            preserveAspectRatio="xMidYMid"
        >
            <defs>
                <path
                    id="anim"
                    d="M100,0 A100 100 0 1 1 0 -100"
                    fill="none"
                    strokeDasharray="300 1000"
                    strokeDashoffset="0"
                >
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0 0 0"
                        to="360 0 0"
                        dur=".83s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="stroke-dashoffset"
                        values="0;280;0"
                        dur="1.1s"
                        repeatCount="indefinite"
                    />
                </path>
            </defs>
            <g strokeLinecap="round" strokeLinejoin="round">
                <use href="#anim" stroke="#000" strokeWidth="12" />
                <use href="#anim" stroke="#f90" strokeWidth="6" />
                <g stroke="#000" strokeWidth="2">
                    <path
                        d="M-35,-25 h10v-10h-10v-10h10v10h10v10h30v-10h10v-10h10v10h-10v10h10v10h10v10h10v30h-10v-20h-10v20h-10v10h-20v-10h20v-10h-50v10h20v10h-20v-10h-10v-20h-10v20h-10v-30h10v-10h10z"
                        fill="#05d"
                    />
                    <path d="M-25-15h10v10h-10zM15-15h10v10h-10z" fill="#f90" />
                </g>
            </g>
        </svg>
    )
}
