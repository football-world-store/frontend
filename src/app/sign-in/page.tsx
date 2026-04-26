import { LoginForm } from "@/components/organisms";
import { AuthLayout } from "@/components/templates";

const SignInPage = () => {
  return (
    <AuthLayout
      title={
        <>
          Portal de <span className="text-primary italic">Acesso Rápido</span>
        </>
      }
      description="Faça login para acessar o sistema de inventário."
      side={
        <p className="font-label text-on-surface-variant text-xs uppercase tracking-widest">
          Elite Performance Tier
        </p>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default SignInPage;
