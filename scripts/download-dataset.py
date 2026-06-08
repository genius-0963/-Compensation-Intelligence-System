import os
import sys

try:
    import kagglehub
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "kagglehub"])
    import kagglehub

print("Downloading Global Tech Salary Dataset from Kaggle...")
try:
    path = kagglehub.dataset_download("yaaryiitturan/global-tech-salary-dataset")
    print(f"Dataset downloaded to: {path}")
    
    # Copy the CSV to the root of the project
    import shutil
    for f in os.listdir(path):
        if f.endswith(".csv"):
            src = os.path.join(path, f)
            dest = os.path.join(os.getcwd(), "dataset.csv")
            shutil.copy2(src, dest)
            print(f"Copied {f} to ./dataset.csv")
            print("You can now run: npm run db:seed")
            break
except Exception as e:
    print(f"Failed to download dataset: {e}")
    print("Please download manually from: https://www.kaggle.com/datasets/yaaryiitturan/global-tech-salary-dataset")
    print("And place the CSV file in the project root as 'dataset.csv'")
