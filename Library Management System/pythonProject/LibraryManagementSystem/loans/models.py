from django.db import models

class Loan(models.Model):
    loan_id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()
    book_id = models.IntegerField(null=True, blank=True)
    issue_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    fine = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=10, choices=[('Borrowed', 'Borrowed'), ('Returned', 'Returned')], default='Borrowed')

    class Meta:
        db_table = 'loans'

    def __str__(self):
        return f"Loan {self.loan_id}: User {self.user_id} borrowed Book {self.book_id}"
