function PlayerTemplate(render, player) {
  render`
  <div class="Player">
  <img class="Player__background" src="${player.track.img}" />
  <div class="Song">
    <div class="Song__cover">
      <img class="Cover__image" src="${player.track.img}" />
    </div>
    <div class="Song__metadata">
      <h3 class="Song__title">${player.track.title}<small> ${player.track.album}</small></h3>
      <canvas width="450px" height="36px" class="Song__frequency-chart"></canvas>
      <progress value="${player.track.audio.currentTime}" max="${player.track.max}" class="Song__player-progress"></progress>
      <div class="Song__time-progress">
        <span class="Time-Progress__seconds Time-Progress__seconds--is-elapsed">0:${player.track.elapsedSeconds}</span>
        <span class="Time-Progress__seconds Time-Progress__seconds--is-remaining">0:${player.track.remainingSeconds}</span>
      </div>
      <div class="Song__controls">
        <a role="button" onClick="${player.track.rewind.bind(player.track)}" class="Control__button Control__button--is-backwards"><img src="img/prev.png" /></a>
        <a role="button" onClick="${player.track.toggle.bind(player.track)}" class="Control__button Control__button--is-play"><img src="img/play.png" /></a>
        <a role="button" onClick="${player.nextSong.bind(player)}" class="Control__button Control__button--is-forward"><img src="img/next.png" /></a>
      </div>
    </div>
  </div>
  </div>
  `;
}


function linearScale(domain, range, clamp) {
  return function(value) {
    if (domain[0] === domain[1] || range[0] === range[1]) {
      return range[0];
    }
    var ratio = (range[1] - range[0]) / (domain[1] - domain[0]),
      result = range[0] + ratio * (value - domain[0]);
    return clamp ? Math.min(range[1], Math.max(range[0], result)) : result;
  };
}

class Player {
  constructor(playlist, audio) {
    this.playlist = playlist
    this.audio = audio
    this.loadSong();
  }
  loadSong() {
    this.song = this.playlist[Math.floor(Math.random()*49)]
    this.audio.src = this.song.previewUrl;
    this.track = new Track(this.song.artworkUrl100, this.song.trackName, this.song.collectionName, this.song.trackTimeMillis, this.audio)
  }
  nextSong() {
    this.loadSong();
  }
  loadFrequencyChart(analyser, bufferLength, dataArray) {
    const canvas = document.querySelector('.Song__frequency-chart');
    const context = canvas.getContext('2d');
    const canvasWidth = 450;
    const canvasHeight = 36;
    
    
    
    const draw = function() {
      const drawVisual = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      context.fillStyle = 'rgba(255,255,255,0.2)';
      context.fillRect(0, 0, canvasWidth, canvasHeight);

      const barWidth = (canvasWidth / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      
      //const scale = linearScale([0, 255], [0, 72]);
      const scale = linearScale([0, 255], [0, 100]);

      for(let i = 0; i < bufferLength; i++) {
        barHeight = ~~scale(dataArray[i]);
        
        context.fillStyle = `rgb(${barHeight}, ${barHeight}, ${barHeight})`;
        context.fillRect( x, canvasHeight-barHeight/4, barWidth, barHeight/4);
        //context.fillRect( x, canvasHeight-barHeight/2, barWidth, barHeight/4);
        //context.fillRect( x, canvasHeight/2, barWidth, barHeight/4 );

        x += barWidth + 2;
      }
    };

    draw();
    
    
  }
}

class Track {
  constructor(img, title, album, trackTimeMillis, audio) {
    this.img = img;
    this.title = title;
    this.album = album;
    this.audio = audio
    //this.max = trackTimeMillis / 10000
    this.max = 30
    
    this.play();
  }
  
  toggle() {
    this._isPlaying ? this.stop() : this.play()
  }
  
  rewind() {
    this.audio.currentTime = 0
  }
  
  stop() {
    this._isPlaying = false
    this.audio.pause();
  }
  
  play() {
    this._isPlaying = true
    this.audio.play();
  }
  
  _formatSeconds(value) {
    const roundedValue = Math.floor(value)
    return roundedValue >= 10 ? roundedValue : `0${roundedValue}`
  }
  
  get elapsedSeconds() {
    return this._formatSeconds(this.audio.currentTime)
  }
  
  get remainingSeconds() {
    return this._formatSeconds(this.max - this.audio.currentTime);
  }
}

const renderNode = hyperHTML.bind(document.getElementById('player-root'))
const jayZdataPromise = $.when($.getJSON("/requests/jayz-1.json"));

jayZdataPromise.then(
  jayZdata => {

    const context = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = context.createAnalyser();
    const audio = new Audio();
    
    audio.crossOrigin = "anonymous";
    audio.controls = true;
    
    const source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    
    
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    

    const playerInstance = new Player(jayZdata.results, audio)
    
    audio.addEventListener('ended', playerInstance.nextSong.bind(playerInstance))
    PlayerTemplate(renderNode, playerInstance)
    playerInstance.loadFrequencyChart(analyser, bufferLength, dataArray)
    
    setInterval(PlayerTemplate, 0, renderNode, playerInstance);
  }
);


