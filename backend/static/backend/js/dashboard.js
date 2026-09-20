const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        sidebar.classList.toggle('active');
    });
}

document.addEventListener('click', (event) => {
    if (!sidebar || !sidebarToggle) return;

    if (window.innerWidth > 991) return;

    const clickedSidebar = sidebar.contains(event.target);
    const clickedToggle = sidebarToggle.contains(event.target);

    if (!clickedSidebar && !clickedToggle) {
        sidebar.classList.remove('active');
    }
});

window.addEventListener('resize', () => {
    if (!sidebar) return;

    if (window.innerWidth > 991) {
        sidebar.classList.remove('active');
    }
});