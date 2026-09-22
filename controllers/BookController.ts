import { BookRepository } from "@/repositories/BookRepository";

export const BookController = {
  list() {
    return { ok: true as const, data: BookRepository.findAll() };
  },
};
