import json

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import CorporateRequest


@login_required(login_url='dashboard:login')
def request_list(request):
    corporate_requests = CorporateRequest.objects.all()

    return render(
        request,
        'backend/corporate_requests/list.html',
        {'corporate_requests': corporate_requests}
    )


@login_required(login_url='dashboard:login')
def request_detail(request, pk):
    corporate_request = get_object_or_404(
        CorporateRequest,
        pk=pk
    )

    return render(
        request,
        'backend/corporate_requests/detail.html',
        {'corporate_request': corporate_request}
    )


@login_required(login_url='dashboard:login')
@require_POST
def request_confirm(request, pk):
    corporate_request = get_object_or_404(
        CorporateRequest,
        pk=pk
    )

    if corporate_request.status != 'pending':
        messages.error(
            request,
            'Only pending corporate requests can be confirmed.'
        )

        return redirect('corporate_requests:list')

    corporate_request.status = 'confirmed'

    corporate_request.save(
        update_fields=[
            'status',
            'updated_at'
        ]
    )

    messages.success(
        request,
        'Corporate request confirmed.'
    )

    return redirect('corporate_requests:list')


@login_required(login_url='dashboard:login')
@require_POST
def request_complete(request, pk):
    corporate_request = get_object_or_404(
        CorporateRequest,
        pk=pk
    )

    if corporate_request.status != 'confirmed':
        messages.error(
            request,
            'Only confirmed corporate requests can be completed.'
        )

        return redirect('corporate_requests:list')

    corporate_request.status = 'completed'

    corporate_request.save(
        update_fields=[
            'status',
            'updated_at'
        ]
    )

    messages.success(
        request,
        'Corporate request completed.'
    )

    return redirect('corporate_requests:list')


@login_required(login_url='dashboard:login')
@require_POST
def request_cancel(request, pk):
    corporate_request = get_object_or_404(
        CorporateRequest,
        pk=pk
    )

    if corporate_request.status not in [
        'pending',
        'confirmed'
    ]:
        messages.error(
            request,
            'This corporate request cannot be cancelled.'
        )

        return redirect('corporate_requests:list')

    corporate_request.status = 'cancelled'

    corporate_request.save(
        update_fields=[
            'status',
            'updated_at'
        ]
    )

    messages.success(
        request,
        'Corporate request cancelled.'
    )

    return redirect('corporate_requests:list')


@csrf_exempt
def create_corporate_request(request):
    if request.method != 'POST':
        return JsonResponse(
            {'error': 'POST request required.'},
            status=405
        )

    try:
        data = json.loads(request.body)

        required_fields = [
            'company_name',
            'contact_person',
            'phone',
            'email'
        ]

        for field in required_fields:
            if not data.get(field):
                return JsonResponse(
                    {
                        'error':
                        f'{field} is required.'
                    },
                    status=400
                )

        try:
            validate_email(
                data['email'].strip()
            )
        except ValidationError:
            return JsonResponse(
                {
                    'error':
                    'Please enter a valid email address.'
                },
                status=400
            )

        corporate_request = CorporateRequest.objects.create(
            company_name=data['company_name'].strip(),
            contact_person=data['contact_person'].strip(),
            phone=data['phone'].strip(),
            email=data['email'].strip(),
            rental_requirement=data.get(
                'rental_requirement',
                ''
            ).strip()
        )

        return JsonResponse(
            {
                'message':
                'Corporate request submitted successfully.',
                'request_id':
                corporate_request.id,
                'status':
                corporate_request.status
            },
            status=201
        )

    except (
        json.JSONDecodeError,
        TypeError,
        ValueError
    ):
        return JsonResponse(
            {'error': 'Invalid request data.'},
            status=400
        )