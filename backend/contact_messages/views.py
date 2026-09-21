import json

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import ContactMessage


@login_required(login_url='dashboard:login')
def message_list(request):
    contact_messages = ContactMessage.objects.all()
    return render(request, 'backend/contact_messages/list.html', {'contact_messages': contact_messages})


@login_required(login_url='dashboard:login')
def message_detail(request, pk):
    contact_message = get_object_or_404(ContactMessage, pk=pk)

    if contact_message.status == 'new':
        contact_message.status = 'read'
        contact_message.save(update_fields=['status', 'updated_at'])

    return render(request, 'backend/contact_messages/detail.html', {'contact_message': contact_message})


@login_required(login_url='dashboard:login')
@require_POST
def message_read(request, pk):
    contact_message = get_object_or_404(ContactMessage, pk=pk)

    if contact_message.status == 'new':
        contact_message.status = 'read'
        contact_message.save(update_fields=['status', 'updated_at'])
        messages.success(request, 'Message marked as read.')

    return redirect('contact_messages:list')


@login_required(login_url='dashboard:login')
@require_POST
def message_resolve(request, pk):
    contact_message = get_object_or_404(ContactMessage, pk=pk)
    contact_message.status = 'resolved'
    contact_message.save(update_fields=['status', 'updated_at'])
    messages.success(request, 'Message marked as resolved.')
    return redirect('contact_messages:list')


@login_required(login_url='dashboard:login')
@require_POST
def message_delete(request, pk):
    contact_message = get_object_or_404(ContactMessage, pk=pk)
    contact_message.delete()
    messages.success(request, 'Contact message deleted.')
    return redirect('contact_messages:list')


@csrf_exempt
def create_contact_message(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST request required.'}, status=405)

    try:
        data = json.loads(request.body)
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()

        if not name:
            return JsonResponse({'error': 'Name is required.'}, status=400)

        if not email:
            return JsonResponse({'error': 'Email is required.'}, status=400)

        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse({'error': 'Please enter a valid email address.'}, status=400)

        if not subject:
            return JsonResponse({'error': 'Subject is required.'}, status=400)

        if not message:
            return JsonResponse({'error': 'Message is required.'}, status=400)

        contact_message = ContactMessage.objects.create(
            name=name,
            email=email,
            phone=phone,
            subject=subject,
            message=message
        )

        return JsonResponse({
            'message': 'Your message has been sent successfully.',
            'message_id': contact_message.id
        }, status=201)

    except (json.JSONDecodeError, TypeError, ValueError):
        return JsonResponse({'error': 'Invalid request data.'}, status=400)