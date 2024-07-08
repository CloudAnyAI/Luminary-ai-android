
        // Show the selected page and apply pulsating effect
        function showPage(pageNumber) {
            createPulsatingEffect();
            for (let i = 1; i <= 5; i++) {
                const page = document.getElementById(`page${i}`);
                page.classList.add('hidden');
                page.classList.remove('jump-up');
            }
            const newPage = document.getElementById(`page${pageNumber}`);
            newPage.classList.remove('hidden');
            newPage.classList.add('jump-up');

            if (pageNumber === 5) {
                displayUserInfo();
            }
        }

        function deleteCookies() {
            localStorage.clear();
            alert('All cookies have been deleted.');
        }

        function logout() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userInfo');
            location.reload();
        }

        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;

        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('bg-white')) {
                body.classList.remove('bg-white', 'text-gray-800');
                body.classList.add('bg-gray-900', 'text-gray-100');
            } else {
                body.classList.remove('bg-gray-900', 'text-gray-100');
                body.classList.add('bg-white', 'text-gray-800');
            }
        });
        // Create pulsating screen effect and vibrate the phone.
        function createPulsatingEffect() {
            const body = document.body;
            const pulseDiv = document.createElement('div');
            pulseDiv.classList.add('pulse-effect');
            body.appendChild(pulseDiv);

            setTimeout(() => {
                pulseDiv.remove();
            }, 700); // Remove pulse effect after animation duration

            // Vibrate the phone for 2 seconds
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }



