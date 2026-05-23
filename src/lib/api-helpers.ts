import { NextResponse } from 'next/server'

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('[API Error]', error)

  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode })
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
}

export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status })
}
