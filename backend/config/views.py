from django.shortcuts import render

def custom_404(request, exception=None, **kwargs):
    return render(request, '404.html', status=404)