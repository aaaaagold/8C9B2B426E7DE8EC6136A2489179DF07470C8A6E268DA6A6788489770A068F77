//=============================================================================
// rpg_objects.js v1.6.1
//=============================================================================

if(!window.objs) window.objs={};

//-----------------------------------------------------------------------------
// Game_Temp
//
// The game object class for temporary data that is not included in save data.

Game_Temp.prototype.initialize = function() {
    this._isPlaytest = Utils.isOptionValid('test');
    this._commonEventId = 0;
    this._destinationX = null;
    this._destinationY = null;
};

Game_Temp.prototype.isPlaytest = function() {
    return this._isPlaytest;
};

Game_Temp.prototype.reserveCommonEvent = function(commonEventId) {
    this._commonEventId = commonEventId;
};

Game_Temp.prototype.clearCommonEvent = function() {
    this._commonEventId = 0;
};

Game_Temp.prototype.isCommonEventReserved = function() {
    return this._commonEventId > 0;
};

Game_Temp.prototype.reservedCommonEvent = function() {
    return $dataCommonEvents[this._commonEventId];
};

Game_Temp.prototype.setDestination = function(x, y) {
    this._destinationX = x;
    this._destinationY = y;
};

Game_Temp.prototype.isDestinationValid = function() {
    return this._destinationX !== null;
};

Game_Temp.prototype.destinationX = function() {
    return this._destinationX;
};

Game_Temp.prototype.destinationY = function() {
    return this._destinationY;
};

//-----------------------------------------------------------------------------
// Game_System
//
// The game object class for the system data.

Game_System.prototype.initialize = function() {
    this._saveEnabled = true;
    this._menuEnabled = true;
    this._encounterEnabled = true;
    this._formationEnabled = true;
    this._battleCount = 0;
    this._winCount = 0;
    this._escapeCount = 0;
    this._saveCount = 0;
    this._versionId = 0;
    this._framesOnSave = 0;
    this._bgmOnSave = null;
    this._bgsOnSave = null;
    this._windowTone = null;
    this._battleBgm = null;
    this._victoryMe = null;
    this._defeatMe = null;
    this._savedBgm = null;
    this._walkingBgm = null;
};

Game_System.prototype.isJapanese = function() {
    return $dataSystem.locale.match(/^ja/);
};

Game_System.prototype.isChinese = function() {
    return $dataSystem.locale.match(/^zh/);
};

Game_System.prototype.isKorean = function() {
    return $dataSystem.locale.match(/^ko/);
};

Game_System.prototype.isCJK = function() {
    return $dataSystem.locale.match(/^(ja|zh|ko)/);
};

Game_System.prototype.isRussian = function() {
    return $dataSystem.locale.match(/^ru/);
};

Game_System.prototype.isSideView = function() {
    return $dataSystem.optSideView;
};

Game_System.prototype.isSaveEnabled = function() {
    return this._saveEnabled;
};

Game_System.prototype.disableSave = function() {
    this._saveEnabled = false;
};

Game_System.prototype.enableSave = function() {
    this._saveEnabled = true;
};

Game_System.prototype.isMenuEnabled = function() {
    return this._menuEnabled;
};

Game_System.prototype.disableMenu = function() {
    this._menuEnabled = false;
};

Game_System.prototype.enableMenu = function() {
    this._menuEnabled = true;
};

Game_System.prototype.isEncounterEnabled = function() {
    return this._encounterEnabled;
};

Game_System.prototype.disableEncounter = function() {
    this._encounterEnabled = false;
};

Game_System.prototype.enableEncounter = function() {
    this._encounterEnabled = true;
};

Game_System.prototype.isFormationEnabled = function() {
    return this._formationEnabled;
};

Game_System.prototype.disableFormation = function() {
    this._formationEnabled = false;
};

Game_System.prototype.enableFormation = function() {
    this._formationEnabled = true;
};

Game_System.prototype.battleCount = function() {
    return this._battleCount;
};

Game_System.prototype.winCount = function() {
    return this._winCount;
};

Game_System.prototype.escapeCount = function() {
    return this._escapeCount;
};

Game_System.prototype.saveCount = function() {
    return this._saveCount;
};

Game_System.prototype.versionId = function() {
    return this._versionId;
};

Game_System.prototype.windowTone = function() {
    return this._windowTone || $dataSystem.windowTone;
};

Game_System.prototype.setWindowTone = function(value) {
    this._windowTone = value;
};

Game_System.prototype.battleBgm = function() {
    return this._battleBgm || $dataSystem.battleBgm;
};

Game_System.prototype.setBattleBgm = function(value) {
    this._battleBgm = value;
};

Game_System.prototype.victoryMe = function() {
    return this._victoryMe || $dataSystem.victoryMe;
};

Game_System.prototype.setVictoryMe = function(value) {
    this._victoryMe = value;
};

Game_System.prototype.defeatMe = function() {
    return this._defeatMe || $dataSystem.defeatMe;
};

Game_System.prototype.setDefeatMe = function(value) {
    this._defeatMe = value;
};

Game_System.prototype.onBattleStart = function() {
    this._battleCount++;
};

Game_System.prototype.onBattleWin = function() {
    this._winCount++;
};

Game_System.prototype.onBattleEscape = function() {
    this._escapeCount++;
};

Game_System.prototype.onBeforeSave = function() {
    this._saveCount++;
    this._versionId = $dataSystem.versionId;
    this._framesOnSave = Graphics.frameCount;
    this._bgmOnSave = AudioManager.saveBgm();
    this._bgsOnSave = AudioManager.saveBgs();
};

Game_System.prototype.playtime = function() {
    return Math.floor(Graphics.frameCount / 60);
};

Game_System.prototype.saveBgm = function() {
    this._savedBgm = AudioManager.saveBgm();
};

Game_System.prototype.replayBgm = function() {
    if (this._savedBgm) {
        AudioManager.replayBgm(this._savedBgm);
    }
};

Game_System.prototype.saveWalkingBgm = function() {
    this._walkingBgm = AudioManager.saveBgm();
};

Game_System.prototype.replayWalkingBgm = function() {
    if (this._walkingBgm) {
        AudioManager.playBgm(this._walkingBgm);
    }
};

Game_System.prototype.saveWalkingBgm2 = function() {
	this._walkingBgm = $dataMap.bgm;
};

//-----------------------------------------------------------------------------
// Game_Timer
//
// The game object class for the timer.

Game_Timer.prototype.update = function(sceneActive) {
    if (sceneActive && this._working && this._frames > 0) {
        this._frames--;
        if (this._frames === 0) {
            this.onExpire();
        }
    }
};

Game_Timer.prototype.start = function(count) {
    this._frames = count;
    this._working = true;
};

Game_Timer.prototype.stop = function() {
    this._working = false;
};

Game_Timer.prototype.isWorking = function() {
    return this._working;
};

Game_Timer.prototype.seconds = function() {
    return Math.floor(this._frames / 60);
};

//-----------------------------------------------------------------------------
// Game_Message
//
// The game object class for the state of the message window that displays text
// or selections, etc.

Game_Message.prototype.initialize = function() {
    this.clear();
};

Game_Message.prototype.clear = function() {
    this._texts = [];
    this._choices = [];
    this._faceName = '';
    this._faceIndex = 0;
    this._background = 0;
    this._positionType = 2;
    this._choiceDefaultType = 0;
    this._choiceCancelType = 0;
    this._choiceBackground = 0;
    this._choicePositionType = 2;
    this._numInputVariableId = 0;
    this._numInputMaxDigits = 0;
    this._itemChoiceVariableId = 0;
    this._itemChoiceItypeId = 0;
    this._scrollMode = false;
    this._scrollSpeed = 2;
    this._scrollNoFast = false;
    this._choiceCallback = null;
};

Game_Message.prototype.choices = function() {
    return this._choices;
};

Game_Message.prototype.faceName = function() {
    return this._faceName;
};

Game_Message.prototype.faceIndex = function() {
    return this._faceIndex;
};

Game_Message.prototype.background = function() {
    return this._background;
};

Game_Message.prototype.positionType = function() {
    return this._positionType;
};

Game_Message.prototype.choiceDefaultType = function() {
    return this._choiceDefaultType;
};

Game_Message.prototype.choiceCancelType = function() {
    return this._choiceCancelType;
};

Game_Message.prototype.choiceBackground = function() {
    return this._choiceBackground;
};

Game_Message.prototype.choicePositionType = function() {
    return this._choicePositionType;
};

Game_Message.prototype.numInputVariableId = function() {
    return this._numInputVariableId;
};

Game_Message.prototype.numInputMaxDigits = function() {
    return this._numInputMaxDigits;
};

Game_Message.prototype.itemChoiceVariableId = function() {
    return this._itemChoiceVariableId;
};

Game_Message.prototype.itemChoiceItypeId = function() {
    return this._itemChoiceItypeId;
};

Game_Message.prototype.scrollMode = function() {
    return this._scrollMode;
};

Game_Message.prototype.scrollSpeed = function() {
    return this._scrollSpeed;
};

Game_Message.prototype.scrollNoFast = function() {
    return this._scrollNoFast;
};

Game_Message.prototype.add = function(text) {
    this._texts.push(text);
};

Game_Message.prototype.setBackground = function(background) {
    this._background = background;
};

Game_Message.prototype.setPositionType = function(positionType) {
    this._positionType = positionType;
};

Game_Message.prototype.setChoices = function(choices, defaultType, cancelType) {
    this._choices = choices;
    this._choiceDefaultType = defaultType;
    this._choiceCancelType = cancelType;
};

Game_Message.prototype.setChoiceBackground = function(background) {
    this._choiceBackground = background;
};

Game_Message.prototype.setChoicePositionType = function(positionType) {
    this._choicePositionType = positionType;
};

Game_Message.prototype.setNumberInput = function(variableId, maxDigits) {
    this._numInputVariableId = variableId;
    this._numInputMaxDigits = maxDigits;
};

Game_Message.prototype.setItemChoice = function(variableId, itemType) {
    this._itemChoiceVariableId = variableId;
    this._itemChoiceItypeId = itemType;
};

Game_Message.prototype.setScroll = function(speed, noFast) {
    this._scrollMode = true;
    this._scrollSpeed = speed;
    this._scrollNoFast = noFast;
};

Game_Message.prototype.setChoiceCallback = function(callback) {
    this._choiceCallback = callback;
};

Game_Message.prototype.onChoice = function(n) {
    if (this._choiceCallback) {
        this._choiceCallback(n);
        this._choiceCallback = null;
    }
};

Game_Message.prototype.hasText = function() {
    return this._texts.length > 0;
};

Game_Message.prototype.isChoice = function() {
    return this._choices.length > 0;
};

Game_Message.prototype.isNumberInput = function() {
    return this._numInputVariableId > 0;
};

Game_Message.prototype.isItemChoice = function() {
    return this._itemChoiceVariableId > 0;
};

Game_Message.prototype.isBusy = function() {
    return (this.hasText() || this.isChoice() ||
            this.isNumberInput() || this.isItemChoice());
};

Game_Message.prototype.newPage = function() {
    if (this._texts.length > 0) {
        this._texts[this._texts.length - 1] += '\f';
    }
};

Game_Message.prototype.allText = function() {
    return this._texts.join('\n');
};

//-----------------------------------------------------------------------------
// Game_Switches
//
// The game object class for switches.

Game_Switches.prototype.initialize = function() {
    this.clear();
};

Game_Switches.prototype.clear = function() {
    this._data = [];
};

Game_Switches.prototype.value = function(switchId) {
    return !!this._data[switchId];
};

Game_Switches.prototype.setValue = function(switchId, value) {
    if (switchId > 0 && switchId < $dataSystem.switches.length) {
        this._data[switchId] = value;
        this.onChange();
    }
};

Game_Switches.prototype.onChange = function() {
    $gameMap.requestRefresh();
};

//-----------------------------------------------------------------------------
// Game_Variables
//
// The game object class for variables.

Game_Variables.prototype.initialize = function() {
    this.clear();
};

Game_Variables.prototype.clear = function() {
    this._data = [];
};

Game_Variables.prototype.value = function(variableId) {
    return this._data[variableId] || 0;
};

Game_Variables.prototype.onChange = function() {
    $gameMap.requestRefresh();
};

//-----------------------------------------------------------------------------
// Game_SelfSwitches
//
// The game object class for self switches.

Game_SelfSwitches.prototype.initialize = function() {
    this.clear();
};

Game_SelfSwitches.prototype.onChange = function() {
    $gameMap.requestRefresh();
};

//-----------------------------------------------------------------------------
// Game_Screen
//
// The game object class for screen effect data, such as changes in color tone
// and flashes.

Game_Screen.prototype.initialize = function() {
    this.clear();
};

Game_Screen.prototype.clear = function() {
    this.clearFade();
    this.clearTone();
    this.clearFlash();
    this.clearShake();
    this.clearZoom();
    this.clearWeather();
    this.clearPictures();
};

Game_Screen.prototype.onBattleStart = function() {
    this.clearFade();
    this.clearFlash();
    this.clearShake();
    this.clearZoom();
    this.eraseBattlePictures();
};

Game_Screen.prototype.brightness = function() {
    return this._brightness;
};

Game_Screen.prototype.tone = function() {
    return this._tone;
};

Game_Screen.prototype.flashColor = function() {
    return this._flashColor;
};

Game_Screen.prototype.shake = function() {
    return this._shake;
};

Game_Screen.prototype.zoomX = function() {
    return this._zoomX;
};

Game_Screen.prototype.zoomY = function() {
    return this._zoomY;
};

Game_Screen.prototype.zoomScale = function() {
    return this._zoomScale;
};

Game_Screen.prototype.weatherType = function() {
    return this._weatherType;
};

Game_Screen.prototype.weatherPower = function() {
    return this._weatherPower;
};

Game_Screen.prototype.picture = function(pictureId) {
    var realPictureId = this.realPictureId(pictureId);
    return this._pictures[realPictureId];
};

Game_Screen.prototype.realPictureId = function(pictureId) {
    if ($gameParty.inBattle()) {
        return pictureId + this.maxPictures();
    } else {
        return pictureId;
    }
};

Game_Screen.prototype.clearFade = function() {
    this._brightness = 255;
    this._fadeOutDuration = 0;
    this._fadeInDuration = 0;
};

Game_Screen.prototype.clearTone = function() {
    this._tone = [0, 0, 0, 0];
    this._toneTarget = [0, 0, 0, 0];
    this._toneDuration = 0;
};

Game_Screen.prototype.clearFlash = function() {
    this._flashColor = [0, 0, 0, 0];
    this._flashDuration = 0;
};

Game_Screen.prototype.clearShake = function() {
    this._shakePower = 0;
    this._shakeSpeed = 0;
    this._shakeDuration = 0;
    this._shakeDirection = 1;
    this._shake = 0;
};

Game_Screen.prototype.clearZoom = function() {
    this._zoomX = 0;
    this._zoomY = 0;
    this._zoomScale = 1;
    this._zoomScaleTarget = 1;
    this._zoomDuration = 0;
};

Game_Screen.prototype.clearWeather = function() {
    this._weatherType = 'none';
    this._weatherPower = 0;
    this._weatherPowerTarget = 0;
    this._weatherDuration = 0;
};

Game_Screen.prototype.clearPictures = function() {
    this._pictures = [];
};

Game_Screen.prototype.maxPictures = function() {
    return 100;
};

Game_Screen.prototype.startFadeOut = function(duration) {
    this._fadeOutDuration = duration;
    this._fadeInDuration = 0;
};

Game_Screen.prototype.startFadeIn = function(duration) {
    this._fadeInDuration = duration;
    this._fadeOutDuration = 0;
};

Game_Screen.prototype.startTint = function(tone, duration) {
    this._toneTarget = tone.clone();
    this._toneDuration = duration;
    if (this._toneDuration === 0) {
        this._tone = this._toneTarget.clone();
    }
};

Game_Screen.prototype.startFlash = function(color, duration) {
    this._flashColor = color.clone();
    this._flashDuration = duration;
};

Game_Screen.prototype.startShake = function(power, speed, duration) {
    this._shakePower = power;
    this._shakeSpeed = speed;
    this._shakeDuration = duration;
};

Game_Screen.prototype.startZoom = function(x, y, scale, duration) {
    this._zoomX = x;
    this._zoomY = y;
    this._zoomScaleTarget = scale;
    this._zoomDuration = duration;
};

Game_Screen.prototype.setZoom = function(x, y, scale) {
    this._zoomX = x;
    this._zoomY = y;
    this._zoomScale = scale;
};

Game_Screen.prototype.changeWeather = function(type, power, duration) {
    if (type !== 'none' || duration === 0) {
        this._weatherType = type;
    }
    this._weatherPowerTarget = type === 'none' ? 0 : power;
    this._weatherDuration = duration;
    if (duration === 0) {
        this._weatherPower = this._weatherPowerTarget;
    }
};

Game_Screen.prototype.update = function() {
    this.updateFadeOut();
    this.updateFadeIn();
    this.updateTone();
    this.updateFlash();
    this.updateShake();
    this.updateZoom();
    this.updateWeather();
    this.updatePictures();
};

Game_Screen.prototype.updateFadeOut = function() {
    if (this._fadeOutDuration > 0) {
        var d = this._fadeOutDuration;
        this._brightness = (this._brightness * (d - 1)) / d;
        this._fadeOutDuration--;
    }
};

Game_Screen.prototype.updateFadeIn = function() {
    if (this._fadeInDuration > 0) {
        var d = this._fadeInDuration;
        this._brightness = (this._brightness * (d - 1) + 255) / d;
        this._fadeInDuration--;
    }
};

Game_Screen.prototype.updateTone = function() {
    if (this._toneDuration > 0) {
        var d = this._toneDuration;
        for (var i = 0; i < 4; i++) {
            this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
        }
        this._toneDuration--;
    }
};

Game_Screen.prototype.updateFlash = function() {
    if (this._flashDuration > 0) {
        var d = this._flashDuration;
        this._flashColor[3] *= (d - 1) / d;
        this._flashDuration--;
    }
};

Game_Screen.prototype.updateShake = function() {
    if (this._shakeDuration > 0 || this._shake !== 0) {
        var delta = (this._shakePower * this._shakeSpeed * this._shakeDirection) / 10;
        if (this._shakeDuration <= 1 && this._shake * (this._shake + delta) < 0) {
            this._shake = 0;
        } else {
            this._shake += delta;
        }
        if (this._shake > this._shakePower * 2) {
            this._shakeDirection = -1;
        }
        if (this._shake < - this._shakePower * 2) {
            this._shakeDirection = 1;
        }
        this._shakeDuration--;
    }
};

Game_Screen.prototype.updateZoom = function() {
    if (this._zoomDuration > 0) {
        var d = this._zoomDuration;
        var t = this._zoomScaleTarget;
        this._zoomScale = (this._zoomScale * (d - 1) + t) / d;
        this._zoomDuration--;
    }
};

Game_Screen.prototype.updateWeather = function() {
    if (this._weatherDuration > 0) {
        var d = this._weatherDuration;
        var t = this._weatherPowerTarget;
        this._weatherPower = (this._weatherPower * (d - 1) + t) / d;
        this._weatherDuration--;
        if (this._weatherDuration === 0 && this._weatherPowerTarget === 0) {
            this._weatherType = 'none';
        }
    }
};

Game_Screen.prototype.updatePictures = function() {
    this._pictures.forEach(function(picture) {
        if (picture) {
            picture.update();
        }
    });
};

Game_Screen.prototype.startFlashForDamage = function() {
    this.startFlash([255, 0, 0, 128], 8);
};

Game_Screen.prototype.showPicture = function(pictureId, name, origin, x, y,
                                             scaleX, scaleY, opacity, blendMode) {
    var realPictureId = this.realPictureId(pictureId);
    var picture = new Game_Picture();
    picture.show(name, origin, x, y, scaleX, scaleY, opacity, blendMode);
    this._pictures[realPictureId] = picture;
};

Game_Screen.prototype.movePicture = function(pictureId, origin, x, y, scaleX,
                                             scaleY, opacity, blendMode, duration) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.move(origin, x, y, scaleX, scaleY, opacity, blendMode, duration);
    }
};

Game_Screen.prototype.rotatePicture = function(pictureId, speed) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.rotate(speed);
    }
};

Game_Screen.prototype.tintPicture = function(pictureId, tone, duration) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.tint(tone, duration);
    }
};

Game_Screen.prototype.erasePicture = function(pictureId) {
    var realPictureId = this.realPictureId(pictureId);
    this._pictures[realPictureId] = null;
};

//-----------------------------------------------------------------------------
// Game_Picture
//
// The game object class for a picture.

Game_Picture.prototype.initialize = function() {
    this.initBasic();
    this.initTarget();
    this.initTone();
    this.initRotation();
};

Game_Picture.prototype.name = function() {
    return this._name;
};

Game_Picture.prototype.origin = function() {
    return this._origin;
};

Game_Picture.prototype.x = function() {
    return this._x;
};

Game_Picture.prototype.y = function() {
    return this._y;
};

Game_Picture.prototype.scaleX = function() {
    return this._scaleX;
};

Game_Picture.prototype.scaleY = function() {
    return this._scaleY;
};

Game_Picture.prototype.opacity = function() {
    return this._opacity;
};

Game_Picture.prototype.blendMode = function() {
    return this._blendMode;
};

Game_Picture.prototype.tone = function() {
    return this._tone;
};

Game_Picture.prototype.angle = function() {
    return this._angle;
};

Game_Picture.prototype.initBasic = function() {
    this._name = '';
    this._origin = 0;
    this._x = 0;
    this._y = 0;
    this._scaleX = 100;
    this._scaleY = 100;
    this._opacity = 255;
    this._blendMode = 0;
};

Game_Picture.prototype.initTarget = function() {
    this._targetX = this._x;
    this._targetY = this._y;
    this._targetScaleX = this._scaleX;
    this._targetScaleY = this._scaleY;
    this._targetOpacity = this._opacity;
    this._duration = 0;
};

Game_Picture.prototype.initTone = function() {
    this._tone = null;
    this._toneTarget = null;
    this._toneDuration = 0;
};

Game_Picture.prototype.initRotation = function() {
    this._angle = 0;
    this._rotationSpeed = 0;
};

Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                       scaleY, opacity, blendMode) {
    this._name = name;
    this._origin = origin;
    this._x = x;
    this._y = y;
    this._scaleX = scaleX;
    this._scaleY = scaleY;
    this._opacity = opacity;
    this._blendMode = blendMode;
    this.initTarget();
    this.initTone();
    this.initRotation();
};

Game_Picture.prototype.move = function(origin, x, y, scaleX, scaleY,
                                       opacity, blendMode, duration) {
    this._origin = origin;
    this._targetX = x;
    this._targetY = y;
    this._targetScaleX = scaleX;
    this._targetScaleY = scaleY;
    this._targetOpacity = opacity;
    this._blendMode = blendMode;
    this._duration = duration;
};

Game_Picture.prototype.rotate = function(speed) {
    this._rotationSpeed = speed;
};

Game_Picture.prototype.tint = function(tone, duration) {
    if (!this._tone) {
        this._tone = [0, 0, 0, 0];
    }
    this._toneTarget = tone.clone();
    this._toneDuration = duration;
    if (this._toneDuration === 0) {
        this._tone = this._toneTarget.clone();
    }
};

Game_Picture.prototype.erase = function() {
    this._name = '';
    this._origin = 0;
    this.initTarget();
    this.initTone();
    this.initRotation();
};

Game_Picture.prototype.update = function() {
    this.updateMove();
    this.updateTone();
    this.updateRotation();
};

Game_Picture.prototype.updateMove = function() {
    if (this._duration > 0) {
        var d = this._duration;
        this._x = (this._x * (d - 1) + this._targetX) / d;
        this._y = (this._y * (d - 1) + this._targetY) / d;
        this._scaleX  = (this._scaleX  * (d - 1) + this._targetScaleX)  / d;
        this._scaleY  = (this._scaleY  * (d - 1) + this._targetScaleY)  / d;
        this._opacity = (this._opacity * (d - 1) + this._targetOpacity) / d;
        this._duration--;
    }
};

Game_Picture.prototype.updateTone = function() {
    if (this._toneDuration > 0) {
        var d = this._toneDuration;
        for (var i = 0; i < 4; i++) {
            this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
        }
        this._toneDuration--;
    }
};

Game_Picture.prototype.updateRotation = function() {
    if (this._rotationSpeed !== 0) {
        this._angle += this._rotationSpeed / 2;
    }
};

//-----------------------------------------------------------------------------
// Game_Item
//
// The game object class for handling skills, items, weapons, and armor. It is
// required because save data should not include the database object itself.

Game_Item.prototype.initialize = function(item) {
    this._dataClass = '';
    this._itemId = 0;
    if (item) {
        this.setObject(item);
    }
};

Game_Item.prototype.isSkill = function() {
    return this._dataClass === 'skill';
};

Game_Item.prototype.isItem = function() {
    return this._dataClass === 'item';
};

Game_Item.prototype.isUsableItem = function() {
    return this.isSkill() || this.isItem();
};

Game_Item.prototype.isWeapon = function() {
    return this._dataClass === 'weapon';
};

Game_Item.prototype.isArmor = function() {
    return this._dataClass === 'armor';
};

