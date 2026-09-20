from django.db import models
from vehicles.models import Vehicle


class Booking(models.Model):
    RENTAL_TYPES = [
    ('rental', 'Rent a Car'),
    ('self_drive', 'Self Drive'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.PROTECT,
        related_name='bookings'
    )

    # Customer information
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30)

    # Trip information
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)

    pickup_datetime = models.DateTimeField()
    return_datetime = models.DateTimeField()
    rental_type = models.CharField(max_length=20,choices=RENTAL_TYPES,default='rental')

    # Booking information
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.full_name} - {self.vehicle.name}'