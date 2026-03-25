import { Link } from 'react-router';
import { cn } from '../ui/utils';

const variants = {
  onDark:
    'border border-white/20 text-white/90 hover:bg-white/5 active:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]',
  onLight:
    'border border-slate-300 text-slate-800 hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
};

const roundedMap = {
  full: 'rounded-full',
  xl: 'rounded-xl',
  lg: 'rounded-lg',
};

export type SecondaryButtonVariant = keyof typeof variants;

type BaseProps = {
  variant?: SecondaryButtonVariant;
  rounded?: keyof typeof roundedMap;
  className?: string;
  children: React.ReactNode;
};

type SecondaryButtonAsLink = BaseProps & {
  to: string;
} & Omit<React.ComponentProps<typeof Link>, 'className' | 'children' | 'to'>;

type SecondaryButtonAsButton = BaseProps & {
  to?: undefined;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export type SecondaryButtonProps = SecondaryButtonAsLink | SecondaryButtonAsButton;

export function SecondaryButton(props: SecondaryButtonProps) {
  const {
    variant = 'onDark',
    rounded = 'xl',
    className,
    children,
    to,
    ...rest
  } = props;

  const base = cn(
    'inline-flex items-center justify-center gap-2 font-semibold text-sm transition-all disabled:opacity-50 disabled:pointer-events-none px-5 py-2.5',
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