Game_Item.prototype.isEquipItem = function() {
    return this.isWeapon() || this.isArmor();
};

Game_Item.prototype.isNull = function() {
    return this._dataClass === '';
};

Game_Item.prototype.itemId = function() {
    return this._itemId;
};

Game_Item.prototype.setEquip = function(isWeapon, itemId) {
    this._dataClass = isWeapon ? 'weapon' : 'armor';
    this._itemId = itemId;
};

//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.

Game_Action.EFFECT_RECOVER_HP       = 11;
Game_Action.EFFECT_RECOVER_MP       = 12;
Game_Action.EFFECT_GAIN_TP          = 13;
Game_Action.EFFECT_ADD_STATE        = 21;
Game_Action.EFFECT_REMOVE_STATE     = 22;
Game_Action.EFFECT_ADD_BUFF         = 31;
Game_Action.EFFECT_ADD_DEBUFF       = 32;
Game_Action.EFFECT_REMOVE_BUFF      = 33;
Game_Action.EFFECT_REMOVE_DEBUFF    = 34;
Game_Action.EFFECT_SPECIAL          = 41;
Game_Action.EFFECT_GROW             = 42;
Game_Action.EFFECT_LEARN_SKILL      = 43;
Game_Action.EFFECT_COMMON_EVENT     = 44;
Game_Action.SPECIAL_EFFECT_ESCAPE   = 0;
Game_Action.HITTYPE_CERTAIN         = 0;
Game_Action.HITTYPE_PHYSICAL        = 1;
Game_Action.HITTYPE_MAGICAL         = 2;

Game_Action.prototype.initialize = function(subject, forcing) {
    this._subjectActorId = 0;
    this._subjectEnemyIndex = -1;
    this._forcing = forcing || false;
    this.setSubject(subject);
    this.clear();
};

Game_Action.prototype.clear = function() {
    this._item = new Game_Item();
    this._targetIndex = -1;
};

Game_Action.prototype.friendsUnit = function() {
    return this.subject().friendsUnit();
};

Game_Action.prototype.opponentsUnit = function() {
    return this.subject().opponentsUnit();
};

Game_Action.prototype.setEnemyAction = function(action) {
    if (action) {
        this.setSkill(action.skillId);
    } else {
        this.clear();
    }
};

Game_Action.prototype.setAttack = function() {
    this.setSkill(this.subject().attackSkillId());
};

Game_Action.prototype.setGuard = function() {
    this.setSkill(this.subject().guardSkillId());
};

Game_Action.prototype.setSkill = function(skillId) {
    this._item.setObject($dataSkills[skillId]);
};

Game_Action.prototype.setItem = function(itemId) {
    this._item.setObject($dataItems[itemId]);
};

Game_Action.prototype.setItemObject = function(object) {
    this._item.setObject(object);
};

Game_Action.prototype.setTarget = function(targetIndex) {
    this._targetIndex = targetIndex;
};

Game_Action.prototype.item = function() {
    return this._item.object();
};

Game_Action.prototype.isSkill = function() {
    return this._item.isSkill();
};

Game_Action.prototype.isItem = function() {
    return this._item.isItem();
};

Game_Action.prototype.checkItemScope = function(list) {
    return list.contains(this.item().scope);
};

Game_Action.prototype.numTargets = function() {
    return this.isForRandom() ? this.item().scope - 2 : 0;
};

Game_Action.prototype.checkDamageType = function(list) {
    return list.contains(this.item().damage.type);
};

Game_Action.prototype.isCertainHit = function() {
    return this.item().hitType === Game_Action.HITTYPE_CERTAIN;
};

Game_Action.prototype.isPhysical = function() {
    return this.item().hitType === Game_Action.HITTYPE_PHYSICAL;
};

Game_Action.prototype.isMagical = function() {
    return this.item().hitType === Game_Action.HITTYPE_MAGICAL;
};

Game_Action.prototype.isMagicSkill = function() {
    if (this.isSkill()) {
        return $dataSystem.magicSkills.contains(this.item().stypeId);
    } else {
        return false;
    }
};

Game_Action.prototype.setConfusion = function() {
    this.setAttack();
};

Game_Action.prototype.prepare = function() {
    if (this.subject().isConfused() && !this._forcing) {
        this.setConfusion();
    }
};

Game_Action.prototype.isValid = function() {
    return (this._forcing && this.item()) || this.subject().canUse(this.item());
};

Game_Action.prototype.confusionTarget = function() {
    switch (this.subject().confusionLevel()) {
    case 1:
        return this.opponentsUnit().randomTarget();
    case 2:
        if (Math.randomInt(2) === 0) {
            return this.opponentsUnit().randomTarget();
        }
        return this.friendsUnit().randomTarget();
    default:
        return this.friendsUnit().randomTarget();
    }
};

Game_Action.prototype.evaluate = function() {
    var value = 0;
    this.itemTargetCandidates().forEach(function(target) {
        var targetValue = this.evaluateWithTarget(target);
        if (this.isForAll()) {
            value += targetValue;
        } else if (targetValue > value) {
            value = targetValue;
            this._targetIndex = target.index();
        }
    }, this);
    value *= this.numRepeats();
    if (value > 0) {
        value += Math.random();
    }
    return value;
};

Game_Action.prototype.evaluateWithTarget = function(target) {
    if (this.isHpEffect()) {
        var value = this.makeDamageValue(target, false);
        if (this.isForOpponent()) {
            return value / Math.max(target.hp, 1);
        } else {
            var recovery = Math.min(-value, target.mhp - target.hp);
            return recovery / target.mhp;
        }
    }
};

Game_Action.prototype.hasItemAnyValidEffects = function(target) {
    return this.item().effects.some(function(effect) {
        return this.testItemEffect(target, effect);
    }, this);
};

Game_Action.prototype.applyCritical = function(damage) {
    return damage * 3;
};

Game_Action.prototype.applyVariance = function(damage, variance) {
    var amp = Math.floor(Math.max(Math.abs(damage) * variance / 100, 0));
    var v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;
    return damage >= 0 ? damage + v : damage - v;
};

Game_Action.prototype.executeDamage = function(target, value) {
    var result = target.result();
    if (value === 0) {
        result.critical = false;
    }
    if (this.isHpEffect()) {
        this.executeHpDamage(target, value);
    }
    if (this.isMpEffect()) {
        this.executeMpDamage(target, value);
    }
};

Game_Action.prototype.executeMpDamage = function(target, value) {
    if (!this.isMpRecover()) {
        value = Math.min(target.mp, value);
    }
    if (value !== 0) {
        this.makeSuccess(target);
    }
    target.gainMp(-value);
    this.gainDrainedMp(value);
};

Game_Action.prototype.itemEffectRecoverHp = function(target, effect) {
    var value = (target.mhp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if (value !== 0) {
        target.gainHp(value);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectRecoverMp = function(target, effect) {
    var value = (target.mmp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if (value !== 0) {
        target.gainMp(value);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectGainTp = function(target, effect) {
    var value = Math.floor(effect.value1);
    if (value !== 0) {
        target.gainTp(value);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectAddState = function(target, effect) {
    if (effect.dataId === 0) {
        this.itemEffectAddAttackState(target, effect);
    } else {
        this.itemEffectAddNormalState(target, effect);
    }
};

Game_Action.prototype.itemEffectRemoveState = function(target, effect) {
    var chance = effect.value1;
    if (Math.random() < chance) {
        target.removeState(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectAddBuff = function(target, effect) {
    target.addBuff(effect.dataId, effect.value1);
    this.makeSuccess(target);
};

Game_Action.prototype.itemEffectAddDebuff = function(target, effect) {
    var chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
    if (Math.random() < chance) {
        target.addDebuff(effect.dataId, effect.value1);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectRemoveBuff = function(target, effect) {
    if (target.isBuffAffected(effect.dataId)) {
        target.removeBuff(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectRemoveDebuff = function(target, effect) {
    if (target.isDebuffAffected(effect.dataId)) {
        target.removeBuff(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectSpecial = function(target, effect) {
    if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
        target.escape();
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectGrow = function(target, effect) {
    target.addParam(effect.dataId, Math.floor(effect.value1));
    this.makeSuccess(target);
};

Game_Action.prototype.itemEffectLearnSkill = function(target, effect) {
    if (target.isActor()) {
        target.learnSkill(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectCommonEvent = function(target, effect) {
};

Game_Action.prototype.makeSuccess = function(target) {
    target.result().success = true;
};

Game_Action.prototype.applyItemUserEffect = function(target) {
    var value = Math.floor(this.item().tpGain * this.subject().tcr);
    this.subject().gainSilentTp(value);
};

Game_Action.prototype.lukEffectRate = function(target) {
    return Math.max(1.0 + (this.subject().luk - target.luk) * 0.001, 0.0);
};

Game_Action.prototype.applyGlobal = function() {
    this.item().effects.forEach(function(effect) {
        if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
            $gameTemp.reserveCommonEvent(effect.dataId);
        }
    }, this);
};

//-----------------------------------------------------------------------------
// Game_ActionResult
//
// The game object class for a result of a battle action. For convinience, all
// member variables in this class are public.

Game_ActionResult.prototype.addedStateObjects = function() {
    return this.addedStates.map(function(id) {
        return $dataStates[id];
    });
};

Game_ActionResult.prototype.removedStateObjects = function() {
    return this.removedStates.map(function(id) {
        return $dataStates[id];
    });
};

Game_ActionResult.prototype.isStatusAffected = function() {
    return (this.addedStates.length > 0 || this.removedStates.length > 0 ||
            this.addedBuffs.length > 0 || this.addedDebuffs.length > 0 ||
            this.removedBuffs.length > 0);
};

Game_ActionResult.prototype.isHit = function() {
    return this.used && !this.missed && !this.evaded;
};

Game_ActionResult.prototype.isStateAdded = function(stateId) {
    return this.addedStates.contains(stateId);
};

Game_ActionResult.prototype.pushAddedState = function(stateId) {
    if (!this.isStateAdded(stateId)) {
        this.addedStates.push(stateId);
    }
};

Game_ActionResult.prototype.isStateRemoved = function(stateId) {
    return this.removedStates.contains(stateId);
};

Game_ActionResult.prototype.pushRemovedState = function(stateId) {
    if (!this.isStateRemoved(stateId)) {
        this.removedStates.push(stateId);
    }
};

Game_ActionResult.prototype.isBuffAdded = function(paramId) {
    return this.addedBuffs.contains(paramId);
};

Game_ActionResult.prototype.pushAddedBuff = function(paramId) {
    if (!this.isBuffAdded(paramId)) {
        this.addedBuffs.push(paramId);
    }
};

Game_ActionResult.prototype.isDebuffAdded = function(paramId) {
    return this.addedDebuffs.contains(paramId);
};

Game_ActionResult.prototype.pushAddedDebuff = function(paramId) {
    if (!this.isDebuffAdded(paramId)) {
        this.addedDebuffs.push(paramId);
    }
};

Game_ActionResult.prototype.isBuffRemoved = function(paramId) {
    return this.removedBuffs.contains(paramId);
};

Game_ActionResult.prototype.pushRemovedBuff = function(paramId) {
    if (!this.isBuffRemoved(paramId)) {
        this.removedBuffs.push(paramId);
    }
};

//-----------------------------------------------------------------------------
// Game_BattlerBase
//
// The superclass of Game_Battler. It mainly contains parameters calculation.

Game_BattlerBase.TRAIT_ELEMENT_RATE   = 11;
Game_BattlerBase.TRAIT_DEBUFF_RATE    = 12;
Game_BattlerBase.TRAIT_STATE_RATE     = 13;
Game_BattlerBase.TRAIT_STATE_RESIST   = 14;
Game_BattlerBase.TRAIT_PARAM          = 21;
Game_BattlerBase.TRAIT_XPARAM         = 22;
Game_BattlerBase.TRAIT_SPARAM         = 23;
Game_BattlerBase.TRAIT_ATTACK_ELEMENT = 31;
Game_BattlerBase.TRAIT_ATTACK_STATE   = 32;
Game_BattlerBase.TRAIT_ATTACK_SPEED   = 33;
Game_BattlerBase.TRAIT_ATTACK_TIMES   = 34;
Game_BattlerBase.TRAIT_STYPE_ADD      = 41;
Game_BattlerBase.TRAIT_STYPE_SEAL     = 42;
Game_BattlerBase.TRAIT_SKILL_ADD      = 43;
Game_BattlerBase.TRAIT_SKILL_SEAL     = 44;
Game_BattlerBase.TRAIT_EQUIP_WTYPE    = 51;
Game_BattlerBase.TRAIT_EQUIP_ATYPE    = 52;
Game_BattlerBase.TRAIT_EQUIP_LOCK     = 53;
Game_BattlerBase.TRAIT_EQUIP_SEAL     = 54;
Game_BattlerBase.TRAIT_SLOT_TYPE      = 55;
Game_BattlerBase.TRAIT_ACTION_PLUS    = 61;
Game_BattlerBase.TRAIT_SPECIAL_FLAG   = 62;
Game_BattlerBase.TRAIT_COLLAPSE_TYPE  = 63;
Game_BattlerBase.TRAIT_PARTY_ABILITY  = 64;
Game_BattlerBase.FLAG_ID_AUTO_BATTLE  = 0;
Game_BattlerBase.FLAG_ID_GUARD        = 1;
Game_BattlerBase.FLAG_ID_SUBSTITUTE   = 2;
Game_BattlerBase.FLAG_ID_PRESERVE_TP  = 3;
Game_BattlerBase.ICON_BUFF_START      = 32;
Game_BattlerBase.ICON_DEBUFF_START    = 48;

Object.defineProperties(Game_BattlerBase.prototype, {
    // Hit Points
    hp: { get: function() { return this._hp; }, configurable: true },
    // Magic Points
    mp: { get: function() { return this._mp; }, configurable: true },
    // Tactical Points
    tp: { get: function() { return this._tp; }, configurable: true },
    // Maximum Hit Points
    mhp: { get: function() { return this.param(0); }, configurable: true },
    // Maximum Magic Points
    mmp: { get: function() { return this.param(1); }, configurable: true },
    // ATtacK power
    atk: { get: function() { return this.param(2); }, configurable: true },
    // DEFense power
    def: { get: function() { return this.param(3); }, configurable: true },
    // Magic ATtack power
    mat: { get: function() { return this.param(4); }, configurable: true },
    // Magic DeFense power
    mdf: { get: function() { return this.param(5); }, configurable: true },
    // AGIlity
    agi: { get: function() { return this.param(6); }, configurable: true },
    // LUcK
    luk: { get: function() { return this.param(7); }, configurable: true },
    // HIT rate
    hit: { get: function() { return this.xparam(0); }, configurable: true },
    // EVAsion rate
    eva: { get: function() { return this.xparam(1); }, configurable: true },
    // CRItical rate
    cri: { get: function() { return this.xparam(2); }, configurable: true },
    // Critical EVasion rate
    cev: { get: function() { return this.xparam(3); }, configurable: true },
    // Magic EVasion rate
    mev: { get: function() { return this.xparam(4); }, configurable: true },
    // Magic ReFlection rate
    mrf: { get: function() { return this.xparam(5); }, configurable: true },
    // CouNTer attack rate
    cnt: { get: function() { return this.xparam(6); }, configurable: true },
    // Hp ReGeneration rate
    hrg: { get: function() { return this.xparam(7); }, configurable: true },
    // Mp ReGeneration rate
    mrg: { get: function() { return this.xparam(8); }, configurable: true },
    // Tp ReGeneration rate
    trg: { get: function() { return this.xparam(9); }, configurable: true },
    // TarGet Rate
    tgr: { get: function() { return this.sparam(0); }, configurable: true },
    // GuaRD effect rate
    grd: { get: function() { return this.sparam(1); }, configurable: true },
    // RECovery effect rate
    rec: { get: function() { return this.sparam(2); }, configurable: true },
    // PHArmacology
    pha: { get: function() { return this.sparam(3); }, configurable: true },
    // Mp Cost Rate
    mcr: { get: function() { return this.sparam(4); }, configurable: true },
    // Tp Charge Rate
    tcr: { get: function() { return this.sparam(5); }, configurable: true },
    // Physical Damage Rate
    pdr: { get: function() { return this.sparam(6); }, configurable: true },
    // Magical Damage Rate
    mdr: { get: function() { return this.sparam(7); }, configurable: true },
    // Floor Damage Rate
    fdr: { get: function() { return this.sparam(8); }, configurable: true },
    // EXperience Rate
    exr: { get: function() { return this.sparam(9); }, configurable: true }
});

Game_BattlerBase.prototype.initialize = function() {
    this.initMembers();
};

Game_BattlerBase.prototype.initMembers = function() {
    this._hp = 1;
    this._mp = 0;
    this._tp = 0;
    this._hidden = false;
    this.clearParamPlus();
    this.clearStates();
    this.clearBuffs();
};

Game_BattlerBase.prototype.clearParamPlus = function() {
    this._paramPlus = [0,0,0,0,0,0,0,0];
};

Game_BattlerBase.prototype.isDeathStateAffected = function() {
    return this.isStateAffected(this.deathStateId());
};

Game_BattlerBase.prototype.deathStateId = function() {
    return 1;
};

Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
    var state = $dataStates[stateId];
    var variance = 1 + Math.max(state.maxTurns - state.minTurns, 0);
    this._stateTurns[stateId] = state.minTurns + Math.randomInt(variance);
};

Game_BattlerBase.prototype.clearBuffs = function() {
    this._buffs = [0,0,0,0,0,0,0,0];
    this._buffTurns = [0,0,0,0,0,0,0,0];
};

Game_BattlerBase.prototype.buffLength = function() {
    return this._buffs.length;
};

Game_BattlerBase.prototype.buff = function(paramId) {
    return this._buffs[paramId];
};

Game_BattlerBase.prototype.isBuffAffected = function(paramId) {
    return this._buffs[paramId] > 0;
};

Game_BattlerBase.prototype.isDebuffAffected = function(paramId) {
    return this._buffs[paramId] < 0;
};

Game_BattlerBase.prototype.isBuffOrDebuffAffected = function(paramId) {
    return this._buffs[paramId] !== 0;
};

Game_BattlerBase.prototype.overwriteBuffTurns = function(paramId, turns) {
    if (this._buffTurns[paramId] < turns) {
        this._buffTurns[paramId] = turns;
    }
};

Game_BattlerBase.prototype.die = function() {
    this._hp = 0;
    this.clearStates();
    this.clearBuffs();
};

Game_BattlerBase.prototype.revive = function() {
    if (this._hp === 0) {
        this._hp = 1;
    }
};

Game_BattlerBase.prototype.paramBase = function(paramId) {
    return 0;
};

Game_BattlerBase.prototype.paramPlus = function(paramId) {
    return this._paramPlus[paramId];
};

Game_BattlerBase.prototype.paramMin = function(paramId) {
    if (paramId === 1) {
        return 0;   // MMP
    } else {
        return 1;
    }
};

Game_BattlerBase.prototype.paramRate = function(paramId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_PARAM, paramId);
};

Game_BattlerBase.prototype.paramBuffRate = function(paramId) {
    return this._buffs[paramId] * 0.25 + 1.0;
};

Game_BattlerBase.prototype.xparam = function(xparamId) {
    return this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);
};

Game_BattlerBase.prototype.sparam = function(sparamId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);
};

Game_BattlerBase.prototype.elementRate = function(elementId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
};

Game_BattlerBase.prototype.debuffRate = function(paramId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_DEBUFF_RATE, paramId);
};

Game_BattlerBase.prototype.stateRate = function(stateId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_STATE_RATE, stateId);
};

Game_BattlerBase.prototype.isStateResist = function(stateId) {
    return this.stateResistSet().contains(stateId);
};

Game_BattlerBase.prototype.attackElements = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_ELEMENT);
};

Game_BattlerBase.prototype.attackStates = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE);
};

Game_BattlerBase.prototype.attackStatesRate = function(stateId) {
    return this.traitsSum(Game_BattlerBase.TRAIT_ATTACK_STATE, stateId);
};

Game_BattlerBase.prototype.attackSpeed = function() {
    return this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_SPEED);
};

Game_BattlerBase.prototype.attackTimesAdd = function() {
    return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES), 0);
};

Game_BattlerBase.prototype.isSkillTypeSealed = function(stypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).contains(stypeId);
};

Game_BattlerBase.prototype.isSkillSealed = function(skillId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).contains(skillId);
};

Game_BattlerBase.prototype.isEquipWtypeOk = function(wtypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).contains(wtypeId);
};

Game_BattlerBase.prototype.isEquipAtypeOk = function(atypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).contains(atypeId);
};

Game_BattlerBase.prototype.isEquipTypeLocked = function(etypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_LOCK).contains(etypeId);
};

Game_BattlerBase.prototype.isEquipTypeSealed = function(etypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).contains(etypeId);
};

Game_BattlerBase.prototype.isDualWield = function() {
    return this.slotType() === 1;
};

Game_BattlerBase.prototype.isAutoBattle = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_AUTO_BATTLE);
};

Game_BattlerBase.prototype.isGuard = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_GUARD) && this.canMove();
};

Game_BattlerBase.prototype.isSubstitute = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_SUBSTITUTE) && this.canMove();
};

Game_BattlerBase.prototype.isPreserveTp = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_PRESERVE_TP);
};

Game_BattlerBase.prototype.addParam = function(paramId, value) {
    this._paramPlus[paramId] += value;
    this.refresh();
};

Game_BattlerBase.prototype.maxTp = function() {
    return 100;
};

Game_BattlerBase.prototype.hpRate = function() {
    return this.hp / this.mhp;
};

Game_BattlerBase.prototype.mpRate = function() {
    return this.mmp > 0 ? this.mp / this.mmp : 0;
};

Game_BattlerBase.prototype.tpRate = function() {
    return this.tp / this.maxTp();
};

Game_BattlerBase.prototype.hide = function() {
    this._hidden = true;
};

Game_BattlerBase.prototype.appear = function() {
    this._hidden = false;
};

Game_BattlerBase.prototype.isHidden = function() {
    return this._hidden;
};

Game_BattlerBase.prototype.isAppeared = function() {
    return !this.isHidden();
};

Game_BattlerBase.prototype.isDead = function() {
    return this.isAppeared() && this.isDeathStateAffected();
};

Game_BattlerBase.prototype.isAlive = function() {
    return this.isAppeared() && !this.isDeathStateAffected();
};

Game_BattlerBase.prototype.isDying = function() {
    return this.isAlive() && this._hp < this.mhp / 4;
};

Game_BattlerBase.prototype.isRestricted = function() {
    return this.isAppeared() && this.restriction() > 0;
};

Game_BattlerBase.prototype.canInput = function() {
    return this.isAppeared() && !this.isRestricted() && !this.isAutoBattle();
};

Game_BattlerBase.prototype.canMove = function() {
    return this.isAppeared() && this.restriction() < 4;
};

Game_BattlerBase.prototype.isConfused = function() {
    return this.isAppeared() && this.restriction() >= 1 && this.restriction() <= 3;
};

Game_BattlerBase.prototype.confusionLevel = function() {
    return this.isConfused() ? this.restriction() : 0;
};

Game_BattlerBase.prototype.isActor = function() {
    return false;
};

Game_BattlerBase.prototype.isEnemy = function() {
    return false;
};

Game_BattlerBase.prototype.onRestrict = function() {
};

Game_BattlerBase.prototype.isSkillWtypeOk = function(skill) {
    return true;
};

// skill_pCost {}

Game_BattlerBase.prototype.meetsUsableItemConditions = function(item) {
    return this.canMove() && this.isOccasionOk(item);
};

Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
    return (this.meetsUsableItemConditions(skill) &&
            this.isSkillWtypeOk(skill) && this.canPaySkillCost(skill) &&
            !this.isSkillSealed(skill.id) && !this.isSkillTypeSealed(skill.stypeId));
};

Game_BattlerBase.prototype.meetsItemConditions = function(item) {
    return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item);
};

Game_BattlerBase.prototype.canEquipWeapon = function(item) {
    return this.isEquipWtypeOk(item.wtypeId) && !this.isEquipTypeSealed(item.etypeId);
};

Game_BattlerBase.prototype.canEquipArmor = function(item) {
    return this.isEquipAtypeOk(item.atypeId) && !this.isEquipTypeSealed(item.etypeId);
};

Game_BattlerBase.prototype.attackSkillId = function() {
    return 1;
};

Game_BattlerBase.prototype.guardSkillId = function() {
    return 2;
};

Game_BattlerBase.prototype.canAttack = function() {
    return this.canUse($dataSkills[this.attackSkillId()]);
};

Game_BattlerBase.prototype.canGuard = function() {
    return this.canUse($dataSkills[this.guardSkillId()]);
};

//-----------------------------------------------------------------------------
// Game_Battler
//
// The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
// and actions.

Game_Battler.prototype = Object.create(Game_BattlerBase.prototype);
Game_Battler.prototype.constructor = Game_Battler;

Game_Battler.prototype.initialize = function() {
    Game_BattlerBase.prototype.initialize.call(this);
};

Game_Battler.prototype.initMembers = function() {
    Game_BattlerBase.prototype.initMembers.call(this);
    this._actions = [];
    this._speed = 0;
    this._result = new Game_ActionResult();
    this._actionState = '';
    this._lastTargetIndex = 0;
    this._animations = [];
    this._damagePopup = false;
    this._effectType = null;
    this._motionType = null;
    this._weaponImageId = 0;
    this._motionRefresh = false;
    this._selected = false;
};

