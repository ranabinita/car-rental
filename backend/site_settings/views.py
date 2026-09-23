from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.validators import URLValidator, validate_email
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.http import require_GET

from .models import SiteSettings


def get_settings():
    settings, _ = SiteSettings.objects.get_or_create(pk=1)
    return settings


@login_required(login_url='dashboard:login')
def settings_page(request):
    settings = get_settings()

    if request.method == 'POST':
        company_name = request.POST.get('company_name', '').strip()
        phone = request.POST.get('phone', '').strip()
        email = request.POST.get('email', '').strip()
        address = request.POST.get('address', '').strip()
        business_hours = request.POST.get('business_hours', '').strip()
        google_map_url = request.POST.get('google_map_url', '').strip()
        facebook_url = request.POST.get('facebook_url', '').strip()
        instagram_url = request.POST.get('instagram_url', '').strip()
        whatsapp_number = request.POST.get('whatsapp_number', '').strip()

        vehicles_available = request.POST.get('vehicles_available', '0').strip()
        happy_customers = request.POST.get('happy_customers', '0').strip()
        professional_drivers = request.POST.get('professional_drivers', '0').strip()
        years_experience = request.POST.get('years_experience', '0').strip()

        if not company_name:
            messages.error(request, 'Company name is required.')
            return render(request, 'backend/settings/form.html', {'settings': settings})

        if email:
            try:
                validate_email(email)
            except ValidationError:
                messages.error(request, 'Please enter a valid email address.')
                return render(request, 'backend/settings/form.html', {'settings': settings})

        validator = URLValidator()

        for label, url in [
            ('Google Map', google_map_url),
            ('Facebook', facebook_url),
            ('Instagram', instagram_url),
        ]:
            if url:
                try:
                    validator(url)
                except ValidationError:
                    messages.error(request, f'Please enter a valid {label} URL.')
                    return render(request, 'backend/settings/form.html', {'settings': settings})

        stats = {
            'Vehicles Available': vehicles_available,
            'Happy Customers': happy_customers,
            'Professional Drivers': professional_drivers,
            'Years of Experience': years_experience,
        }

        for label, value in stats.items():
            if not value.isdigit():
                messages.error(request, f'{label} must be a whole number.')
                return render(request, 'backend/settings/form.html', {'settings': settings})

        settings.company_name = company_name
        settings.phone = phone
        settings.email = email
        settings.address = address
        settings.business_hours = business_hours
        settings.google_map_url = google_map_url
        settings.facebook_url = facebook_url
        settings.instagram_url = instagram_url
        settings.whatsapp_number = whatsapp_number

        settings.vehicles_available = int(vehicles_available)
        settings.happy_customers = int(happy_customers)
        settings.professional_drivers = int(professional_drivers)
        settings.years_experience = int(years_experience)

        settings.save()

        messages.success(request, 'Site settings updated successfully.')
        return redirect('site_settings:settings')

    return render(request, 'backend/settings/form.html', {'settings': settings})


@require_GET
def settings_api(request):
    settings = get_settings()

    return JsonResponse({
        'company_name': settings.company_name,
        'phone': settings.phone,
        'email': settings.email,
        'address': settings.address,
        'business_hours': settings.business_hours,
        'google_map_url': settings.google_map_url,
        'facebook_url': settings.facebook_url,
        'instagram_url': settings.instagram_url,
        'whatsapp_number': settings.whatsapp_number,

        'vehicles_available': settings.vehicles_available,
        'happy_customers': settings.happy_customers,
        'professional_drivers': settings.professional_drivers,
        'years_experience': settings.years_experience,
    })