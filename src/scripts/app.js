const audioContext = new AudioContext();
const $console = document.getElementById('console');
const $toggleButton = document.getElementById('toggle-button');

let oscillatorNode = null;

const addMidiEventListeners = (midiInputs, listener) => {
    for (const input of midiInputs.values()) {
        input.addEventListener('midimessage', listener);
    }
};
const applySpacing = () => {
    if ($console.firstChild !== null) {
        $console.firstChild.style.marginTop = '1em';
    }
};
const createAndStartOscillator = (group) => {
    oscillatorNode = new OscillatorNode(audioContext);

    oscillatorNode.connect(audioContext.destination);
    oscillatorNode.start();

    log(group, 'oscillator started', 'green');
};
const listenToAnyMidiEvent = (listener) => {
    if (navigator.permissions !== undefined && navigator.requestMIDIAccess !== undefined) {
        navigator.permissions
            .query({ name: 'midi' })
            .then(({ state }) => {
                if (state === 'granted') {
                    return navigator.requestMIDIAccess();
                }

                throw new Error('Accessing Web MIDI is not allowed.');
            })
            .then((midiAccess) => {
                let midiInputs = midiAccess.inputs;

                midiAccess.onstatechange = () => {
                    // @todo It is not the most elegant way to reapply all listeners on each statechange event.
                    removeMidiEventListeners(midiInputs, listener);

                    midiInputs = midiAccess.inputs;

                    addMidiEventListeners(midiInputs, listener);
                };

                addMidiEventListeners(midiInputs, listener);
            });
    }
};
const log = (group, message, color = 'black') => {
    const $item = document.createElement('li');

    $item.dataset.group = group;
    $item.style.color = color;
    $item.textContent = message;

    const $previousItemOfGroup = $console.querySelector(`[data-group="${ group }"]`);

    if ($previousItemOfGroup === null) {
        $console.insertBefore($item, $console.firstChild);
    } else {
        $item.style.marginTop = '1em';
        $previousItemOfGroup.style.marginTop = null;

        $console.insertBefore($item, $previousItemOfGroup);
    }
};
const removeMidiEventListeners = (midiInputs, listener) => {
    for (const input of midiInputs.values()) {
        input.removeEventListener('midimessage', listener);
    }
};
const startLogGroup = (message) => {
    applySpacing();

    const group = ($console.firstChild === null) ? 0 : parseInt($console.firstChild.dataset.group, 10) + 1;

    log(group, message);

    return group;
};
const toggleOscillator = (group) => {
    if (oscillatorNode === null) {
        if (audioContext.state === 'running') {
            log(group, "The AudioContext is currently running and doesn't have to be resumed.", 'green');

            createAndStartOscillator(group);
        } else {
            log(group, 'The AudioContext is currently not running and has to be resumed.', 'red');

            audioContext
                .resume()
                .then(() => log(group, `The AudioContext was resumed and is now "${ audioContext.state }".`, 'green'))
                .then(() => {
                    if (oscillatorNode === null) {
                        createAndStartOscillator(group);
                    } else {
                        log(group, 'The oscillator has been started in the meantime.', 'red');
                    }
                })
                .catch(() => log(group, `The AudioContext could not be resumed and is now "${ audioContext.state }".`, 'red'));
        }
    } else {
        oscillatorNode.stop();

        oscillatorNode = null;

        log(group, 'oscillator stopped');
    }
};

listenToAnyMidiEvent(() => {
    const group = startLogGroup('MIDI event received');

    toggleOscillator(group);
});

$toggleButton.addEventListener('click', () => {
    const group = startLogGroup('toggle button clicked');

    toggleOscillator(group);
});
