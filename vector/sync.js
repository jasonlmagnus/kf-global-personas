#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Configuration
const DATA_DIR = "../data";
const PUBLIC_DATA_DIR = "../public/data";
const VECTOR_DIR = "./";

// Color codes for console output
const colors = {
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getPersonaFiles(baseDir) {
  const files = [];

  function scanDirectory(dir, relativePath = "") {
    try {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const itemRelativePath = path.join(relativePath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scanDirectory(fullPath, itemRelativePath);
        } else if (item.endsWith(".json") && !item.includes("template")) {
          // Extract region and role from path
          const pathParts = itemRelativePath.split(path.sep);

          if (pathParts.length >= 3) {
            const region = pathParts[0];
            const role = pathParts[1];
            const filename = pathParts[2];

            // Skip template files
            if (filename.includes("template")) continue;

            // Handle versioned files
            let version = "";
            if (filename.includes("_v3")) {
              version = "_v3";
            }

            const newName = `${region}_${role}${version}.json`;

            files.push({
              sourcePath: fullPath,
              targetName: newName,
              region,
              role,
              version,
              originalPath: itemRelativePath,
            });
          }
        }
      }
    } catch (error) {
      log(`Error scanning directory ${dir}: ${error.message}`, "red");
    }
  }

  scanDirectory(baseDir);
  return files;
}

function syncFiles() {
  log("🔄 Starting persona file sync...", "blue");

  // Get files from both data directories
  const dataFiles = getPersonaFiles(DATA_DIR);
  const publicDataFiles = getPersonaFiles(PUBLIC_DATA_DIR);

  // Combine and deduplicate (prefer v3 versions)
  const allFiles = [...dataFiles, ...publicDataFiles];
  const uniqueFiles = new Map();

  for (const file of allFiles) {
    const key = `${file.region}_${file.role}`;

    // If we already have this persona, prefer the v3 version
    if (uniqueFiles.has(key)) {
      const existing = uniqueFiles.get(key);
      if (file.version === "_v3" && existing.version !== "_v3") {
        uniqueFiles.set(key, file);
      }
    } else {
      uniqueFiles.set(key, file);
    }
  }

  let copiedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  // Copy files to vector directory
  for (const [key, file] of uniqueFiles) {
    try {
      const targetPath = path.join(VECTOR_DIR, file.targetName);

      // Check if file needs updating
      let needsUpdate = true;

      if (fs.existsSync(targetPath)) {
        const sourceStats = fs.statSync(file.sourcePath);
        const targetStats = fs.statSync(targetPath);

        // Compare modification times
        if (sourceStats.mtime <= targetStats.mtime) {
          needsUpdate = false;
        }
      }

      if (needsUpdate) {
        fs.copyFileSync(file.sourcePath, targetPath);
        log(`✅ Copied: ${file.originalPath} → ${file.targetName}`, "green");
        copiedCount++;
      } else {
        log(`⏭️  Skipped: ${file.targetName} (up to date)`, "yellow");
        skippedCount++;
      }
    } catch (error) {
      log(`❌ Error copying ${file.originalPath}: ${error.message}`, "red");
      errorCount++;
    }
  }

  // Summary
  log("\n📊 Sync Summary:", "bold");
  log(`   Files copied: ${copiedCount}`, "green");
  log(`   Files skipped: ${skippedCount}`, "yellow");
  log(`   Errors: ${errorCount}`, errorCount > 0 ? "red" : "green");
  log(`   Total unique personas: ${uniqueFiles.size}`, "blue");

  if (copiedCount > 0) {
    log("\n🎉 Sync completed successfully!", "green");
  } else {
    log("\n✨ All files are up to date!", "blue");
  }
}

function watchFiles() {
  log("👀 Starting file watcher...", "blue");
  log("Press Ctrl+C to stop watching\n", "yellow");

  // Initial sync
  syncFiles();

  // Watch for changes
  const watchOptions = { recursive: true };

  fs.watch(DATA_DIR, watchOptions, (eventType, filename) => {
    if (filename && filename.endsWith(".json")) {
      log(`\n🔔 Detected change in ${filename}`, "yellow");
      setTimeout(syncFiles, 100); // Small delay to ensure file write is complete
    }
  });

  if (fs.existsSync(PUBLIC_DATA_DIR)) {
    fs.watch(PUBLIC_DATA_DIR, watchOptions, (eventType, filename) => {
      if (filename && filename.endsWith(".json")) {
        log(`\n🔔 Detected change in public/${filename}`, "yellow");
        setTimeout(syncFiles, 100);
      }
    });
  }
}

function showHelp() {
  log("📚 Persona File Sync Tool", "bold");
  log("");
  log("Usage:", "blue");
  log("  node sync.js [command]", "yellow");
  log("");
  log("Commands:", "blue");
  log("  sync     Sync files once and exit (default)");
  log("  watch    Sync files and watch for changes");
  log("  help     Show this help message");
  log("");
  log("Examples:", "blue");
  log("  node sync.js         # Sync once");
  log("  node sync.js sync    # Sync once");
  log("  node sync.js watch   # Sync and watch for changes");
}

// Main execution
const command = process.argv[2] || "sync";

switch (command) {
  case "sync":
    syncFiles();
    break;
  case "watch":
    watchFiles();
    break;
  case "help":
  case "--help":
  case "-h":
    showHelp();
    break;
  default:
    log(`❌ Unknown command: ${command}`, "red");
    log('Run "node sync.js help" for usage information', "yellow");
    process.exit(1);
}
