'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { borrowService } from '@/services/borrowService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Mail, Calendar, BookOpen } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import Image from 'next/image'
import Pagination from '@/components/Pagination'

interface BorrowedBook {
  bookname: string
  borrowedDate: string
  Returned?: string
  status: 'borrowed' | 'returned'
}

export default function ProfilePage() {
  const [total,setTotal]=useState(0)
  const { user } = useAuth()
  const { toast } = useToast()
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])
  const [loading, setLoading] = useState(true)
const [page,setPage]=useState(0)
  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const books = await borrowService.getUserBorrowedBooks(page)
        console.log(books,'data');
        console.log(total,'ttl');
        
        // Handle the data structure - it might be books.data or just books
        const booksData = books.data || books
        setTotal(books.totalPages)
        setBorrowedBooks(booksData)
      } catch (error) {
        console.error('Error fetching borrowed books:', error)
        setTotal(0)
        setPage(1)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchBorrowedBooks()
    }
  }, [user,page])

  const handleReturn = async (bookName: string) => {
    try {
      await borrowService.returnBook(bookName)
      setBorrowedBooks(prev => 
        prev.map(book => 
          book.bookname === bookName 
            ? { ...book, status: 'returned', Returned: new Date().toISOString() }
            : book
        )
      )
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
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    return status === 'returned' ? 'secondary' : 'default'
  }

  const getStatusText = (status: string) => {
    return status === 'returned' ? 'Returned' : 'Active'
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
          <Link href="/auth">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="borrowed">My Borrowed Books</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>Your account details and information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Username:</span>
                  <span className="font-medium">{user.username}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Member since:</span>
                  <span className="font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="borrowed">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>My Borrowed Books</span>
                </CardTitle>
                <CardDescription>Books you have borrowed from the library</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-300 h-20 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : borrowedBooks.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">You haven't borrowed any books yet.</p>
                    <Link href="/books">
                      <Button className="mt-4">Browse Books</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {borrowedBooks.map((borrowedBook, index) => (
                      <div
                        key={`${borrowedBook.bookname}-${index}`}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <Image
                            src={`/placeholder.svg?height=80&width=60&text=${encodeURIComponent(borrowedBook.bookname)}`}
                            alt={borrowedBook.bookname}
                            width={60}
                            height={80}
                            className="rounded"
                          />
                          <div>
                            <h3 className="font-semibold">{borrowedBook.bookname}</h3>
                            <p className="text-xs text-gray-500">
                              Borrowed: {formatDate(borrowedBook.borrowedDate)}
                            </p>
                            {borrowedBook.Returned && (
                              <p className="text-xs text-gray-500">
                                Returned: {formatDateTime(borrowedBook.Returned)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getStatusBadge(borrowedBook.status)}>
                            {getStatusText(borrowedBook.status)}
                          </Badge>
                          {borrowedBook.status === 'borrowed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReturn(borrowedBook.bookname)}
                            >
                              Return
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <Pagination currentPage={page} onPageChange={setPage} totalPages={total}/>
        </Tabs>
      </div>
    </div>
  )
}