export type Project = {
    name: string;
    tags: string[];
    archived: boolean;
    createdOn: string;
    openedOn: string;
}

export type Manifest = {
    projects: Project[];
    allTags: string[];
}

export const MANIFEST_PATH = "/projects/.manifest.json";

export async function readManifest(): Promise<Manifest> {
    return fs.readJSON(MANIFEST_PATH);
}

export async function writeManifest(manifest: Manifest): Promise<void> {
    return fs.writeJSON(MANIFEST_PATH, manifest, {
        spaces: 4,
    });
}
