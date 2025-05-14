# users/views.py

from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .serializers import (
    RegisterSerializer,
    MyTokenObtainPairSerializer,
    UserSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    POST /api/register/ →
    Registers a new user, returns serialized user data plus JWT tokens.
    """
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary="Register a new user",
        request_body=RegisterSerializer,
        responses={
            201: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "user": openapi.Schema(type=openapi.TYPE_OBJECT, 
                                           description="Created user data"),
                    "refresh": openapi.Schema(type=openapi.TYPE_STRING, 
                                              description="JWT refresh token"),
                    "access": openapi.Schema(type=openapi.TYPE_STRING, 
                                             description="JWT access token"),
                },
            ),
            400: "Validation errors"
        },
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)
        refresh = str(refresh)

        user_data = UserSerializer(user, context={"request": request}).data

        return Response(
            {"user": user_data, "access": access, "refresh": refresh},
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    """
    POST /api/login/ →
    Returns JWT tokens and user data.
    """
    serializer_class = MyTokenObtainPairSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary="Obtain JWT tokens",
        responses={
            200: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "access": openapi.Schema(type=openapi.TYPE_STRING),
                    "refresh": openapi.Schema(type=openapi.TYPE_STRING),
                    "user": openapi.Schema(type=openapi.TYPE_OBJECT),
                },
            ),
            401: "Invalid credentials",
        },
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class MeView(generics.RetrieveAPIView):
    """
    GET /api/me/ →
    Retrieve the currently authenticated user's data (including profile).
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Get current authenticated user",
        responses={200: UserSerializer},
    )
    def get(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def get_object(self):
        return self.request.user
