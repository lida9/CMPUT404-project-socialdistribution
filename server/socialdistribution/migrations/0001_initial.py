# Generated by Django 3.1.6 on 2021-02-27 17:50

from django.conf import settings
import django.contrib.auth.models
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import socialdistribution.models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(max_length=60, unique=True)),
                ('username', models.CharField(max_length=30)),
                ('is_admin', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('authorID', models.CharField(default=socialdistribution.models.uuid_hex, editable=False, max_length=40, unique=True)),
                ('github', models.URLField(blank=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('comment', models.TextField()),
                ('contentType', models.CharField(default='text/plain', max_length=20)),
                ('published', models.DateTimeField(auto_now_add=True)),
                ('commentID', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False, unique=True)),
                ('author_write_comment_ID', models.CharField(max_length=40)),
                ('author_write_article_ID', models.CharField(max_length=40)),
            ],
        ),
        migrations.CreateModel(
            name='Inbox',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('authorID', models.CharField(max_length=40, unique=True)),
                ('items', django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), default=list, size=None)),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('title', models.CharField(max_length=200)),
                ('postID', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False, unique=True)),
                ('source', models.URLField()),
                ('origin', models.URLField()),
                ('description', models.TextField()),
                ('contentType', models.CharField(default='text/plain', max_length=20)),
                ('content', models.TextField()),
                ('authorID', models.CharField(max_length=40)),
                ('count', models.IntegerField(default=0)),
                ('published', models.DateTimeField(auto_now_add=True)),
                ('visibility', models.CharField(default='PUBLIC', max_length=10)),
                ('unlisted', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='LikePost',
            fields=[
                ('type', models.CharField(max_length=100)),
                ('at_context', models.URLField()),
                ('summary', models.CharField(max_length=100)),
                ('published', models.DateTimeField(auto_now_add=True)),
                ('likeID', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False, unique=True)),
                ('author_like_ID', models.CharField(max_length=40)),
                ('author_write_article_ID', models.CharField(max_length=40)),
                ('postID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='socialdistribution.post')),
            ],
        ),
        migrations.CreateModel(
            name='LikeComment',
            fields=[
                ('type', models.CharField(max_length=100)),
                ('at_context', models.URLField()),
                ('summary', models.CharField(max_length=100)),
                ('published', models.DateTimeField(auto_now_add=True)),
                ('likeID', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False, unique=True)),
                ('author_like_ID', models.CharField(max_length=40)),
                ('author_write_article_ID', models.CharField(max_length=40)),
                ('commentID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='socialdistribution.comment')),
                ('postID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='socialdistribution.post')),
            ],
        ),
        migrations.CreateModel(
            name='FriendRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('current_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='author', to=settings.AUTH_USER_MODEL)),
                ('users', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Follow',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('current_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='owner', to=settings.AUTH_USER_MODEL)),
                ('users', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='comment',
            name='postID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='socialdistribution.post'),
        ),
    ]
