# Generated by Django 3.1.6 on 2021-02-22 05:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('socialdistribution', '0002_remove_comment_model_type'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='authorID',
            new_name='author_write_article_ID',
        ),
        migrations.AddField(
            model_name='comment',
            name='author_write_comment_ID',
            field=models.CharField(default={}, max_length=40),
            preserve_default=False,
        ),
    ]