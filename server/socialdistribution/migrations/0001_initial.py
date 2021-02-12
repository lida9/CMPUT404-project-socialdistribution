# Generated by Django 3.1.6 on 2021-02-10 05:43

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('postID', models.CharField(max_length=200)),
                ('source', models.CharField(max_length=200)),
                ('origin', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('contentType', models.CharField(max_length=20)),
                ('content', models.TextField()),
                ('count', models.IntegerField()),
                ('size', models.IntegerField()),
                ('comments', models.CharField(max_length=200)),
                ('published', models.DateField(auto_now_add=True)),
                ('visibility', models.CharField(default='PUBLIC', max_length=10)),
                ('unlisted', models.BooleanField(default=False)),
            ],
        ),
    ]