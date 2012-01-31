<img src="https://github.com/sourishkrout/binoculars/raw/master/public/binoculars.png">

# Binoculars
Visualize geo spatial map tile usage interactively using a heat map overlay.

# How it works
```binoculars``` provides a zoom-able and pan-able map view of the San Francisco bay area. It'll put a heat map inspired overlay on top of the map. The overlay is based on the view count of each tile. Each tile ranges from dark red (no views) to bright green (most views).

# Data + License
Due to license restrictions I, unfortunately, can't open source the usage data of the base map tiles. If people are interested I can included the specification of the data format though.
The mapping API and it's tiles are licensed under a proprietary (no ESRI or Google though). Restrictions apply. All other code included in the repo is free to anyone.

# Stack
The app runs off ```node.js```. The data gets fetched from in-memory storage ```redis``` on the fly before each map tile gets produced by the ```cairo``` backed server-side implementation of ```canvas``` (PNG). The usage data (not included) was extracted and aggregate from Apache logs using ```hadoop``` and ```pig```.
Each base map tile triggers a separate request for an overlay tile to the ```node.js``` app that basically returns a PNG file. That way it integrates nicely with the underlying mapping API.

# That's it!
Hit me up if you have questions or ideas.