# Korn Ferry Personas Platform

This platform provides a centralized library of global and regional personas for Korn Ferry.

## Features

- Displays detailed persona information.
- Supports different persona versions (v1 and v3).
- Differentiates between Global and Regional personas.
- Password protected access.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd kfpersonas
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    The application will be available at `http://localhost:3000`.

## Privacy & Search Engine Protection

This platform implements comprehensive multi-layered protection to prevent search engine indexing and ensure content remains private. The system is designed for exclusive access and includes multiple redundant security measures.

🛡️ **Protection Layers**

1.  **HTML Meta Tags** (Applied in `src/app/layout.tsx`)

    ```html
    <meta
      name="robots"
      content="noindex, nofollow, noarchive, nosnippet, noimageindex"
    />
    <meta name="googlebot" content="noindex, nofollow" />
    <meta name="bingbot" content="noindex, nofollow" />
    ```

    - **Purpose**: Browser-level instructions to search engines.
    - **Coverage**: All major search engines and crawlers.

2.  **`robots.txt`** (Located in `public/robots.txt`)

    ```
    User-agent: *
    Disallow: /

    # Specific blocks for major search engines
    User-agent: Googlebot
    Disallow: /

    User-agent: Bingbot
    Disallow: /

    # Social media crawlers
    User-agent: facebookexternalhit
    Disallow: /
    ```

    - **Purpose**: Standard protocol for web crawlers.
    - **Coverage**: Universal crawler blocking.

3.  **Server-Level HTTP Headers** (Configured in `next.config.js`)

    ```javascript
    // next.config.js
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "X-Robots-Tag",
              value: "noindex, nofollow, noarchive, nosnippet, noimageindex",
            },
            {
              key: "X-Frame-Options",
              value: "DENY",
            },
          ],
        },
      ];
    }
    ```

    - **Purpose**: Server-level enforcement of indexing restrictions.
    - **Coverage**: HTTP header-based protection for all requests.

🎯 **What's Protected**

| Protection Type       | Coverage          | Implementation                                     |
| :-------------------- | :---------------- | :------------------------------------------------- |
| Google Search         | ✅ Complete Block | Meta tags + `robots.txt` + HTTP Headers            |
| Bing Search           | ✅ Complete Block | Meta tags + `robots.txt` + HTTP Headers            |
| Yahoo/DuckDuckGo      | ✅ Complete Block | `robots.txt` + HTTP Headers                        |
| Social Media Previews | ✅ Complete Block | `robots.txt` (Facebook, Twitter, LinkedIn, etc.)   |
| Web Archives          | ✅ Complete Block | `noarchive` directive in all layers                |
| Image Indexing        | ✅ Complete Block | `noimageindex` directive                           |
| Search Snippets       | ✅ Complete Block | `nosnippet` directive                              |
| Frame Embedding       | ✅ Complete Block | `X-Frame-Options: DENY` HTTP Header                |
| Generic Scrapers      | ✅ Complete Block | Broad disallow in `robots.txt` & header directives |

🔍 **Verification Methods**

1.  **Verify `robots.txt`**:
    Navigate to `http://localhost:3000/robots.txt` (or your deployed domain) in your browser. You should see the content of your `robots.txt` file.

2.  **Check HTTP Headers**:
    Use browser developer tools (Network tab) or a command-line tool like `curl` to inspect the HTTP headers for any page on your site. Look for `X-Robots-Tag` and `X-Frame-Options`.

    ```bash
    curl -I http://localhost:3000/
    ```

3.  **Test Search Engine Visibility (after deployment to a public URL)**:

    - Google: `site:your-domain.com` (should return no results or a message indicating the site is disallowed by `robots.txt`).
    - Bing: `site:your-domain.com` (similar results to Google).

    _Note: It can take time for search engines to de-index content if it was previously indexed. For a new site with these protections from the start, it should not appear in search results._
