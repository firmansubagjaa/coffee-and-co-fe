import * as React from "react"
import { cn } from "../../utils/cn"
import { motion, HTMLMotionProps } from "framer-motion"

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string; onValueChange?: (value: string) => void }
>(({ className, defaultValue, onValueChange, children, ...props }, ref) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    onValueChange?.(value)
  }

  // Pass state down to children via cloneElement
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      // @ts-ignore
      return React.cloneElement(child, { activeTab, onTabChange: handleTabChange })
    }
    return child
  })

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {childrenWithProps}
    </div>
  )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-xl bg-coffee-50 p-1 text-coffee-500",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string; activeTab?: string; onTabChange?: (value: string) => void }
>(({ className, value, activeTab, onTabChange, children, ...props }, ref) => {
  const isActive = activeTab === value

  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isActive}
      onClick={() => onTabChange?.(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2.5 text-sm font-bold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative z-10",
        isActive ? "text-coffee-900 shadow-sm" : "hover:text-coffee-900 hover:bg-white/50",
        className
      )}
      {...props}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-white rounded-lg -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      {children}
    </button>
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div"> & { value: string; activeTab?: string }
>(({ className, value, activeTab, children, ...props }, ref) => {
  if (value !== activeTab) return null

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "mt-6 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee-400 focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }