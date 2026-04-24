import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  className?: string
  trend?: string
}

export function StatsCard({ title, value, description, icon, className, trend }: StatsCardProps) {
  return (
    <div className={cn(
      "rounded-2xl border border-gray-200 bg-white p-6 hover:border-gray-300 transition-all group shadow-sm",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
            {trend && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">{trend}</span>}
          </div>
          {description && (
            <p className="text-xs text-gray-500 font-medium pt-1">{description}</p>
          )}
        </div>
        {icon && (
          <div className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 group-hover:text-blue-600 group-hover:scale-110 transition-all shadow-sm">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}


