# users/models.py

from django.contrib.auth import get_user_model
from django.db import models
from django.core.validators import RegexValidator
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.urls import reverse

User = get_user_model()

def user_directory_path(instance, filename):
    """
    Build a user-specific upload path:
    MEDIA_ROOT/profiles/user_<id>/<filename>
    """
    return f"profiles/user_{instance.user.id}/{filename}"

class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
        verbose_name="User"
    )
    photo = models.ImageField(
        upload_to=user_directory_path,
        blank=True,
        null=True,
        verbose_name="Profile Photo"
    )
    address = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Address"
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        validators=[
            RegexValidator(
                regex=r"^\+?1?\d{9,15}$",
                message="Phone number must be in the format '+999999999'. Up to 15 digits allowed."
            )
        ],
        verbose_name="Phone Number"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Updated At"
    )

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"
        ordering = ["user__username"]

    def __str__(self):
        return f"{self.user.username}'s Profile"

    def get_absolute_url(self):
        """
        Returns the URL to view this user's profile.
        """
        return reverse("users:profile-detail", args=[self.user.username])

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Automatically create a Profile whenever a new User is created.
    """
    if created:
        Profile.objects.create(user=instance)
