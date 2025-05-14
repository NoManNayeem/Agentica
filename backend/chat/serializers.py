# chat/serializers.py

from rest_framework import serializers
from .models import ChatSession, ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    """
    Serializer for reading chat messages.
    """
    class Meta:
        model = ChatMessage
        fields = ("id", "sender", "content", "timestamp")
        read_only_fields = fields


class ChatMessageCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for posting a new user message.
    - Validates that the session belongs to the requesting user.
    - Automatically sets sender to 'user'.
    """
    session = serializers.PrimaryKeyRelatedField(
        queryset=ChatSession.objects.all(),
        write_only=True,
        help_text="ID of the ChatSession to post this message to"
    )
    content = serializers.CharField(help_text="The user's message text")

    class Meta:
        model = ChatMessage
        fields = ("session", "content")

    def validate_session(self, session):
        user = self.context["request"].user
        if session.user != user:
            raise serializers.ValidationError(
                "You can only post messages to your own sessions."
            )
        return session

    def create(self, validated_data):
        session = validated_data["session"]
        content = validated_data["content"]

        # Create the user's message
        user_msg = ChatMessage.objects.create(
            session=session,
            sender=ChatMessage.SENDER_USER,
            content=content
        )

        # NOTE: Hook in your LLM here to generate the bot's reply.
        # Example:
        # bot_text = call_your_llm_api(content)
        # ChatMessage.objects.create(
        #     session=session,
        #     sender=ChatMessage.SENDER_BOT,
        #     content=bot_text
        # )

        return user_msg


class ChatSessionSerializer(serializers.ModelSerializer):
    """
    Serializer for reading a chat session with its messages.
    """
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatSession
        fields = ("id", "title", "created_at", "updated_at", "messages")
        read_only_fields = ("id", "created_at", "updated_at", "messages")


class ChatSessionCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new chat session.
    - Automatically assigns the requesting user.
    """
    title = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=200,
        help_text="Optional title for the session"
    )

    class Meta:
        model = ChatSession
        fields = ("title",)

    def create(self, validated_data):
        user = self.context["request"].user
        return ChatSession.objects.create(user=user, **validated_data)
