function createVoiceCoder(editor, RecognitionCtor) {
  if (!RecognitionCtor) {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    RecognitionCtor = SpeechRecognition;
  }
  if (!RecognitionCtor) {
    throw new Error('SpeechRecognition not supported');
  }
  const recognition = new RecognitionCtor();
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    let text = '';
    for (const res of event.results) {
      if (res[0] && res[0].transcript) {
        text += res[0].transcript;
      }
    }
    const range = editor.getSelection();
    editor.executeEdits(null, [{ range, text, forceMoveMarkers: true }]);
  };

  return {
    start() {
      recognition.start();
    },
    stop() {
      recognition.stop();
    },
  };
}

module.exports = { createVoiceCoder };
