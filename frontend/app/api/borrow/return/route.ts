import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Mock borrowed books data (shared with borrow route)
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

    // Find the borrowed book
    const borrowIndex = borrowedBooks.findIndex(
      b => b.book._id === bookId && b.user === decoded.userId && !b.returned
    )

    if (borrowIndex === -1) {
      return NextResponse.json({ error: 'Book not found in borrowed list' }, { status: 404 })
    }

    // Mark as returned
    borrowedBooks[borrowIndex].returned = true
    borrowedBooks[borrowIndex].returnDate = new Date().toISOString()

    return NextResponse.json({ message: 'Book returned successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
