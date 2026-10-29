import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  annotation?: string;
  align?: "left" | "center";
  containerClassName?: string;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      containerClassName,
      eyebrow,
      title,
      subtitle,
      annotation,
      align = "left",
      children,
      ...props
    },
    ref,
  ) => {
    const isCenter = align === "center";

    return (
      <section
        ref={ref}
        className={cn("py-20 md:py-28 relative overflow-hidden", className)}
        {...props}
      >
        <div className={cn("container mx-auto px-4 sm:px-6", containerClassName)}>
          {(eyebrow || title || subtitle) && (
            <div
              className={cn(
                "mb-12 md:mb-16 relative",
                isCenter ? "text-center max-w-2xl mx-auto" : "max-w-3xl",
              )}
            >
              {eyebrow && (
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary/80">
                    {eyebrow}
                  </span>
                </div>
              )}

              <h2 className="font-serif-display text-fluid-h1 font-bold text-foreground tracking-tight leading-[1.12]">
                {title}
              </h2>

              {subtitle && (
                <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                  {subtitle}
                </p>
              )}

              {annotation && (
                <div
                  className={cn(
                    "mt-3",
                    isCenter ? "flex justify-center" : "inline-block",
                  )}
                >
                  <span className="handwritten-note text-lg md:text-xl text-primary font-handwriting">
                    {annotation}
                  </span>
                </div>
              )}
            </div>
          )}

          {children}
        </div>
      </section>
    );
  },
);

Section.displayName = "Section";

export default Section;
