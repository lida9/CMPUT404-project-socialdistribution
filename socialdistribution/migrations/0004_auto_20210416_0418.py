# Generated by Django 3.1.7 on 2021-04-16 04:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('socialdistribution', '0003_auto_20210416_0410'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='postID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='socialdistribution.post'),
        ),
    ]