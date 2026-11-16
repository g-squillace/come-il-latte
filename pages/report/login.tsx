import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import type { FormEvent } from "react";
import type { GetServerSideProps } from "next";
import { REPORT } from "lib/report/config.ts";
import { isAuthenticated } from "lib/report/auth.ts";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Vary", "Cookie");
  if (await isAuthenticated(req)) {
    return { redirect: { destination: "/report", permanent: false } };
  }
  return { props: {} };
};

export default function ReportLogin() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSending(true);
    setError(null);
    try {
      const response = await fetch("/api/report/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null);
        const message =
          typeof payload === "object" && payload !== null ? Reflect.get(payload, "error") : null;
        setError(typeof message === "string" ? message : "Accesso non riuscito");
        setSending(false);
        return;
      }
      await router.replace("/report");
    } catch {
      setError("Accesso non riuscito: riprova fra poco.");
      setSending(false);
    }
  }

  return (
    <>
      <Head>
        <title>{`Andamento del sito — ${REPORT.siteName}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">Andamento del sito</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          Pagina privata di {REPORT.siteName}. Serve l&apos;accesso che ti ho mandato per email.
        </p>
        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="user" className="text-sm font-medium text-slate-900">
              Utente
            </label>
            <input
              id="user"
              name="user"
              autoComplete="username"
              required
              value={user}
              onChange={(event) => setUser(event.target.value)}
              className="min-h-[44px] rounded-md border border-slate-400 px-3 text-slate-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-slate-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-[44px] rounded-md border border-slate-400 px-3 text-slate-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            />
          </div>
          {error !== null && (
            <p role="alert" className="text-sm font-medium text-red-800">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={sending}
            className="min-h-[44px] rounded-md bg-slate-900 px-4 font-medium text-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-70"
          >
            {sending ? "Un attimo…" : "Entra"}
          </button>
        </form>
      </main>
    </>
  );
}