Game_Battler.prototype.clearDamagePopup = function() {
    this._damagePopup = false;
};

Game_Battler.prototype.clearWeaponAnimation = function() {
    this._weaponImageId = 0;
};

Game_Battler.prototype.clearEffect = function() {
    this._effectType = null;
};

Game_Battler.prototype.clearMotion = function() {
    this._motionType = null;
    this._motionRefresh = false;
};

Game_Battler.prototype.requestEffect = function(effectType) {
    this._effectType = effectType;
};

Game_Battler.prototype.requestMotion = function(motionType) {
    this._motionType = motionType;
};

Game_Battler.prototype.requestMotionRefresh = function() {
    this._motionRefresh = true;
};

Game_Battler.prototype.select = function() {
    this._selected = true;
};

Game_Battler.prototype.deselect = function() {
    this._selected = false;
};

Game_Battler.prototype.isAnimationRequested = function() {
    return this._animations.length > 0;
};

Game_Battler.prototype.isDamagePopupRequested = function() {
    return this._damagePopup;
};

Game_Battler.prototype.isEffectRequested = function() {
    return !!this._effectType;
};

Game_Battler.prototype.isMotionRequested = function() {
    return !!this._motionType;
};

Game_Battler.prototype.isWeaponAnimationRequested = function() {
    return this._weaponImageId > 0;
};

Game_Battler.prototype.isMotionRefreshRequested = function() {
    return this._motionRefresh;
};

Game_Battler.prototype.isSelected = function() {
    return this._selected;
};

Game_Battler.prototype.effectType = function() {
    return this._effectType;
};

Game_Battler.prototype.motionType = function() {
    return this._motionType;
};

Game_Battler.prototype.weaponImageId = function() {
    return this._weaponImageId;
};

Game_Battler.prototype.shiftAnimation = function() {
    return this._animations.shift();
};

Game_Battler.prototype.startAnimation = function(animationId, mirror, delay) {
    var data = { animationId: animationId, mirror: mirror, delay: delay };
    this._animations.push(data);
};

Game_Battler.prototype.startDamagePopup = function() {
    this._damagePopup = true;
};

Game_Battler.prototype.startWeaponAnimation = function(weaponImageId) {
    this._weaponImageId = weaponImageId;
};

Game_Battler.prototype.numActions = function() {
    return this._actions.length;
};

Game_Battler.prototype.result = function() {
    return this._result;
};

Game_Battler.prototype.clearResult = function() {
    this._result.clear();
};

Game_Battler.prototype.addState = function(stateId) {
    if (this.isStateAddable(stateId)) {
        if (!this.isStateAffected(stateId)) {
            this.addNewState(stateId);
            this.refresh();
        }
        this.resetStateCounts(stateId);
        this._result.pushAddedState(stateId);
    }
};

Game_Battler.prototype.isStateAddable = function(stateId) {
    return (this.isAlive() && $dataStates[stateId] &&
            !this.isStateResist(stateId) &&
            !this._result.isStateRemoved(stateId) &&
            !this.isStateRestrict(stateId));
};

Game_Battler.prototype.isStateRestrict = function(stateId) {
    return $dataStates[stateId].removeByRestriction && this.isRestricted();
};

Game_Battler.prototype.onRestrict = function() {
    Game_BattlerBase.prototype.onRestrict.call(this);
    this.clearActions();
    this.states().forEach(function(state) {
        if (state.removeByRestriction) {
            this.removeState(state.id);
        }
    }, this);
};

Game_Battler.prototype.removeState = function(stateId) {
    if (this.isStateAffected(stateId)) {
        if (stateId === this.deathStateId()) {
            this.revive();
        }
        this.eraseState(stateId);
        this.refresh();
        this._result.pushRemovedState(stateId);
    }
};

Game_Battler.prototype.escape = function() {
    if ($gameParty.inBattle()) {
        this.hide();
    }
    this.clearActions();
    this.clearStates();
    SoundManager.playEscape();
};

Game_Battler.prototype.addBuff = function(paramId, turns) {
    if (this.isAlive()) {
        this.increaseBuff(paramId);
        if (this.isBuffAffected(paramId)) {
            this.overwriteBuffTurns(paramId, turns);
        }
        this._result.pushAddedBuff(paramId);
        this.refresh();
    }
};

Game_Battler.prototype.addDebuff = function(paramId, turns) {
    if (this.isAlive()) {
        this.decreaseBuff(paramId);
        if (this.isDebuffAffected(paramId)) {
            this.overwriteBuffTurns(paramId, turns);
        }
        this._result.pushAddedDebuff(paramId);
        this.refresh();
    }
};

Game_Battler.prototype.removeBuff = function(paramId) {
    if (this.isAlive() && this.isBuffOrDebuffAffected(paramId)) {
        this.eraseBuff(paramId);
        this._result.pushRemovedBuff(paramId);
        this.refresh();
    }
};

Game_Battler.prototype.removeBattleStates = function() {
    this.states().forEach(function(state) {
        if (state.removeAtBattleEnd) {
            this.removeState(state.id);
        }
    }, this);
};

Game_Battler.prototype.removeStatesByDamage = function() {
    this.states().forEach(function(state) {
        if (state.removeByDamage && Math.randomInt(100) < state.chanceByDamage) {
            this.removeState(state.id);
        }
    }, this);
};

Game_Battler.prototype.speed = function() {
    return this._speed;
};

Game_Battler.prototype.makeSpeed = function() {
    this._speed = Math.min.apply(null, this._actions.map(function(action) {
        return action.speed();
    })) || 0;
};

Game_Battler.prototype.currentAction = function() {
    return this._actions[0];
};

Game_Battler.prototype.setLastTarget = function(target) {
    if (target) {
        this._lastTargetIndex = target.index();
    } else {
        this._lastTargetIndex = 0;
    }
};

Game_Battler.prototype.forceAction = function(skillId, targetIndex) {
    this.clearActions();
    var action = new Game_Action(this, true);
    action.setSkill(skillId);
    if (targetIndex === -2) {
        action.setTarget(this._lastTargetIndex);
    } else if (targetIndex === -1) {
        action.decideRandomTarget();
    } else {
        action.setTarget(targetIndex);
    }
    this._actions.push(action);
};

Game_Battler.prototype.consumeItem = function(item) {
    $gameParty.consumeItem(item);
};

Game_Battler.prototype.gainHp = function(value) {
    this._result.hpDamage = -value;
    this._result.hpAffected = true;
    this.setHp(this.hp + value);
};

Game_Battler.prototype.gainMp = function(value) {
    this._result.mpDamage = -value;
    this.setMp(this.mp + value);
};

Game_Battler.prototype.gainTp = function(value) {
    this._result.tpDamage = -value;
    this.setTp(this.tp + value);
};

Game_Battler.prototype.gainSilentTp = function(value) {
    this.setTp(this.tp + value);
};

Game_Battler.prototype.initTp = function() {
    this.setTp(Math.randomInt(25));
};

Game_Battler.prototype.clearTp = function() {
    this.setTp(0);
};

Game_Battler.prototype.chargeTpByDamage = function(damageRate) {
    var value = Math.floor(50 * damageRate * this.tcr);
    this.gainSilentTp(value);
};

Game_Battler.prototype.maxSlipDamage = function() {
    return $dataSystem.optSlipDeath ? this.hp : Math.max(this.hp - 1, 0);
};

Game_Battler.prototype.regenerateAll = function() {
    if (this.isAlive()) {
        this.regenerateHp();
        this.regenerateMp();
        this.regenerateTp();
    }
};

Game_Battler.prototype.onAllActionsEnd = function() {
    this.clearResult();
    this.removeStatesAuto(1);
    this.removeBuffsAuto();
};

Game_Battler.prototype.onBattleEnd = function() {
    this.clearResult();
    this.removeBattleStates();
    this.removeAllBuffs();
    this.clearActions();
    if (!this.isPreserveTp()) {
        this.clearTp();
    }
    this.appear();
};

Game_Battler.prototype.onDamage = function(value) {
    this.removeStatesByDamage();
    this.chargeTpByDamage(value / this.mhp);
};

Game_Battler.prototype.setActionState = function(actionState) {
    this._actionState = actionState;
    this.requestMotionRefresh();
};

Game_Battler.prototype.isUndecided = function() {
    return this._actionState === 'undecided';
};

Game_Battler.prototype.isInputting = function() {
    return this._actionState === 'inputting';
};

Game_Battler.prototype.isWaiting = function() {
    return this._actionState === 'waiting';
};

Game_Battler.prototype.isActing = function() {
    return this._actionState === 'acting';
};

Game_Battler.prototype.performActionEnd = function() {
    this.setActionState('done');
};

Game_Battler.prototype.performDamage = function() {
};

Game_Battler.prototype.performMiss = function() {
    SoundManager.playMiss();
};

Game_Battler.prototype.performRecovery = function() {
    SoundManager.playRecovery();
};

Game_Battler.prototype.performEvasion = function() {
    SoundManager.playEvasion();
};

Game_Battler.prototype.performMagicEvasion = function() {
    SoundManager.playMagicEvasion();
};

Game_Battler.prototype.performCounter = function() {
    SoundManager.playEvasion();
};

Game_Battler.prototype.performReflection = function() {
    SoundManager.playReflection();
};

Game_Battler.prototype.performSubstitute = function(target) {
};

Game_Battler.prototype.performCollapse = function() {
};

//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.

Game_Actor.prototype = Object.create(Game_Battler.prototype);
Game_Actor.prototype.constructor = Game_Actor;

Object.defineProperty(Game_Actor.prototype, 'level', {
    get: function() {
        return this._level;
    },
    configurable: true
});

Game_Actor.prototype.initialize = function(actorId) {
    Game_Battler.prototype.initialize.call(this);
    this.setup(actorId);
};

Game_Actor.prototype.initMembers = function() {
    Game_Battler.prototype.initMembers.call(this);
    this._actorId = 0;
    this._name = '';
    this._nickname = '';
    this._classId = 0;
    this._level = 0;
    this._characterName = '';
    this._characterIndex = 0;
    this._faceName = '';
    this._faceIndex = 0;
    this._battlerName = '';
    this._exp = {};
    this._skills = [];
    this._equips = [];
    this._actionInputIndex = 0;
    this._lastMenuSkill = new Game_Item();
    this._lastBattleSkill  = new Game_Item();
    this._lastCommandSymbol = '';
};

Game_Actor.prototype.actorId = function() {
    return this._actorId;
};

Game_Actor.prototype.name = function() {
    return this._name;
};

Game_Actor.prototype.setName = function(name) {
    this._name = name;
};

Game_Actor.prototype.nickname = function() {
    return this._nickname;
};

Game_Actor.prototype.setNickname = function(nickname) {
    this._nickname = nickname;
};

Game_Actor.prototype.profile = function() {
    return this._profile;
};

Game_Actor.prototype.setProfile = function(profile) {
    this._profile = profile;
};

Game_Actor.prototype.characterIndex = function() {
    return this._characterIndex;
};

Game_Actor.prototype.battlerName = function() {
    return this._battlerName;
};

Game_Actor.prototype.resetStateCounts = function(stateId) {
    Game_Battler.prototype.resetStateCounts.call(this, stateId);
    this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove;
};

Game_Actor.prototype.initImages = function() {
    var actor = this.actor();
    this._characterName = actor.characterName;
    this._characterIndex = actor.characterIndex;
    this._faceName = actor.faceName;
    this._faceIndex = actor.faceIndex;
    this._battlerName = actor.battlerName;
};

Game_Actor.prototype.initExp = function() {
    this._exp[this._classId] = this.currentLevelExp();
};

Game_Actor.prototype.currentExp = function() {
    return this._exp[this._classId];
};

Game_Actor.prototype.currentLevelExp = function() {
    return this.expForLevel(this._level);
};

Game_Actor.prototype.nextLevelExp = function() {
    return this.expForLevel(this._level + 1);
};

Game_Actor.prototype.nextRequiredExp = function() {
    return this.nextLevelExp() - this.currentExp();
};

Game_Actor.prototype.maxLevel = function() {
    return this.actor().maxLevel;
};

Game_Actor.prototype.isMaxLevel = function() {
    return this._level >= this.maxLevel();
};

Game_Actor.prototype.initSkills = function() {
    this._skills = [];
    this.currentClass().learnings.forEach(function(learning) {
        if (learning.level <= this._level) {
            this.learnSkill(learning.skillId);
        }
    }, this);
};

Game_Actor.prototype.tradeItemWithParty = function(newItem, oldItem) {
    if (newItem && !$gameParty.hasItem(newItem)) {
        return false;
    } else {
        $gameParty.gainItem(oldItem, 1);
        $gameParty.loseItem(newItem, 1);
        return true;
    }
};

Game_Actor.prototype.bestEquipItem = function(slotId) {
    var etypeId = this.equipSlots()[slotId];
    var items = $gameParty.equipItems().filter(function(item) {
        return item.etypeId === etypeId && this.canEquip(item);
    }, this);
    var bestItem = null;
    var bestPerformance = -1000;
    for (var i = 0; i < items.length; i++) {
        var performance = this.calcEquipItemPerformance(items[i]);
        if (performance > bestPerformance) {
            bestPerformance = performance;
            bestItem = items[i];
        }
    }
    return bestItem;
};

Game_Actor.prototype.calcEquipItemPerformance = function(item) {
    return item.params.reduce(function(a, b) {
        return a + b;
    });
};

Game_Actor.prototype.isSkillWtypeOk = function(skill) {
    var wtypeId1 = skill.requiredWtypeId1;
    var wtypeId2 = skill.requiredWtypeId2;
    if ((wtypeId1 === 0 && wtypeId2 === 0) ||
            (wtypeId1 > 0 && this.isWtypeEquipped(wtypeId1)) ||
            (wtypeId2 > 0 && this.isWtypeEquipped(wtypeId2))) {
        return true;
    } else {
        return false;
    }
};

Game_Actor.prototype.isWtypeEquipped = function(wtypeId) {
    return this.weapons().some(function(weapon) {
        return weapon.wtypeId === wtypeId;
    });
};

Game_Actor.prototype.isActor = function() {
    return true;
};

Game_Actor.prototype.friendsUnit = function() {
    return $gameParty;
};

Game_Actor.prototype.opponentsUnit = function() {
    return $gameTroop;
};

// index
// isBattleMember

Game_Actor.prototype.isFormationChangeOk = function() {
    return true;
};

Game_Actor.prototype.currentClass = function() {
    return $dataClasses[this._classId];
};

Game_Actor.prototype.isClass = function(gameClass) {
    return gameClass && this._classId === gameClass.id;
};

Game_Actor.prototype.usableSkills = function() {
    return this.skills().filter(function(skill) {
        return this.canUse(skill);
    }, this);
};

Game_Actor.prototype.hasNoWeapons = function() {
    return this.weapons().length === 0;
};

Game_Actor.prototype.paramBase = function(paramId) {
    return this.currentClass().params[paramId][this._level];
};

Game_Actor.prototype.attackAnimationId1 = function() {
    if (this.hasNoWeapons()) {
        return this.bareHandsAnimationId();
    } else {
        var weapons = this.weapons();
        return weapons[0] ? weapons[0].animationId : 0;
    }
};

Game_Actor.prototype.attackAnimationId2 = function() {
    var weapons = this.weapons();
    return weapons[1] ? weapons[1].animationId : 0;
};

Game_Actor.prototype.bareHandsAnimationId = function() {
    return 1;
};

Game_Actor.prototype.levelDown = function() {
    this._level--;
};

Game_Actor.prototype.gainExp = function(exp) {
    var newExp = this.currentExp() + Math.round(exp * this.finalExpRate());
    this.changeExp(newExp, this.shouldDisplayLevelUp());
};

Game_Actor.prototype.finalExpRate = function() {
    return this.exr * (this.isBattleMember() ? 1 : this.benchMembersExpRate());
};

Game_Actor.prototype.benchMembersExpRate = function() {
    return $dataSystem.optExtraExp ? 1 : 0;
};

Game_Actor.prototype.setCharacterImage = function(characterName, characterIndex) {
    this._characterName = characterName;
    this._characterIndex = characterIndex;
};

Game_Actor.prototype.setFaceImage = function(faceName, faceIndex) {
    this._faceName = faceName;
    this._faceIndex = faceIndex;
};

Game_Actor.prototype.setBattlerImage = function(battlerName) {
    this._battlerName = battlerName;
};

Game_Actor.prototype.isSpriteVisible = function() {
    return $gameSystem.isSideView();
};

Game_Actor.prototype.startAnimation = function(animationId, mirror, delay) {
    mirror = !mirror;
    Game_Battler.prototype.startAnimation.call(this, animationId, mirror, delay);
};

Game_Actor.prototype.performActionStart = function(action) {
    Game_Battler.prototype.performActionStart.call(this, action);
};

Game_Actor.prototype.performActionEnd = function() {
    Game_Battler.prototype.performActionEnd.call(this);
};

Game_Actor.prototype.performDamage = function() {
    Game_Battler.prototype.performDamage.call(this);
    if (this.isSpriteVisible()) {
        this.requestMotion('damage');
    } else {
        $gameScreen.startShake(5, 5, 10);
    }
    SoundManager.playActorDamage();
};

Game_Actor.prototype.performEvasion = function() {
    Game_Battler.prototype.performEvasion.call(this);
    this.requestMotion('evade');
};

Game_Actor.prototype.performMagicEvasion = function() {
    Game_Battler.prototype.performMagicEvasion.call(this);
    this.requestMotion('evade');
};

Game_Actor.prototype.performCounter = function() {
    Game_Battler.prototype.performCounter.call(this);
    this.performAttack();
};

Game_Actor.prototype.performCollapse = function() {
    Game_Battler.prototype.performCollapse.call(this);
    if ($gameParty.inBattle()) {
        SoundManager.playActorCollapse();
    }
};

Game_Actor.prototype.performVictory = function() {
    if (this.canMove()) {
        this.requestMotion('victory');
    }
};

Game_Actor.prototype.performEscape = function() {
    if (this.canMove()) {
        this.requestMotion('escape');
    }
};

Game_Actor.prototype.makeActionList = function() {
    var list = [];
    var action = new Game_Action(this);
    action.setAttack();
    list.push(action);
    this.usableSkills().forEach(function(skill) {
        action = new Game_Action(this);
        action.setSkill(skill.id);
        list.push(action);
    }, this);
    return list;
};

Game_Actor.prototype.makeAutoBattleActions = function() {
    for (var i = 0; i < this.numActions(); i++) {
        var list = this.makeActionList();
        var maxValue = Number.MIN_VALUE;
        for (var j = 0; j < list.length; j++) {
            var value = list[j].evaluate();
            if (value > maxValue) {
                maxValue = value;
                this.setAction(i, list[j]);
            }
        }
    }
    this.setActionState('waiting');
};

Game_Actor.prototype.makeConfusionActions = function() {
    for (var i = 0; i < this.numActions(); i++) {
        this.action(i).setConfusion();
    }
    this.setActionState('waiting');
};

Game_Actor.prototype.makeActions = function() {
    Game_Battler.prototype.makeActions.call(this);
    if (this.numActions() > 0) {
        this.setActionState('undecided');
    } else {
        this.setActionState('waiting');
    }
    if (this.isAutoBattle()) {
        this.makeAutoBattleActions();
    } else if (this.isConfused()) {
        this.makeConfusionActions();
    }
};

Game_Actor.prototype.turnEndOnMap = function() {
    if ($gameParty.steps() % this.stepsForTurn() === 0) {
        this.onTurnEnd();
        if (this.result().hpDamage > 0) {
            this.performMapDamage();
        }
    }
};

Game_Actor.prototype.checkFloorEffect = function() {
    if ($gamePlayer.isOnDamageFloor()) {
        this.executeFloorDamage();
    }
};

Game_Actor.prototype.executeFloorDamage = function() {
    var damage = Math.floor(this.basicFloorDamage() * this.fdr);
    damage = Math.min(damage, this.maxFloorDamage());
    this.gainHp(-damage);
    if (damage > 0) {
        this.performMapDamage();
    }
};

Game_Actor.prototype.basicFloorDamage = function() {
    return 10;
};

Game_Actor.prototype.maxFloorDamage = function() {
    return $dataSystem.optFloorDeath ? this.hp : Math.max(this.hp - 1, 0);
};

Game_Actor.prototype.performMapDamage = function() {
    if (!$gameParty.inBattle()) {
        $gameScreen.startFlashForDamage();
    }
};

Game_Actor.prototype.clearActions = function() {
    Game_Battler.prototype.clearActions.call(this);
    this._actionInputIndex = 0;
};

Game_Actor.prototype.inputtingAction = function() {
    return this.action(this._actionInputIndex);
};

Game_Actor.prototype.selectNextCommand = function() {
    if (this._actionInputIndex < this.numActions() - 1) {
        this._actionInputIndex++;
        return true;
    } else {
        return false;
    }
};

Game_Actor.prototype.selectPreviousCommand = function() {
    if (this._actionInputIndex > 0) {
        this._actionInputIndex--;
        return true;
    } else {
        return false;
    }
};

Game_Actor.prototype.lastMenuSkill = function() {
    return this._lastMenuSkill.object();
};

Game_Actor.prototype.setLastMenuSkill = function(skill) {
    this._lastMenuSkill.setObject(skill);
};

Game_Actor.prototype.lastBattleSkill = function() {
    return this._lastBattleSkill.object();
};

Game_Actor.prototype.setLastBattleSkill = function(skill) {
    this._lastBattleSkill.setObject(skill);
};

Game_Actor.prototype.lastCommandSymbol = function() {
    return this._lastCommandSymbol;
};

Game_Actor.prototype.setLastCommandSymbol = function(symbol) {
    this._lastCommandSymbol = symbol;
};

Game_Actor.prototype.testEscape = function(item) {
    return item.effects.some(function(effect, index, ar) {
        return effect && effect.code === Game_Action.EFFECT_SPECIAL;
    });
};

Game_Actor.prototype.meetsUsableItemConditions = function(item) {
    if ($gameParty.inBattle() && !BattleManager.canEscape() && this.testEscape(item)) {
        return false;
    }
    return Game_BattlerBase.prototype.meetsUsableItemConditions.call(this, item);
};

//-----------------------------------------------------------------------------
// Game_Enemy
//
// The game object class for an enemy.

Game_Enemy.prototype = Object.create(Game_Battler.prototype);
Game_Enemy.prototype.constructor = Game_Enemy;

Game_Enemy.prototype.initialize = function(enemyId, x, y) {
    Game_Battler.prototype.initialize.call(this);
    this.setup(enemyId, x, y);
};

Game_Enemy.prototype.initMembers = function() {
    Game_Battler.prototype.initMembers.call(this);
    this._enemyId = 0;
    this._letter = '';
    this._plural = false;
    this._screenX = 0;
    this._screenY = 0;
};

Game_Enemy.prototype.setup = function(enemyId, x, y) {
    this._enemyId = enemyId;
    this._screenX = x;
    this._screenY = y;
    this.recoverAll();
};

Game_Enemy.prototype.isEnemy = function() {
    return true;
};

Game_Enemy.prototype.friendsUnit = function() {
    return $gameTroop;
};

Game_Enemy.prototype.opponentsUnit = function() {
    return $gameParty;
};

Game_Enemy.prototype.index = function() {
    return $gameTroop.members().indexOf(this);
};

Game_Enemy.prototype.isBattleMember = function() {
    return this.index() >= 0;
};

Game_Enemy.prototype.enemyId = function() {
    return this._enemyId;
};

Game_Enemy.prototype.enemy = function() {
    return $dataEnemies[this._enemyId];
};

Game_Enemy.prototype.paramBase = function(paramId) {
    return this.enemy().params[paramId];
};

Game_Enemy.prototype.exp = function() {
    return this.enemy().exp;
};

Game_Enemy.prototype.gold = function() {
    return this.enemy().gold;
};

Game_Enemy.prototype.dropItemRate = function() {
    return $gameParty.hasDropItemDouble() ? 2 : 1;
};

Game_Enemy.prototype.isSpriteVisible = function() {
    return true;
};

Game_Enemy.prototype.screenX = function() {
    return this._screenX;
};

Game_Enemy.prototype.screenY = function() {
    return this._screenY;
};

Game_Enemy.prototype.battlerName = function() {
    return this.enemy().battlerName;
};

Game_Enemy.prototype.battlerHue = function() {
    return this.enemy().battlerHue;
};

Game_Enemy.prototype.originalName = function() {
    return this.enemy().name;
};

Game_Enemy.prototype.name = function() {
    return this.originalName() + (this._plural ? this._letter : '');
};

Game_Enemy.prototype.isLetterEmpty = function() {
    return this._letter === '';
};

Game_Enemy.prototype.setLetter = function(letter) {
    this._letter = letter;
};

Game_Enemy.prototype.setPlural = function(plural) {
    this._plural = plural;
};

Game_Enemy.prototype.performActionStart = function(action) {
    Game_Battler.prototype.performActionStart.call(this, action);
    this.requestEffect('whiten');
};

Game_Enemy.prototype.performAction = function(action) {
    Game_Battler.prototype.performAction.call(this, action);
};

