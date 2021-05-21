import json
from json.decoder import JSONDecodeError
from os import path
from typing import Any, Dict

from bbb_data.api import Constants, DataAPI
from bbb_data.utils import get_logger

CACHE_DIR = path.join(path.dirname(__file__), "cache")
OUTPUT_DIR = path.join(path.dirname(__file__), "output")
logger = get_logger()


class ReportScraper:
    def __init__(self):
        self.api = DataAPI()
        self.cached_reports = self._load_cache("earning_reports.json")

    def _load_cache(self, fname: str):
        cache_path = path.join(CACHE_DIR, fname)
        mode = "r" if path.exists(cache_path) else "w"
        with open(path.join(CACHE_DIR, fname), mode) as fr:
            if mode == "w":
                return {}
            try:
                return json.load(fr)
            except JSONDecodeError:
                return {}

    def _save_cache(self, fname: str, data: Dict[str, Any]):
        """
        TODO: move the dataset to a db or some thing else to avoid using too much mem
        """
        with open(path.join(CACHE_DIR, fname), "w") as fw:
            json.dump(data, fw, ensure_ascii=False, indent=2)

    def _write_reports(self, data: Dict[str, Any], company_name: str, postfix=""):
        with open(path.join(OUTPUT_DIR, company_name + postfix + ".csv"), "w") as fw:
            fw.write(",".join(Constants.indx_map.values()))
            fw.write("\n")
            for _, companies in data.items():
                details = companies.get(company_name)
                if not details:
                    continue
                fw.write(",".join([str(details[k]) for k in Constants.indx_map]))
                fw.write("\n")

    def _company_exists(self, company_name: str) -> bool:
        """
        TODO: update this when moving to db
        """
        return any(
            (company_name in companies) for _, companies in self.cached_reports.items()
        )

    def write_summaries(self, company_name: str):
        if not self._company_exists(company_name):
            raise ValueError(
                f"{company_name} is not a valid company for {list(self.cached_reports.keys())}"
            )
        self._write_reports(self.cached_reports, company_name, postfix="简报")
        logger.info(
            "Report has been successfully generated under outputs/%s简报.csv",
            company_name,
        )

    def write_details(self, company_name: str):
        raise NotImplementedError("Nothing to see here")

    def get_report_by_security(self, company_name: str, date: str, security_code=None):
        security_data = {}
        if not security_code:
            if self.cached_reports.get(date) is None:
                raise ValueError(f"{date} is an invalid date")
            details = self.cached_reports.get(date).get(company_name)
            if details is None:
                raise ValueError(f"{company_name} is an invalid company for {date}")
            security_code = details["SECURITY_CODE"]
        for type in ["BALANCE", "INCOME", "CASHFLOW"]:
            security_data[type] = self.api.get_security(security_code, type)["data"]
        self._save_cache(f"{company_name}_cache.json", security_data)

    def get_report_by_date(self, date: str):
        cache_file = "earning_reports.json"
        if date in self.cached_reports:
            logger.info("Data found in local cache, aborting ...")
            return
        logger.info("Downloading new data")
        res = self.api.get_reports(date, "REPORT")
        # map stock abbrv to its data
        stock_mapping = {
            security["SECURITY_NAME_ABBR"]: security for security in res["data"]
        }
        self.cached_reports[date] = stock_mapping
        self._save_cache(cache_file, self.cached_reports)
        logger.info("Local cache has been updated")
        return
