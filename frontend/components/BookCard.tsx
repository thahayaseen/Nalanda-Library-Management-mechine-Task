import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IBook } from '@/types/Book.interface'

interface BookCardProps {
  book: IBook
}

export default function BookCard({ book }: BookCardProps) {
  console.log(book,'fdasfa');
  return (
    <Link href={`/books/${book.ISBN}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="p-4">
          <div className="aspect-[3/4] relative mb-4">
            <Image
              src={process.env.NEXT_PUBLIC_API_URL+'/'+book.image }
              alt={book.title}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
              <CardDescription className="line-clamp-1">by {book.author}</CardDescription>
            </div>
            <Badge variant={book.copies > 0 ? "default" : "destructive"} className="ml-2">
              {book.copies > 0 ? "Available" : "Out of Stock"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>{book.genre || 'N/A'}</span>
            <span>{book.copies} copies</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
