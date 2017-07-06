function PlayerTemplate(render, player) {
  render`
  <div class="Song">
    <div class="Song__cover">
      <img class="Cover__image" src="${player.track.img}" />
    </div>
    <div class="Song__metadata">
      <h3 class="Song__title">${player.track.title}<small> ${player.track.album}</small></h3>
      <div class="Song__frequency-chart"></div>
      <progress value="${player.track.audio.currentTime}" max="${player.track.max}" class="Song__player-progress"></progress>
      <div class="Song__time-progress">
        <span class="Time-Progress__seconds Time-Progress__seconds--is-elapsed">0:${player.track.elapsedSeconds}</span>
        <span class="Time-Progress__seconds Time-Progress__seconds--is-remaining">0:${player.track.remainingSeconds}</span>
      </div>
      <div class="Song__controls">
        <a role="button" onClick="${player.track.rewind.bind(player.track)}" class="Control__button Control__button--is-backwards">&#x23ea;</a>
        <a role="button" onClick="${player.track.toggle.bind(player.track)}" class="Control__button Control__button--is-play">&#x23ef;</a>
        <a role="button" class="Control__button Control__button--is-forward">&#x23e9;</a>
      </div>
    </div>
  </div>
  `;
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
  songEnded() {
    console.log("Song ended")
    this.loadSong();
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

const renderNode = hyperHTML.bind(document.getElementById('song-root'))
const jayZdataPromise = $.when($.getJSON("/requests/jayz-1.json"));

jayZdataPromise.then(
  jayZdata => {
    (document.querySelector("#response").innerHTML = prettyjson.render(
      jayZdata
    ))
    
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    const audio = new Audio();
    
    audio.crossOrigin = "anonymous";
    audio.controls = true;
    
    const source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    
    const playerInstance = new Player(jayZdata.results, audio)
    
    audio.addEventListener('ended', playerInstance.songEnded.bind(playerInstance))
    
    PlayerTemplate(renderNode, playerInstance)
    setInterval(PlayerTemplate, 0, renderNode, playerInstance);
  }
);


