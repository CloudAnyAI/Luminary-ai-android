function openImageGeneratorModal() {
    const userAccount = JSON.parse(localStorage.getItem('isLoggedIn'));
    if (userAccount) {
        const userLimits = {
            limited: 4,
            unlimited: Infinity
        };
        const usageKey = `usage_${userAccount.username}_${getUsageResetDate()}`;
        let storedUsageDate = localStorage.getItem("usageDate");
        let usageCount = 0;

        if (storedUsageDate !== getUsageResetDate()) {
            localStorage.setItem("usageDate", getUsageResetDate());
            localStorage.setItem(usageKey, 0);
        } else {
            usageCount = parseInt(localStorage.getItem(usageKey)) || 0;
        }

        if (usageCount >= userLimits[userAccount.accountType]) {
            alert(`Bạn đã đạt đến ngưỡng giới hạn. Thời gian đặt lại: ${getTimeUntilReset()}`);
        } else {
            document.getElementById('dialog-xlll').classList.remove('hidden');
        }
    }
}

function closeImageGeneratorModal() {
    document.getElementById('image-generator-modal').classList.add('hidden');
    document.getElementById('image-generator-form').reset();
    document.getElementById('error-message').classList.add('hidden');
    document.getElementById('generated-image').innerHTML = '';
}

document.getElementById('image-generator-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const prompt = document.getElementById('prompt').value;
    generateImage(prompt);
});

// Initially hide the "Generate Image" button if testuser has exceeded the limit
const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));
if (isLoggedIn && isLoggedIn.username === 'testuser') {
    const usageKey = `usage_${isLoggedIn.username}_${getUsageResetDate()}`;
    let storedUsageDate = localStorage.getItem('usageDate');
    let usageCount = 0;

    if (storedUsageDate !== getUsageResetDate()) {
        localStorage.setItem('usageDate', getUsageResetDate());
        localStorage.setItem(usageKey, 0);
    } else {
        usageCount = parseInt(localStorage.getItem(usageKey)) || 0;
    }

    if (usageCount >= 4) {
        const generateButtons = document.querySelectorAll('button[data-role="generate-button"]');
        generateButtons.forEach(button => button.style.display = 'none');
    }
}

function generateImage(prompt) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
        const usageKey = `usage_${userInfo.userId}_${getUsageResetDate()}`;
        const usageCount = parseInt(localStorage.getItem(usageKey)) || 0;
        const userLimits = {
            "janedoe": Infinity,
            "testuser": 3
        };

        if (usageCount >= userLimits[userInfo.username]) {
            document.getElementById('error-message').innerText = `Bạn đã đạt đến ngưỡng giới hạn. Thời gian đặt lại: ${getTimeUntilReset()}`;
            document.getElementById('error-message').classList.remove('hidden');
            return;
        }

        document.getElementById('spinner').classList.remove('hidden');

        fetch("https://backend.buildpicoapps.com/aero/run/image-generation-api?pk=v1-Z0FBQUFBQm1kOFBXU05tYk0zYjl2QVl4MjE1dHlDbl83OUdDQ3dwSUR0dXdYWmlCeFFKVmZESm4xakpSTU1uczZjV2RQaktDd085cnFaZU1ab19hbDk4ZmJGYVJLdm1keG44N2x2dmVzWURGSUU4TnBGMjFkZFU9", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('spinner').classList.add('hidden');
            if (data.status === 'success') {
                document.getElementById('generated-image').innerHTML = `<img src="${data.imageUrl}" alt="Generated Image" class="w-[40px] h-[40px] padding -10 h-auto rounded-2xl mt-4" onclick="openFullscreenModal('${data.imageUrl}')">`;
                localStorage.setItem(usageKey, usageCount + 1);
            } else {
                displayErrorMessage('Error generating image. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error generating image:', error);
            document.getElementById('spinner').classList.add('hidden');
            displayErrorMessage('Error generating image. Please try again.');
        });
    }
}

function getUsageResetDate() {
    const now = new Date();
    if (now.getHours() >= 22) {
        return now.toISOString().split('T')[0];
    } else {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    }
}

function getTimeUntilReset() {
    const now = new Date();
    let resetTime = new Date();
    resetTime.setHours(22, 0, 0, 0); // Set reset time to 10 PM today

    if (now > resetTime) {
        resetTime.setDate(resetTime.getDate() + 1); // If it's past 10 PM, set reset time to 10 PM tomorrow
    }

    const timeDifference = resetTime - now;
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return `${hours} giờ ${minutes} phút ${seconds} giây`;
}

function displayErrorMessage(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.innerText = message;
    errorMessageElement.classList.remove('hidden');

    // Hide the error message after 5 seconds
    setTimeout(() => {
        errorMessageElement.classList.add('hidden');
    }, 5000);
}