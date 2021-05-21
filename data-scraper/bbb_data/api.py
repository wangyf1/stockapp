import json
import re
import requests
from typing import Any, Dict

from bbb_data.utils import get_logger

logger = get_logger()


class Constants:
    security_url = "https://datacenter.eastmoney.com/securities/api/data/v1/get"
    data_url = "https://datacenter.eastmoney.com/api/data/get"
    tokens = {
        "callback": "jQuery11230026427241885568442_1621532231897",
        "token": "894050c76af8597a853f5b408b759f5d",
    }
    report_map = {
        "REPORT": "RPT_LICO_FN_CPD",  # 业绩报表
        "BALANCE": "RPT_DMSK_FN_BALANCE",  # 资产负债
        "INCOME": "RPT_DMSK_FN_INCOME",  # 利润
        "CASHFLOW": "RPT_DMSK_FN_CASHFLOW",  # 现金流
    }
    indx_map = {
        "SECURITY_CODE": "股票代码",
        "SECURITY_NAME_ABBR": "股票简称",
        "BASIC_EPS": "每股收益(元)",
        "TOTAL_OPERATE_INCOME": "营业收入",
        "YSTZ": "营收同比增长",
        "YSHZ": "营收季度环比增长",
        "PARENT_NETPROFIT": "净利润",
        "SJLTZ": "利润季度同比增长",
        "SJLHZ": "利润季度环比增长",
        "BPS": "每股净资产",
        "WEIGHTAVG_ROE": "净资产收益率",
        "MGJYXJJE": "每股经营现金流量",
        "XSMLL": "销售毛利率",
        "TRADE_MARKET": "市场",
        "SECURITY_TYPE": "股票类型",
        "REPORTDATE": "报告日期",
        "UPDATE_DATE": "更新日期",
    }


class DataAPI:
    def __init__(self):
        self.illegal_chars = re.compile(r"jQuery[0-9]+_[0-9]+\((.*)\)\;")

    def _get(
        self, base_url, extra_params: Dict[str, str], fail_fast: bool
    ) -> Dict[str, Any]:
        query_str = "&".join(
            [k + "=" + v for k, v in {**Constants.tokens, **extra_params}.items()]
        )
        url = base_url + "?" + query_str
        logger.info("Getting data from %s", url)
        resp = requests.get(url).text
        resp = self.illegal_chars.sub(r"\1", resp)
        res = json.loads(resp).get("result")
        if not res:
            msg = f"No data returned from the API: {resp}"
            if fail_fast:
                raise RuntimeError(msg)
            logger.error(msg)
        return res

    def get_reports(self, date: str, type: str, fail_fast=False) -> Dict[str, Any]:
        extra_params = {
            "st": "UPDATE_DATE%2CSECURITY_CODE",
            "sr": "-1%2C-1&",
            "sty": "ALL",
            "type": Constants.report_map[type],
            "filter": f"(REPORTDATE%3D%27{date}%27)",
        }
        return self._get(Constants.data_url, extra_params, fail_fast)

    def get_security(
        self, security_code: str, type: str, fail_fast=True
    ) -> Dict[str, Any]:
        extra_params = {
            "columns": "ALL",
            "sortTypes": "-1",
            "pageSize": "50",
            "pageNumber": "1",
            "sty": "ALL",
            "filter": f"(SECURITY_CODE%3D%22{security_code}%22)",
            "reportName": Constants.report_map[type],
        }
        return self._get(Constants.security_url, extra_params, fail_fast)
