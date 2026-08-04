/**
 * Happy Home Cleaning – single script
 * Mobile menu + booking flow (services → book → my-bookings)
 */
(function () {
    'use strict';
  
    // ─── Booking helpers ───────────────────────────────────────────
    const SELECTED_KEY = 'hhc_selected_services';
    const BOOKINGS_KEY = 'hhc_bookings';
  
    window.HHC = window.HHC || {};
  
    window.HHC.saveSelectedServices = function (services) {
      try {
        sessionStorage.setItem(SELECTED_KEY, JSON.stringify(services || []));
      } catch (e) {
        console.warn('HHC: could not save selected services', e);
      }
    };
  
    window.HHC.getSelectedServices = function () {
      try {
        const raw = sessionStorage.getItem(SELECTED_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    };
  
    window.HHC.clearSelectedServices = function () {
      try {
        sessionStorage.removeItem(SELECTED_KEY);
      } catch (e) {}
    };
  
    window.HHC.saveBooking = function (booking) {
      try {
        const list = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
        const entry = {
          id: 'BK-' + Date.now().toString(36).toUpperCase(),
          createdAt: new Date().toISOString(),
          status: 'pending',
          name: booking.name || '',
          email: booking.email || '',
          phone: booking.phone || '',
          service: booking.service || '',
          selected: booking.selected || '',
          date: booking.date || '',
          time: booking.time || '',
          beds: booking.beds || '',
          baths: booking.baths || '',
          sqft: booking.sqft || '',
          hasPaymentToken: !!booking.hasPaymentToken
        };
        list.unshift(entry);
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list.slice(0, 50)));
        console.log('HHC: booking saved', entry.id);
        return entry;
      } catch (e) {
        console.warn('HHC: could not save booking', e);
        return null;
      }
    };
  
    window.HHC.getBookings = function () {
      try {
        return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
      } catch (e) {
        return [];
      }
    };
  
    window.HHC.clearBookings = function () {
      try {
        localStorage.removeItem(BOOKINGS_KEY);
      } catch (e) {}
    };
  
    // ─── Mobile menu ───────────────────────────────────────────────
    function initMobileMenu() {
      const hamburger = document.getElementById('hamburger');
      const mobileMenu = document.getElementById('mobile-menu');
      const closeBtn = document.getElementById('mobile-menu-close');
  
      if (!hamburger || !mobileMenu) return;
  
      mobileMenu.removeAttribute('hidden');
  
      function openMenu() {
        hamburger.classList.add('active');
        mobileMenu.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        const firstLink = mobileMenu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
  
      function closeMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
  
      hamburger.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) closeMenu();
        else openMenu();
      });
  
      if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  
      mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) closeMenu();
      });
  
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
      });
  
      mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
      });
    }
  
    // ─── Boot ──────────────────────────────────────────────────────
    function boot() {
      initMobileMenu();
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  })();