from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.shortcuts import render, redirect


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

        messages.error(request, 'Invalid username or password.')

    return render(request, 'backend/login.html')


@login_required(login_url='dashboard:login')
def dashboard_home(request):
    return render(request, 'backend/dashboard.html')


def backend_logout(request):
    logout(request)
    return redirect('dashboard:login')