Game_Enemy.prototype.performActionEnd = function() {
    Game_Battler.prototype.performActionEnd.call(this);
};

Game_Enemy.prototype.performCollapse = function() {
    Game_Battler.prototype.performCollapse.call(this);
    switch (this.collapseType()) {
    case 0:
        this.requestEffect('collapse');
        SoundManager.playEnemyCollapse();
        break;
    case 1:
        this.requestEffect('bossCollapse');
        SoundManager.playBossCollapse1();
        break;
    case 2:
        this.requestEffect('instantCollapse');
        break;
    }
};

Game_Enemy.prototype.transform = function(enemyId) {
    var name = this.originalName();
    this._enemyId = enemyId;
    if (this.originalName() !== name) {
        this._letter = '';
        this._plural = false;
    }
    this.refresh();
    if (this.numActions() > 0) {
        this.makeActions();
    }
};

Game_Enemy.prototype.meetsCondition = function(action) {
    var param1 = action.conditionParam1;
    var param2 = action.conditionParam2;
    switch (action.conditionType) {
    case 1:
        return this.meetsTurnCondition(param1, param2);
    case 2:
        return this.meetsHpCondition(param1, param2);
    case 3:
        return this.meetsMpCondition(param1, param2);
    case 4:
        return this.meetsStateCondition(param1);
    case 5:
        return this.meetsPartyLevelCondition(param1);
    case 6:
        return this.meetsSwitchCondition(param1);
    default:
        return true;
    }
};

Game_Enemy.prototype.meetsTurnCondition = function(param1, param2) {
    var n = $gameTroop.turnCount();
    if (param2 === 0) {
        return n === param1;
    } else {
        return n > 0 && n >= param1 && n % param2 === param1 % param2;
    }
};

Game_Enemy.prototype.meetsHpCondition = function(param1, param2) {
    return this.hpRate() >= param1 && this.hpRate() <= param2;
};

Game_Enemy.prototype.meetsMpCondition = function(param1, param2) {
    return this.mpRate() >= param1 && this.mpRate() <= param2;
};

Game_Enemy.prototype.meetsStateCondition = function(param) {
    return this.isStateAffected(param);
};

Game_Enemy.prototype.meetsPartyLevelCondition = function(param) {
    return $gameParty.highestLevel() >= param;
};

Game_Enemy.prototype.meetsSwitchCondition = function(param) {
    return $gameSwitches.value(param);
};

Game_Enemy.prototype.isActionValid = function(action) {
    return this.meetsCondition(action) && this.canUse($dataSkills[action.skillId]);
};

Game_Enemy.prototype.selectAction = function(actionList, ratingZero) {
    var sum = actionList.reduce(function(r, a) {
        return r + a.rating - ratingZero;
    }, 0);
    if (sum > 0) {
        var value = Math.randomInt(sum);
        for (var i = 0; i < actionList.length; i++) {
            var action = actionList[i];
            value -= action.rating - ratingZero;
            if (value < 0) {
                return action;
            }
        }
    } else {
        return null;
    }
};

Game_Enemy.prototype.selectAllActions = function(actionList) {
    var ratingMax = Math.max.apply(null, actionList.map(function(a) {
        return a.rating;
    }));
    var ratingZero = ratingMax - 3;
    actionList = actionList.filter(function(a) {
        return a.rating > ratingZero;
    });
    for (var i = 0; i < this.numActions(); i++) {
        this.action(i).setEnemyAction(this.selectAction(actionList, ratingZero));
    }
};

Game_Enemy.prototype.makeActions = function() {
    Game_Battler.prototype.makeActions.call(this);
    if (this.numActions() > 0) {
        var actionList = this.enemy().actions.filter(function(a) {
            return this.isActionValid(a);
        }, this);
        if (actionList.length > 0) {
            this.selectAllActions(actionList);
        }
    }
    this.setActionState('waiting');
};

//-----------------------------------------------------------------------------
// Game_Actors
//
// The wrapper class for an actor array.

Game_Actors.prototype.initialize = function() {
    this._data = [];
};

//-----------------------------------------------------------------------------
// Game_Unit
//
// The superclass of Game_Party and Game_Troop.

Game_Unit.prototype.initialize = function() {
    this._inBattle = false;
};

Game_Unit.prototype.inBattle = function() {
    return this._inBattle;
};

Game_Unit.prototype.members = function() {
    return [];
};

Game_Unit.prototype.aliveMembers = function() {
    return this.members().filter(function(member) {
        return member.isAlive();
    });
};

Game_Unit.prototype.deadMembers = function() {
    return this.members().filter(function(member) {
        return member.isDead();
    });
};

Game_Unit.prototype.movableMembers = function() {
    return this.members().filter(function(member) {
        return member.canMove();
    });
};

Game_Unit.prototype.clearActions = function() {
    return this.members().forEach(function(member) {
        return member.clearActions();
    });
};

Game_Unit.prototype.agility = function() {
    var members = this.members();
    if (members.length === 0) {
        return 1;
    }
    var sum = members.reduce(function(r, member) {
        return r + member.agi;
    }, 0);
    return sum / members.length;
};

Game_Unit.prototype.tgrSum = function() {
    return this.aliveMembers().reduce(function(r, member) {
        return r + member.tgr;
    }, 0);
};

Game_Unit.prototype.randomDeadTarget = function() {
    var members = this.deadMembers();
    if (members.length === 0) {
        return null;
    }
    return members[Math.floor(Math.random() * members.length)];
};

Game_Unit.prototype.clearResults = function() {
    this.members().forEach(function(member) {
        member.clearResult();
    });
};

Game_Unit.prototype.onBattleStart = function() {
    this.members().forEach(function(member) {
        member.onBattleStart();
    });
    this._inBattle = true;
};

Game_Unit.prototype.onBattleEnd = function() {
    this._inBattle = false;
    this.members().forEach(function(member) {
        member.onBattleEnd();
    });
};

Game_Unit.prototype.makeActions = function() {
    this.members().forEach(function(member) {
        member.makeActions();
    });
};

Game_Unit.prototype.select = function(activeMember) {
    this.members().forEach(function(member) {
        if (member === activeMember) {
            member.select();
        } else {
            member.deselect();
        }
    });
};

Game_Unit.prototype.substituteBattler = function() {
    var members = this.members();
    for (var i = 0; i < members.length; i++) {
        if (members[i].isSubstitute()) {
            return members[i];
        }
    }
};

//-----------------------------------------------------------------------------
// Game_Party
//
// The game object class for the party. Information such as gold and items is
// included.

Game_Party.prototype = Object.create(Game_Unit.prototype);
Game_Party.prototype.constructor = Game_Party;

Game_Party.ABILITY_ENCOUNTER_HALF    = 0;
Game_Party.ABILITY_ENCOUNTER_NONE    = 1;
Game_Party.ABILITY_CANCEL_SURPRISE   = 2;
Game_Party.ABILITY_RAISE_PREEMPTIVE  = 3;
Game_Party.ABILITY_GOLD_DOUBLE       = 4;
Game_Party.ABILITY_DROP_ITEM_DOUBLE  = 5;

Game_Party.prototype.initialize = function() {
    Game_Unit.prototype.initialize.call(this);
    this._gold = 0;
    this._steps = 0;
    this._lastItem = new Game_Item();
    this._menuActorId = 0;
    this._targetActorId = 0;
    this._actors = [];
    this.initAllItems();
};

Game_Party.prototype.size = function() {
    return this.members().length;
};

Game_Party.prototype.isEmpty = function() {
    return this.size() === 0;
};

Game_Party.prototype.members = function() {
    return this.inBattle() ? this.battleMembers() : this.allMembers();
};

Game_Party.prototype.reviveBattleMembers = function() {
    this.battleMembers().forEach(function(actor) {
        if (actor.isDead()) {
            actor.setHp(1);
        }
    });
};

Game_Party.prototype.equipItems = function() {
    return this.weapons().concat(this.armors());
};

Game_Party.prototype.allItems = function() {
    return this.items().concat(this.equipItems());
};

Game_Party.prototype.setupBattleTest = function() {
    this.setupBattleTestMembers();
    this.setupBattleTestItems();
};

Game_Party.prototype.setupBattleTestMembers = function() {
    $dataSystem.testBattlers.forEach(function(battler) {
        var actor = $gameActors.actor(battler.actorId);
        if (actor) {
            actor.changeLevel(battler.level, false);
            actor.initEquips(battler.equips);
            actor.recoverAll();
            this.addActor(battler.actorId);
        }
    }, this);
};

Game_Party.prototype.setupBattleTestItems = function() {
    $dataItems.forEach(function(item) {
        if (item && item.name.length > 0) {
            this.gainItem(item, this.maxItems(item));
        }
    }, this);
};

Game_Party.prototype.highestLevel = function() {
    return Math.max.apply(null, this.members().map(function(actor) {
        return actor.level;
    }));
};

Game_Party.prototype.gold = function() {
    return this._gold;
};

Game_Party.prototype.loseGold = function(amount) {
    this.gainGold(-amount);
};

Game_Party.prototype.steps = function() {
    return this._steps;
};

Game_Party.prototype.increaseSteps = function() {
    this._steps++;
};

Game_Party.prototype.numItems = function(item) {
    var container = this.itemContainer(item);
    return container ? container[item.id] || 0 : 0;
};

Game_Party.prototype.discardMembersEquip = function(item, amount) {
    var n = amount;
    this.members().forEach(function(actor) {
        while (n > 0 && actor.isEquipped(item)) {
            actor.discardEquip(item);
            n--;
        }
    });
};

Game_Party.prototype.loseItem = function(item, amount, includeEquip) {
    this.gainItem(item, -amount, includeEquip);
};

Game_Party.prototype.canUse = function(item) {
    return this.members().some(function(actor) {
        return actor.canUse(item);
    });
};

Game_Party.prototype.canInput = function() {
    return this.members().some(function(actor) {
        return actor.canInput();
    });
};

Game_Party.prototype.isAllDead = function() {
    if (Game_Unit.prototype.isAllDead.call(this)) {
        return this.inBattle() || !this.isEmpty();
    } else {
        return false;
    }
};

Game_Party.prototype.setMenuActor = function(actor) {
    this._menuActorId = actor.actorId();
};

Game_Party.prototype.lastItem = function() {
    return this._lastItem.object();
};

Game_Party.prototype.setLastItem = function(item) {
    this._lastItem.setObject(item);
};

Game_Party.prototype.partyAbility = function(abilityId) {
    return this.battleMembers().some(function(actor) {
        return actor.partyAbility(abilityId);
    });
};

Game_Party.prototype.hasEncounterHalf = function() {
    return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_HALF);
};

Game_Party.prototype.hasEncounterNone = function() {
    return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_NONE);
};

Game_Party.prototype.hasCancelSurprise = function() {
    return this.partyAbility(Game_Party.ABILITY_CANCEL_SURPRISE);
};

Game_Party.prototype.hasRaisePreemptive = function() {
    return this.partyAbility(Game_Party.ABILITY_RAISE_PREEMPTIVE);
};

Game_Party.prototype.hasGoldDouble = function() {
    return this.partyAbility(Game_Party.ABILITY_GOLD_DOUBLE);
};

Game_Party.prototype.hasDropItemDouble = function() {
    return this.partyAbility(Game_Party.ABILITY_DROP_ITEM_DOUBLE);
};

Game_Party.prototype.ratePreemptive = function(troopAgi) {
    var rate = this.agility() >= troopAgi ? 0.05 : 0.03;
    if (this.hasRaisePreemptive()) {
        rate *= 4;
    }
    return rate;
};

Game_Party.prototype.rateSurprise = function(troopAgi) {
    var rate = this.agility() >= troopAgi ? 0.03 : 0.05;
    if (this.hasCancelSurprise()) {
        rate = 0;
    }
    return rate;
};

Game_Party.prototype.performVictory = function() {
    this.members().forEach(function(actor) {
        actor.performVictory();
    });
};

Game_Party.prototype.performEscape = function() {
    this.members().forEach(function(actor) {
        actor.performEscape();
    });
};

Game_Party.prototype.removeBattleStates = function() {
    this.members().forEach(function(actor) {
        actor.removeBattleStates();
    });
};

Game_Party.prototype.requestMotionRefresh = function() {
    this.members().forEach(function(actor) {
        actor.requestMotionRefresh();
    });
};

//-----------------------------------------------------------------------------
// Game_Troop
//
// The game object class for a troop and the battle-related data.

Game_Troop.prototype = Object.create(Game_Unit.prototype);
Game_Troop.prototype.constructor = Game_Troop;

Game_Troop.LETTER_TABLE_HALF = [
    ' A',' B',' C',' D',' E',' F',' G',' H',' I',' J',' K',' L',' M',
    ' N',' O',' P',' Q',' R',' S',' T',' U',' V',' W',' X',' Y',' Z'
];
Game_Troop.LETTER_TABLE_FULL = [
    'Ａ','Ｂ','Ｃ','Ｄ','Ｅ','Ｆ','Ｇ','Ｈ','Ｉ','Ｊ','Ｋ','Ｌ','Ｍ',
    'Ｎ','Ｏ','Ｐ','Ｑ','Ｒ','Ｓ','Ｔ','Ｕ','Ｖ','Ｗ','Ｘ','Ｙ','Ｚ'
];

Game_Troop.prototype.initialize = function() {
    Game_Unit.prototype.initialize.call(this);
    this._interpreter = new Game_Interpreter();
    this.clear();
};

Game_Troop.prototype.isEventRunning = function() {
    return this._interpreter.isRunning();
};

Game_Troop.prototype.updateInterpreter = function() {
    this._interpreter.update();
};

Game_Troop.prototype.turnCount = function() {
    return this._turnCount;
};

Game_Troop.prototype.members = function() {
    return this._enemies;
};

Game_Troop.prototype.troop = function() {
    return $dataTroops[this._troopId];
};

Game_Troop.prototype.setup = function(troopId) {
    this.clear();
    this._troopId = troopId;
    this._enemies = [];
    this.troop().members.forEach(function(member) {
        if ($dataEnemies[member.enemyId]) {
            var enemyId = member.enemyId;
            var x = member.x;
            var y = member.y;
            var enemy = new Game_Enemy(enemyId, x, y);
            if (member.hidden) {
                enemy.hide();
            }
            this._enemies.push(enemy);
        }
    }, this);
    this.makeUniqueNames();
};

Game_Troop.prototype.makeUniqueNames = function() {
    var table = this.letterTable();
    this.members().forEach(function(enemy) {
        if (enemy.isAlive() && enemy.isLetterEmpty()) {
            var name = enemy.originalName();
            var n = this._namesCount[name] || 0;
            enemy.setLetter(table[n % table.length]);
            this._namesCount[name] = n + 1;
        }
    }, this);
    this.members().forEach(function(enemy) {
        var name = enemy.originalName();
        if (this._namesCount[name] >= 2) {
            enemy.setPlural(true);
        }
    }, this);
};

Game_Troop.prototype.letterTable = function() {
    return $gameSystem.isCJK() ? Game_Troop.LETTER_TABLE_FULL :
            Game_Troop.LETTER_TABLE_HALF;
};

Game_Troop.prototype.enemyNames = function() {
    var names = [];
    this.members().forEach(function(enemy) {
        var name = enemy.originalName();
        if (enemy.isAlive() && !names.contains(name)) {
            names.push(name);
        }
    });
    return names;
};

Game_Troop.prototype.meetsConditions = function(page) {
    var c = page.conditions;
    if (!c.turnEnding && !c.turnValid && !c.enemyValid &&
            !c.actorValid && !c.switchValid) {
        return false;  // Conditions not set
    }
    if (c.turnEnding) {
        if (!BattleManager.isTurnEnd()) {
            return false;
        }
    }
    if (c.turnValid) {
        var n = this._turnCount;
        var a = c.turnA;
        var b = c.turnB;
        if ((b === 0 && n !== a)) {
            return false;
        }
        if ((b > 0 && (n < 1 || n < a || n % b !== a % b))) {
            return false;
        }
    }
    if (c.enemyValid) {
        var enemy = $gameTroop.members()[c.enemyIndex];
        if (!enemy || enemy.hpRate() * 100 > c.enemyHp) {
            return false;
        }
    }
    if (c.actorValid) {
        var actor = $gameActors.actor(c.actorId);
        if (!actor || actor.hpRate() * 100 > c.actorHp) {
            return false;
        }
    }
    if (c.switchValid) {
        if (!$gameSwitches.value(c.switchId)) {
            return false;
        }
    }
    return true;
};

// setupBattleEvent

Game_Troop.prototype.increaseTurn = function() {
    var pages = this.troop().pages;
    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        if (page.span === 1) {
            this._eventFlags[i] = false;
        }
    }
    this._turnCount++;
};

Game_Troop.prototype.expTotal = function() {
    return this.deadMembers().reduce(function(r, enemy) {
        return r + enemy.exp();
    }, 0);
};

Game_Troop.prototype.goldTotal = function() {
    return this.deadMembers().reduce(function(r, enemy) {
        return r + enemy.gold();
    }, 0) * this.goldRate();
};

Game_Troop.prototype.goldRate = function() {
    return $gameParty.hasGoldDouble() ? 2 : 1;
};

Game_Troop.prototype.makeDropItems = function() {
    return this.deadMembers().reduce(function(r, enemy) {
        return r.concat(enemy.makeDropItems());
    }, []);
};

//-----------------------------------------------------------------------------
// Game_Map
//
// The game object class for a map. It contains scrolling and passage
// determination functions.

Game_Map.prototype.initialize = function() {
    this._interpreter = new Game_Interpreter();
    this._mapId = 0;
    this._tilesetId = 0;
    this._events = [];
    this._commonEvents = [];
    this._vehicles = [];
    this._displayX = 0;
    this._displayY = 0;
    this._nameDisplay = true;
    this._scrollDirection = 2;
    this._scrollRest = 0;
    this._scrollSpeed = 4;
    this._parallaxName = '';
    this._parallaxZero = false;
    this._parallaxLoopX = false;
    this._parallaxLoopY = false;
    this._parallaxSx = 0;
    this._parallaxSy = 0;
    this._parallaxX = 0;
    this._parallaxY = 0;
    this._battleback1Name = null;
    this._battleback2Name = null;
    this.createVehicles();
};

Game_Map.prototype.setup = function(mapId) {
    if (!$dataMap) {
        throw new Error('The map data is not available');
    }
    this._mapId = mapId;
    this._tilesetId = $dataMap.tilesetId;
    this._displayX = 0;
    this._displayY = 0;
    this.refereshVehicles();
    this.setupEvents();
    this.setupScroll();
    this.setupParallax();
    this.setupBattleback();
    this._needsRefresh = false;
};

Game_Map.prototype.isEventRunning = function() {
    return this._interpreter.isRunning() || this.isAnyEventStarting();
};

Game_Map.prototype.tileWidth = function() {
    return 48;
};

Game_Map.prototype.tileHeight = function() {
    return 48;
};

Game_Map.prototype.mapId = function() {
    return this._mapId;
};

Game_Map.prototype.tilesetId = function() {
    return this._tilesetId;
};

Game_Map.prototype.displayX = function() {
    return this._displayX;
};

Game_Map.prototype.displayY = function() {
    return this._displayY;
};

Game_Map.prototype.parallaxName = function() {
    return this._parallaxName;
};

Game_Map.prototype.battleback1Name = function() {
    return this._battleback1Name;
};

Game_Map.prototype.battleback2Name = function() {
    return this._battleback2Name;
};

Game_Map.prototype.requestRefresh = function(mapId) {
    this._needsRefresh = true;
};

Game_Map.prototype.isNameDisplayEnabled = function() {
    return this._nameDisplay;
};

Game_Map.prototype.disableNameDisplay = function() {
    this._nameDisplay = false;
};

Game_Map.prototype.enableNameDisplay = function() {
    this._nameDisplay = true;
};

Game_Map.prototype.createVehicles = function() {
    this._vehicles = [];
    this._vehicles[0] = new Game_Vehicle('boat');
    this._vehicles[1] = new Game_Vehicle('ship');
    this._vehicles[2] = new Game_Vehicle('airship');
};

Game_Map.prototype.refereshVehicles = function() {
    this._vehicles.forEach(function(vehicle) {
        vehicle.refresh();
    });
};

Game_Map.prototype.vehicles = function() {
    return this._vehicles;
};

Game_Map.prototype.vehicle = function(type) {
    if (type ===  0 || type === 'boat') {
        return this.boat();
    } else if (type ===  1 || type === 'ship') {
        return this.ship();
    } else if (type ===  2 || type === 'airship') {
        return this.airship();
    } else {
        return null;
    }
};

Game_Map.prototype.boat = function() {
    return this._vehicles[0];
};

Game_Map.prototype.ship = function() {
    return this._vehicles[1];
};

Game_Map.prototype.airship = function() {
    return this._vehicles[2];
};

Game_Map.prototype.event = function(eventId) {
    return this._events[eventId];
};

Game_Map.prototype.eraseEvent = function(eventId) {
    this._events[eventId].erase();
};

Game_Map.prototype.parallelCommonEvents = function() {
    return $dataCommonEvents.filter(function(commonEvent) {
        return commonEvent && commonEvent.trigger === 2;
    });
};

Game_Map.prototype.setupScroll = function() {
    this._scrollDirection = 2;
    this._scrollRest = 0;
    this._scrollSpeed = 4;
};

Game_Map.prototype.setupParallax = function() {
    this._parallaxName = $dataMap.parallaxName || '';
    this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
    this._parallaxLoopX = $dataMap.parallaxLoopX;
    this._parallaxLoopY = $dataMap.parallaxLoopY;
    this._parallaxSx = $dataMap.parallaxSx;
    this._parallaxSy = $dataMap.parallaxSy;
    this._parallaxX = 0;
    this._parallaxY = 0;
};

Game_Map.prototype.setupBattleback = function() {
    if ($dataMap.specifyBattleback) {
        this._battleback1Name = $dataMap.battleback1Name;
        this._battleback2Name = $dataMap.battleback2Name;
    } else {
        this._battleback1Name = null;
        this._battleback2Name = null;
    }
};

Game_Map.prototype.tileset = function() {
    return $dataTilesets[this._tilesetId];
};

Game_Map.prototype.displayName = function() {
    return $dataMap.displayName;
};

Game_Map.prototype.width = function() {
    return $dataMap.width;
};

Game_Map.prototype.height = function() {
    return $dataMap.height;
};

Game_Map.prototype.data = function() {
    return $dataMap.data;
};

Game_Map.prototype.isDashDisabled = function() {
    return $dataMap.disableDashing;
};

Game_Map.prototype.encounterList = function() {
    return $dataMap.encounterList;
};

Game_Map.prototype.encounterStep = function() {
    return $dataMap.encounterStep;
};

Game_Map.prototype.isOverworld = function() {
    return this.tileset() && this.tileset().mode === 0;
};

Game_Map.prototype.roundX = function(x) {
    return this.isLoopHorizontal() ? x.mod(this.width()) : x;
};

Game_Map.prototype.roundY = function(y) {
    return this.isLoopVertical() ? y.mod(this.height()) : y;
};

Game_Map.prototype.xWithDirection = function(x, d) {
    return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
};

Game_Map.prototype.yWithDirection = function(y, d) {
    return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
};

Game_Map.prototype.roundXWithDirection = function(x, d) {
    return this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
};

Game_Map.prototype.roundYWithDirection = function(y, d) {
    return this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
};

Game_Map.prototype.distance = function(x1, y1, x2, y2) {
    return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
};

Game_Map.prototype.autoplay = function() {
    if ($dataMap.autoplayBgm) {
        if ($gamePlayer.isInVehicle()) {
            $gameSystem.saveWalkingBgm2();
        } else {
            AudioManager.playBgm($dataMap.bgm);
        }
    }
    if ($dataMap.autoplayBgs) {
        AudioManager.playBgs($dataMap.bgs);
    }
};

Game_Map.prototype.refreshIfNeeded = function() {
    if (this._needsRefresh) {
        this.refresh();
    }
};

Game_Map.prototype.refresh = function() {
    this.events().forEach(function(event) {
        event.refresh();
    });
    this._commonEvents.forEach(function(event) {
        event.refresh();
    });
    this.refreshTileEvents();
    this._needsRefresh = false;
};

Game_Map.prototype.refreshTileEvents = function() {
    this.tileEvents = this.events().filter(function(event) {
        return event.isTile();
    });
};

Game_Map.prototype.tileEventsXy = function(x, y) {
    return this.tileEvents.filter(function(event) {
        return event.posNt(x, y);
    });
};

Game_Map.prototype.eventIdXy = function(x, y) {
    var list = this.eventsXy(x, y);
    return list.length === 0 ? 0 : list[0].eventId();
};

Game_Map.prototype.isValid = function(x, y) {
    return x >= 0 && x < this.width() && y >= 0 && y < this.height();
};

Game_Map.prototype.tileId = function(x, y, z) {
    var width = $dataMap.width;
    var height = $dataMap.height;
    return $dataMap.data[(z * height + y) * width + x] || 0;
};

Game_Map.prototype.autotileType = function(x, y, z) {
    var tileId = this.tileId(x, y, z);
    return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
};

Game_Map.prototype.isBoatPassable = function(x, y) {
    return this.checkPassage(x, y, 0x0200);
};

