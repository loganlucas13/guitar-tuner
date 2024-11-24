// adds all required event listeners after page has fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const enableMicrophoneButton = document.getElementById('enable-microphone');
    enableMicrophoneButton.addEventListener('click', () => {
        getMicrophonePermissions(enableMicrophoneButton);
    });
});

// helper function for 'enable-button' event handler
// asks for access to user's microphone (popup in top-left)
function getMicrophonePermissions(enableMicrophoneButton) {
    // aborts if browser does not support getUserMedia
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
        console.error('ERROR: getUserMedia not allowed');
        return;
    }

    navigator.mediaDevices.getUserMedia({audio: true})
    .then(function(stream) { // success
        console.log('Microphone enabled successfully!');
        enableMicrophoneButton.style.display = 'none'; // hide button
    })
    .catch(function(error) { // failure
        console.error('ERROR: Microphone not enabled -', error);
    });
}