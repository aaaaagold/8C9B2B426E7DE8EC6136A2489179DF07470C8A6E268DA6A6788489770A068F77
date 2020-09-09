"use strict";
//=============================================================================
// rpg_managers.js v1.6.1
//=============================================================================

function DataManager() {
    throw new Error('This is a static class');
}

var $dataActors   = null;
var $dataClasses  = null;
var $dataSkills   = null;
var $dataItems    = null;
var $dataWeapons  = null;
var $dataArmors   = null;
var $dataEnemies  = null;
var $dataTroops   = null;
var $dataTroops   = null;
var $dataTroops   = null;
var $dataTroops   = null;
var $dataTroops   = null;
var $dataSystem   = null;
var $dataMapInfos = null;
var $dataMap      = null;

function ConfigManager() {
    throw new Error('This is a static class');
}

function StorageManager() {
    throw new Error('This is a static class');
}

function ImageManager() {
    throw new Error('This is a static class');
}

function AudioManager() {
    throw new Error('This is a static class');
}

function SoundManager() {
    throw new Error('This is a static class');
}

function TextManager() {
    throw new Error('This is a static class');
}

function SceneManager() {
    throw new Error('This is a static class');
}

function BattleManager() {
    throw new Error('This is a static class');
}

function PluginManager() {
    throw new Error('This is a static class');
}


﻿"use strict";
//=============================================================================
// rpg_objects.js v1.6.1
//=============================================================================

//-----------------------------------------------------------------------------
// Game_Temp
//
// The game object class for temporary data that is not included in save data.

function Game_Temp() {
    this.initialize.apply(this, arguments);
}

function Game_System() {
    this.initialize.apply(this, arguments);
}

function Game_Timer() {
    this.initialize.apply(this, arguments);
}

function Game_Message() {
    this.initialize.apply(this, arguments);
}

function Game_Switches() {
    this.initialize.apply(this, arguments);
}

function Game_Variables() {
    this.initialize.apply(this, arguments);
}

function Game_SelfSwitches() {
    this.initialize.apply(this, arguments);
}

function Game_Screen() {
    this.initialize.apply(this, arguments);
}

function Game_Picture() {
    this.initialize.apply(this, arguments);
}

function Game_Item() {
    this.initialize.apply(this, arguments);
}

function Game_Action() {
    this.initialize.apply(this, arguments);
}

function Game_ActionResult() {
    this.initialize.apply(this, arguments);
}

function Game_BattlerBase() {
    this.initialize.apply(this, arguments);
}

function Game_Battler() {
    this.initialize.apply(this, arguments);
}

function Game_Actor() {
    this.initialize.apply(this, arguments);
}

function Game_Enemy() {
    this.initialize.apply(this, arguments);
}

function Game_Actors() {
    this.initialize.apply(this, arguments);
}

function Game_Unit() {
    this.initialize.apply(this, arguments);
}

function Game_Party() {
    this.initialize.apply(this, arguments);
}

function Game_Troop() {
    this.initialize.apply(this, arguments);
}

function Game_Map() {
    this.initialize.apply(this, arguments);
}

function Game_CommonEvent() {
    this.initialize.apply(this, arguments);
}

function Game_CharacterBase() {
    this.initialize.apply(this, arguments);
}

function Game_Character() {
    this.initialize.apply(this, arguments);
}

function Game_Player() {
    this.initialize.apply(this, arguments);
}

function Game_Follower() {
    this.initialize.apply(this, arguments);
}

function Game_Followers() {
    this.initialize.apply(this, arguments);
}

function Game_Vehicle() {
    this.initialize.apply(this, arguments);
}

function Game_Event() {
    this.initialize.apply(this, arguments);
}

function Game_Interpreter() {
    this.initialize.apply(this, arguments);
}


"use strict";
//=============================================================================
// rpg_scenes.js v1.6.1
//=============================================================================

//=============================================================================

function Scene_Base() {
    this.initialize.apply(this, arguments);
}

function Scene_Boot() {
    this.initialize.apply(this, arguments);
}

function Scene_Title() {
    this.initialize.apply(this, arguments);
}

function Scene_Map() {
    this.initialize.apply(this, arguments);
}

function Scene_MenuBase() {
    this.initialize.apply(this, arguments);
}

function Scene_Menu() {
    this.initialize.apply(this, arguments);
}

function Scene_ItemBase() {
    this.initialize.apply(this, arguments);
}

function Scene_Item() {
    this.initialize.apply(this, arguments);
}

function Scene_Skill() {
    this.initialize.apply(this, arguments);
}

function Scene_Equip() {
    this.initialize.apply(this, arguments);
}

function Scene_Status() {
    this.initialize.apply(this, arguments);
}

function Scene_Options() {
    this.initialize.apply(this, arguments);
}

function Scene_File() {
    this.initialize.apply(this, arguments);
}

function Scene_Save() {
    this.initialize.apply(this, arguments);
}

function Scene_Load() {
    this.initialize.apply(this, arguments);
}

function Scene_GameEnd() {
    this.initialize.apply(this, arguments);
}

function Scene_Shop() {
    this.initialize.apply(this, arguments);
}

function Scene_Name() {
    this.initialize.apply(this, arguments);
}

function Scene_Debug() {
    this.initialize.apply(this, arguments);
}

function Scene_Battle() {
    this.initialize.apply(this, arguments);
}

