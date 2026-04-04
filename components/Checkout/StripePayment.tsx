"use client";

import React, { useEffect, useState } from "react";
import { 
  PaymentElement, 
  useElements, 
  useStripe,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import { CreditCard, Loader2, ShieldCheck, Zap } from "lucide-react";
import toast from "react-hot-toast";

const CheckoutForm = ({ orderId, total }: { orderId: string, total: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/orders`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An unexpected error occurred.");
      toast.error(error.message || "An error occurred");
    } else {
      setMessage("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-primary/5 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 border border-primary/10 mb-6 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between border-b border-primary/10 pb-4 mb-2">
            <h2 className="text-lg sm:text-xl font-black flex items-center gap-3 text-primary">
            <CreditCard size={20} fill="currentColor" />
            Card Details
            </h2>
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-primary rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                <ShieldCheck size={12} />
                SECURE
            </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-[20px] sm:rounded-3xl border border-primary/10 shadow-sm">
            <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
        </div>
      </div>

      {message && <div id="payment-message" className="text-red-500 text-sm font-bold bg-red-50 p-4 rounded-2xl border border-red-100">{message}</div>}

      <motion.button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-primary text-white py-5 sm:py-6 rounded-[24px] sm:rounded-[28px] font-black text-lg sm:text-xl shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {isLoading ? (
            <Loader2 className="animate-spin" size={24} />
        ) : (
            <>
                <Zap size={24} fill="currentColor" />
                Pay Now • ${total.toFixed(2)}
            </>
        )}
      </motion.button>
    </form>
  );
};

export default function StripePayment({ orderId, total, publishableKey }: { orderId: string, total: number, publishableKey: string }) {
  const [clientSecret, setClientSecret] = useState("");
  const [stripePromise, setStripePromise] = useState<any>(null);

  useEffect(() => {
    if (publishableKey) {
        setStripePromise(loadStripe(publishableKey));
    }
  }, [publishableKey]);

  useEffect(() => {
    if (orderId) {
        fetch("/api/payment/create-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId }),
          })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
            .catch((err) => {
                console.error(err);
                toast.error("Failed to initialize Stripe payment");
            });
    }
  }, [orderId]);

  const appearance: any = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0F172A',
      colorBackground: '#ffffff',
      colorText: '#0F172A',
      colorDanger: '#df1b41',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '20px',
    },
  };
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  if (!clientSecret || !stripePromise) {
    return (
        <div className="py-10 flex flex-col items-center justify-center gap-4">
             <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
             <p className="text-gray-400 font-bold text-xs uppercase tracking-widest animate-pulse">Initializing Secure Elements...</p>
        </div>
    );
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm orderId={orderId} total={total} />
    </Elements>
  );
}
