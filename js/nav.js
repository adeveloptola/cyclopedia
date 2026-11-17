// Cyclopedia navigation: mobile menu toggle + accessible dropdowns.
// Dropdowns open on click/Enter/Space, close on Escape, outside click or focus leaving.
(function () {
  var menuBtn = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  var toggles = Array.prototype.slice.call(document.querySelectorAll(".dropdown-toggle"));

  function setMenu(open) {
    if (!menuBtn || !nav) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  }

  function setDropdown(btn, open) {
    var menu = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", String(open));
    if (menu) menu.classList.toggle("is-open", open);
  }

  function closeAll(except) {
    toggles.forEach(function (b) { if (b !== except) setDropdown(b, false); });
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
  }

  toggles.forEach(function (btn) {
    var item = btn.closest(".nav-item");
    var menu = document.getElementById(btn.getAttribute("aria-controls"));

    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      closeAll(btn);
      setDropdown(btn, open);
    });

    // Arrow down from the toggle moves into the menu.
    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" && menu) {
        e.preventDefault();
        setDropdown(btn, true);
        var first = menu.querySelector("a");
        if (first) first.focus();
      }
    });

    if (menu) {
      menu.addEventListener("keydown", function (e) {
        var links = Array.prototype.slice.call(menu.querySelectorAll("a"));
        var i = links.indexOf(document.activeElement);
        if (e.key === "ArrowDown") { e.preventDefault(); links[(i + 1) % links.length].focus(); }
        if (e.key === "ArrowUp") { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
      });
    }

    // Close when focus leaves this nav item entirely.
    item.addEventListener("focusout", function (e) {
      if (!item.contains(e.relatedTarget)) setDropdown(btn, false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var openBtn = toggles.filter(function (b) { return b.getAttribute("aria-expanded") === "true"; })[0];
    if (openBtn) { setDropdown(openBtn, false); openBtn.focus(); return; }
    if (menuBtn && menuBtn.getAttribute("aria-expanded") === "true") { setMenu(false); menuBtn.focus(); }
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-item")) closeAll();
  });
})();
