import { Lucid } from "https://deno.land/x/lucid@0.10.7/mod.ts";
 
const lucid = await Lucid.new(undefined, "Preview");
 
const voterSeed = lucid.utils.generateSeedPhrase();
await Deno.writeTextFile("voter1.seed", voterSeed);
