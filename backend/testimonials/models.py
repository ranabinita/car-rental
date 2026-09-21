from django.db import models

class Testimonial(models.Model):
    customer_name = models.CharField(max_length=150)
    location = models.CharField(max_length=100, blank=True)
    review = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.customer_name