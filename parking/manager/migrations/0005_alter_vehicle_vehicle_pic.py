# Generated by Django 4.1.7 on 2023-04-07 09:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("manager", "0004_alter_vehicle_vehicle_pic"),
    ]

    operations = [
        migrations.AlterField(
            model_name="vehicle",
            name="vehicle_pic",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
