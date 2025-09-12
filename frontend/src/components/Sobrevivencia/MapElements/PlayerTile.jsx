import { Flag } from "react-feather"
import { Hex, Hexagon } from "react-hexgrid";
import { GiPikeman } from "react-icons/gi";

export function PlayerTile(props) {
    return (
        <GiPikeman size={12} 
            x={-5.5} y={-6}
            {...props}
        />
    )
}
