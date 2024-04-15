import "zx/globals";
import { Project, readManifest } from "./manifest";
import { hashStringToColor } from "./utils";
import { distance } from "fastest-levenshtein";

const tagFilters = {
    0: () => true,
    1: (project: Project, tags: string[]) => project.tags.some((tag) => tags.includes(tag)),
    2: (project: Project, tags: string[]) => project.tags.every((tag) => tags.includes(tag)),
}

const nameFilters = {
    0: () => true,
    1: (project: Project, name: string) => project.name.includes(name),
    2: (project: Project, name: string) => project.name === name,
}

function format(project: Project): string {
    return `${chalk.hex(hashStringToColor(project.name)).bold(project.name)} (${project.tags.map((tag) => chalk.hex(hashStringToColor(tag))(tag)).join(", ")})`
        + (project.archived ? (" " + chalk.red.underline("ARCHIVED")) : "");
}

function tagScore(project: Project, tags: string[]): number {
    return tags.filter((tag) => project.tags.includes(tag)).length;
}

function nameScore(project: Project, name: string): number {
    const d = distance(project.name, name);
    return (1 / (d + 1)) * 10;
}

export async function lsCommand(name?: string, tags?: string[], strict: number = 1): Promise<void> {
    const manifest = await readManifest();
    const projects = manifest.projects.filter((project) => (!name || nameFilters[strict](project, name)) && (!tags || tagFilters[strict](project, tags)));
    const scores = projects.map((project) => ({
        project,
        score: (name ? nameScore(project, name) : 0) + (tags ? tagScore(project, tags) : 0),
    }));

    const activeScores = scores.filter((score) => !score.project.archived).sort((s1, s2) => s2.score - s1.score);
    const archivedScores = scores.filter((score) => score.project.archived).sort((s1, s2) => s2.score - s1.score);

    const lines = [...activeScores, ...archivedScores].map((score) => format(score.project));
    console.log(lines.join("\n"));
}
