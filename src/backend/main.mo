import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  // Initialize the user system state (authorization)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type ModSettings = {
    infiniteHealthEnabled : Bool;
    infiniteManaEnabled : Bool;
    noclipEnabled : Bool;
    moonJumpEnabled : Bool;
  };

  type Item = {
    name : Text;
    typeId : Nat32;
  };

  type ItemSpawner = {
    items : [Item];
  };

  public type UserProfile = {
    name : Text;
    itemSpawner : ItemSpawner;
    modSettings : ModSettings;
    processSelector : ProcessSelector; // New field
  };

  public type ProcessSelector = {
    selectedProcess : ?Text;
  };

  public type AvailableProcesses = {
    processes : [Text];
    lastUpdated : Time.Time;
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
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile does not exist") };
      case (?profile) { profile.modSettings };
    };
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

    let userProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile does not exist") };
      case (?profile) { profile };
    };

    let itemsArray = userProfile.itemSpawner.items;
    let newItems = itemsArray.concat([item]);
    let newItemSpawner = { items = newItems };

    let newProfile : UserProfile = {
      name = userProfile.name;
      itemSpawner = newItemSpawner;
      modSettings = userProfile.modSettings;
      processSelector = userProfile.processSelector; // Carry over existing process selector
    };

    userProfiles.add(caller, newProfile);
  };

  // Persist process selector
  public shared ({ caller }) func setProcessSelector(processSelector : ProcessSelector) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set process selector");
    };
    let userProfile = getUserProfileInternal(caller);
    let newProfile : UserProfile = { userProfile with processSelector };
    userProfiles.add(caller, newProfile);
  };

  public query ({ caller }) func getProcessSelector() : async ProcessSelector {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get process selector");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile does not exist") };
      case (?profile) { profile.processSelector };
    };
  };

  // Manage available processes
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
    availableProcesses;
  };

  // Internal method to get user profile safely
  func getUserProfileInternal(caller : Principal) : UserProfile {
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile does not exist") };
      case (?profile) { profile };
    };
  };
};
