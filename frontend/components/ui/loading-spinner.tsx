import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function LoadingSpinner({ size = "md", text = "Gegevens laden...", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      {text && <p className="mt-4 text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" />
    </div>
  )
}

export function TableLoader() {
  return (
    <div className="rounded-md border shadow-sm">
      <div className="flex items-center justify-center min-h-[300px]">
        <LoadingSpinner />
      </div>
    </div>
  )
}

export function CardLoader() {
  return (
    <div className="rounded-md border shadow-sm bg-card">
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    </div>
  )
}
