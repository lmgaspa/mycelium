import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { storePageSectionSpacing, storePageShell } from "@/components/common/storePageStyles";

type Props = ComponentProps<"section"> & { contentClassName?: string };

export default function StorePageSection({ children, className, contentClassName, ...props }: Props) {
  return (
    <section {...props} className={cn(storePageSectionSpacing, className)}>
      <div className={cn(storePageShell, contentClassName)}>{children}</div>
    </section>
  );
}
