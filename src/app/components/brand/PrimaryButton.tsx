import { Link } from 'react-router';
import { cn } from '../ui/utils';

const variants = {
  /** Brand CTA: lime #C8F400, black text, bold — matches marketing “Try for free” reference */
  brand:
    'bg-primary text-black font-bold hover:opacity-90 active:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]',
  marketing:
    'bg-orange-800 text-white font-semibold hover:bg-orange-900 active:bg-orange-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
  dark:
    'bg-slate-900 text-white font-semibold hover:bg-slate-800 active:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50',
};

const roundedMap = {
  full: 'rounded-full',
  xl: 'rounded-xl',
  lg: 'rounded-lg',
};

export type PrimaryButtonVariant = keyof typeof variants;

type BaseProps = {
  variant?: PrimaryButtonVariant;
  rounded?: keyof typeof roundedMap;
  className?: string;
  children: React.ReactNode;
};

type PrimaryButtonAsLink = BaseProps & {
  to: string;
} & Omit<React.ComponentProps<typeof Link>, 'className' | 'children' | 'to'>;

type PrimaryButtonAsButton = BaseProps & {
  to?: undefined;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export type PrimaryButtonProps = PrimaryButtonAsLink | PrimaryButtonAsButton;

export function PrimaryButton(props: PrimaryButtonProps) {
  const {
    variant = 'brand',
    rounded = 'full',
    className,
    children,
    to,
    ...rest
  } = props;

  const base = cn(
    'inline-flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-50 disabled:pointer-events-none px-5 py-2.5',
    roundedMap[rounded],
    variants[variant],
    className,
  );

  if (to) {
    return (
      <Link to={to} className={base} {...(rest as Omit<React.ComponentProps<typeof Link>, 'to' | 'className' | 'children'>)}>
        {children}
      </Link>
    );
  }

  const btn = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  const { type = 'button', ...buttonProps } = btn;

  return (
    <button type={type} className={base} {...buttonProps}>
      {children}
    </button>
  );
}
