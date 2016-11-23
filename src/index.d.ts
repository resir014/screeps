interface Game {}

interface Memory {
  uuid: number;
  log: any;
}

interface RemoteRoomMapping {
  parentRoom: string;
  remoteRoom: string;
  claim: boolean;
  scoutName: string;
}

declare function require(path: string): any;

interface Global {
  log: any;
}

declare var global: Global;
