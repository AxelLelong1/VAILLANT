# lib/book.rb
require_relative '../models/author'

class Book
  attr_reader :title, :author

  def initialize(title, author)
    @title = title
    @author = author
  end

  def to_s
    "#{title} by #{author.name}"
  end
end