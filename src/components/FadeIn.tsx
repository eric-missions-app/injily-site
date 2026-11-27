'use client';

import { MotionConfig, motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * Entrance motion for static sections: fades and lifts its children in once, when they scroll into view.
 * The section around it stays a server component; only this wrapper ships to the client.
 *
 * The server-rendered HTML is visible, so content never depends on JavaScript. After mount, only a block that is
 * still below the screen gets hidden, ready to animate in; one the visitor can already see is left alone.
 * Not for above-the-fold content. Respects the visitor's reduced-motion setting (the lift is dropped, only the
 * fade remains).
 */
export default function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const [startedBelowScreen, setStartedBelowScreen] = useState(false);

  useEffect(() => {
    if (ref.current && ref.current.getBoundingClientRect().top >= window.innerHeight) {
      setStartedBelowScreen(true);
    }
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        ref={ref}
        className={className}
        initial={false}
        animate={startedBelowScreen && !inView ? 'hidden' : 'visible'}
        variants={{
          hidden: { opacity: 0, y: 16, transition: { duration: 0 } },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay } },
        }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
