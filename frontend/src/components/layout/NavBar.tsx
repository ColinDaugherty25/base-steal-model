import { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { Menu } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { DiamondMark } from '@/components/graphics/DiamondMark';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/predictor', label: 'Predictor' },
  { to: '/model-performance', label: 'Model Performance' },
  { to: '/about', label: 'About' },
];

function isNavItemActive(pathname: string, to: string): boolean {
  return to === '/' ? pathname === '/' : pathname.startsWith(to);
}

export function NavBar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              const isActive = isNavItemActive(location.pathname, item.to);
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

        <Popover open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Menu">
              <Menu />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-48 rounded-sm border border-border bg-popover p-1 shadow-none ring-0"
          >
            <nav className="flex flex-col">
              {NAV_ITEMS.map((item) => {
                const isActive = isNavItemActive(location.pathname, item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'rounded-sm px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-secondary text-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </PopoverContent>
        </Popover>

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
