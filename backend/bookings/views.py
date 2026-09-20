import json
from decimal import Decimal
from math import ceil

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from vehicles.models import Vehicle
from .models import Booking


@login_required(login_url='dashboard:login')
def booking_list(request):
    bookings = Booking.objects.select_related('vehicle').all()
    return render(
        request,
        'backend/bookings/list.html',
        {'bookings': bookings}
    )


@login_required(login_url='dashboard:login')
def booking_detail(request, pk):
    booking = get_object_or_404(
        Booking.objects.select_related('vehicle'),
        pk=pk
    )

    return render(
        request,
        'backend/bookings/detail.html',
        {'booking': booking}
    )


@login_required(login_url='dashboard:login')
@require_POST
def booking_confirm(request, pk):
    booking = get_object_or_404(Booking, pk=pk)

    if booking.status != 'pending':
        messages.error(request, 'Only pending bookings can be confirmed.')
        return redirect('bookings:list')

    booking.status = 'confirmed'
    booking.save(update_fields=['status', 'updated_at'])

    messages.success(request, 'Booking confirmed successfully.')
    return redirect('bookings:list')


@login_required(login_url='dashboard:login')
@require_POST
def booking_complete(request, pk):
    booking = get_object_or_404(Booking, pk=pk)

    if booking.status != 'confirmed':
        messages.error(request, 'Only confirmed bookings can be completed.')
        return redirect('bookings:list')

    booking.status = 'completed'
    booking.save(update_fields=['status', 'updated_at'])

    messages.success(request, 'Booking marked as completed.')
    return redirect('bookings:list')


@login_required(login_url='dashboard:login')
@require_POST
def booking_cancel(request, pk):
    booking = get_object_or_404(Booking, pk=pk)

    if booking.status not in ['pending', 'confirmed']:
        messages.error(request, 'This booking cannot be cancelled.')
        return redirect('bookings:list')

    booking.status = 'cancelled'
    booking.save(update_fields=['status', 'updated_at'])

    messages.success(request, 'Booking cancelled successfully.')
    return redirect('bookings:list')


@csrf_exempt
def create_booking(request):
    if request.method != 'POST':
        return JsonResponse(
            {'error': 'POST request required.'},
            status=405
        )

    try:
        data = json.loads(request.body)

        # RENT A CAR / SELF DRIVE
        rental_type = data.get('rental_type', 'rental')

        valid_rental_types = dict(Booking.RENTAL_TYPES)

        if rental_type not in valid_rental_types:
            return JsonResponse(
                {'error': 'Invalid rental type.'},
                status=400
            )

        # REQUIRED FIELDS
        required_fields = [
            'vehicle_id',
            'full_name',
            'email',
            'phone',
            'pickup_location',
            'dropoff_location',
            'pickup_datetime',
            'return_datetime',
        ]

        for field in required_fields:
            if not data.get(field):
                return JsonResponse(
                    {'error': f'{field} is required.'},
                    status=400
                )

        # VEHICLE
        vehicle = Vehicle.objects.filter(
            id=data['vehicle_id'],
            status='available'
        ).first()

        if not vehicle:
            return JsonResponse(
                {'error': 'Vehicle is not available.'},
                status=404
            )

        # DATES
        pickup = parse_datetime(data['pickup_datetime'])
        return_time = parse_datetime(data['return_datetime'])

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

        # CHECK VEHICLE BOOKING CONFLICT
        conflict = Booking.objects.filter(
            vehicle=vehicle,
            status__in=['pending', 'confirmed'],
            pickup_datetime__lt=return_time,
            return_datetime__gt=pickup
        ).exists()

        if conflict:
            return JsonResponse(
                {
                    'error':
                    'This vehicle is already booked for the selected dates.'
                },
                status=409
            )

        # PRICE
        duration = return_time - pickup

        rental_days = max(
            1,
            ceil(duration.total_seconds() / 86400)
        )

        total_price = Decimal(rental_days) * vehicle.price_per_day

        # CREATE BOOKING
        booking = Booking.objects.create(
            vehicle=vehicle,
            rental_type=rental_type,
            full_name=data['full_name'].strip(),
            email=data['email'].strip(),
            phone=data['phone'].strip(),
            pickup_location=data['pickup_location'].strip(),
            dropoff_location=data['dropoff_location'].strip(),
            pickup_datetime=pickup,
            return_datetime=return_time,
            total_price=total_price,
            notes=data.get('notes', '').strip()
        )

        return JsonResponse(
            {
                'message': 'Booking submitted successfully.',
                'booking_id': booking.id,
                'rental_type': booking.rental_type,
                'status': booking.status,
                'rental_days': rental_days,
                'total_price': float(total_price),
            },
            status=201
        )

    except (json.JSONDecodeError, TypeError, ValueError):
        return JsonResponse(
            {'error': 'Invalid booking data.'},
            status=400
        )