Game_Map.prototype.isShipPassable = function(x, y) {
    return this.checkPassage(x, y, 0x0400);
};

Game_Map.prototype.isAirshipLandOk = function(x, y) {
    return this.checkPassage(x, y, 0x0800) && this.checkPassage(x, y, 0x0f);
};

Game_Map.prototype.checkLayeredTilesFlags = function(x, y, bit) {
    var flags = this.tilesetFlags();
    return this.layeredTiles(x, y).some(function(tileId) {
        return (flags[tileId] & bit) !== 0;
    });
};

Game_Map.prototype.isLadder = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x20);
};

Game_Map.prototype.isBush = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40);
};

Game_Map.prototype.isCounter = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x80);
};

Game_Map.prototype.isDamageFloor = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x100);
};

Game_Map.prototype.terrainTag = function(x, y) {
    if (this.isValid(x, y)) {
        var flags = this.tilesetFlags();
        var tiles = this.layeredTiles(x, y);
        for (var i = 0; i < tiles.length; i++) {
            var tag = flags[tiles[i]] >> 12;
            if (tag > 0) {
                return tag;
            }
        }
    }
    return 0;
};

Game_Map.prototype.regionId = function(x, y) {
    return this.isValid(x, y) ? this.tileId(x, y, 5) : 0;
};

Game_Map.prototype.startScroll = function(direction, distance, speed) {
    this._scrollDirection = direction;
    this._scrollRest = distance;
    this._scrollSpeed = speed;
};

Game_Map.prototype.isScrolling = function() {
    return this._scrollRest > 0;
};

// update

Game_Map.prototype.updateScroll = function() {
    if (this.isScrolling()) {
        var lastX = this._displayX;
        var lastY = this._displayY;
        this.doScroll(this._scrollDirection, this.scrollDistance());
        if (this._displayX === lastX && this._displayY === lastY) {
            this._scrollRest = 0;
        } else {
            this._scrollRest -= this.scrollDistance();
        }
    }
};

Game_Map.prototype.scrollDistance = function() {
    return Math.pow(2, this._scrollSpeed) / 256;
};

Game_Map.prototype.doScroll = function(direction, distance) {
    switch (direction) {
    case 2:
        this.scrollDown(distance);
        break;
    case 4:
        this.scrollLeft(distance);
        break;
    case 6:
        this.scrollRight(distance);
        break;
    case 8:
        this.scrollUp(distance);
        break;
    }
};

Game_Map.prototype.updateVehicles = function() {
    this._vehicles.forEach(function(vehicle) {
        vehicle.update();
    });
};

Game_Map.prototype.changeTileset = function(tilesetId) {
    this._tilesetId = tilesetId;
    this.refresh();
};

Game_Map.prototype.changeBattleback = function(battleback1Name, battleback2Name) {
    this._battleback1Name = battleback1Name;
    this._battleback2Name = battleback2Name;
};

Game_Map.prototype.changeParallax = function(name, loopX, loopY, sx, sy) {
    this._parallaxName = name;
    this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
    if (this._parallaxLoopX && !loopX) {
        this._parallaxX = 0;
    }
    if (this._parallaxLoopY && !loopY) {
        this._parallaxY = 0;
    }
    this._parallaxLoopX = loopX;
    this._parallaxLoopY = loopY;
    this._parallaxSx = sx;
    this._parallaxSy = sy;
};

Game_Map.prototype.unlockEvent = function(eventId) {
    if (this._events[eventId]) {
        this._events[eventId].unlock();
    }
};

Game_Map.prototype.setupStartingEvent = function() {
    this.refreshIfNeeded();
    if (this._interpreter.setupReservedCommonEvent()) {
        return true;
    }
    if (this.setupTestEvent()) {
        return true;
    }
    if (this.setupStartingMapEvent()) {
        return true;
    }
    if (this.setupAutorunCommonEvent()) {
        return true;
    }
    return false;
};

Game_Map.prototype.setupTestEvent = function() {
    if ($testEvent) {
        this._interpreter.setup($testEvent, 0);
        $testEvent = null;
        return true;
    }
    return false;
};

Game_Map.prototype.setupAutorunCommonEvent = function() {
    for (var i = 0; i < $dataCommonEvents.length; i++) {
        var event = $dataCommonEvents[i];
        if (event && event.trigger === 1 && $gameSwitches.value(event.switchId)) {
            this._interpreter.setup(event.list);
            return true;
        }
    }
    return false;
};

//-----------------------------------------------------------------------------
// Game_CommonEvent
//
// The game object class for a common event. It contains functionality for
// running parallel process events.

Game_CommonEvent.prototype.initialize = function(commonEventId) {
    this._commonEventId = commonEventId;
    this.refresh();
};

Game_CommonEvent.prototype.event = function() {
    return $dataCommonEvents[this._commonEventId];
};

Game_CommonEvent.prototype.list = function() {
    return this.event().list;
};

Game_CommonEvent.prototype.refresh = function() {
    if (this.isActive()) {
        if (!this._interpreter) {
            this._interpreter = new Game_Interpreter();
        }
    } else {
        this._interpreter = null;
    }
};

Game_CommonEvent.prototype.isActive = function() {
    var event = this.event();
    return event.trigger === 2 && $gameSwitches.value(event.switchId);
};

Game_CommonEvent.prototype.update = function() {
    if (this._interpreter) {
        if (!this._interpreter.isRunning()) {
            this._interpreter.setup(this.list());
        }
        this._interpreter.update();
    }
};

//-----------------------------------------------------------------------------
// Game_CharacterBase
//
// The superclass of Game_Character. It handles basic information, such as
// coordinates and images, shared by all characters.

Object.defineProperties(Game_CharacterBase.prototype, {
    x: { get: function() { return this._x; }, configurable: true },
    y: { get: function() { return this._y; }, configurable: true }
});

Game_CharacterBase.prototype.initialize = function() {
    this.initMembers();
};

Game_CharacterBase.prototype.initMembers = function() {
    this._x = 0;
    this._y = 0;
    this._realX = 0;
    this._realY = 0;
    this._moveSpeed = 4;
    this._moveFrequency = 6;
    this._opacity = 255;
    this._blendMode = 0;
    this._direction = 2;
    this._pattern = 1;
    this._priorityType = 1;
    this._tileId = 0;
    this._characterName = '';
    this._characterIndex = 0;
    this._isObjectCharacter = false;
    this._walkAnime = true;
    this._stepAnime = false;
    this._directionFix = false;
    this._through = false;
    this._transparent = false;
    this._bushDepth = 0;
    this._animationId = 0;
    this._balloonId = 0;
    this._animationPlaying = false;
    this._balloonPlaying = false;
    this._animationCount = 0;
    this._stopCount = 0;
    this._jumpCount = 0;
    this._jumpPeak = 0;
    this._movementSuccess = true;
};

Game_CharacterBase.prototype.pos = function(x, y) {
    return this._x === x && this._y === y;
};

Game_CharacterBase.prototype.posNt = function(x, y) {
    // No through
    return this.pos(x, y) && !this.isThrough();
};

Game_CharacterBase.prototype.moveSpeed = function() {
    return this._moveSpeed;
};

Game_CharacterBase.prototype.setMoveSpeed = function(moveSpeed) {
    this._moveSpeed = moveSpeed;
};

Game_CharacterBase.prototype.moveFrequency = function() {
    return this._moveFrequency;
};

Game_CharacterBase.prototype.setMoveFrequency = function(moveFrequency) {
    this._moveFrequency = moveFrequency;
};

Game_CharacterBase.prototype.opacity = function() {
    return this._opacity;
};

Game_CharacterBase.prototype.setOpacity = function(opacity) {
    this._opacity = opacity;
};

Game_CharacterBase.prototype.blendMode = function() {
    return this._blendMode;
};

Game_CharacterBase.prototype.setBlendMode = function(blendMode) {
    this._blendMode = blendMode;
};

Game_CharacterBase.prototype.isNormalPriority = function() {
    return this._priorityType === 1;
};

Game_CharacterBase.prototype.isMoving = function() {
    return this._realX !== this._x || this._realY !== this._y;
};

Game_CharacterBase.prototype.isJumping = function() {
    return this._jumpCount > 0;
};

Game_CharacterBase.prototype.isStopping = function() {
    return !this.isMoving() && !this.isJumping();
};

Game_CharacterBase.prototype.checkStop = function(threshold) {
    return this._stopCount > threshold;
};

Game_CharacterBase.prototype.resetStopCount = function() {
    this._stopCount = 0;
};

Game_CharacterBase.prototype.distancePerFrame = function() {
    return Math.pow(2, this.realMoveSpeed()) / 256;
};

Game_CharacterBase.prototype.isDashing = function() {
    return false;
};

Game_CharacterBase.prototype.isDebugThrough = function() {
    return false;
};

Game_CharacterBase.prototype.straighten = function() {
    if (this.hasWalkAnime() || this.hasStepAnime()) {
        this._pattern = 1;
    }
    this._animationCount = 0;
};

Game_CharacterBase.prototype.reverseDir = function(d) {
    return 10 - d;
};

Game_CharacterBase.prototype.canPass = function(x, y, d) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    if (!$gameMap.isValid(x2, y2)) {
        return false;
    }
    if (this.isThrough() || this.isDebugThrough()) {
        return true;
    }
    if (!this.isMapPassable(x, y, d)) {
        return false;
    }
    if (this.isCollidedWithCharacters(x2, y2)) {
        return false;
    }
    return true;
};

Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horz, vert) {
    var x2 = $gameMap.roundXWithDirection(x, horz);
    var y2 = $gameMap.roundYWithDirection(y, vert);
    if (this.canPass(x, y, vert) && this.canPass(x, y2, horz)) {
        return true;
    }
    if (this.canPass(x, y, horz) && this.canPass(x2, y, vert)) {
        return true;
    }
    return false;
};

Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    var d2 = this.reverseDir(d);
    return $gameMap.isPassable(x, y, d) && $gameMap.isPassable(x2, y2, d2);
};

Game_CharacterBase.prototype.isCollidedWithCharacters = function(x, y) {
    return this.isCollidedWithEvents(x, y) || this.isCollidedWithVehicles(x, y);
};

Game_CharacterBase.prototype.isCollidedWithVehicles = function(x, y) {
    return $gameMap.boat().posNt(x, y) || $gameMap.ship().posNt(x, y);
};

Game_CharacterBase.prototype.setPosition = function(x, y) {
    this._x = Math.round(x);
    this._y = Math.round(y);
    this._realX = x;
    this._realY = y;
};

Game_CharacterBase.prototype.copyPosition = function(character) {
    this._x = character._x;
    this._y = character._y;
    this._realX = character._realX;
    this._realY = character._realY;
    this._direction = character._direction;
};

Game_CharacterBase.prototype.locate = function(x, y) {
    this.setPosition(x, y);
    this.straighten();
    this.refreshBushDepth();
};

Game_CharacterBase.prototype.direction = function() {
    return this._direction;
};

Game_CharacterBase.prototype.setDirection = function(d) {
    if (!this.isDirectionFixed() && d) {
        this._direction = d;
    }
    this.resetStopCount();
};

Game_CharacterBase.prototype.isTile = function() {
    return this._tileId > 0 && this._priorityType === 0;
};

Game_CharacterBase.prototype.isObjectCharacter = function() {
    return this._isObjectCharacter;
};

Game_CharacterBase.prototype.scrolledX = function() {
    return $gameMap.adjustX(this._realX);
};

Game_CharacterBase.prototype.scrolledY = function() {
    return $gameMap.adjustY(this._realY);
};

Game_CharacterBase.prototype.update = function() {
    if (this.isStopping()) {
        this.updateStop();
    }
    if (this.isJumping()) {
        this.updateJump();
    } else if (this.isMoving()) {
        this.updateMove();
    }
    this.updateAnimation();
};

Game_CharacterBase.prototype.updateStop = function() {
    this._stopCount++;
};

Game_CharacterBase.prototype.updateJump = function() {
    this._jumpCount--;
    this._realX = (this._realX * this._jumpCount + this._x) / (this._jumpCount + 1.0);
    this._realY = (this._realY * this._jumpCount + this._y) / (this._jumpCount + 1.0);
    this.refreshBushDepth();
    if (this._jumpCount === 0) {
        this._realX = this._x = $gameMap.roundX(this._x);
        this._realY = this._y = $gameMap.roundY(this._y);
    }
};

Game_CharacterBase.prototype.updateMove = function() {
    if (this._x < this._realX) {
        this._realX = Math.max(this._realX - this.distancePerFrame(), this._x);
    }
    if (this._x > this._realX) {
        this._realX = Math.min(this._realX + this.distancePerFrame(), this._x);
    }
    if (this._y < this._realY) {
        this._realY = Math.max(this._realY - this.distancePerFrame(), this._y);
    }
    if (this._y > this._realY) {
        this._realY = Math.min(this._realY + this.distancePerFrame(), this._y);
    }
    if (!this.isMoving()) {
        this.refreshBushDepth();
    }
};

Game_CharacterBase.prototype.updateAnimation = function() {
    this.updateAnimationCount();
    if (this._animationCount >= this.animationWait()) {
        this.updatePattern();
        this._animationCount = 0;
    }
};

Game_CharacterBase.prototype.animationWait = function() {
    return (9 - this.realMoveSpeed()) * 3;
};

Game_CharacterBase.prototype.updateAnimationCount = function() {
    if (this.isMoving() && this.hasWalkAnime()) {
        this._animationCount += 1.5;
    } else if (this.hasStepAnime() || !this.isOriginalPattern()) {
        this._animationCount++;
    }
};

Game_CharacterBase.prototype.pattern = function() {
    return this._pattern < 3 ? this._pattern : 1;
};

Game_CharacterBase.prototype.setPattern = function(pattern) {
    this._pattern = pattern;
};

Game_CharacterBase.prototype.isOriginalPattern = function() {
    return this.pattern() === 1;
};

Game_CharacterBase.prototype.resetPattern = function() {
    this.setPattern(1);
};

Game_CharacterBase.prototype.refreshBushDepth = function() {
    if (this.isNormalPriority() && !this.isObjectCharacter() &&
            this.isOnBush() && !this.isJumping()) {
        if (!this.isMoving()) {
            this._bushDepth = 12;
        }
    } else {
        this._bushDepth = 0;
    }
};

Game_CharacterBase.prototype.isOnLadder = function() {
    return $gameMap.isLadder(this._x, this._y);
};

Game_CharacterBase.prototype.isOnBush = function() {
    return $gameMap.isBush(this._x, this._y);
};

Game_CharacterBase.prototype.terrainTag = function() {
    return $gameMap.terrainTag(this._x, this._y);
};

Game_CharacterBase.prototype.regionId = function() {
    return $gameMap.regionId(this._x, this._y);
};

Game_CharacterBase.prototype.increaseSteps = function() {
    if (this.isOnLadder()) {
        this.setDirection(8);
    }
    this.resetStopCount();
    this.refreshBushDepth();
};

Game_CharacterBase.prototype.tileId = function() {
    return this._tileId;
};

Game_CharacterBase.prototype.characterName = function() {
    return this._characterName;
};

Game_CharacterBase.prototype.characterIndex = function() {
    return this._characterIndex;
};

Game_CharacterBase.prototype.setImage = function(characterName, characterIndex) {
    this._tileId = 0;
    this._characterName = characterName;
    this._characterIndex = characterIndex;
    this._isObjectCharacter = ImageManager.isObjectCharacter(characterName);
};

Game_CharacterBase.prototype.setTileImage = function(tileId) {
    this._tileId = tileId;
    this._characterName = '';
    this._characterIndex = 0;
    this._isObjectCharacter = true;
};

Game_CharacterBase.prototype.checkEventTriggerTouchFront = function(d) {
    var x2 = $gameMap.roundXWithDirection(this._x, d);
    var y2 = $gameMap.roundYWithDirection(this._y, d);
    this.checkEventTriggerTouch(x2, y2);
};

Game_CharacterBase.prototype.checkEventTriggerTouch = function(x, y) {
    return false;
};

Game_CharacterBase.prototype.isMovementSucceeded = function(x, y) {
    return this._movementSuccess;
};

Game_CharacterBase.prototype.setMovementSuccess = function(success) {
    this._movementSuccess = success;
};

Game_CharacterBase.prototype.moveStraight = function(d) {
    this.setMovementSuccess(this.canPass(this._x, this._y, d));
    if (this.isMovementSucceeded()) {
        this.setDirection(d);
        this._x = $gameMap.roundXWithDirection(this._x, d);
        this._y = $gameMap.roundYWithDirection(this._y, d);
        this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(d));
        this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(d));
        this.increaseSteps();
    } else {
        this.setDirection(d);
        this.checkEventTriggerTouchFront(d);
    }
};

Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
    this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));
    if (this.isMovementSucceeded()) {
        this._x = $gameMap.roundXWithDirection(this._x, horz);
        this._y = $gameMap.roundYWithDirection(this._y, vert);
        this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(horz));
        this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(vert));
        this.increaseSteps();
    }
    if (this._direction === this.reverseDir(horz)) {
        this.setDirection(horz);
    }
    if (this._direction === this.reverseDir(vert)) {
        this.setDirection(vert);
    }
};

Game_CharacterBase.prototype.jump = function(xPlus, yPlus) {
    if (Math.abs(xPlus) > Math.abs(yPlus)) {
        if (xPlus !== 0) {
            this.setDirection(xPlus < 0 ? 4 : 6);
        }
    } else {
        if (yPlus !== 0) {
            this.setDirection(yPlus < 0 ? 8 : 2);
        }
    }
    this._x += xPlus;
    this._y += yPlus;
    var distance = Math.round(Math.sqrt(xPlus * xPlus + yPlus * yPlus));
    this._jumpPeak = 10 + distance - this._moveSpeed;
    this._jumpCount = this._jumpPeak * 2;
    this.resetStopCount();
    this.straighten();
};

Game_CharacterBase.prototype.hasWalkAnime = function() {
    return this._walkAnime;
};

Game_CharacterBase.prototype.setWalkAnime = function(walkAnime) {
    this._walkAnime = walkAnime;
};

Game_CharacterBase.prototype.hasStepAnime = function() {
    return this._stepAnime;
};

Game_CharacterBase.prototype.setStepAnime = function(stepAnime) {
    this._stepAnime = stepAnime;
};

Game_CharacterBase.prototype.isDirectionFixed = function() {
    return this._directionFix;
};

Game_CharacterBase.prototype.setDirectionFix = function(directionFix) {
    this._directionFix = directionFix;
};

Game_CharacterBase.prototype.isThrough = function() {
    return this._through;
};

Game_CharacterBase.prototype.isTransparent = function() {
    return this._transparent;
};

Game_CharacterBase.prototype.bushDepth = function() {
    return this._bushDepth;
};

Game_CharacterBase.prototype.setTransparent = function(transparent) {
    this._transparent = transparent;
};

Game_CharacterBase.prototype.requestAnimation = function(animationId) {
    this._animationId = animationId;
};

Game_CharacterBase.prototype.requestBalloon = function(balloonId) {
    this._balloonId = balloonId;
};

Game_CharacterBase.prototype.animationId = function() {
    return this._animationId;
};

Game_CharacterBase.prototype.balloonId = function() {
    return this._balloonId;
};

Game_CharacterBase.prototype.startAnimation = function() {
    this._animationId = 0;
    this._animationPlaying = true;
};

Game_CharacterBase.prototype.startBalloon = function() {
    this._balloonId = 0;
    this._balloonPlaying = true;
};

Game_CharacterBase.prototype.isAnimationPlaying = function() {
    return this._animationId > 0 || this._animationPlaying;
};

Game_CharacterBase.prototype.isBalloonPlaying = function() {
    return this._balloonId > 0 || this._balloonPlaying;
};

Game_CharacterBase.prototype.endAnimation = function() {
    this._animationPlaying = false;
};

Game_CharacterBase.prototype.endBalloon = function() {
    this._balloonPlaying = false;
};

//-----------------------------------------------------------------------------
// Game_Character
//
// The superclass of Game_Player, Game_Follower, GameVehicle, and Game_Event.

Game_Character.prototype = Object.create(Game_CharacterBase.prototype);
Game_Character.prototype.constructor = Game_Character;

Game_Character.ROUTE_END               = 0;
Game_Character.ROUTE_MOVE_DOWN         = 1;
Game_Character.ROUTE_MOVE_LEFT         = 2;
Game_Character.ROUTE_MOVE_RIGHT        = 3;
Game_Character.ROUTE_MOVE_UP           = 4;
Game_Character.ROUTE_MOVE_LOWER_L      = 5;
Game_Character.ROUTE_MOVE_LOWER_R      = 6;
Game_Character.ROUTE_MOVE_UPPER_L      = 7;
Game_Character.ROUTE_MOVE_UPPER_R      = 8;
Game_Character.ROUTE_MOVE_RANDOM       = 9;
Game_Character.ROUTE_MOVE_TOWARD       = 10;
Game_Character.ROUTE_MOVE_AWAY         = 11;
Game_Character.ROUTE_MOVE_FORWARD      = 12;
Game_Character.ROUTE_MOVE_BACKWARD     = 13;
Game_Character.ROUTE_JUMP              = 14;
Game_Character.ROUTE_WAIT              = 15;
Game_Character.ROUTE_TURN_DOWN         = 16;
Game_Character.ROUTE_TURN_LEFT         = 17;
Game_Character.ROUTE_TURN_RIGHT        = 18;
Game_Character.ROUTE_TURN_UP           = 19;
Game_Character.ROUTE_TURN_90D_R        = 20;
Game_Character.ROUTE_TURN_90D_L        = 21;
Game_Character.ROUTE_TURN_180D         = 22;
Game_Character.ROUTE_TURN_90D_R_L      = 23;
Game_Character.ROUTE_TURN_RANDOM       = 24;
Game_Character.ROUTE_TURN_TOWARD       = 25;
Game_Character.ROUTE_TURN_AWAY         = 26;
Game_Character.ROUTE_SWITCH_ON         = 27;
Game_Character.ROUTE_SWITCH_OFF        = 28;
Game_Character.ROUTE_CHANGE_SPEED      = 29;
Game_Character.ROUTE_CHANGE_FREQ       = 30;
Game_Character.ROUTE_WALK_ANIME_ON     = 31;
Game_Character.ROUTE_WALK_ANIME_OFF    = 32;
Game_Character.ROUTE_STEP_ANIME_ON     = 33;
Game_Character.ROUTE_STEP_ANIME_OFF    = 34;
Game_Character.ROUTE_DIR_FIX_ON        = 35;
Game_Character.ROUTE_DIR_FIX_OFF       = 36;
Game_Character.ROUTE_THROUGH_ON        = 37;
Game_Character.ROUTE_THROUGH_OFF       = 38;
Game_Character.ROUTE_TRANSPARENT_ON    = 39;
Game_Character.ROUTE_TRANSPARENT_OFF   = 40;
Game_Character.ROUTE_CHANGE_IMAGE      = 41;
Game_Character.ROUTE_CHANGE_OPACITY    = 42;
Game_Character.ROUTE_CHANGE_BLEND_MODE = 43;
Game_Character.ROUTE_PLAY_SE           = 44;
Game_Character.ROUTE_SCRIPT            = 45;

Game_Character.prototype.initialize = function() {
    Game_CharacterBase.prototype.initialize.call(this);
};

Game_Character.prototype.initMembers = function() {
    Game_CharacterBase.prototype.initMembers.call(this);
    this._moveRouteForcing = false;
    this._moveRoute = null;
    this._moveRouteIndex = 0;
    this._originalMoveRoute = null;
    this._originalMoveRouteIndex = 0;
    this._waitCount = 0;
};

Game_Character.prototype.memorizeMoveRoute = function() {
    this._originalMoveRoute       = this._moveRoute;
    this._originalMoveRouteIndex  = this._moveRouteIndex;
};

Game_Character.prototype.restoreMoveRoute = function() {
    this._moveRoute          = this._originalMoveRoute;
    this._moveRouteIndex     = this._originalMoveRouteIndex;
    this._originalMoveRoute  = null;
};

Game_Character.prototype.isMoveRouteForcing = function() {
    return this._moveRouteForcing;
};

Game_Character.prototype.setMoveRoute = function(moveRoute) {
    this._moveRoute = moveRoute;
    this._moveRouteIndex = 0;
    this._moveRouteForcing = false;
};

Game_Character.prototype.forceMoveRoute = function(moveRoute) {
    if (!this._originalMoveRoute) {
        this.memorizeMoveRoute();
    }
    this._moveRoute = moveRoute;
    this._moveRouteIndex = 0;
    this._moveRouteForcing = true;
    this._waitCount = 0;
};

Game_Character.prototype.updateStop = function() {
    Game_CharacterBase.prototype.updateStop.call(this);
    if (this._moveRouteForcing) {
        this.updateRoutineMove();
    }
};

Game_Character.prototype.updateRoutineMove = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
    } else {
        this.setMovementSuccess(true);
        var command = this._moveRoute.list[this._moveRouteIndex];
        if (command) {
            this.processMoveCommand(command);
            this.advanceMoveRouteIndex();
        }
    }
};

Game_Character.prototype.deltaXFrom = function(x) {
    return $gameMap.deltaX(this.x, x);
};

Game_Character.prototype.deltaYFrom = function(y) {
    return $gameMap.deltaY(this.y, y);
};

