PageRocker
==========

![Rock Your Page](http://ww3.sinaimg.cn/large/6a1456b2gw1e8u23fxfjjj206y091wfa.jpg)

A chrome extension which can track user's head to control the display of the webpage the user visiting. When zooming in or out, we keep the modal of div static, we just adjust the textual element.

#### Todo
* javascript audio decode library with spectrum UI: Aurora.js, SoundManager 2
    * Build aurora.js(from node)
    * key for search: html5 audio spectrum
* add popip.html to control seperate content scripts for the purpose of different functions
* add the status control of the tracking video(backgroud control or event page)
* design the ui: 
    * Fixed UI size
    * tracking status showing
    * user control ui interface
    * status control: stop, start, init the tracker(event listening and so on)
* add head track and reload function

#### Issues
* Font Sizer
    * can not close the camera when the tracker is closed
* 3D WebPage
    * Sometimes the webpage is not shown properly when the webpages are not just text webpages



#### Open
* add 3D page rotate function(Wikipedia: Head-coupled perspective, using headtracking event instead of facetracking)
* Displays an interactive webpage within a Three.js and add head-coupled effect.
* Rock Your page based on build-in music rythm
* using audiolib.js to implement page rocker

#### Development Log

##### 9.15

#### Team Meeting
