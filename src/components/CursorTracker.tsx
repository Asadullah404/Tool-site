import { useEffect, useState } from 'react';

const CursorTracker = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const hideCursor = () => setIsVisible(false);

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseleave', hideCursor);

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseleave', hideCursor);
    };
  }, []);

  return (
    <div
      className={`cursor-dot ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        left: position.x - 4,
        top: position.y - 4,
      }}
    />
  );
};

export default CursorTracker;