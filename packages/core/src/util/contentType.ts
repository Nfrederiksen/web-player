import { ManifestType } from "./constants";

const CONTENT_TYPE_MAP = {
  "application/x-mpegURL": ManifestType.HLS,
  "application/octet-stream": ManifestType.UNKNOWN,
  "binary/octet-stream": ManifestType.UNKNOWN,
  "application/vnd.apple.mpegurl": ManifestType.HLS,
  "application/dash+xml": ManifestType.DASH,
  "application/vnd.apple.mpegurl;charset=UTF-8": ManifestType.HLS,
  "application/vnd.ms-sstr+xml": ManifestType.MSS
};

export const MANIFEST_TYPE_MAP = {
  [ManifestType.HLS]: 'application/vnd.apple.mpegurl',
  [ManifestType.DASH]: 'application/dash+xml',
  [ManifestType.MSS]: 'application/vnd.ms-sstr+xml'
}

export function canPlayManifestType(manifestType: ManifestType): boolean {
  return !!document.createElement('video').canPlayType(MANIFEST_TYPE_MAP[manifestType]);
}

export function getManifestType(uri): Promise<ManifestType> {
  return fetch(uri)
    .then(resp => {
      let type = CONTENT_TYPE_MAP[resp.headers.get("content-type")];
      if (!type) {
        if (uri.match(/\.m3u8/)) {
          return ManifestType.HLS;
        } else if (uri.match(/\.mpd/)) {
          return ManifestType.DASH;
        } else if (uri.toLowerCase().match(/\/manifest/)) {
          return ManifestType.MSS;
        }
        return ManifestType.UNKNOWN;
      } 
      return type;
    })
    .catch(() => {
      return ManifestType.UNKNOWN;
    });
}
