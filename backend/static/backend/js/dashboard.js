const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

sidebarToggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('active');
});