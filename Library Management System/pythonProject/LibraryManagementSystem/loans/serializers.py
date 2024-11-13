from rest_framework import serializers
from .models import Loan
from books.models import Book
from users.models import User

class LoanSerializer(serializers.ModelSerializer):
    book_title = serializers.SerializerMethodField()
    book_category = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Loan
        fields = ['loan_id', 'user_id', 'book_id', 'issue_date', 'due_date', 'return_date', 'fine', 'status', 'book_title', 'book_category', 'user_name']

    def get_book_title(self, obj):
        try:
            book = Book.objects.get(book_id=obj.book_id)
            return book.title
        except Book.DoesNotExist:
            return None

    def get_book_category(self, obj):
        try:
            book = Book.objects.get(book_id=obj.book_id)
            return book.category
        except Book.DoesNotExist:
            return None

    def get_user_name(self, obj):
        try:
            user = User.objects.get(user_id=obj.user_id)
            return user.name
        except User.DoesNotExist:
            return None
