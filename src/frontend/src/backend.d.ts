import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PrefabSpawner {
    prefabs: Array<Prefab>;
    spawnHistory: Array<string>;
}
export interface ItemSpawner {
    spawnHistory: Array<string>;
    items: Array<Item>;
}
export interface AvailableProcesses {
    lastUpdated: Time;
    processes: Array<string>;
}
export type Time = bigint;
export interface Item {
    name: string;
    typeId: number;
}
export interface ModSettings {
    superSpeedEnabled: boolean;
    superJumpMultiplier: number;
    disableMonsters: boolean;
    superJumpEnabled: boolean;
    flyEnabled: boolean;
    superSpeedMultiplier: number;
}
export interface ProcessSelector {
    selectedProcess?: string;
}
export interface UserProfile {
    modSettings: ModSettings;
    processSelector: ProcessSelector;
    name: string;
    prefabSpawner: PrefabSpawner;
    itemSpawner: ItemSpawner;
}
export interface Prefab {
    name: string;
    position: string;
    prefabId: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addItem(item: Item): Promise<void>;
    addPrefab(prefab: Prefab): Promise<void>;
    addPrefabSpawnHistory(record: string): Promise<void>;
    addSpawnHistory(record: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearItems(): Promise<void>;
    clearPrefabs(): Promise<void>;
    getAvailableProcesses(): Promise<AvailableProcesses>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getItemSpawner(): Promise<ItemSpawner | null>;
    getModSettings(): Promise<ModSettings>;
    getPrefabSpawner(): Promise<PrefabSpawner | null>;
    getProcessSelector(): Promise<ProcessSelector>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setProcessSelector(processSelector: ProcessSelector): Promise<void>;
    updateAvailableProcesses(processes: Array<string>): Promise<void>;
    updateModSettings(newSettings: ModSettings): Promise<void>;
}
