# Generated by Django 3.1.7 on 2021-03-04 03:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('socialdistribution', '0002_post_comment_list'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='likepost',
            name='at_context',
        ),
    ]