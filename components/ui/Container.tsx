import type { ElementType, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

export function Container({ children, as: Tag = "div", className = "" }: ContainerProps) {
  return (
    <Tag className={`mx-auto w-full max-w-[1470px] px-6 sm:px-10 lg:px-[70px] ${className}`}>
      {children}
    </Tag>
  );
}
