# Generated by Django 4.0.4 on 2022-06-14 18:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='site',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='web.site', verbose_name='Сайт'),
        ),
        migrations.AlterField(
            model_name='articlelogentry',
            name='site',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='web.site', verbose_name='Сайт'),
        ),
        migrations.AlterField(
            model_name='articleversion',
            name='site',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='web.site', verbose_name='Сайт'),
        ),
        migrations.AlterField(
            model_name='category',
            name='site',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='web.site', verbose_name='Сайт'),
        ),
        migrations.AlterField(
            model_name='tag',
            name='site',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='web.site', verbose_name='Сайт'),
        ),
        migrations.AlterField(
            model_name='vote',
            name='site',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='web.site', verbose_name='Сайт'),
        ),
    ]
