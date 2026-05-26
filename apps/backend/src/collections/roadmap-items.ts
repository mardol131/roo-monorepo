import { adminOrApiKeyAuth } from '@/functions/ACL'
import type { CollectionConfig } from 'payload'

export const RoadmapItems: CollectionConfig = {
  slug: 'roadmap-items',
  admin: {
    useAsTitle: 'name',
  },
  endpoints: [
    {
      path: '/vote',
      method: 'post',
      handler: async (req) => {
        if (!req.json) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const data = await req.json()
        try {
          const { roadmapItemId } = data
          if (!roadmapItemId) {
            return Response.json({ message: 'Item ID is required' }, { status: 400 })
          }

          // Check if the user is authenticated
          const user = req.user
          if (!user || user.collection !== 'users') {
            return Response.json({ message: 'Unauthorized' }, { status: 401 })
          }

          const lastVoteDate = new Date(user.lastRoadmapVoteAt ?? 0)
          if (Date.now() - lastVoteDate.getTime() < 30 * 24 * 60 * 60 * 1000) {
            return Response.json(
              { message: 'You can only vote once every 30 days' },
              { status: 403 },
            )
          }

          // Fetch the roadmap item
          const item = await req.payload.findByID({
            collection: 'roadmap-items',
            id: roadmapItemId,
          })

          if (!item) {
            return Response.json({ message: 'Roadmap item not found' }, { status: 404 })
          }

          // Increment the vote count
          const updatedItem = await req.payload.update({
            collection: 'roadmap-items',
            id: roadmapItemId,
            data: {
              votes: (item.votes || 0) + 1,
            },
          })

          // Update the user's last vote date
          await req.payload.update({
            collection: 'users',
            id: user.id,
            data: {
              lastRoadmapVoteAt: new Date().toISOString(),
            },
          })

          return Response.json(updatedItem, { status: 200 })
        } catch (error) {
          console.error('Error voting for roadmap item:', error)
          return Response.json({ message: 'Internal server error' }, { status: 500 })
        }
      },
    },
  ],
  access: {
    read: () => true,
    update: ({ req }) => adminOrApiKeyAuth(req),
    create: ({ req }) => adminOrApiKeyAuth(req),
    delete: ({ req }) => adminOrApiKeyAuth(req),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'votes',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      options: ['planned', 'in-progress', 'completed'],
      defaultValue: 'planned',
    },
  ],
}
