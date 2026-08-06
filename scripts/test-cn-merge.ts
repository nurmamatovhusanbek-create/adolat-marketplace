// Quick test to verify cn() preserves both max-w-[calc(100vw-2rem)] and sm:max-w-6xl
import { cn } from "@/lib/utils";

const result = cn(
  "w-full",
  "max-w-[calc(100vw-2rem)]",
  "sm:max-w-6xl",
  "p-0"
);

console.log("Result:", result);
console.log("");
console.log("Expected: contains both max-w-[calc(100vw-2rem)] AND sm:max-w-6xl");
console.log("Has calc:", result.includes("max-w-[calc(100vw-2rem)]"));
console.log("Has sm:max-w-6xl:", result.includes("sm:max-w-6xl"));
