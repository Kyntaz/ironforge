import "zx/globals";

export const ARCHIVE_PATH = "/projects/.archive";

export function archivePath(name: string): string {
    return path.join(ARCHIVE_PATH, `${name}.zip`);
}
