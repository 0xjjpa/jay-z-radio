function SongTemplate(render, state) {
  render`
  <div class="Song">
    <div class="Song__cover">
      <img class="Cover__image" src="${state.img}" />
    </div>
    <div class="Song__metadata">
      <h3 class="Song__title">${state.title}<small> ${state.album}</small></h3>
      <div class="Song__frequency-chart"></div>
      <progress value="${state.audio.currentTime}" max="${state.max}" class="Song__player-progress"></progress>
      <div class="Song__time-progress">
        <span class="Time-Progress__seconds Time-Progress__seconds--is-elapsed">0:${state.elapsedSeconds}</span>
        <span class="Time-Progress__seconds Time-Progress__seconds--is-remaining">0:${state.remainingSeconds}</span>
      </div>
      <div class="Song__controls">
        <a role="button" onClick="${state.rewind.bind(state)}" class="Control__button Control__button--is-backwards">&#x23ea;</a>
        <a role="button" onClick="${state.toggle.bind(state)}" class="Control__button Control__button--is-play">&#x23ef;</a>
        <a role="button" class="Control__button Control__button--is-forward">&#x23e9;</a>
      </div>
    </div>
  </div>
  `;
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
    audio.autoplay = true;
    audio.loop = true;
    
    const source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    
    let track = jayZdata.results[Math.floor(Math.random()*49)]
    
    audio.src = track.previewUrl;
    
    let trackInstance = new Track(track.artworkUrl100, track.trackName, track.collectionName, track.trackTimeMillis, audio)
    SongTemplate(renderNode, trackInstance)
    
    setInterval(SongTemplate, 0, renderNode, trackInstance);
  }
);


