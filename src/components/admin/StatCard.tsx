import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  color?: "primary" | "secondary" | "accent" | "orange";
}

export const StatCard = ({
  title,
  value,
  description,
  color = "primary",
}: StatCardProps) => {
  const colorClass = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    orange: "text-orange-600",
  }[color];

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
        <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
      </CardContent>
    </Card>
  );
};
