from django.db import models


class SiteSettings(models.Model):
    company_name = models.CharField(max_length=150, default='CarRental')
    logo = models.ImageField(upload_to='site/logo/', blank=True, null=True)
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    address = models.CharField(max_length=255, blank=True)
    business_hours = models.CharField(max_length=255, blank=True)
    google_map_url = models.TextField(blank=True)
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    whatsapp_number = models.CharField(max_length=30, blank=True)

    # Homepage statistics
    vehicles_available = models.PositiveIntegerField(default=0)
    happy_customers = models.PositiveIntegerField(default=0)
    professional_drivers = models.PositiveIntegerField(default=0)
    years_experience = models.PositiveIntegerField(default=0)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return self.company_name