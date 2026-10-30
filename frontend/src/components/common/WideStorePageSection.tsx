import type { ComponentProps } from "react";
import StorePageSection from "@/components/common/StorePageSection";
import { cn } from "@/lib/utils";

type Props = ComponentProps<typeof StorePageSection>;

export default function WideStorePageSection({ contentClassName, ...props }: Props) {
  return (
    <StorePageSection
      {...props}
      contentClassName={cn("w-[min(1600px,calc(100%_-_48px))] max-[640px]:w-[calc(100%_-_32px)]", contentClassName)}
    />
  );
}
