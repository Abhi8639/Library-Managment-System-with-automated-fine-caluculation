from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True},'role': {'required': False, 'default': 'Member'},}

    def create(self, validated_data):
        user = User.objects.create_user(
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'Member')
        )
        return user


from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(username=email, password=password)
            if user is None:
                raise serializers.ValidationError("Invalid credentials")
        else:
            raise serializers.ValidationError("Both email and password are required")

        return {
            'user': user,
        }



def validate(self, data):
    print(f"Validating login with email: {data.get('email')} and password: {data.get('password')}")

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        raise serializers.ValidationError("Both email and password are required.")

    user = authenticate(username=email, password=password)

    if user is None:
        raise serializers.ValidationError("Invalid email or password.")

    return user
