import { NextResponse } from 'next/server'

// Mock top books data
const topBooks = [
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
]

export async function GET() {
  try {
    return NextResponse.json(topBooks)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
