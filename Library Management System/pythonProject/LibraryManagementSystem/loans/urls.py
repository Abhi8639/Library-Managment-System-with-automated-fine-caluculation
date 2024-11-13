from django.urls import path
from .views import LoanViewSet

urlpatterns = [
    path('add/', LoanViewSet.as_view({'post': 'create'})),
    path('my_bookings/<int:user_id>/', LoanViewSet.as_view({'get': 'list_user_loans'})),
    path('return/', LoanViewSet.as_view({'post': 'return_book'})),
    path('confirm_return/', LoanViewSet.as_view({'post': 'confirm_return'})),
    path('all_loans/', LoanViewSet.as_view({'get': 'list_all_loans'})),
    path('returned_loans/', LoanViewSet.as_view({'get': 'list_returned_loans'})),
    path('fine_analysis/', LoanViewSet.as_view({'get': 'fine_analysis'})),
]
