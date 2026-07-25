import { NavLink, useLocation } from 'react-router';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { DiamondMark } from '@/components/graphics/DiamondMark';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/predictor', label: 'Predictor' },
  { to: '/model-performance', label: 'Model Performance' },
  { to: '/about', label: 'About' },
];

export function NavBar() {
  const location = useLocation();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <DiamondMark className="h-7 w-7" />
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Steal Decision Model
          </span>
        </NavLink>

        <nav className="hidden md:block">
          <AnimatedBackground
            defaultValue={location.pathname}
            enableHover={false}
            className="rounded-sm bg-secondary"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  data-id={item.to}
                  end={item.to === '/'}
                  className={cn(
                    'relative z-10 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </AnimatedBackground>
        </nav>

        <Button
          asChild
          size="sm"
          className={cn(location.pathname === '/predictor' && 'invisible pointer-events-none')}
          aria-hidden={location.pathname === '/predictor'}
        >
          <NavLink to="/predictor" tabIndex={location.pathname === '/predictor' ? -1 : 0}>
            Try it
          </NavLink>
        </Button>
      </div>
    </header>
  );
}
