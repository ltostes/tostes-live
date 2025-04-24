import styles from './ToastGraph.module.css'
import React from 'react'
import * as d3 from 'd3';
import * as Plot from "@observablehq/plot";

function ToastGraph({data}) {
    const containerRef = React.useRef();
    
    React.useEffect(() => {
        if (data === undefined) return;

        const y_domain = [0, d3.max([20, data.length /5])]

        const plot = Plot.plot({
            margin: 10,
            x: {
                axis: null,
                padding: 0.2,
                domain: [20, 120],
                nice: true
            },
            y: {
                axis: null,
                domain: y_domain
            },
            inset: 20,
            marks: [
                Plot.rectY(data, {
                    ...Plot.binX({y: "count", thresholds: 20}, {x: 'width'}),
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
