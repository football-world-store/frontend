import { type HTMLAttributes } from "react";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string | null;
}

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0]?.toUpperCase() ?? "")
    .filter(Boolean)
    .slice(0, 2)
    .join("");

export const Avatar = ({ name, src, className = "", ...rest }: AvatarProps) => {
  return (
    <div
      role="img"
      aria-label={name}
      title={name}
      className={[
        "h-10 w-10 rounded-full bg-surface-container-highest text-on-surface font-label text-sm font-semibold uppercase flex items-center justify-center overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        <span aria-hidden="true">{initialsOf(name)}</span>
      )}
    </div>
  );
};
