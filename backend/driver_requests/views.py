import json

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import DriverRequest


@login_required(login_url='dashboard:login')
def request_list(request):
    driver_requests = DriverRequest.objects.all()
    return render(
        request,
        'backend/driver_requests/list.html',
        {'driver_requests': driver_requests}
    )


@login_required(login_url='dashboard:login')
def request_detail(request, pk):
    driver_request = get_object_or_404(DriverRequest, pk=pk)
    return render(
        request,
        'backend/driver_requests/detail.html',
        {'driver_request': driver_request}
    )


@login_required(login_url='dashboard:login')
@require_POST
def request_confirm(request, pk):
    driver_request = get_object_or_404(DriverRequest, pk=pk)

    if driver_request.status != 'pending':
        messages.error(request, 'Only pending requests can be confirmed.')
        return redirect('driver_requests:list')

    driver_request.status = 'confirmed'
    driver_request.save(update_fields=['status', 'updated_at'])
    messages.success(request, 'Driver request confirmed.')
    return redirect('driver_requests:list')


@login_required(login_url='dashboard:login')
@require_POST
def request_complete(request, pk):
    driver_request = get_object_or_404(DriverRequest, pk=pk)

    if driver_request.status != 'confirmed':
        messages.error(request, 'Only confirmed requests can be completed.')
        return redirect('driver_requests:list')

    driver_request.status = 'completed'
    driver_request.save(update_fields=['status', 'updated_at'])
    messages.success(request, 'Driver request completed.')
    return redirect('driver_requests:list')


@login_required(login_url='dashboard:login')
@require_POST
def request_cancel(request, pk):
    driver_request = get_object_or_404(DriverRequest, pk=pk)

    if driver_request.status not in ['pending', 'confirmed']:
        messages.error(request, 'This request cannot be cancelled.')
        return redirect('driver_requests:list')

    driver_request.status = 'cancelled'
    driver_request.save(update_fields=['status', 'updated_at'])
    messages.success(request, 'Driver request cancelled.')
    return redirect('driver_requests:list')


@csrf_exempt
def create_driver_request(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST request required.'}, status=405)

    try:
        data = json.loads(request.body)

        required_fields = [
            'full_name',
            'email',
            'phone',
            'pickup_location',
            'dropoff_location',
            'pickup_datetime',
            'return_datetime',
            'vehicle_type',
        ]

        for field in required_fields:
            if not data.get(field):
                return JsonResponse(
                    {'error': f'{field} is required.'},
                    status=400
                )

        try:
            validate_email(data['email'].strip())
        except ValidationError:
            return JsonResponse(
                {'error': 'Please enter a valid email address.'},
                status=400
            )

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

        valid_vehicle_types = dict(DriverRequest.VEHICLE_TYPES)

        if data['vehicle_type'] not in valid_vehicle_types:
            return JsonResponse(
                {'error': 'Invalid vehicle type.'},
                status=400
            )

        driver_request = DriverRequest.objects.create(
            full_name=data['full_name'].strip(),
            email=data['email'].strip(),
            phone=data['phone'].strip(),
            pickup_location=data['pickup_location'].strip(),
            dropoff_location=data['dropoff_location'].strip(),
            pickup_datetime=pickup,
            return_datetime=return_time,
            vehicle_type=data['vehicle_type'],
            notes=data.get('notes', '').strip()
        )

        return JsonResponse({
            'message': 'Driver request submitted successfully.',
            'request_id': driver_request.id,
            'status': driver_request.status
        }, status=201)

    except (json.JSONDecodeError, TypeError, ValueError):
        return JsonResponse(
            {'error': 'Invalid request data.'},
            status=400
        )