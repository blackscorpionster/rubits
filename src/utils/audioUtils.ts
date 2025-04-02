/**
 * Play a winning sound with fallback mechanisms for different browser scenarios
 */
export const playWinSound = () => {
  if (typeof window === "undefined") return;

  const checkAudioContext = () => {
    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return false;

      const testContext = new AudioContext();
      const state = testContext.state;
      testContext.close();

      return state === "running";
    } catch (e) {
      console.warn("Audio context check failed:", e);
      return false;
    }
  };

  const audio = new Audio("/sounds/win-sound.mp3");
  audio.volume = 0.7;
  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      console.error("Audio element error:", err);

      // If we have autoplay restrictions, try a different approach
      if (err.name === "NotAllowedError" || !checkAudioContext()) {
        console.log("Audio autoplay blocked - waiting for user interaction");
        return; // WinningNotification will handle this with button press
      }

      // Method 2: Fallback to Web Audio API
      try {
        const AudioContext =
          window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const audioContext = new AudioContext();

        fetch("/sounds/win-sound.mp3")
          .then((response) => response.arrayBuffer())
          .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
          .then((audioBuffer) => {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;

            // Add volume control
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.7;

            source.connect(gainNode);
            gainNode.connect(audioContext.destination);

            source.start(0);
            console.log("Playing with Web Audio API");
          })
          .catch((error) => console.error("Web Audio API error:", error));
      } catch (e) {
        console.error("Web Audio API setup error:", e);
      }
    });
  }
};
