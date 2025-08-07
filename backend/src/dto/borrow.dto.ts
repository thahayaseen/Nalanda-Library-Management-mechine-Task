import { IBorrowRecord, IBorrowRecordPopulated } from "shared/types/Borrowrecord.interface";

export class borrowDto{
    private bookname:string;
    private borrowedDate;
    private Returned;
    private status;
    constructor(book:IBorrowRecordPopulated){
        this.bookname=book.book.title
        this.borrowedDate=book.borrowedAt;
        this.Returned=book.returnedAt;
        this.status=book.status
    }
}