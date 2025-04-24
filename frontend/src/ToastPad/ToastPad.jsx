import styles from './ToastPad.module.css'
import React from 'react'
import * as d3 from 'd3';
import ToastGraph from './ToastGraph';
import Toast from './Toast';

function ToastPad() {

    const [toasts, setToasts] = React.useState([]);

    const sizeScale = d3.scaleLinear()
                        .range([20,120]);
    const rotationGenerator = d3.randomNormal(0,45);

    function addToast(event) {

        const size = sizeScale(Math.random());

        const newToast = {
            x: event.clientX,
            y: event.clientY,
            width: size,
            height: size,
            rotation: rotationGenerator(),
            id: crypto.randomUUID()
        };

        const nextToasts = [...toasts, newToast];

        setToasts(nextToasts);
    }

    function deleteToast(index) {
        const nextToasts = [...toasts];
        nextToasts.splice(index,1);
        setToasts(nextToasts);
    }

  return (
    <>
        <button
            className={styles.addToastBtn}
            onClick={addToast}
            />
        {
            toasts.map((toast, index) => (
                
            <button
                className={styles.toast}
                key={toast.id}
                onClick={addToast}
                onContextMenu={(event) => {
                    event.preventDefault();
                    deleteToast(index);
                }}
                style={{
                    left: toast.x,
                    top: toast.y,
                    width: toast.width,
                    height: toast.height,
                    transform: `translate(-50%, -50%) rotate(${toast.rotation}deg)`
                }}
            >
                <Toast/>
            </button>

    ))}
        <ToastGraph data={toasts}/>
    </>
  );
}

export default ToastPad;
