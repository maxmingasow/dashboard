import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { prismadb } from '@/lib/prismadb'

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { name, description, price, categoryId, isFeatured, sizeId, colorId, inStock, images } =
      body

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 })
    if (!name) return new NextResponse('Name is required', { status: 400 })
    if (!description) return new NextResponse('Description is required', { status: 400 })
    if (!price) return new NextResponse('Price is required', { status: 400 })
    if (!categoryId) return new NextResponse('Category id is required', { status: 400 })
    if (!sizeId) return new NextResponse('Size is required', { status: 400 })
    if (!colorId) return new NextResponse('Color is required', { status: 400 })
    if (!images || !images.length) return new NextResponse('Images are required', { status: 400 })
    if (!params.storeId) return new NextResponse('Store id is required', { status: 400 })

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    if (!storeByUserId) return new NextResponse('Unauthorized', { status: 403 })

    const product = await prismadb.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        isFeatured,
        sizeId,
        colorId,
        inStock,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCTS_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { searchParams } = new URL(req.url)

    const categoryId = searchParams.get('categoryId') || undefined
    const sizeId = searchParams.get('sizeId') || undefined
    const colorId = searchParams.get('colorId') || undefined
    const isFeatured = searchParams.get('isFeatured')

    if (!params.storeId) return new NextResponse('Store id is required', { status: 400 })

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        inStock: true,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.log('[PRODUCTS_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
