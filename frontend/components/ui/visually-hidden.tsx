import * as React from 'react'

export const VisuallyHidden = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className="absolute left-[-10000px] top-auto h-0 w-0 overflow-hidden"
    {...props}
  />
))
VisuallyHidden.displayName = 'VisuallyHidden'
