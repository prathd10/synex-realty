import { useMemo } from 'react';

export default function MarineDrive3D({ scrollY }) {
  // Config parameters
  const numStreetlights = 12;
  const numBuildings = 14;
  
  // Calculate infinite Z-wrap and curves for streetlights
  const streetlights = useMemo(() => {
    const spacing = 280;
    const range = spacing * numStreetlights;
    
    return Array.from({ length: numStreetlights }).map((_, i) => {
      const zStart = -i * spacing;
      // Scroll speed modifier (1.6px per scroll pixel)
      const rawZ = zStart + scrollY * 1.6;
      // Infinite wrap around math
      const wrappedZ = ((rawZ - (-2800)) % range) + -2800;
      
      // Curve math: curve leftwards in the distance
      const zAbs = Math.abs(wrappedZ);
      const curveOffset = -Math.pow(Math.min(zAbs / 1000, 2.8), 1.55) * 85;
      
      // X positioning (on the right side of the road)
      const xPos = 120 + curveOffset;
      
      // Fade out in distance or when passing camera
      let opacity = 1;
      if (wrappedZ > 0) {
        // Fade out quickly as it passes behind viewer
        opacity = Math.max(0, 1 - wrappedZ / 120);
      } else if (wrappedZ < -2400) {
        // Fade in from distance
        opacity = Math.max(0, (2800 + wrappedZ) / 400);
      }
      
      return {
        id: `light-${i}`,
        x: xPos,
        y: -100, // height of light head
        z: wrappedZ,
        opacity
      };
    });
  }, [scrollY]);

  // Calculate infinite Z-wrap and curves for left-side buildings
  const buildings = useMemo(() => {
    const spacing = 320;
    const range = spacing * numBuildings;
    
    return Array.from({ length: numBuildings }).map((_, i) => {
      const zStart = -i * spacing;
      const rawZ = zStart + scrollY * 1.6;
      const wrappedZ = ((rawZ - (-3600)) % range) + -3600;
      
      // Curve leftwards in the distance
      const zAbs = Math.abs(wrappedZ);
      const curveOffset = -Math.pow(Math.min(zAbs / 1000, 3.2), 1.55) * 85;
      
      // X positioning (on the left side of the road)
      const xPos = -260 + curveOffset;
      
      // Render attributes
      const height = 180 + (i % 3) * 60 + (i % 2) * 30; // variable building heights
      const width = 110 + (i % 2) * 30;
      
      let opacity = 0.85;
      if (wrappedZ > 0) {
        opacity = Math.max(0, 0.85 - wrappedZ / 120);
      } else if (wrappedZ < -3200) {
        opacity = Math.max(0, ((3600 + wrappedZ) / 400) * 0.85);
      }
      
      // Dynamic window grids
      const columns = 3 + (i % 2);
      const rows = 6 + (i % 3) * 2;
      const windowsCount = columns * rows;
      
      return {
        id: `building-${i}`,
        x: xPos,
        y: -height / 2, // center Y based on height
        z: wrappedZ,
        height,
        width,
        opacity,
        columns,
        windowsCount,
        colorIndex: i % 3
      };
    });
  }, [scrollY]);

  return (
    <div 
      className="fixed inset-0 -z-50 overflow-hidden bg-[#110D1A] pointer-events-none"
      style={{
        perspective: '1000px',
        perspectiveOrigin: '50% 42%',
      }}
    >
      {/* 3D Scene Wrapper */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'translateZ(0px)',
        }}
      >
        {/* 1. Deep Pink Sunset Background */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: 'translateZ(-1400px) scale(2.4)',
            backgroundImage: 'url(/images/sunset_bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        />

        {/* 2. Flat Ocean Reflection Bay (Far Right) */}
        <div 
          className="absolute left-[52%] bottom-0 w-[1400px] h-[3000px] origin-bottom opacity-40"
          style={{
            transform: 'rotateX(86deg) translateZ(-65px) translateY(-1500px)',
            background: 'linear-gradient(180deg, rgba(245, 184, 184, 0.25) 0%, rgba(17, 13, 26, 0.9) 100%)',
            maskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
          }}
        />

        {/* 3. The Highway Road Plane (Skewed left to align with curve) */}
        <div 
          className="absolute left-1/2 bottom-0 w-[420px] h-[3000px] origin-bottom -translate-x-1/2"
          style={{
            transform: 'rotateX(86deg) translateZ(-60px) translateY(-1500px) skewX(-2.5deg)',
            background: 'linear-gradient(180deg, #181424 0%, #110d1a 100%)',
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.8) inset',
            borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Moving Dashed Road Stripes */}
          <div 
            className="w-1.5 h-full mx-auto"
            style={{
              backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 50%, transparent 50%)',
              backgroundSize: '100% 90px',
              backgroundPositionY: `${scrollY * 2.2}px`,
            }}
          />
        </div>

        {/* 4. Skyscraper Layer (Left Side) */}
        {buildings.map(b => (
          <div
            key={b.id}
            className="absolute left-1/2 bottom-[38%] rounded-t-xl transition-all"
            style={{
              width: `${b.width}px`,
              height: `${b.height}px`,
              opacity: b.opacity,
              transform: `translate3d(calc(-50% + ${b.x}px), ${b.y}px, ${b.z}px)`,
              transformStyle: 'preserve-3d',
              background: 'linear-gradient(to bottom, #191428 0%, #0d0a15 100%)',
              border: '1px solid rgba(245, 184, 184, 0.06)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
            }}
          >
            {/* Glowing Windows Grid */}
            <div 
              className="w-full h-full p-4 grid gap-1.5"
              style={{
                gridTemplateColumns: `repeat(${b.columns}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: b.windowsCount }).map((_, w) => {
                const isLit = (w + b.colorIndex) % 4 === 0;
                return (
                  <span 
                    key={w} 
                    className="w-1.5 h-1 rounded-sm mx-auto block transition-colors duration-500"
                    style={{
                      backgroundColor: isLit ? 'rgba(245, 184, 184, 0.72)' : 'rgba(255, 255, 255, 0.03)',
                      boxShadow: isLit ? '0 0 6px rgba(245, 184, 184, 0.8)' : 'none',
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* 5. Glowing Streetlights Layer (Right Side) */}
        {streetlights.map(sl => (
          <div
            key={sl.id}
            className="absolute left-1/2 bottom-[38%] w-1.5 h-28 origin-bottom transition-all"
            style={{
              opacity: sl.opacity,
              transform: `translate3d(calc(-50% + ${sl.x}px), ${sl.y}px, ${sl.z}px)`,
              transformStyle: 'preserve-3d',
              background: 'linear-gradient(to top, #110d1a 0%, #302645 100%)',
            }}
          >
            {/* Horizontal Lamp Arm */}
            <div 
              className="absolute top-0 right-0 w-6 h-0.5 bg-[#302645]"
              style={{ transform: 'translateX(100%)' }}
            />
            {/* Glowing Orb Bulb */}
            <div 
              className="absolute top-[-3px] right-[-24px] w-3 h-3 rounded-full bg-[#F5B8B8] shadow-[0_0_15px_#F5B8B8,0_0_30px_#F5B8B8]"
              style={{
                background: 'radial-gradient(circle, #ffffff 30%, #F5B8B8 100%)',
              }}
            />
            {/* Soft pink highlight pole top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#F5B8B8]/30 blur-[0.5px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
