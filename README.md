<h1>
  <br>
  NIMFinder.com
  <br>
</h1>

Deployed to [https://nim-finder-hdpz.netlify.app](https://nim-finder-hdpz.netlify.app)

## Description

NIMFinder.com is a web application that can be used to find the NIM of students from ITB and UI.

## Requirement

An adequate version of:

- nodejs & pnpm

## How to Run

Steps to run this project:

1. Clone this repository
2. Run `pnpm install`
3. Run `pnpm dev`

## How to Get Updated Data - ITB

You can use the data in this repository as base. However, as the time goes by, there will be new students and new PDDIKTI status. You can use the following steps to get the updated data:

1. Scrape data from university data sources.
2. Parse the data from university data sources and generate list of queries in this format: "{nim} ITB {nama}". Example: "13517105 ITB Muhammad Hendry Prasetya".
3. Scrape data from PDDIKTI -> Fetch by query -> Use the "id" from the response to get the mahasiswa detail from PDDIKTI.
4. Merge the data from university data sources and PDDIKTI. The data from PDDIKTI will be used to update the status of the mahasiswa. The data from university data sources will be used to update the nim and name of the mahasiswa.

## Tools Related

- Scraper for university data sources -> [itb-nim-scrapper](https://github.com/hendpraz/itb-nim-scrapper)
- Scraper for PDDIKTI -> [PDDIKTI-kemdikbud-API](https://github.com/hendpraz/PDDIKTI-kemdikbud-API)
- NIMFinder.com Backend -> [nim-finder-backend](https://github.com/hendpraz/nim-finder-backend)
