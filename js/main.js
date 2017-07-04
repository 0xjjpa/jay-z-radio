function SongTemplate(render, state) {
  render`
  <div class="Song">
    <div class="Song__cover">
      <img class="Cover__image" src="${state.img}" />
    </div>
    <div class="Song__metadata">
      <h3 class="Song__title">${state.title}<small> ${state.album}</small></h3>
      <div class="Song__frequency-chart"></div>
      <progress value="${state.progress}" max="30" class="Song__player-progress"></progress>
      <div class="Song__time-progress">
        <span class="Time-Progress__seconds Time-Progress__seconds--is-elapsed">0:00</span>
        <span class="Time-Progress__seconds Time-Progress__seconds--is-remaining">0:00</span>
      </div>
      <div class="Song__controls">
        <a role="button" class="Control__button Control__button--is-backwards"></a>
        <a role="button" class="Control__button Control__button--is-play"></a>
        <a role="button" class="Control__button Control__button--is-forward"></a>
      </div>
    </div>
  </div>
  `;
}

class Track {
  constructor(img, title, album) {
    this.img = img;
    this.title = title;
    this.album = album;
    this.progress = 0;
    this.progressInterval = setInterval(this.updateProgress.bind(this), 1000)
  }
  
  updateProgress() {
    this.progress = ~~(this.progress + 1);
  }
}

const renderNode = hyperHTML.bind(document.getElementById('song-root'))
const jayZdataPromise = $.when($.getJSON("/requests/jayz-1.json"));

jayZdataPromise.then(
  jayZdata => {
    (document.querySelector("#response").innerHTML = prettyjson.render(
      jayZdata
    ))
    let track = jayZdata.results[0]
    let progress = 0
    let trackInstance = new Track(track.artworkUrl100, track.trackName, track.collectionName)
    SongTemplate(renderNode, trackInstance)
    setInterval(SongTemplate, 1000, renderNode, trackInstance);
  }
);


