# Warframe Wiki Scraper

## Overview

This project is a web scraping script that extracts detailed data about Warframes from the [Warframe Wiki](https://warframe.fandom.com/wiki/WARFRAME_Wiki). It collects information such as general attributes, abilities, and descriptions of each Warframe and stores the data in a structured JSON file.

The script is built using **Node.js** and **Puppeteer** for browser automation.

---

## Features

- **Data Collected**:
  - General Information (e.g., health, shields, armor, energy, mastery rank, etc.)
  - Abilities (including their details)
  - Passive abilities
  - Description and additional metadata

- **Output**:
  - The data is saved in a `JSON` file (`warframes-data.json`), structured for easy integration into other projects.

---

## Installation

### Prerequisites
- Node.js (v16 or later recommended)
- npm or yarn
- Basic knowledge of web scraping and Puppeteer

### Setup
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/warframe-wiki-scraper.git
   cd warframe-wiki-scraper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
### Usage
1. Run the scraper:
   ```bash
   node warframe-scraping.js
   ```

### The script will:
- Launch a headless browser.
- Navigate to the Warframe Wiki.
- Scrape data for all Warframes.
- Save the data as warframes-data.json in the project directory.
  
### Customization
- Update the URL or selectors in the script to scrape additional data or handle future changes to the Warframe Wiki structure.
- Modify the JSON structure to suit your specific requirements.

