import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json
import os

# @Scraper Money Control
def scrape_moneycontrol(max_pages=30):
    base_url = "https://www.moneycontrol.com/news/business/markets"
    articles = []

    for page in range(1, max_pages + 1):
        url = base_url if page == 1 else f"{base_url}/page-{page}/"
        print(f"🔎 Scraping page {page}: {url}")
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        
        if response.status_code != 200:
            print(f"❌ Failed to load page {page}")
            break

        soup = BeautifulSoup(response.text, 'html.parser')
        items = soup.select('li.clearfix')

        if not items:
            print("🚫 No more articles found.")
            break

        for item in items:
            title_tag = item.find('h2')
            if title_tag:
                a_tag = title_tag.find('a')
                summary_tag = item.find('p')

                if a_tag and summary_tag:
                    title = a_tag.get('title', '')
                    summary = summary_tag.get_text(strip=True)
                    link = a_tag['href']
                    articles.append({
                        'source': 'Moneycontrol',
                        'title': title,
                        'summary': summary,
                        'url': link,
                        'timestamp': datetime.now().isoformat()
                    })

    print(f"✅ Total articles scraped: {len(articles)}")
    return articles

# @Scraper Live Mint
def scrape_livemint():
    base_url = "https://www.livemint.com/market/stock-market-news"
    articles = []
    page = 1

    while True:
        if page == 1:
            url = base_url
        else:
            url = f"{base_url}/page-{page}"

        print(f"Scraping page {page}...")
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        soup = BeautifulSoup(response.text, 'html.parser')

        # Check for "No Content" page
        if soup.select_one('section.mainSec div.errorHolder'):
            print("Reached a page with no content. Stopping.")
            break

        for item in soup.select('div.listView div.listtostory.clearfix div.headlineSec a'):
            title = item.get_text(strip=True)
            link_tag = item.get('href')

            if title == '' or link_tag == '':
                continue

            if link_tag.startswith('/'):
                full_link = "https://www.livemint.com" + link_tag
            else:
                full_link = link_tag

            articles.append({
                'source': 'LiveMint',
                'title': title,
                'summary': '',
                'url': full_link,
                'timestamp': datetime.now().isoformat()
            })

        page += 1

    return articles

# @Main function to scrape all news
def scrape_all_news():
    mc = scrape_moneycontrol()
    lm = scrape_livemint()
    return mc + lm