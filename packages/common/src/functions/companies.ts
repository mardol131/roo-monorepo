import { Company } from "../types/payload-types";

export function formatCompanyBillingAddress(
  address: Company["billingAddress"],
): string {
  return `${address?.street}, ${address?.city}, ${address?.postalCode}, ${address?.country}`;
}
