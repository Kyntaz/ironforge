import "zx/globals";
import { Manifest, readManifest, writeManifest } from "./manifest";
import { userConfirm } from "./utils";
import { archivePath } from "./archive";

export async function deleteCommand(name: string): Promise<void> {
    const manifest = await readManifest();
    const project = manifest.projects.find((project) => project.name === name);
    if (!project) throw new Error(`Project ${name} doesn't exist.`);
    await userConfirm(chalk.yellow(`Are you sure you want to delete project ${name}? `));

    const newManifest: Manifest = {
        ...manifest,
        projects: manifest.projects.filter((project) => project.name !== name),
    }
    await writeManifest(newManifest);

    if (project.archived) {
        await userConfirm(chalk.yellow(`Are you sure you want to permanently delete the project ${name} from the archive? `));

        await fs.rm(archivePath(name));
        console.log(chalk.red(`Project ${name} successfully deleted from archive!`));
    } else {
        const projectPath = path.join("/projects", name);
        await userConfirm(chalk.yellow(`Are you sure you want to delete the path ${projectPath}? `));
        await fs.rm(projectPath, { recursive: true });
        console.log(chalk.red(`Project ${name} successfully deleted!`));
    }
}
