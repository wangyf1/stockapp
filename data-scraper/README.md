# BBB Data

## Get Started
1. Install Python3
2. Create a virtual environment with `virtualenv venv`
3. Activate venv with `source venv/bin/activate`
4. Install dependencies with `pip install -r requirements.txt`

## Usage
1. High level earning reports on a specific date
    ```
    python -m bbb_data earning_report [OPTIONS]

    Options:
    --company TEXT
    --date [%Y-%m-%d]
    ```
    example: `python -m bbb_data earning_report --date 2020-12-31 --company 盛视天橙`

2. Detailed eraning reports (balance, income, and cashflow) for a specific company
    ```
    python -m bbb_data security_report [OPTIONS]

    Options:
    --company TEXT
    --date [%Y-%m-%d]
    --security_code TEXT (Optional)
    ```
    example: `python -m bbb_data security_report --date 2020-12-31 --company 玉马遮阳`
