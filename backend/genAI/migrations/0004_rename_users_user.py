# Generated by Django 5.0.7 on 2024-07-22 13:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('genAI', '0003_rename_newuser_users'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='users',
            new_name='user',
        ),
    ]
