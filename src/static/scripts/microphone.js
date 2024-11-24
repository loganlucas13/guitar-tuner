document.addEventListener("DOMContentLoaded", () => {
    const enableMicrophoneButton = document.getElementById('enable-microphone');
    enableMicrophoneButton.addEventListener('click', () => {
        getMicrophonePermissions(enableMicrophoneButton);
    });
});

function getMicrophonePermissions(enableMicrophoneButton) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({audio: true})
        .then(function(stream) {
            console.log('microphone enabled successfully!');
            enableMicrophoneButton.style.display = 'none';
        })
        .catch(function(error) {
            console.error('microphone not enabled:', error);
        });
    }
    else {
        console.error('getUserMedia not allowed');
    }
}