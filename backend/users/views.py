from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from .models import CustomUser
from .serializers import (
    CreateGuestSerializer,
    ResetTokenSerializer,
    GuestUpgradeSerializer,
    SignUpSerializer,
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

            token, _ = Token.objects.get_or_create(user=user)
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

            Token.objects.filter(user=user).delete()
            print(f"Resetting token for user {user.id}")

            token = Token.objects.create(user=user)
            print(f"User {user} requested a reset. New Token id is {token.key}")
            return Response(
                {
                    "message": "Token reset successful.",
                    "token": token.key,
                    "user_id": str(user.id),
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GuestUpgradeView(generics.UpdateAPIView):
    serializer_class = GuestUpgradeSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response(
            {"message": "Logged out successfully"}, status=status.HTTP_200_OK
        )


class SignUpView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = SignUpSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        token = Token.objects.create(user=user)

        serializer = SignUpSerializer(user)

        return Response(
            {
                "message": "User registered successfully",
                "token": token.key,
                "user": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
