<h1>
  <br>
  ITB NIM Finder - Hendpraz
  <br>
</h1>

Deployed to [https://nim-finder-hdpz.netlify.app](https://nim-finder-hdpz.netlify.app)

## Description

ITB NIM Finder is a web application that can be used to find the NIM of ITB students.

## Requirement

An adequate version of:
- nodejs & npm

## How to Run

Steps to run this project:
1. Clone this repository
2. Run `npm install`
3. Run `npm run dev`

## How to Get Updated Data

You can use the data in this repository as base. However, as the time goes by, there will be new students and new PDDIKTI status. You can use the following steps to get the updated data:
1. Scrape data from MS Teams ITB.
2. Parse the data from MS Teams ITB and generate list of queries in this format: "{nim} ITB {nama}". Example: "13517105 ITB Muhammad Hendry Prasetya".
3. Scrape data from PDDIKTI -> Fetch by query -> Use the "id" from the response to get the mahasiswa detail from PDDIKTI.
4. Merge the data from MS Teams ITB and PDDIKTI. The data from PDDIKTI will be used to update the status of the mahasiswa. The data from MS Teams ITB will be used to update the nim and name of the mahasiswa.

## Tools Related
- Scraper for MS Teams ITB -> [itb-nim-scrapper](https://github.com/hendpraz/itb-nim-scrapper)
- Scraper for PDDIKTI -> [PDDIKTI-kemdikbud-API](https://github.com/hendpraz/PDDIKTI-kemdikbud-API)
- ITB NIM Finder Backend -> [nim-finder-backend](https://github.com/hendpraz/nim-finder-backend)
