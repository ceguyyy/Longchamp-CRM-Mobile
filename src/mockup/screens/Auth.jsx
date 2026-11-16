import { useState } from "react";
import { Button, Checkbox, Input, Label, TextField } from "@heroui/react";
import { useApp, FullBody } from "../core";
import { USERS } from "../data";

function Brand({ light }) {
  return (
    <div className="text-center">
      <p className={`font-display text-[34px] tracking-[0.32em] ${light ? "text-[var(--lc-lime)]" : "text-[var(--lc-forest)]"}`}>LONGCHAMP</p>
      <p className={`mt-1 text-[10px] tracking-[0.5em] ${light ? "text-white/60" : "text-[var(--lc-muted)]"}`}>PARIS · CLIENTELING</p>
    </div>
  );
}

function Field({ label, type = "text", placeholder, defaultValue, desc }) {
  return (
    <TextField className="flex flex-col gap-1" defaultValue={defaultValue} type={type}>
      <Label className="text-[12px] font-medium text-[var(--lc-ink)]">{label}</Label>
      <Input placeholder={placeholder} className="h-11 rounded-xl border border-[var(--lc-line)] bg-white px-3 text-[14px]" />
      {desc && <span className="text-[11px] text-[var(--lc-muted)]">{desc}</span>}
    </TextField>
  );
}

const ROLE_DEMO = [
  { role: "sales_agent", label: "Sales Agent" },
  { role: "supervisor", label: "Supervisor" },
  { role: "super_admin", label: "Super Admin" },
];

