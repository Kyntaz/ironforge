import "zx/globals";
import { Manifest, Project, readManifest, writeManifest } from "./manifest";
import { ARCHIVE_PATH } from "./archive";

export async function newCommand(name: string, tags: string[]): Promise<void> {
    const manifest = await readManifest();
    if (manifest.projects.some((project) => project.name === name)) throw new Error(`Project ${name} already exists.`);
    if (!tags.every((tag) => manifest.allTags.includes(tag))) throw new Error("Creating a project with unknown tags. Create the tags first.");

    const archived = await fs.exists(path.join(ARCHIVE_PATH, `${name}.zip`));
    const now = new Date();
    const project: Project = {
        name,
        tags,
        archived,
        createdOn: now.toISOString(),
        openedOn: now.toISOString(),
    };
    const newManifest: Manifest = {
        ...manifest,
        projects: [...manifest.projects, project],
    };

    await writeManifest(newManifest);

    if (!archived) {
        const projectPath = path.join("/projects/", name);
        await fs.ensureDir(projectPath);
        console.log(chalk.green(`Project ${name} created successfully!`));
    } else {
        console.log(chalk.green(`Project ${name} created successfully from archive!`));
    }
}
