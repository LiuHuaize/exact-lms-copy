import { Card, CardContent } from "./ui/card";

interface ActivityCardProps {
  title: string;
  subtitle?: string;
  image: string;
  onClick?: () => void;
}

export const ActivityCard = ({ title, subtitle, image, onClick }: ActivityCardProps) => {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};
