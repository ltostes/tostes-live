export function StartLocation(props) {
    return (
        <g {...props}>
            <circle cx="0" cy="0" r="4" fill="none" stroke="white" />
            <circle cx="0" cy="0" r="6.5" fill="none" stroke="white" />
            <circle cx="0" cy="0" r="2" fill="white" />
            <circle cx="0" cy="0" r="10" fill="white" opacity={0} />
        </g>
    )
}