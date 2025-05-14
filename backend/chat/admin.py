from django.contrib import admin
from .models import ChatSession, ChatMessage

@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "title", "updated_at")
    search_fields = ("user__username", "title")

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ("session", "sender", "short_content", "timestamp")
    list_filter = ("sender",)
    search_fields = ("content",)

    def short_content(self, obj):
        return obj.content[:50]
    short_content.short_description = "Content"
