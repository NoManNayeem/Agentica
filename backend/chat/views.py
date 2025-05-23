# chat/views.py

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from agno.agent import RunResponse


from .models import ChatSession, ChatMessage
from .serializers import (
    ChatSessionSerializer,
    ChatSessionCreateSerializer,
    ChatMessageSerializer,
    ChatMessageCreateSerializer,
)

from .agent import get_response_content



class ChatSessionListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/chat/sessions/ → list all sessions for the user,
                                auto-creating one if none exist
    POST /api/chat/sessions/ → create a new session
    """
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ChatSessionCreateSerializer
        return ChatSessionSerializer

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        # If user has no sessions yet, auto-create one
        if not qs.exists():
            new_session = ChatSession.objects.create(user=request.user)
            data = ChatSessionSerializer(new_session).data
            return Response([data], status=status.HTTP_200_OK)
        return super().list(request, *args, **kwargs)

    # Serializer’s create() already attaches `request.user`
    def perform_create(self, serializer):
        serializer.save()


class ChatSessionDetailView(generics.RetrieveAPIView):
    """
    GET /api/chat/sessions/{session_id}/ →
       retrieve a session and its messages (or return an empty skeleton)
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSessionSerializer
    lookup_url_kwarg = "session_id"

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        try:
            return super().retrieve(request, *args, **kwargs)
        except NotFound:
            # Instead of a 404, return an “empty” session payload
            return Response(
                {
                    "id": None,
                    "title": "",
                    "created_at": None,
                    "updated_at": None,
                    "messages": [],
                },
                status=status.HTTP_200_OK,
            )


class ChatMessageCreateView(generics.CreateAPIView):
    """
    POST /api/chat/messages/ → post a user message, then respond with a dummy bot reply

    Request body:
      { "session": <session_id>, "content": "<your message>" }

    Response:
      {
        "user_message": { id, sender, content, timestamp },
        "bot_message": { id, sender, content, timestamp }
      }
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ChatMessageCreateSerializer

    def create(self, request, *args, **kwargs):
        # Validate & create the user’s message
        serializer = self.get_serializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user_msg = serializer.save()

        # Store response in a variable
        try:
            response= get_response_content(user_msg.content)
            if not response:
                raise ValueError("Empty response from agent")
            bot_content = response
        except Exception as e:
            bot_content = "I apologize, I'm having trouble generating a joke right now."
        # print(response.content)
        bot_content = f"Agentica: {response}"

        # ✅ FIXED: define bot_msg before using it
        bot_msg = ChatMessage.objects.create(
            session=user_msg.session,
            sender=ChatMessage.SENDER_BOT,
            content=bot_content,
        )

        return Response(
            {
                "user_message": ChatMessageSerializer(user_msg).data,
                "bot_message": ChatMessageSerializer(bot_msg).data,
            },
            status=status.HTTP_201_CREATED,
        )
