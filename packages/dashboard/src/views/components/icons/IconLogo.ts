import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

type Props = {
    size?: number;
};

// #component
export class IconLogo extends Component<Props> {
    override template = (): Template => tpl`
        <svg
            viewBox="9 5 29 32"
            width="${((this.props.size ?? 40) * 29) / 32}"
            height="${this.props.size ?? 40}"
            fill="none"
            style="display:block"
            aria-hidden="true"
        >
            <defs>
                <linearGradient
                    id="flowDrop"
                    x1="22"
                    y1="13"
                    x2="37"
                    y2="37"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0" stop-color="#818cf8" />
                    <stop offset="0.55" stop-color="#6366f1" />
                    <stop offset="1" stop-color="#6d28d9" />
                </linearGradient>
                <mask
                    id="flowCut"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="48"
                    height="48"
                >
                    <rect width="48" height="48" fill="#ffffff" />
                    <path
                        d="M29 10 C 29 10, 38 22, 38 28 a 9 9 0 1 1 -18 0 C 20 22, 29 10, 29 10 Z"
                        fill="#000000"
                        stroke="#000000"
                        stroke-width="3"
                    />
                </mask>
            </defs>
            <g mask="url(#flowCut)">
                <path
                    d="M9 24 V30.5 A10 3 0 0 0 29 30.5 V24 A10 3 0 0 1 9 24 Z"
                    fill="#64748b"
                />
                <ellipse cx="19" cy="24" rx="10" ry="3" fill="#94a3b8" />
                <path
                    d="M9 16 V22.5 A10 3 0 0 0 29 22.5 V16 A10 3 0 0 1 9 16 Z"
                    fill="#64748b"
                />
                <ellipse cx="19" cy="16" rx="10" ry="3" fill="#94a3b8" />
                <path
                    d="M9 8 V14.5 A10 3 0 0 0 29 14.5 V8 A10 3 0 0 1 9 8 Z"
                    fill="#64748b"
                />
                <ellipse cx="19" cy="8" rx="10" ry="3" fill="#94a3b8" />
            </g>
            <path
                d="M29 10 C 29 10, 38 22, 38 28 a 9 9 0 1 1 -18 0 C 20 22, 29 10, 29 10 Z"
                fill="url(#flowDrop)"
            />
        </svg>
    `;
}