Game_Character.prototype.turnTowardPlayer = function() {
    this.turnTowardCharacter($gamePlayer);
};

Game_Character.prototype.turnAwayFromPlayer = function() {
    this.turnAwayFromCharacter($gamePlayer);
};

Game_Character.prototype.moveTowardPlayer = function() {
    this.moveTowardCharacter($gamePlayer);
};

Game_Character.prototype.moveAwayFromPlayer = function() {
    this.moveAwayFromCharacter($gamePlayer);
};

Game_Character.prototype.moveForward = function() {
    this.moveStraight(this.direction());
};

Game_Character.prototype.moveBackward = function() {
    var lastDirectionFix = this.isDirectionFixed();
    this.setDirectionFix(true);
    this.moveStraight(this.reverseDir(this.direction()));
    this.setDirectionFix(lastDirectionFix);
};

Game_Character.prototype.processRouteEnd = function() {
    if (this._moveRoute.repeat) {
        this._moveRouteIndex = -1;
    } else if (this._moveRouteForcing) {
        this._moveRouteForcing = false;
        this.restoreMoveRoute();
    }
};

Game_Character.prototype.advanceMoveRouteIndex = function() {
    var moveRoute = this._moveRoute;
    if (moveRoute && (this.isMovementSucceeded() || moveRoute.skippable)) {
        var numCommands = moveRoute.list.length - 1;
        this._moveRouteIndex++;
        if (moveRoute.repeat && this._moveRouteIndex >= numCommands) {
            this._moveRouteIndex = 0;
        }
    }
};

Game_Character.prototype.turnRight90 = function() {
    switch (this.direction()) {
    case 2:
        this.setDirection(4);
        break;
    case 4:
        this.setDirection(8);
        break;
    case 6:
        this.setDirection(2);
        break;
    case 8:
        this.setDirection(6);
        break;
    }
};

Game_Character.prototype.turnLeft90 = function() {
    switch (this.direction()) {
    case 2:
        this.setDirection(6);
        break;
    case 4:
        this.setDirection(2);
        break;
    case 6:
        this.setDirection(8);
        break;
    case 8:
        this.setDirection(4);
        break;
    }
};

Game_Character.prototype.turn180 = function() {
    this.setDirection(this.reverseDir(this.direction()));
};

Game_Character.prototype.turnRightOrLeft90 = function() {
    switch (Math.randomInt(2)) {
    case 0:
        this.turnRight90();
        break;
    case 1:
        this.turnLeft90();
        break;
    }
};

Game_Character.prototype.turnRandom = function() {
    this.setDirection(2 + Math.randomInt(4) * 2);
};

Game_Character.prototype.swap = function(character) {
    var newX = character.x;
    var newY = character.y;
    character.locate(this.x, this.y);
    this.locate(newX, newY);
};

Game_Character.prototype.findDirectionTo = function(goalX, goalY) {
    var searchLimit = this.searchLimit();
    var mapWidth = $gameMap.width();
    var nodeList = [];
    var openList = [];
    var closedList = [];
    var start = {};
    var best = start;

    if (this.x === goalX && this.y === goalY) {
        return 0;
    }

    start.parent = null;
    start.x = this.x;
    start.y = this.y;
    start.g = 0;
    start.f = $gameMap.distance(start.x, start.y, goalX, goalY);
    nodeList.push(start);
    openList.push(start.y * mapWidth + start.x);

    while (nodeList.length > 0) {
        var bestIndex = 0;
        for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].f < nodeList[bestIndex].f) {
                bestIndex = i;
            }
        }

        var current = nodeList[bestIndex];
        var x1 = current.x;
        var y1 = current.y;
        var pos1 = y1 * mapWidth + x1;
        var g1 = current.g;

        nodeList.splice(bestIndex, 1);
        openList.splice(openList.indexOf(pos1), 1);
        closedList.push(pos1);

        if (current.x === goalX && current.y === goalY) {
            best = current;
            break;
        }

        if (g1 >= searchLimit) {
            continue;
        }

        for (var j = 0; j < 4; j++) {
            var direction = 2 + j * 2;
            var x2 = $gameMap.roundXWithDirection(x1, direction);
            var y2 = $gameMap.roundYWithDirection(y1, direction);
            var pos2 = y2 * mapWidth + x2;

            if (closedList.contains(pos2)) {
                continue;
            }
            if (!this.canPass(x1, y1, direction)) {
                continue;
            }

            var g2 = g1 + 1;
            var index2 = openList.indexOf(pos2);

            if (index2 < 0 || g2 < nodeList[index2].g) {
                var neighbor;
                if (index2 >= 0) {
                    neighbor = nodeList[index2];
                } else {
                    neighbor = {};
                    nodeList.push(neighbor);
                    openList.push(pos2);
                }
                neighbor.parent = current;
                neighbor.x = x2;
                neighbor.y = y2;
                neighbor.g = g2;
                neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
                if (!best || neighbor.f - neighbor.g < best.f - best.g) {
                    best = neighbor;
                }
            }
        }
    }

    var node = best;
    while (node.parent && node.parent !== start) {
        node = node.parent;
    }

    var deltaX1 = $gameMap.deltaX(node.x, start.x);
    var deltaY1 = $gameMap.deltaY(node.y, start.y);
    if (deltaY1 > 0) {
        return 2;
    } else if (deltaX1 < 0) {
        return 4;
    } else if (deltaX1 > 0) {
        return 6;
    } else if (deltaY1 < 0) {
        return 8;
    }

    var deltaX2 = this.deltaXFrom(goalX);
    var deltaY2 = this.deltaYFrom(goalY);
    if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
        return deltaX2 > 0 ? 4 : 6;
    } else if (deltaY2 !== 0) {
        return deltaY2 > 0 ? 8 : 2;
    }

    return 0;
};

//-----------------------------------------------------------------------------
// Game_Player
//
// The game object class for the player. It contains event starting
// determinants and map scrolling functions.

Game_Player.prototype = Object.create(Game_Character.prototype);
Game_Player.prototype.constructor = Game_Player;

Game_Player.prototype.initialize = function() {
    Game_Character.prototype.initialize.call(this);
    this.setTransparent($dataSystem.optTransparent);
};

Game_Player.prototype.initMembers = function() {
    Game_Character.prototype.initMembers.call(this);
    this._vehicleType = 'walk';
    this._vehicleGettingOn = false;
    this._vehicleGettingOff = false;
    this._dashing = false;
    this._needsMapReload = false;
    this._transferring = false;
    this._newMapId = 0;
    this._newX = 0;
    this._newY = 0;
    this._newDirection = 0;
    this._fadeType = 0;
    this._followers = new Game_Followers();
    this._encounterCount = 0;
};

Game_Player.prototype.clearTransferInfo = function() {
    this._transferring = false;
    this._newMapId = 0;
    this._newX = 0;
    this._newY = 0;
    this._newDirection = 0;
};

Game_Player.prototype.followers = function() {
    return this._followers;
};

Game_Player.prototype.isStopping = function() {
    if (this._vehicleGettingOn || this._vehicleGettingOff) {
        return false;
    }
    return Game_Character.prototype.isStopping.call(this);
};

Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType) {
    this._transferring = true;
    this._newMapId = mapId;
    this._newX = x;
    this._newY = y;
    this._newDirection = d;
    this._fadeType = fadeType;
};

Game_Player.prototype.requestMapReload = function() {
    this._needsMapReload = true;
};

Game_Player.prototype.isTransferring = function() {
    return this._transferring;
};

Game_Player.prototype.newMapId = function() {
    return this._newMapId;
};

Game_Player.prototype.fadeType = function() {
    return this._fadeType;
};

Game_Player.prototype.performTransfer = function() {
    if (this.isTransferring()) {
        this.setDirection(this._newDirection);
        if (this._newMapId !== $gameMap.mapId() || this._needsMapReload) {
            $gameMap.setup(this._newMapId);
            this._needsMapReload = false;
        }
        this.locate(this._newX, this._newY);
        this.refresh();
        this.clearTransferInfo();
    }
};

Game_Player.prototype.isMapPassable = function(x, y, d) {
    var vehicle = this.vehicle();
    if (vehicle) {
        return vehicle.isMapPassable(x, y, d);
    } else {
        return Game_Character.prototype.isMapPassable.call(this, x, y, d);
    }
};

Game_Player.prototype.vehicle = function() {
    return $gameMap.vehicle(this._vehicleType);
};

Game_Player.prototype.isInBoat = function() {
    return this._vehicleType === 'boat';
};

Game_Player.prototype.isInShip = function() {
    return this._vehicleType === 'ship';
};

Game_Player.prototype.isInAirship = function() {
    return this._vehicleType === 'airship';
};

Game_Player.prototype.isInVehicle = function() {
    return this.isInBoat() || this.isInShip() || this.isInAirship();
};

Game_Player.prototype.isNormal = function() {
    return this._vehicleType === 'walk' && !this.isMoveRouteForcing();
};

Game_Player.prototype.isDashing = function() {
    return this._dashing;
};

Game_Player.prototype.isDebugThrough = function() {
    return Input.isPressed('control') && $gameTemp.isPlaytest();
};

Game_Player.prototype.isCollided = function(x, y) {
    if (this.isThrough()) {
        return false;
    } else {
        return this.pos(x, y) || this._followers.isSomeoneCollided(x, y);
    }
};

Game_Player.prototype.centerX = function() {
    return (Graphics.width / $gameMap.tileWidth() - 1) / 2.0;
};

Game_Player.prototype.centerY = function() {
    return (Graphics.height / $gameMap.tileHeight() - 1) / 2.0;
};

Game_Player.prototype.center = function(x, y) {
    return $gameMap.setDisplayPos(x - this.centerX(), y - this.centerY());
};

Game_Player.prototype.locate = function(x, y) {
    Game_Character.prototype.locate.call(this, x, y);
    this.center(x, y);
    this.makeEncounterCount();
    if (this.isInVehicle()) {
        this.vehicle().refresh();
    }
    this._followers.synchronize(x, y, this.direction());
};

Game_Player.prototype.increaseSteps = function() {
    Game_Character.prototype.increaseSteps.call(this);
    if (this.isNormal()) {
        $gameParty.increaseSteps();
    }
};

Game_Player.prototype.makeEncounterCount = function() {
    var n = $gameMap.encounterStep();
    this._encounterCount = Math.randomInt(n) + Math.randomInt(n) + 1;
};

Game_Player.prototype.makeEncounterTroopId = function() {
    var encounterList = [];
    var weightSum = 0;
    $gameMap.encounterList().forEach(function(encounter) {
        if (this.meetsEncounterConditions(encounter)) {
            encounterList.push(encounter);
            weightSum += encounter.weight;
        }
    }, this);
    if (weightSum > 0) {
        var value = Math.randomInt(weightSum);
        for (var i = 0; i < encounterList.length; i++) {
            value -= encounterList[i].weight;
            if (value < 0) {
                return encounterList[i].troopId;
            }
        }
    }
    return 0;
};

Game_Player.prototype.meetsEncounterConditions = function(encounter) {
    return (encounter.regionSet.length === 0 ||
            encounter.regionSet.contains(this.regionId()));
};

Game_Player.prototype.executeEncounter = function() {
    if (!$gameMap.isEventRunning() && this._encounterCount <= 0) {
        this.makeEncounterCount();
        var troopId = this.makeEncounterTroopId();
        if ($dataTroops[troopId]) {
            BattleManager.setup(troopId, true, false);
            BattleManager.onEncounter();
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
    if (!$gameMap.isEventRunning()) {
        $gameMap.eventsXy(x, y).forEach(function(event) {
            if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                event.start();
            }
        });
    }
};

Game_Player.prototype.canMove = function() {
    if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
        return false;
    }
    if (this.isMoveRouteForcing() || this.areFollowersGathering()) {
        return false;
    }
    if (this._vehicleGettingOn || this._vehicleGettingOff) {
        return false;
    }
    if (this.isInVehicle() && !this.vehicle().canMove()) {
        return false;
    }
    return true;
};

Game_Player.prototype.isDashButtonPressed = function() {
    var shift = Input.isPressed('shift');
    if (ConfigManager.alwaysDash) {
        return !shift;
    } else {
        return shift;
    }
};

Game_Player.prototype.updateVehicle = function() {
    if (this.isInVehicle() && !this.areFollowersGathering()) {
        if (this._vehicleGettingOn) {
            this.updateVehicleGetOn();
        } else if (this._vehicleGettingOff) {
            this.updateVehicleGetOff();
        } else {
            this.vehicle().syncWithPlayer();
        }
    }
};

Game_Player.prototype.updateVehicleGetOn = function() {
    if (!this.areFollowersGathering() && !this.isMoving()) {
        this.setDirection(this.vehicle().direction());
        this.setMoveSpeed(this.vehicle().moveSpeed());
        this._vehicleGettingOn = false;
        this.setTransparent(true);
        if (this.isInAirship()) {
            this.setThrough(true);
        }
        this.vehicle().getOn();
    }
};

Game_Player.prototype.updateVehicleGetOff = function() {
    if (!this.areFollowersGathering() && this.vehicle().isLowest()) {
        this._vehicleGettingOff = false;
        this._vehicleType = 'walk';
        this.setTransparent(false);
    }
};

Game_Player.prototype.triggerAction = function() {
    if (this.canMove()) {
        if (this.triggerButtonAction()) {
            return true;
        }
        if (this.triggerTouchAction()) {
            return true;
        }
    }
    return false;
};

Game_Player.prototype.triggerButtonAction = function() {
    if (Input.isTriggered('ok')) {
        if (this.getOnOffVehicle()) {
            return true;
        }
        this.checkEventTriggerHere([0]);
        if ($gameMap.setupStartingEvent()) {
            return true;
        }
        this.checkEventTriggerThere([0,1,2]);
        if ($gameMap.setupStartingEvent()) {
            return true;
        }
    }
    return false;
};

Game_Player.prototype.triggerTouchAction = function() {
    if ($gameTemp.isDestinationValid()){
        var direction = this.direction();
        var x1 = this.x;
        var y1 = this.y;
        var x2 = $gameMap.roundXWithDirection(x1, direction);
        var y2 = $gameMap.roundYWithDirection(y1, direction);
        var x3 = $gameMap.roundXWithDirection(x2, direction);
        var y3 = $gameMap.roundYWithDirection(y2, direction);
        var destX = $gameTemp.destinationX();
        var destY = $gameTemp.destinationY();
        if (destX === x1 && destY === y1) {
            return this.triggerTouchActionD1(x1, y1);
        } else if (destX === x2 && destY === y2) {
            return this.triggerTouchActionD2(x2, y2);
        } else if (destX === x3 && destY === y3) {
            return this.triggerTouchActionD3(x2, y2);
        }
    }
    return false;
};

Game_Player.prototype.triggerTouchActionD1 = function(x1, y1) {
    if ($gameMap.airship().pos(x1, y1)) {
        if (TouchInput.isTriggered() && this.getOnOffVehicle()) {
            return true;
        }
    }
    this.checkEventTriggerHere([0]);
    return $gameMap.setupStartingEvent();
};

Game_Player.prototype.triggerTouchActionD2 = function(x2, y2) {
    if ($gameMap.boat().pos(x2, y2) || $gameMap.ship().pos(x2, y2)) {
        if (TouchInput.isTriggered() && this.getOnVehicle()) {
            return true;
        }
    }
    if (this.isInBoat() || this.isInShip()) {
        if (TouchInput.isTriggered() && this.getOffVehicle()) {
            return true;
        }
    }
    this.checkEventTriggerThere([0,1,2]);
    return $gameMap.setupStartingEvent();
};

Game_Player.prototype.triggerTouchActionD3 = function(x2, y2) {
    if ($gameMap.isCounter(x2, y2)) {
        this.checkEventTriggerThere([0,1,2]);
    }
    return $gameMap.setupStartingEvent();
};

Game_Player.prototype.updateEncounterCount = function() {
    if (this.canEncounter()) {
        this._encounterCount -= this.encounterProgressValue();
    }
};

Game_Player.prototype.canEncounter = function() {
    return (!$gameParty.hasEncounterNone() && $gameSystem.isEncounterEnabled() &&
            !this.isInAirship() && !this.isMoveRouteForcing() && !this.isDebugThrough());
};

Game_Player.prototype.encounterProgressValue = function() {
    var value = $gameMap.isBush(this.x, this.y) ? 2 : 1;
    if ($gameParty.hasEncounterHalf()) {
        value *= 0.5;
    }
    if (this.isInShip()) {
        value *= 0.5;
    }
    return value;
};

Game_Player.prototype.checkEventTriggerHere = function(triggers) {
    if (this.canStartLocalEvents()) {
        this.startMapEvent(this.x, this.y, triggers, false);
    }
};

Game_Player.prototype.checkEventTriggerThere = function(triggers) {
    if (this.canStartLocalEvents()) {
        var direction = this.direction();
        var x1 = this.x;
        var y1 = this.y;
        var x2 = $gameMap.roundXWithDirection(x1, direction);
        var y2 = $gameMap.roundYWithDirection(y1, direction);
        this.startMapEvent(x2, y2, triggers, true);
        if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
            var x3 = $gameMap.roundXWithDirection(x2, direction);
            var y3 = $gameMap.roundYWithDirection(y2, direction);
            this.startMapEvent(x3, y3, triggers, true);
        }
    }
};

Game_Player.prototype.checkEventTriggerTouch = function(x, y) {
    if (this.canStartLocalEvents()) {
        this.startMapEvent(x, y, [1,2], true);
    }
};

Game_Player.prototype.canStartLocalEvents = function() {
    return !this.isInAirship();
};

Game_Player.prototype.getOnOffVehicle = function() {
    if (this.isInVehicle()) {
        return this.getOffVehicle();
    } else {
        return this.getOnVehicle();
    }
};

Game_Player.prototype.getOnVehicle = function() {
    var direction = this.direction();
    var x1 = this.x;
    var y1 = this.y;
    var x2 = $gameMap.roundXWithDirection(x1, direction);
    var y2 = $gameMap.roundYWithDirection(y1, direction);
    if ($gameMap.airship().pos(x1, y1)) {
        this._vehicleType = 'airship';
    } else if ($gameMap.ship().pos(x2, y2)) {
        this._vehicleType = 'ship';
    } else if ($gameMap.boat().pos(x2, y2)) {
        this._vehicleType = 'boat';
    }
    if (this.isInVehicle()) {
        this._vehicleGettingOn = true;
        if (!this.isInAirship()) {
            this.forceMoveForward();
        }
        this.gatherFollowers();
    }
    return this._vehicleGettingOn;
};

Game_Player.prototype.getOffVehicle = function() {
    if (this.vehicle().isLandOk(this.x, this.y, this.direction())) {
        if (this.isInAirship()) {
            this.setDirection(2);
        }
        this._followers.synchronize(this.x, this.y, this.direction());
        this.vehicle().getOff();
        if (!this.isInAirship()) {
            this.forceMoveForward();
            this.setTransparent(false);
        }
        this._vehicleGettingOff = true;
        this.setMoveSpeed(4);
        this.setThrough(false);
        this.makeEncounterCount();
        this.gatherFollowers();
    }
    return this._vehicleGettingOff;
};

Game_Player.prototype.forceMoveForward = function() {
    this.setThrough(true);
    this.moveForward();
    this.setThrough(false);
};

Game_Player.prototype.isOnDamageFloor = function() {
    return $gameMap.isDamageFloor(this.x, this.y) && !this.isInAirship();
};

Game_Player.prototype.moveStraight = function(d) {
    if (this.canPass(this.x, this.y, d)) {
        this._followers.updateMove();
    }
    Game_Character.prototype.moveStraight.call(this, d);
};

Game_Player.prototype.moveDiagonally = function(horz, vert) {
    if (this.canPassDiagonally(this.x, this.y, horz, vert)) {
        this._followers.updateMove();
    }
    Game_Character.prototype.moveDiagonally.call(this, horz, vert);
};

Game_Player.prototype.jump = function(xPlus, yPlus) {
    Game_Character.prototype.jump.call(this, xPlus, yPlus);
    this._followers.jumpAll();
};

Game_Player.prototype.showFollowers = function() {
    this._followers.show();
};

Game_Player.prototype.hideFollowers = function() {
    this._followers.hide();
};

Game_Player.prototype.gatherFollowers = function() {
    this._followers.gather();
};

Game_Player.prototype.areFollowersGathering = function() {
    return this._followers.areGathering();
};

Game_Player.prototype.areFollowersGathered = function() {
    return this._followers.areGathered();
};

//-----------------------------------------------------------------------------
// Game_Follower
//
// The game object class for a follower. A follower is an allied character,
// other than the front character, displayed in the party.

Game_Follower.prototype = Object.create(Game_Character.prototype);
Game_Follower.prototype.constructor = Game_Follower;

Game_Follower.prototype.initialize = function(memberIndex) {
    Game_Character.prototype.initialize.call(this);
    this._memberIndex = memberIndex;
    this.setTransparent($dataSystem.optTransparent);
    this.setThrough(true);
};

Game_Follower.prototype.isVisible = function() {
    return this.actor() && $gamePlayer.followers().isVisible();
};

//-----------------------------------------------------------------------------
// Game_Followers
//
// The wrapper class for a follower array.

Game_Followers.prototype.isVisible = function() {
    return this._visible;
};

Game_Followers.prototype.show = function() {
    this._visible = true;
};

Game_Followers.prototype.hide = function() {
    this._visible = false;
};

Game_Followers.prototype.follower = function(index) {
    return this._data[index];
};

Game_Followers.prototype.forEach = function(callback, thisObject) {
    this._data.forEach(callback, thisObject);
};

Game_Followers.prototype.reverseEach = function(callback, thisObject) {
    this._data.reverse();
    this._data.forEach(callback, thisObject);
    this._data.reverse();
};

Game_Followers.prototype.update = function() {
    if (this.areGathering()) {
        if (!this.areMoving()) {
            this.updateMove();
        }
        if (this.areGathered()) {
            this._gathering = false;
        }
    }
    this.forEach(function(follower) {
        follower.update();
    }, this);
};

Game_Followers.prototype.jumpAll = function() {
    if ($gamePlayer.isJumping()) {
        for (var i = 0; i < this._data.length; i++) {
            var follower = this._data[i];
            var sx = $gamePlayer.deltaXFrom(follower.x);
            var sy = $gamePlayer.deltaYFrom(follower.y);
            follower.jump(sx, sy);
        }
    }
};

Game_Followers.prototype.synchronize = function(x, y, d) {
    this.forEach(function(follower) {
        follower.locate(x, y);
        follower.setDirection(d);
    }, this);
};

Game_Followers.prototype.gather = function() {
    this._gathering = true;
};

Game_Followers.prototype.areGathering = function() {
    return this._gathering;
};

Game_Followers.prototype.visibleFollowers = function() {
    return this._data.filter(function(follower) {
        return follower.isVisible();
    }, this);
};

Game_Followers.prototype.areMoving = function() {
    return this.visibleFollowers().some(function(follower) {
        return follower.isMoving();
    }, this);
};

Game_Followers.prototype.areGathered = function() {
    return this.visibleFollowers().every(function(follower) {
        return !follower.isMoving() && follower.pos($gamePlayer.x, $gamePlayer.y);
    }, this);
};

Game_Followers.prototype.isSomeoneCollided = function(x, y) {
    return this.visibleFollowers().some(function(follower) {
        return follower.pos(x, y);
    }, this);
};

//-----------------------------------------------------------------------------
// Game_Vehicle
//
// The game object class for a vehicle.

Game_Vehicle.prototype = Object.create(Game_Character.prototype);
Game_Vehicle.prototype.constructor = Game_Vehicle;

Game_Vehicle.prototype.initialize = function(type) {
    Game_Character.prototype.initialize.call(this);
    this._type = type;
    this.resetDirection();
    this.initMoveSpeed();
    this.loadSystemSettings();
};

Game_Vehicle.prototype.initMembers = function() {
    Game_Character.prototype.initMembers.call(this);
    this._type = '';
    this._mapId = 0;
    this._altitude = 0;
    this._driving = false;
    this._bgm = null;
};

Game_Vehicle.prototype.isBoat = function() {
    return this._type === 'boat';
};

Game_Vehicle.prototype.isShip = function() {
    return this._type === 'ship';
};

Game_Vehicle.prototype.isAirship = function() {
    return this._type === 'airship';
};

Game_Vehicle.prototype.resetDirection = function() {
    this.setDirection(4);
};

Game_Vehicle.prototype.initMoveSpeed = function() {
    if (this.isBoat()) {
        this.setMoveSpeed(4);
    } else if (this.isShip()) {
        this.setMoveSpeed(5);
    } else if (this.isAirship()) {
        this.setMoveSpeed(6);
    }
};

Game_Vehicle.prototype.vehicle = function() {
    if (this.isBoat()) {
        return $dataSystem.boat;
    } else if (this.isShip()) {
        return $dataSystem.ship;
    } else if (this.isAirship()) {
        return $dataSystem.airship;
    } else {
        return null;
    }
};

Game_Vehicle.prototype.loadSystemSettings = function() {
    var vehicle = this.vehicle();
    this._mapId = vehicle.startMapId;
    this.setPosition(vehicle.startX, vehicle.startY);
    this.setImage(vehicle.characterName, vehicle.characterIndex);
};

