# lib/library.rb
require_relative 'book'

class Library
  def initialize
    @books = []
  end

  def add_book(book)
    @books << book
  end

  def list_books
    puts "Listing all books in the library:"
    @books.each { |book| puts book }
  end
end