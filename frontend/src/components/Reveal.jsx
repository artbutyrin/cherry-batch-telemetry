import { useEffect, useRef, useState } from "react";

/** Once-on-view reveal wrapper (Lumora-style slide-up). */
export function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal${on ? " is-in" : ""} ${className}`.trim()}
      style={{ "--rd": `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/** Clip line-reveal for a single line of text. */
export function RevealLine({ children, delay = 0, className = "" }) {
  return (
    <span className={`reveal-line ${className}`.trim()} style={{ "--rd": `${delay}ms` }}>
      <Reveal as="span" className="reveal-line-inner" delay={delay}>
        {children}
      </Reveal>
    </span>
  );
}
