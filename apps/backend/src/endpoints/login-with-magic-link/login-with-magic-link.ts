import { Endpoint, PayloadRequest } from 'payload'

const loginWithMagicLinkEndpoint: Endpoint = {
  path: '/:id/tracking',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    // `data` is not automatically appended to the request
    // if you would like to read the body of the request
    // you can use `data = await req.json()`
    if (!req || !req.json) {
      throw new Error('Request object is required')
    }
    const data = await req.json()

    if (!data) {
      throw new Error('Request body is required')
    }

    if (!data.email) {
      throw new Error('Email is required')
    }

    const user = await req.payload.find({
      collection: 'users',
      where: {
        email: {
          equals: data.email,
        },
      },
    })

    if (!user || !user.docs || user.docs.length === 0) {
      return Response.json(
        {
          ok: true,
        },
        { status: 200 },
      )
    }

    // await req.payload.update({
    //   collection: '',
    //   data: {
    //     // data to update the document with
    //   },
    // })
    return Response.json({
      message: 'successfully updated tracking info',
    })
  },
}
