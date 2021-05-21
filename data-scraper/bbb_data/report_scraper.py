from collections import defaultdict
import json
from json.decoder import JSONDecodeError
from os import path
import re
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
        with open(path.join(OUTPUT_DIR, company_name + "简报.csv"), "w") as fw:
            fw.write(",".join(Constants.report_indx_map.values()))
            fw.write("\n")
            for _, companies in self.cached_reports.items():
                details = companies.get(company_name)
                if not details:
                    continue
                fw.write(",".join([str(details[k]) for k in Constants.report_indx_map]))
                fw.write("\n")
        logger.info(
            "Report has been successfully generated under outputs/%s简报.csv",
            company_name,
        )

    def write_details(self, company_name: str):
        """
        尝试尽量使用和同花顺相同的格式
        """
        fname = f"{company_name}_cache.json"
        if not path.exists(path.join(CACHE_DIR, fname)):
            raise RuntimeError(
                "Cache not found. Please get report for {company_name} first"
            )
        detailed_report = self._load_cache(fname)
        # write results as csv, unless xlsx format is required
        with open(path.join(OUTPUT_DIR, company_name + ".csv"), "w") as fw:
            fw.write(",".join([str(i + 1) for i in range(30)]))
            fw.write("\n")
            for k, title in Constants.exported_excel_block_name_map.items():
                fw.write(",".join([title, *detailed_report.keys()]))
                fw.write("\n")
                for indx, output_name in Constants.exported_excel_indx_map[k].items():
                    line = [output_name]
                    for date, reports in detailed_report.items():
                        val = "#REF!"  # seems to be the null val for excels
                        for report in reports:
                            if indx in report:
                                val = report[indx]
                                break
                        if (
                            val == "#REF!"
                            and date in self.cached_reports
                            and company_name in self.cached_reports[date]
                        ):
                            val = self.cached_reports[date][company_name].get(
                                indx, "#REF!"
                            )
                        line.append(str(val))
                    fw.write(",".join(line))
                    fw.write("\n")
                fw.write("\n\n")
        logger.info(
            "Report has been successfully generated under outputs/%s.csv",
            company_name,
        )

    def get_report_by_security(self, company_name: str, date: str, security_code=None):
        security_data = defaultdict(list)
        if not security_code:
            if self.cached_reports.get(date) is None:
                raise ValueError(f"{date} is an invalid date")
            details = self.cached_reports.get(date).get(company_name)
            if details is None:
                raise ValueError(f"{company_name} is an invalid company for {date}")
            security_code = details["SECURITY_CODE"]
        date_format = re.compile(r"([\d]{4}-[\d]{2}-[\d]{2})")
        for type in Constants.security_map.keys():
            logger.info("Downloading %s data", type)
            data = self.api.get_security(security_code, type)["data"]
            for report in data:
                res = date_format.search(report["REPORT_DATE"])
                security_data[res.group(1)].append(report)
        dates = sorted(security_data, reverse=True)
        self._save_cache(
            f"{company_name}_cache.json", {d: security_data[d] for d in dates}
        )

    def get_report_by_date(self, date: str):
        cache_file = "earning_reports.json"
        if date in self.cached_reports:
            logger.info("Data found in local cache")
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
