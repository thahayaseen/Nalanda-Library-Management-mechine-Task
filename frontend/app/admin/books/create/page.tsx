'use client'

import CreateBookForm from '@/components/admin/CreateBookForm'

export default function CreateBookPage() {
  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Book</h1>
          <p className="text-gray-600">Fill in the details to add a new book to the library</p>
        </div>
        <CreateBookForm />
      </div>
    </div>
  )
}
