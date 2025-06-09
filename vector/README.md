# Vector Directory

This directory contains persona JSON files with smart naming for vector store usage.

## File Naming Convention

Files are renamed from their original paths using the format: `{region}_{role}[_version].json`

Examples:

- `data/global/ceo/ceo.json` → `global_ceo.json`
- `data/uae/chro/chro.json` → `uae_chro.json`
- `public/data/global/talent/talent_v3.json` → `global_talent_v3.json`

## Sync Script

The `sync.js` script automatically maintains this directory by copying and renaming files from the source data directories.

### Usage

```bash
# Sync files once
node sync.js
# or
node sync.js sync

# Sync files and watch for changes
node sync.js watch

# Show help
node sync.js help
```

### Features

- ✅ **Smart deduplication**: Prefers v3 versions over regular versions
- ✅ **Incremental sync**: Only copies files that have changed
- ✅ **File watching**: Automatically syncs when source files change
- ✅ **Colored output**: Easy to read status messages
- ✅ **Error handling**: Graceful handling of missing files or permissions
- ✅ **Template filtering**: Skips template files automatically

### Source Directories

The script monitors these directories for changes:

- `../data/` - Main data directory with regional personas
- `../public/data/` - Public data directory (usually v3 files)

### File Structure

```
vector/
├── sync.js              # Sync script
├── README.md           # This file
├── global_ceo.json     # Global CEO persona
├── global_chro.json    # Global CHRO persona
├── uae_ceo.json        # UAE CEO persona
├── aus_talent.json     # Australia Talent persona
└── ...                 # All other personas
```

## Vector Store Integration

This naming convention makes it easy to:

1. **Identify personas** by region and role from filename
2. **Filter searches** by region (e.g., all UAE personas)
3. **Avoid naming conflicts** between similar roles in different regions
4. **Maintain consistency** across different vector store implementations

## Maintenance

Run `node sync.js` whenever you:

- Add new persona files
- Update existing persona files
- Want to ensure vector directory is up to date

Or use `node sync.js watch` during development to automatically sync changes.
