import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  color?: "indigo" | "purple" | "green" | "blue" | "orange" | "red";
}

const colorMap = {
  indigo: "from-indigo-500 to-indigo-600 text-indigo-600 bg-indigo-50",
  purple: "from-purple-500 to-purple-600 text-purple-600 bg-purple-50",
  green: "from-green-500 to-green-600 text-green-600 bg-green-50",
  blue: "from-blue-500 to-blue-600 text-blue-600 bg-blue-50",
  orange: "from-orange-500 to-orange-600 text-orange-600 bg-orange-50",
  red: "from-red-500 to-red-600 text-red-600 bg-red-50",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "indigo",
}: StatCardProps) {
  const colors = colorMap[color].split(" ");
  const gradient = colors.slice(0, 2).join(" ");
  const textColor = colors[2];
  const bgColor = colors[3];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <span
              className={cn(
                "inline-flex items-center text-xs font-medium mt-2 px-2 py-0.5 rounded-full",
                trend.positive
                  ? "text-green-700 bg-green-50"
                  : "text-red-700 bg-red-50"
              )}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </span>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
            bgColor
          )}
        >
          <Icon className={cn("w-6 h-6", textColor)} />
        </div>
      </div>
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}

const badgeVariants = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-green-50 text-green-700",
  warning: "bg-yellow-50 text-yellow-700",
  error: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Card({ children, className, title, subtitle, action }: CardProps) {
  return (
    <div className={cn("bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div>
            {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const buttonVariants = {
  primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-sm",
  secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  outline: "border border-gray-200 text-gray-700 hover:bg-gray-50",
  ghost: "text-gray-600 hover:bg-gray-100",
  danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export function Table({ headers, children, className }: TableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">{children}</tbody>
      </table>
    </div>
  );
}

export function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <tr className={cn("hover:bg-gray-50/50 transition-colors", className)}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={cn("px-4 py-3 text-gray-700", className)}>{children}</td>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon: Icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search..."}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
      />
    </div>
  );
}
