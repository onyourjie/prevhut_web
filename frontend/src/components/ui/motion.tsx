import * as React from 'react';
import { motion, type HTMLMotionProps, type Variants } from 'motion/react';
import { cn } from '@/lib/utils';

// Premium Apple / Framer Easing Curves
export const easings = {
  easeOutQuart: [0.25, 1, 0.5, 1] as const,
  easeOutExpo: [0.16, 1, 0.3, 1] as const, // Extra smooth, used in Linear / Framer
  easeInOut: [0.65, 0, 0.35, 1] as const,
  springPop: { type: 'spring', stiffness: 400, damping: 25 } as const,
  springSmooth: { type: 'spring', stiffness: 300, damping: 30 } as const,
  springHover: { type: 'spring', stiffness: 400, damping: 30 } as const,
};

type RevealProps = HTMLMotionProps<'div'> & {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
};

// 1. Blur Reveal (for primary headings, subtitles, cards)
export const BlurReveal = ({
  children,
  delay = 0,
  duration = 0.8,
  className,
  once = true,
  ...props
}: RevealProps) => (
  <motion.div
    initial={{ opacity: 0, filter: 'blur(12px)', y: 20 }}
    whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
    viewport={{ once, margin: '-40px' }}
    transition={{ duration, delay, ease: easings.easeOutExpo }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// 2. Mask Reveal (slides up from an invisible boundary)
export const MaskReveal = ({
  children,
  delay = 0,
  duration = 0.8,
  className,
  once = true,
  ...props
}: RevealProps) => (
  <div className={cn('overflow-hidden', className)}>
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-40px' }}
      transition={{ duration, delay, ease: easings.easeOutExpo }}
      {...props}
    >
      {children}
    </motion.div>
  </div>
);

// 3. Stagger Container (for lists, feature cards, tags)
type StaggerProps = HTMLMotionProps<'div'> & {
  delayChildren?: number;
  staggerChildren?: number;
  once?: boolean;
};

export const StaggerContainer = ({
  children,
  delayChildren = 0,
  staggerChildren = 0.1,
  className,
  once = true,
  ...props
}: StaggerProps) => {
  const variants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-40px' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// 4. Stagger Item (used inside StaggerContainer)
export const StaggerItem = ({ children, className, ...props }: HTMLMotionProps<'div'>) => {
  const variants: Variants = {
    hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: easings.easeOutExpo },
    },
  };

  return (
    <motion.div variants={variants} className={className} {...props}>
      {children}
    </motion.div>
  );
};

// 5. Pop Reveal (for badges and icons)
export const PopReveal = ({
  children,
  delay = 0,
  className,
  once = true,
  ...props
}: RevealProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
    viewport={{ once }}
    transition={{ delay, ...easings.springPop }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// 6. Stagger Text Container (orchestrates word-by-word reveal)
export const StaggerTextContainer = ({
  children,
  delayChildren = 0,
  staggerChildren = 0.04,
  className,
  once = true,
  ...props
}: StaggerProps) => {
  const variants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-40px' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// 7. Stagger Text Item (individual words/characters)
export const StaggerTextItem = ({
  children,
  className,
  ...props
}: HTMLMotionProps<'span'>) => {
  const variants: Variants = {
    hidden: { opacity: 0, y: 14, filter: 'blur(10px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.65, ease: easings.easeOutExpo },
    },
  };

  return (
    <motion.span variants={variants} className={cn('inline-block', className)} {...props}>
      {children}
    </motion.span>
  );
};

// 8. SplitText Helper (splits words and wraps them in animated span)
export const SplitText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <>
      {text.split(' ').map((word, i, arr) => (
        <React.Fragment key={i}>
          <StaggerTextItem className={className}>{word}</StaggerTextItem>
          {i < arr.length - 1 && <span>&nbsp;</span>}
        </React.Fragment>
      ))}
    </>
  );
};
