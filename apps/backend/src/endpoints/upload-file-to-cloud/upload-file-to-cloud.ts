import { Endpoint, PayloadRequest } from 'payload'
import { createClient } from '@supabase/supabase-js'
import { Bucket, bucketsArray, MediaSchema } from '@roo/common'

export const uploadFileToCloud: Endpoint = {
  path: '/upload-file-to-cloud',
  method: 'post',

  handler: async (req: PayloadRequest) => {
    if (!req.user) {
      return Response.json(
        {
          error: 'Unauthorized',
        },
        { status: 401 },
      )
    }

    if (!req.formData) {
      return Response.json(
        {
          error: 'Form data is required',
        },
        { status: 400 },
      )
    }

    const formData = await req.formData()

    const file = formData.get('file') as File | null
    const bucket = formData.get('bucket') as Bucket | null

    if (!file) {
      return Response.json(
        {
          error: 'File is required',
        },
        { status: 400 },
      )
    }

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL === undefined ||
      process.env.SUPABASE_SERVICE_KEY === undefined
    ) {
      return Response.json(
        {
          error: 'Supabase configuration is missing',
        },
        { status: 500 },
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
    )

    // Validuj typ souboru
    const isVideo = file.type.startsWith('video/')
    const allowedTypes = isVideo
      ? ['video/mp4', 'video/webm']
      : ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        {
          error: 'Invalid file type',
        },
        { status: 400 },
      )
    }

    // Generuj filename
    const ext = isVideo ? file.type.split('/')[1] : 'webp'
    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`
    const uploadBucket: Bucket = bucket || 'listings-images'

    // Konvertuj File → Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload na Supabase
    const { error: uploadError } = await supabase.storage
      .from(uploadBucket)
      .upload(filename, buffer, {
        contentType: file.type,
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return Response.json(
        {
          error: `Upload failed: ${uploadError.message}`,
        },
        { status: 500 },
      )
    }

    const responseData: MediaSchema = {
      filename,
      mimeType: isVideo ? `video/${file.type.split('/')[1]}` : 'image/webp',
    }

    if (responseData.filename) {
      try {
        await req.payload.create({
          collection: 'user-media',
          draft: false,
          data: {
            filename: responseData.filename,
            mimeType: responseData.mimeType,
            bucket: bucketsArray.includes(uploadBucket) ? uploadBucket : 'listings-images',
            user: req.user.id,
            status: 'active',
          },
        })
      } catch {
        console.log('Failed to create media record in database')
      }
    }

    return Response.json({
      ...responseData,
      success: true,
    })
  },
}
