# chat/models.py

from django.db import models
from django.conf import settings


class ChatSession(models.Model):
    """
    Represents a distinct conversation (session) between a user and the AI.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="chat_sessions",
        verbose_name="User",
    )
    title = models.CharField(
        max_length=200,
        blank=True,
        help_text="Optional title for this chat session",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")

    class Meta:
        ordering = ["-updated_at"]
        verbose_name = "Chat Session"
        verbose_name_plural = "Chat Sessions"

    def __str__(self):
        return self.title or f"Session {self.pk} ({self.user.username})"


class ChatMessage(models.Model):
    """
    A single message in a ChatSession, either from the user, the bot, or the system.
    """
    SENDER_USER = "user"
    SENDER_BOT = "bot"
    SENDER_SYSTEM = "system"
    SENDER_CHOICES = [
        (SENDER_USER, "User"),
        (SENDER_BOT, "Bot"),
        (SENDER_SYSTEM, "System"),
    ]

    session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        related_name="messages",
        verbose_name="Chat Session",
    )
    sender = models.CharField(
        max_length=10,
        choices=SENDER_CHOICES,
        help_text="Who sent this message",
    )
    content = models.TextField(help_text="The message text")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Timestamp")

    class Meta:
        ordering = ["timestamp"]
        verbose_name = "Chat Message"
        verbose_name_plural = "Chat Messages"

    def __str__(self):
        return f"[{self.get_sender_display()}] {self.content[:50]}"
