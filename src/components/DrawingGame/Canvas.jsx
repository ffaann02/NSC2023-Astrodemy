import './DrawingCanvas.css';
import { useEffect, useRef, useState } from 'react';
import "./canvas.css"
const Canvas = (props) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [color, setColor] = useState(props.color);
  const { socket } = props;
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
    socket.emit('setColor', {color,roomId: props.roomId});
  }, [color]);

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
    socket.emit('clearCanvas', { roomId: props.roomId });
  }, [props.clear]);
  
  
  const [points, setPoints] = useState([]);
  

  const startDrawing = ({ nativeEvent }) => {
    if (isLocked) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setPoints([{ x: offsetX, y: offsetY }]);
    socket.emit('startDrawing', { x: offsetX, y: offsetY, roomId: props.roomId });
  };
  

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || props.username !== props.currentPlayerName)  {
      return;
    }
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    
      // Add the new point to the list of points for the current drawing
      const newPoints = [...points, { x: offsetX, y: offsetY }];
      setPoints(newPoints);
    
      // Send the entire list of points for the current drawing, along with the current size, to the other player
      socket.emit('draw', { points: newPoints, size: props.size , roomId: props.roomId});
  };
  
  
  

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  
    socket.emit('stopDrawing',{ roomId: props.roomId});
  };


  const saveImageToLocal = (event) => {
    let link = event.currentTarget;
    link.setAttribute('download', 'canvas.png');
    let image = canvasRef.current.toDataURL('image/png');
    link.setAttribute('href', image);
  };
  useEffect(() => {
    socket.on('startDrawing', ({ x, y }) => {
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
    });
  
    socket.on('draw', ({ points, size }) => {
      contextRef.current.beginPath();
      contextRef.current.moveTo(points[0].x, points[0].y);
      contextRef.current.lineWidth = size; // Set the line width to the size sent from the other player
      points.forEach((point) => {
        contextRef.current.lineTo(point.x, point.y);
      });
      contextRef.current.stroke();
    });
  
    socket.on('stopDrawing', () => {
      contextRef.current.closePath();
    });
    socket.on('setColor', (color) => {
      contextRef.current.strokeStyle = color;
    });
    socket.on('clearCanvas', () => {
      console.log("should clear");
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    });
  }, []);

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
