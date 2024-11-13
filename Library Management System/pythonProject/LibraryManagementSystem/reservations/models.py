from django.db import models

from django.db import models

class Reservation(models.Model):
    reservation_id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()
    book_id = models.IntegerField()
    reservation_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=[('Pending', 'Pending'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled'),('Loaned', 'Loaned')], default='Pending')

    class Meta:
        db_table = 'reservations'

    def __str__(self):
        return f"Reservation {self.reservation_id}: User {self.user_id} reserved Book {self.book_id}"
