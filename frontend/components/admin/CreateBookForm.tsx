'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { adminService } from '@/services/adminService'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  author: z.string().min(1, 'Author is required').max(100, 'Author must be less than 100 characters'),
  ISBN: z.string()
    .min(1, 'ISBN is required')
    .min(10, 'ISBN must be at least 10 characters')
    .max(17, 'ISBN must be less than 17 characters')
    .regex(/^[\d-]+$/, 'ISBN must contain only numbers and hyphens'),
  publicationDate: z.string().optional().refine((date) => {
    if (!date || date === '') return true; // Allow empty dates
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, 'Please enter a valid date'),
  genre: z.string().min(1, 'Genre is required'),
  copies: z.number().min(1, 'At least 1 copy is required').max(100, 'Maximum 100 copies allowed'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
})

type BookFormData = z.infer<typeof bookSchema>

export default function CreateBookForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      author: '',
      ISBN: '',
      publicationDate: '',
      genre: '',
      copies: 1,
      description: ''
    }
  })

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
    setImagePreview(null)
    // Clear file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const onSubmit = async (data: BookFormData) => {
    try {
      setLoading(true)

      // Validate authentication before proceeding
      const token = localStorage.getItem('token') || sessionStorage.getItem('authToken')
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to continue.",
          variant: "destructive",
        })
        router.push('/admin/auth')
        return
      }

      // Clean and validate data before sending
      const cleanedData = {
        title: data.title?.trim() || '',
        author: data.author?.trim() || '',
        ISBN: data.ISBN?.trim() || '',
        publicationDate: data.publicationDate?.trim() || '',
        genre: data.genre?.trim() || '',
        copies: Number(data.copies) || 1,
        description: data.description?.trim() || ''
      }

      // Additional client-side validation
      if (!cleanedData.title) {
        toast({
          title: "Validation Error",
          description: "Title is required",
          variant: "destructive",
        })
        return
      }
      if (!cleanedData.author) {
        toast({
          title: "Validation Error", 
          description: "Author is required",
          variant: "destructive",
        })
        return
      }
      if (!cleanedData.ISBN) {
        toast({
          title: "Validation Error",
          description: "ISBN is required", 
          variant: "destructive",
        })
        return
      }
      if (!cleanedData.genre) {
        toast({
          title: "Validation Error",
          description: "Genre is required",
          variant: "destructive",
        })
        return
      }

      // Create FormData for multipart/form-data
      const formData = new FormData()
      
      // Add all book data (only non-empty values)
      Object.entries(cleanedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value.toString())
        }
      })

      // Add image if selected
      if (imageFile) {
        formData.append('image', imageFile)
      }

      // Log the data being sent for debugging
      console.log('Sending book data:', Object.fromEntries(formData.entries()))

      const response = await adminService.createBook(formData)

      toast({
        title: "Success",
        description: "Book created successfully!",
      })

      // Clear form
      reset()
      removeImage()
      
      router.push('/admin/books')
    } catch (error: any) {
      console.error('Error creating book:', error)
      
      // Handle different types of errors
      if (error.response?.status === 401 || error.message?.includes('credentials')) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        })
        router.push('/admin/login')
      } else if (error.response?.data?.error === 'Validation failed' && error.response?.data?.details) {
        // Handle validation errors from server
        const details = error.response.data.details
        const errorMessages = Object.entries(details).map(([field, message]) => 
          `${field}: ${message}`
        ).join(', ')
        
        toast({
          title: "Validation Error",
          description: errorMessages,
          variant: "destructive",
        })
      } else if (error.response?.data?.details) {
        // Handle other detailed errors
        const details = error.response.data.details
        Object.entries(details).forEach(([field, message]) => {
          toast({
            title: "Error",
            description: `${field}: ${message}`,
            variant: "destructive",
          })
        })
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message || "Failed to create book. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Book</CardTitle>
        <CardDescription>
          Enter the details of the new book. All fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Book Cover Image</Label>
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload book cover image
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
                    width={120}
                    height={160}
                    className="rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
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
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
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
            <Label htmlFor="ISBN">ISBN *</Label>
            <Input
              id="ISBN"
              {...register('ISBN')}
              placeholder="Enter ISBN (e.g., 978-0-123456-78-9)"
              className={errors.ISBN ? 'border-red-500' : ''}
            />
            {errors.ISBN && (
              <p className="text-sm text-red-600">{errors.ISBN.message}</p>
            )}
          </div>

          {/* Publication Date and Genre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publicationDate">Publication Date</Label>
              <Input
                id="publicationDate"
                type="date"
                {...register('publicationDate')}
                className={errors.publicationDate ? 'border-red-500' : ''}
              />
              {errors.publicationDate && (
                <p className="text-sm text-red-600">{errors.publicationDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre *</Label>
              <select
                id="genre"
                {...register('genre')}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.genre ? 'border-red-500' : ''}`}
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
            <Label htmlFor="copies">Number of Copies *</Label>
            <Input
              id="copies"
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter book description (optional)"
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/books')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Book'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}