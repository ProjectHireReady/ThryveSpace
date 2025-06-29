from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import login
from .models import CustomUser
from .serializers import CreateGuestSerializer


# Create your views here.
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
