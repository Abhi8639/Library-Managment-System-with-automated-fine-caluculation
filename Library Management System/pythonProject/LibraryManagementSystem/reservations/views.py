from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Reservation
from .serializers import ReservationSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny
import logging
from django.db.models import Count
from rest_framework.decorators import action
logger = logging.getLogger(__name__)
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

    @method_decorator(csrf_exempt)
    def loan_reservation(self, request, reservation_id, *args, **kwargs):
        try:
            logger.info(f"Attempting to update reservation with ID {reservation_id} to 'Loaned'")
            reservation = Reservation.objects.get(reservation_id=reservation_id)
            reservation.status = 'Loaned'
            reservation.save()
            logger.info(f"Reservation ID {reservation_id} status updated to 'Loaned'")
            return Response({"message": "Reservation status updated to Loaned"}, status=status.HTTP_200_OK)
        except Reservation.DoesNotExist:
            logger.error(f"Reservation with ID {reservation_id} not found")
            return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error updating reservation status: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    from django.db.models import Count
    from rest_framework.decorators import action
    import logging

    logger = logging.getLogger(__name__)

    class ReservationViewSet(viewsets.ViewSet):

        @action(detail=False, methods=['get'], url_path='status_analysis')
        def status_analysis(self, request, *args, **kwargs):
            try:
                logger.info("Starting status_analysis query.")

                status_counts = Reservation.objects.values('status').annotate(count=Count('status'))
                logger.info(f"Fetched status counts: {status_counts}")

                status_data = {status['status']: status['count'] for status in status_counts}
                status_data = {
                    'Pending': status_data.get('Pending', 0),
                    'Loaned': status_data.get('Loaned', 0),
                    'Cancelled': status_data.get('Cancelled', 0),
                }

                # Log the response data before returning
                logger.info(f"Prepared status data for response: {status_data}")
                return Response(status_data, status=status.HTTP_200_OK)

            except Exception as e:
                logger.error(f"Error in status_analysis: {e}")
                return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='status_analysis')
    def status_analysis(self, request, *args, **kwargs):
        try:
            logger.info("Starting status_analysis query.")

            status_counts = Reservation.objects.values('status').annotate(count=Count('status'))
            logger.info(f"Fetched status counts: {status_counts}")

            status_data = {status['status']: status['count'] for status in status_counts}
            status_data = {
                'Pending': status_data.get('Pending', 0),
                'Loaned': status_data.get('Loaned', 0),
                'Cancelled': status_data.get('Cancelled', 0),
            }

            logger.info(f"Prepared status data for response: {status_data}")
            return Response(status_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error in status_analysis: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)