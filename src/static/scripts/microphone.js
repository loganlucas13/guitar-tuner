// adds all required event listeners after page has fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const enableMicrophoneButton = document.getElementById('enable-microphone');
    enableMicrophoneButton.addEventListener('click', () => {
        startRecording(enableMicrophoneButton);
    });
});

// starts the process of gathering live audio from user
function startRecording(enableMicrophoneButton) {
    getMicrophonePermissions(enableMicrophoneButton)
        .then(stream => {
            createVisualizer(stream);
        })
        .catch(function(error) {
            console.error('ERROR: Microphone could not be enabled -', error)
        });
}

// helper function for 'startRecording()'
// asks for access to user's microphone (popup in top-left)
// return: audio stream of input device
function getMicrophonePermissions(enableMicrophoneButton) {
    // aborts if browser does not support getUserMedia
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
        console.error('ERROR: getUserMedia not allowed');
        return Promise.reject(new Error('getUserMedia not allowed'));
    }

    // returns stream of input device
    return navigator.mediaDevices.getUserMedia({audio: true})
        .then(function(stream) { // success
            console.log('Microphone enabled successfully!');
            enableMicrophoneButton.style.display = 'none'; // hide button
            return stream;
        })
        .catch(function(error) { // failure
            throw error;
        });
}

// builds the visualizer on the screen given an input device's audio stream
// also sends data to the server in chunks
function createVisualizer(stream) {
    const audioContext = new (window.AudioContext)();

    // sets up analyzer to parse data from audio context
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 2048;

    // linking audioContext + analyzer
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyzer);

    // connects to localhost temporarily
    // TODO: change once deployed
    const socket = io.connect('localhost:8080');

    // visualizer on HTML page
    const visualizerDisplay = document.getElementById('visualizer');
    visualizerDisplay.style.display = 'flex'; // unhides the visualizer

    const visualizerContext = visualizerDisplay.getContext('2d');

    // repeatedly draws frames of the visualizer
    function draw() {
        const bufferLength = analyzer.frequencyBinCount;
        const data = new Uint8Array(bufferLength);

        // draws a single frame of the visualizer
        function animate() {
            const audioData = {
                data: Array.from(data),
                sampleRate: audioContext.sampleRate
            }
            socket.emit('audioChunk', audioData); // sends data to server

            requestAnimationFrame(animate);

            // get data + smooth for cleaner visuals
            analyzer.getByteTimeDomainData(data);
            smoothedData = cleanData(data, 0.5);

            // clears current visualizer from previous frames
            visualizerContext.fillStyle = '#2d3042';
            visualizerContext.fillRect(0, 0, visualizerDisplay.width, visualizerDisplay.height);

            // appearance modifications
            // shadows
            visualizerContext.shadowColor = '#1c1e27';
            visualizerContext.shadowBlur = 3;
            visualizerContext.shadowOffsetX = 3;
            visualizerContext.shadowOffsetY = 3;

            // line appearance
            visualizerContext.lineWidth = 2;
            visualizerContext.imageSmoothingEnabled = true;
            visualizerContext.lineJoin = 'round';
            visualizerContext.lineCap = 'round';
            visualizerContext.strokeStyle = '#fdfffc';

            // starts drawing
            visualizerContext.beginPath();

            // constants to hold positions on the visualizer
            const padding = 30; // so visualizer doesn't stretch from end-to-end of the box
            const effectiveWidth = visualizerDisplay.width - (2 * padding);
            const center = visualizerDisplay.height / 2;
            const sliceWidth = effectiveWidth / bufferLength;

            let x = padding;
            for (let i = 0; i < bufferLength; i++) {
                const v = smoothedData[i] / 128.0;
                const y = v * center;

                if (i === 0) {
                    visualizerContext.moveTo(x, y); // resets to start
                }
                else {
                    visualizerContext.lineTo(x, y); // goes to next pixel
                }
                x += sliceWidth;
            }
            visualizerContext.lineTo(visualizerDisplay.width - padding, center); // resets to middle of the canvas
            visualizerContext.stroke(); // create stroke
        }
        animate();
    }

    // ensures that the audio context is active
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            draw();
        })
    }
    else {
        draw();
    }
}

// smooths data given a smoothing factor
// used to create a cleaner visualizer
function cleanData(inputData, smoothingFactor) {
    const length = inputData.length;

    const smoothedData = new Uint8Array(length);

    smoothedData[0] = inputData[0]; // bases all future computations off of the starting point
    for (let i = 1; i < length; i++) {
        smoothedData[i] = smoothingFactor * inputData[i] + (1 - smoothingFactor) * smoothedData[i-1];
    }
    return smoothedData;
}