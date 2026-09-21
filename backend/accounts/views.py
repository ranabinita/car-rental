import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_GET, require_POST

from .models import CustomerProfile


@require_GET
def csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})


@require_POST
def register_user(request):
    try:
        data = json.loads(request.body)

        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        phone = data.get('phone', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        confirm_password = data.get('confirm_password', '')

        if not first_name or not last_name or not phone or not email or not password:
            return JsonResponse({'error': 'Please complete all required fields.'}, status=400)

        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse({'error': 'Please enter a valid email address.'}, status=400)

        if User.objects.filter(email__iexact=email).exists():
            return JsonResponse({'error': 'An account with this email already exists.'}, status=400)

        if password != confirm_password:
            return JsonResponse({'error': 'Passwords do not match.'}, status=400)

        try:
            validate_password(password)
        except ValidationError as error:
            return JsonResponse({'error': ' '.join(error.messages)}, status=400)

        user = User(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name
        )

        try:
            validate_password(password, user=user)
        except ValidationError as error:
            return JsonResponse({'error': ' '.join(error.messages)}, status=400)

        user.set_password(password)
        user.save()

        CustomerProfile.objects.create(user=user, phone=phone)

        login(request, user)

        return JsonResponse({
            'message': 'Account created successfully.',
            'user': {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'phone': phone
            }
        }, status=201)

    except (json.JSONDecodeError, TypeError, ValueError):
        return JsonResponse({'error': 'Invalid request data.'}, status=400)


@require_POST
def login_user(request):
    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not email or not password:
            return JsonResponse({'error': 'Email and password are required.'}, status=400)

        user = authenticate(request, username=email, password=password)

        if user is None:
            return JsonResponse({'error': 'Invalid email or password.'}, status=400)

        if not user.is_active:
            return JsonResponse({'error': 'This account is inactive.'}, status=403)

        login(request, user)

        phone = ''
        if hasattr(user, 'customer_profile'):
            phone = user.customer_profile.phone

        return JsonResponse({
            'message': 'Signed in successfully.',
            'user': {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'phone': phone
            }
        })

    except (json.JSONDecodeError, TypeError, ValueError):
        return JsonResponse({'error': 'Invalid request data.'}, status=400)


@require_POST
def logout_user(request):
    logout(request)
    return JsonResponse({'message': 'Signed out successfully.'})


@require_GET
def current_user(request):
    if not request.user.is_authenticated:
        return JsonResponse({'authenticated': False})

    user = request.user
    phone = ''

    if hasattr(user, 'customer_profile'):
        phone = user.customer_profile.phone

    return JsonResponse({
        'authenticated': True,
        'user': {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'phone': phone
        }
    })