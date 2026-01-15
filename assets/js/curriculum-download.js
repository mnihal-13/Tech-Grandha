/* ==========================================================================
   Curriculum Download Popup
   - Handles popup for first 2 course cards
   - Direct PDF download for other cards
   ========================================================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        const popup = document.getElementById('curriculum-popup');
        const overlay = document.getElementById('curriculum-popup-overlay');
        const closeBtn = document.querySelector('.curriculum-popup-close');

        if (!popup || !overlay) {
            console.warn('Curriculum popup elements not found');
            return;
        }

        // Open popup
        function openPopup(courseName) {
            popup.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Store course name for download
            popup.dataset.course = courseName || 'course';
        }

        // Close popup
        function closePopup() {
            popup.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Handle download button clicks
        document.querySelectorAll('.download-curriculum-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();

                const showPopup = this.dataset.popup === 'true';
                const pdfUrl = this.dataset.pdf;
                const courseName = this.dataset.course || 'curriculum';

                if (showPopup) {
                    openPopup(courseName);
                } else if (pdfUrl) {
                    // Direct download
                    const link = document.createElement('a');
                    link.href = pdfUrl;
                    link.download = courseName + '-curriculum.pdf';
                    link.click();
                }
            });
        });

        // Grade button downloads
        document.querySelectorAll('.grade-download-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const grade = this.dataset.grade;
                const courseName = popup.dataset.course || 'curriculum';
                const pdfUrl = `assets/pdfs/${courseName}-grade-${grade}.pdf`;

                // Trigger download
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = `${courseName}-grade-${grade}-curriculum.pdf`;
                link.click();

                closePopup();
            });
        });

        // Close popup events
        if (closeBtn) {
            closeBtn.addEventListener('click', closePopup);
        }

        overlay.addEventListener('click', closePopup);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closePopup();
            }
        });

        console.log('Curriculum Download: Initialized');
    });
})();
