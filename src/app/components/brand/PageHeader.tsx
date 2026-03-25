import { cn } from '../ui/utils';

export interface PageHeaderProps {
  /** Pass through to the heading for `aria-labelledby` on the parent section */
  titleId: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  /** Default: marketing hero. Large: bigger clamp (e.g. About). */
  size?: 'default' | 'large';
  /** Dark: text on slate-900. Light: text on white/slate-50. */
  tone?: 'dark' | 'light';
  heading?: 'h1' | 'h2';
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const toneStyles = {
  dark: {
    eyebrow: 'text-orange-400',
    title: 'text-white',
    subtitle: 'text-slate-400',
  },
  light: {
    eyebrow: 'text-orange-500',
    title: 'text-slate-900',
    subtitle: 'text-slate-500',
  },
};

export function PageHeader({
  titleId,
  eyebrow,
  title,
  subtitle,
  align = 'center',
  size = 'default',
  tone = 'dark',
  heading: HeadingTag = 'h1',
  className,
  eyebrowClassName,
  titleClassName,
  subtitleClassName,
}: PageHeaderProps) {
  const t = toneStyles[tone];

  return (
    <div
      className={cn(
        'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        align === 'center' && 'text-center',
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'text-sm mb-2 font-semibold uppercase tracking-wider',
            t.eyebrow,
            eyebrowClassName,
          )}
        >
          {eyebrow}
        </p>
      )}
      <HeadingTag
        id={titleId}
        className={cn(
          'mb-3 font-extrabold tracking-tight',
          size === 'large'
            ? 'text-[clamp(2rem,5vw,3.5rem)]'
            : 'text-[clamp(2rem,5vw,3rem)]',
          t.title,
          titleClassName,
        )}
      >
        {title}
      </HeadingTag>
      {subtitle && (
        <p
          className={cn(
            'mb-8 max-w-xl',
            align === 'center' && 'mx-auto',
            align === 'left' && 'mx-0',
            size === 'large' && 'max-w-2xl text-lg leading-relaxed',
            t.subtitle,
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
