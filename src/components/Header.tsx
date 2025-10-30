import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { name: "首页", path: "/" },
    { name: "课程活动", path: "/activities" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <nav className="hidden lg:flex flex-1 justify-center gap-8">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={`relative px-5 py-2 text-base font-semibold transition-colors ${
                    active
                      ? "text-primary after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-1 after:w-full after:max-w-[3rem] after:rounded-full after:bg-primary after:content-['']"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  {item.name}
                </Button>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:block bg-clover-teal text-white px-3 py-1 rounded-full text-sm font-semibold">
              等级 2
            </div>
            <Avatar>
              <AvatarFallback className="bg-clover-orange text-white">C</AvatarFallback>
            </Avatar>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">打开菜单</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs p-0">
                <div className="px-6 pt-6 pb-4 border-b border-border/60">
                  <Logo />
                </div>
                <div className="px-6 py-4 border-b border-border/60">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-clover-orange text-white">C</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Clover 学员</p>
                      <p className="text-xs text-muted-foreground">等级 2 · Clover Member</p>
                    </div>
                  </div>
                </div>
                <nav className="px-6 py-6 flex flex-col gap-2">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.path}>
                      <Button
                        variant={isActive(item.path) ? "default" : "ghost"}
                        className={`w-full justify-between ${
                          isActive(item.path)
                            ? "bg-primary text-primary-foreground shadow"
                            : "bg-transparent hover:bg-muted"
                        }`}
                        onClick={() => navigate(item.path)}
                      >
                        <span>{item.name}</span>
                        {isActive(item.path) && <span className="text-xs">当前</span>}
                      </Button>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
