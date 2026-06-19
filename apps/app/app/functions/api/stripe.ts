const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe`;

export async function createActivateSubscriptionCheckoutSession({
  listingId,
  successUrl,
  cancelUrl,
}: {
  listingId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string }> {
  const res = await fetch(
    `${apiUrl}/checkout-sessions/activate-listing-subscription`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, successUrl, cancelUrl }),
      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to create checkout session: ${res.status}`);
  }

  const data = await res.json();
  console.log("createActivateSubscriptionCheckoutSession response:", data);
  return data;
}

export async function resumeListingSubscriptionPayments({
  listingId,
}: {
  listingId: string;
}): Promise<{ success: boolean }> {
  const res = await fetch(`${apiUrl}/subscriptions/resume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listingId }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to resume subscription: ${res.status}`);
  }

  return res.json();
}

export type StripeInvoice = {
  id: string;
  amount: number;
  currency: string;
  status: string | null;
  paidAt: string | null;
  invoiceUrl: string | null;
  invoicePdf: string | null;
};

export async function fetchPaymentHistory(
  subscriptionId: string,
): Promise<{ invoices: StripeInvoice[] }> {
  const res = await fetch(
    `${apiUrl}/subscriptions/payment-history?subscriptionId=${subscriptionId}`,
    { credentials: "include" },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch payment history: ${res.status}`);
  }

  return res.json();
}

export async function cancelListingSubscription({
  listingId,
}: {
  listingId: string;
}): Promise<{ success: boolean }> {
  const res = await fetch(`${apiUrl}/subscriptions/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listingId }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to cancel subscription: ${res.status}`);
  }

  const data: { success: boolean } = await res.json();
  return data;
}
