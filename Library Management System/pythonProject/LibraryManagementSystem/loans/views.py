from rest_framework import viewsets, status
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import Loan
from .serializers import LoanSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny
from books.models import Book
import stripe
from django.conf import settings
from rest_framework.decorators import action
from rest_framework.decorators import action
from django.db.models import Sum

stripe.api_key = "sk_test_51QJIbLFFxitBtFz7F9UNigYKQNFHVihiILqdQC9YINQ18CcuLiUWrC5WnEPgIpnvt77geca2I7PiDPRc9moniMD800ETytKXNL"

class LoanViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @method_decorator(csrf_exempt)
    def create(self, request, *args, **kwargs):
        data = request.data
        user_id = data.get('user_id')
        book_id = data.get('book_id')

        if not user_id or not book_id:
            return Response({"error": "user_id and book_id are required."}, status=status.HTTP_400_BAD_REQUEST)


        try:
            book = Book.objects.get(book_id=book_id)
        except Book.DoesNotExist:
            return Response({"error": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

        print(f"Before Decrease - Book ID: {book_id}, Available Copies: {book.available_copies}")

        if book.available_copies <= 0:
            return Response({"error": "No available copies for this book."}, status=status.HTTP_400_BAD_REQUEST)

        book.available_copies -= 1
        book.save()

        print(f"After Decrease - Book ID: {book_id}, Available Copies: {book.available_copies}")

        issue_date = timezone.now().date()
        due_date = issue_date + timedelta(days=15)

        loan = Loan.objects.create(
            user_id=user_id,
            book_id=book_id,
            issue_date=issue_date,
            due_date=due_date,
            status='Borrowed'
        )

        serializer = LoanSerializer(loan)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list_user_loans(self, request, user_id, *args, **kwargs):
        if user_id == 0:
            loans = Loan.objects.filter(status='Borrowed')
        else:
            loans = Loan.objects.filter(user_id=user_id)

        serializer = LoanSerializer(loans, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='returned_loans')
    def list_returned_loans(self, request, *args, **kwargs):
        loans = Loan.objects.filter(status='Returned')
        serializer = LoanSerializer(loans, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='all_loans')
    def list_all_loans(self, request, *args, **kwargs):
        loans = Loan.objects.filter(status='Borrowed')
        serializer = LoanSerializer(loans, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def return_book(self, request, *args, **kwargs):
        loan_id = request.data.get('loan_id')
        if not loan_id:
            return Response({"error": "loan_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            loan = Loan.objects.get(loan_id=loan_id, status='Borrowed')
        except Loan.DoesNotExist:
            return Response({"error": "Loan not found or already returned."}, status=status.HTTP_404_NOT_FOUND)

        if loan.fine > 0:
            try:
                payment_intent = stripe.PaymentIntent.create(
                    amount=int(loan.fine * 100),
                    currency="usd",
                    metadata={"loan_id": loan.loan_id}
                )
                return Response({"client_secret": payment_intent.client_secret}, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return self.complete_return(loan)

    @action(detail=False, methods=['post'], url_path='confirm_return')
    def confirm_return(self, request, *args, **kwargs):
        loan_id = request.data.get('loan_id')
        payment_successful = request.data.get('payment_successful', False)

        if not loan_id:
            return Response({"error": "loan_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            loan = Loan.objects.get(loan_id=loan_id, status='Borrowed')
        except Loan.DoesNotExist:
            return Response({"error": "Loan not found or already returned."}, status=status.HTTP_404_NOT_FOUND)

        if loan.fine > 0 and not payment_successful:
            return Response({"error": "Payment required for return"}, status=status.HTTP_403_FORBIDDEN)

        return self.complete_return(loan)

    def complete_return(self, loan):
        loan.return_date = timezone.now().date()
        loan.status = 'Returned'
        loan.save()

        book = Book.objects.get(book_id=loan.book_id)
        book.available_copies += 1
        book.save()

        print(f"Completed return for Loan ID: {loan.loan_id} - Status: {loan.status}")

        serializer = LoanSerializer(loan)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='fine_analysis')
    def fine_analysis(self, request, *args, **kwargs):
        pending_fines = Loan.objects.filter(status='Borrowed', fine__gt=0).aggregate(total_pending=Sum('fine'))[
                            'total_pending'] or 0

        collected_fines = Loan.objects.filter(status='Returned', fine__gt=0).aggregate(total_collected=Sum('fine'))[
                              'total_collected'] or 0

        return Response({
            "pending_fines": pending_fines,
            "collected_fines": collected_fines
        }, status=status.HTTP_200_OK)