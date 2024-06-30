# main.rb
require_relative 'lib/book'
require_relative 'lib/library'
require_relative 'models/author'

# Créer quelques auteurs
author1 = Author.new("J.K. Rowling")
author2 = Author.new("J.R.R. Tolkien")

# Créer quelques livres
book1 = Book.new("Harry Potter and the Sorcerer's Stone", author1)
book2 = Book.new("The Lord of the Rings", author2)

# Créer une bibliothèque et ajouter des livres
library = Library.new
library.add_book(book1)
library.add_book(book2)

# Afficher les livres de la bibliothèque
library.list_books