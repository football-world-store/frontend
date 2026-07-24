import { Avatar, Badge, Button, Icon } from "@/components/atoms";
import { Card } from "@/components/molecules";
import { useLastSessionQuery } from "@/hooks/queries";
import type { AuthUser } from "@/types";
import { formatRelativeTimeBR } from "@/utils";

interface ManagerProfileCardProps {
  user: AuthUser | null;
  onChangePassword: () => void;
}

export const ManagerProfileCard = ({
  user,
  onChangePassword,
}: ManagerProfileCardProps) => {
  const { data: lastSession } = useLastSessionQuery();

  return (
    <Card tier="container-high" title="Perfil do gerenciador">
      <div className="flex flex-col items-center gap-4 text-center">
        {user ? (
          <Avatar name={user.name} className="h-20 w-20 text-2xl" />
        ) : null}
        <div>
          <p className="font-headline text-lg font-bold text-on-surface">
            {user?.name ?? "—"}
          </p>
          <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
            {user?.email}
          </p>
          <Badge tone="primary" className="mt-2">
            Acesso primário
          </Badge>
          {lastSession ? (
            <p className="mt-2 font-label text-xs text-on-surface-variant">
              Último acesso: {formatRelativeTimeBR(lastSession.createdAt)}
              {lastSession.ipAddress ? ` · IP ${lastSession.ipAddress}` : ""}
            </p>
          ) : null}
        </div>
        <Button
          variant="secondary"
          className="w-full"
          onClick={onChangePassword}
        >
          <Icon name="lock_reset" size="sm" filled={false} />
          Trocar senha
        </Button>
      </div>
    </Card>
  );
};
