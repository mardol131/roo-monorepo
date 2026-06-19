import type { Endpoint, PayloadRequest } from 'payload'
import zod from 'zod'

const querySchema = zod.object({
  ids: zod
    .string({ error: 'ids je povinný parametr' })
    .min(1)
    .transform((val) => val.split(',')),
  from: zod.coerce.date({ error: 'from je povinný parametr' }),
  to: zod.coerce.date({ error: 'to je povinný parametr' }),
}).refine((data) => data.from <= data.to, {
  message: 'from musí být před to',
  path: ['from'],
})

export const getListingsAvailability: Endpoint = {
  path: '/listings-availability',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    const { searchParams } = new URL(req.url ?? '', 'http://localhost')

    const parsed = querySchema.safeParse({
      ids: searchParams.get('ids'),
      from: searchParams.get('from'),
      to: searchParams.get('to'),
    })

    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const { ids, from, to } = parsed.data

    const events = await req.payload.find({
      collection: 'calendar-events',
      where: {
        and: [
          { listing: { in: ids } },
          { status: { not_equals: 'cancelled' } },
          { startsAt: { less_than: to.toISOString() } },
          { endsAt: { greater_than: from.toISOString() } },
        ],
      },
      depth: 0,
      overrideAccess: true,
      limit: 1000,
      select: { listing: true },
    })

    const bookedIds = new Set(
      events.docs.map((e) =>
        typeof e.listing === 'string' ? e.listing : (e.listing as { id: string }).id,
      ),
    )

    return Response.json({
      data: ids.map((id) => ({
        id,
        status: bookedIds.has(id) ? 'limited' : 'likely-free',
      })),
    })
  },
}
