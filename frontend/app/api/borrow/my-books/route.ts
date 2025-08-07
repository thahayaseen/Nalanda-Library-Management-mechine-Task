import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Mock borrowed books data
const borrowedBooks = [
  {
    _id: '1',
    user: '1',
    book: {
      _id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      ISBN: '978-0-7432-7356-5'
    },
    borrowDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    returned: false
  },
  {
    _id: '2',
    user: '1',
    book: {
      _id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      ISBN: '978-0-06-112008-4'
    },
    borrowDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    returned: true,
    returnDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
    
    // Filter borrowed books for the current user
    const userBorrowedBooks = borrowedBooks.filter(b => b.user === decoded.userId)

    return NextResponse.json(userBorrowedBooks)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
