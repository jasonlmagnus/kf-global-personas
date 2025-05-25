# API Documentation

## CSV Data API

### Overview

The `/api/data` endpoint provides access to CSV source files from the `data/__src` directory. This endpoint is designed to work consistently across both local development and Vercel deployment.

### Endpoints

#### GET /api/data

Download a specific CSV file.

**Parameters:**

- `file` (required): The name of the CSV file to download

**Example:**

```bash
curl "http://localhost:3000/api/data?file=global_ceo.csv"
```

**Available Files:**

- `global_ceo.csv`
- `2025_global_data.csv`
- `Korn Ferry open ends Senior Leader Survey April 2025(Textual Data).csv`

**Response:**

- Content-Type: `text/csv`
- Returns the raw CSV content
- Includes appropriate caching headers

#### POST /api/data

List all available CSV files.

**Example:**

```bash
curl -X POST "http://localhost:3000/api/data"
```

**Response:**

```json
{
  "files": [
    {
      "name": "global_ceo.csv",
      "size": 28485,
      "lastModified": "2025-05-17T07:42:41.680Z"
    }
  ],
  "count": 3,
  "endpoint": "/api/data?file=<filename>"
}
```

## Personas API Updates

### \_\_src Region Handling

The `/api/personas` endpoint now gracefully handles the `__src` region instead of returning 404 errors.

**Example:**

```bash
curl "http://localhost:3000/api/personas?region=__src&department=ceo"
```

**Response:**

```json
{
  "message": "CSV data source region",
  "note": "This region contains source CSV files, not persona JSON files",
  "availableFiles": ["global_ceo.csv", "2025_global_data.csv", "..."],
  "csvEndpoint": "/api/data?file=<filename>",
  "listEndpoint": "POST /api/data"
}
```

## Dashboard Integration

Dashboards can now connect to CSV data using:

1. **List available files:** `POST /api/data`
2. **Download specific file:** `GET /api/data?file=<filename>`

This approach ensures consistent behavior between local development and Vercel deployment environments.
