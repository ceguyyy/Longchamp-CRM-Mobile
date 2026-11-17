import { useState } from "react";
import { Button, Checkbox, Input, Label, TextField } from "@heroui/react";
import { useApp, FullBody, Wordmark } from "../core";
import { USERS } from "../data";

function Brand({ light }) {
  return (
    <div className="relative flex flex-col items-center">
      <span className={light ? "[&_*]:!text-[var(--lc-lime)]" : ""}>
        <Wordmark light={light} size={24} />
      </span>
      <span className={`script -mt-1 text-[46px] leading-none ${light ? "text-[var(--lc-lime)]" : "text-black"}`} style={{ transform: "rotate(-4deg)" }}>
        Clienteling
      </span>
    </div>
  );
}

function Field({ label, type = "text", placeholder, defaultValue, desc }) {
  return (
    <TextField className="flex flex-col gap-1" defaultValue={defaultValue} type={type}>
      <Label className="caps text-[9.5px] font-semibold text-[var(--lc-muted)]">{label}</Label>
      <Input placeholder={placeholder} className="h-10 border-0 border-b border-[#bdbdbd] bg-transparent px-0 text-[14px] outline-none focus:border-black" />
      {desc && <span className="text-[11px] text-[var(--lc-muted)]">{desc}</span>}
    </TextField>
  );
}

const ROLE_DEMO = [
  { role: "sales_agent", label: "Sales Agent" },
  { role: "supervisor", label: "Supervisor" },
  { role: "super_admin", label: "Super Admin" },
];

/* Error responses of POST /v1/auth/login (A-01), as the app shows them */
const LOGIN_ERRORS = [
  { code: "invalid_credentials", status: 401, label: ["Wrong password", "Password salah"], msg: ["Wrong email or password. 3 attempts left.", "Email atau password salah. Sisa 3 percobaan."] },
  { code: "account_locked", status: 423, label: ["Locked", "Dikunci"], msg: ["Too many attempts. Try again in 15 minutes.", "Terlalu banyak percobaan. Coba lagi dalam 15 menit."] },
  { code: "role_not_allowed", status: 403, label: ["No access", "Tanpa akses"], msg: ["This account has no access to the clienteling app. Contact your Super Admin.", "Akun ini tidak punya akses ke app clienteling. Hubungi Super Admin."] },
  { code: "account_inactive", status: 403, label: ["Inactive", "Nonaktif"], msg: ["This account is deactivated. Contact your Super Admin.", "Akun dinonaktifkan. Hubungi Super Admin."] },
];

export function Login({ demoRole }) {
  const { tx, setSession, reset, notify } = useApp();
  const [role, setRole] = useState(demoRole || "sales_agent");
  const [fail, setFail] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const signIn = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      if (fail) return setError(fail);
      setSession({ role, user: USERS[role] });
      notify(tx(`Signed in as ${ROLE_DEMO.find((r) => r.role === role).label}`, `Masuk sebagai ${ROLE_DEMO.find((r) => r.role === role).label}`));
      reset("home");
    }, 500);
  };

  return (
    <FullBody className="bg-[var(--lc-olive)]">
      <div className="flex h-full flex-col px-6 pb-10 pt-20">
        <Brand light />
        <div className="mt-9 flex flex-col gap-4 bg-white p-5">
          <div>
            <p className="text-[15px] font-bold uppercase tracking-[0.12em]">{tx("Sign in", "Masuk")}</p>
            <p className="text-[12.5px] text-[var(--lc-muted)]">{tx("Sign in with your Cekat CRM account.", "Masuk dengan akun Cekat CRM Anda.")}</p>
          </div>
          <Field label="Email" type="email" defaultValue={USERS[role].email} />
          <Field label={tx("Password", "Password")} type="password" defaultValue="••••••••••" />
          {error && (
            <div role="alert" className="border-l-2 border-[#c0392b] bg-[#fbebeb] px-3 py-2 text-[12px] leading-snug text-[#7a1f16]">
              {tx(error.msg[0], error.msg[1])}
              <span className="mt-0.5 block font-mono text-[10px] text-[#a0443a]">{error.status} {error.code}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Checkbox defaultSelected className="!flex !flex-row items-center gap-2">
              <Checkbox.Control className="h-4 w-4 rounded border border-[var(--lc-line)] data-[selected=true]:bg-[var(--lc-forest)]">
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>
                <Label className="text-[12px]">{tx("Remember me", "Ingat saya")}</Label>
              </Checkbox.Content>
            </Checkbox>

          </div>
          <Button fullWidth onPress={signIn} isDisabled={loading} className="h-12 bg-black text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white">
            {loading ? tx("Signing in…", "Masuk…") : tx("Sign in", "Masuk")}
          </Button>
          <div className="border border-[var(--lc-line)] p-2.5">
            <p className="mb-1.5 text-center text-[10px] text-[var(--lc-muted)]">{tx("Demo: sign in as", "Demo: masuk sebagai")}</p>
            <div className="grid grid-cols-3 gap-1">
              {ROLE_DEMO.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    setRole(r.role);
                    setFail(null);
                    setError(null);
                  }}
                  className={`py-1.5 text-[10.5px] font-semibold ${role === r.role && !fail ? "bg-black text-white" : "text-[var(--lc-muted)]"}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <p className="mb-1 mt-2 text-center text-[10px] text-[var(--lc-muted)]">{tx("or simulate an error", "atau simulasikan error")}</p>
            <div className="grid grid-cols-4 gap-1">
              {LOGIN_ERRORS.map((e) => (
                <button
                  key={e.code}
                  onClick={() => {
                    setFail(fail?.code === e.code ? null : e);
                    setError(null);
                  }}
                  className={`py-1.5 text-[9.5px] font-semibold ${fail?.code === e.code ? "bg-[#c0392b] text-white" : "text-[var(--lc-muted)]"}`}
                >
                  {tx(e.label[0], e.label[1])}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-[12px] leading-snug text-white/75">
          {tx("No account or forgot your password? Ask your Super Admin: accounts and passwords are managed in Cekat CRM.", "Belum punya akun atau lupa password? Hubungi Super Admin: akun dan password dikelola di Cekat CRM.")}
        </p>
        <p className="mt-auto text-center text-[10px] text-white/45">{tx("Role and access are managed in Cekat CRM.", "Role dan akses dikelola di Cekat CRM.")}</p>
      </div>
    </FullBody>
  );
}

