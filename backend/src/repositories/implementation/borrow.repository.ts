import {
  BorrowRecord,
  IBorrowdDocument,
} from "@/models/implementation/borrowd.model";
import { BaseRepository } from "../basic.repository";
import { IborrowRepository } from "../interface/Iborrow.repository";
import { ImostActiveUser } from "shared/types/user.interface";
import { ImostBorrowedBookd } from "shared/types/Borrowrecord.interface";

class borrowRepository
  extends BaseRepository<IBorrowdDocument>
  implements IborrowRepository
{
  constructor() {
    super(BorrowRecord);
  }
  async mostActiveuser(): Promise<ImostActiveUser[]> {
    return await this.model.aggregate([
      { $group: { _id: "$user", borrowCount: { $sum: 1 } } },
      { $sort: { borrowCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          name: "$userDetails.name",
          email: "$userDetails.email",
          totalBorrows: "$borrowCount",
        },
      },
    ]);
  }
  async monstBorrowdBook(): Promise<ImostBorrowedBookd[]> {
    return await this.model.aggregate([
      { $match: { status: "borrowed" } },
      { $group: { _id: "$book", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          title: "$bookDetails.title",
          author: "$bookDetails.author",
          borrowCount: "$count",
        },
      },
    ]);
  }
}
