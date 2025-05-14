# chat/urls.py

from django.urls import path
from .views import (
    ChatSessionListCreateView,
    ChatSessionDetailView,
    ChatMessageCreateView,
)

app_name = "chat"

urlpatterns = [
    # List all chat sessions or create a new one
    path(
        "sessions/",
        ChatSessionListCreateView.as_view(),
        name="sessions-list-create",
    ),
    # Retrieve a specific session (including its messages)
    path(
        "sessions/<int:session_id>/",
        ChatSessionDetailView.as_view(),
        name="sessions-detail",
    ),
    # Post a new message (user → bot) within a session
    path(
        "messages/",
        ChatMessageCreateView.as_view(),
        name="messages-create",
    ),
]
