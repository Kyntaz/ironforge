import "zx/globals";
import { Manifest, readManifest, writeManifest } from "./manifest";
import { archivePath } from "./archive";
import { extract } from "zip-lib";

export async function openCommand(name: string): Promise<void> {
    const manifest = await readManifest();
    const project = manifest.projects.find((project) => project.name === name);
    if (!project) throw new Error(`Project ${name} doesn't exist.`);

    const projectPath = path.join("/projects", name);
    if (project.archived) {
        console.log(chalk.blue("Moving project out of archive."));
        await fs.ensureDir(projectPath);
        await extract(archivePath(name), projectPath);
        await fs.rm(archivePath(name));
    }

    const newManifest: Manifest = {
        ...manifest,
        projects: [
            ...manifest.projects.filter((project) => project.name !== name),
            {
                ...project,
                archived: false,
                openedOn: new Date().toISOString(),
            },
        ],
    };
    await writeManifest(newManifest);

    await $`ii /projects/${name}`;
    console.log(chalk.green(`Opened project ${name}!`));
}
