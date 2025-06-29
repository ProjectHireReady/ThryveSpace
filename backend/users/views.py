from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import login
from .models import CustomUser
from .serializers import (
    CreateGuestSerializer,
    ResetTokenSerializer,
    GuestUpgradeSerializer,
)


class GuestCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        session_key = request.session.session_key

        if not session_key:
            request.session.create()
            session_key = request.session.session_key

        print(f"session key: {session_key}")

        if request.session.get("_auth_user_id"):
            user = CustomUser.objects.get(id=request.session["_auth_user_id"])

            print(f"existing user: {user}")

            login(request, user)
            return Response(CreateGuestSerializer(user).data, status=status.HTTP_200_OK)

        user = CustomUser.objects.create()
        request.session["_auth_user_id"] = str(user.id)

        print(f"new user: {user}")

        serializer = CreateGuestSerializer(user)
        login(request, user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


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

    '''def perform_update(self, serializer):
        print("Calling perform_update")
        serializer.save()'''
