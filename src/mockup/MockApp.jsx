import { useEffect } from "react";
import { Ctx, useAppState, Phone, TabBar, Toast, Sheet } from "./core";
import { SCREENS, ROOT_OF } from "./screens";
import { PRODUCTS } from "./data";

const initialStack = (screenId) => ({ id: screenId, params: SCREENS[screenId].params || {} });

/**
 * One self-contained app instance.
 * role: demo role · screen: start screen · onScreen: reports the visible screen id (for annotations)
 */
export default function MockApp({ role, screen = "login", lang, onScreen, scale = 1, interactive = true }) {
  const s = SCREENS[screen];
  const app = useAppState({ role, initial: initialStack(screen), lang, signedIn: !s.auth });

  // build a realistic back stack when starting deep inside a tab
  useEffect(() => {
    const root = ROOT_OF[screen];
    if (!s.auth && root && root !== screen) {
      app.reset(root);
      app.nav(screen, s.params || {});
    }
    if (s.seed === "wishlist") app.setWishlist([{ ...PRODUCTS[1], customer_id: 100245 }, { ...PRODUCTS[0], customer_id: 100245 }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onScreen?.(app.current.id);
  }, [app.current.id, onScreen]);

  const cur = SCREENS[app.current.id] || SCREENS.home;
  const C = cur.C;
  const loginRole = cur.auth ? role : undefined;

  return (
    <Ctx.Provider value={app}>
      <Phone scale={scale} darkStatus={app.current.id === "login"}>
        <div className={`absolute inset-0 ${interactive ? "" : "pointer-events-none"}`}>
          <C {...app.current.params} demoRole={loginRole} />
          {!cur.auth && <TabBar />}
          <Sheet />
          <Toast />
        </div>
      </Phone>
    </Ctx.Provider>
  );
}
