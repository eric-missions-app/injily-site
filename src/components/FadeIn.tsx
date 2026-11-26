'use client';

import { MotionConfig, motion } from 'framer-motion';

/**
 * Entrance motion for static sections: fades and lifts its children in once, when they scroll into view.
 * The section around it stays a server component; only this wrapper ships to the client.
 * Respects the visitor's reduced-motion setting (the lift is dropped, only the fade remains).
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
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.5, ease: 'easeOut', delay }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
