import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
    const requestHeaders = new Headers(request.headers)
    const secret = requestHeaders.get('x-vercel-reval-key')
    const contentType = requestHeaders.get('x-content-type')
    const allowedContentTypes = ['resources']

    if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    if (!contentType || !allowedContentTypes.includes(contentType)) {
        return NextResponse.json({ message: 'Invalid content type' }, { status: 400 })
    }

    revalidateTag(contentType)

    return NextResponse.json({ revalidated: true, now: Date.now() })
}

export async function GET(request: NextRequest) {
    const requestHeaders = new Headers(request.headers)
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    // const secret = requestHeaders.get('x-vercel-reval-key')
    // get type from querystring.

    // if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    //     return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    // }
    

    if (!type) {
        return NextResponse.json({ message: 'Invalid content type' }, { status: 400 })
    }

    revalidateTag(type)

    return NextResponse.json({ revalidated: true, now: Date.now() })
}
