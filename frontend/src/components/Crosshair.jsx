import { useEffect, useId, useRef } from "react";
import { gsap } from "gsap";

const lerp = (a, b, n) => (1 - n) * a + n * b;

const getMousePos = (e, container) => {
  if (container) {
    const bounds = container.getBoundingClientRect();
    return {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    };
  }
  return { x: e.clientX, y: e.clientY };
};

/**
 * Crosshair cursor overlay (react-bits style).
 * Pass containerRef to scope lines to a section; defaults to window.
 */
const Crosshair = ({ color = "#ffffff", containerRef = null }) => {
  const cursorRef = useRef(null);
  const lineHorizontalRef = useRef(null);
  const lineVerticalRef = useRef(null);
  const filterXRef = useRef(null);
  const filterYRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const uid = useId().replace(/:/g, "");
  const filterIdX = `filter-noise-x-${uid}`;
  const filterIdY = `filter-noise-y-${uid}`;

  useEffect(() => {
    const lineH = lineHorizontalRef.current;
    const lineV = lineVerticalRef.current;
    if (!lineH || !lineV) return;

    let rafId = 0;
    let started = false;

    const renderedStyles = {
      tx: { previous: 0, current: 0, amt: 0.15 },
      ty: { previous: 0, current: 0, amt: 0.15 },
    };

    const handleMouseMove = (ev) => {
      const container = containerRef?.current;
      mouseRef.current = getMousePos(ev, container);

      if (container) {
        const bounds = container.getBoundingClientRect();
        const outside =
          ev.clientX < bounds.left ||
          ev.clientX > bounds.right ||
          ev.clientY < bounds.top ||
          ev.clientY > bounds.bottom;
        gsap.to([lineH, lineV], {
          opacity: outside ? 0 : 1,
          duration: 0.25,
          overwrite: true,
        });
      }
    };

    const target = containerRef?.current || window;
    // Listen on window so we get events even when children capture pointer
    const listenTarget = containerRef?.current ? window : window;
    listenTarget.addEventListener("mousemove", handleMouseMove);

    gsap.set([lineH, lineV], { opacity: 0 });

    const render = () => {
      renderedStyles.tx.current = mouseRef.current.x;
      renderedStyles.ty.current = mouseRef.current.y;

      for (const key in renderedStyles) {
        renderedStyles[key].previous = lerp(
          renderedStyles[key].previous,
          renderedStyles[key].current,
          renderedStyles[key].amt,
        );
      }

      gsap.set(lineV, { x: renderedStyles.tx.previous });
      gsap.set(lineH, { y: renderedStyles.ty.previous });

      rafId = requestAnimationFrame(render);
    };

    const onFirstMove = () => {
      if (started) return;
      started = true;
      renderedStyles.tx.previous = renderedStyles.tx.current = mouseRef.current.x;
      renderedStyles.ty.previous = renderedStyles.ty.current = mouseRef.current.y;

      gsap.to([lineH, lineV], {
        duration: 0.9,
        ease: "power3.out",
        opacity: 1,
      });

      rafId = requestAnimationFrame(render);
      listenTarget.removeEventListener("mousemove", onFirstMove);
    };

    listenTarget.addEventListener("mousemove", onFirstMove);

    const primitiveValues = { turbulence: 0 };

    const tl = gsap
      .timeline({
        paused: true,
        onStart: () => {
          lineH.style.filter = `url(#${filterIdX})`;
          lineV.style.filter = `url(#${filterIdY})`;
        },
        onUpdate: () => {
          if (filterXRef.current && filterYRef.current) {
            filterXRef.current.setAttribute("baseFrequency", String(primitiveValues.turbulence));
            filterYRef.current.setAttribute("baseFrequency", String(primitiveValues.turbulence));
          }
        },
        onComplete: () => {
          lineH.style.filter = "none";
          lineV.style.filter = "none";
        },
      })
      .to(primitiveValues, {
        duration: 0.5,
        ease: "power1",
        startAt: { turbulence: 1 },
        turbulence: 0,
      });

    const enter = () => tl.restart();
    const leave = () => {
      tl.progress(1).kill();
    };

    const root = containerRef?.current || document;
    const links = root.querySelectorAll?.("a") || [];

    links.forEach((link) => {
      link.addEventListener("mouseenter", enter);
      link.addEventListener("mouseleave", leave);
    });

    return () => {
      listenTarget.removeEventListener("mousemove", handleMouseMove);
      listenTarget.removeEventListener("mousemove", onFirstMove);
      cancelAnimationFrame(rafId);
      links.forEach((link) => {
        link.removeEventListener("mouseenter", enter);
        link.removeEventListener("mouseleave", leave);
      });
      tl.kill();
      void target;
    };
  }, [containerRef, filterIdX, filterIdY]);

  return (
    <div
      ref={cursorRef}
      className="crosshair-cursor"
      aria-hidden
      style={{
        position: containerRef ? "absolute" : "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 40,
        overflow: "hidden",
      }}
    >
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <defs>
          <filter id={filterIdX}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.000001"
              numOctaves="1"
              ref={filterXRef}
            />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
          <filter id={filterIdY}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.000001"
              numOctaves="1"
              ref={filterYRef}
            />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
        </defs>
      </svg>
      <div
        ref={lineHorizontalRef}
        style={{
          position: "absolute",
          width: "100%",
          height: "1px",
          background: color,
          pointerEvents: "none",
          transform: "translateY(50%)",
          opacity: 0,
        }}
      />
      <div
        ref={lineVerticalRef}
        style={{
          position: "absolute",
          height: "100%",
          width: "1px",
          background: color,
          pointerEvents: "none",
          transform: "translateX(50%)",
          opacity: 0,
        }}
      />
    </div>
  );
};

export default Crosshair;
