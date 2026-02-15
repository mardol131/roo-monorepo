import webpush from 'web-push'
import { Field, TaskConfig } from 'payload'

const sendPushNotificationInputSchema: Field[] = [
  {
    name: 'title',
    type: 'text',
    required: true,
  },
  {
    name: 'message',
    type: 'textarea',
    required: true,
  },
  {
    name: 'accountId',
    type: 'text',
    required: true,
  },
]

export const sendPushNotificationTask: TaskConfig<any> = {
  retries: 3,
  slug: 'sendPushNotification',
  inputSchema: sendPushNotificationInputSchema,
  handler: async ({ input, req: { payload } }) => {
    const title = input.title as string | undefined
    const message = input.message as string | undefined
    const accountId = input.accountId as string | number | undefined

    if (!title || !message) {
      return {
        output: {
          success: false,
        },
      }
    }

    if (!accountId) {
      return {
        output: {
          success: false,
        },
      }
    }

    const pushSubscribe = await payload.find({
      collection: 'push-subscriptions',
      where: {
        account: {
          equals: accountId,
        },
      },
    })
    if (!pushSubscribe || pushSubscribe.docs.length === 0) {
      return {
        output: {
          success: false,
        },
      }
    }

    webpush.setVapidDetails(
      process.env.NEXT_PUBLIC_VAPID_SUBJECT!,
      process.env.NEXT_PUBLIC_VAPID_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    )

    const data = JSON.stringify({
      title: title,
      body: message,
      url: '/',
    })

    const res = await webpush.sendNotification(
      {
        endpoint: pushSubscribe.docs[0].endpoint,
        keys: {
          p256dh: pushSubscribe.docs[0].p256dh,
          auth: pushSubscribe.docs[0].auth,
        },
      },
      data,
    )

    console.log('Push notification sent:', res)

    return {
      output: {
        success: true,
      },
    }
  },
}
