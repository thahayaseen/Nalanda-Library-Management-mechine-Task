
import { BaseRepository } from "../basic.repository";
import { BookModel, IbookDocument } from "@/models/implementation/book.model";
import { Types } from "mongoose";
import { IbookRepository } from "../interface/Ibook.repository";

export class bookRepository
  extends BaseRepository<IbookDocument>
  implements IbookRepository
{
  constructor() {
    super(BookModel);
  }
  async borrowBook(id: Types.ObjectId): Promise<void> {
    await this.findByIdAndUpdate(id, { $inc: { copies: -1 } });
    return;
  }
}
