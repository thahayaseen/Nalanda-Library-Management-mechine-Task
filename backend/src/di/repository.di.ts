import {bookRepository,borrowRepository,userRepository} from '@/repositories/implementation'
export const BookRepository=new bookRepository()
export const BorrowRepository=new borrowRepository()
export const UserRepository=new userRepository()