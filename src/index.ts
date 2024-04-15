import "zx/globals";
import { Command } from "commander";
import { newCommand } from "./cmd-new";
import { deleteCommand } from "./cmd-delete";
import { archiveCommand } from "./cmd-archive";
import { openCommand } from "./cmd-open";
import { tagCommand } from "./cmd-tag";
import { lsCommand } from "./cmd-ls";

$.shell = "pwsh";
$.prefix = "";
const ironforge = new Command();

ironforge.name("ironforge");

ironforge.command("new")
    .description("Create a new project.")
    .argument("<name>", "The name of the project.")
    .option("-t, --tags [tags...]", "Specify the tags for the project.")
    .action((name, options) => newCommand(name, options.tags ?? []));

ironforge.command("delete")
    .description("Delete a project.")
    .argument("<name>", "The name of the project.")
    .action((name) => deleteCommand(name));

ironforge.command("archive")
    .description("Archive a project.")
    .argument("<name>", "The name of the project.")
    .action((name) => archiveCommand(name));

ironforge.command("open")
    .description("Open a project. If it is archived, unarchive it.")
    .argument("<name>", "The name of the project.")
    .action((name) => openCommand(name));

ironforge.command("tag")
    .description("Tag a project or create a new tag.")
    .argument("[tags...]", "Tags to modify")
    .option("-c, --create", "Whether the tags should be created if they do not exist.")
    .option("-r, --remove", "Whether the tags should be removed instead of added.")
    .option("-p, --project <name>", "The project to add the tags to, or remove from.")
    .action((tags, options) => tagCommand(tags ?? [], options.create, options.remove, options.project));

ironforge.command("ls")
    .description("Find projects or get information about a project.")
    .option("-n, --name <name>", "Name of the project you're looking for.")
    .option("-t, --tags <tags...>", "Tags in the project you're looking for.")
    .option("-s, --strict <level>", "Level of strictness of the search.")
    .action((options) => lsCommand(options.name, options.tags, parseInt(options.strict ?? "1")));

ironforge.parse();
