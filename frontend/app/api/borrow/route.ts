import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Mock borrowed books data
let borrowedBooks: any[] = []

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
    
    const { bookId } = await request.json()

    // Check if book is already borrowed by user
    const existingBorrow = borrowedBooks.find(
      b => b.book._id === bookId && b.user === decoded.userId && !b.returned
    )

    if (existingBorrow) {
      return NextResponse.json({ error: 'Book already borrowed' }, { status: 400 })
    }

    // Create new borrow record
    const newBorrow = {
      _id: Date.now().toString(),
      user: decoded.userId,
      book: {
        _id: bookId,
        title: 'Sample Book', // In real app, fetch from database
        author: 'Sample Author',
        ISBN: '978-0-000-00000-0'
      },
      borrowDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      returned: false
    }

    borrowedBooks.push(newBorrow)

    return NextResponse.json(newBorrow, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