Game_Vehicle.prototype.refresh = function() {
    if (this._driving) {
        this._mapId = $gameMap.mapId();
        this.syncWithPlayer();
    } else if (this._mapId === $gameMap.mapId()) {
        this.locate(this.x, this.y);
    }
    if (this.isAirship()) {
        this.setPriorityType(this._driving ? 2 : 0);
    } else {
        this.setPriorityType(1);
    }
    this.setWalkAnime(this._driving);
    this.setStepAnime(this._driving);
    this.setTransparent(this._mapId !== $gameMap.mapId());
};

Game_Vehicle.prototype.setLocation = function(mapId, x, y) {
    this._mapId = mapId;
    this.setPosition(x, y);
    this.refresh();
};

Game_Vehicle.prototype.pos = function(x, y) {
    if (this._mapId === $gameMap.mapId()) {
        return Game_Character.prototype.pos.call(this, x, y);
    } else {
        return false;
    }
};

Game_Vehicle.prototype.isMapPassable = function(x, y, d) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    if (this.isBoat()) {
        return $gameMap.isBoatPassable(x2, y2);
    } else if (this.isShip()) {
        return $gameMap.isShipPassable(x2, y2);
    } else if (this.isAirship()) {
        return true;
    } else {
        return false;
    }
};

Game_Vehicle.prototype.getOn = function() {
    this._driving = true;
    this.setWalkAnime(true);
    this.setStepAnime(true);
    $gameSystem.saveWalkingBgm();
    this.playBgm();
};

Game_Vehicle.prototype.getOff = function() {
    this._driving = false;
    this.setWalkAnime(false);
    this.setStepAnime(false);
    this.resetDirection();
    $gameSystem.replayWalkingBgm();
};

Game_Vehicle.prototype.setBgm = function(bgm) {
    this._bgm = bgm;
};

Game_Vehicle.prototype.playBgm = function() {
    AudioManager.playBgm(this._bgm || this.vehicle().bgm);
};

Game_Vehicle.prototype.syncWithPlayer = function() {
    this.copyPosition($gamePlayer);
    this.refreshBushDepth();
};

Game_Vehicle.prototype.screenY = function() {
    return Game_Character.prototype.screenY.call(this) - this._altitude;
};

Game_Vehicle.prototype.shadowX = function() {
    return this.screenX();
};

Game_Vehicle.prototype.shadowY = function() {
    return this.screenY() + this._altitude;
};

Game_Vehicle.prototype.shadowOpacity = function() {
    return 255 * this._altitude / this.maxAltitude();
};

Game_Vehicle.prototype.canMove = function() {
    if (this.isAirship()) {
        return this.isHighest();
    } else {
        return true;
    }
};

Game_Vehicle.prototype.update = function() {
    Game_Character.prototype.update.call(this);
    if (this.isAirship()) {
        this.updateAirship();
    }
};

Game_Vehicle.prototype.updateAirship = function() {
    this.updateAirshipAltitude();
    this.setStepAnime(this.isHighest());
    this.setPriorityType(this.isLowest() ? 0 : 2);
};

Game_Vehicle.prototype.updateAirshipAltitude = function() {
    if (this._driving && !this.isHighest()) {
        this._altitude++;
    }
    if (!this._driving && !this.isLowest()) {
        this._altitude--;
    }
};

Game_Vehicle.prototype.maxAltitude = function() {
    return 48;
};

Game_Vehicle.prototype.isLowest = function() {
    return this._altitude <= 0;
};

Game_Vehicle.prototype.isHighest = function() {
    return this._altitude >= this.maxAltitude();
};

Game_Vehicle.prototype.isTakeoffOk = function() {
    return $gamePlayer.areFollowersGathered();
};

Game_Vehicle.prototype.isLandOk = function(x, y, d) {
    if (this.isAirship()) {
        if (!$gameMap.isAirshipLandOk(x, y)) {
            return false;
        }
        if ($gameMap.eventsXy(x, y).length > 0) {
            return false;
        }
    } else {
        var x2 = $gameMap.roundXWithDirection(x, d);
        var y2 = $gameMap.roundYWithDirection(y, d);
        if (!$gameMap.isValid(x2, y2)) {
            return false;
        }
        if (!$gameMap.isPassable(x2, y2, this.reverseDir(d))) {
            return false;
        }
        if (this.isCollidedWithCharacters(x2, y2)) {
            return false;
        }
    }
    return true;
};

//-----------------------------------------------------------------------------
// Game_Event
//
// The game object class for an event. It contains functionality for event page
// switching and running parallel process events.

Game_Event.prototype = Object.create(Game_Character.prototype);
Game_Event.prototype.constructor = Game_Event;

Game_Event.prototype.initialize = function(mapId, eventId) {
    Game_Character.prototype.initialize.call(this);
    this._mapId = mapId;
    this._eventId = eventId;
    this.locate(this.event().x, this.event().y);
    this.refresh();
};

Game_Event.prototype.initMembers = function() {
    Game_Character.prototype.initMembers.call(this);
    this._moveType = 0;
    this._trigger = 0;
    this._starting = false;
    this._erased = false;
    this._pageIndex = -2;
    this._originalPattern = 1;
    this._originalDirection = 2;
    this._prelockDirection = 0;
    this._locked = false;
};

Game_Event.prototype.eventId = function() {
    return this._eventId;
};

Game_Event.prototype.page = function() {
    return this.event().pages[this._pageIndex];
};

Game_Event.prototype.list = function() {
    return this.page().list;
};

Game_Event.prototype.isCollidedWithCharacters = function(x, y) {
    return (Game_Character.prototype.isCollidedWithCharacters.call(this, x, y) ||
            this.isCollidedWithPlayerCharacters(x, y));
};

Game_Event.prototype.isCollidedWithEvents = function(x, y) {
    var events = $gameMap.eventsXyNt(x, y);
    return events.length > 0;
};

Game_Event.prototype.isCollidedWithPlayerCharacters = function(x, y) {
    return this.isNormalPriority() && $gamePlayer.isCollided(x, y);
};

Game_Event.prototype.unlock = function() {
    if (this._locked) {
        this._locked = false;
        this.setDirection(this._prelockDirection);
    }
};

Game_Event.prototype.updateStop = function() {
    if (this._locked) {
        this.resetStopCount();
    }
    Game_Character.prototype.updateStop.call(this);
    if (!this.isMoveRouteForcing()) {
        this.updateSelfMovement();
    }
};

Game_Event.prototype.moveTypeRandom = function() {
    switch (Math.randomInt(6)) {
    case 0: case 1:
        this.moveRandom();
        break;
    case 2: case 3: case 4:
        this.moveForward();
        break;
    case 5:
        this.resetStopCount();
        break;
    }
};

Game_Event.prototype.moveTypeTowardPlayer = function() {
    if (this.isNearThePlayer()) {
        switch (Math.randomInt(6)) {
        case 0: case 1: case 2: case 3:
            this.moveTowardPlayer();
            break;
        case 4:
            this.moveRandom();
            break;
        case 5:
            this.moveForward();
            break;
        }
    } else {
        this.moveRandom();
    }
};

Game_Event.prototype.moveTypeCustom = function() {
    this.updateRoutineMove();
};

Game_Event.prototype.isStarting = function() {
    return this._starting;
};

Game_Event.prototype.clearStartingFlag = function() {
    this._starting = false;
};

Game_Event.prototype.isTriggerIn = function(triggers) {
    return triggers.contains(this._trigger);
};

Game_Event.prototype.start = function() {
    var list = this.list();
    if (list && list.length > 1) {
        this._starting = true;
        if (this.isTriggerIn([0,1,2])) {
            this.lock();
        }
    }
};

Game_Event.prototype.erase = function() {
    this._erased = true;
    this.refresh();
};

Game_Event.prototype.meetsConditions = function(page) {
    var c = page.conditions;
    if (c.switch1Valid) {
        if (!$gameSwitches.value(c.switch1Id)) {
            return false;
        }
    }
    if (c.switch2Valid) {
        if (!$gameSwitches.value(c.switch2Id)) {
            return false;
        }
    }
    if (c.variableValid) {
        if ($gameVariables.value(c.variableId) < c.variableValue) {
            return false;
        }
    }
    if (c.selfSwitchValid) {
        var key = [this._mapId, this._eventId, c.selfSwitchCh];
        if ($gameSelfSwitches.value(key) !== true) {
            return false;
        }
    }
    if (c.itemValid) {
        var item = $dataItems[c.itemId];
        if (!$gameParty.hasItem(item)) {
            return false;
        }
    }
    if (c.actorValid) {
        var actor = $gameActors.actor(c.actorId);
        if (!$gameParty.members().contains(actor)) {
            return false;
        }
    }
    return true;
};

Game_Event.prototype.setupPage = function() {
    if (this._pageIndex >= 0) {
        this.setupPageSettings();
    } else {
        this.clearPageSettings();
    }
    this.refreshBushDepth();
    this.clearStartingFlag();
    this.checkEventTriggerAuto();
};

Game_Event.prototype.clearPageSettings = function() {
    this.setImage('', 0);
    this._moveType = 0;
    this._trigger = null;
    this._interpreter = null;
    this.setThrough(true);
};

Game_Event.prototype.setupPageSettings = function() {
    var page = this.page();
    var image = page.image;
    if (image.tileId > 0) {
        this.setTileImage(image.tileId);
    } else {
        this.setImage(image.characterName, image.characterIndex);
    }
    if (this._originalDirection !== image.direction) {
        this._originalDirection = image.direction;
        this._prelockDirection = 0;
        this.setDirectionFix(false);
        this.setDirection(image.direction);
    }
    if (this._originalPattern !== image.pattern) {
        this._originalPattern = image.pattern;
        this.setPattern(image.pattern);
    }
    this.setMoveSpeed(page.moveSpeed);
    this.setMoveFrequency(page.moveFrequency);
    this.setPriorityType(page.priorityType);
    this.setWalkAnime(page.walkAnime);
    this.setStepAnime(page.stepAnime);
    this.setDirectionFix(page.directionFix);
    this.setThrough(page.through);
    this.setMoveRoute(page.moveRoute);
    this._moveType = page.moveType;
    this._trigger = page.trigger;
    if (this._trigger === 4) {
        this._interpreter = new Game_Interpreter();
    } else {
        this._interpreter = null;
    }
};

Game_Event.prototype.isOriginalPattern = function() {
    return this.pattern() === this._originalPattern;
};

Game_Event.prototype.resetPattern = function() {
    this.setPattern(this._originalPattern);
};

Game_Event.prototype.checkEventTriggerTouch = function(x, y) {
    if (!$gameMap.isEventRunning()) {
        if (this._trigger === 2 && $gamePlayer.pos(x, y)) {
            if (!this.isJumping() && this.isNormalPriority()) {
                this.start();
            }
        }
    }
};

Game_Event.prototype.checkEventTriggerAuto = function() {
    if (this._trigger === 3) {
        this.start();
    }
};

Game_Event.prototype.update = function() {
    Game_Character.prototype.update.call(this);
    this.checkEventTriggerAuto();
    this.updateParallel();
};

Game_Event.prototype.locate = function(x, y) {
    Game_Character.prototype.locate.call(this, x, y);
    this._prelockDirection = 0;
};

Game_Event.prototype.forceMoveRoute = function(moveRoute) {
    Game_Character.prototype.forceMoveRoute.call(this, moveRoute);
    this._prelockDirection = 0;
};

//-----------------------------------------------------------------------------
// Game_Interpreter
//
// The interpreter for running event commands.

Game_Interpreter.prototype.initialize = function(depth) {
    this._depth = depth || 0;
    this.checkOverflow();
    this.clear();
    this._branch = {};
    this._params = [];
    this._indent = 0;
    this._frameCount = 0;
    this._freezeChecker = 0;
};

Game_Interpreter.prototype.checkOverflow = function() {
    if (this._depth >= 100) {
        throw new Error('Common event calls exceeded the limit');
    }
};

Game_Interpreter.prototype.clear = function() {
    this._mapId = 0;
    this._eventId = 0;
    this._list = null;
    this._index = 0;
    this._waitCount = 0;
    this._waitMode = '';
    this._comments = '';
    this._character = null;
    this._childInterpreter = null;
};

Game_Interpreter.prototype.setup = function(list, eventId) {
    this.clear();
    this._mapId = $gameMap.mapId();
    this._eventId = eventId || 0;
    this._list = list;
    Game_Interpreter.requestImages(list);
};

Game_Interpreter.prototype.eventId = function() {
    return this._eventId;
};

Game_Interpreter.prototype.isOnCurrentMap = function() {
    return this._mapId === $gameMap.mapId();
};

Game_Interpreter.prototype.setupReservedCommonEvent = function() {
    if ($gameTemp.isCommonEventReserved()) {
        this.setup($gameTemp.reservedCommonEvent().list);
        $gameTemp.clearCommonEvent();
        return true;
    } else {
        return false;
    }
};

Game_Interpreter.prototype.isRunning = function() {
    return !!this._list;
};

Game_Interpreter.prototype.update = function() {
    while (this.isRunning()) {
        if (this.updateChild() || this.updateWait()) {
            break;
        }
        if (SceneManager.isSceneChanging()) {
            break;
        }
        if (!this.executeCommand()) {
            break;
        }
        if (this.checkFreeze()) {
            break;
        }
    }
};

Game_Interpreter.prototype.updateChild = function() {
    if (this._childInterpreter) {
        this._childInterpreter.update();
        if (this._childInterpreter.isRunning()) {
            return true;
        } else {
            this._childInterpreter = null;
        }
    }
    return false;
};

Game_Interpreter.prototype.updateWait = function() {
    return this.updateWaitCount() || this.updateWaitMode();
};

Game_Interpreter.prototype.updateWaitCount = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        return true;
    }
    return false;
};

Game_Interpreter.prototype.updateWaitMode = function() {
    var waiting = false;
    switch (this._waitMode) {
    case 'message':
        waiting = $gameMessage.isBusy();
        break;
    case 'transfer':
        waiting = $gamePlayer.isTransferring();
        break;
    case 'scroll':
        waiting = $gameMap.isScrolling();
        break;
    case 'route':
        waiting = this._character.isMoveRouteForcing();
        break;
    case 'animation':
        waiting = this._character.isAnimationPlaying();
        break;
    case 'balloon':
        waiting = this._character.isBalloonPlaying();
        break;
    case 'gather':
        waiting = $gamePlayer.areFollowersGathering();
        break;
    case 'action':
        waiting = BattleManager.isActionForced();
        break;
    case 'video':
        waiting = Graphics.isVideoPlaying();
        break;
    case 'image':
        waiting = !ImageManager.isReady();
        break;
    }
    if (!waiting) {
        this._waitMode = '';
    }
    return waiting;
};

Game_Interpreter.prototype.setWaitMode = function(waitMode) {
    this._waitMode = waitMode;
};

Game_Interpreter.prototype.wait = function(duration) {
    this._waitCount = duration;
};

Game_Interpreter.prototype.fadeSpeed = function() {
    return 24;
};

Game_Interpreter.prototype.executeCommand = function() {
    var command = this.currentCommand();
    if (command) {
        this._params = command.parameters;
        this._indent = command.indent;
        var methodName = 'command' + command.code;
        if (typeof this[methodName] === 'function') {
            if (!this[methodName]()) {
                return false;
            }
        }
        this._index++;
    } else {
        this.terminate();
    }
    return true;
};

Game_Interpreter.prototype.checkFreeze = function() {
    if (this._frameCount !== Graphics.frameCount) {
        this._frameCount = Graphics.frameCount;
        this._freezeChecker = 0;
    }
    if (this._freezeChecker++ >= 100000) {
        return true;
    } else {
        return false;
    }
};

Game_Interpreter.prototype.terminate = function(){
    this._list = null;
    this._comments = '';
};

Game_Interpreter.prototype.skipBranch;

Game_Interpreter.prototype.currentCommand = function() {
    return this._list[this._index];
};

Game_Interpreter.prototype.nextEventCode = function() {
    var command = this._list[this._index + 1];
    if (command) {
        return command.code;
    } else {
        return 0;
    }
};

Game_Interpreter.prototype.iterateActorId = function(param, callback) {
    if (param === 0) {
        $gameParty.members().forEach(callback);
    } else {
        var actor = $gameActors.actor(param);
        if (actor) {
            callback(actor);
        }
    }
};

Game_Interpreter.prototype.iterateActorEx = function(param1, param2, callback) {
    if (param1 === 0) {
        this.iterateActorId(param2, callback);
    } else {
        this.iterateActorId($gameVariables.value(param2), callback);
    }
};

Game_Interpreter.prototype.iterateActorIndex = function(param, callback) {
    if (param < 0) {
        $gameParty.members().forEach(callback);
    } else {
        var actor = $gameParty.members()[param];
        if (actor) {
            callback(actor);
        }
    }
};

Game_Interpreter.prototype.iterateEnemyIndex = function(param, callback) {
    if (param < 0) {
        $gameTroop.members().forEach(callback);
    } else {
        var enemy = $gameTroop.members()[param];
        if (enemy) {
            callback(enemy);
        }
    }
};

Game_Interpreter.prototype.iterateBattler = function(param1, param2, callback) {
    if ($gameParty.inBattle()) {
        if (param1 === 0) {
            this.iterateEnemyIndex(param2, callback);
        } else {
            this.iterateActorId(param2, callback);
        }
    }
};

Game_Interpreter.prototype.character = function(param) {
    if ($gameParty.inBattle()) {
        return null;
    } else if (param < 0) {
        return $gamePlayer;
    } else if (this.isOnCurrentMap()) {
        return $gameMap.event(param > 0 ? param : this._eventId);
    } else {
        return null;
    }
};

Game_Interpreter.prototype.operateValue = function(operation, operandType, operand) {
    var value = operandType === 0 ? operand : $gameVariables.value(operand);
    return operation === 0 ? value : -value;
};

Game_Interpreter.prototype.changeHp = function(target, value, allowDeath) {
    if (target.isAlive()) {
        if (!allowDeath && target.hp <= -value) {
            value = 1 - target.hp;
        }
        target.gainHp(value);
        if (target.isDead()) {
            target.performCollapse();
        }
    }
};

// Show Text
Game_Interpreter.prototype.command101;

