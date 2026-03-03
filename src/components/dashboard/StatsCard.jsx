import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatsCard({ title, value, icon: Icon, trend, trendUp, className }) {
  return (
    <Card className={cn(
      "p-6 bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {trend && (
            <p className={cn(
              "text-sm font-medium flex items-center gap-1",
              trendUp ? "text-emerald-600" : "text-rose-600"
            )}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-slate-50">
            <Icon className="w-6 h-6 text-slate-600" />
          </div>
        )}
      </div>
    </Card>
  );
}