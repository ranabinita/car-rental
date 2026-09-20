from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from .models import Blog


@login_required(login_url='dashboard:login')
def blog_list(request):
    blogs = Blog.objects.all()
    return render(request, 'backend/blogs/list.html', {'blogs': blogs})


@login_required(login_url='dashboard:login')
def blog_add(request):
    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        category = request.POST.get('category', '').strip()
        excerpt = request.POST.get('excerpt', '').strip()
        content = request.POST.get('content', '').strip()
        image = request.FILES.get('image')
        read_time = request.POST.get('read_time', 5)
        status = request.POST.get('status', 'draft')

        if not title or not category or not excerpt or not content or not image:
            messages.error(request, 'Please complete all required fields.')
            return render(request, 'backend/blogs/form.html')

        if status not in dict(Blog.STATUS_CHOICES):
            status = 'draft'

        try:
            read_time = max(1, int(read_time))
        except (TypeError, ValueError):
            read_time = 5

        Blog.objects.create(
            title=title,
            category=category,
            excerpt=excerpt,
            content=content,
            image=image,
            read_time=read_time,
            status=status
        )

        messages.success(request, 'Blog created successfully.')
        return redirect('blogs:list')

    return render(request, 'backend/blogs/form.html')


@login_required(login_url='dashboard:login')
def blog_detail(request, pk):
    blog = get_object_or_404(Blog, pk=pk)
    return render(request, 'backend/blogs/detail.html', {'blog': blog})


@login_required(login_url='dashboard:login')
def blog_edit(request, pk):
    blog = get_object_or_404(Blog, pk=pk)

    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        category = request.POST.get('category', '').strip()
        excerpt = request.POST.get('excerpt', '').strip()
        content = request.POST.get('content', '').strip()
        read_time = request.POST.get('read_time', 5)
        status = request.POST.get('status', 'draft')

        if not title or not category or not excerpt or not content:
            messages.error(request, 'Please complete all required fields.')
            return render(request, 'backend/blogs/form.html', {'blog': blog})

        try:
            read_time = max(1, int(read_time))
        except (TypeError, ValueError):
            read_time = 5

        if status not in dict(Blog.STATUS_CHOICES):
            status = 'draft'

        blog.title = title
        blog.category = category
        blog.excerpt = excerpt
        blog.content = content
        blog.read_time = read_time
        blog.status = status

        if request.FILES.get('image'):
            blog.image = request.FILES['image']

        blog.save()

        messages.success(request, 'Blog updated successfully.')
        return redirect('blogs:list')

    return render(request, 'backend/blogs/form.html', {'blog': blog})


@login_required(login_url='dashboard:login')
def blog_delete(request, pk):
    blog = get_object_or_404(Blog, pk=pk)

    if request.method == 'POST':
        blog.delete()
        messages.success(request, 'Blog deleted successfully.')

    return redirect('blogs:list')


def blog_api(request):
    blogs = Blog.objects.filter(status='published')

    data = []

    for blog in blogs:
        data.append({
            'id': blog.id,
            'title': blog.title,
            'category': blog.category,
            'excerpt': blog.excerpt,
            'content': blog.content,
            'read_time': blog.read_time,
            'image': request.build_absolute_uri(blog.image.url) if blog.image else None,
            'published_at': blog.published_at.isoformat(),
        })

    return JsonResponse({'blogs': data})