from rest_framework import generics, status
from rest_framework.response import Response
from .models import User
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.contrib.auth import authenticate,login



class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            print("Login request received with data:", request.data)
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            user = serializer.validated_data['user']
            print(f"User authenticated: {user.email}")

            return Response({
                "user_id": user.user_id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error during login: {e}")
            return Response({"detail": "Server error during login"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

