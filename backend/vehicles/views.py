from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.utils.dateparse import parse_datetime

from .forms import VehicleForm
from .models import Vehicle


@login_required(login_url='dashboard:login')
def vehicle_list(request):
    vehicles = Vehicle.objects.all()
    return render(
        request,
        'backend/vehicles/list.html',
        {'vehicles': vehicles}
    )


@login_required(login_url='dashboard:login')
def vehicle_add(request):
    if request.method == 'POST':
        form = VehicleForm(request.POST, request.FILES)

        if form.is_valid():
            form.save()
            messages.success(request, 'Vehicle added successfully.')
            return redirect('vehicles:list')
    else:
        form = VehicleForm()

    return render(
        request,
        'backend/vehicles/form.html',
        {
            'form': form,
            'page_title': 'Add Vehicle'
        }
    )


@login_required(login_url='dashboard:login')
def vehicle_edit(request, pk):
    vehicle = get_object_or_404(Vehicle, pk=pk)

    if request.method == 'POST':
        form = VehicleForm(
            request.POST,
            request.FILES,
            instance=vehicle
        )

        if form.is_valid():
            form.save()
            messages.success(request, 'Vehicle updated successfully.')
            return redirect('vehicles:list')
    else:
        form = VehicleForm(instance=vehicle)

    return render(
        request,
        'backend/vehicles/form.html',
        {
            'form': form,
            'vehicle': vehicle,
            'page_title': 'Edit Vehicle'
        }
    )


@login_required(login_url='dashboard:login')
def vehicle_delete(request, pk):
    vehicle = get_object_or_404(Vehicle, pk=pk)

    if request.method == 'POST':
        vehicle.delete()
        messages.success(request, 'Vehicle deleted successfully.')

    return redirect('vehicles:list')


def vehicle_api(request):
    vehicles = Vehicle.objects.filter(status='available')

    pickup_raw = request.GET.get('pickup')
    return_raw = request.GET.get('return')

    if pickup_raw and return_raw:
        pickup = parse_datetime(pickup_raw)
        return_time = parse_datetime(return_raw)

        if not pickup or not return_time:
            return JsonResponse(
                {'error': 'Invalid pickup or return date.'},
                status=400
            )

        if timezone.is_naive(pickup):
            pickup = timezone.make_aware(
                pickup,
                timezone.get_current_timezone()
            )

        if timezone.is_naive(return_time):
            return_time = timezone.make_aware(
                return_time,
                timezone.get_current_timezone()
            )

        if return_time <= pickup:
            return JsonResponse(
                {'error': 'Return date must be after pickup date.'},
                status=400
            )

        vehicles = vehicles.exclude(
            bookings__status__in=['pending', 'confirmed'],
            bookings__pickup_datetime__lt=return_time,
            bookings__return_datetime__gt=pickup
        ).distinct()

    data = []

    for vehicle in vehicles:
        data.append({
            'id': vehicle.id,
            'name': vehicle.name,
            'vehicle_type': vehicle.get_vehicle_type_display(),
            'seats': vehicle.seats,
            'transmission': vehicle.get_transmission_display(),
            'fuel_type': vehicle.get_fuel_type_display(),
            'price_per_day': float(vehicle.price_per_day),
            'description': vehicle.description,
            'image': vehicle.image.url if vehicle.image else None,
        })

    return JsonResponse({'vehicles': data})