export function Login({ demoRole }) {
  const { tx, setSession, reset, nav } = useApp();
  const [role, setRole] = useState(demoRole || "sales_agent");
  const [loading, setLoading] = useState(false);

  const signIn = () => {
    setLoading(true);
    setTimeout(() => {
      setSession({ role, user: USERS[role] });
      reset("home");
    }, 500);
  };

  return (
    <FullBody className="bg-[var(--lc-forest)]">
      <div className="flex h-full flex-col px-7 pb-10 pt-24">
        <Brand light />
        <div className="mt-12 flex flex-col gap-4 rounded-[28px] bg-[var(--lc-cream)] p-5">
          <div>
            <p className="font-display text-[26px] font-semibold text-[var(--lc-forest)]">{tx("Welcome back", "Selamat datang")}</p>
            <p className="text-[12.5px] text-[var(--lc-muted)]">{tx("Sign in with your Cekat CRM account.", "Masuk dengan akun Cekat CRM Anda.")}</p>
          </div>
          <Field label="Email" type="email" defaultValue={USERS[role].email} />
          <Field label={tx("Password", "Password")} type="password" defaultValue="••••••••••" />
          <div className="flex items-center justify-between">
            <Checkbox defaultSelected className="!flex !flex-row items-center gap-2">
              <Checkbox.Control className="h-4 w-4 rounded border border-[var(--lc-line)] data-[selected=true]:bg-[var(--lc-forest)]">
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>
                <Label className="text-[12px]">{tx("Remember me", "Ingat saya")}</Label>
              </Checkbox.Content>
            </Checkbox>
            <button className="text-[12px] font-semibold text-[var(--lc-forest)] underline" onClick={() => nav("forgot")}>
              {tx("Forgot password?", "Lupa password?")}
            </button>
          </div>
          <Button fullWidth onPress={signIn} isDisabled={loading} className="h-12 rounded-xl bg-[var(--lc-forest)] text-white">
            {loading ? tx("Signing in…", "Masuk…") : tx("Sign in", "Masuk")}
          </Button>
          <div className="rounded-xl bg-white p-2.5">
            <p className="mb-1.5 text-center text-[10px] uppercase tracking-wider text-[var(--lc-muted)]">{tx("Demo account role", "Role akun demo")}</p>
            <div className="grid grid-cols-3 gap-1">
              {ROLE_DEMO.map((r) => (
                <button
                  key={r.role}
                  onClick={() => setRole(r.role)}
                  className={`rounded-lg py-1.5 text-[11px] font-semibold ${role === r.role ? "bg-[var(--lc-lime)] text-[var(--lc-forest)]" : "text-[var(--lc-muted)]"}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-[13px] text-white/75">
          {tx("New staff?", "Staf baru?")}{" "}
          <button className="font-semibold text-[var(--lc-lime)] underline" onClick={() => nav("register")}>
            {tx("Activate your account", "Aktivasi akun")}
          </button>
        </p>
        <p className="mt-auto text-center text-[10px] text-white/40">{tx("Secured by Cekat · role & access managed in Cekat CRM", "Diamankan Cekat · role & akses dikelola di Cekat CRM")}</p>
      </div>
    </FullBody>
  );
}

export function Register() {
  const { tx, back, setSession, reset } = useApp();
  const [step, setStep] = useState(1);

  const steps = [tx("Invitation", "Undangan"), tx("Password", "Password"), tx("Done", "Selesai")];

  return (
    <FullBody>
      <div className="flex min-h-full flex-col px-6 pb-10 pt-14">
        <button onClick={step === 1 ? back : () => setStep(step - 1)} className="-ml-2 grid h-9 w-9 place-items-center rounded-full hover:bg-black/5" aria-label="Back">
          <svg width="10" height="16" viewBox="0 0 10 16"><path d="M8 1 L2 8 L8 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <p className="font-display mt-2 text-[30px] font-semibold leading-tight text-[var(--lc-forest)]">{tx("Activate your account", "Aktivasi akun Anda")}</p>
        <p className="mt-1 text-[13px] text-[var(--lc-muted)]">
          {tx("Accounts are created by your Super Admin in Cekat CRM. Use the invitation sent to your work email.", "Akun dibuat oleh Super Admin di Cekat CRM. Gunakan undangan yang dikirim ke email kerja Anda.")}
        </p>

        <div className="mt-6 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 flex-col gap-1">
              <div className={`h-1.5 rounded-full ${i < step ? "bg-[var(--lc-forest)]" : "bg-[var(--lc-line)]"}`} />
              <span className={`text-[10.5px] ${i < step ? "font-semibold text-[var(--lc-forest)]" : "text-[var(--lc-muted)]"}`}>{s}</span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="mt-6 flex flex-col gap-4">
            <Field label={tx("Work email", "Email kerja")} type="email" defaultValue="maya@longchamp.co.id" />
            <Field label={tx("Invitation code", "Kode undangan")} defaultValue="LC-7Q4K-29" desc={tx("6–10 characters, from the invitation email", "6–10 karakter, dari email undangan")} />
            <div className="rounded-2xl border border-[var(--lc-line)] bg-white p-4">
              <p className="text-[11px] uppercase tracking-wider text-[var(--lc-muted)]">{tx("Invitation found", "Undangan ditemukan")}</p>
              <p className="mt-1 text-[15px] font-semibold">Maya Lestari</p>
              <p className="text-[12.5px] text-[var(--lc-muted)]">Sales Agent · Plaza Indonesia</p>
              <p className="mt-2 text-[11.5px] text-[var(--lc-muted)]">{tx("Reports to Rina Wijaya (Supervisor)", "Lapor ke Rina Wijaya (Supervisor)")}</p>
            </div>
            <Button fullWidth className="h-12 rounded-xl bg-[var(--lc-forest)] text-white" onPress={() => setStep(2)}>
              {tx("Continue", "Lanjut")}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 flex flex-col gap-4">
            <Field label={tx("New password", "Password baru")} type="password" defaultValue="••••••••••••" />
            <ul className="grid grid-cols-2 gap-1 text-[11.5px] text-[var(--lc-forest)]">
              {[tx("12+ characters", "12+ karakter"), tx("Upper & lower case", "Huruf besar & kecil"), tx("A number", "Angka"), tx("A symbol", "Simbol")].map((r) => (
                <li key={r} className="flex items-center gap-1.5">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-[var(--lc-lime)] text-[9px] text-[var(--lc-forest)]">✓</span>
                  {r}
                </li>
              ))}
            </ul>
            <Field label={tx("Confirm password", "Konfirmasi password")} type="password" defaultValue="••••••••••••" />
            <Checkbox defaultSelected className="!flex !flex-row items-start gap-2">
              <Checkbox.Control className="mt-0.5 h-4 w-4 shrink-0 rounded border border-[var(--lc-line)] data-[selected=true]:bg-[var(--lc-forest)]">
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>
                <Label className="text-[12px] leading-snug">
                  {tx("I will only record client data that helps personalise the experience (UU PDP).", "Saya hanya mencatat data klien yang membantu personalisasi (UU PDP).")}
                </Label>
              </Checkbox.Content>
            </Checkbox>
            <Button fullWidth className="h-12 rounded-xl bg-[var(--lc-forest)] text-white" onPress={() => setStep(3)}>
              {tx("Activate account", "Aktifkan akun")}
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="mt-10 flex flex-col items-center text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--lc-lime)] text-[34px] text-[var(--lc-forest)]">✓</div>
            <p className="font-display mt-5 text-[26px] font-semibold text-[var(--lc-forest)]">{tx("You're all set, Maya", "Akun siap, Maya")}</p>
            <p className="mt-1 text-[13px] text-[var(--lc-muted)]">{tx("Your role and access come from Cekat CRM. Allow notifications to receive clienteling pushes.", "Role dan akses Anda berasal dari Cekat CRM. Izinkan notifikasi untuk menerima clienteling push.")}</p>
            <Button
              fullWidth
              className="mt-8 h-12 rounded-xl bg-[var(--lc-forest)] text-white"
              onPress={() => {
                setSession({ role: "sales_agent", user: { ...USERS.sales_agent, full_name: "Maya Lestari", initials: "ML" } });
                reset("home");
              }}
            >
              {tx("Allow notifications & start", "Izinkan notifikasi & mulai")}
            </Button>
          </div>
        )}
      </div>
    </FullBody>
  );
}

export function Forgot() {
  const { tx, back } = useApp();
  const [sent, setSent] = useState(false);
  return (
    <FullBody>
      <div className="flex min-h-full flex-col px-6 pb-10 pt-14">
        <button onClick={back} className="-ml-2 grid h-9 w-9 place-items-center rounded-full hover:bg-black/5" aria-label="Back">
          <svg width="10" height="16" viewBox="0 0 10 16"><path d="M8 1 L2 8 L8 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <p className="font-display mt-2 text-[30px] font-semibold text-[var(--lc-forest)]">{tx("Reset password", "Reset password")}</p>
        <p className="mt-1 text-[13px] text-[var(--lc-muted)]">{tx("We'll email you a one-time code.", "Kami akan mengirim kode sekali pakai ke email Anda.")}</p>
        {!sent ? (
          <div className="mt-6 flex flex-col gap-4">
            <Field label={tx("Work email", "Email kerja")} type="email" defaultValue="andi@longchamp.co.id" />
            <Button fullWidth className="h-12 rounded-xl bg-[var(--lc-forest)] text-white" onPress={() => setSent(true)}>
              {tx("Send code", "Kirim kode")}
            </Button>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            <p className="text-[12px] font-medium">{tx("Enter the 6-digit code", "Masukkan kode 6 digit")}</p>
            <div className="grid grid-cols-6 gap-2">
              {"482913".split("").map((d, i) => (
                <div key={i} className="grid h-12 place-items-center rounded-xl border border-[var(--lc-forest)] bg-white text-[20px] font-semibold">
                  {d}
                </div>
              ))}
            </div>
            <Field label={tx("New password", "Password baru")} type="password" defaultValue="••••••••••••" />
            <Button fullWidth className="h-12 rounded-xl bg-[var(--lc-forest)] text-white" onPress={back}>
              {tx("Save & sign in", "Simpan & masuk")}
            </Button>
          </div>
        )}
      </div>
    </FullBody>
  );
}
