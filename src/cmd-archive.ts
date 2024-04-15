import "zx/globals";
import { Manifest, readManifest, writeManifest } from "./manifest";
import { userCheck } from "./utils";
import { archivePath } from "./archive";
import { isGitIgnored } from "globby";
import { archiveFolder } from "zip-lib";

export async function archiveCommand(name: string): Promise<void> {
    const manifest = await readManifest();
    const project = manifest.projects.find((project) => project.name === name);
    if (!project) throw new Error(`Project ${name} doesn't exist.`);
    if (project.archived) throw new Error(`Project ${name} is already archived.`);

    const projectPath = path.join("/projects", name);
    const hasIgnore = await fs.exists(path.join(projectPath, ".gitignore"));
    if (hasIgnore && await userCheck(chalk.yellow("Should I clean the project? "))) {
        const isIgnored = await isGitIgnored({ cwd: projectPath });
        const files = await glob(`/projects/${name}/**/*`);
        console.log(files);
        for (const file of files) {
            if (isIgnored(file) && await userCheck(chalk.yellow(`${file}: `))) {
                await fs.remove(file);
            }
        }
    }

    await archiveFolder(projectPath, archivePath(name));
    console.log(chalk.green("Archive successfully updated."));

    const newManifest: Manifest = {
        ...manifest,
        projects: [
            ...manifest.projects.filter((project) => project.name !== name),
            {
                ...project,
                archived: true,
                openedOn: new Date().toISOString(),
            },
        ],
    };
    await writeManifest(newManifest);

    if (await userCheck(chalk.yellow(`Can I delete the archived project as ${projectPath}? `))) {
        await fs.rm(projectPath, { recursive: true });
    }
}
