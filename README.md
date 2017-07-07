# Jay Z Radio

📻  Only jiggaman songs. Submission for /r/codingprompts (Week 1). Using iTunes Affiliate Search API and preview songs (preloaded requests)

## Technologies

* hyperHTML for templating 📖
* Web Audio API for 🎶
* Canvas for chart animation 📊


Works in Chrome + Firefox, lags poorly in Safari, untested in IE.

## Requests

All songs were preloaded to avoid hitting the API everytime, since there's a soft
limit of 20 calls per minute. Here are the requests made:

**All albums by Jay Z**<br/>
https://itunes.apple.com/lookup?id=112080&entity=album

**All songs per album**<br/>
https://itunes.apple.com/lookup?id=COLLECTIONID&entity=song<br/>
e.g. https://itunes.apple.com/lookup?id=1256675529&entity=song<br/>