'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Search, Edit, Trash2, Eye, EyeOff, X, Upload } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { IBook } from '@/types/Book.interface'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import Pagination from '@/components/Pagination'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  author: z.string().min(1, 'Author is required').max(100, 'Author must be less than 100 characters'),
  ISBN: z.string()
    .min(1, 'ISBN is required')
    .min(10, 'ISBN must be at least 10 characters')
    .max(17, 'ISBN must be less than 17 characters')
    .regex(/^[\d-]+$/, 'ISBN must contain only numbers and hyphens'),
  publicationDate: z.string().optional().refine((date) => {
    if (!date || date === '') return true;
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, 'Please enter a valid date'),
  genre: z.string().min(1, 'Genre is required'),
  copies: z.number().min(1, 'At least 1 copy is required').max(100, 'Maximum 100 copies allowed'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
})

type BookFormData = z.infer<typeof bookSchema>

export default function AdminBooksPage() {
  const { toast } = useToast()
  const [books, setBooks] = useState<IBook[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editingBook, setEditingBook] = useState<IBook | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [statusLoading, setStatusLoading] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
  })

  const fetchBooks = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true)
      const response = await adminService.getAllBooks(page, 10, search)
      console.log(response.data);
      
      setBooks(response.data)
      setTotalPages(response.totalPages)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching books:', error)
      toast({
        title: "Error",
        description: "Failed to fetch books",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleSearch = () => {
    fetchBooks(1, searchTerm)
  }

  const handleDelete = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) {
      return
    }

    try {
      setDeleteLoading(bookId)
      await adminService.deleteBook(bookId)
      
      toast({
        title: "Success",
        description: "Book deleted successfully",
      })
      
      // Remove the book from local state immediately
      setBooks(prevBooks => prevBooks.filter(book => book.ISBN !== bookId && book.ISBN !== bookId))
      
      // If this was the last book on the current page and we're not on page 1, go to previous page
      const remainingBooks = books.filter(book => book.ISBN !== bookId && book.ISBN !== bookId)
      if (remainingBooks.length === 0 && currentPage > 1) {
        fetchBooks(currentPage - 1, searchTerm)
      }
      
    } catch (error: any) {
      console.error('Error deleting book:', error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete book",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleToggleStatus = async (bookId: string, currentStatus: boolean) => {
    try {
      setStatusLoading(bookId)
      const action = currentStatus ? 'unlist' : 'list'
      await adminService.unList(bookId, !currentStatus)
      
      toast({
        title: "Success",
        description: `Book ${action}ed successfully`,
      })
      
      // Update the book status in local state immediately
      setBooks(prevBooks => 
        prevBooks.map(book => 
          (book.ISBN === bookId || book.ISBN === bookId)
            ? { ...book, listed: !currentStatus }
            : book
        )
      )
    } catch (error: any) {
      console.error('Error toggling book status:', error)
      toast({
        title: "Error",
        description: error.response?.data?.message || `Failed to ${currentStatus ? 'unlist' : 'list'} book`,
        variant: "destructive",
      })
    } finally {
      setStatusLoading(null)
    }
  }

  const handleEditClick = (book: IBook) => {
    setEditingBook(book)
    setImagePreview(book.image ? `${process.env.NEXT_PUBLIC_API_URL}/${book.image}` : null)
    setImageFile(null)
    
    // Populate form with book data
    setValue('title', book.title)
    setValue('author', book.author)
    setValue('ISBN', book.ISBN)
    setValue('publicationDate', book.publicationDate || '')
    setValue('genre', book.genre || '')
    setValue('copies', book.copies)
    setValue('description', book.description || '')
    
    setEditDialogOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        })
        return
      }

      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    if (editingBook) {
      setImagePreview(editingBook.image ? `${process.env.NEXT_PUBLIC_API_URL}/${editingBook.image}` : null)
    } else {
      setImagePreview(null)
    }
    // Clear file input
    const fileInput = document.getElementById('edit-image-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const onEditSubmit = async (data: BookFormData) => {
    if (!editingBook) return

    try {
      setUpdateLoading(true)

      const cleanedData = {
        title: data.title?.trim() || '',
        author: data.author?.trim() || '',
        ISBN: data.ISBN?.trim() || '',
        publicationDate: data.publicationDate?.trim() || '',
        genre: data.genre?.trim() || '',
        copies: Number(data.copies) || 1,
        description: data.description?.trim() || ''
      }

      // Create FormData for multipart/form-data
      const formData = new FormData()
      
      // Add all book data
      Object.entries(cleanedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value.toString())
        }
      })

      // Add image if selected
      if (imageFile) {
        formData.append('image', imageFile)
      }

      const response = await adminService.updateBook(data.ISBN, formData)

      toast({
        title: "Success",
        description: "Book updated successfully!",
      })

      // Update the book in local state with complete updated data
      const updatedBook = {
        ...editingBook,
        ...cleanedData,
        image: response.data?.image || editingBook.image,
        // Preserve other fields that might not be in cleanedData
        ISBN: editingBook.ISBN,
        listed: editingBook.listed,
        createdAt: editingBook.createdAt,
        updatedAt: response.data?.updatedAt || new Date().toISOString()
      }

      setBooks(prevBooks => 
        prevBooks.map(book => 
          book.ISBN === editingBook.ISBN 
            ? updatedBook
            : book
        )
      )

      // Close dialog and reset form
      setEditDialogOpen(false)
      setEditingBook(null)
      reset()
      setImageFile(null)
      setImagePreview(null)
      
    } catch (error: any) {
      console.error('Error updating book:', error)
      
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to update book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdateLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    fetchBooks(page, searchTerm)
  }

  const handleDialogClose = () => {
    setEditDialogOpen(false)
    setEditingBook(null)
    reset()
    setImageFile(null)
    setImagePreview(null)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Books</h1>
          <p className="text-gray-600">View and manage all books in the library</p>
        </div>
        <Link href="/admin/books/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Book
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Books List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {books.map((book) => (
              <Card key={book.ISBN} className={book.listed === false ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                      <CardDescription>by {book.author}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant={book.copies > 0 ? "default" : "destructive"}>
                        {book.copies > 0 ? "Available" : "Out of Stock"}
                      </Badge>
                      <Badge variant={book.listed !== false ? "outline" : "secondary"}>
                        {book.listed !== false ? "Listed" : "Unlisted"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Image
                      src={book.image ? `${process.env.NEXT_PUBLIC_API_URL}/${book.image}` : `/placeholder.svg?height=200&width=150&text=${encodeURIComponent(book.title)}`}
                      alt={book.title}
                      width={150}
                      height={200}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ISBN:</span>
                        <span className="font-medium">{book.ISBN}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Genre:</span>
                        <span className="font-medium">{book.genre || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Copies:</span>
                        <span className="font-medium">{book.copies}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditClick(book)}
                          disabled={updateLoading}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(book.ISBN)}
                          disabled={deleteLoading === book.ISBN || deleteLoading === book.ISBN}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deleteLoading === book.ISBN || deleteLoading === book.ISBN ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                      <Button
                        variant={book.listed !== false ? "secondary" : "default"}
                        size="sm"
                        onClick={() => handleToggleStatus(book.ISBN, book.listed)}
                        className="w-full"
                        disabled={statusLoading === book.ISBN || statusLoading === book.ISBN}
                      >
                        {statusLoading === book.ISBN || statusLoading === book.ISBN ? (
                          'Updating...'
                        ) : book.listed !== false ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Unlist
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            List
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {books.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No books found.</p>
              <Link href="/admin/books/create">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Book
                </Button>
              </Link>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          
          {editingBook && (
            <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Book Cover Image</Label>
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="edit-image-upload"
                      />
                      <label htmlFor="edit-image-upload" className="cursor-pointer">
                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload new cover image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </label>
                    </div>
                  </div>
                  
                  {imagePreview && (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Book cover preview"
                        width={100}
                        height={130}
                        className="rounded-lg object-cover"
                      />
                      {imageFile && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={removeImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  {...register('title')}
                  placeholder="Enter book title"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Author */}
              <div className="space-y-2">
                <Label htmlFor="edit-author">Author *</Label>
                <Input
                  id="edit-author"
                  {...register('author')}
                  placeholder="Enter author name"
                  className={errors.author ? 'border-red-500' : ''}
                />
                {errors.author && (
                  <p className="text-sm text-red-600">{errors.author.message}</p>
                )}
              </div>

              {/* ISBN */}
              <div className="space-y-2">
                <Label htmlFor="edit-ISBN">ISBN *</Label>
                <Input
                  id="edit-ISBN"
                  {...register('ISBN')}
                  placeholder="Enter ISBN"
                  className={errors.ISBN ? 'border-red-500' : ''}
                />
                {errors.ISBN && (
                  <p className="text-sm text-red-600">{errors.ISBN.message}</p>
                )}
              </div>

              {/* Publication Date and Genre */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-publicationDate">Publication Date</Label>
                  <Input
                    id="edit-publicationDate"
                    type="date"
                    {...register('publicationDate')}
                    className={errors.publicationDate ? 'border-red-500' : ''}
                  />
                  {errors.publicationDate && (
                    <p className="text-sm text-red-600">{errors.publicationDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-genre">Genre *</Label>
                  <select
                    id="edit-genre"
                    {...register('genre')}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.genre ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select a genre</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Biography">Biography</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="Horror">Horror</option>
                    <option value="Self-Help">Self-Help</option>
                    <option value="Business">Business</option>
                    <option value="Technology">Technology</option>
                    <option value="Art">Art</option>
                    <option value="Philosophy">Philosophy</option>
                  </select>
                  {errors.genre && (
                    <p className="text-sm text-red-600">{errors.genre.message}</p>
                  )}
                </div>
              </div>

              {/* Copies */}
              <div className="space-y-2">
                <Label htmlFor="edit-copies">Number of Copies *</Label>
                <Input
                  id="edit-copies"
                  type="number"
                  min="1"
                  max="100"
                  {...register('copies', { valueAsNumber: true })}
                  placeholder="Enter number of copies"
                  className={errors.copies ? 'border-red-500' : ''}
                />
                {errors.copies && (
                  <p className="text-sm text-red-600">{errors.copies.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  {...register('description')}
                  placeholder="Enter book description (optional)"
                  rows={3}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  disabled={updateLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateLoading}>
                  {updateLoading ? 'Updating...' : 'Update Book'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}