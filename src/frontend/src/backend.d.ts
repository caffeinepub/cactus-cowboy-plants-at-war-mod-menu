import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ItemSpawner {
    items: Array<Item>;
}
export type Time = bigint;
export interface Item {
    name: string;
    typeId: number;
}
export interface ModSettings {
    noclipEnabled: boolean;
    infiniteManaEnabled: boolean;
    moonJumpEnabled: boolean;
    infiniteHealthEnabled: boolean;
}
export interface ProcessSelector {
    selectedProcess?: string;
}
export interface UserProfile {
    modSettings: ModSettings;
    processSelector: ProcessSelector;
    name: string;
    itemSpawner: ItemSpawner;
}
export interface AvailableProcesses {
    lastUpdated: Time;
    processes: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addItem(item: Item): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAvailableProcesses(): Promise<AvailableProcesses>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getItemSpawner(): Promise<ItemSpawner | null>;
    getModSettings(): Promise<ModSettings>;
    getProcessSelector(): Promise<ProcessSelector>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setProcessSelector(processSelector: ProcessSelector): Promise<void>;
    updateAvailableProcesses(processes: Array<string>): Promise<void>;
}
