import React from "react";
import ReactDOM from "react-dom";
import styles from "./style.module.scss";

const App = () => {
  const audio = React.useRef();
  const canvas1 = React.useRef();
  const canvas2 = React.useRef();
  const canvas3 = React.useRef();

  const chart1 = ({ ctx1, array, HEIGHT }) => {
    var gap = 0;
    for (let i = 0; i < array.length; i++) {
      // ctx1.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255} ,${Math.random() * 255})`;
      ctx1.fillRect(gap, HEIGHT - array[i], 3, array[i]);
      gap = gap + 3 + 2;
    }
  };

  const chart2 = ({ ctx2, array, HEIGHT }) => {
    ctx2.beginPath();
    ctx2.moveTo(0, HEIGHT);
    // ctx2.strokeStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255} ,${Math.random() * 255})`;
    for (var i = 0; i < array.length; i++) {
      ctx2.lineTo(i, HEIGHT - array[i]);
    }
    ctx2.closePath();
    ctx2.stroke();
  };

  const chart3 = ({ ctx3, array, HEIGHT }) => {
    var gap3 = 0;
    for (let i = 0; i < array.length; i++) {
      // ctx3.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255} ,${Math.random() * 255})`;
      ctx3.fillRect(gap3, HEIGHT - array[i], 1, array[i]);
      gap3 = gap3 + 1;
    }
  };

  const getBuffer = (analyser, array) => {
    requestAnimationFrame(() => getBuffer(analyser, array));
    analyser.getByteFrequencyData(array);

    const ctx1 = canvas1.current.getContext("2d");
    const ctx2 = canvas2.current.getContext("2d");
    const ctx3 = canvas3.current.getContext("2d");

    const WIDTH = (canvas1.current.width = canvas2.current.width = canvas3.current.width = canvas1.current.clientWidth);
    const HEIGHT = (canvas1.current.height = canvas2.current.height = canvas3.current.height = canvas1.current.clientHeight);

    chart1({ ctx1, array, WIDTH, HEIGHT });
    chart2({ ctx2, array, WIDTH, HEIGHT });
    chart3({ ctx3, array, WIDTH, HEIGHT });
  };
  const initAudioData = (stream) => {
    document.documentElement.requestFullscreen();
    document.querySelector("." + styles.marks).style.zIndex = -1;
    var audioStream = stream;
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var source = audioCtx.createMediaStreamSource(audioStream);

    const gainNode = audioCtx.createGain();
    source.connect(gainNode).connect(audioCtx.destination);
    gainNode.gain.value = 0;

    console.log(gainNode);

    var analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 2048 * 2;
    source.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);
    var array = new Uint8Array(analyserNode.frequencyBinCount);

    getBuffer(analyserNode, array);
  };

  const hanldePlay = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(initAudioData)
      .catch((e) => alert(e));
  };

  // React.useEffect(() => {
  //   const audioElement = audio.current;
  //   audioElement.addEventListener("play", () => {
  //     window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
  //     var audioContext = new AudioContext();
  //     var analyser = audioContext.createAnalyser();
  //     var audioSrc = audioContext.createMediaElementSource(audioElement);
  //     audioSrc.connect(analyser);
  //     analyser.connect(audioContext.destination);
  //     analyser.fftSize = 2048 * 2;
  //     var array = new Uint8Array(analyser.frequencyBinCount);
  //     getBuffer(analyser, array);
  //   });
  // }, []);

  return (
    <div className={styles.container}>
      <div className={styles.canvasBox}>
        <canvas ref={canvas1} />
        <canvas ref={canvas2} />
        <canvas ref={canvas3} />
      </div>
      <div className={styles.marks}>
        <button onClick={hanldePlay}>同意获取麦克风权限</button>
      </div>
      {/* <div className={styles.audioBox}>
        <audio ref={audio} src="/qianqianquege.mp3" controls />
        <audio ref={audio} src="/zuihouderen.mp3" controls />
      </div> */}
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
