import { useState, useEffect, useRef } from 'react';

export function StarSky() {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    // Get the canvas context and set the canvas size
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    setCtx(context);

    // Set background color
    context.fillStyle = '#112';
    context.fillRect(0, 0, width, height);

    // Set glow effect
    context.shadowBlur = 10;
    context.shadowColor = 'white';

    // Handle window resize
    function handleResize() {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Call animate function to start the animation
  useEffect(() => {
    if (ctx) {
      animate();
    }
  }, [ctx]);

  function animate() {
    // Random position and size of stars
    let x = width * Math.random();
    let y = height * Math.random();
    let r = 2.5 * Math.random();

    // Check if elapsed time is greater than 20 seconds
    

    // Draw the stars
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Using setTimeout instead of window.requestAnimationFrame for slower speed
    setTimeout(animate, 500);
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute' }}
    />
  );
}
