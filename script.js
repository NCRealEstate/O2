(function(){
    var script = {
 "scrollBarColor": "#000000",
 "scripts": {
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "existsKey": function(key){  return key in window; },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "unregisterKey": function(key){  delete window[key]; },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "getKey": function(key){  return window[key]; },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "registerKey": function(key, value){  window[key] = value; },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } }
 },
 "paddingBottom": 0,
 "borderRadius": 0,
 "backgroundPreloadEnabled": true,
 "id": "rootPlayer",
 "buttonToggleMute": "this.IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
 "desktopMipmappingEnabled": false,
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "defaultVRPointer": "laser",
 "width": "100%",
 "definitions": [{
 "hfovMax": 130,
 "label": "IMG_20240409_074916_00_merged",
 "id": "panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_D0DDCF70_C494_EE43_41CC_85E2AB32EE7E",
  "this.overlay_D0580112_C494_13C7_41DF_745C5358B517"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 155.51,
   "backwardYaw": -108.89,
   "panorama": "this.panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": -110.66,
   "backwardYaw": -11.21,
   "panorama": "this.panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false,
 "class": "Panorama"
},
{
 "items": [
  {
   "media": "this.panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117",
   "camera": "this.panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912",
   "camera": "this.panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6",
   "camera": "this.panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74",
   "camera": "this.panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8",
   "camera": "this.panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04",
   "camera": "this.panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F",
   "camera": "this.panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB",
   "camera": "this.panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093",
   "camera": "this.panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.video_D3555645_C546_EE4E_41E0_7F08837EC265",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 9, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 9)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer); this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 9, 0)",
   "player": "this.MainViewerVideoPlayer",
   "class": "VideoPlayListItem"
  }
 ],
 "id": "ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist",
 "class": "PlayList"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 29.51,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_D9C045F2_CFA1_0B2E_41DD_96E5DC89FC38",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "class": "Video",
 "label": "Mona - Made with Clipchamp",
 "scaleMode": "fit_inside",
 "width": 1920,
 "thumbnailUrl": "media/video_C0188319_CFA3_0F1B_41CD_353C6A22B114_t.jpg",
 "loop": false,
 "id": "video_C0188319_CFA3_0F1B_41CD_353C6A22B114",
 "height": 1080,
 "video": {
  "width": 1920,
  "class": "VideoResource",
  "height": 1080,
  "mp4Url": "media/video_C0188319_CFA3_0F1B_41CD_353C6A22B114.mp4"
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 69.34,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DBCAC6C8_CFA1_0979_41CE_6E1A556644FC",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -113.02,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_D91C4623_CFA1_092E_41E5_150FC09A5BDA",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 71.11,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DB4377A6_CFA1_1729_41D6_66A23B9561AC",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "displayPlaybackBar": true,
 "id": "MainViewerVideoPlayer",
 "viewerArea": "this.MainViewer",
 "class": "VideoPlayer"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "hfovMax": 130,
 "label": "IMG_20240409_074215_00_merged",
 "id": "panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_CBDF7E90_C494_2EC3_41DC_C3583452C5EC",
  "this.overlay_CB08D5DE_C494_127F_41D5_00C440C6D646"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": -122.75,
   "backwardYaw": 66.98,
   "panorama": "this.panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": 137.8,
   "backwardYaw": -70.82,
   "panorama": "this.panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false,
 "class": "Panorama"
},
{
 "hfovMax": 130,
 "label": "IMG_20240409_074304_00_merged",
 "id": "panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_D4BBC902_C494_13C6_41C5_2A80B8B4C037",
  "this.overlay_D4F77CB9_C494_32C5_41E0_B5D77B09B070",
  "this.overlay_CBD7E247_C494_F64D_41D6_C4F0180D837D",
  "this.overlay_D5AE9102_C494_33C7_41DF_5903F0F1ED9F",
  "this.overlay_DD2C93B1_CFBF_0F2B_41C7_430F8013156A"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": -120.69,
   "backwardYaw": 30.1,
   "panorama": "this.panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": -150.49,
   "backwardYaw": -2.66,
   "panorama": "this.panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": -70.82,
   "backwardYaw": 137.8,
   "panorama": "this.panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": -166.43,
   "backwardYaw": 33.64,
   "panorama": "this.panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false,
 "class": "Panorama"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -23.9,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_D97AF63D_CFA1_091B_41C9_5735B5DC147D",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -149.9,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DB30D707_CFA1_08F7_41D9_2728EBA4542D",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "items": [
  {
   "media": "this.panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117",
   "camera": "this.panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912",
   "camera": "this.panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6",
   "camera": "this.panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74",
   "camera": "this.panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8",
   "camera": "this.panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04",
   "camera": "this.panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F",
   "camera": "this.panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB",
   "camera": "this.panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093",
   "camera": "this.panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.video_D3555645_C546_EE4E_41E0_7F08837EC265",
   "end": "this.trigger('tourEnded')",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.mainPlayList, 9, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.mainPlayList, 9)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer); this.setEndToItemIndex(this.mainPlayList, 9, 0)",
   "player": "this.MainViewerVideoPlayer",
   "class": "VideoPlayListItem"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 16.82,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_D974264A_CFA1_0979_41DF_FD4EF7393A2D",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "hfovMax": 130,
 "label": "IMG_20240409_074349_00_merged",
 "id": "panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_D50EB520_C49C_33C3_41C6_000F80DB07E2",
  "this.overlay_D5C42414_C49C_11C3_41C1_4E4807945FBB",
  "this.overlay_D5F8CE27_C49C_11CD_41D6_A95A0BC6E0D7",
  "this.overlay_D51A7BDB_C49D_F645_41E8_11936671C427",
  "this.overlay_D067E6B3_C547_6EC9_41D0_0BF190DE2666"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 86.16,
   "backwardYaw": -78.49,
   "panorama": "this.panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": 30.1,
   "backwardYaw": -120.69,
   "panorama": "this.panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": 156.1,
   "backwardYaw": 5.61,
   "panorama": "this.panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": 126.59,
   "backwardYaw": -2.95,
   "panorama": "this.panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false,
 "class": "Panorama"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -93.84,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_D9CB05E5_CFA1_0B2A_41DF_E2461DD2A0CA",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "items": [
  {
   "media": "this.video_DFFF5AB3_CFA1_792E_41E6_B270A42F813C",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_D9EA45BD_CFA1_0B1A_41CE_76FDBE10F21B, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_D9EA45BD_CFA1_0B1A_41CE_76FDBE10F21B, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "player": "this.MainViewerVideoPlayer",
   "class": "VideoPlayListItem"
  }
 ],
 "id": "playList_D9EA45BD_CFA1_0B1A_41CE_76FDBE10F21B",
 "class": "PlayList"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -12.39,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DB7F7766_CFA1_1729_41E8_577826AA3CBA",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 109.18,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_D90B0630_CFA1_0929_41D9_EE1D2B3A63B5",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 57.25,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DB1C773E_CFA1_1719_41E7_3A2C5FDA4665",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "hfovMax": 130,
 "label": "IMG_20240409_074453_00_merged",
 "id": "panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_D52ED6E8_C49C_1E43_41E2_1274CB653267",
  "this.overlay_D56E88EB_C49F_F245_41CB_83DAEDB99B2C",
  "this.overlay_D6B669FB_C49C_1245_41D4_686A64FB16B2",
  "this.overlay_D6C16FAB_C49C_2EC5_41BB_F94454147CDD",
  "this.overlay_DF5EBF9D_CFA3_171B_41DD_A804BD8D9C25",
  "this.overlay_DE00269C_CFA1_0919_41E9_9036BAA167B4"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 5.61,
   "backwardYaw": 156.1,
   "panorama": "this.panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": 38.07,
   "backwardYaw": -163.18,
   "panorama": "this.panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": -77.61,
   "backwardYaw": 127.77,
   "panorama": "this.panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": 88.82,
   "backwardYaw": -47.51,
   "panorama": "this.panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false,
 "class": "Panorama"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -174.39,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DBC536EE_CFA1_0939_41C3_0DF7367BDA46",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -146.36,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DB24472F_CFA1_1737_41C8_E593AB96541C",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "items": [
  {
   "media": "this.video_E4B75AA7_C48C_16CD_41DC_BD53E4F3411C",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_D9EAA5BC_CFA1_0B1A_41D5_017E66A7DDAC, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_D9EAA5BC_CFA1_0B1A_41D5_017E66A7DDAC, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "player": "this.MainViewerVideoPlayer",
   "class": "VideoPlayListItem"
  }
 ],
 "id": "playList_D9EAA5BC_CFA1_0B1A_41D5_017E66A7DDAC",
 "class": "PlayList"
},
{
 "class": "Video",
 "label": "1118668_4k_Map_Earth_1280x720",
 "scaleMode": "fit_inside",
 "width": 1280,
 "thumbnailUrl": "media/video_D1EBF206_C547_A1CB_41DE_7FE07BB918A0_t.jpg",
 "loop": false,
 "id": "video_D1EBF206_C547_A1CB_41DE_7FE07BB918A0",
 "height": 720,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_D1EBF206_C547_A1CB_41DE_7FE07BB918A0.mp4"
 }
},
{
 "hfovMax": 130,
 "label": "IMG_20240409_074423_00_merged",
 "id": "panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_D4FDD7CF_C494_1E5D_41E6_3EA09D42D47E",
  "this.overlay_D422DD53_C494_7245_41E5_541FA1A49336",
  "this.overlay_D44ABB39_C494_17C5_4177_643776A18892",
  "this.overlay_D58FA982_C494_32C7_41E4_A9EEAEB23AB9",
  "this.overlay_D4E813A5_C54A_E6C9_41E3_05BD4CCD19B1"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": -78.49,
   "backwardYaw": 86.16,
   "panorama": "this.panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": -2.66,
   "backwardYaw": -150.49,
   "panorama": "this.panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": -163.18,
   "backwardYaw": -150.49,
   "panorama": "this.panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": -163.18,
   "backwardYaw": 38.07,
   "panorama": "this.panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": 167.61,
   "backwardYaw": 30.39,
   "panorama": "this.panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false,
 "class": "Panorama"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 177.34,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DB35F714_CFA1_08E9_41E0_59109712FD6F",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 59.31,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DBC326E2_CFA1_0929_41E1_DF89E9D0EDA7",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "items": [
  {
   "media": "this.video_C0188319_CFA3_0F1B_41CD_353C6A22B114",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_D9EA75BD_CFA1_0B1A_41DF_321F5236675D, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_D9EA75BD_CFA1_0B1A_41DF_321F5236675D, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "player": "this.MainViewerVideoPlayer",
   "class": "VideoPlayListItem"
  }
 ],
 "id": "playList_D9EA75BD_CFA1_0B1A_41DF_321F5236675D",
 "class": "PlayList"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -42.2,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DB2DB720_CFA1_1729_41A0_589E887C90BA",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "class": "Video",
 "label": "ui45pu35mvlf7sk3kvggaps6jo-92ac15b1e1266689de9cf43406ed4372 [MConverter.eu]",
 "scaleMode": "fit_inside",
 "width": 512,
 "thumbnailUrl": "media/video_DFE7D8CA_CFA3_1979_41E4_7CCD603F8CE2_t.jpg",
 "loop": false,
 "id": "video_DFE7D8CA_CFA3_1979_41E4_7CCD603F8CE2",
 "height": 600,
 "video": {
  "width": 512,
  "class": "VideoResource",
  "height": 600,
  "mp4Url": "media/video_DFE7D8CA_CFA3_1979_41E4_7CCD603F8CE2.mp4"
 }
},
{
 "audio": {
  "mp3Url": "media/audio_DA8352D6_CFA1_0916_41DC_1C673FCD3C5A.mp3",
  "oggUrl": "media/audio_DA8352D6_CFA1_0916_41DC_1C673FCD3C5A.ogg",
  "class": "AudioResource"
 },
 "autoplay": true,
 "id": "audio_DA8352D6_CFA1_0916_41DC_1C673FCD3C5A",
 "data": {
  "label": "amazing-day-iros-young-main-version-18425-02-07"
 },
 "class": "MediaAudio"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -24.49,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DB005759_CFA1_171B_41E4_8EBCDA879FC6",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "items": [
  {
   "media": "this.video_D1EBF206_C547_A1CB_41DE_7FE07BB918A0",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_D9EAF5BC_CFA1_0B1A_41E1_F362FF74B7E4, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_D9EAF5BC_CFA1_0B1A_41E1_F362FF74B7E4, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "player": "this.MainViewerVideoPlayer",
   "class": "VideoPlayListItem"
  }
 ],
 "id": "playList_D9EAF5BC_CFA1_0B1A_41E1_F362FF74B7E4",
 "class": "PlayList"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -52.23,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_D964A655_CFA1_096B_41BC_8E57EFB5AD05",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "items": [
  {
   "media": "this.video_E4C81EFF_C48C_6E3D_41E6_50D706BC22F8",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_D9EA95BC_CFA1_0B1A_41B1_A8E82A9B9C49, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_D9EA95BC_CFA1_0B1A_41B1_A8E82A9B9C49, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "player": "this.MainViewerVideoPlayer",
   "class": "VideoPlayListItem"
  }
 ],
 "id": "playList_D9EA95BC_CFA1_0B1A_41B1_A8E82A9B9C49",
 "class": "PlayList"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 168.79,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DAB9C7B2_CFA1_1729_41D1_558A0A71F4F6",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 177.05,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DB3EC6FB_CFA1_091F_41E3_08FA6E9638FC",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "items": [
  {
   "media": "this.video_DFE7D8CA_CFA3_1979_41E4_7CCD603F8CE2",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_D9EAD5BC_CFA1_0B1A_41CB_6A486F266C64, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_D9EAD5BC_CFA1_0B1A_41CB_6A486F266C64, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "player": "this.MainViewerVideoPlayer",
   "class": "VideoPlayListItem"
  }
 ],
 "id": "playList_D9EAD5BC_CFA1_0B1A_41CB_6A486F266C64",
 "class": "PlayList"
},
{
 "hfovMax": 130,
 "label": "IMG_20240409_074523_00_merged",
 "id": "panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_CAD224E3_C494_3245_41D1_33018FB888A5",
  "this.overlay_CBF89E92_C494_6EC6_41CC_D79B4853D54B",
  "this.overlay_CA2EAEA8_C495_EEC3_41C1_3456644A30CE",
  "this.overlay_DFDC32DA_CFA1_0919_41D5_EFCD593F486A"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 66.98,
   "backwardYaw": -122.75,
   "panorama": "this.panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": 127.77,
   "backwardYaw": -77.61,
   "panorama": "this.panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": -108.89,
   "backwardYaw": 155.51,
   "panorama": "this.panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false,
 "class": "Panorama"
},
{
 "class": "Video",
 "label": "190828_27_SuperTrees_HD_17",
 "scaleMode": "fit_inside",
 "width": 1920,
 "thumbnailUrl": "media/video_E4C81EFF_C48C_6E3D_41E6_50D706BC22F8_t.jpg",
 "loop": false,
 "id": "video_E4C81EFF_C48C_6E3D_41E6_50D706BC22F8",
 "height": 1080,
 "video": {
  "width": 1920,
  "class": "VideoResource",
  "height": 1080,
  "mp4Url": "media/video_E4C81EFF_C48C_6E3D_41E6_50D706BC22F8.mp4"
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -53.41,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DB5F878D_CFA1_17FB_41CF_E0D19B4F13A3",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 102.39,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DB0B774B_CFA1_177F_41DF_038DECE40E83",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 13.57,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DB544799_CFA1_171B_41D3_9A4274921D41",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "class": "Video",
 "label": "1118668_4k_Map_Earth_1280x720",
 "scaleMode": "fit_inside",
 "width": 1280,
 "thumbnailUrl": "media/video_D3555645_C546_EE4E_41E0_7F08837EC265_t.jpg",
 "loop": false,
 "id": "video_D3555645_C546_EE4E_41E0_7F08837EC265",
 "height": 720,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_D3555645_C546_EE4E_41E0_7F08837EC265.mp4"
 }
},
{
 "hfovMax": 130,
 "label": "IMG_20240409_074557_00_merged",
 "id": "panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_D60485B6_C49D_F2CF_41DC_26D98D4C88C2",
  "this.overlay_D6409A8C_C49C_16C3_41D1_35DDD766FD02",
  "this.overlay_D67A27A4_C49C_3EC3_41BC_7A6DEFB2A740",
  "this.overlay_D784187D_C49C_123D_41D4_8AF8B1532FBF",
  "this.overlay_DEF548FB_CFA1_391F_41E6_8EDF62ECC201",
  "this.overlay_DB0F1169_CFA1_0B3B_41E0_8C4599D7E104"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 30.39,
   "backwardYaw": 167.61,
   "panorama": "this.panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": -47.51,
   "backwardYaw": 88.82,
   "panorama": "this.panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": -140.75,
   "backwardYaw": 75.25,
   "panorama": "this.panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": -2.95,
   "backwardYaw": 126.59,
   "panorama": "this.panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": 33.64,
   "backwardYaw": -166.43,
   "panorama": "this.panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false,
 "class": "Panorama"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -149.61,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_D920F617_CFA1_0916_41D8_7336CBB08941",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "hfovMax": 130,
 "label": "IMG_20240409_074650_00_merged",
 "id": "panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_D7C43DAA_C494_12C7_41C9_1F531492BDA7",
  "this.overlay_D7040E21_C494_31C5_41D5_AF27C0E6B1B6"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 75.25,
   "backwardYaw": -140.75,
   "panorama": "this.panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": -11.21,
   "backwardYaw": -110.66,
   "panorama": "this.panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false,
 "class": "Panorama"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -91.18,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DB6A1773_CFA1_172F_41E6_26E094C592A1",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "class": "Video",
 "label": "Mona - Made with Clipchamp",
 "scaleMode": "fit_inside",
 "width": 1080,
 "thumbnailUrl": "media/video_DFFF5AB3_CFA1_792E_41E6_B270A42F813C_t.jpg",
 "loop": false,
 "id": "video_DFFF5AB3_CFA1_792E_41E6_B270A42F813C",
 "height": 1350,
 "video": {
  "width": 858,
  "class": "VideoResource",
  "height": 1074,
  "mp4Url": "media/video_DFFF5AB3_CFA1_792E_41E6_B270A42F813C.mp4"
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 29.51,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_D93F15FE_CFA1_0B16_41D5_F4091CAC4DA8",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -141.93,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_D92AC60B_CFA1_08FE_41D1_D1A2515A936D",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "class": "Video",
 "label": "1109603_1080p_4k_2k_1280x720",
 "scaleMode": "fit_inside",
 "width": 1280,
 "thumbnailUrl": "media/video_E4B75AA7_C48C_16CD_41DC_BD53E4F3411C_t.jpg",
 "loop": false,
 "id": "video_E4B75AA7_C48C_16CD_41DC_BD53E4F3411C",
 "height": 720,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_E4B75AA7_C48C_16CD_41DC_BD53E4F3411C.mp4"
 }
},
{
 "buttonToggleHotspots": "this.IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96",
 "gyroscopeVerticalDraggingEnabled": true,
 "mouseControlMode": "drag_acceleration",
 "buttonCardboardView": [
  "this.IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
  "this.IconButton_1B9ADD00_16C4_0505_41B4_B043CA1AA270"
 ],
 "buttonToggleGyroscope": "this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A",
 "touchControlMode": "drag_rotation",
 "displayPlaybackBar": true,
 "id": "MainViewerPanoramaPlayer",
 "viewerArea": "this.MainViewer",
 "class": "PanoramaPlayer"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 101.51,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DBCF86D5_CFA1_096B_41E9_7D33AB7EB766",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 39.25,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_D941C66E_CFA1_0939_41D7_C4DB74F930F2",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -104.75,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_DB60B780_CFA1_17E9_41CC_2CA850796E63",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 132.49,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_D9579662_CFA1_0929_41B1_D86019F50A07",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
 "width": 58,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "maxWidth": 58,
 "maxHeight": 58,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "toggle",
 "paddingLeft": 0,
 "height": 58,
 "pressedIconURL": "skin/IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D_pressed.png",
 "minHeight": 1,
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "IconButton MUTE"
 },
 "horizontalAlign": "center",
 "propagateClick": true,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D.png",
 "cursor": "hand"
},
{
 "toolTipDisplayTime": 600,
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "MainViewer",
 "left": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipShadowColor": "#333333",
 "progressOpacity": 1,
 "transitionMode": "blending",
 "width": "100%",
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarHeadBorderRadius": 0,
 "vrPointerSelectionColor": "#FF6600",
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBottom": 5,
 "toolTipFontWeight": "normal",
 "playbackBarLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "toolTipPaddingBottom": 7,
 "playbackBarHeadShadow": true,
 "playbackBarHeadHeight": 15,
 "toolTipBorderColor": "#767676",
 "vrPointerSelectionTime": 2000,
 "progressBorderColor": "#FFFFFF",
 "toolTipBorderSize": 1,
 "borderSize": 0,
 "progressBackgroundOpacity": 1,
 "paddingLeft": 0,
 "playbackBarOpacity": 1,
 "height": "100%",
 "toolTipPaddingTop": 7,
 "progressBottom": 55,
 "toolTipTextShadowBlurRadius": 3,
 "progressHeight": 6,
 "firstTransitionDuration": 0,
 "toolTipBackgroundColor": "#000000",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBarOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontFamily": "Georgia",
 "toolTipTextShadowColor": "#000000",
 "progressBorderSize": 0,
 "toolTipBorderRadius": 3,
 "toolTipShadowOpacity": 0,
 "toolTipPaddingRight": 10,
 "playbackBarBorderSize": 0,
 "progressBorderRadius": 0,
 "progressLeft": 0,
 "paddingRight": 0,
 "progressBarBorderColor": "#0066FF",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarProgressOpacity": 1,
 "playbackBarHeight": 10,
 "playbackBarHeadWidth": 6,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowOpacity": 0,
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipOpacity": 0.5,
 "toolTipFontSize": 13,
 "top": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "toolTipFontColor": "#FFFFFF",
 "class": "ViewerArea",
 "paddingTop": 0,
 "progressBarBorderRadius": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipShadowSpread": 0,
 "minHeight": 50,
 "playbackBarProgressBorderRadius": 0,
 "transitionDuration": 500,
 "progressBarBorderSize": 6,
 "playbackBarHeadShadowBlurRadius": 3,
 "shadow": false,
 "toolTipPaddingLeft": 10,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadShadowColor": "#000000",
 "minWidth": 100,
 "toolTipFontStyle": "normal",
 "toolTipShadowBlurRadius": 3,
 "progressRight": 0,
 "progressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "propagateClick": true,
 "data": {
  "name": "Main Viewer"
 },
 "playbackBarHeadShadowVerticalLength": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarBorderRadius": 0
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "id": "Container_EF8F8BD8_E386_8E03_41E3_4CF7CC1F4D8E",
 "width": 115.05,
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "right": "0%",
 "children": [
  "this.Container_EF8F8BD8_E386_8E02_41E5_FC5C5513733A",
  "this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE"
 ],
 "scrollBarMargin": 2,
 "top": "0%",
 "height": 641,
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "shadow": false,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "--SETTINGS"
 },
 "horizontalAlign": "left",
 "overflow": "scroll",
 "propagateClick": true,
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "id": "Container_1B9AAD00_16C4_0505_41B5_6F4AE0747E48",
 "left": "0%",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "right": "0%",
 "children": [
  "this.Image_1B99DD00_16C4_0505_41B3_51F09727447A",
  "this.Container_1B99BD00_16C4_0505_41A4_A3C2452B0288",
  "this.IconButton_1B9ADD00_16C4_0505_41B4_B043CA1AA270"
 ],
 "scrollBarMargin": 2,
 "bottom": 0,
 "height": 118,
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.64,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "backgroundImageUrl": "skin/Container_1B9AAD00_16C4_0505_41B5_6F4AE0747E48.png",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "shadow": false,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "--MENU"
 },
 "horizontalAlign": "left",
 "overflow": "visible",
 "propagateClick": true,
 "gap": 10
},
{
 "scrollBarColor": "#000000",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "left": "0%",
 "contentOpaque": false,
 "id": "Container_062AB830_1140_E215_41AF_6C9D65345420",
 "paddingRight": 0,
 "right": "0%",
 "verticalAlign": "top",
 "creationPolicy": "inAdvance",
 "children": [
  "this.Container_062A782F_1140_E20B_41AF_B3E5DE341773",
  "this.Container_062A9830_1140_E215_41A7_5F2BBE5C20E4"
 ],
 "scrollBarMargin": 2,
 "top": "0%",
 "backgroundColorDirection": "vertical",
 "bottom": "0%",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.6,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "click": "this.setComponentVisibility(this.Container_062AB830_1140_E215_41AF_6C9D65345420, false, 0, null, null, false)",
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "--INFO photo"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "visible": false,
 "propagateClick": true,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "scrollBarColor": "#000000",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "left": "0%",
 "contentOpaque": false,
 "id": "Container_23F0F7B8_0C0A_629D_418A_F171085EFBF8",
 "paddingRight": 0,
 "right": "0%",
 "verticalAlign": "top",
 "creationPolicy": "inAdvance",
 "children": [
  "this.Container_23F7B7B7_0C0A_6293_4197_F931EEC6FA48",
  "this.Container_23F097B8_0C0A_629D_4176_D87C90BA32B6"
 ],
 "scrollBarMargin": 2,
 "top": "0%",
 "backgroundColorDirection": "vertical",
 "bottom": "0%",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.6,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "click": "this.setComponentVisibility(this.Container_23F0F7B8_0C0A_629D_418A_F171085EFBF8, false, 0, null, null, false)",
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "--INFO photoalbum"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "visible": false,
 "propagateClick": true,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "scrollBarColor": "#000000",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "left": "0%",
 "contentOpaque": false,
 "id": "Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15",
 "paddingRight": 0,
 "right": "0%",
 "verticalAlign": "top",
 "creationPolicy": "inAdvance",
 "children": [
  "this.Container_39A197B1_0C06_62AF_419A_D15E4DDD2528"
 ],
 "scrollBarMargin": 2,
 "top": "0%",
 "backgroundColorDirection": "vertical",
 "bottom": "0%",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.6,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, false, 0, null, null, false)",
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "--PANORAMA LIST"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "visible": false,
 "propagateClick": true,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "scrollBarColor": "#000000",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "left": "0%",
 "contentOpaque": false,
 "id": "Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7",
 "paddingRight": 0,
 "right": "0%",
 "verticalAlign": "top",
 "creationPolicy": "inAdvance",
 "children": [
  "this.Container_221C1648_0C06_E5FD_4180_8A2E8B66315E",
  "this.Container_221B3648_0C06_E5FD_4199_FCE031AE003B"
 ],
 "scrollBarMargin": 2,
 "top": "0%",
 "backgroundColorDirection": "vertical",
 "bottom": "0%",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.6,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, false, 0, null, null, false)",
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "--LOCATION"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "visible": false,
 "propagateClick": true,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "scrollBarColor": "#000000",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "left": "0%",
 "contentOpaque": false,
 "id": "Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41",
 "paddingRight": 0,
 "right": "0%",
 "verticalAlign": "top",
 "creationPolicy": "inAdvance",
 "children": [
  "this.Container_2F8A6686_0D4F_6B71_4174_A02FE43588D3"
 ],
 "scrollBarMargin": 2,
 "top": "0%",
 "backgroundColorDirection": "vertical",
 "bottom": "0%",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.6,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, false, 0, null, null, false)",
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "--FLOORPLAN"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "visible": false,
 "propagateClick": true,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "scrollBarColor": "#000000",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "left": "0%",
 "contentOpaque": false,
 "id": "Container_2820BA13_0D5D_5B97_4192_AABC38F6F169",
 "paddingRight": 0,
 "right": "0%",
 "verticalAlign": "top",
 "creationPolicy": "inAdvance",
 "children": [
  "this.Container_28215A13_0D5D_5B97_4198_A7CA735E9E0A"
 ],
 "scrollBarMargin": 2,
 "top": "0%",
 "backgroundColorDirection": "vertical",
 "bottom": "0%",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.6,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "click": "this.setComponentVisibility(this.Container_2820BA13_0D5D_5B97_4192_AABC38F6F169, true, 0, null, null, false)",
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "--PHOTOALBUM + text"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "visible": false,
 "propagateClick": true,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "scrollBarColor": "#000000",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "left": "0%",
 "contentOpaque": false,
 "id": "Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E",
 "paddingRight": 0,
 "right": "0%",
 "verticalAlign": "top",
 "creationPolicy": "inAdvance",
 "children": [
  "this.Container_2A193C4C_0D3B_DFF0_4161_A2CD128EF536"
 ],
 "scrollBarMargin": 2,
 "top": "0%",
 "backgroundColorDirection": "vertical",
 "bottom": "0%",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.6,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, false, 0, null, null, false)",
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "--PHOTOALBUM"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "visible": false,
 "propagateClick": true,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "scrollBarColor": "#04A3E1",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "left": "0%",
 "contentOpaque": false,
 "id": "Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC",
 "paddingRight": 0,
 "right": "0%",
 "verticalAlign": "top",
 "creationPolicy": "inAdvance",
 "children": [
  "this.Container_06C5DBA5_1140_A63F_41AD_1D83A33F1255",
  "this.Container_06C43BA5_1140_A63F_41A1_96DC8F4CAD2F"
 ],
 "scrollBarMargin": 2,
 "top": "0%",
 "backgroundColorDirection": "vertical",
 "bottom": "0%",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.6,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "click": "this.setComponentVisibility(this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC, false, 0, null, null, false)",
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "--REALTOR"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "visible": false,
 "propagateClick": true,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": "0%",
 "id": "Image_B44E6FBD_BAA2_0E15_41E1_F18F1E555CBE",
 "paddingRight": 0,
 "width": "5.398%",
 "verticalAlign": "middle",
 "url": "skin/Image_B44E6FBD_BAA2_0E15_41E1_F18F1E555CBE.png",
 "maxWidth": 1258,
 "maxHeight": 953,
 "top": "0%",
 "class": "Image",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "height": "7.606%",
 "minHeight": 1,
 "click": "this.openLink('http://NicholasC.JohnLScott.com', '_blank')",
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "Image4523"
 },
 "horizontalAlign": "center",
 "visible": false,
 "propagateClick": false,
 "scaleMode": "fit_inside",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
 "width": 58,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "maxWidth": 58,
 "maxHeight": 58,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "toggle",
 "paddingLeft": 0,
 "height": 58,
 "pressedIconURL": "skin/IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0_pressed.png",
 "minHeight": 1,
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "IconButton FULLSCREEN"
 },
 "horizontalAlign": "center",
 "propagateClick": true,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0.png",
 "cursor": "hand"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.78,
   "yaw": 155.51,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -7.48,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117, this.camera_DB4377A6_CFA1_1729_41D6_66A23B9561AC); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE71F3EE_C4B4_165F_41B2_754CC3E18F16",
   "yaw": 155.51,
   "pitch": -7.48,
   "distance": 100,
   "hfov": 8.78,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D0DDCF70_C494_EE43_41CC_85E2AB32EE7E",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.78,
   "yaw": -110.66,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -7.19,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB, this.camera_DAB9C7B2_CFA1_1729_41D1_558A0A71F4F6); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE7133EE_C4B4_165F_41D4_FD447A02785B",
   "yaw": -110.66,
   "pitch": -7.19,
   "distance": 100,
   "hfov": 8.78,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D0580112_C494_13C7_41DF_745C5358B517",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.8,
   "yaw": 137.8,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -6.3,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6, this.camera_D90B0630_CFA1_0929_41D9_EE1D2B3A63B5); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6BE3E2_C4B4_1647_41C5_D9526EE45F8C",
   "yaw": 137.8,
   "pitch": -6.3,
   "distance": 100,
   "hfov": 8.8,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_CBDF7E90_C494_2EC3_41DC_C3583452C5EC",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.79,
   "yaw": -122.75,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -6.89,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117, this.camera_D91C4623_CFA1_092E_41E5_150FC09A5BDA); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6B23E2_C4B4_1647_41DB_1703D0C47621",
   "yaw": -122.75,
   "pitch": -6.89,
   "distance": 100,
   "hfov": 8.79,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_CB08D5DE_C494_127F_41D5_00C440C6D646",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.78,
   "yaw": -70.82,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -7.48,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912, this.camera_DB2DB720_CFA1_1729_41A0_589E887C90BA); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6B63E2_C4B4_1647_41D9_5A0DE0314FE7",
   "yaw": -70.82,
   "pitch": -7.48,
   "distance": 100,
   "hfov": 8.78,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D4BBC902_C494_13C6_41C5_2A80B8B4C037",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.5,
   "yaw": -150.49,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.33,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74, this.camera_DB35F714_CFA1_08E9_41E0_59109712FD6F); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6CB3E2_C4B4_1647_41DF_1B9255090F1A",
   "yaw": -150.49,
   "pitch": -16.33,
   "distance": 100,
   "hfov": 8.5,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D4F77CB9_C494_32C5_41E0_B5D77B09B070",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.74,
   "yaw": -120.69,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_1_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -9.25,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8, this.camera_DB30D707_CFA1_08F7_41D9_2728EBA4542D); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6CF3E2_C4B4_1647_41D8_66AEA3F74C90",
   "yaw": -120.69,
   "pitch": -9.25,
   "distance": 100,
   "hfov": 8.74,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_CBD7E247_C494_F64D_41D6_C4F0180D837D",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.75,
   "yaw": -166.43,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_1_HS_3_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -8.66,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F, this.camera_DB24472F_CFA1_1737_41C8_E593AB96541C); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6C63E2_C4B4_1647_41E6_BA7B068D0808",
   "yaw": -166.43,
   "pitch": -8.66,
   "distance": 100,
   "hfov": 8.75,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D5AE9102_C494_33C7_41DF_5903F0F1ED9F",
 "class": "HotspotPanoramaOverlay"
},
{
 "rotationX": -4.23,
 "autoplay": true,
 "id": "overlay_DD2C93B1_CFBF_0F2B_41C7_430F8013156A",
 "roll": 3.88,
 "loop": true,
 "vfov": 6.81,
 "image": {
  "levels": [
   {
    "url": "media/overlay_DD2C93B1_CFBF_0F2B_41C7_430F8013156A_t.jpg",
    "width": 1280,
    "height": 720,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": -0.11,
 "useHandCursor": true,
 "videoVisibleOnStop": false,
 "rotationY": -33.85,
 "yaw": -114.84,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_D1EBF206_C547_A1CB_41DE_7FE07BB918A0.mp4"
 },
 "enabledInCardboard": true,
 "distance": 50,
 "hfov": 11.15,
 "blending": 0,
 "data": {
  "label": "Video"
 },
 "class": "VideoPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.83,
   "yaw": 30.1,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -3.64,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6, this.camera_DBC326E2_CFA1_0929_41E1_DF89E9D0EDA7); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6EF3E2_C4B4_1647_41C0_B03A3DA0264C",
   "yaw": 30.1,
   "pitch": -3.64,
   "distance": 100,
   "hfov": 8.83,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D50EB520_C49C_33C3_41C6_000F80DB07E2",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.12,
   "yaw": 86.16,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -23.41,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74, this.camera_DBCF86D5_CFA1_096B_41E9_7D33AB7EB766); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6E53E2_C4B4_1647_41D6_B863D826C24E",
   "yaw": 86.16,
   "pitch": -23.41,
   "distance": 100,
   "hfov": 8.12,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D5C42414_C49C_11C3_41C1_4E4807945FBB",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.82,
   "yaw": 126.59,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_1_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -4.53,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F, this.camera_DB3EC6FB_CFA1_091F_41E3_08FA6E9638FC); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6F93E2_C4B4_1647_41DA_6A9094AE8587",
   "yaw": 126.59,
   "pitch": -4.53,
   "distance": 100,
   "hfov": 8.82,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D5F8CE27_C49C_11CD_41D6_A95A0BC6E0D7",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.56,
   "yaw": 156.1,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_1_HS_3_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -14.86,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04, this.camera_DBC536EE_CFA1_0939_41C3_0DF7367BDA46); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6FF3E2_C4B4_1647_41D4_78D99E094503",
   "yaw": 156.1,
   "pitch": -14.86,
   "distance": 100,
   "hfov": 8.56,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D51A7BDB_C49D_F645_41E8_11936671C427",
 "class": "HotspotPanoramaOverlay"
},
{
 "rotationX": -11.02,
 "autoplay": true,
 "id": "overlay_D067E6B3_C547_6EC9_41D0_0BF190DE2666",
 "roll": -1.02,
 "loop": true,
 "vfov": 32.13,
 "image": {
  "levels": [
   {
    "url": "media/overlay_D067E6B3_C547_6EC9_41D0_0BF190DE2666_t.jpg",
    "width": 1280,
    "height": 720,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": 9.12,
 "useHandCursor": true,
 "videoVisibleOnStop": false,
 "rotationY": 19.5,
 "yaw": -77.88,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_D1EBF206_C547_A1CB_41DE_7FE07BB918A0.mp4"
 },
 "enabledInCardboard": true,
 "distance": 50,
 "hfov": 53.3,
 "blending": 0,
 "data": {
  "label": "Video"
 },
 "class": "VideoPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.85,
   "yaw": 33.93,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -1.28,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6F43EE_C4B4_165F_41E0_5F0242ACAC0A",
   "yaw": 33.93,
   "pitch": -1.28,
   "distance": 100,
   "hfov": 8.85,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D52ED6E8_C49C_1E43_41E2_1274CB653267",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.7,
   "yaw": 38.07,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -10.73,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74, this.camera_D974264A_CFA1_0979_41DF_FD4EF7393A2D); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6E03EE_C4B4_165F_41D2_40222AA425A0",
   "yaw": 38.07,
   "pitch": -10.73,
   "distance": 100,
   "hfov": 8.7,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D56E88EB_C49F_F245_41CB_83DAEDB99B2C",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.71,
   "yaw": -77.61,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_1_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -10.43,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117, this.camera_D964A655_CFA1_096B_41BC_8E57EFB5AD05); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6E63EE_C4B4_165F_41B3_636431640903",
   "yaw": -77.61,
   "pitch": -10.43,
   "distance": 100,
   "hfov": 8.71,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D6B669FB_C49C_1245_41D4_686A64FB16B2",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.61,
   "yaw": 88.82,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_1_HS_3_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.38,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F, this.camera_D9579662_CFA1_0929_41B1_D86019F50A07); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6FA3EE_C4B4_165F_41E6_870321E82296",
   "yaw": 88.82,
   "pitch": -13.38,
   "distance": 100,
   "hfov": 8.61,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D6C16FAB_C49C_2EC5_41BB_F94454147CDD",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.66,
   "yaw": 5.61,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0_HS_4_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -11.91,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8, this.camera_D97AF63D_CFA1_091B_41C9_5735B5DC147D); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D79608C1_CFA1_196B_41E6_5223F36F2800",
   "yaw": 5.61,
   "pitch": -11.91,
   "distance": 100,
   "hfov": 8.66,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_DF5EBF9D_CFA3_171B_41DD_A804BD8D9C25",
 "class": "HotspotPanoramaOverlay"
},
{
 "rotationX": -3.28,
 "autoplay": true,
 "id": "overlay_DE00269C_CFA1_0919_41E9_9036BAA167B4",
 "roll": -2.35,
 "loop": true,
 "vfov": 7.4,
 "image": {
  "levels": [
   {
    "url": "media/overlay_DE00269C_CFA1_0919_41E9_9036BAA167B4_t.jpg",
    "width": 1280,
    "height": 720,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": 4.32,
 "useHandCursor": true,
 "videoVisibleOnStop": false,
 "rotationY": 61.3,
 "yaw": -5.76,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_D1EBF206_C547_A1CB_41DE_7FE07BB918A0.mp4"
 },
 "enabledInCardboard": true,
 "distance": 50,
 "hfov": 13.4,
 "blending": 0,
 "data": {
  "label": "Video"
 },
 "class": "VideoPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 7.87,
   "yaw": 167.61,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -27.25,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F, this.camera_D920F617_CFA1_0916_41D8_7336CBB08941); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6DA3E2_C4B4_1647_41C1_A50426AB6B0D",
   "yaw": 167.61,
   "pitch": -27.25,
   "distance": 100,
   "hfov": 7.87,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D4FDD7CF_C494_1E5D_41E6_3EA09D42D47E",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.81,
   "yaw": 171.15,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -5.71,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6D03E2_C4B4_1647_4191_65C1389B8F87",
   "yaw": 171.15,
   "pitch": -5.71,
   "distance": 100,
   "hfov": 8.81,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D422DD53_C494_7245_41E5_541FA1A49336",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.81,
   "yaw": -2.66,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_1_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -5.41,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6, this.camera_D9C045F2_CFA1_0B2E_41DD_96E5DC89FC38); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6D43E2_C4B4_1647_41D5_75CC066CE8E8",
   "yaw": -2.66,
   "pitch": -5.41,
   "distance": 100,
   "hfov": 8.81,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D44ABB39_C494_17C5_4177_643776A18892",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.29,
   "yaw": -78.49,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_1_HS_3_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -20.46,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8, this.camera_D9CB05E5_CFA1_0B2A_41DF_E2461DD2A0CA); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6EA3E2_C4B4_1647_41DE_017EC36AB558",
   "yaw": -78.49,
   "pitch": -20.46,
   "distance": 100,
   "hfov": 8.29,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D58FA982_C494_32C7_41E4_A9EEAEB23AB9",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.62,
   "yaw": -163.18,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0_HS_4_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.09,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04, this.camera_D92AC60B_CFA1_08FE_41D1_D1A2515A936D); this.mainPlayList.set('selectedIndex', 2); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D6AAEBA1_C54A_A6C9_41E6_BF797708D832",
   "yaw": -163.18,
   "pitch": -13.09,
   "distance": 100,
   "hfov": 8.62,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D4E813A5_C54A_E6C9_41E3_05BD4CCD19B1",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.82,
   "yaw": 66.98,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -4.53,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912, this.camera_DB1C773E_CFA1_1719_41E7_3A2C5FDA4665); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6AA3E2_C4B4_1647_41D1_D3BCE4A01BEC",
   "yaw": 66.98,
   "pitch": -4.53,
   "distance": 100,
   "hfov": 8.82,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_CAD224E3_C494_3245_41D1_33018FB888A5",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.75,
   "yaw": -108.89,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -8.66,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093, this.camera_DB005759_CFA1_171B_41E4_8EBCDA879FC6); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6A23E2_C4B4_1647_41E0_4BF67E7CF920",
   "yaw": -108.89,
   "pitch": -8.66,
   "distance": 100,
   "hfov": 8.75,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_CBF89E92_C494_6EC6_41CC_D79B4853D54B",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.8,
   "yaw": 127.77,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_1_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -6.3,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04, this.camera_DB0B774B_CFA1_177F_41DF_038DECE40E83); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6A73E2_C4B4_1647_41DE_FDA4671F1155",
   "yaw": 127.77,
   "pitch": -6.3,
   "distance": 100,
   "hfov": 8.8,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_CA2EAEA8_C495_EEC3_41C1_3456644A30CE",
 "class": "HotspotPanoramaOverlay"
},
{
 "rotationX": -0.91,
 "autoplay": false,
 "id": "overlay_DFDC32DA_CFA1_0919_41D5_EFCD593F486A",
 "roll": 1.03,
 "loop": false,
 "vfov": 11.77,
 "image": {
  "levels": [
   {
    "url": "media/overlay_DFDC32DA_CFA1_0919_41D5_EFCD593F486A_t.jpg",
    "width": 1080,
    "height": 1350,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": 2.74,
 "useHandCursor": true,
 "videoVisibleOnStop": false,
 "data": {
  "label": "Video"
 },
 "rotationY": -49.41,
 "yaw": 18.29,
 "video": {
  "width": 858,
  "class": "VideoResource",
  "height": 1074,
  "mp4Url": "media/video_DFFF5AB3_CFA1_792E_41E6_B270A42F813C.mp4"
 },
 "enabledInCardboard": true,
 "click": "this.overlay_DFDC32DA_CFA1_0919_41D5_EFCD593F486A.play()",
 "distance": 50,
 "hfov": 8.53,
 "blending": 0,
 "class": "VideoPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.85,
   "yaw": 33.64,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0.49,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6, this.camera_DB544799_CFA1_171B_41D3_9A4274921D41); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6F03EE_C4B4_165F_41D9_37488BCB4AEB",
   "yaw": 33.64,
   "pitch": 0.49,
   "distance": 100,
   "hfov": 8.85,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D60485B6_C49D_F2CF_41DC_26D98D4C88C2",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.54,
   "yaw": 30.39,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -15.15,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74, this.camera_DB7F7766_CFA1_1729_41E8_577826AA3CBA); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE6F33EE_C4B4_165F_41E3_93F57E20A594",
   "yaw": 30.39,
   "pitch": -15.15,
   "distance": 100,
   "hfov": 8.54,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D6409A8C_C49C_16C3_41D1_35DDD766FD02",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.78,
   "yaw": -140.75,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_1_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -7.48,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB, this.camera_DB60B780_CFA1_17E9_41CC_2CA850796E63); this.mainPlayList.set('selectedIndex', 1); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE70A3EE_C4B4_165F_41E7_C2AD6CCCA2E4",
   "yaw": -140.75,
   "pitch": -7.48,
   "distance": 100,
   "hfov": 8.78,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D67A27A4_C49C_3EC3_41BC_7A6DEFB2A740",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.65,
   "yaw": -47.51,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_1_HS_3_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -12.2,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04, this.camera_DB6A1773_CFA1_172F_41E6_26E094C592A1); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE70E3EE_C4B4_165F_41E2_0AB94456CEE9",
   "yaw": -47.51,
   "pitch": -12.2,
   "distance": 100,
   "hfov": 8.65,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D784187D_C49C_123D_41D4_8AF8B1532FBF",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.83,
   "yaw": -2.95,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0_HS_4_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -3.64,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8, this.camera_DB5F878D_CFA1_17FB_41CF_E0D19B4F13A3); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D78888C1_CFA1_196B_41AA_66F0B75EBB33",
   "yaw": -2.95,
   "pitch": -3.64,
   "distance": 100,
   "hfov": 8.83,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_DEF548FB_CFA1_391F_41E6_8EDF62ECC201",
 "class": "HotspotPanoramaOverlay"
},
{
 "rotationX": 1.48,
 "autoplay": true,
 "id": "overlay_DB0F1169_CFA1_0B3B_41E0_8C4599D7E104",
 "roll": 0.57,
 "loop": true,
 "vfov": 6.42,
 "image": {
  "levels": [
   {
    "url": "media/overlay_DB0F1169_CFA1_0B3B_41E0_8C4599D7E104_t.jpg",
    "width": 1280,
    "height": 720,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": 3.86,
 "useHandCursor": true,
 "videoVisibleOnStop": false,
 "rotationY": 37.3,
 "yaw": -11.44,
 "video": {
  "width": 1280,
  "class": "VideoResource",
  "height": 720,
  "mp4Url": "media/video_D1EBF206_C547_A1CB_41DE_7FE07BB918A0.mp4"
 },
 "enabledInCardboard": true,
 "distance": 50,
 "hfov": 10.7,
 "blending": 0,
 "data": {
  "label": "Video"
 },
 "class": "VideoPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.83,
   "yaw": 75.25,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -3.94,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F, this.camera_D941C66E_CFA1_0939_41D7_C4DB74F930F2); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE7043EE_C4B4_165F_41DF_59216767C681",
   "yaw": 75.25,
   "pitch": -3.94,
   "distance": 100,
   "hfov": 8.83,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D7C43DAA_C494_12C7_41C9_1F531492BDA7",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 04"
 },
 "maps": [
  {
   "hfov": 8.82,
   "yaw": -11.21,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -4.82,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093, this.camera_DBCAC6C8_CFA1_0979_41CE_6E1A556644FC); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_DE7193EE_C4B4_165F_41E1_61F21DB0FB47",
   "yaw": -11.21,
   "pitch": -4.82,
   "distance": 100,
   "hfov": 8.82,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_D7040E21_C494_31C5_41D5_AF27C0E6B1B6",
 "class": "HotspotPanoramaOverlay"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96",
 "width": 58,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "maxWidth": 58,
 "maxHeight": 58,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "toggle",
 "paddingLeft": 0,
 "height": 58,
 "pressedIconURL": "skin/IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96_pressed.png",
 "minHeight": 1,
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "IconButton HS "
 },
 "horizontalAlign": "center",
 "propagateClick": true,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96.png",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
 "width": 58,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "rollOverIconURL": "skin/IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB_rollover.png",
 "maxWidth": 58,
 "maxHeight": 58,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": 58,
 "minHeight": 1,
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "IconButton VR"
 },
 "horizontalAlign": "center",
 "visible": false,
 "propagateClick": true,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB.png",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_1B9ADD00_16C4_0505_41B4_B043CA1AA270",
 "width": 100,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "right": 30,
 "rollOverIconURL": "skin/IconButton_1B9ADD00_16C4_0505_41B4_B043CA1AA270_rollover.png",
 "maxWidth": 49,
 "maxHeight": 37,
 "bottom": 8,
 "height": 75,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "pressedIconURL": "skin/IconButton_1B9ADD00_16C4_0505_41B4_B043CA1AA270_pressed.png",
 "minHeight": 1,
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "IconButton VR"
 },
 "horizontalAlign": "center",
 "propagateClick": true,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_1B9ADD00_16C4_0505_41B4_B043CA1AA270.png",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A",
 "width": 58,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "maxWidth": 58,
 "maxHeight": 58,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "toggle",
 "paddingLeft": 0,
 "height": 58,
 "pressedIconURL": "skin/IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A_pressed.png",
 "minHeight": 1,
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "IconButton GYRO"
 },
 "horizontalAlign": "center",
 "propagateClick": true,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A.png",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Container_EF8F8BD8_E386_8E02_41E5_FC5C5513733A",
 "width": 110,
 "contentOpaque": false,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "right": "0%",
 "children": [
  "this.IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329"
 ],
 "scrollBarMargin": 2,
 "top": "0%",
 "height": 110,
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "shadow": false,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "data": {
  "name": "button menu sup"
 },
 "horizontalAlign": "center",
 "overflow": "visible",
 "propagateClick": true,
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "vertical",
 "id": "Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "right": "0%",
 "width": "91.304%",
 "children": [
  "this.IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
  "this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A",
  "this.IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
  "this.IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96",
  "this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
  "this.IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC",
  "this.IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521"
 ],
 "scrollBarMargin": 2,
 "bottom": "0%",
 "height": "85.959%",
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "data": {
  "name": "-button set"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": true,
 "horizontalAlign": "center",
 "gap": 3
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": "0%",
 "id": "Image_1B99DD00_16C4_0505_41B3_51F09727447A",
 "paddingRight": 0,
 "right": "0%",
 "verticalAlign": "middle",
 "url": "skin/Image_1B99DD00_16C4_0505_41B3_51F09727447A.png",
 "maxWidth": 3000,
 "maxHeight": 2,
 "bottom": 53,
 "height": 2,
 "class": "Image",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "white line"
 },
 "horizontalAlign": "center",
 "propagateClick": true,
 "scaleMode": "fit_outside"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Container_1B99BD00_16C4_0505_41A4_A3C2452B0288",
 "left": "0%",
 "width": 1199,
 "contentOpaque": false,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "children": [
  "this.Button_1B998D00_16C4_0505_41AD_67CAA4AAEFE0",
  "this.Button_1B999D00_16C4_0505_41AB_D0C2E7857448",
  "this.Button_1B9A6D00_16C4_0505_4197_F2108627CC98",
  "this.Button_1B9A4D00_16C4_0505_4193_E0EA69B0CBB0",
  "this.Button_1B9A5D00_16C4_0505_41B0_D18F25F377C4",
  "this.Button_1B9A3D00_16C4_0505_41B2_6830155B7D52"
 ],
 "scrollBarMargin": 2,
 "bottom": "0%",
 "height": 51,
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 30,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "shadow": false,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "-button set container"
 },
 "horizontalAlign": "left",
 "overflow": "scroll",
 "propagateClick": true,
 "gap": 3
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": "10%",
 "contentOpaque": false,
 "id": "Container_062A782F_1140_E20B_41AF_B3E5DE341773",
 "layout": "horizontal",
 "paddingRight": 0,
 "right": "10%",
 "shadowColor": "#000000",
 "verticalAlign": "top",
 "children": [
  "this.Container_062A682F_1140_E20B_41B0_3071FCBF3DC9",
  "this.Container_062A082F_1140_E20A_4193_DF1A4391DC79"
 ],
 "scrollBarMargin": 2,
 "top": "5%",
 "shadowHorizontalLength": 0,
 "backgroundColorDirection": "vertical",
 "bottom": "5%",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "shadowVerticalLength": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "shadowSpread": 1,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "shadow": true,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 25,
 "data": {
  "name": "Global"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "left",
 "shadowOpacity": 0.3,
 "gap": 10
},
{
 "scrollBarColor": "#000000",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "vertical",
 "left": "10%",
 "contentOpaque": false,
 "id": "Container_062A9830_1140_E215_41A7_5F2BBE5C20E4",
 "paddingRight": 20,
 "right": "10%",
 "verticalAlign": "top",
 "children": [
  "this.IconButton_062A8830_1140_E215_419D_3439F16CCB3E"
 ],
 "scrollBarMargin": 2,
 "top": "5%",
 "bottom": "80%",
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 20,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "Container X global"
 },
 "horizontalAlign": "right",
 "overflow": "visible",
 "propagateClick": false,
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": "10%",
 "contentOpaque": false,
 "id": "Container_23F7B7B7_0C0A_6293_4197_F931EEC6FA48",
 "layout": "horizontal",
 "paddingRight": 0,
 "right": "10%",
 "shadowColor": "#000000",
 "verticalAlign": "top",
 "children": [
  "this.Container_23F797B7_0C0A_6293_41A7_EC89DBCDB93F",
  "this.Container_23F027B7_0C0A_6293_418E_075FCFAA8A19"
 ],
 "shadowHorizontalLength": 0,
 "scrollBarMargin": 2,
 "top": "5%",
 "backgroundColorDirection": "vertical",
 "bottom": "5%",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "shadowVerticalLength": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "shadowSpread": 1,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "shadow": true,
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 25,
 "minWidth": 1,
 "data": {
  "name": "Global"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "left",
 "shadowOpacity": 0.3,
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "vertical",
 "left": "10%",
 "contentOpaque": false,
 "id": "Container_23F097B8_0C0A_629D_4176_D87C90BA32B6",
 "paddingRight": 20,
 "right": "10%",
 "verticalAlign": "top",
 "children": [
  "this.IconButton_23F087B8_0C0A_629D_4194_6F34C6CBE1DA"
 ],
 "scrollBarMargin": 2,
 "top": "5%",
 "bottom": "80%",
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 20,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "shadow": false,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "data": {
  "name": "Container X global"
 },
 "horizontalAlign": "right",
 "overflow": "visible",
 "propagateClick": false,
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": "15%",
 "contentOpaque": false,
 "id": "Container_39A197B1_0C06_62AF_419A_D15E4DDD2528",
 "layout": "vertical",
 "paddingRight": 0,
 "right": "15%",
 "shadowColor": "#000000",
 "verticalAlign": "top",
 "children": [
  "this.Container_3A67552A_0C3A_67BD_4195_ECE46CCB34EA",
  "this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0"
 ],
 "shadowHorizontalLength": 0,
 "scrollBarMargin": 2,
 "top": "7%",
 "backgroundColorDirection": "vertical",
 "bottom": "7%",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "shadowVerticalLength": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "shadowSpread": 1,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "shadow": true,
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 25,
 "minWidth": 1,
 "data": {
  "name": "Global"
 },
 "scrollBarWidth": 10,
 "overflow": "visible",
 "propagateClick": false,
 "horizontalAlign": "center",
 "shadowOpacity": 0.3,
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": "10%",
 "contentOpaque": false,
 "id": "Container_221C1648_0C06_E5FD_4180_8A2E8B66315E",
 "layout": "horizontal",
 "paddingRight": 0,
 "right": "10%",
 "shadowColor": "#000000",
 "verticalAlign": "top",
 "children": [
  "this.Container_221C0648_0C06_E5FD_4193_12BCE1D6DD6B",
  "this.Container_221C9648_0C06_E5FD_41A1_A79DE53B3031"
 ],
 "shadowHorizontalLength": 0,
 "scrollBarMargin": 2,
 "top": "5%",
 "backgroundColorDirection": "vertical",
 "bottom": "5%",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "shadowVerticalLength": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "shadowSpread": 1,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "shadow": true,
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 25,
 "minWidth": 1,
 "data": {
  "name": "Global"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "left",
 "shadowOpacity": 0.3,
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "vertical",
 "left": "10%",
 "contentOpaque": false,
 "id": "Container_221B3648_0C06_E5FD_4199_FCE031AE003B",
 "paddingRight": 20,
 "right": "10%",
 "verticalAlign": "top",
 "children": [
  "this.IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF"
 ],
 "scrollBarMargin": 2,
 "top": "5%",
 "bottom": "80%",
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 20,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "shadow": false,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "data": {
  "name": "Container X global"
 },
 "horizontalAlign": "right",
 "overflow": "visible",
 "propagateClick": false,
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": "15%",
 "contentOpaque": false,
 "id": "Container_2F8A6686_0D4F_6B71_4174_A02FE43588D3",
 "layout": "vertical",
 "paddingRight": 0,
 "right": "15%",
 "shadowColor": "#000000",
 "verticalAlign": "top",
 "children": [
  "this.Container_2F8A7686_0D4F_6B71_41A9_1A894413085C",
  "this.MapViewer"
 ],
 "shadowHorizontalLength": 0,
 "scrollBarMargin": 2,
 "top": "7%",
 "backgroundColorDirection": "vertical",
 "bottom": "7%",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "shadowVerticalLength": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "shadowSpread": 1,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "shadow": true,
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 25,
 "minWidth": 1,
 "data": {
  "name": "Global"
 },
 "scrollBarWidth": 10,
 "overflow": "visible",
 "propagateClick": false,
 "horizontalAlign": "center",
 "shadowOpacity": 0.3,
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": "15%",
 "contentOpaque": false,
 "id": "Container_28215A13_0D5D_5B97_4198_A7CA735E9E0A",
 "layout": "vertical",
 "paddingRight": 0,
 "right": "15%",
 "shadowColor": "#000000",
 "verticalAlign": "top",
 "children": [
  "this.Container_28214A13_0D5D_5B97_4193_B631E1496339",
  "this.Container_2B0BF61C_0D5B_2B90_4179_632488B1209E"
 ],
 "shadowHorizontalLength": 0,
 "scrollBarMargin": 2,
 "top": "7%",
 "backgroundColorDirection": "vertical",
 "bottom": "7%",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "shadowVerticalLength": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "shadowSpread": 1,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "shadow": true,
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 25,
 "minWidth": 1,
 "data": {
  "name": "Global"
 },
 "scrollBarWidth": 10,
 "overflow": "visible",
 "propagateClick": false,
 "horizontalAlign": "center",
 "shadowOpacity": 0.3,
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": "15%",
 "contentOpaque": false,
 "id": "Container_2A193C4C_0D3B_DFF0_4161_A2CD128EF536",
 "layout": "vertical",
 "paddingRight": 0,
 "right": "15%",
 "shadowColor": "#000000",
 "verticalAlign": "top",
 "children": [
  "this.Container_2A19EC4C_0D3B_DFF0_414D_37145C22C5BC"
 ],
 "shadowHorizontalLength": 0,
 "scrollBarMargin": 2,
 "top": "7%",
 "backgroundColorDirection": "vertical",
 "bottom": "7%",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "shadowVerticalLength": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "shadowSpread": 1,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "shadow": true,
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 25,
 "minWidth": 1,
 "data": {
  "name": "Global"
 },
 "scrollBarWidth": 10,
 "overflow": "visible",
 "propagateClick": false,
 "horizontalAlign": "center",
 "shadowOpacity": 0.3,
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": "10%",
 "contentOpaque": false,
 "id": "Container_06C5DBA5_1140_A63F_41AD_1D83A33F1255",
 "layout": "horizontal",
 "paddingRight": 0,
 "right": "10%",
 "shadowColor": "#000000",
 "verticalAlign": "top",
 "children": [
  "this.Container_06C5ABA5_1140_A63F_41A9_850CF958D0DB",
  "this.Container_06C58BA5_1140_A63F_419D_EC83F94F8C54"
 ],
 "shadowHorizontalLength": 0,
 "scrollBarMargin": 2,
 "top": "5%",
 "backgroundColorDirection": "vertical",
 "bottom": "5%",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "shadowVerticalLength": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "shadowSpread": 1,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "shadow": true,
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 25,
 "minWidth": 1,
 "data": {
  "name": "Global"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "left",
 "shadowOpacity": 0.3,
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "vertical",
 "left": "10%",
 "contentOpaque": false,
 "id": "Container_06C43BA5_1140_A63F_41A1_96DC8F4CAD2F",
 "paddingRight": 20,
 "right": "10%",
 "verticalAlign": "top",
 "children": [
  "this.IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81"
 ],
 "scrollBarMargin": 2,
 "top": "5%",
 "bottom": "80%",
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 20,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "shadow": false,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "data": {
  "name": "Container X global"
 },
 "horizontalAlign": "right",
 "overflow": "visible",
 "propagateClick": false,
 "gap": 10
},
{
 "levels": [
  {
   "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_1_HS_0_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE71F3EE_C4B4_165F_41B2_754CC3E18F16",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFCC5CD1_C48C_1245_41E7_17EB56CEF093_1_HS_1_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE7133EE_C4B4_165F_41D4_FD447A02785B",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_1_HS_0_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6BE3E2_C4B4_1647_41C5_D9526EE45F8C",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CF757F9F_C48C_2EFD_41D1_63F4C821A912_1_HS_1_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6B23E2_C4B4_1647_41DB_1703D0C47621",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_1_HS_0_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6B63E2_C4B4_1647_41D9_5A0DE0314FE7",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_1_HS_1_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6CB3E2_C4B4_1647_41DF_1B9255090F1A",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_1_HS_2_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6CF3E2_C4B4_1647_41D8_66AEA3F74C90",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFA1D671_C48C_1E45_41C1_D871B7D4EEA6_1_HS_3_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6C63E2_C4B4_1647_41E6_BA7B068D0808",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_1_HS_0_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6EF3E2_C4B4_1647_41C0_B03A3DA0264C",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_1_HS_1_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6E53E2_C4B4_1647_41D6_B863D826C24E",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_1_HS_2_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6F93E2_C4B4_1647_41DA_6A9094AE8587",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFCF4BCC_C48C_1643_4188_9B39E57F09C8_1_HS_3_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6FF3E2_C4B4_1647_41D4_78D99E094503",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_1_HS_0_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6F43EE_C4B4_165F_41E0_5F0242ACAC0A",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_1_HS_1_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6E03EE_C4B4_165F_41D2_40222AA425A0",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_1_HS_2_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6E63EE_C4B4_165F_41B3_636431640903",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_1_HS_3_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6FA3EE_C4B4_165F_41E6_870321E82296",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFCDE68E_C48C_FEDF_41DE_FBFB2E8ABA04_0_HS_4_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_D79608C1_CFA1_196B_41E6_5223F36F2800",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_1_HS_0_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6DA3E2_C4B4_1647_41C1_A50426AB6B0D",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_1_HS_1_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6D03E2_C4B4_1647_4191_65C1389B8F87",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_1_HS_2_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6D43E2_C4B4_1647_41D5_75CC066CE8E8",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_1_HS_3_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6EA3E2_C4B4_1647_41DE_017EC36AB558",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFC8513F_C48C_F23D_41E6_67508D0A2C74_0_HS_4_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_D6AAEBA1_C54A_A6C9_41E6_BF797708D832",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_1_HS_0_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6AA3E2_C4B4_1647_41D1_D3BCE4A01BEC",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_1_HS_1_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6A23E2_C4B4_1647_41E0_4BF67E7CF920",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFCF5C2C_C48C_F1C2_41DD_ED477D432117_1_HS_2_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6A73E2_C4B4_1647_41DE_FDA4671F1155",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_1_HS_0_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6F03EE_C4B4_165F_41D9_37488BCB4AEB",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_1_HS_1_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE6F33EE_C4B4_165F_41E3_93F57E20A594",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_1_HS_2_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE70A3EE_C4B4_165F_41E7_C2AD6CCCA2E4",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_1_HS_3_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE70E3EE_C4B4_165F_41E2_0AB94456CEE9",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFC80202_C48C_11C7_41A1_FF34107CB00F_0_HS_4_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_D78888C1_CFA1_196B_41AA_66F0B75EBB33",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_1_HS_0_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE7043EE_C4B4_165F_41DF_59216767C681",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "levels": [
  {
   "url": "media/panorama_CFCE177A_C48C_1E47_41DC_C0CABB3CB9CB_1_HS_1_0.png",
   "width": 400,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_DE7193EE_C4B4_165F_41E1_61F21DB0FB47",
 "colCount": 4,
 "class": "AnimatedImageResource"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329",
 "width": 60,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "maxWidth": 60,
 "maxHeight": 60,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "toggle",
 "paddingLeft": 0,
 "height": 60,
 "pressedIconURL": "skin/IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329_pressed.png",
 "minHeight": 1,
 "click": "if(!this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE.get('visible')){ this.setComponentVisibility(this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE, true, 0, null, null, false) } else { this.setComponentVisibility(this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE, false, 0, null, null, false) }",
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "image button menu"
 },
 "horizontalAlign": "center",
 "propagateClick": true,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329.png",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC",
 "width": 58,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "rollOverIconURL": "skin/IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC_rollover.png",
 "maxWidth": 58,
 "maxHeight": 58,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": 58,
 "minHeight": 1,
 "click": "this.shareTwitter(window.location.href)",
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "IconButton TWITTER"
 },
 "horizontalAlign": "center",
 "visible": false,
 "propagateClick": true,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC.png",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521",
 "width": 58,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "rollOverIconURL": "skin/IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521_rollover.png",
 "maxWidth": 58,
 "maxHeight": 58,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": 58,
 "minHeight": 1,
 "click": "this.shareFacebook(window.location.href)",
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "IconButton FB"
 },
 "horizontalAlign": "center",
 "visible": false,
 "propagateClick": true,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521.png",
 "cursor": "hand"
},
{
 "textDecoration": "none",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Button_1B998D00_16C4_0505_41AD_67CAA4AAEFE0",
 "gap": 5,
 "width": 120,
 "pressedBackgroundOpacity": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "click": "this.setComponentVisibility(this.Container_062AB830_1140_E215_41AF_6C9D65345420, true, 0, null, null, false)",
 "shadowColor": "#000000",
 "fontColor": "#FFFFFF",
 "iconHeight": 0,
 "rollOverShadow": false,
 "iconBeforeLabel": true,
 "fontFamily": "Montserrat",
 "rollOverBackgroundColor": [
  "#04A3E1"
 ],
 "rollOverBackgroundOpacity": 0.8,
 "backgroundColorDirection": "vertical",
 "class": "Button",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": 40,
 "fontSize": 12,
 "minHeight": 1,
 "backgroundColorRatios": [
  0
 ],
 "backgroundColor": [
  "#000000"
 ],
 "shadowSpread": 1,
 "fontStyle": "normal",
 "shadow": false,
 "minWidth": 1,
 "label": "HOUSE INFO",
 "rollOverBackgroundColorRatios": [
  0.01
 ],
 "pressedBackgroundColor": [
  "#000000"
 ],
 "data": {
  "name": "Button house info"
 },
 "horizontalAlign": "center",
 "pressedBackgroundColorRatios": [
  0
 ],
 "visible": false,
 "propagateClick": true,
 "fontWeight": "bold",
 "iconWidth": 0,
 "shadowBlurRadius": 15,
 "cursor": "hand",
 "borderColor": "#000000"
},
{
 "textDecoration": "none",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Button_1B999D00_16C4_0505_41AB_D0C2E7857448",
 "gap": 5,
 "width": 130,
 "pressedBackgroundOpacity": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, true, 0, null, null, false)",
 "shadowColor": "#000000",
 "fontColor": "#FFFFFF",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "iconBeforeLabel": true,
 "fontFamily": "Montserrat",
 "rollOverBackgroundColor": [
  "#04A3E1"
 ],
 "backgroundColorDirection": "vertical",
 "class": "Button",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": 40,
 "fontSize": 12,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowSpread": 1,
 "fontStyle": "normal",
 "shadow": false,
 "minWidth": 1,
 "label": "PANORAMA LIST",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "pressedBackgroundColor": [
  "#000000"
 ],
 "data": {
  "name": "Button panorama list"
 },
 "horizontalAlign": "center",
 "pressedBackgroundColorRatios": [
  0
 ],
 "propagateClick": true,
 "fontWeight": "bold",
 "iconWidth": 32,
 "shadowBlurRadius": 15,
 "cursor": "hand",
 "borderColor": "#000000"
},
{
 "textDecoration": "none",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Button_1B9A6D00_16C4_0505_4197_F2108627CC98",
 "gap": 5,
 "width": 90,
 "pressedBackgroundOpacity": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, true, 0, null, null, false)",
 "shadowColor": "#000000",
 "fontColor": "#FFFFFF",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "iconBeforeLabel": true,
 "fontFamily": "Montserrat",
 "rollOverBackgroundColor": [
  "#04A3E1"
 ],
 "backgroundColorDirection": "vertical",
 "class": "Button",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": 40,
 "fontSize": 12,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowSpread": 1,
 "fontStyle": "normal",
 "shadow": false,
 "minWidth": 1,
 "label": "LOCATION",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "pressedBackgroundColor": [
  "#000000"
 ],
 "data": {
  "name": "Button location"
 },
 "horizontalAlign": "center",
 "pressedBackgroundColorRatios": [
  0
 ],
 "propagateClick": true,
 "fontWeight": "bold",
 "iconWidth": 32,
 "shadowBlurRadius": 15,
 "cursor": "hand",
 "borderColor": "#000000"
},
{
 "textDecoration": "none",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Button_1B9A4D00_16C4_0505_4193_E0EA69B0CBB0",
 "gap": 5,
 "width": 103,
 "pressedBackgroundOpacity": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, true, 0, null, null, false)",
 "shadowColor": "#000000",
 "fontColor": "#FFFFFF",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "iconBeforeLabel": true,
 "fontFamily": "Montserrat",
 "rollOverBackgroundColor": [
  "#04A3E1"
 ],
 "backgroundColorDirection": "vertical",
 "class": "Button",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": 40,
 "fontSize": 12,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowSpread": 1,
 "fontStyle": "normal",
 "shadow": false,
 "minWidth": 1,
 "label": "FLOORPLAN",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "pressedBackgroundColor": [
  "#000000"
 ],
 "data": {
  "name": "Button floorplan"
 },
 "horizontalAlign": "center",
 "pressedBackgroundColorRatios": [
  0
 ],
 "visible": false,
 "propagateClick": true,
 "fontWeight": "bold",
 "iconWidth": 32,
 "shadowBlurRadius": 15,
 "cursor": "hand",
 "borderColor": "#000000"
},
{
 "textDecoration": "none",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Button_1B9A5D00_16C4_0505_41B0_D18F25F377C4",
 "gap": 5,
 "width": 112,
 "pressedBackgroundOpacity": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, true, 0, null, null, false)",
 "shadowColor": "#000000",
 "fontColor": "#FFFFFF",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "iconBeforeLabel": true,
 "fontFamily": "Montserrat",
 "rollOverBackgroundColor": [
  "#04A3E1"
 ],
 "backgroundColorDirection": "vertical",
 "class": "Button",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": 40,
 "fontSize": 12,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowSpread": 1,
 "fontStyle": "normal",
 "shadow": false,
 "minWidth": 1,
 "label": "PHOTOALBUM",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "pressedBackgroundColor": [
  "#000000"
 ],
 "data": {
  "name": "Button photoalbum"
 },
 "horizontalAlign": "center",
 "pressedBackgroundColorRatios": [
  0
 ],
 "visible": false,
 "propagateClick": true,
 "fontWeight": "bold",
 "iconWidth": 32,
 "shadowBlurRadius": 15,
 "cursor": "hand",
 "borderColor": "#000000"
},
{
 "textDecoration": "none",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Button_1B9A3D00_16C4_0505_41B2_6830155B7D52",
 "gap": 5,
 "width": 90,
 "pressedBackgroundOpacity": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "click": "this.setComponentVisibility(this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC, true, 0, null, null, false)",
 "shadowColor": "#000000",
 "fontColor": "#FFFFFF",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "iconBeforeLabel": true,
 "fontFamily": "Montserrat",
 "rollOverBackgroundColor": [
  "#04A3E1"
 ],
 "backgroundColorDirection": "vertical",
 "class": "Button",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": 40,
 "fontSize": 12,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowSpread": 1,
 "fontStyle": "normal",
 "shadow": false,
 "minWidth": 1,
 "label": "REALTOR",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "pressedBackgroundColor": [
  "#000000"
 ],
 "data": {
  "name": "Button realtor"
 },
 "horizontalAlign": "center",
 "pressedBackgroundColorRatios": [
  0
 ],
 "visible": false,
 "propagateClick": true,
 "fontWeight": "bold",
 "iconWidth": 32,
 "shadowBlurRadius": 15,
 "cursor": "hand",
 "borderColor": "#000000"
},
{
 "scrollBarColor": "#000000",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "id": "Container_062A682F_1140_E20B_41B0_3071FCBF3DC9",
 "contentOpaque": false,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "width": "85%",
 "children": [
  "this.Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#000000"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "paddingLeft": 0,
 "height": "100%",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "backgroundColorRatios": [
  0
 ],
 "data": {
  "name": "-left"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "center",
 "gap": 10
},
{
 "scrollBarColor": "#0069A3",
 "paddingBottom": 20,
 "borderRadius": 0,
 "layout": "vertical",
 "id": "Container_062A082F_1140_E20A_4193_DF1A4391DC79",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 50,
 "width": "50%",
 "children": [
  "this.Container_062A3830_1140_E215_4195_1698933FE51C",
  "this.Container_062A2830_1140_E215_41AA_EB25B7BD381C",
  "this.Container_062AE830_1140_E215_4180_196ED689F4BD"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.51,
 "borderSize": 0,
 "paddingTop": 20,
 "backgroundOpacity": 1,
 "paddingLeft": 50,
 "height": "100%",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 460,
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "-right"
 },
 "scrollBarWidth": 10,
 "overflow": "visible",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 0
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_062A8830_1140_E215_419D_3439F16CCB3E",
 "verticalAlign": "middle",
 "paddingRight": 0,
 "width": "25%",
 "rollOverIconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E_rollover.jpg",
 "maxWidth": 60,
 "maxHeight": 60,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": "75%",
 "pressedIconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E_pressed.jpg",
 "minHeight": 50,
 "click": "this.setComponentVisibility(this.Container_062AB830_1140_E215_41AF_6C9D65345420, false, 0, null, null, false)",
 "shadow": false,
 "minWidth": 50,
 "data": {
  "name": "X"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E.jpg",
 "cursor": "hand"
},
{
 "scrollBarColor": "#000000",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "id": "Container_23F797B7_0C0A_6293_41A7_EC89DBCDB93F",
 "contentOpaque": false,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "width": "85%",
 "children": [
  "this.ViewerAreaLabeled_23F787B7_0C0A_6293_419A_B4B58B92DAFC",
  "this.Container_23F7F7B7_0C0A_6293_4195_D6240EBAFDC0"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#000000"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "paddingLeft": 0,
 "height": "100%",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "backgroundColorRatios": [
  0
 ],
 "data": {
  "name": "-left"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "center",
 "gap": 10
},
{
 "scrollBarColor": "#0069A3",
 "paddingBottom": 20,
 "borderRadius": 0,
 "layout": "vertical",
 "id": "Container_23F027B7_0C0A_6293_418E_075FCFAA8A19",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 50,
 "width": "50%",
 "children": [
  "this.Container_23F017B8_0C0A_629D_41A5_DE420F5F9331",
  "this.Container_23F007B8_0C0A_629D_41A3_034CF0D91203",
  "this.Container_23F047B8_0C0A_629D_415D_F05EF8619564"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.51,
 "borderSize": 0,
 "paddingTop": 20,
 "backgroundOpacity": 1,
 "paddingLeft": 50,
 "height": "100%",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 460,
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "-right"
 },
 "scrollBarWidth": 10,
 "overflow": "visible",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 0
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_23F087B8_0C0A_629D_4194_6F34C6CBE1DA",
 "verticalAlign": "middle",
 "paddingRight": 0,
 "width": "25%",
 "rollOverIconURL": "skin/IconButton_23F087B8_0C0A_629D_4194_6F34C6CBE1DA_rollover.jpg",
 "maxWidth": 60,
 "maxHeight": 60,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": "75%",
 "pressedIconURL": "skin/IconButton_23F087B8_0C0A_629D_4194_6F34C6CBE1DA_pressed.jpg",
 "minHeight": 50,
 "click": "this.setComponentVisibility(this.Container_23F0F7B8_0C0A_629D_418A_F171085EFBF8, false, 0, null, null, false)",
 "shadow": false,
 "minWidth": 50,
 "data": {
  "name": "X"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_23F087B8_0C0A_629D_4194_6F34C6CBE1DA.jpg",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "id": "Container_3A67552A_0C3A_67BD_4195_ECE46CCB34EA",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "width": "100%",
 "children": [
  "this.HTMLText_3918BF37_0C06_E393_41A1_17CF0ADBAB12",
  "this.IconButton_38922473_0C06_2593_4199_C585853A1AB3"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": 140,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "header"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "paddingBottom": 70,
 "borderRadius": 5,
 "id": "ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0",
 "itemThumbnailScaleMode": "fit_outside",
 "verticalAlign": "middle",
 "itemPaddingLeft": 3,
 "width": "100%",
 "itemMaxWidth": 1000,
 "itemThumbnailWidth": 220,
 "itemPaddingTop": 3,
 "itemBackgroundColor": [],
 "backgroundColorDirection": "vertical",
 "itemPaddingRight": 3,
 "backgroundColor": [
  "#000000"
 ],
 "selectedItemLabelFontColor": "#04A3E1",
 "itemLabelGap": 7,
 "borderSize": 0,
 "rollOverItemThumbnailShadowBlurRadius": 0,
 "scrollBarOpacity": 0.5,
 "paddingLeft": 70,
 "itemThumbnailShadow": false,
 "itemLabelPosition": "bottom",
 "scrollBarVisible": "rollOver",
 "rollOverItemThumbnailShadow": true,
 "backgroundColorRatios": [
  0
 ],
 "itemLabelFontColor": "#666666",
 "height": "100%",
 "selectedItemThumbnailShadow": true,
 "itemThumbnailOpacity": 1,
 "itemOpacity": 1,
 "scrollBarWidth": 10,
 "selectedItemThumbnailShadowBlurRadius": 16,
 "itemBackgroundColorRatios": [],
 "playList": "this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist",
 "itemBackgroundColorDirection": "vertical",
 "itemMinHeight": 50,
 "itemLabelFontWeight": "normal",
 "rollOverItemThumbnailShadowHorizontalLength": 8,
 "itemHorizontalAlign": "center",
 "itemThumbnailBorderRadius": 0,
 "paddingRight": 70,
 "itemMode": "normal",
 "itemThumbnailHeight": 125,
 "rollOverItemLabelFontColor": "#04A3E1",
 "selectedItemLabelFontWeight": "bold",
 "itemMinWidth": 50,
 "itemMaxHeight": 1000,
 "scrollBarMargin": 2,
 "itemBackgroundOpacity": 0,
 "rollOverItemThumbnailShadowColor": "#04A3E1",
 "itemPaddingBottom": 3,
 "itemWidth": 220,
 "class": "ThumbnailGrid",
 "itemLabelFontSize": 14,
 "itemHeight": 156,
 "paddingTop": 10,
 "backgroundOpacity": 0.05,
 "itemLabelTextDecoration": "none",
 "minHeight": 1,
 "selectedItemThumbnailShadowVerticalLength": 0,
 "itemLabelFontFamily": "Montserrat",
 "shadow": false,
 "scrollBarColor": "#04A3E1",
 "itemBorderRadius": 0,
 "itemLabelFontStyle": "normal",
 "rollOverItemThumbnailShadowVerticalLength": 0,
 "horizontalAlign": "center",
 "selectedItemThumbnailShadowHorizontalLength": 0,
 "propagateClick": false,
 "minWidth": 1,
 "itemLabelHorizontalAlign": "center",
 "gap": 26,
 "itemVerticalAlign": "top",
 "data": {
  "name": "ThumbnailList"
 }
},
{
 "scrollBarColor": "#000000",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "id": "Container_221C0648_0C06_E5FD_4193_12BCE1D6DD6B",
 "contentOpaque": false,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "width": "85%",
 "children": [
  "this.WebFrame_22F9EEFF_0C1A_2293_4165_411D4444EFEA"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#000000"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "paddingLeft": 0,
 "height": "100%",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "backgroundColorRatios": [
  0
 ],
 "data": {
  "name": "-left"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "center",
 "gap": 10
},
{
 "scrollBarColor": "#0069A3",
 "paddingBottom": 20,
 "borderRadius": 0,
 "layout": "vertical",
 "id": "Container_221C9648_0C06_E5FD_41A1_A79DE53B3031",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 50,
 "width": "15%",
 "children": [
  "this.Container_221C8648_0C06_E5FD_41A0_8247B2B7DEB0",
  "this.Container_221B7648_0C06_E5FD_418B_12E57BBFD8EC",
  "this.Container_221B4648_0C06_E5FD_4194_30EDC4E7D1B6"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.51,
 "borderSize": 0,
 "paddingTop": 20,
 "backgroundOpacity": 1,
 "paddingLeft": 50,
 "height": "100%",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 400,
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "-right"
 },
 "scrollBarWidth": 10,
 "overflow": "visible",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 0
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF",
 "verticalAlign": "middle",
 "paddingRight": 0,
 "width": "25%",
 "rollOverIconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF_rollover.jpg",
 "maxWidth": 60,
 "maxHeight": 60,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": "75%",
 "pressedIconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF_pressed.jpg",
 "minHeight": 50,
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, false, 0, null, null, false)",
 "shadow": false,
 "minWidth": 50,
 "data": {
  "name": "X"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF.jpg",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "id": "Container_2F8A7686_0D4F_6B71_41A9_1A894413085C",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "width": "100%",
 "children": [
  "this.HTMLText_2F8A4686_0D4F_6B71_4183_10C1696E2923",
  "this.IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": 140,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "header"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "toolTipDisplayTime": 600,
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "MapViewer",
 "transitionMode": "blending",
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipShadowColor": "#333333",
 "progressOpacity": 1,
 "playbackBarHeadBorderRadius": 0,
 "width": "100%",
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "vrPointerSelectionColor": "#FF6600",
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBottom": 0,
 "toolTipPaddingBottom": 4,
 "toolTipFontWeight": "normal",
 "playbackBarLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadow": true,
 "playbackBarHeadHeight": 15,
 "toolTipBorderColor": "#767676",
 "vrPointerSelectionTime": 2000,
 "progressBorderColor": "#FFFFFF",
 "toolTipBorderSize": 1,
 "borderSize": 0,
 "toolTipPaddingTop": 4,
 "paddingLeft": 0,
 "playbackBarOpacity": 1,
 "height": "100%",
 "firstTransitionDuration": 0,
 "progressBottom": 2,
 "toolTipTextShadowBlurRadius": 3,
 "progressHeight": 6,
 "progressBackgroundOpacity": 1,
 "toolTipBackgroundColor": "#F6F6F6",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBarOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontFamily": "Arial",
 "toolTipTextShadowColor": "#000000",
 "progressBorderSize": 0,
 "toolTipBorderRadius": 3,
 "toolTipShadowOpacity": 1,
 "toolTipPaddingRight": 6,
 "playbackBarBorderSize": 0,
 "progressBorderRadius": 0,
 "progressLeft": 0,
 "paddingRight": 0,
 "progressBarBorderColor": "#0066FF",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarProgressOpacity": 1,
 "playbackBarHeight": 10,
 "playbackBarHeadWidth": 6,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowOpacity": 0,
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipOpacity": 1,
 "toolTipShadowHorizontalLength": 0,
 "toolTipFontSize": 12,
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadOpacity": 1,
 "toolTipFontColor": "#606060",
 "class": "ViewerArea",
 "paddingTop": 0,
 "progressBarBorderRadius": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipShadowSpread": 0,
 "minHeight": 1,
 "playbackBarProgressBorderRadius": 0,
 "transitionDuration": 500,
 "progressBarBorderSize": 6,
 "playbackBarHeadShadowBlurRadius": 3,
 "shadow": false,
 "toolTipPaddingLeft": 6,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadShadowColor": "#000000",
 "minWidth": 1,
 "toolTipFontStyle": "normal",
 "toolTipShadowVerticalLength": 0,
 "toolTipShadowBlurRadius": 3,
 "progressRight": 0,
 "progressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "propagateClick": false,
 "data": {
  "name": "Floor Plan"
 },
 "playbackBarHeadShadowVerticalLength": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarBorderRadius": 0
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "id": "Container_28214A13_0D5D_5B97_4193_B631E1496339",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "width": "100%",
 "children": [
  "this.HTMLText_28217A13_0D5D_5B97_419A_F894ECABEB04",
  "this.IconButton_28216A13_0D5D_5B97_41A9_2CAB10DB6CA3"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": 140,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "header"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "scrollBarColor": "#000000",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "id": "Container_2B0BF61C_0D5B_2B90_4179_632488B1209E",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "width": "100%",
 "children": [
  "this.ViewerAreaLabeled_281D2361_0D5F_E9B0_41A1_A1F237F85FD7",
  "this.IconButton_2BE71718_0D55_6990_41A5_73D31D902E1D",
  "this.IconButton_28BF3E40_0D4B_DBF0_41A3_D5D2941E6E14"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": "100%",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "Container photo"
 },
 "scrollBarWidth": 10,
 "overflow": "visible",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "scrollBarColor": "#000000",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "id": "Container_2A19EC4C_0D3B_DFF0_414D_37145C22C5BC",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "width": "100%",
 "children": [
  "this.ViewerAreaLabeled_2A198C4C_0D3B_DFF0_419F_C9A785406D9C",
  "this.IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482",
  "this.IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510",
  "this.IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": "100%",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "Container photo"
 },
 "scrollBarWidth": 10,
 "overflow": "visible",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "scrollBarColor": "#000000",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "id": "Container_06C5ABA5_1140_A63F_41A9_850CF958D0DB",
 "contentOpaque": false,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "width": "55%",
 "children": [
  "this.Image_06C5BBA5_1140_A63F_41A7_E6D01D4CC397"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#000000"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "paddingLeft": 0,
 "height": "100%",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "backgroundColorRatios": [
  0
 ],
 "data": {
  "name": "-left"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "center",
 "gap": 10
},
{
 "scrollBarColor": "#0069A3",
 "paddingBottom": 20,
 "borderRadius": 0,
 "layout": "vertical",
 "id": "Container_06C58BA5_1140_A63F_419D_EC83F94F8C54",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 60,
 "width": "45%",
 "children": [
  "this.Container_06C59BA5_1140_A63F_41B1_4B41E3B7D98D",
  "this.Container_06C46BA5_1140_A63F_4151_B5A20B4EA86A",
  "this.Container_06C42BA5_1140_A63F_4195_037A0687532F"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.51,
 "borderSize": 0,
 "paddingTop": 20,
 "backgroundOpacity": 1,
 "paddingLeft": 60,
 "height": "100%",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 460,
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "-right"
 },
 "scrollBarWidth": 10,
 "overflow": "visible",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 0
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81",
 "verticalAlign": "middle",
 "paddingRight": 0,
 "width": "25%",
 "rollOverIconURL": "skin/IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81_rollover.jpg",
 "maxWidth": 60,
 "maxHeight": 60,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": "75%",
 "pressedIconURL": "skin/IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81_pressed.jpg",
 "minHeight": 50,
 "click": "this.setComponentVisibility(this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC, false, 0, null, null, false)",
 "shadow": false,
 "minWidth": 50,
 "data": {
  "name": "X"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81.jpg",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": "0%",
 "id": "Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A",
 "paddingRight": 0,
 "width": "100%",
 "verticalAlign": "middle",
 "url": "skin/Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A.jpg",
 "maxWidth": 2000,
 "maxHeight": 1000,
 "top": "0%",
 "height": "100%",
 "class": "Image",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "Image"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "scaleMode": "fit_outside"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Container_062A3830_1140_E215_4195_1698933FE51C",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "width": "100%",
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 20,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": 60,
 "minHeight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container space"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "right",
 "gap": 0
},
{
 "scrollBarColor": "#E73B2C",
 "paddingBottom": 30,
 "borderRadius": 0,
 "layout": "vertical",
 "id": "Container_062A2830_1140_E215_41AA_EB25B7BD381C",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "width": "100%",
 "children": [
  "this.HTMLText_062AD830_1140_E215_41B0_321699661E7F",
  "this.Button_062AF830_1140_E215_418D_D2FC11B12C47"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.79,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": "100%",
 "minHeight": 520,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 100,
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "Container text"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Container_062AE830_1140_E215_4180_196ED689F4BD",
 "width": 370,
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": 40,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "shadow": false,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container space"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "toolTipDisplayTime": 600,
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "ViewerAreaLabeled_23F787B7_0C0A_6293_419A_B4B58B92DAFC",
 "left": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipShadowColor": "#333333",
 "progressOpacity": 1,
 "transitionMode": "blending",
 "right": 0,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarHeadBorderRadius": 0,
 "vrPointerSelectionColor": "#FF6600",
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBottom": 0,
 "toolTipPaddingBottom": 4,
 "toolTipFontWeight": "normal",
 "playbackBarLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "playbackBarHeadShadow": true,
 "playbackBarHeadHeight": 15,
 "vrPointerSelectionTime": 2000,
 "progressBorderColor": "#FFFFFF",
 "toolTipBorderSize": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "borderSize": 0,
 "toolTipPaddingTop": 4,
 "paddingLeft": 0,
 "playbackBarOpacity": 1,
 "firstTransitionDuration": 0,
 "progressBottom": 2,
 "toolTipTextShadowBlurRadius": 3,
 "progressHeight": 6,
 "progressBackgroundOpacity": 1,
 "toolTipBackgroundColor": "#F6F6F6",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBarOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontFamily": "Arial",
 "toolTipTextShadowColor": "#000000",
 "progressBorderSize": 0,
 "toolTipPaddingRight": 6,
 "toolTipShadowOpacity": 1,
 "toolTipBorderRadius": 3,
 "playbackBarBorderSize": 0,
 "progressBorderRadius": 0,
 "progressLeft": 0,
 "paddingRight": 0,
 "progressBarBorderColor": "#0066FF",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarProgressOpacity": 1,
 "playbackBarHeight": 10,
 "playbackBarHeadWidth": 6,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowOpacity": 0,
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipOpacity": 1,
 "toolTipShadowHorizontalLength": 0,
 "toolTipFontSize": 12,
 "top": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "bottom": 0,
 "class": "ViewerArea",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipFontColor": "#606060",
 "playbackBarHeadOpacity": 1,
 "paddingTop": 0,
 "progressBarBorderRadius": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "displayTooltipInTouchScreens": true,
 "toolTipShadowSpread": 0,
 "minHeight": 1,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarProgressBorderRadius": 0,
 "transitionDuration": 500,
 "progressBarBorderSize": 6,
 "shadow": false,
 "toolTipPaddingLeft": 6,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadShadowColor": "#000000",
 "minWidth": 1,
 "toolTipFontStyle": "normal",
 "toolTipShadowVerticalLength": 0,
 "toolTipShadowBlurRadius": 3,
 "progressRight": 0,
 "progressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "propagateClick": false,
 "data": {
  "name": "Viewer info 1"
 },
 "playbackBarHeadShadowVerticalLength": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarBorderRadius": 0
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Container_23F7F7B7_0C0A_6293_4195_D6240EBAFDC0",
 "left": "0%",
 "contentOpaque": false,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "width": "100%",
 "children": [
  "this.IconButton_23F7E7B7_0C0A_6293_419F_D3D84EB3AFBD",
  "this.Container_23F7D7B7_0C0A_6293_4195_312C9CAEABE4",
  "this.IconButton_23F037B7_0C0A_6293_41A2_C1707EE666E4"
 ],
 "scrollBarMargin": 2,
 "top": "0%",
 "height": "100%",
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container arrows"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Container_23F017B8_0C0A_629D_41A5_DE420F5F9331",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "width": "100%",
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 20,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": 60,
 "minHeight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container space"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "right",
 "gap": 0
},
{
 "scrollBarColor": "#E73B2C",
 "paddingBottom": 30,
 "borderRadius": 0,
 "layout": "vertical",
 "id": "Container_23F007B8_0C0A_629D_41A3_034CF0D91203",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "width": "100%",
 "children": [
  "this.HTMLText_23F067B8_0C0A_629D_41A9_1A1C797BB055",
  "this.Button_23F057B8_0C0A_629D_41A2_CD6BDCDB0145"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.79,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": "100%",
 "minHeight": 520,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 100,
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "Container text"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Container_23F047B8_0C0A_629D_415D_F05EF8619564",
 "width": 370,
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": 40,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "shadow": false,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container space"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "HTMLText_3918BF37_0C06_E393_41A1_17CF0ADBAB12",
 "left": "0%",
 "paddingRight": 0,
 "width": "77.115%",
 "scrollBarMargin": 2,
 "top": "0%",
 "height": "100%",
 "class": "HTMLText",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 80,
 "minHeight": 100,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:5.15vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:5.15vh;font-family:'Bebas Neue Bold';\">Panorama list:</SPAN></SPAN></DIV></div>",
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText54192"
 },
 "scrollBarWidth": 10,
 "propagateClick": false
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_38922473_0C06_2593_4199_C585853A1AB3",
 "verticalAlign": "top",
 "paddingRight": 0,
 "right": 20,
 "width": "100%",
 "rollOverIconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3_rollover.jpg",
 "maxWidth": 60,
 "maxHeight": 60,
 "top": 20,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": "36.14%",
 "pressedIconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3_pressed.jpg",
 "minHeight": 50,
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, false, 0, null, null, false)",
 "shadow": false,
 "minWidth": 50,
 "data": {
  "name": "IconButton X"
 },
 "horizontalAlign": "right",
 "propagateClick": false,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3.jpg",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": "0%",
 "id": "WebFrame_22F9EEFF_0C1A_2293_4165_411D4444EFEA",
 "paddingRight": 0,
 "right": "0%",
 "url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2694.5141832647882!2d-122.62970948773797!3d47.51885169391231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5490482ac8950f19%3A0x586ce34805a1ef28!2s1954%20SE%20Lund%20Ave%2C%20Port%20Orchard%2C%20WA%2098366!5e0!3m2!1sen!2sus!4v1712707593305!5m2!1sen!2sus",
 "top": "0%",
 "backgroundColorDirection": "vertical",
 "bottom": "0%",
 "backgroundColor": [
  "#FFFFFF"
 ],
 "class": "WebFrame",
 "scrollEnabled": true,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "paddingLeft": 0,
 "minHeight": 1,
 "backgroundColorRatios": [
  0
 ],
 "shadow": false,
 "minWidth": 1,
 "insetBorder": false,
 "data": {
  "name": "WebFrame48191"
 },
 "propagateClick": false
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Container_221C8648_0C06_E5FD_41A0_8247B2B7DEB0",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "width": "100%",
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 20,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": 60,
 "minHeight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container space"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "right",
 "gap": 0
},
{
 "scrollBarColor": "#E73B2C",
 "paddingBottom": 30,
 "borderRadius": 0,
 "layout": "vertical",
 "id": "Container_221B7648_0C06_E5FD_418B_12E57BBFD8EC",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "width": "100%",
 "children": [
  "this.HTMLText_221B6648_0C06_E5FD_41A0_77851DC2C548",
  "this.Button_221B5648_0C06_E5FD_4198_40C786948FF0"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.79,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": "100%",
 "minHeight": 520,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 100,
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "Container text"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Container_221B4648_0C06_E5FD_4194_30EDC4E7D1B6",
 "width": 370,
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": 40,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "shadow": false,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container space"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "HTMLText_2F8A4686_0D4F_6B71_4183_10C1696E2923",
 "left": "0%",
 "paddingRight": 0,
 "width": "77.115%",
 "scrollBarMargin": 2,
 "top": "0%",
 "height": "100%",
 "class": "HTMLText",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 80,
 "minHeight": 100,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:5.15vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:5.15vh;font-family:'Bebas Neue Bold';\">FLOORPLAN:</SPAN></SPAN></DIV></div>",
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText54192"
 },
 "scrollBarWidth": 10,
 "propagateClick": false
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E",
 "verticalAlign": "top",
 "paddingRight": 0,
 "right": 20,
 "width": "100%",
 "rollOverIconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E_rollover.jpg",
 "maxWidth": 60,
 "maxHeight": 60,
 "top": 20,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": "36.14%",
 "pressedIconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E_pressed.jpg",
 "minHeight": 50,
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, false, 0, null, null, false)",
 "shadow": false,
 "minWidth": 50,
 "data": {
  "name": "IconButton X"
 },
 "horizontalAlign": "right",
 "propagateClick": false,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E.jpg",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "HTMLText_28217A13_0D5D_5B97_419A_F894ECABEB04",
 "left": "0%",
 "paddingRight": 0,
 "width": "77.115%",
 "scrollBarMargin": 2,
 "top": "0%",
 "height": "100%",
 "class": "HTMLText",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 80,
 "minHeight": 100,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:5.15vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:5.15vh;font-family:'Bebas Neue Bold';\">PHOTOALBUM:</SPAN></SPAN></DIV></div>",
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText54192"
 },
 "scrollBarWidth": 10,
 "propagateClick": false
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_28216A13_0D5D_5B97_41A9_2CAB10DB6CA3",
 "verticalAlign": "top",
 "paddingRight": 0,
 "right": 20,
 "width": "100%",
 "rollOverIconURL": "skin/IconButton_28216A13_0D5D_5B97_41A9_2CAB10DB6CA3_rollover.jpg",
 "maxWidth": 60,
 "maxHeight": 60,
 "top": 20,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": "36.14%",
 "pressedIconURL": "skin/IconButton_28216A13_0D5D_5B97_41A9_2CAB10DB6CA3_pressed.jpg",
 "minHeight": 50,
 "click": "this.setComponentVisibility(this.Container_2820BA13_0D5D_5B97_4192_AABC38F6F169, false, 0, null, null, false)",
 "shadow": false,
 "minWidth": 50,
 "data": {
  "name": "IconButton X"
 },
 "horizontalAlign": "right",
 "propagateClick": false,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_28216A13_0D5D_5B97_41A9_2CAB10DB6CA3.jpg",
 "cursor": "hand"
},
{
 "toolTipDisplayTime": 600,
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "ViewerAreaLabeled_281D2361_0D5F_E9B0_41A1_A1F237F85FD7",
 "left": "0%",
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipShadowColor": "#333333",
 "progressOpacity": 1,
 "transitionMode": "blending",
 "width": "100%",
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarHeadBorderRadius": 0,
 "vrPointerSelectionColor": "#FF6600",
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBottom": 0,
 "toolTipFontWeight": "normal",
 "playbackBarLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "toolTipPaddingBottom": 4,
 "playbackBarHeadShadow": true,
 "playbackBarHeadHeight": 15,
 "toolTipBorderColor": "#767676",
 "vrPointerSelectionTime": 2000,
 "progressBorderColor": "#FFFFFF",
 "toolTipBorderSize": 1,
 "borderSize": 0,
 "progressBackgroundOpacity": 1,
 "paddingLeft": 0,
 "playbackBarOpacity": 1,
 "height": "100%",
 "toolTipPaddingTop": 4,
 "progressBottom": 2,
 "toolTipTextShadowBlurRadius": 3,
 "progressHeight": 6,
 "firstTransitionDuration": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBarOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontFamily": "Arial",
 "toolTipTextShadowColor": "#000000",
 "progressBorderSize": 0,
 "toolTipBorderRadius": 3,
 "toolTipShadowOpacity": 1,
 "toolTipPaddingRight": 6,
 "playbackBarBorderSize": 0,
 "progressBorderRadius": 0,
 "progressLeft": 0,
 "paddingRight": 0,
 "progressBarBorderColor": "#0066FF",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarProgressOpacity": 1,
 "playbackBarHeight": 10,
 "playbackBarHeadWidth": 6,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowOpacity": 0,
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipOpacity": 1,
 "toolTipShadowHorizontalLength": 0,
 "toolTipFontSize": 12,
 "top": "0%",
 "playbackBarBorderColor": "#FFFFFF",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "toolTipFontColor": "#606060",
 "class": "ViewerArea",
 "paddingTop": 0,
 "progressBarBorderRadius": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipShadowSpread": 0,
 "minHeight": 1,
 "playbackBarProgressBorderRadius": 0,
 "transitionDuration": 500,
 "progressBarBorderSize": 6,
 "playbackBarHeadShadowBlurRadius": 3,
 "shadow": false,
 "toolTipPaddingLeft": 6,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadShadowColor": "#000000",
 "minWidth": 1,
 "toolTipFontStyle": "normal",
 "toolTipShadowVerticalLength": 0,
 "toolTipShadowBlurRadius": 3,
 "progressRight": 0,
 "progressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "propagateClick": false,
 "data": {
  "name": "Viewer photoalbum + text 1"
 },
 "playbackBarHeadShadowVerticalLength": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarBorderRadius": 0
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": 10,
 "id": "IconButton_2BE71718_0D55_6990_41A5_73D31D902E1D",
 "paddingRight": 0,
 "width": "14.22%",
 "verticalAlign": "middle",
 "rollOverIconURL": "skin/IconButton_2BE71718_0D55_6990_41A5_73D31D902E1D_rollover.png",
 "maxWidth": 60,
 "maxHeight": 60,
 "top": "20%",
 "bottom": "20%",
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "pressedIconURL": "skin/IconButton_2BE71718_0D55_6990_41A5_73D31D902E1D_pressed.png",
 "minHeight": 50,
 "shadow": false,
 "minWidth": 50,
 "data": {
  "name": "IconButton <"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_2BE71718_0D55_6990_41A5_73D31D902E1D.png",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_28BF3E40_0D4B_DBF0_41A3_D5D2941E6E14",
 "paddingRight": 0,
 "right": 10,
 "width": "14.22%",
 "verticalAlign": "middle",
 "rollOverIconURL": "skin/IconButton_28BF3E40_0D4B_DBF0_41A3_D5D2941E6E14_rollover.png",
 "maxWidth": 60,
 "maxHeight": 60,
 "top": "20%",
 "bottom": "20%",
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "pressedIconURL": "skin/IconButton_28BF3E40_0D4B_DBF0_41A3_D5D2941E6E14_pressed.png",
 "minHeight": 50,
 "shadow": false,
 "minWidth": 50,
 "data": {
  "name": "IconButton >"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_28BF3E40_0D4B_DBF0_41A3_D5D2941E6E14.png",
 "cursor": "hand"
},
{
 "toolTipDisplayTime": 600,
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "ViewerAreaLabeled_2A198C4C_0D3B_DFF0_419F_C9A785406D9C",
 "left": "0%",
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipShadowColor": "#333333",
 "progressOpacity": 1,
 "transitionMode": "blending",
 "width": "100%",
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarHeadBorderRadius": 0,
 "vrPointerSelectionColor": "#FF6600",
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBottom": 0,
 "toolTipFontWeight": "normal",
 "playbackBarLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "toolTipPaddingBottom": 4,
 "playbackBarHeadShadow": true,
 "playbackBarHeadHeight": 15,
 "toolTipBorderColor": "#767676",
 "vrPointerSelectionTime": 2000,
 "progressBorderColor": "#FFFFFF",
 "toolTipBorderSize": 1,
 "borderSize": 0,
 "progressBackgroundOpacity": 1,
 "paddingLeft": 0,
 "playbackBarOpacity": 1,
 "height": "100%",
 "toolTipPaddingTop": 4,
 "progressBottom": 2,
 "toolTipTextShadowBlurRadius": 3,
 "progressHeight": 6,
 "firstTransitionDuration": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBarOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontFamily": "Arial",
 "toolTipTextShadowColor": "#000000",
 "progressBorderSize": 0,
 "toolTipBorderRadius": 3,
 "toolTipShadowOpacity": 1,
 "toolTipPaddingRight": 6,
 "playbackBarBorderSize": 0,
 "progressBorderRadius": 0,
 "progressLeft": 0,
 "paddingRight": 0,
 "progressBarBorderColor": "#0066FF",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarProgressOpacity": 1,
 "playbackBarHeight": 10,
 "playbackBarHeadWidth": 6,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowOpacity": 0,
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipOpacity": 1,
 "toolTipShadowHorizontalLength": 0,
 "toolTipFontSize": 12,
 "top": "0%",
 "playbackBarBorderColor": "#FFFFFF",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "toolTipFontColor": "#606060",
 "class": "ViewerArea",
 "paddingTop": 0,
 "progressBarBorderRadius": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipShadowSpread": 0,
 "minHeight": 1,
 "playbackBarProgressBorderRadius": 0,
 "transitionDuration": 500,
 "progressBarBorderSize": 6,
 "playbackBarHeadShadowBlurRadius": 3,
 "shadow": false,
 "toolTipPaddingLeft": 6,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadShadowColor": "#000000",
 "minWidth": 1,
 "toolTipFontStyle": "normal",
 "toolTipShadowVerticalLength": 0,
 "toolTipShadowBlurRadius": 3,
 "progressRight": 0,
 "progressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "propagateClick": false,
 "data": {
  "name": "Viewer photoalbum 1"
 },
 "playbackBarHeadShadowVerticalLength": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarBorderRadius": 0
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": 10,
 "id": "IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482",
 "paddingRight": 0,
 "width": "14.22%",
 "verticalAlign": "middle",
 "rollOverIconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482_rollover.png",
 "maxWidth": 60,
 "maxHeight": 60,
 "top": "20%",
 "bottom": "20%",
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "pressedIconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482_pressed.png",
 "minHeight": 50,
 "shadow": false,
 "minWidth": 50,
 "data": {
  "name": "IconButton <"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482.png",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510",
 "paddingRight": 0,
 "right": 10,
 "width": "14.22%",
 "verticalAlign": "middle",
 "rollOverIconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510_rollover.png",
 "maxWidth": 60,
 "maxHeight": 60,
 "top": "20%",
 "bottom": "20%",
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "pressedIconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510_pressed.png",
 "minHeight": 50,
 "shadow": false,
 "minWidth": 50,
 "data": {
  "name": "IconButton >"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510.png",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1",
 "verticalAlign": "top",
 "paddingRight": 0,
 "right": 20,
 "width": "10%",
 "rollOverIconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1_rollover.jpg",
 "maxWidth": 60,
 "maxHeight": 60,
 "top": 20,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": "10%",
 "pressedIconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1_pressed.jpg",
 "minHeight": 50,
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, false, 0, null, null, false)",
 "shadow": false,
 "minWidth": 50,
 "data": {
  "name": "IconButton X"
 },
 "horizontalAlign": "right",
 "propagateClick": false,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1.jpg",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": "0%",
 "id": "Image_06C5BBA5_1140_A63F_41A7_E6D01D4CC397",
 "paddingRight": 0,
 "width": "100%",
 "verticalAlign": "bottom",
 "url": "skin/Image_06C5BBA5_1140_A63F_41A7_E6D01D4CC397.jpg",
 "maxWidth": 2000,
 "maxHeight": 1000,
 "top": "0%",
 "height": "100%",
 "class": "Image",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "Image"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "scaleMode": "fit_outside"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Container_06C59BA5_1140_A63F_41B1_4B41E3B7D98D",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "width": "100%",
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 20,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": 60,
 "minHeight": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container space"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "right",
 "gap": 0
},
{
 "scrollBarColor": "#E73B2C",
 "paddingBottom": 30,
 "borderRadius": 0,
 "layout": "vertical",
 "id": "Container_06C46BA5_1140_A63F_4151_B5A20B4EA86A",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "width": "100%",
 "children": [
  "this.HTMLText_0B42C466_11C0_623D_4193_9FAB57A5AC33",
  "this.Container_0D9BF47A_11C0_E215_41A4_A63C8527FF9C"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.79,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": "100%",
 "minHeight": 520,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 100,
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "Container text"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Container_06C42BA5_1140_A63F_4195_037A0687532F",
 "width": 370,
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": 40,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "shadow": false,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container space"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "paddingBottom": 20,
 "borderRadius": 0,
 "id": "HTMLText_062AD830_1140_E215_41B0_321699661E7F",
 "paddingRight": 10,
 "width": "100%",
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "height": "100%",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 10,
 "class": "HTMLText",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "scrollBarColor": "#04A3E1",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:7.83vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:6.6vh;font-family:'Bebas Neue Bold';\">Lorem ipsum</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:6.6vh;font-family:'Bebas Neue Bold';\">dolor sit amet</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:3.47vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:3.47vh;font-family:'Bebas Neue Bold';\">consectetur adipiscing elit. Morbi bibendum pharetra lorem, accumsan san nulla.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.12vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\">Mauris aliquet neque quis libero consequat vestibulum. Donec lacinia consequat dolor viverra sagittis. Praesent consequat porttitor risus, eu condimentum nunc. Proin et velit ac sapien luctus efficitur egestas ac augue. Nunc dictum, augue eget eleifend interdum, quam libero imperdiet lectus, vel scelerisque turpis lectus vel ligula. Duis a porta sem. Maecenas sollicitudin nunc id risus fringilla, a pharetra orci iaculis. Aliquam turpis ligula, tincidunt sit amet consequat ac, imperdiet non dolor.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.12vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\">Integer gravida dui quis euismod placerat. Maecenas quis accumsan ipsum. Aliquam gravida velit at dolor mollis, quis luctus mauris vulputate. Proin condimentum id nunc sed sollicitudin.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:2.35vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.35vh;font-family:'Bebas Neue Bold';\"><B>Donec feugiat:</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Nisl nec mi sollicitudin facilisis </SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Nam sed faucibus est.</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Ut eget lorem sed leo.</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Sollicitudin tempor sit amet non urna. </SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Aliquam feugiat mauris sit amet.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:2.35vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.35vh;font-family:'Bebas Neue Bold';\"><B>lorem ipsum:</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:3.58vh;font-family:'Bebas Neue Bold';\"><B>$150,000</B></SPAN></SPAN></DIV></div>",
 "minWidth": 1,
 "data": {
  "name": "HTMLText"
 },
 "propagateClick": false
},
{
 "textDecoration": "none",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Button_062AF830_1140_E215_418D_D2FC11B12C47",
 "gap": 5,
 "pressedBackgroundOpacity": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "width": "46%",
 "shadowColor": "#000000",
 "fontColor": "#FFFFFF",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 1,
 "iconBeforeLabel": true,
 "fontFamily": "Bebas Neue Bold",
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#04A3E1"
 ],
 "class": "Button",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.7,
 "mode": "push",
 "paddingLeft": 0,
 "height": "9%",
 "minHeight": 1,
 "fontSize": "3vh",
 "shadowSpread": 1,
 "fontStyle": "normal",
 "shadow": false,
 "minWidth": 1,
 "label": "lorem ipsum",
 "backgroundColorRatios": [
  0
 ],
 "pressedBackgroundColor": [
  "#000000"
 ],
 "data": {
  "name": "Button"
 },
 "horizontalAlign": "center",
 "pressedBackgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "fontWeight": "normal",
 "iconWidth": 32,
 "shadowBlurRadius": 6,
 "cursor": "hand",
 "borderColor": "#000000"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_23F7E7B7_0C0A_6293_419F_D3D84EB3AFBD",
 "verticalAlign": "middle",
 "paddingRight": 0,
 "width": "12%",
 "rollOverIconURL": "skin/IconButton_23F7E7B7_0C0A_6293_419F_D3D84EB3AFBD_rollover.png",
 "maxWidth": 150,
 "maxHeight": 150,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": "8%",
 "pressedIconURL": "skin/IconButton_23F7E7B7_0C0A_6293_419F_D3D84EB3AFBD_pressed.png",
 "minHeight": 70,
 "shadow": false,
 "minWidth": 70,
 "data": {
  "name": "IconButton <"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_23F7E7B7_0C0A_6293_419F_D3D84EB3AFBD.png",
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "absolute",
 "id": "Container_23F7D7B7_0C0A_6293_4195_312C9CAEABE4",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "width": "80%",
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "height": "30%",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "class": "Container",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "scrollBarColor": "#000000",
 "minWidth": 1,
 "data": {
  "name": "Container separator"
 },
 "horizontalAlign": "left",
 "overflow": "scroll",
 "propagateClick": false,
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "IconButton_23F037B7_0C0A_6293_41A2_C1707EE666E4",
 "verticalAlign": "middle",
 "paddingRight": 0,
 "width": "12%",
 "rollOverIconURL": "skin/IconButton_23F037B7_0C0A_6293_41A2_C1707EE666E4_rollover.png",
 "maxWidth": 150,
 "maxHeight": 150,
 "class": "IconButton",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "mode": "push",
 "paddingLeft": 0,
 "height": "8%",
 "pressedIconURL": "skin/IconButton_23F037B7_0C0A_6293_41A2_C1707EE666E4_pressed.png",
 "minHeight": 70,
 "shadow": false,
 "minWidth": 70,
 "data": {
  "name": "IconButton >"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "transparencyActive": true,
 "iconURL": "skin/IconButton_23F037B7_0C0A_6293_41A2_C1707EE666E4.png",
 "cursor": "hand"
},
{
 "paddingBottom": 20,
 "borderRadius": 0,
 "id": "HTMLText_23F067B8_0C0A_629D_41A9_1A1C797BB055",
 "paddingRight": 10,
 "width": "100%",
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "height": "100%",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 10,
 "class": "HTMLText",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "scrollBarColor": "#04A3E1",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:7.83vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:6.6vh;font-family:'Bebas Neue Bold';\">Lorem ipsum</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:6.6vh;font-family:'Bebas Neue Bold';\">dolor sit amet</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:3.47vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:3.47vh;font-family:'Bebas Neue Bold';\">consectetur adipiscing elit. Morbi bibendum pharetra lorem, accumsan san nulla.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.12vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\">Mauris aliquet neque quis libero consequat vestibulum. Donec lacinia consequat dolor viverra sagittis. Praesent consequat porttitor risus, eu condimentum nunc. Proin et velit ac sapien luctus efficitur egestas ac augue. Nunc dictum, augue eget eleifend interdum, quam libero imperdiet lectus, vel scelerisque turpis lectus vel ligula. Duis a porta sem. Maecenas sollicitudin nunc id risus fringilla, a pharetra orci iaculis. Aliquam turpis ligula, tincidunt sit amet consequat ac, imperdiet non dolor.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.12vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\">Integer gravida dui quis euismod placerat. Maecenas quis accumsan ipsum. Aliquam gravida velit at dolor mollis, quis luctus mauris vulputate. Proin condimentum id nunc sed sollicitudin.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:2.35vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.35vh;font-family:'Bebas Neue Bold';\"><B>Donec feugiat:</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Nisl nec mi sollicitudin facilisis </SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Nam sed faucibus est.</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Ut eget lorem sed leo.</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Sollicitudin tempor sit amet non urna. </SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\"> \u2022 Aliquam feugiat mauris sit amet.</SPAN></SPAN></DIV></div>",
 "minWidth": 1,
 "data": {
  "name": "HTMLText"
 },
 "propagateClick": false
},
{
 "textDecoration": "none",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Button_23F057B8_0C0A_629D_41A2_CD6BDCDB0145",
 "gap": 5,
 "pressedBackgroundOpacity": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "width": "46%",
 "shadowColor": "#000000",
 "fontColor": "#FFFFFF",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 1,
 "iconBeforeLabel": true,
 "fontFamily": "Bebas Neue Bold",
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#04A3E1"
 ],
 "class": "Button",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.7,
 "mode": "push",
 "paddingLeft": 0,
 "height": "9%",
 "minHeight": 1,
 "fontSize": "3vh",
 "shadowSpread": 1,
 "fontStyle": "normal",
 "shadow": false,
 "minWidth": 1,
 "label": "lorem ipsum",
 "backgroundColorRatios": [
  0
 ],
 "pressedBackgroundColor": [
  "#000000"
 ],
 "data": {
  "name": "Button"
 },
 "horizontalAlign": "center",
 "pressedBackgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "fontWeight": "normal",
 "iconWidth": 32,
 "shadowBlurRadius": 6,
 "cursor": "hand",
 "borderColor": "#000000"
},
{
 "paddingBottom": 20,
 "borderRadius": 0,
 "id": "HTMLText_221B6648_0C06_E5FD_41A0_77851DC2C548",
 "paddingRight": 10,
 "width": "100%",
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "height": "100%",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 10,
 "class": "HTMLText",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "scrollBarColor": "#04A3E1",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:7.83vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:5.82vh;font-family:'Bebas Neue Bold';\">John L. Scott </SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:5.82vh;font-family:'Bebas Neue Bold';\">Port Orchard</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.79vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:3.47vh;font-family:'Bebas Neue Bold';\">1954 SE Lund Ave, Port Orchard, WA 98366</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:5.15vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.12vh;\">Just the best real estate office in all of Kitsap County!</SPAN></SPAN></DIV></div>",
 "minWidth": 1,
 "data": {
  "name": "HTMLText"
 },
 "propagateClick": false
},
{
 "textDecoration": "none",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Button_221B5648_0C06_E5FD_4198_40C786948FF0",
 "gap": 5,
 "width": 207,
 "pressedBackgroundOpacity": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "shadowColor": "#000000",
 "fontColor": "#FFFFFF",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 1,
 "iconBeforeLabel": true,
 "fontFamily": "Bebas Neue Bold",
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#04A3E1"
 ],
 "class": "Button",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.7,
 "mode": "push",
 "paddingLeft": 0,
 "height": 59,
 "fontSize": 34,
 "minHeight": 1,
 "backgroundColorRatios": [
  0
 ],
 "pressedBackgroundColor": [
  "#000000"
 ],
 "shadowSpread": 1,
 "fontStyle": "normal",
 "shadow": false,
 "minWidth": 1,
 "label": "lorem ipsum",
 "data": {
  "name": "Button"
 },
 "horizontalAlign": "center",
 "pressedBackgroundColorRatios": [
  0
 ],
 "visible": false,
 "propagateClick": false,
 "fontWeight": "normal",
 "iconWidth": 32,
 "shadowBlurRadius": 6,
 "cursor": "hand",
 "borderColor": "#000000"
},
{
 "paddingBottom": 10,
 "borderRadius": 0,
 "id": "HTMLText_0B42C466_11C0_623D_4193_9FAB57A5AC33",
 "paddingRight": 0,
 "width": "100%",
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "height": "45%",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "class": "HTMLText",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "scrollBarColor": "#04A3E1",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:7.83vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:5.93vh;font-family:'Bebas Neue Bold';\">real estate agent</SPAN></SPAN></DIV></div>",
 "minWidth": 1,
 "data": {
  "name": "HTMLText18899"
 },
 "propagateClick": false
},
{
 "scrollBarColor": "#000000",
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "horizontal",
 "id": "Container_0D9BF47A_11C0_E215_41A4_A63C8527FF9C",
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "width": "100%",
 "children": [
  "this.Image_AAEAE258_BAF1_0DDD_41E6_FB144FCE6904",
  "this.HTMLText_0B4B0DC1_11C0_6277_41A4_201A5BB3F7AE"
 ],
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "paddingLeft": 0,
 "height": "80%",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "minWidth": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "- content"
 },
 "scrollBarWidth": 10,
 "overflow": "scroll",
 "propagateClick": false,
 "horizontalAlign": "left",
 "gap": 10
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "Image_AAEAE258_BAF1_0DDD_41E6_FB144FCE6904",
 "verticalAlign": "middle",
 "paddingRight": 0,
 "width": "25.177%",
 "url": "skin/Image_AAEAE258_BAF1_0DDD_41E6_FB144FCE6904.jpg",
 "maxWidth": 983,
 "maxHeight": 1219,
 "height": "30.5%",
 "class": "Image",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "Image4092"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "scaleMode": "fit_inside"
},
{
 "paddingBottom": 10,
 "borderRadius": 0,
 "id": "HTMLText_0B4B0DC1_11C0_6277_41A4_201A5BB3F7AE",
 "paddingRight": 10,
 "width": "72.222%",
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "height": "100%",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 10,
 "class": "HTMLText",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "scrollBarColor": "#04A3E1",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#233142;font-size:2.35vh;font-family:'Bebas Neue Bold';\">NICHOLAS CUMMINGS</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.79vh;font-family:'Bebas Neue Bold';\">Licensed Realtor</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.79vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.79vh;font-family:'Bebas Neue Bold';\">Tlf.: +1 (253) 225-0548</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.79vh;font-family:'Bebas Neue Bold';\">NicholasC@JohnLScott.com</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.79vh;font-family:'Bebas Neue Bold';\">NicholasC.JohnLScott.com</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.12vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><p STYLE=\"margin:0; line-height:1.12vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.12vh;font-family:'Bebas Neue Bold';\">Meet Nick Cummings, your trusted real estate advisor in Kitsap County, Washington. As a native of this beautiful region, I bring a deep understanding of its neighborhoods, communities, and market trends. While my experience in the real estate industry may be modest, my passion for helping clients achieve their homeownership dreams is boundless.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.12vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.12vh;font-family:'Bebas Neue Bold';\">With a genuine love for Kitsap County and its unique charm, I am committed to providing personalized service tailored to each client's needs and preferences. Whether you're buying, selling, or investing in real estate, I am here to guide you every step of the way. Holding a realtor license, I adhere to the highest standards of professionalism and ethics, ensuring a seamless and rewarding real estate experience for my clients.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.12vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.12vh;font-family:'Bebas Neue Bold';\">My approach is rooted in transparency, integrity, and open communication. I take the time to listen to my clients' goals and concerns, empowering them with the knowledge and resources they need to make informed decisions. From navigating the complexities of the local market to negotiating the best possible deals, I am dedicated to achieving exceptional results for my clients.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.12vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.01vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.12vh;font-family:'Bebas Neue Bold';\">As your local real estate expert, I am honored to serve the diverse communities of Kitsap County. Whether you're searching for your dream home, selling your property, or exploring investment opportunities, I am here to turn your real estate aspirations into reality. Contact me today, and let's embark on this exciting journey together</SPAN></SPAN></DIV></div>",
 "minWidth": 1,
 "data": {
  "name": "HTMLText19460"
 },
 "propagateClick": false
}],
 "start": "this.init(); this.visibleComponentsIfPlayerFlagEnabled([this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A], 'gyroscopeAvailable'); this.syncPlaylists([this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist,this.mainPlayList]); if(!this.get('fullscreenAvailable')) { [this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0].forEach(function(component) { component.set('visible', false); }) }; this.playAudioList([this.audio_DA8352D6_CFA1_0916_41DC_1C673FCD3C5A])",
 "layout": "absolute",
 "children": [
  "this.MainViewer",
  "this.Container_EF8F8BD8_E386_8E03_41E3_4CF7CC1F4D8E",
  "this.Container_1B9AAD00_16C4_0505_41B5_6F4AE0747E48",
  "this.Container_062AB830_1140_E215_41AF_6C9D65345420",
  "this.Container_23F0F7B8_0C0A_629D_418A_F171085EFBF8",
  "this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15",
  "this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7",
  "this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41",
  "this.Container_2820BA13_0D5D_5B97_4192_AABC38F6F169",
  "this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E",
  "this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC",
  "this.Image_B44E6FBD_BAA2_0E15_41E1_F18F1E555CBE"
 ],
 "height": "100%",
 "scrollBarMargin": 2,
 "vrPolyfillScale": 0.92,
 "class": "Player",
 "mobileMipmappingEnabled": false,
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "paddingLeft": 0,
 "minHeight": 20,
 "buttonToggleFullscreen": "this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "downloadEnabled": false,
 "minWidth": 20,
 "data": {
  "name": "Player468"
 },
 "scrollBarWidth": 10,
 "overflow": "visible",
 "propagateClick": true,
 "horizontalAlign": "left",
 "mouseWheelEnabled": true,
 "gap": 10
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
