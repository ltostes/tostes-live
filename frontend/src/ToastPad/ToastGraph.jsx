import styles from './ToastGraph.module.css'
import React from 'react'
import * as d3 from 'd3';
import * as Plot from "@observablehq/plot";

function ToastGraph(data) {
    const containerRef = React.useRef();
    
    React.useEffect(() => {
        if (data === undefined) return;
        const plot = Plot.plot({
            margin: 10,
            x: {
                axis: null,
                padding: 0.2
            },
            y: {
                axis: null
            },
            inset: 20,
            marks: [
                Plot.rectY(data.data, {
                    ...Plot.binX({y: "count"}, {x: 'width'}),
                    r: 50,
                    insetLeft: 10,
                    fill: 'white'
                })
            ]
        }
        );
        console.log(data);
        containerRef.current.append(plot);
        return () => plot.remove();
    }, [data]);

  return (
    <div className={styles.toastGraphWrapper}>
        <div 
            id='graph' 
            ref={containerRef}
        />
    </div>
  );
}

export default ToastGraph;
