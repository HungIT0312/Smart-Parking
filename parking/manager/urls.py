from django.contrib import admin
from django.urls import path
from . import views
urlpatterns = [
    path("", views.get_home),
    path("add-account/", views.add_account),
    path("update-account/", views.update_account),
    path("delete-account/", views.delete_account),
    path("view-all-accounts/", views.view_all_accounts),
    path("view-account/<int:account_id>/", views.view_account),
]