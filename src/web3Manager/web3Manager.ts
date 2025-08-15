import createEdgeClient from "@honeycomb-protocol/edge-client";

const API_URL = "https://edge.test.honeycombprotocol.com/";

export const client = createEdgeClient(API_URL, true);
export var projectAddress: string = "";
export var AssemblerConfigAddress: string = "";
export var modelAddress: string = "";
export var treeAddress: string = "";
export var merkleTreeAddress: string = "";
export var missionPoolAddress: string = "";
export var resourceAddress: string = "";

export const admin = "2UUeuwCYChuXvxqsuSK1EE9N1xdB2Nv2tXhwW7dYhsXm";
export function setProjectAddress(address: string) {
    projectAddress = address;
}
export function setAssemblerConfigAddress(address: string) {
    AssemblerConfigAddress = address;
}
export function setModelAddress(address: string) {
    modelAddress = address;
}
export function setTreeAddress(address: string) {
    treeAddress = address;
}

export function setMerkleTree(address: string) {
    merkleTreeAddress = address;
}
export function setMissionPoolAddress(address: string) {
    missionPoolAddress = address;
}
export function setResourceAddress(address: string) {
    resourceAddress = address;
}

