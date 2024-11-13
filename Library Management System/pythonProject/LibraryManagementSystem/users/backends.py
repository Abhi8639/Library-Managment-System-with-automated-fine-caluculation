from django.contrib.auth.backends import ModelBackend
from .models import User

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        print(f"Authenticating user with email: {username}")
        try:
            user = User.objects.get(email=username)
            print(f"User found: {user.email}")
            if user.check_password(password):
                print("Password is correct")
                return user
            else:
                print("Invalid password")
        except User.DoesNotExist:
            print("User does not exist")
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
