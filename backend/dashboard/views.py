from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from vehicles.models import Vehicle
from bookings.models import Booking


def backend_login(request):
    if request.user.is_authenticated:
        return redirect('dashboard:home')

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None and user.is_staff:
            login(request, user)
            return redirect('dashboard:home')

        messages.error(
            request,
            'Invalid username or password.'
        )

    return render(
        request,
        'backend/login.html'
    )


@login_required(login_url='dashboard:login')
def dashboard_home(request):
    context = {
        'total_vehicles': Vehicle.objects.count(),

        'available_vehicles': Vehicle.objects.filter(
            status='available'
        ).count(),
    }

    return render(
        request,
        'backend/dashboard.html',
        context
    )


def backend_logout(request):
    logout(request)

    return redirect(
        'dashboard:login'
    )
@login_required(login_url='dashboard:login')
def dashboard_home(request):
    context = {
        'total_vehicles': Vehicle.objects.count(),
        'available_vehicles': Vehicle.objects.filter(status='available').count(),
        'total_bookings': Booking.objects.count(),
        'recent_bookings': Booking.objects.select_related('vehicle').all()[:5],
    }
    return render(request,'backend/dashboard.html',context)