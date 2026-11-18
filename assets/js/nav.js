// Site navigation: mobile menu toggle + nested "Project Showcase" dropdown.
// Click/tap and keyboard work everywhere; hover also opens menus on desktop mice.
(function () {
  var nav = document.querySelector('.site-nav');
  if (!nav) return;

  var toggle = nav.querySelector('.nav-toggle');
  var menuButtons = nav.querySelectorAll('.menu-btn, .submenu-btn');
  var desktop = window.matchMedia('(min-width: 900px)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  function setOpen(btn, open) {
    btn.setAttribute('aria-expanded', String(open));
    if (!open) {
      // Closing a menu closes everything nested inside it.
      var sub = document.getElementById(btn.getAttribute('aria-controls'));
      if (sub) sub.querySelectorAll('[aria-expanded="true"]').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
      });
    }
  }

  function closeSiblings(btn) {
    var li = btn.parentElement;
    Array.prototype.forEach.call(li.parentElement.children, function (sib) {
      if (sib === li) return;
      var b = sib.querySelector(':scope > [aria-expanded]');
      if (b) setOpen(b, false);
    });
  }

  function open(btn) { closeSiblings(btn); setOpen(btn, true); }

  function closeAll() {
    menuButtons.forEach(function (b) { setOpen(b, false); });
  }

  // Mobile hamburger
  toggle.addEventListener('click', function () {
    var isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    if (isOpen) closeAll();
  });

  menuButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-expanded') === 'true') setOpen(btn, false);
      else open(btn);
    });

    // Hover to open on desktop with a mouse; short delay so menus don't flicker.
    var li = btn.parentElement, timer;
    li.addEventListener('mouseenter', function () {
      if (!(desktop.matches && finePointer.matches)) return;
      clearTimeout(timer);
      open(btn);
    });
    li.addEventListener('mouseleave', function () {
      if (!(desktop.matches && finePointer.matches)) return;
      timer = setTimeout(function () { setOpen(btn, false); }, 250);
    });
  });

  // Escape closes the innermost open menu and returns focus to its button.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openBtns = nav.querySelectorAll('.menu-btn[aria-expanded="true"], .submenu-btn[aria-expanded="true"]');
    var last = openBtns[openBtns.length - 1];
    if (last) { setOpen(last, false); last.focus(); }
    else if (toggle.getAttribute('aria-expanded') === 'true') { toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
  });

  // Following a link (including same-page anchors like /#projects) closes the menus.
  nav.addEventListener('click', function (e) {
    if (e.target.closest('.menu a')) { closeAll(); toggle.setAttribute('aria-expanded', 'false'); }
  });

  // Click or tab outside the nav closes dropdowns.
  document.addEventListener('click', function (e) { if (!nav.contains(e.target)) closeAll(); });
  nav.addEventListener('focusout', function (e) { if (e.relatedTarget && !nav.contains(e.relatedTarget)) closeAll(); });

  // Reset state when crossing the mobile/desktop breakpoint.
  desktop.addEventListener('change', function () {
    closeAll();
    toggle.setAttribute('aria-expanded', 'false');
  });
})();
