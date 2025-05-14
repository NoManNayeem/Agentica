# users/serializers.py

from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Profile

User = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the Profile model.
    """
    photo = serializers.ImageField(read_only=True)

    class Meta:
        model = Profile
        fields = ("photo", "address", "phone")
        read_only_fields = fields


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model, including nested profile.
    """
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "profile")
        read_only_fields = ("id", "profile")


class RegisterSerializer(serializers.ModelSerializer):
    """
    Handles user registration.
    Enforces unique email and minimum password length.
    """
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="A user with that email already exists.")]
    )
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def create(self, validated_data):
        # Use create_user to ensure password is hashed
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user

    def validate_password(self, value):
        # Optional: enforce extra password rules (e.g. complexity)
        # if not any(char.isdigit() for char in value):
        #     raise serializers.ValidationError("Password must contain at least one digit.")
        return value


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extends SimpleJWT's token serializer to include user data in the response.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token["username"] = user.username
        token["email"] = user.email
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Include full user & profile info under "user"
        data["user"] = UserSerializer(self.user, context=self.context).data
        return data
