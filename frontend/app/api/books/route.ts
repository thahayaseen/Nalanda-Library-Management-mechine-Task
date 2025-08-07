import { NextRequest, NextResponse } from 'next/server'

// Mock books data
const books = [
  {
    _id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    ISBN: '978-0-7432-7356-5',
    publicationDate: new Date('1925-04-10'),
    genre: 'Fiction',
    copies: 5,
    listed: true,
    createdAt: new Date(),
  },
  {
    _id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    ISBN: '978-0-06-112008-4',
    publicationDate: new Date('1960-07-11'),
    genre: 'Fiction',
    copies: 3,
    listed: true,
    createdAt: new Date(),
  },
  {
    _id: '3',
    title: '1984',
    author: 'George Orwell',
    ISBN: '978-0-452-28423-4',
    publicationDate: new Date('1949-06-08'),
    genre: 'Fiction',
    copies: 7,
    listed: true,
    createdAt: new Date(),
  },
  {
    _id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    ISBN: '978-0-14-143951-8',
    publicationDate: new Date('1813-01-28'),
    genre: 'Fiction',
    copies: 4,
    listed: true,
    createdAt: new Date(),
  },
  {
    _id: '5',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    ISBN: '978-0-316-76948-0',
    publicationDate: new Date('1951-07-16'),
    genre: 'Fiction',
    copies: 2,
    listed: true,
    createdAt: new Date(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const genre = searchParams.get('genre') || ''

    let filteredBooks = books.filter(book => book.listed)

    // Apply search filter
    if (search) {
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Apply genre filter
    if (genre) {
      filteredBooks = filteredBooks.filter(book => book.genre === genre)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex)

    return NextResponse.json({
      books: paginatedBooks,
      totalPages: Math.ceil(filteredBooks.length / limit),
      currentPage: page,
      totalBooks: filteredBooks.length
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookData = await request.json()
    
    const newBook = {
      _id: Date.now().toString(),
      ...bookData,
      createdAt: new Date(),
    }

    books.push(newBook)

    return NextResponse.json(newBook, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