// Show Choices
Game_Interpreter.prototype.command102 = function() {
    if (!$gameMessage.isBusy()) {
        this.setupChoices(this._params);
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

Game_Interpreter.prototype.setupChoices = function(params) {
    var choices = params[0].clone();
    var cancelType = params[1];
    var defaultType = params.length > 2 ? params[2] : 0;
    var positionType = params.length > 3 ? params[3] : 2;
    var background = params.length > 4 ? params[4] : 0;
    if (cancelType >= choices.length) {
        cancelType = -2;
    }
    $gameMessage.setChoices(choices, defaultType, cancelType);
    $gameMessage.setChoiceBackground(background);
    $gameMessage.setChoicePositionType(positionType);
    $gameMessage.setChoiceCallback(function(n) {
        this._branch[this._indent] = n;
    }.bind(this));
};

// When [**]
Game_Interpreter.prototype.command402 = function() {
    if (this._branch[this._indent] !== this._params[0]) {
        this.skipBranch();
    }
    return true;
};

// When Cancel
Game_Interpreter.prototype.command403 = function() {
    if (this._branch[this._indent] >= 0) {
        this.skipBranch();
    }
    return true;
};

// Input Number
Game_Interpreter.prototype.command103 = function() {
    if (!$gameMessage.isBusy()) {
        this.setupNumInput(this._params);
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

Game_Interpreter.prototype.setupNumInput = function(params) {
    $gameMessage.setNumberInput(params[0], params[1]);
};

// Select Item
Game_Interpreter.prototype.command104 = function() {
    if (!$gameMessage.isBusy()) {
        this.setupItemChoice(this._params);
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

Game_Interpreter.prototype.setupItemChoice = function(params) {
    $gameMessage.setItemChoice(params[0], params[1] || 2);
};

// Show Scrolling Text
Game_Interpreter.prototype.command105 = function() {
    if (!$gameMessage.isBusy()) {
        $gameMessage.setScroll(this._params[0], this._params[1]);
        while (this.nextEventCode() === 405) {
            this._index++;
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

// Comment
Game_Interpreter.prototype.command108 = function() {
    this._comments = [this._params[0]];
    while (this.nextEventCode() === 408) {
        this._index++;
        this._comments.push(this.currentCommand().parameters[0]);
    }
    return true;
};

// Conditional Branch
Game_Interpreter.prototype.command111;

// Else
Game_Interpreter.prototype.command411 = function() {
    if (this._branch[this._indent] !== false) {
        this.skipBranch();
    }
    return true;
};

// Loop
Game_Interpreter.prototype.command112 = function() {
    return true;
};

// Repeat Above
Game_Interpreter.prototype.command413;
// Break Loop
Game_Interpreter.prototype.command113;

// Exit Event Processing
Game_Interpreter.prototype.command115 = function() {
    this._index = this._list.length;
    return true;
};

// Common Event
Game_Interpreter.prototype.command117 = function() {
    var commonEvent = $dataCommonEvents[this._params[0]];
    if (commonEvent) {
        var eventId = this.isOnCurrentMap() ? this._eventId : 0;
        this.setupChild(commonEvent.list, eventId);
    }
    return true;
};

Game_Interpreter.prototype.setupChild = function(list, eventId) {
    this._childInterpreter = new Game_Interpreter(this._depth + 1);
    this._childInterpreter.setup(list, eventId);
};

// Label
Game_Interpreter.prototype.command118 = function() {
    return true;
};

// Jump to Label
Game_Interpreter.prototype.command119;
Game_Interpreter.prototype.jumpTo;

// Control Switches
Game_Interpreter.prototype.command121 = function() {
    for (var i = this._params[0]; i <= this._params[1]; i++) {
        $gameSwitches.setValue(i, this._params[2] === 0);
    }
    return true;
};

Game_Interpreter.prototype.gameDataOperand = function(type, param1, param2) {
    switch (type) {
    case 0:  // Item
        return $gameParty.numItems($dataItems[param1]);
    case 1:  // Weapon
        return $gameParty.numItems($dataWeapons[param1]);
    case 2:  // Armor
        return $gameParty.numItems($dataArmors[param1]);
    case 3:  // Actor
        var actor = $gameActors.actor(param1);
        if (actor) {
            switch (param2) {
            case 0:  // Level
                return actor.level;
            case 1:  // EXP
                return actor.currentExp();
            case 2:  // HP
                return actor.hp;
            case 3:  // MP
                return actor.mp;
            default:    // Parameter
                if (param2 >= 4 && param2 <= 11) {
                    return actor.param(param2 - 4);
                }
            }
        }
        break;
    case 4:  // Enemy
        var enemy = $gameTroop.members()[param1];
        if (enemy) {
            switch (param2) {
            case 0:  // HP
                return enemy.hp;
            case 1:  // MP
                return enemy.mp;
            default:    // Parameter
                if (param2 >= 2 && param2 <= 9) {
                    return enemy.param(param2 - 2);
                }
            }
        }
        break;
    case 5:  // Character
        var character = this.character(param1);
        if (character) {
            switch (param2) {
            case 0:  // Map X
                return character.x;
            case 1:  // Map Y
                return character.y;
            case 2:  // Direction
                return character.direction();
            case 3:  // Screen X
                return character.screenX();
            case 4:  // Screen Y
                return character.screenY();
            }
        }
        break;
    case 6:  // Party
        actor = $gameParty.members()[param1];
        return actor ? actor.actorId() : 0;
    case 7:  // Other
        switch (param1) {
        case 0:  // Map ID
            return $gameMap.mapId();
        case 1:  // Party Members
            return $gameParty.size();
        case 2:  // Gold
            return $gameParty.gold();
        case 3:  // Steps
            return $gameParty.steps();
        case 4:  // Play Time
            return $gameSystem.playtime();
        case 5:  // Timer
            return $gameTimer.seconds();
        case 6:  // Save Count
            return $gameSystem.saveCount();
        case 7:  // Battle Count
            return $gameSystem.battleCount();
        case 8:  // Win Count
            return $gameSystem.winCount();
        case 9:  // Escape Count
            return $gameSystem.escapeCount();
        }
        break;
    }
    return 0;
};

Game_Interpreter.prototype.operateVariable = function(variableId, operationType, value) {
    try {
        var oldValue = $gameVariables.value(variableId);
        switch (operationType) {
        case 0:  // Set
            $gameVariables.setValue(variableId, oldValue = value);
            break;
        case 1:  // Add
            $gameVariables.setValue(variableId, oldValue + value);
            break;
        case 2:  // Sub
            $gameVariables.setValue(variableId, oldValue - value);
            break;
        case 3:  // Mul
            $gameVariables.setValue(variableId, oldValue * value);
            break;
        case 4:  // Div
            $gameVariables.setValue(variableId, oldValue / value);
            break;
        case 5:  // Mod
            $gameVariables.setValue(variableId, oldValue % value);
            break;
        }
    } catch (e) {
        $gameVariables.setValue(variableId, 0);
    }
};

// Control Self Switch
Game_Interpreter.prototype.command123;

// Control Timer
Game_Interpreter.prototype.command124 = function() {
    if (this._params[0] === 0) {  // Start
        $gameTimer.start(this._params[1] * 60);
    } else {  // Stop
        $gameTimer.stop();
    }
    return true;
};

// Change Gold
Game_Interpreter.prototype.command125 = function() {
    var value = this.operateValue(this._params[0], this._params[1], this._params[2]);
    $gameParty.gainGold(value);
    return true;
};

// Change Items
Game_Interpreter.prototype.command126 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    $gameParty.gainItem($dataItems[this._params[0]], value);
    return true;
};

// Change Weapons
Game_Interpreter.prototype.command127 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    $gameParty.gainItem($dataWeapons[this._params[0]], value, this._params[4]);
    return true;
};

// Change Armors
Game_Interpreter.prototype.command128 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    $gameParty.gainItem($dataArmors[this._params[0]], value, this._params[4]);
    return true;
};

// Change Party Member
Game_Interpreter.prototype.command129 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        if (this._params[1] === 0) {  // Add
            if (this._params[2]) {   // Initialize
                $gameActors.actor(this._params[0]).setup(this._params[0]);
            }
            $gameParty.addActor(this._params[0]);
        } else {  // Remove
            $gameParty.removeActor(this._params[0]);
        }
    }
    return true;
};

// Change Battle BGM
Game_Interpreter.prototype.command132 = function() {
    $gameSystem.setBattleBgm(this._params[0]);
    return true;
};

// Change Victory ME
Game_Interpreter.prototype.command133 = function() {
    $gameSystem.setVictoryMe(this._params[0]);
    return true;
};

// Change Save Access
Game_Interpreter.prototype.command134 = function() {
    if (this._params[0] === 0) {
        $gameSystem.disableSave();
    } else {
        $gameSystem.enableSave();
    }
    return true;
};

// Change Menu Access
Game_Interpreter.prototype.command135 = function() {
    if (this._params[0] === 0) {
        $gameSystem.disableMenu();
    } else {
        $gameSystem.enableMenu();
    }
    return true;
};

// Change Encounter Disable
Game_Interpreter.prototype.command136 = function() {
    if (this._params[0] === 0) {
        $gameSystem.disableEncounter();
    } else {
        $gameSystem.enableEncounter();
    }
    $gamePlayer.makeEncounterCount();
    return true;
};

// Change Formation Access
Game_Interpreter.prototype.command137 = function() {
    if (this._params[0] === 0) {
        $gameSystem.disableFormation();
    } else {
        $gameSystem.enableFormation();
    }
    return true;
};

// Change Window Color
Game_Interpreter.prototype.command138 = function() {
    $gameSystem.setWindowTone(this._params[0]);
    return true;
};

// Change Defeat ME
Game_Interpreter.prototype.command139 = function() {
    $gameSystem.setDefeatMe(this._params[0]);
    return true;
};

// Change Vehicle BGM
Game_Interpreter.prototype.command140 = function() {
    var vehicle = $gameMap.vehicle(this._params[0]);
    if (vehicle) {
        vehicle.setBgm(this._params[1]);
    }
    return true;
};

// Transfer Player
Game_Interpreter.prototype.command201 = function() {
    if (!$gameParty.inBattle() && !$gameMessage.isBusy()) {
        var mapId, x, y;
        if (this._params[0] === 0) {  // Direct designation
            mapId = this._params[1];
            x = this._params[2];
            y = this._params[3];
        } else {  // Designation with variables
            mapId = $gameVariables.value(this._params[1]);
            x = $gameVariables.value(this._params[2]);
            y = $gameVariables.value(this._params[3]);
        }
        $gamePlayer.reserveTransfer(mapId, x, y, this._params[4], this._params[5]);
        this.setWaitMode('transfer');
        this._index++;
    }
    return false;
};

// Set Vehicle Location
Game_Interpreter.prototype.command202 = function() {
    var mapId, x, y;
    if (this._params[1] === 0) {  // Direct designation
        mapId = this._params[2];
        x = this._params[3];
        y = this._params[4];
    } else {  // Designation with variables
        mapId = $gameVariables.value(this._params[2]);
        x = $gameVariables.value(this._params[3]);
        y = $gameVariables.value(this._params[4]);
    }
    var vehicle = $gameMap.vehicle(this._params[0]);
    if (vehicle) {
        vehicle.setLocation(mapId, x, y);
    }
    return true;
};

// Set Event Location
Game_Interpreter.prototype.command203 = function() {
    var character = this.character(this._params[0]);
    if (character) {
        if (this._params[1] === 0) {  // Direct designation
            character.locate(this._params[2], this._params[3]);
        } else if (this._params[1] === 1) {  // Designation with variables
            var x = $gameVariables.value(this._params[2]);
            var y = $gameVariables.value(this._params[3]);
            character.locate(x, y);
        } else {  // Exchange with another event
            var character2 = this.character(this._params[2]);
            if (character2) {
                character.swap(character2);
            }
        }
        if (this._params[4] > 0) {
            character.setDirection(this._params[4]);
        }
    }
    return true;
};

// Scroll Map
Game_Interpreter.prototype.command204 = function() {
    if (!$gameParty.inBattle()) {
        if ($gameMap.isScrolling()) {
            this.setWaitMode('scroll');
            return false;
        }
        $gameMap.startScroll(this._params[0], this._params[1], this._params[2]);
    }
    return true;
};

// Set Movement Route
Game_Interpreter.prototype.command205 = function() {
    $gameMap.refreshIfNeeded();
    this._character = this.character(this._params[0]);
    if (this._character) {
        this._character.forceMoveRoute(this._params[1]);
        if (this._params[1].wait) {
            this.setWaitMode('route');
        }
    }
    return true;
};

// Getting On and Off Vehicles
Game_Interpreter.prototype.command206 = function() {
    $gamePlayer.getOnOffVehicle();
    return true;
};

// Change Transparency
Game_Interpreter.prototype.command211 = function() {
    $gamePlayer.setTransparent(this._params[0] === 0);
    return true;
};

// Show Animation
Game_Interpreter.prototype.command212 = function() {
    this._character = this.character(this._params[0]);
    if (this._character) {
        this._character.requestAnimation(this._params[1]);
        if (this._params[2]) {
            this.setWaitMode('animation');
        }
    }
    return true;
};

// Show Balloon Icon
Game_Interpreter.prototype.command213 = function() {
    this._character = this.character(this._params[0]);
    if (this._character) {
        this._character.requestBalloon(this._params[1]);
        if (this._params[2]) {
            this.setWaitMode('balloon');
        }
    }
    return true;
};

// Erase Event
Game_Interpreter.prototype.command214;

// Change Player Followers
Game_Interpreter.prototype.command216 = function() {
    if (this._params[0] === 0) {
        $gamePlayer.showFollowers();
    } else {
        $gamePlayer.hideFollowers();
    }
    $gamePlayer.refresh();
    return true;
};

// Gather Followers
Game_Interpreter.prototype.command217 = function() {
    if (!$gameParty.inBattle()) {
        $gamePlayer.gatherFollowers();
        this.setWaitMode('gather');
    }
    return true;
};

// Fadeout Screen
Game_Interpreter.prototype.command221 = function() {
    if (!$gameMessage.isBusy()) {
        $gameScreen.startFadeOut(this.fadeSpeed());
        this.wait(this.fadeSpeed());
        this._index++;
    }
    return false;
};

// Fadein Screen
Game_Interpreter.prototype.command222 = function() {
    if (!$gameMessage.isBusy()) {
        $gameScreen.startFadeIn(this.fadeSpeed());
        this.wait(this.fadeSpeed());
        this._index++;
    }
    return false;
};

// Tint Screen
Game_Interpreter.prototype.command223 = function() {
    $gameScreen.startTint(this._params[0], this._params[1]);
    if (this._params[2]) {
        this.wait(this._params[1]);
    }
    return true;
};

// Flash Screen
Game_Interpreter.prototype.command224 = function() {
    $gameScreen.startFlash(this._params[0], this._params[1]);
    if (this._params[2]) {
        this.wait(this._params[1]);
    }
    return true;
};

// Shake Screen
Game_Interpreter.prototype.command225 = function() {
    $gameScreen.startShake(this._params[0], this._params[1], this._params[2]);
    if (this._params[3]) {
        this.wait(this._params[2]);
    }
    return true;
};

// Wait
Game_Interpreter.prototype.command230 = function() {
    this.wait(this._params[0]);
    return true;
};

// Show Picture
Game_Interpreter.prototype.command231 = function() {
    var x, y;
    if (this._params[3] === 0) {  // Direct designation
        x = this._params[4];
        y = this._params[5];
    } else {  // Designation with variables
        x = $gameVariables.value(this._params[4]);
        y = $gameVariables.value(this._params[5]);
    }
    $gameScreen.showPicture(this._params[0], this._params[1], this._params[2],
        x, y, this._params[6], this._params[7], this._params[8], this._params[9]);
    return true;
};

// Move Picture
Game_Interpreter.prototype.command232 = function() {
    var x, y;
    if (this._params[3] === 0) {  // Direct designation
        x = this._params[4];
        y = this._params[5];
    } else {  // Designation with variables
        x = $gameVariables.value(this._params[4]);
        y = $gameVariables.value(this._params[5]);
    }
    $gameScreen.movePicture(this._params[0], this._params[2], x, y, this._params[6],
        this._params[7], this._params[8], this._params[9], this._params[10]);
    if (this._params[11]) {
        this.wait(this._params[10]);
    }
    return true;
};

// Rotate Picture
Game_Interpreter.prototype.command233 = function() {
    $gameScreen.rotatePicture(this._params[0], this._params[1]);
    return true;
};

// Tint Picture
Game_Interpreter.prototype.command234 = function() {
    $gameScreen.tintPicture(this._params[0], this._params[1], this._params[2]);
    if (this._params[3]) {
        this.wait(this._params[2]);
    }
    return true;
};

// Erase Picture
Game_Interpreter.prototype.command235 = function() {
    $gameScreen.erasePicture(this._params[0]);
    return true;
};

// Set Weather Effect
Game_Interpreter.prototype.command236 = function() {
    if (!$gameParty.inBattle()) {
        $gameScreen.changeWeather(this._params[0], this._params[1], this._params[2]);
        if (this._params[3]) {
            this.wait(this._params[2]);
        }
    }
    return true;
};

// Play BGM
Game_Interpreter.prototype.command241 = function() {
    AudioManager.playBgm(this._params[0]);
    return true;
};

// Fadeout BGM
Game_Interpreter.prototype.command242 = function() {
    AudioManager.fadeOutBgm(this._params[0]);
    return true;
};

// Save BGM
Game_Interpreter.prototype.command243 = function() {
    $gameSystem.saveBgm();
    return true;
};

// Resume BGM
Game_Interpreter.prototype.command244 = function() {
    $gameSystem.replayBgm();
    return true;
};

// Play BGS
Game_Interpreter.prototype.command245 = function() {
    AudioManager.playBgs(this._params[0]);
    return true;
};

// Fadeout BGS
Game_Interpreter.prototype.command246 = function() {
    AudioManager.fadeOutBgs(this._params[0]);
    return true;
};

// Play ME
Game_Interpreter.prototype.command249 = function() {
    AudioManager.playMe(this._params[0]);
    return true;
};

// Play SE
Game_Interpreter.prototype.command250 = function() {
    AudioManager.playSe(this._params[0]);
    return true;
};

// Stop SE
Game_Interpreter.prototype.command251 = function() {
    AudioManager.stopSe();
    return true;
};

// Play Movie
Game_Interpreter.prototype.command261 = function() {
    if (!$gameMessage.isBusy()) {
        var name = this._params[0];
        if (name.length > 0) {
            var ext = this.videoFileExt();
            Graphics.playVideo('movies/' + name + ext);
            this.setWaitMode('video');
        }
        this._index++;
    }
    return false;
};

Game_Interpreter.prototype.videoFileExt = function() {
    if (Graphics.canPlayVideoType('video/webm') && !Utils.isMobileDevice()) {
        return '.webm';
    } else {
        return '.mp4';
    }
};

// Change Map Name Display
Game_Interpreter.prototype.command281 = function() {
    if (this._params[0] === 0) {
        $gameMap.enableNameDisplay();
    } else {
        $gameMap.disableNameDisplay();
    }
    return true;
};

// Change Tileset
Game_Interpreter.prototype.command282 = function() {
    var tileset = $dataTilesets[this._params[0]];
    if(!this._imageReservationId){
        this._imageReservationId = Utils.generateRuntimeId();
    }

    var allReady = tileset.tilesetNames.map(function(tilesetName) {
        return ImageManager.reserveTileset(tilesetName, 0, this._imageReservationId);
    }, this).every(function(bitmap) {return bitmap.isReady();});

    if (allReady) {
        $gameMap.changeTileset(this._params[0]);
        ImageManager.releaseReservation(this._imageReservationId);
        this._imageReservationId = null;

        return true;
    } else {
        return false;
    }
};

// Change Battle Back
Game_Interpreter.prototype.command283 = function() {
    $gameMap.changeBattleback(this._params[0], this._params[1]);
    return true;
};

// Change Parallax
Game_Interpreter.prototype.command284 = function() {
    $gameMap.changeParallax(this._params[0], this._params[1],
        this._params[2], this._params[3], this._params[4]);
    return true;
};

// Get Location Info
Game_Interpreter.prototype.command285 = function() {
    var x, y, value;
    if (this._params[2] === 0) {  // Direct designation
        x = this._params[3];
        y = this._params[4];
    } else {  // Designation with variables
        x = $gameVariables.value(this._params[3]);
        y = $gameVariables.value(this._params[4]);
    }
    switch (this._params[1]) {
    case 0:     // Terrain Tag
        value = $gameMap.terrainTag(x, y);
        break;
    case 1:     // Event ID
        value = $gameMap.eventIdXy(x, y);
        break;
    case 2:     // Tile ID (Layer 1)
    case 3:     // Tile ID (Layer 2)
    case 4:     // Tile ID (Layer 3)
    case 5:     // Tile ID (Layer 4)
        value = $gameMap.tileId(x, y, this._params[1] - 2);
        break;
    default:    // Region ID
        value = $gameMap.regionId(x, y);
        break;
    }
    $gameVariables.setValue(this._params[0], value);
    return true;
};

// Battle Processing
Game_Interpreter.prototype.command301 = function() {
    if (!$gameParty.inBattle()) {
        var troopId;
        if (this._params[0] === 0) {  // Direct designation
            troopId = this._params[1];
        } else if (this._params[0] === 1) {  // Designation with a variable
            troopId = $gameVariables.value(this._params[1]);
        } else {  // Same as Random Encounter
            troopId = $gamePlayer.makeEncounterTroopId();
        }
        if ($dataTroops[troopId]) {
            BattleManager.setup(troopId, this._params[2], this._params[3]);
            BattleManager.setEventCallback(function(n) {
                this._branch[this._indent] = n;
            }.bind(this));
            $gamePlayer.makeEncounterCount();
            SceneManager.push(Scene_Battle);
        }
    }
    return true;
};

// If Win
Game_Interpreter.prototype.command601 = function() {
    if (this._branch[this._indent] !== 0) {
        this.skipBranch();
    }
    return true;
};

// If Escape
Game_Interpreter.prototype.command602 = function() {
    if (this._branch[this._indent] !== 1) {
        this.skipBranch();
    }
    return true;
};

// If Lose
Game_Interpreter.prototype.command603 = function() {
    if (this._branch[this._indent] !== 2) {
        this.skipBranch();
    }
    return true;
};

// Shop Processing
Game_Interpreter.prototype.command302 = function() {
    if (!$gameParty.inBattle()) {
        var goods = [this._params];
        while (this.nextEventCode() === 605) {
            this._index++;
            goods.push(this.currentCommand().parameters);
        }
        SceneManager.push(Scene_Shop);
        SceneManager.prepareNextScene(goods, this._params[4]);
    }
    return true;
};

// Name Input Processing
Game_Interpreter.prototype.command303 = function() {
    if (!$gameParty.inBattle()) {
        if ($dataActors[this._params[0]]) {
            SceneManager.push(Scene_Name);
            SceneManager.prepareNextScene(this._params[0], this._params[1]);
        }
    }
    return true;
};

// Change HP
Game_Interpreter.prototype.command311 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        this.changeHp(actor, value, this._params[5]);
    }.bind(this));
    return true;
};

// Change MP
Game_Interpreter.prototype.command312 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.gainMp(value);
    }.bind(this));
    return true;
};

// Change TP
Game_Interpreter.prototype.command326 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.gainTp(value);
    }.bind(this));
    return true;
};

// Change State
Game_Interpreter.prototype.command313 = function() {
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        var alreadyDead = actor.isDead();
        if (this._params[2] === 0) {
            actor.addState(this._params[3]);
        } else {
            actor.removeState(this._params[3]);
        }
        if (actor.isDead() && !alreadyDead) {
            actor.performCollapse();
        }
        actor.clearResult();
    }.bind(this));
    return true;
};

// Recover All
Game_Interpreter.prototype.command314 = function() {
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.recoverAll();
    }.bind(this));
    return true;
};

// Change EXP
Game_Interpreter.prototype.command315 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.changeExp(actor.currentExp() + value, this._params[5]);
    }.bind(this));
    return true;
};

// Change Level
Game_Interpreter.prototype.command316 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.changeLevel(actor.level + value, this._params[5]);
    }.bind(this));
    return true;
};

// Change Parameter
Game_Interpreter.prototype.command317 = function() {
    var value = this.operateValue(this._params[3], this._params[4], this._params[5]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.addParam(this._params[2], value);
    }.bind(this));
    return true;
};

// Change Skill
Game_Interpreter.prototype.command318 = function() {
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        if (this._params[2] === 0) {
            actor.learnSkill(this._params[3]);
        } else {
            actor.forgetSkill(this._params[3]);
        }
    }.bind(this));
    return true;
};

// Change Equipment
Game_Interpreter.prototype.command319 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.changeEquipById(this._params[1], this._params[2]);
    }
    return true;
};

// Change Name
Game_Interpreter.prototype.command320 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.setName(this._params[1]);
    }
    return true;
};

// Change Class
Game_Interpreter.prototype.command321 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor && $dataClasses[this._params[1]]) {
        actor.changeClass(this._params[1], this._params[2]);
    }
    return true;
};

// Change Actor Images
Game_Interpreter.prototype.command322 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.setCharacterImage(this._params[1], this._params[2]);
        actor.setFaceImage(this._params[3], this._params[4]);
        actor.setBattlerImage(this._params[5]);
    }
    $gamePlayer.refresh();
    return true;
};

// Change Vehicle Image
Game_Interpreter.prototype.command323 = function() {
    var vehicle = $gameMap.vehicle(this._params[0]);
    if (vehicle) {
        vehicle.setImage(this._params[1], this._params[2]);
    }
    return true;
};

// Change Nickname
Game_Interpreter.prototype.command324 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.setNickname(this._params[1]);
    }
    return true;
};

// Change Profile
Game_Interpreter.prototype.command325 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.setProfile(this._params[1]);
    }
    return true;
};

// Change Enemy HP
Game_Interpreter.prototype.command331 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        this.changeHp(enemy, value, this._params[4]);
    }.bind(this));
    return true;
};

// Change Enemy MP
Game_Interpreter.prototype.command332 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.gainMp(value);
    }.bind(this));
    return true;
};

// Change Enemy TP
Game_Interpreter.prototype.command342 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.gainTp(value);
    }.bind(this));
    return true;
};

// Change Enemy State
Game_Interpreter.prototype.command333 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        var alreadyDead = enemy.isDead();
        if (this._params[1] === 0) {
            enemy.addState(this._params[2]);
        } else {
            enemy.removeState(this._params[2]);
        }
        if (enemy.isDead() && !alreadyDead) {
            enemy.performCollapse();
        }
        enemy.clearResult();
    }.bind(this));
    return true;
};

// Enemy Recover All
Game_Interpreter.prototype.command334 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.recoverAll();
    }.bind(this));
    return true;
};

// Enemy Appear
Game_Interpreter.prototype.command335 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.appear();
        $gameTroop.makeUniqueNames();
    }.bind(this));
    return true;
};

// Enemy Transform
Game_Interpreter.prototype.command336 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.transform(this._params[1]);
        $gameTroop.makeUniqueNames();
    }.bind(this));
    return true;
};

// Show Battle Animation
Game_Interpreter.prototype.command337 = function() {
    if (this._params[2] == true) {
        this.iterateEnemyIndex(-1,function(enemy) {
            if (enemy.isAlive()) {
                enemy.startAnimation(this._params[1],false,0);
            }
        }.bind(this));
    } else {
        this.iterateEnemyIndex(this._params[0], function (enemy) {
            if (enemy.isAlive()) {
                enemy.startAnimation(this._params[1], false, 0);
            }
        }.bind(this));
    }
    return true;
};

// Force Action
Game_Interpreter.prototype.command339 = function() {
    this.iterateBattler(this._params[0], this._params[1], function(battler) {
        if (!battler.isDeathStateAffected()) {
            battler.forceAction(this._params[2], this._params[3]);
            BattleManager.forceAction(battler);
            this.setWaitMode('action');
        }
    }.bind(this));
    return true;
};

// Abort Battle
Game_Interpreter.prototype.command340 = function() {
    BattleManager.abort();
    return true;
};

// Open Menu Screen
Game_Interpreter.prototype.command351 = function() {
    if (!$gameParty.inBattle()) {
        SceneManager.push(Scene_Menu);
        Window_MenuCommand.initCommandPosition();
    }
    return true;
};

// Open Save Screen
Game_Interpreter.prototype.command352 = function() {
    if (!$gameParty.inBattle()) {
        SceneManager.push(Scene_Save);
    }
    return true;
};

// Game Over
Game_Interpreter.prototype.command353 = function() {
    SceneManager.goto(Scene_Gameover);
    return true;
};

// Return to Title Screen
Game_Interpreter.prototype.command354 = function() {
    SceneManager.goto(Scene_Title);
    return true;
};

// Plugin Command
Game_Interpreter.prototype.command356 = function() {
    var args = this._params[0].split(" ");
    var command = args.shift();
    this.pluginCommand(command, args);
    return true;
};

Game_Interpreter.prototype.pluginCommand = function(command, args) {
    // to be overridden by plugins
};

Game_Interpreter.requestImages = function(list, commonList){
    if(!list) return;

    list.forEach(function(command){
        var params = command.parameters;
        switch(command.code){
            // Show Text
            case 101:
                ImageManager.requestFace(params[0]);
                break;

            // Common Event
            case 117:
                var commonEvent = $dataCommonEvents[params[0]];
                if (commonEvent) {
                    if (!commonList) {
                        commonList = [];
                    }
                    if (!commonList.contains(params[0])) {
                        commonList.push(params[0]);
                        Game_Interpreter.requestImages(commonEvent.list, commonList);
                    }
                }
                break;

            // Change Party Member
            case 129:
                var actor = $gameActors.actor(params[0]);
                if (actor && params[1] === 0) {
                    var name = actor.characterName();
                    ImageManager.requestCharacter(name);
                }
                break;

            // Set Movement Route
            case 205:
                if(params[1]){
                    params[1].list.forEach(function(command){
                        var params = command.parameters;
                        if(command.code === Game_Character.ROUTE_CHANGE_IMAGE){
                            ImageManager.requestCharacter(params[0]);
                        }
                    });
                }
                break;

            // Show Animation, Show Battle Animation
            case 212: case 337:
                if(params[1]) {
                    var animation = $dataAnimations[params[1]];
                    var name1 = animation.animation1Name;
                    var name2 = animation.animation2Name;
                    var hue1 = animation.animation1Hue;
                    var hue2 = animation.animation2Hue;
                    ImageManager.requestAnimation(name1, hue1);
                    ImageManager.requestAnimation(name2, hue2);
                }
                break;

            // Change Player Followers
            case 216:
                if (params[0] === 0) {
                    $gamePlayer.followers().forEach(function(follower) {
                        var name = follower.characterName();
                        ImageManager.requestCharacter(name);
                    });
                }
                break;

            // Show Picture
            case 231:
                ImageManager.requestPicture(params[1]);
                break;

            // Change Tileset
            case 282:
                var tileset = $dataTilesets[params[0]];
                tileset.tilesetNames.forEach(function(tilesetName){
                    ImageManager.requestTileset(tilesetName);
                });
                break;

            // Change Battle Back
            case 283:
                if ($gameParty.inBattle()) {
                    ImageManager.requestBattleback1(params[0]);
                    ImageManager.requestBattleback2(params[1]);
                }
                break;

            // Change Parallax
            case 284:
                if (!$gameParty.inBattle()) {
                    ImageManager.requestParallax(params[0]);
                }
                break;

            // Change Actor Images
            case 322:
                ImageManager.requestCharacter(params[1]);
                ImageManager.requestFace(params[3]);
                ImageManager.requestSvActor(params[5]);
                break;

            // Change Vehicle Image
            case 323:
                var vehicle = $gameMap.vehicle(params[0]);
                if(vehicle){
                    ImageManager.requestCharacter(params[1]);
                }
                break;

            // Enemy Transform
            case 336:
                var enemy = $dataEnemies[params[1]];
                var name = enemy.battlerName;
                var hue = enemy.battlerHue;
                if ($gameSystem.isSideView()) {
                    ImageManager.requestSvEnemy(name, hue);
                } else {
                    ImageManager.requestEnemy(name, hue);
                }
                break;
        }
    });
};