import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = ""
}: ButtonLinkProps) {
  return (
    <Link className={`button button-${variant} ${className}`} href={href}>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" size={18} />
    </Link>
  );
}
