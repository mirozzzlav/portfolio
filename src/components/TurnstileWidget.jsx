import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { className } from "../styles/classNames.js";

const turnstileScriptId = "cloudflare-turnstile-script";
const styles = { turnstile: { minHeight: 0 } };

function resetTurnstile(widgetId) {
  if (typeof window !== "undefined" && window.turnstile && widgetId !== null) {
    window.turnstile.reset(widgetId);
  }
}

export const TurnstileWidget = forwardRef(function TurnstileWidget({ siteKey }, ref) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const pendingVerificationRef = useRef(null);

  useImperativeHandle(ref, () => ({
    execute() {
      if (!siteKey) {
        return Promise.resolve("");
      }

      if (!window.turnstile || widgetIdRef.current === null) {
        return Promise.reject(new Error("Turnstile is not ready."));
      }

      return new Promise((resolve, reject) => {
        pendingVerificationRef.current = { resolve, reject };
        window.turnstile.execute(widgetIdRef.current);
      });
    },
    reset() {
      resetTurnstile(widgetIdRef.current);
    }
  }));

  useEffect(() => {
    if (!siteKey) {
      return undefined;
    }

    let isMounted = true;

    function renderWidget() {
      if (
        !isMounted ||
        !containerRef.current ||
        !window.turnstile ||
        widgetIdRef.current !== null
      ) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        "error-callback": () => {
          pendingVerificationRef.current?.reject(
            new Error("Turnstile verification failed.")
          );
          pendingVerificationRef.current = null;
        },
        "expired-callback": () => {
          pendingVerificationRef.current?.reject(
            new Error("Turnstile verification expired.")
          );
          pendingVerificationRef.current = null;
        },
        "timeout-callback": () => {
          pendingVerificationRef.current?.reject(
            new Error("Turnstile verification timed out.")
          );
          pendingVerificationRef.current = null;
        },
        appearance: "interaction-only",
        callback: (token) => {
          pendingVerificationRef.current?.resolve(token);
          pendingVerificationRef.current = null;
        },
        execution: "execute",
        sitekey: siteKey,
        theme: "auto"
      });
    }

    const existingScript = document.getElementById(turnstileScriptId);
    const script = existingScript || document.createElement("script");

    if (!existingScript) {
      script.id = turnstileScriptId;
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
    }

    if (window.turnstile) {
      renderWidget();
    } else {
      script.addEventListener("load", renderWidget, { once: true });
    }

    if (!existingScript) {
      document.head.append(script);
    }

    return () => {
      isMounted = false;
      script.removeEventListener("load", renderWidget);

      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }

      pendingVerificationRef.current?.reject(
        new Error("Turnstile verification cancelled.")
      );
      pendingVerificationRef.current = null;
    };
  }, [siteKey]);

  if (!siteKey) {
    return null;
  }

  return <div ref={containerRef} className={className(styles.turnstile)} />;
});
