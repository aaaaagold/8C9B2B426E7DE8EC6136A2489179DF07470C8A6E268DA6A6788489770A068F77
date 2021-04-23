"use strict";
// before rpg_* defined

// ---- default values ----

// ---- ---- rpg_windows.js ----
// ---- ---- ---- Window_Options.prototype.volumeOffset ,  ----
_global_conf["default volume offset"] = 10;
_global_conf["min choicebox width"] = "max";
_global_conf["max choicebox height"] = "auto"; // TODO
_global_conf["sep"] = "=".repeat(64);
// TODO: choices items height adjustment

// ---- ---- rpg_managers.js ----
// ---- ---- ---- ConfigManager.readVolume , AudioManager ----
_global_conf["default volume"] = 50;
// ---- ---- ---- DataManager ----
_global_conf["default max savefiles"] = 64;
// ---- ---- ---- load from plugins.js ----
_global_conf["default width"] = 1008;
_global_conf["default height"] = 576;
// ---- ---- ---- $data... ----
var $dataCustom = null;
var $dataTemplateEvtFromMap_overworld = null;
var $dataTemplateEvtFromMap_outside = null;
var $dataTemplateEvtFromMaps = [];

// ---- ---- rpg_objects.js ----
// ---- ---- ---- Game_Character ----
_global_conf['default searchLimit'] = 12;
// ---- ---- ---- Game_Party ----
_global_conf["default maxFollowers"] = 9999; // >=$gamePlayer._followers.length
_global_conf["default maxBattleMembers"] = 999; // .maxBattleMembers
_global_conf["default allowRepeatedMembers"] = 4040; // .addActor
_global_conf["default maxItems"] = 9999; // .maxItems
_global_conf["isGatherFollowersViaJump"] = 1; // Game_Player.prototype.gatherFollowers
