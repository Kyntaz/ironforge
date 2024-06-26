import "zx/globals";

export async function userConfirm(prompt: string): Promise<void> {
    if (!(await question(prompt)).toLowerCase().startsWith("y")) {
        throw new Error("User canceled the operation.");
    }
}

export async function userCheck(prompt: string): Promise<boolean> {
    return (await question(prompt)).toLowerCase().startsWith("y")
}

function djb2(str: string): number {
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return hash;
}
  
export function hashStringToColor(str: string): string {
    var hash = djb2(str);
    var r = (hash & 0xFF0000) >> 16;
    var g = (hash & 0x00FF00) >> 8;
    var b = hash & 0x0000FF;
    return "#" + ("0" + r.toString(16)).substring(-2) + ("0" + g.toString(16)).substring(-2) + ("0" + b.toString(16)).substring(-2);
}
