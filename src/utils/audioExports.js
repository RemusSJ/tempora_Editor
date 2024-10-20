import lamejs from 'lamejs';
import Recorder from 'recorder-js';

export async function exportWAV(audioSource) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const recorder = new Recorder(audioContext);
  await recorder.init(audioSource);
  
  return recorder.start().then(() => {
    return recorder.stop().then(({ blob }) => {
      // Create download link for WAV
      const audioUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = audioUrl;
      a.download = 'audio.wav';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(audioUrl);
    });
  });
}

export function convertWavToMp3(wavBlob) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(wavBlob);
  
  reader.onloadend = () => {
    const wavData = new Uint8Array(reader.result);
    const wav = lamejs.WavHeader.readHeader(new DataView(reader.result));
    const samples = new Int16Array(reader.result, wav.dataOffset, wav.dataLen / 2);

    const mp3Encoder = new lamejs.Mp3Encoder(1, wav.sampleRate, 128);
    const mp3Data = mp3Encoder.encodeBuffer(samples);
    const mp3Blob = new Blob(mp3Data, { type: 'audio/mp3' });

    // Create download link for MP3
    const mp3Url = URL.createObjectURL(mp3Blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = mp3Url;
    a.download = 'audio.mp3';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(mp3Url);
  };
}
