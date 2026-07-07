/**
 * Razorpay Standard Checkout integration.
 *
 * Loads the official checkout.js script on demand and exposes a single
 * `openRazorpayCheckout()` entry point. When the key is a placeholder
 * (`rzp_test_YOUR_FRONT_KEY`), `isRazorpayConfigured()` returns false so
 * callers can fall back to a simulated payment flow.
 *
 * NOTE: This runs client-side only — all functions are no-ops on the server.
 */

export const RAZORPAY_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YOUR_FRONT_KEY";

const PLACEHOLDER_KEYS = new Set(["", "rzp_test_YOUR_FRONT_KEY"]);

/** True only when a real-looking rzp_test_/rzp_live_ key is present. */
export function isRazorpayConfigured(): boolean {
  return (
    !PLACEHOLDER_KEYS.has(RAZORPAY_KEY_ID) &&
    (RAZORPAY_KEY_ID.startsWith("rzp_test_") ||
      RAZORPAY_KEY_ID.startsWith("rzp_live_"))
  );
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayInstanceOptions) => RazorpayInstance;
  }
}

interface RazorpayInstanceOptions {
  key: string;
  amount: number; // paise
  currency: string;
  name: string;
  description: string;
  image?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color: string };
  handler: (response: { razorpay_payment_id: string }) => void;
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
  };
}

interface RazorpayInstance {
  open: () => void;
  on?: (event: string, handler: () => void) => void;
}

let scriptPromise: Promise<boolean> | null = null;

/** Dynamically loads checkout.razorpay.com/v1/checkout.js (idempotent). */
export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<boolean>((resolve) => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export interface RazorpayCheckoutOptions {
  /** amount in INR rupees (will be × 100 for paise) */
  amountINR: number;
  name: string;
  description: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  onSuccess: (paymentId: string) => void;
  onDismiss?: () => void;
}

/**
 * Opens the native Razorpay checkout overlay.
 * Resolves after the handler fires (success) or rejects on dismiss/error.
 */
export async function openRazorpayCheckout(
  opts: RazorpayCheckoutOptions
): Promise<string> {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error("Razorpay checkout script failed to load");
  }

  return new Promise<string>((resolve, reject) => {
    const instance = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      amount: Math.round(opts.amountINR * 100), // rupees → paise
      currency: "INR",
      name: opts.name,
      description: opts.description,
      prefill: opts.prefill,
      notes: opts.notes,
      theme: { color: "#00F2FE" },
      handler: (res) => {
        opts.onSuccess(res.razorpay_payment_id);
        resolve(res.razorpay_payment_id);
      },
      modal: {
        ondismiss: () => {
          opts.onDismiss?.();
          reject(new Error("User dismissed the Razorpay checkout"));
        },
      },
    });
    instance.open();
  });
}
