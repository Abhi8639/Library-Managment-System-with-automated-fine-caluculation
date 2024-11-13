from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Reservation
from .serializers import ReservationSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny

class ReservationViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @method_decorator(csrf_exempt)
    def create(self, request, *args, **kwargs):
        data = request.data
        user_id = data.get('user_id')
        book_id = data.get('book_id')

        if not user_id or not book_id:
            return Response({"error": "user_id and book_id are required."}, status=status.HTTP_400_BAD_REQUEST)

        reservation = Reservation.objects.create(
            user_id=user_id,
            book_id=book_id,
            status='Pending'
        )

        serializer = ReservationSerializer(reservation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list_user_reservations(self, request, user_id, *args, **kwargs):
        if user_id == 0:
            reservations = Reservation.objects.all()
        else:
            reservations = Reservation.objects.filter(user_id=user_id)

        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)

    def cancel_reservation(self, request, reservation_id, *args, **kwargs):
        try:
            reservation = Reservation.objects.get(reservation_id=reservation_id)
            reservation.status = 'Cancelled'
            reservation.save()
            return Response({"message": "Reservation cancelled successfully"}, status=status.HTTP_200_OK)
        except Reservation.DoesNotExist:
            return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)