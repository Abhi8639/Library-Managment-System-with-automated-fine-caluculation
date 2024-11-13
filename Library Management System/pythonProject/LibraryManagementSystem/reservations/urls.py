from django.urls import path
from .views import ReservationViewSet

urlpatterns = [
    path('add/', ReservationViewSet.as_view({'post': 'create'})),  # Create a reservation
    path('my_reservations/<int:user_id>/', ReservationViewSet.as_view({'get': 'list_user_reservations'})),  # List user reservations
    path('cancel/<int:reservation_id>/', ReservationViewSet.as_view({'post': 'cancel_reservation'})),  # Cancel reservation
]
