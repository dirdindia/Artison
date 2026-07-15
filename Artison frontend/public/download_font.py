import urllib.request
import zipfile
import os

url = "https://dl.dafont.com/dl/?f=samarkan"
zip_path = "samarkan.zip"
fonts_dir = "fonts"

print("Downloading...")
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response, open(zip_path, 'wb') as out_file:
    out_file.write(response.read())

print("Extracting...")
os.makedirs(fonts_dir, exist_ok=True)
with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall(fonts_dir)

print("Done. Files extracted to", fonts_dir)
