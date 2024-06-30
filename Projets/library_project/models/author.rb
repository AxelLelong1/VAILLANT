# models/author.rb
class Author
  attr_reader :name

  def initialize(name)
    @name = name
  end
end