'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { bookService } from '@/services/bookService'
import { borrowService } from '@/services/borrowService'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, BookOpen, Hash } from 'lucide-react'
import { IBook } from '@/types/Book.interface'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

export default function BookDetailsPage() {
  const params = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [book, setBook] = useState<IBook | null>(null)
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)
  const [returning, setReturning] = useState(false)
  const [isBorrowed, setIsBorrowed] = useState(false)
  const [borrowId, setBorrowId] = useState<string | null>(null)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await bookService.getBookById(params.id as string)
        
        // Handle nested data structure
        const bookInfo = bookData.data?.data || bookData.data
        setBook(bookInfo)
        
        // Check if book is already borrowed from the response
        if (bookData.data?.aldredy) {
          setIsBorrowed(bookData.data.aldredy.ispurchased)
          setBorrowId(bookData.data.aldredy.id)
        }
        
      } catch (error) {
        console.error('Error fetching book:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [params.id, user])

  const handleBorrow = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to borrow books.",
        variant: "destructive",
      })
      return
    }

    try {
      setBorrowing(true)
      const response = await borrowService.borrowBook(params.id as string)
      setIsBorrowed(true)
      
      // If the response includes borrow ID, store it
      if (response.data?.id) {
        setBorrowId(response.data.id)
      }
      
      toast({
        title: "Success",
        description: "Book borrowed successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to borrow book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setBorrowing(false)
    }
  }

  const handleReturn = async () => {
    try {
      setReturning(true)
      
      // Use borrowId if available, otherwise use bookId
      const returnId = borrowId || (params.id as string)
      await borrowService.returnBook(returnId)
      
      setIsBorrowed(false)
      setBorrowId(null)
      
      toast({
        title: "Success",
        description: "Book returned successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to return book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setReturning(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gray-300 h-96 rounded-lg"></div>
            <div className="lg:col-span-2">
              <div className="bg-gray-300 h-8 rounded mb-4"></div>
              <div className="bg-gray-300 h-6 rounded mb-4 w-3/4"></div>
              <div className="bg-gray-300 h-4 rounded mb-2"></div>
              <div className="bg-gray-300 h-4 rounded mb-2 w-5/6"></div>
              <div className="bg-gray-300 h-4 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h1>
          <p className="text-gray-600">The book you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Image */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <Image
                src={process.env.NEXT_PUBLIC_API_URL+'/'+book.image }
                alt={book.title}
                width={300}
                height={400}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </CardContent>
          </Card>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-bold mb-2">{book.title}</CardTitle>
                  <CardDescription className="text-lg">by {book.author}</CardDescription>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant={book.copies > 0 ? "default" : "destructive"}>
                    {book.copies > 0 ? "Available" : "Out of Stock"}
                  </Badge>
                  {isBorrowed && (
                    <Badge variant="secondary">
                      Already Borrowed
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Book Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">ISBN:</span>
                  <span className="font-medium">{book.ISBN}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Published:</span>
                  <span className="font-medium">
                    {book.publicationDate ? new Date(book.publicationDate).getFullYear() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Genre:</span>
                  <span className="font-medium">{book.genre || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Copies:</span>
                  <span className="font-medium">{book.copies}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                {!isBorrowed ? (
                  <Button
                    onClick={handleBorrow}
                    disabled={borrowing || book.copies === 0 || !user}
                    className="flex-1"
                  >
                    {borrowing ? 'Borrowing...' : 'Borrow Book'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleReturn}
                    disabled={returning}
                    variant="outline"
                    className="flex-1"
                  >
                    {returning ? 'Returning...' : 'Return Book'}
                  </Button>
                )}
              </div>

              {!user && (
                <p className="text-sm text-gray-600 text-center">
                  Please log in to borrow books.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}