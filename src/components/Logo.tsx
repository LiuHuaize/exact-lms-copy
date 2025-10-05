import { Clover } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-1">
      <Clover className="w-8 h-8 text-clover-green" />
      <div className="flex items-baseline">
        <span className="text-2xl font-bold tracking-tight">
          <span className="text-clover-green">C</span>
          <span className="text-clover-green">L</span>
          <span className="text-clover-green">O</span>
          <span className="text-clover-yellow">V</span>
          <span className="text-clover-orange">E</span>
          <span className="text-clover-red">R</span>
        </span>
      </div>
      <span className="text-xs text-muted-foreground ml-1">by 4-H</span>
    </div>
  );
};
