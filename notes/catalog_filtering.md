# Catalog filtering — context-aware price query

## Cíl

Opravit a rozšířit cenovou filtraci v katalogu. Stávající `pushPrice` používá
`"price.startsAt"` — pole které neexistuje, filtr ceny nefunguje vůbec.
Nová verze čte kontext z existujících URL params a staví OR/AND query přes
`minimumPricePerEvent` + `pricingUnit`.

Karty se nemění. Zobrazují `minimumPricePerEvent` a `minimumVariantPrice`
tak jak jsou — bez přepočtu.

---

## Kontext z existujících filtrů (žádné nové params)

| Potřeba | Zdroj |
|---------|-------|
| Počet dní | `dateFrom` + `dateTo` → `max(1, ceil(diff_ms / 86_400_000))` |
| Počet hostů | `adults` + `children` |
| Hodiny | totéž: `diff_ms / 3_600_000` (neceločíselné OK) |

Pokud termín není zadán → `days = 1`, `hours = undefined` → `per_hour` větev se vynechá.
Pokud hosté nejsou zadáni → `guests = 1` → `per_person` větev se vynechá.

---

## Nahradit `pushPrice` v `create-listings-query.ts`

```ts
function deriveDays(dateFrom: string, dateTo: string): number {
  if (!dateFrom || !dateTo) return 1;
  const diff = new Date(dateTo).getTime() - new Date(dateFrom).getTime();
  return Math.max(1, Math.ceil(diff / 86_400_000));
}

function deriveHours(dateFrom: string, dateTo: string): number | undefined {
  if (!dateFrom || !dateTo) return undefined;
  const diff = new Date(dateTo).getTime() - new Date(dateFrom).getTime();
  const h = diff / 3_600_000;
  return h > 0 ? h : undefined;
}

function pushPriceWithContext(
  and: Where[],
  lo: number | undefined,
  hi: number | undefined,
  guests: number,
  hours: number | undefined,
  days: number,
) {
  if (!lo && !hi) return;

  const branch = (unit: string, divisor: number): Where => ({
    and: [
      { pricingUnit: { equals: unit } },
      ...(lo ? [{ minimumPricePerEvent: { greater_than_equal: lo / divisor } }] : []),
      ...(hi ? [{ minimumPricePerEvent: { less_than_equal: hi / divisor } }] : []),
    ],
  });

  and.push({
    or: [
      branch('lump_sum',   1),
      branch('per_day',    days),
      ...(guests > 1 ? [branch('per_person', guests)] : []),
      ...(hours     ? [branch('per_hour',   hours)]   : []),
    ],
  });
}
```

Volání — nahradit `pushPrice(and, common.minPrice, common.maxPrice)`:

```ts
const days  = deriveDays(general.dateFrom, general.dateTo);
const hours = deriveHours(general.dateFrom, general.dateTo);
pushPriceWithContext(and, common.minPrice, common.maxPrice, totalGuests, hours, days);
```

---

## Co se nemění

- `listing-card.tsx` — žádné změny
- `filter-groups.ts`, `filter-params.ts` — žádné nové params
- `minimumPricePerEvent`, `pricingUnit` na listingu — systémem spravováno
