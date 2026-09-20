from django.db import models


class DriverRequest(models.Model):
    VEHICLE_TYPES = [
        ('hatchback', 'Hatchback'),
        ('sedan', 'Sedan'),
        ('suv', 'SUV'),
        ('electric', 'Electric'),
        ('premium', 'Premium'),
        ('pickup', 'Pickup'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    pickup_datetime = models.DateTimeField()
    return_datetime = models.DateTimeField()
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPES)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.full_name} - {self.get_vehicle_type_display()}'