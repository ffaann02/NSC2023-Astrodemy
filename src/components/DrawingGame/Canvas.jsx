import './DrawingCanvas.css';
import { useEffect, useRef, useState } from 'react';
import "./canvas.css"
const Canvas = (props) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(props.color);
  const [shouldClear, setShouldClear] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      context.lineCap = 'round';
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    contextRef.current = context;
  }, []);

  useEffect(() => {
    setColor(props.color);
  }, [props.color]);

  useEffect(() => {
    contextRef.current.lineWidth = props.size;
  }, [props.size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.strokeStyle = color;
  }, [color]);

  useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      setShouldClear(false);
    
  }, [props.clear]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    setIsDrawing(true);
    nativeEvent.preventDefault();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    nativeEvent.preventDefault();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const setToDraw = () => {
    setColor(props.color);
  };

  const setToErase = () => {
    setColor('white');
  };

  const saveImageToLocal = (event) => {
    let link = event.currentTarget;
    link.setAttribute('download', 'canvas.png');
    let image = canvasRef.current.toDataURL('image/png');
    link.setAttribute('href', image);
  };

  const clearCanvas = () => {
    setShouldClear(true);
  }

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing} 
        onMouseLeave={stopDrawing}
        style={{ width: '100%', height: '100%', borderRadius: '10px' }}
      ></canvas>
      <div>
        {/* <button onClick={setToDraw}>Draw</button>
        <button onClick={setToErase}>Erase</button>
        <button onClick={clearCanvas}>Clear</button>
        <a id="download_image_link" href="download_link" onClick={saveImageToLocal}>
          Download Image
        </a> */}
      </div>
    </div>
  );
};

export default Canvas;
