// TEMPORARY FILE BORROWED FROM https://bl.ocks.org/mpetroff/4666657beeb85754611f
document.addEventListener('DOMContentLoaded', function() {
    // Navbar and dropdowns
    var toggle = document.getElementsByClassName('navbar-toggler')[0];
    var collapse = document.getElementsByClassName('navbar-collapse')[0];
    var dropdowns = document.getElementsByClassName('dropdown');

    // Toggle if navbar menu is open or closed
    function toggleMenu() {
        collapse.classList.toggle('collapse');
        collapse.classList.toggle('in');
    }

    // Close all dropdown menus
    function closeMenus() {
        for (var j = 0; j < dropdowns.length; j++) {
            dropdowns[j].getElementsByClassName('dropdown-menu')[0].classList.remove('show');
            dropdowns[j].classList.remove('show');
        }
    }

    // Add click handling to dropdowns
    for (var i = 0; i < dropdowns.length; i++) {
        dropdowns[i].addEventListener('click', function() {
            var open = this.classList.contains('show');
            closeMenus();
            if (!open) {
                this.getElementsByClassName('dropdown-menu')[0].classList.toggle('show');
                this.classList.toggle('show');
            }
        });
    }

    // Close dropdowns when screen becomes big enough to switch to open by hover
    function closeMenusOnResize() {
        if (document.body.clientWidth >= 768) {
            closeMenus();
            collapse.classList.add('collapse');
            collapse.classList.remove('in');
        }
    }

    // Event listeners
    window.addEventListener('resize', closeMenusOnResize, false);
    toggle.addEventListener('click', toggleMenu, false);
});
