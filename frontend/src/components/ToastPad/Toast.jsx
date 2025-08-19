import React from 'react'
import * as d3 from 'd3';

function Toast() {

    const cascacolor = `hsl(${34} 45.5% ${50}%)`
    const corpocolor = `hsl(${34} 56.9% ${70}%)`
    const viewportSize = 500
    const strokeWidth = viewportSize * 0.03;
    const toastsize = viewportSize - strokeWidth;
    const toastHeightProp = 1;
    const rx = toastsize /3;
    const topPartHeight = toastsize/2;
    const topCrustInnerOffset = toastsize/20;
    const topCrustOuterOffset = toastsize/10;
    
    // Holes
    const holeBorderHorizontal = topCrustOuterOffset + strokeWidth*3;
    const holeBorderVertical = topCrustOuterOffset;
    const minHoleSize = toastsize/30;
    const maxHoleSize = toastsize/15;
    const minColorSaturation = 10;
    const maxColorSaturation = 70;
    const stdevColorSaturation = 15;

    const holeRadiusScale = d3.scaleLinear([minHoleSize, maxHoleSize]);
    const holeHorizontalScale = d3.scaleLinear([holeBorderHorizontal, toastsize - holeBorderHorizontal]);
    const holeVerticalScale = d3.scaleLinear([holeBorderVertical, toastsize - holeBorderVertical]);
    const holeColorScale = d3.scaleLinear([minColorSaturation,maxColorSaturation]);

    function getRandomHole() {
        const cx = d3.randomUniform(...holeHorizontalScale.range())();
        const cy = d3.randomUniform(...holeVerticalScale.range())();
        const r = d3.randomUniform(...holeRadiusScale.range())();

        const rReverse = holeRadiusScale.invert(r);
        const fillRelatedR = holeColorScale(rReverse);
        const fillNormal = d3.randomNormal(fillRelatedR, stdevColorSaturation)();
        const clampedFill = Math.max(Math.min(maxColorSaturation, fillNormal), minColorSaturation);

        const fill = `hsl(${34} 45.5% ${clampedFill}%)`

        return {cx,cy, r, fill}
    }
    
    const numHoles = 10;
    const holes = React.useMemo(() => Array(numHoles).fill().map(() => getRandomHole())
    ,[])

  return (
    <svg id="Layer_1" viewBox={`0 0 ${viewportSize} ${viewportSize}`} style={{position: 'relative'}}>
        <g id='toast' 
            transform={`translate(${strokeWidth/2},${strokeWidth/2})`}
        >
            <rect 
                x={topCrustOuterOffset} 
                y={strokeWidth + topPartHeight/2} 
                width={toastsize - 2*topCrustOuterOffset}
                height={toastsize * toastHeightProp -topPartHeight/2 - strokeWidth}
                stroke={cascacolor}
                fill={corpocolor}
                strokeWidth={strokeWidth}
            />
            <rect 
                width={toastsize}
                height={topPartHeight}
                rx={rx}
                stroke={cascacolor}
                fill={corpocolor}
                strokeWidth={strokeWidth}
            />
            <rect 
                x={strokeWidth/2 + topCrustInnerOffset + topCrustOuterOffset}
                y={topPartHeight/2-strokeWidth}
                width={toastsize-(strokeWidth + 2* (topCrustInnerOffset+topCrustOuterOffset))} 
                height={strokeWidth*2 + topPartHeight}
                fill={corpocolor}
            />
            {/* cx from 20 to 90, r from 2 to 7, cy from 15 to 100 */}
            {/* hsl 45 a 50 */}
            {/* Inner holes */}
            {
                holes.map((hole, i) => {
                    return <circle
                        key={i}
                        {...hole}
                    />
                })
            }
        </g>
    </svg>
  );
}

export default Toast;
