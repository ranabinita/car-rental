from django import forms
from .models import Vehicle


class VehicleForm(forms.ModelForm):
    class Meta:
        model = Vehicle
        fields = [
            'name',
            'vehicle_type',
            'image',
            'seats',
            'transmission',
            'fuel_type',
            'price_per_day',
            'status',
            'description',
        ]

        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g. Toyota Land Cruiser'
            }),
            'vehicle_type': forms.Select(attrs={
                'class': 'form-select'
            }),
            'image': forms.FileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
            'seats': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': '1'
            }),
            'transmission': forms.Select(attrs={
                'class': 'form-select'
            }),
            'fuel_type': forms.Select(attrs={
                'class': 'form-select'
            }),
            'price_per_day': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': '0',
                'step': '0.01',
                'placeholder': 'Price per day'
            }),
            'status': forms.Select(attrs={
                'class': 'form-select'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Vehicle description...'
            }),
        }