function Scene_Gameover() {
    this.initialize.apply(this, arguments);
}


"use strict";
//=============================================================================
// rpg_sprites.js v1.6.1
//=============================================================================

//-----------------------------------------------------------------------------

function Sprite_Base() {
    this.initialize.apply(this, arguments);
}

function Sprite_Button() {
    this.initialize.apply(this, arguments);
}

function Sprite_Character() {
    this.initialize.apply(this, arguments);
}

function Sprite_Battler() {
    this.initialize.apply(this, arguments);
}

function Sprite_Actor() {
    this.initialize.apply(this, arguments);
}

function Sprite_Enemy() {
    this.initialize.apply(this, arguments);
}

function Sprite_Animation() {
    this.initialize.apply(this, arguments);
}

function Sprite_Damage() {
    this.initialize.apply(this, arguments);
}

function Sprite_StateIcon() {
    this.initialize.apply(this, arguments);
}

function Sprite_StateOverlay() {
    this.initialize.apply(this, arguments);
}

function Sprite_Weapon() {
    this.initialize.apply(this, arguments);
}

function Sprite_Balloon() {
    this.initialize.apply(this, arguments);
}

function Sprite_Picture() {
    this.initialize.apply(this, arguments);
}

function Sprite_Timer() {
    this.initialize.apply(this, arguments);
}

function Sprite_Destination() {
    this.initialize.apply(this, arguments);
}

function Spriteset_Base() {
    this.initialize.apply(this, arguments);
}

function Spriteset_Map() {
    this.initialize.apply(this, arguments);
}

function Spriteset_Battle() {
    this.initialize.apply(this, arguments);
}


﻿"use strict";
//=============================================================================
// rpg_windows.js v1.6.1
//=============================================================================

//-----------------------------------------------------------------------------

function Window_Base() {
    this.initialize.apply(this, arguments);
}

function Window_Selectable() {
    this.initialize.apply(this, arguments);
}

function Window_Command() {
    this.initialize.apply(this, arguments);
}

function Window_HorzCommand() {
    this.initialize.apply(this, arguments);
}

function Window_Help() {
    this.initialize.apply(this, arguments);
}

function Window_Gold() {
    this.initialize.apply(this, arguments);
}

function Window_MenuCommand() {
    this.initialize.apply(this, arguments);
}

function Window_MenuStatus() {
    this.initialize.apply(this, arguments);
}

function Window_MenuActor() {
    this.initialize.apply(this, arguments);
}

function Window_ItemCategory() {
    this.initialize.apply(this, arguments);
}

function Window_ItemList() {
    this.initialize.apply(this, arguments);
}

function Window_SkillType() {
    this.initialize.apply(this, arguments);
}

function Window_SkillStatus() {
    this.initialize.apply(this, arguments);
}

function Window_SkillList() {
    this.initialize.apply(this, arguments);
}

function Window_EquipStatus() {
    this.initialize.apply(this, arguments);
}

function Window_EquipCommand() {
    this.initialize.apply(this, arguments);
}

function Window_EquipSlot() {
    this.initialize.apply(this, arguments);
}

function Window_EquipItem() {
    this.initialize.apply(this, arguments);
}

function Window_Status() {
    this.initialize.apply(this, arguments);
}

function Window_Options() {
    this.initialize.apply(this, arguments);
}

function Window_SavefileList() {
    this.initialize.apply(this, arguments);
}

function Window_ShopCommand() {
    this.initialize.apply(this, arguments);
}

function Window_ShopBuy() {
    this.initialize.apply(this, arguments);
}

function Window_ShopSell() {
    this.initialize.apply(this, arguments);
}

function Window_ShopNumber() {
    this.initialize.apply(this, arguments);
}

function Window_ShopStatus() {
    this.initialize.apply(this, arguments);
}

function Window_NameEdit() {
    this.initialize.apply(this, arguments);
}

function Window_NameInput() {
    this.initialize.apply(this, arguments);
}

function Window_ChoiceList() {
    this.initialize.apply(this, arguments);
}

function Window_NumberInput() {
    this.initialize.apply(this, arguments);
}

function Window_EventItem() {
    this.initialize.apply(this, arguments);
}

function Window_Message() {
    this.initialize.apply(this, arguments);
}

function Window_ScrollText() {
    this.initialize.apply(this, arguments);
}

function Window_MapName() {
    this.initialize.apply(this, arguments);
}

function Window_BattleLog() {
    this.initialize.apply(this, arguments);
}

function Window_PartyCommand() {
    this.initialize.apply(this, arguments);
}

function Window_ActorCommand() {
    this.initialize.apply(this, arguments);
}

function Window_BattleStatus() {
    this.initialize.apply(this, arguments);
}

function Window_BattleActor() {
    this.initialize.apply(this, arguments);
}

function Window_BattleEnemy() {
    this.initialize.apply(this, arguments);
}

function Window_BattleSkill() {
    this.initialize.apply(this, arguments);
}

function Window_BattleItem() {
    this.initialize.apply(this, arguments);
}

function Window_TitleCommand() {
    this.initialize.apply(this, arguments);
}

function Window_GameEnd() {
    this.initialize.apply(this, arguments);
}

function Window_DebugRange() {
    this.initialize.apply(this, arguments);
}

function Window_DebugEdit() {
    this.initialize.apply(this, arguments);
}

