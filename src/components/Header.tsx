import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { name: "首页", path: "/" },
    { name: "课程活动", path: "/activities" },
    { name: "排行榜", path: "/leaderboard" },
    { name: "学习进度", path: "/progress" },
    { name: "活动日程", path: "/events" },
    { name: "学习资源", path: "/resources" },
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
          
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={isActive(item.path) ? "bg-primary text-primary-foreground" : ""}
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="bg-clover-teal text-white px-3 py-1 rounded-full text-sm font-semibold">
              等级 2
            </div>
            <Avatar>
              <AvatarFallback className="bg-clover-orange text-white">H</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
