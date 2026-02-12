import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the user system state (authorization)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type ModSettings = {
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

  public type ItemSpawner = {
    items : [Item];
    spawnHistory : [Text];
  };

  public type Prefab = {
    name : Text;
    prefabId : Text;
    position : Text;
  };

  public type PrefabSpawner = {
    prefabs : [Prefab];
    spawnHistory : [Text];
  };

  public type ProcessSelector = {
    selectedProcess : ?Text;
  };

  public type AvailableProcesses = {
    processes : [Text];
    lastUpdated : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    itemSpawner : ItemSpawner;
    prefabSpawner : PrefabSpawner;
    modSettings : ModSettings;
    processSelector : ProcessSelector;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  var availableProcesses : AvailableProcesses = {
    processes = [];
    lastUpdated = 0;
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getModSettings() : async ModSettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve mod settings");
    };
    getUserProfileInternal(caller).modSettings;
  };

  public shared ({ caller }) func updateModSettings(newSettings : ModSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update mod settings");
    };
    updateProfileField(caller, func(profile) { { profile with modSettings = newSettings } });
  };

  public query ({ caller }) func getItemSpawner() : async ?ItemSpawner {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve item spawner");
    };
    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { ?profile.itemSpawner };
    };
  };

  public shared ({ caller }) func addItem(item : Item) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items");
    };

    let userProfile = getUserProfileInternal(caller);
    let itemsArray = userProfile.itemSpawner.items;
    let newItems = itemsArray.concat([item]);
    let newItemSpawner = {
      items = newItems;
      spawnHistory = userProfile.itemSpawner.spawnHistory;
    };
    updateProfileField(caller, func(profile) { { profile with itemSpawner = newItemSpawner } });
  };

  public shared ({ caller }) func clearItems() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear items");
    };
    updateProfileField(
      caller,
      func(profile) {
        {
          profile with itemSpawner = { profile.itemSpawner with items = [] }
        };
      },
    );
  };

  public shared ({ caller }) func addSpawnHistory(record : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add spawn history");
    };

    let userProfile = getUserProfileInternal(caller);
    let updatedHistory = userProfile.itemSpawner.spawnHistory.concat([record]);
    let newItemSpawner = {
      userProfile.itemSpawner with spawnHistory = updatedHistory
    };
    updateProfileField(caller, func(profile) { { profile with itemSpawner = newItemSpawner } });
  };

  public shared ({ caller }) func setProcessSelector(processSelector : ProcessSelector) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set process selector");
    };
    updateProfileField(caller, func(profile) { { profile with processSelector } });
  };

  public query ({ caller }) func getProcessSelector() : async ProcessSelector {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get process selector");
    };
    getUserProfileInternal(caller).processSelector;
  };

  public shared ({ caller }) func updateAvailableProcesses(processes : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update available processes");
    };
    availableProcesses := {
      processes;
      lastUpdated = Time.now();
    };
  };

  public query ({ caller }) func getAvailableProcesses() : async AvailableProcesses {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve available processes");
    };
    availableProcesses;
  };

  public query ({ caller }) func getPrefabSpawner() : async ?PrefabSpawner {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve prefab spawner");
    };
    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { ?profile.prefabSpawner };
    };
  };

  public shared ({ caller }) func addPrefab(prefab : Prefab) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add prefabs");
    };

    let userProfile = getUserProfileInternal(caller);
    let prefabsArray = userProfile.prefabSpawner.prefabs;
    let newPrefabs = prefabsArray.concat([prefab]);
    let newPrefabSpawner = {
      prefabs = newPrefabs;
      spawnHistory = userProfile.prefabSpawner.spawnHistory;
    };
    updateProfileField(caller, func(profile) { { profile with prefabSpawner = newPrefabSpawner } });
  };

  public shared ({ caller }) func clearPrefabs() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear prefabs");
    };
    updateProfileField(
      caller,
      func(profile) {
        {
          profile with prefabSpawner = { profile.prefabSpawner with prefabs = [] }
        };
      },
    );
  };

  public shared ({ caller }) func addPrefabSpawnHistory(record : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add prefab spawn history");
    };

    let userProfile = getUserProfileInternal(caller);
    let updatedHistory = userProfile.prefabSpawner.spawnHistory.concat([record]);
    let newPrefabSpawner = {
      userProfile.prefabSpawner with spawnHistory = updatedHistory
    };
    updateProfileField(caller, func(profile) { { profile with prefabSpawner = newPrefabSpawner } });
  };

  func getUserProfileInternal(caller : Principal) : UserProfile {
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile does not exist") };
      case (?profile) { profile };
    };
  };

  func updateProfileField(caller : Principal, updateFunc : UserProfile -> UserProfile) : () {
    let updatedProfile = updateFunc(getUserProfileInternal(caller));
    userProfiles.add(caller, updatedProfile);
  };
};
