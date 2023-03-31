# Generated by Django 4.1.7 on 2023-03-17 14:01

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="account",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=200, null=True)),
                (
                    "phone",
                    models.CharField(
                        max_length=20,
                        null=True,
                        validators=[
                            django.core.validators.RegexValidator("^\\d{1,10}$")
                        ],
                    ),
                ),
                ("address", models.CharField(blank=True, max_length=200, null=True)),
                ("username", models.CharField(max_length=200)),
                ("password", models.CharField(max_length=200)),
                ("role", models.BigIntegerField()),
                ("parking_fee", models.FloatField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name="slot",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("status", models.BigIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name="vehicle",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("license_plate", models.CharField(max_length=10)),
                (
                    "vehicle_pic",
                    models.ImageField(blank=True, null=True, upload_to="vehicle/"),
                ),
                (
                    "user_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="manager.account",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="log",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("time_in", models.DateTimeField(null=True)),
                ("time_out", models.DateTimeField(blank=True, null=True)),
                (
                    "vehicle_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="manager.vehicle",
                    ),
                ),
            ],
        ),
    ]
