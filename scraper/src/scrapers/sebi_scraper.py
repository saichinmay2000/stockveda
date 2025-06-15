import requests
from bs4 import BeautifulSoup
from datetime import datetime

def scrape_sebi_press_releases():
    url = "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&smid=0&cid=0"
    response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
    soup = BeautifulSoup(response.text, 'html.parser')

    articles = []

    for row in soup.select(".listing_results li"):
        title_tag = row.find('a')
        date_tag = row.find('span', class_='date')

        if title_tag and date_tag:
            title = title_tag.get_text(strip=True)
            link = "https://www.sebi.gov.in" + title_tag['href']
            date_str = date_tag.get_text(strip=True)

            articles.append({
                'source': 'SEBI',
                'title': title,
                'summary': '',
                'url': link,
                'timestamp': datetime.strptime(date_str, "%d-%b-%Y").isoformat()
            })

    return articles


if __name__ == "__main__":
    filings = scrape_sebi_press_releases()
    for filing in filings[:5]:  # show top 5
        print(f"{filing['title']} — {filing['timestamp']}")
        print(filing['url'])
        print("---")
