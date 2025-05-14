# users/urls.py

from django.urls import path
from .views import RegisterView, LoginView, MeView

app_name = "users"

urlpatterns = [
    # /api/users/register/
    path("register/", RegisterView.as_view(), name="register"),
    # /api/users/login/
    path("login/",    LoginView.as_view(),    name="login"),
    # /api/users/me/
    path("me/",       MeView.as_view(),       name="me"),
]
