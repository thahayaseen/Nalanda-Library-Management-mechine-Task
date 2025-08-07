'use client'

import { useState, useEffect } from 'react'
import { bookService } from '@/services/bookService'
import BookCard from './BookCard'
import { IBook } from '@/types/Book.interface'

export default function TopBooksSection() {
  const [topBooks, setTopBooks] = useState<IBook[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const books = await bookService.getTopBooks()
        setTopBooks(books.data)
      } catch (error) {
        console.error('Error fetching top books:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopBooks()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
            <div className="bg-gray-300 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 h-4 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {topBooks.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  )
}
