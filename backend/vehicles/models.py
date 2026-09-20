from django.db import models


class Vehicle(models.Model):
    VEHICLE_TYPES = [
        ('car', 'Car'),
        ('suv', 'SUV'),
        ('van', 'Van'),
        ('pickup', 'Pickup'),
        ('luxury', 'Luxury'),
    ]

    TRANSMISSION_CHOICES = [
        ('automatic', 'Automatic'),
        ('manual', 'Manual'),
    ]

    FUEL_CHOICES = [
        ('petrol', 'Petrol'),
        ('diesel', 'Diesel'),
        ('electric', 'Electric'),
        ('hybrid', 'Hybrid'),
    ]

    STATUS_CHOICES = [
        ('available', 'Available'),
        ('unavailable', 'Unavailable'),
        ('maintenance', 'Maintenance'),
    ]

    name = models.CharField(max_length=150)
    vehicle_type = models.CharField(
        max_length=20,
        choices=VEHICLE_TYPES
    )
    image = models.ImageField(
        upload_to='vehicles/',
        blank=True,
        null=True
    )
    seats = models.PositiveIntegerField(default=5)
    transmission = models.CharField(
        max_length=20,
        choices=TRANSMISSION_CHOICES
    )
    fuel_type = models.CharField(
        max_length=20,
        choices=FUEL_CHOICES
    )
    price_per_day = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='available'
    )
    description = models.TextField(
        blank=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name