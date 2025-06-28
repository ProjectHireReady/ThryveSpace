from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from .serializers import CreateGuestSerializer


# Create your views here.
class GuestCreateView(APIView):
    def post(self, request):
        session_key = request.session.session_key

        if not session_key:
            request.session.create()
            session_key = request.session.session_key

        if request.session.get("user_id"):
            user = CustomUser.objects.get(id=request.session["user_id"])
            return Response(CreateGuestSerializer(user).data, status=status.HTTP_200_OK)

        user = CustomUser.objects.create()
        request.session["user_id"] = str(user.id)

        serializer = CreateGuestSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
