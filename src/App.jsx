import { useState } from "react";
import { HashRouter, NavLink, Navigate, Route, Routes } from "react-router-dom";
import { Chip, ToggleButton, ToggleButtonGroup } from "@heroui/react";
import UseCasePage from "./pages/UseCasePage";
import ActivityPage from "./pages/ActivityPage";
import ArchitecturePage from "./pages/ArchitecturePage";
import { T } from "./i18n";

const NAV = [
  { key: "usecase", to: "/use-case", ready: true },
  { key: "activity", to: "/activity", ready: true },
  { key: "architecture", to: "/architecture", ready: true },
  { key: "sequence", to: "/sequence" },
  { key: "erd", to: "/erd" },
  { key: "mockup", to: "/mockup" },
];

const LANG_BTN =
  "rounded-full bg-transparent px-3 text-xs font-semibold text-white/70 data-[selected=true]:bg-white data-[selected=true]:text-[var(--lc-forest)]";

function Header({ lang, setLang, t }) {
  return (
    <header className="bg-[var(--lc-forest)] text-white">
      <div className="mx-auto flex max-w-[1680px] flex-wrap items-center gap-x-8 gap-y-3 px-4 py-4 sm:px-6">
        <div className="leading-none">
          <div className="font-display text-2xl tracking-[0.3em] text-[var(--lc-lime)]">LONGCHAMP</div>
          <div className="mt-1 text-[10px] tracking-[0.35em] text-white/60">CRM MOBILE · SOLUTION DESIGN</div>
        </div>

        <nav className="flex flex-1 flex-wrap items-center gap-1">
          {NAV.map((n) =>
            n.ready ? (
              <NavLink
                key={n.key}
                to={n.to}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-1.5 text-sm transition ${
                    isActive ? "bg-white text-[var(--lc-forest)] font-semibold" : "text-white/80 hover:bg-white/10"
                  }`
                }
              >
                {t.nav[n.key]}
              </NavLink>
            ) : (
              <span key={n.key} className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm text-white/40">
                {t.nav[n.key]}
                <Chip size="sm" variant="soft" className="h-4 bg-white/10 px-1.5 text-[9px] text-white/60">
                  {t.soon}
                </Chip>
              </span>
            )
          )}
        </nav>

        <ToggleButtonGroup
          size="sm"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={new Set([lang])}
          onSelectionChange={(keys) => setLang([...keys][0])}
          aria-label="Language"
          className="rounded-full bg-white/10 p-0.5"
        >
          <ToggleButton id="en" className={LANG_BTN}>
            EN
          </ToggleButton>
          <ToggleButton id="id" className={LANG_BTN}>
            <ToggleButtonGroup.Separator />
            ID
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </header>
  );
}

export default function App() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("lc-lang") || "en";
    } catch {
      return "en";
    }
  });
  const changeLang = (l) => {
    setLang(l);
    try {
      localStorage.setItem("lc-lang", l);
    } catch {
      /* storage unavailable */
    }
  };
  const t = T[lang];

  return (
    <HashRouter>
      <div className="min-h-screen">
        <Header lang={lang} setLang={changeLang} t={t} />
        <Routes>
          <Route path="/use-case" element={<UseCasePage lang={lang} t={t} />} />
          <Route path="/architecture" element={<ArchitecturePage lang={lang} t={t} />} />
          <Route path="/activity" element={<ActivityPage lang={lang} t={t} />} />
          <Route path="*" element={<Navigate to="/use-case" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
