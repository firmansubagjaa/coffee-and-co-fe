import React from "react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-coffee-900 group-[.toaster]:border-coffee-100 group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl group-[.toaster]:font-sans",
          description: "group-[.toast]:text-coffee-500",
          actionButton:
            "group-[.toast]:bg-coffee-900 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-coffee-100 group-[.toast]:text-coffee-600",
          error: "group-[.toaster]:text-red-600 group-[.toaster]:border-red-100",
          success: "group-[.toaster]:text-green-700 group-[.toaster]:border-green-100",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }