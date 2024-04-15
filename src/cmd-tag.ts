import "zx/globals";
import { readManifest, writeManifest } from "./manifest";
import { hashStringToColor } from "./utils";

export async function tagCommand(tags: string[], create?: boolean, remove?: boolean, projectName?: string): Promise<void> {
    const manifest = await readManifest();

    if (tags.length === 0) {
        console.log("Tags:")
        const source = manifest.projects.find((project) => project.name === projectName)?.tags ?? manifest.allTags
        for (const tag of source) {
            console.log(chalk.hex(hashStringToColor(tag))(tag));
        }
        return;
    }

    if (!create && !tags.every((tag) => manifest.allTags.includes(tag))) throw new Error("Unknown tags found.");

    const newManifest = { ...manifest };

    if (create) {
        newManifest.allTags = [...new Set(newManifest.allTags.concat(tags))];
    }

    if (remove && !projectName) {
        newManifest.allTags = newManifest.allTags.filter((tag) => !tags.includes(tag));
    }

    if (projectName) {
        const project = newManifest.projects.find((project) => project.name === projectName);
        if (!project) throw new Error(`Can't find project ${projectName}.`);
        
        if (remove) {
            project.tags = project.tags.filter((tag) => !tags.includes(tag));
        } else {
            project.tags = [...new Set(project.tags.concat(tags))];
        }
    }

    writeManifest(newManifest);
} 
