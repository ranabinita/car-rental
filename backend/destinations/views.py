from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST
from .models import Destination

@login_required(login_url='dashboard:login')
def destination_list(request):
    destinations = Destination.objects.all()
    return render(request, 'backend/destinations/list.html', {'destinations': destinations})

@login_required(login_url='dashboard:login')
def destination_add(request):
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        description = request.POST.get('description', '').strip()
        starting_price = request.POST.get('starting_price', '').strip()
        order = request.POST.get('order', '0').strip()
        image = request.FILES.get('image')
        is_active = request.POST.get('is_active') == 'on'

        if not name or not description or not starting_price or not image:
            messages.error(request, 'Please complete all required fields.')
            return render(request, 'backend/destinations/form.html', {'form_title': 'Add Destination'})

        try:
            starting_price = float(starting_price)
            order = int(order or 0)

            if starting_price < 0 or order < 0:
                raise ValueError
        except ValueError:
            messages.error(request, 'Price and display order must be valid positive numbers.')
            return render(request, 'backend/destinations/form.html', {'form_title': 'Add Destination'})

        Destination.objects.create(
            name=name,
            image=image,
            description=description,
            starting_price=starting_price,
            order=order,
            is_active=is_active
        )

        messages.success(request, 'Destination added successfully.')
        return redirect('destinations:list')

    return render(request, 'backend/destinations/form.html', {'form_title': 'Add Destination'})

@login_required(login_url='dashboard:login')
def destination_detail(request, pk):
    destination = get_object_or_404(Destination, pk=pk)
    return render(request, 'backend/destinations/detail.html', {'destination': destination})

@login_required(login_url='dashboard:login')
def destination_edit(request, pk):
    destination = get_object_or_404(Destination, pk=pk)

    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        description = request.POST.get('description', '').strip()
        starting_price = request.POST.get('starting_price', '').strip()
        order = request.POST.get('order', '0').strip()
        image = request.FILES.get('image')
        is_active = request.POST.get('is_active') == 'on'

        if not name or not description or not starting_price:
            messages.error(request, 'Please complete all required fields.')
            return render(request, 'backend/destinations/form.html', {
                'form_title': 'Edit Destination',
                'destination': destination
            })

        try:
            starting_price = float(starting_price)
            order = int(order or 0)

            if starting_price < 0 or order < 0:
                raise ValueError
        except ValueError:
            messages.error(request, 'Price and display order must be valid positive numbers.')
            return render(request, 'backend/destinations/form.html', {
                'form_title': 'Edit Destination',
                'destination': destination
            })

        destination.name = name
        destination.description = description
        destination.starting_price = starting_price
        destination.order = order
        destination.is_active = is_active

        if image:
            destination.image = image

        destination.save()

        messages.success(request, 'Destination updated successfully.')
        return redirect('destinations:list')

    return render(request, 'backend/destinations/form.html', {
        'form_title': 'Edit Destination',
        'destination': destination
    })

@require_POST
@login_required(login_url='dashboard:login')
def destination_delete(request, pk):
    destination = get_object_or_404(Destination, pk=pk)
    destination.delete()
    messages.success(request, 'Destination deleted successfully.')
    return redirect('destinations:list')

def destination_api(request):
    destinations = Destination.objects.filter(is_active=True)

    data = [{
        'id': destination.id,
        'name': destination.name,
        'description': destination.description,
        'starting_price': float(destination.starting_price),
        'image': request.build_absolute_uri(destination.image.url) if destination.image else '',
    } for destination in destinations]

    return JsonResponse({'destinations': data})