import Image from "next/image";

type LogoSize = "sm" | "md" | "lg" | "xl";
type LogoVariant = "full" | "compact";

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  className?: string;
}

const SIZE_DIMENSIONS: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 96, height: 96 },
  md: { width: 144, height: 144 },
  lg: { width: 192, height: 192 },
  xl: { width: 256, height: 256 },
};

export const Logo = ({
  size = "md",
  variant = "full",
  className = "",
}: LogoProps) => {
  const { width, height } = SIZE_DIMENSIONS[size];
  const src =
    variant === "compact" ? "/brand/logo-compact.png" : "/brand/logo.png";
  return (
    <Image
      src={src}
      alt="Football World Store"
      width={width}
      height={height}
      priority
      className={["object-contain", className].filter(Boolean).join(" ")}
    />
  );
};
