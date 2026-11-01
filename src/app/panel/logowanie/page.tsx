import { redirect } from "next/navigation";
import { LoginForm } from "@/components/panel/LoginForm";
import { hasPanelSession, isAuthConfigured } from "@/lib/panel/auth";

export default async function PanelLoginPage() {
  if (await hasPanelSession()) {
    redirect("/panel/rolki");
  }

  return (
    <section className="section panel-narrow">
      <p className="eyebrow">Panel właściciela</p>
      <h1>Logowanie</h1>
      {isAuthConfigured() ? (
        <div className="form-panel">
          <LoginForm />
        </div>
      ) : (
        <p className="form-status error">
          Panel nie jest jeszcze skonfigurowany. Ustaw zmienne PANEL_PASSWORD_HASH,
          PANEL_TOTP_SECRET i PANEL_SESSION_SECRET (instrukcja w docs/panel-rolki.md).
        </p>
      )}
    </section>
  );
}
