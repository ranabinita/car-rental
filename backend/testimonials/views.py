from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_GET, require_POST

from .models import Testimonial

@login_required(login_url='dashboard:login')
def testimonial_list(request):
    testimonials = Testimonial.objects.all()
    return render(request, 'backend/testimonials/list.html', {'testimonials': testimonials})

@login_required(login_url='dashboard:login')
def testimonial_add(request):
    if request.method == 'POST':
        customer_name = request.POST.get('customer_name', '').strip()
        location = request.POST.get('location', '').strip()
        review = request.POST.get('review', '').strip()
        rating = request.POST.get('rating', '5')
        order = request.POST.get('order', '0')

        if not customer_name or not review:
            messages.error(request, 'Customer name and review are required.')
            return render(request, 'backend/testimonials/form.html')

        try:
            rating = int(rating)
            order = int(order)
        except ValueError:
            messages.error(request, 'Rating and order must be valid numbers.')
            return render(request, 'backend/testimonials/form.html')

        if rating < 1 or rating > 5:
            messages.error(request, 'Rating must be between 1 and 5.')
            return render(request, 'backend/testimonials/form.html')

        Testimonial.objects.create(
            customer_name=customer_name,
            location=location,
            review=review,
            rating=rating,
            order=max(order, 0),
            is_active=request.POST.get('is_active') == 'on'
        )

        messages.success(request, 'Testimonial added successfully.')
        return redirect('testimonials:list')

    return render(request, 'backend/testimonials/form.html')

@login_required(login_url='dashboard:login')
def testimonial_edit(request, pk):
    testimonial = get_object_or_404(Testimonial, pk=pk)

    if request.method == 'POST':
        customer_name = request.POST.get('customer_name', '').strip()
        location = request.POST.get('location', '').strip()
        review = request.POST.get('review', '').strip()

        try:
            rating = int(request.POST.get('rating', '5'))
            order = int(request.POST.get('order', '0'))
        except ValueError:
            messages.error(request, 'Rating and order must be valid numbers.')
            return render(request, 'backend/testimonials/form.html', {'testimonial': testimonial})

        if not customer_name or not review:
            messages.error(request, 'Customer name and review are required.')
            return render(request, 'backend/testimonials/form.html', {'testimonial': testimonial})

        if rating < 1 or rating > 5:
            messages.error(request, 'Rating must be between 1 and 5.')
            return render(request, 'backend/testimonials/form.html', {'testimonial': testimonial})

        testimonial.customer_name = customer_name
        testimonial.location = location
        testimonial.review = review
        testimonial.rating = rating
        testimonial.order = max(order, 0)
        testimonial.is_active = request.POST.get('is_active') == 'on'
        testimonial.save()

        messages.success(request, 'Testimonial updated successfully.')
        return redirect('testimonials:list')

    return render(request, 'backend/testimonials/form.html', {'testimonial': testimonial})

@login_required(login_url='dashboard:login')
@require_POST
def testimonial_delete(request, pk):
    testimonial = get_object_or_404(Testimonial, pk=pk)
    testimonial.delete()
    messages.success(request, 'Testimonial deleted successfully.')
    return redirect('testimonials:list')

@login_required(login_url='dashboard:login')
def testimonial_detail(request, pk):
    testimonial = get_object_or_404(Testimonial, pk=pk)
    return render(request, 'backend/testimonials/detail.html', {
        'testimonial': testimonial
    })

@require_GET
def testimonial_api(request):
    testimonials = Testimonial.objects.filter(is_active=True)

    return JsonResponse({
        'testimonials': [
            {
                'id': item.id,
                'customer_name': item.customer_name,
                'location': item.location,
                'review': item.review,
                'rating': item.rating,
            }
            for item in testimonials
        ]
    })