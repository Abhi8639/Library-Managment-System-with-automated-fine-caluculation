from rest_framework import viewsets, status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data
        required_fields = ['isbn', 'title', 'author', 'category', 'total_copies', 'available_copies']
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return Response(
                {"error": f"Missing fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            response = super().update(request, *args, **kwargs)
            return response
        except Exception as e:
            print("Error during update:", e)
            return Response({"error": "An error occurred during update"},
                            status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        print("Destroy method called for book ID:", kwargs.get('pk'))
        try:
            return super().destroy(request, *args, **kwargs)
        except Book.DoesNotExist:
            raise NotFound({"error": "Book not found"})
        except Exception as e:
            print("Error during deletion:", e)
            return Response({"error": "An error occurred during deletion"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
