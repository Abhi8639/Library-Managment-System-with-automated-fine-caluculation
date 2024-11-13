from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['book_id', 'isbn', 'title', 'author', 'category', 'total_copies', 'available_copies']
