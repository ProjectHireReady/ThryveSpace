from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, authenticate, logout
from .models import CustomUser
from .serializers import (
    CreateGuestSerializer,
    ResetTokenSerializer,
    GuestUpgradeSerializer,
    LoginSerializer,
)


class GuestCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        user = request.user
        print(request.META.get("HTTP_AUTHORIZATION"))
        print(request.auth)
        if user.is_anonymous:
            print("Creating a new guest user")
            user = CustomUser.objects.create()

            token, created = Token.objects.get_or_create(user=user)
            print(f"Token created: {token.key} for user {user.id}")

            data = CreateGuestSerializer(user).data
            data["token"] = token.key
            return Response(data, status=status.HTTP_201_CREATED)
        print(f"existing user: {user}")

        serializer = CreateGuestSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ResetTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetTokenSerializer(data=request.data)
        print(f"Reset token data: {request.data}")
        if serializer.is_valid():
            user = serializer.context["user"]
            user.reset_token = None
            user.save()

            login(request, user)
            print(
                f"User {user} requested a reset. New session id is {request.session.session_key}"
            )
            return Response(
                {"message": "Session reset successful.", "user_id": str(user.id)},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GuestUpgradeView(generics.UpdateAPIView):
    serializer_class = GuestUpgradeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            request,
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )

        if user is not None:
            login(request, user)
            return Response(
                {"message": "Login successful", "user_id": str(user.id)},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(
            {"message": "Logged out successfully"}, status=status.HTTP_200_OK
        )
