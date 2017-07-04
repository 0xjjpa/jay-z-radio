const jayZdataPromise = $.when($.getJSON("/requests/jayz-1.json"));

jayZdataPromise.then(
  jayZdata =>
    (document.querySelector("#response").innerHTML = prettyjson.render(
      jayZdata
    ))
);

function Song(render, state) {
  render`
  <div class="Song">
    <div class="Song__cover">
      <img class="Cover__image" src="${state.img}" />
    </div>
    <div class="Song__metadata">
      <h3 class="Song__title">Song title <small>Album title</small></h3>
      <div class="Song__frequency-chart"></div>
      <div class="Song__player-progress"></div>
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

Song(
  hyperHTML.bind(document.getElementById('song-root')),
  {
    img: '/requests/100x100bb.jpg'
  }
)