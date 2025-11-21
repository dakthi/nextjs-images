#!/usr/bin/env python3
"""
Selenium script to automate exporting lots from Cadmore Auctions
for all auctions with 'G' prefix.
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time
import os
from datetime import datetime
import re

# Configuration
AUCTIONEER_URL = "https://auctioneer.easyliveauction.com"
COMPANY_CODE = "cad01"
USERNAME = "vikki.duong"
PASSWORD = "Vikkiduong2020"
EXPORT_TEMPLATE = "CSV Export (Other Platforms)"  # or your template name
DOWNLOAD_DIR = os.path.expanduser("~/Downloads/auction_exports")

# Create download directory if it doesn't exist
os.makedirs(DOWNLOAD_DIR, exist_ok=True)


class AuctionExporter:
    def __init__(self):
        """Initialize the Selenium webdriver."""
        chrome_options = Options()
        # Uncomment below to run in headless mode
        # chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        # Set download directory
        prefs = {"download.default_directory": DOWNLOAD_DIR}
        chrome_options.add_experimental_option("prefs", prefs)

        self.driver = webdriver.Chrome(options=chrome_options)
        self.wait = WebDriverWait(self.driver, 15)

    def login(self):
        """Log in to the auctioneer system."""
        print("Logging in...")
        self.driver.get(AUCTIONEER_URL)

        # Wait for login form to load
        company_field = self.wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='companycode']"))
        )

        # Fill in login credentials
        username_field = self.driver.find_element(By.CSS_SELECTOR, "input[name='username']")
        password_field = self.driver.find_element(By.CSS_SELECTOR, "input[name='password']")
        login_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

        company_field.clear()
        company_field.send_keys(COMPANY_CODE)

        username_field.clear()
        username_field.send_keys(USERNAME)

        password_field.clear()
        password_field.send_keys(PASSWORD)

        login_button.click()

        # Wait for dashboard to load
        time.sleep(3)
        print("Login successful")

    def get_g_prefix_auctions(self):
        """Get list of all G-prefix auctions."""
        print("Fetching auction list...")

        # Find the auction dropdown
        auction_select = self.wait.until(
            EC.presence_of_element_located((By.ID, "auctionSelector"))
        )

        select = Select(auction_select)
        options = select.options

        g_auctions = []
        for option in options:
            text = option.text
            # Match auctions starting with 'G' followed by digits
            if text.startswith("G") and len(text) > 1 and text[1].isdigit():
                value = option.get_attribute("value")
                g_auctions.append({"name": text, "value": value})
                print(f"  Found: {text}")

        print(f"Total G-prefix auctions found: {len(g_auctions)}")
        return g_auctions

    def select_auction(self, auction_value):
        """Select an auction from the dropdown."""
        auction_select = self.driver.find_element(By.ID, "auctionSelector")
        select = Select(auction_select)
        select.select_by_value(auction_value)
        time.sleep(2)  # Wait for page to load

    def navigate_to_lots(self):
        """Navigate to the Lots section of the auction."""
        # Click on Auctions menu
        try:
            auctions_menu = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//strong[text()='Auctions']/.."))
            )
            auctions_menu.click()
            time.sleep(1)

            # Click on Lots submenu
            lots_link = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'Lots')]"))
            )
            lots_link.click()
            time.sleep(2)
        except Exception as e:
            print(f"Warning: Could not navigate via menu: {e}")
            # Alternative: navigate directly via URL
            self.driver.get(f"{AUCTIONEER_URL}/auctioneer/?grant.cfm?module=051")
            time.sleep(2)

    def export_lots(self, auction_name):
        """Export lots for the current auction."""
        print(f"Exporting lots for {auction_name}...")

        try:
            # Switch to iframe if needed
            iframes = self.driver.find_elements(By.TAG_NAME, "iframe")
            if iframes:
                self.driver.switch_to.frame(iframes[0])

            # Click Export Lots button
            export_button = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Export Lots')]"))
            )
            export_button.click()
            time.sleep(2)

            # Switch back from iframe
            self.driver.switch_to.default_content()

            # Handle the export dialog
            # Try to select the CSV export template
            try:
                dropdown = self.wait.until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "select"))
                )
                select = Select(dropdown)
                select.select_by_visible_text(EXPORT_TEMPLATE)
                time.sleep(1)
            except Exception as e:
                print(f"Warning: Could not select export template: {e}")

            # Click Create Export button
            create_button = self.driver.find_element(
                By.XPATH, "//button[contains(text(), 'Create Export')]"
            )
            create_button.click()

            # Wait for download
            time.sleep(3)
            print(f"✓ Export completed for {auction_name}")

        except Exception as e:
            print(f"✗ Error exporting lots for {auction_name}: {e}")

    def run(self):
        """Main execution method."""
        try:
            self.login()
            auctions = self.get_g_prefix_auctions()

            if not auctions:
                print("No G-prefix auctions found!")
                return

            # Export for each G-prefix auction
            for i, auction in enumerate(auctions, 1):
                print(f"\n[{i}/{len(auctions)}] Processing {auction['name']}...")

                # Select auction
                self.select_auction(auction["value"])

                # Navigate to lots section
                self.navigate_to_lots()

                # Export lots
                self.export_lots(auction["name"])

                # Small delay between exports
                time.sleep(2)

            print("\n✓ All exports completed!")
            print(f"Files saved to: {DOWNLOAD_DIR}")

        except Exception as e:
            print(f"✗ Fatal error: {e}")
            import traceback
            traceback.print_exc()
        finally:
            self.driver.quit()


def main():
    """Entry point."""
    exporter = AuctionExporter()
    exporter.run()


if __name__ == "__main__":
    main()
