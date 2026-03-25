import { cn } from '../ui/utils';

const variants = {
  light: 'bg-white border border-slate-200 text-slate-900',
  muted: 'bg-slate-50 border border-slate-100 text-slate-900',
  dark: 'bg-card border border-white/10 text-card-foreground',
};

const paddings = {
  none: '',
  sm: 'p-4',
  default: 'p-6',
  lg: 'p-8',
};

export interface SurfaceCardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: keyof typeof variants;
  padding?: keyof typeof paddings;
  as?: 'div' | 'article' | 'section';
}

export function SurfaceCard({
  variant = 'light',
  padding = 'default',
  as: Component = 'div',
  className,
  children,
  ...props
}: SurfaceCardProps) {
  return (
    <Component
      className={cn('rounded-2xl', variants[variant], paddings[padding], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
