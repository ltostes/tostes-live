import { Flag } from "react-feather"

export function FinishTile(props) {
    return (
        <g {...props}>
            <Flag size={12} x={6} y={6} className={`stroke-amber-500 fill-amber-400`}   />
        </g>
    )
}
