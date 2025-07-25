import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import clsx from "clsx";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2",
  {
    variants: {
      variant: {
        default: "",
        outline: "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={clsx(buttonVariants({ variant }), className)}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
