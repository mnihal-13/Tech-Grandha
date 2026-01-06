/**
 * Components Loader
 * Dynamically loads header and footer components into placeholder elements
 */
(function () {
    'use strict';

    // Determine base path - detect if we're in a subdirectory
    var basePath = '';
    var currentPath = window.location.pathname;
    
    // Check if in subdirectory (courses/ or competitions/)
    if (currentPath.includes('/courses/') || currentPath.includes('/competitions/')) {
        basePath = '../';
    }
    
    // For file:// protocol (local testing)
    if (window.location.protocol === 'file:') {
        var filePath = window.location.href;
        if (filePath.includes('/courses/') || filePath.includes('/competitions/')) {
            basePath = '../';
        }
    }

    // Helper to fix paths in loaded HTML - only adjust paths that need adjustment
    function fixPaths(html) {
        if (!basePath) {
            // At root level - paths in components already use ./
            return html;
        }
        // In subdirectory - need to convert ./ to ../
        return html
            .replace(/src="\.\//g, 'src="' + basePath)
            .replace(/href="\.\//g, 'href="' + basePath)
            .replace(/src="assets\//g, 'src="' + basePath + 'assets/')
            .replace(/href="assets\//g, 'href="' + basePath + 'assets/')
            .replace(/href="index.html"/g, 'href="' + basePath + 'index.html"')
            .replace(/href="courses.html"/g, 'href="' + basePath + 'courses.html"')
            .replace(/href="competitions.html"/g, 'href="' + basePath + 'competitions.html"')
            .replace(/href="quizzes.html"/g, 'href="' + basePath + 'quizzes.html"')
            .replace(/href="contact.html"/g, 'href="' + basePath + 'contact.html"')
            .replace(/href="login.html"/g, 'href="' + basePath + 'login.html"')
            .replace(/href="register.html"/g, 'href="' + basePath + 'register.html"');
    }

    // Load component HTML into target element
    function loadComponent(url, targetId, callback) {
        var target = document.getElementById(targetId);
        if (!target) {
            console.warn('Target element not found:', targetId);
            return;
        }

        var fullUrl = basePath + url;
        
        fetch(fullUrl)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Failed to load: ' + url + ' (Status: ' + response.status + ')');
                }
                return response.text();
            })
            .then(function (html) {
                // Fix paths in the loaded HTML
                var fixedHtml = fixPaths(html);
                target.innerHTML = fixedHtml;
                if (callback) callback();
            })
            .catch(function (error) {
                console.error('Component load error:', error);
                target.innerHTML = '<p>Error loading component. Check console for details.</p>';
            });
    }

    // Re-initialize JavaScript handlers after components load
    function reinitializeHandlers() {
        // Mobile menu toggle
        var hambergerBtn = document.querySelector('.hamberger-button');
        var popupMobileMenu = document.querySelector('.popup-mobile-menu');
        var closeBtn = document.querySelector('.close-button');

        if (hambergerBtn && popupMobileMenu) {
            hambergerBtn.addEventListener('click', function () {
                popupMobileMenu.classList.add('active');
            });
        }

        if (closeBtn && popupMobileMenu) {
            closeBtn.addEventListener('click', function () {
                popupMobileMenu.classList.remove('active');
            });
        }

        // Theme switcher
        var themeButtons = document.querySelectorAll('.setColor');
        themeButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var theme = this.getAttribute('data-theme');
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);

                // Update active state
                themeButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Apply saved theme
        var savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            // Set active class
            var activeBtn = document.querySelector('.setColor[data-theme="' + savedTheme + '"]');
            if (activeBtn) activeBtn.classList.add('active');
        }

        // Re-trigger parallax for footer if available
        if (typeof ParallaxScroll !== 'undefined') {
            ParallaxScroll.init();
        }

        // Back to Top (Progress Scroll)
        var progressPath = document.querySelector('.rbt-progress-parent path');
        var pathLength = progressPath ? progressPath.getTotalLength() : 0;

        if (progressPath) {
            progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
            progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
            progressPath.style.strokeDashoffset = pathLength;
            progressPath.getBoundingClientRect();
            progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

            var updateProgress = function () {
                var scroll = window.pageYOffset;
                var height = document.documentElement.scrollHeight - window.innerHeight;
                var progress = pathLength - (scroll * pathLength / height);
                progressPath.style.strokeDashoffset = progress;
            }

            updateProgress();
            window.addEventListener('scroll', updateProgress);

            var offset = 50;
            var duration = 550;

            window.addEventListener('scroll', function () {
                if (window.pageYOffset > offset) {
                    document.querySelector('.rbt-progress-parent').classList.add('rbt-backto-top-active');
                } else {
                    document.querySelector('.rbt-progress-parent').classList.remove('rbt-backto-top-active');
                }
            });

            document.querySelector('.rbt-progress-parent').addEventListener('click', function (event) {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return false;
            });
        }
    }

    // Load components when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        var headerLoaded = false;
        var footerLoaded = false;

        function checkAllLoaded() {
            if (headerLoaded && footerLoaded) {
                reinitializeHandlers();
            }
        }

        loadComponent('components/header.html', 'header-component', function () {
            headerLoaded = true;
            checkAllLoaded();
        });

        loadComponent('components/footer.html', 'footer-component', function () {
            footerLoaded = true;
            checkAllLoaded();
        });
    });
})();
