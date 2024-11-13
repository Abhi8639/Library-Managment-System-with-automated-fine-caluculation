from django.urls import path
from .views import ReservationViewSet

urlpatterns = [
    path('add/', ReservationViewSet.as_view({'post': 'create'})),  # Create a reservation
    path('my_reservations/<int:user_id>/', ReservationViewSet.as_view({'get': 'list_user_reservations'})),  # List user reservations
    path('cancel/<int:reservation_id>/', ReservationViewSet.as_view({'post': 'cancel_reservation'})),  # Cancel reservation
    path('loan/<int:reservation_id>/', ReservationViewSet.as_view({'post': 'loan_reservation'})),  # Update reservation status to "Loaned"
    path('status_analysis/', ReservationViewSet.as_view({'get': 'status_analysis'})),  # Get reservation status analysis
]
