import { IBook } from "shared/types/Book.interface";

export class bookDto {
  private title: string;
  private author: string;
  private ISBN: string;
  private publicationDate: Date;
  private genre: string;
  private copies: number;
  private image: string;
  private listed: boolean;
  
  constructor(book: IBook, isAdmin=false) {
    this.title = book.title;
    this.author = book.author;
    this.ISBN = book.ISBN;
    this.publicationDate = book.publicationDate;
    this.genre = book.genre;
    this.copies = book.copies;
    this.image=book.image
    if(isAdmin){
      this.listed=book.listed
    }
  }
}
