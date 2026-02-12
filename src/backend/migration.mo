import Map "mo:core/Map";
import Nat32 "mo:core/Nat32";
import Float "mo:core/Float";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

module {
  public type OldModSettings = {
    infiniteHealthEnabled : Bool;
    infiniteManaEnabled : Bool;
    noclipEnabled : Bool;
    moonJumpEnabled : Bool;
  };

  public type NewModSettings = {
    flyEnabled : Bool;
    superSpeedEnabled : Bool;
    superSpeedMultiplier : Float;
    superJumpEnabled : Bool;
    superJumpMultiplier : Float;
    disableMonsters : Bool;
  };

  public type Item = {
    name : Text;
    typeId : Nat32;
  };

  public type OldItemSpawner = {
    items : [Item];
  };

  public type NewItemSpawner = {
    items : [Item];
    spawnHistory : [Text];
  };

  public type Prefab = {
    name : Text;
    prefabId : Text;
    position : Text;
  };

  public type NewPrefabSpawner = {
    prefabs : [Prefab];
    spawnHistory : [Text];
  };

  public type OldUserProfile = {
    name : Text;
    itemSpawner : OldItemSpawner;
    modSettings : OldModSettings;
    processSelector : {
      selectedProcess : ?Text;
    };
  };

  public type NewUserProfile = {
    name : Text;
    itemSpawner : NewItemSpawner;
    prefabSpawner : NewPrefabSpawner;
    modSettings : NewModSettings;
    processSelector : {
      selectedProcess : ?Text;
    };
  };

  public type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    availableProcesses : {
      processes : [Text];
      lastUpdated : Time.Time;
    };
  };

  public type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    availableProcesses : {
      processes : [Text];
      lastUpdated : Time.Time;
    };
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        {
          name = oldProfile.name;
          itemSpawner = migrateItemSpawner(oldProfile.itemSpawner);
          prefabSpawner = {
            prefabs = [];
            spawnHistory = [];
          };
          modSettings = migrateModSettings(oldProfile.modSettings);
          processSelector = oldProfile.processSelector;
        };
      }
    );
    {
      userProfiles = newUserProfiles;
      availableProcesses = old.availableProcesses;
    };
  };

  func migrateItemSpawner(oldItemSpawner : OldItemSpawner) : NewItemSpawner {
    {
      items = oldItemSpawner.items;
      spawnHistory = [];
    };
  };

  func migrateModSettings(old : OldModSettings) : NewModSettings {
    {
      flyEnabled = old.noclipEnabled;
      superSpeedEnabled = false;
      superSpeedMultiplier = 1.0;
      superJumpEnabled = old.moonJumpEnabled;
      superJumpMultiplier = 1.0;
      disableMonsters = false;
    };
  };
};
