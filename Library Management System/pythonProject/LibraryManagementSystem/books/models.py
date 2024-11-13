# models.py for Book
from django.db import models

class Book(models.Model):
    book_id = models.AutoField(primary_key=True)
    isbn = models.CharField(max_length=13, unique=True)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    total_copies = models.IntegerField()
    available_copies = models.IntegerField()

    class Meta:
        db_table = 'books'



    def __str__(self):
        return self.title
