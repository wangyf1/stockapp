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
    }
    report_indx_map = {
        "SECURITY_CODE": "股票代码",
        "SECURITY_NAME_ABBR": "股票简称",
        "BASIC_EPS": "每股收益",
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
    security_map = {
        "BALANCE": "RPT_DMSK_FN_BALANCE",  # 资产负债
        "INCOME": "RPT_DMSK_FN_INCOME",  # 利润
        "CASHFLOW": "RPT_DMSK_FN_CASHFLOW",  # 现金流
    }
    security_indx_map = {
        "SECURITY_CODE": "股票代码",
        "SECURITY_NAME_ABBR": "股票简称",
        "MARKET": "市场",
        # 负债表
        "TOTAL_ASSETS": "总资产",
        "TOTAL_ASSETS_RATIO": "总资产同比",
        "FIXED_ASSET": "固定资产",
        "MONETARYFUNDS": "货币资金",
        "MONETARYFUNDS_RATIO": "货币资金同比",
        "ACCOUNTS_RECE": "应收帐款",
        "ACCOUNTS_RECE_RATIO": "应收帐款同比",
        "INVENTORY": "存货",
        "INVENTORY_RATION": "存货同比",
        "TOTAL_LIABILITIES": "总负债",
        "TOTAL_LIAB_RATIO": "总负债同比",
        "ACCOUNTS_PAYABLE": "应付账款",
        "ACCOUNTS_PAYABLE_RATIO": "应付账款同比",
        "ADVANCE_RECEIVABLES": "预收账款",
        "ADVANCE_RECEIVABLES_RATIO": "预收账款同比",
        "TOTAL_EQUITY": "股东权益合计",
        "TOTAL_EQUITY_RATIO": "股东权益同比",
        "DEBT_ASSET_RATIO": "资产负债率",
        # 利润表
        "PARENT_NETPROFIT": "净利润",
        "PARENT_NETPROFIT_RATIO": "净利润同比",
        "DEDUCT_PARENT_NETPROFIT": "扣非归母净利润",
        "DPN_RATIO": "扣非归母净利润同比",
        "TOTAL_OPERATE_INCOME": "营业总收入",
        "TOI_RATIO": "营业总收入同比",
        "OPERATE_EXPENSE": "营业支出",
        "OPERATE_EXPENSE_RATIO": "营业支出同比",
        "SALE_EXPENSE": "销售费用",
        "MANAGE_EXPENSE": "管理费用",
        "FINANCE_EXPENSE": "财务费用",
        "TOTAL_OPERATE_COST": "营业总支出",
        "TOE_RATIO": "营业总支出同比",
        "OPERATE_PROFIT": "营业利润",
        "OPERATE_PROFIT_RATIO": "营业利润同比",
        "TOTAL_PROFIT": "利润总额",
        # 现金流量表
        "CCE_ADD": "净现金流",
        "CCE_ADD_RATIO": "净现金流同比",
        "NETCASH_OPERATE": "经营性现金流量净额",
        "NETCASH_OPERATE_RATIO": "经营性现金流量净额占比",
        "SALES_SERVICES": "销售商品及提供劳务收到的现金金额",
        "SALES_SERVICES_RATIO": "销售商品及提供劳务收到的现金占比",
        "NETCASH_INVEST": "投资性现金流量净额",
        "NETCASH_INVEST_RATIO": "投资性现金流量净额占比",
        "RECEIVE_INVEST_INCOME": "取得投资收益收到的现金金额",
        "RII_RATIO": "取得投资收益收到的现金占比",
        "CONSTRUCT_LONG_ASSET": "购建固定资产无形资产和其他长期资产支付的现金金额",
        "CLA_RATIO": "购建固定资产无形资产和其他长期资产支付的现金占比",
        "NETCASH_FINANCE": "融资性现金流量净额",
        "NETCASH_FINANCE_RATIO": "融资性现金流量占比",
    }
    exported_excel_block_name_map = {
        "block1": "科目\\时间",
        "block2": "科目\\时间",
        "block3": "重要比率",
    }
    exported_excel_indx_map = {
        # FIXME: 同花顺的excel和eastmoney的数据并不是1:1mapping的，有的找不到
        "block1": {
            "PARENT_NETPROFIT": "净利润(元)",
            "DEDUCT_PARENT_NETPROFIT": "扣非净利润(元)",
            "TOTAL_OPERATE_INCOME": "营业总收入(元)",
            "NETCASH_OPERATE": "经营活动产生的现金流量净额(元)",
            "CONSTRUCT_LONG_ASSET": "购建固定资产、无形资产和其他长期资产支付的现金(元)",
            "NOT_FOUND_1": "处置固定资产、无形资产和其他长期资产收回的现金净额(元)",
            "NETCASH_INVEST": "投资活动产生的现金流量净额(元)",
            "NOT_FOUND_2": "筹资活动产生的现金流量净额(元)",
            "OPERATE_EXPENSE": "其中：营业成本(元)",
            "SALE_EXPENSE": "销售费用(元)",
            "MANAGE_EXPENSE": "管理费用(元)",
            "NOT_FOUND_3": "研发费用(元)",
            "FINANCE_EXPENSE": "财务费用(元)",
            "OPERATE_PROFIT": "三、营业利润(元)",
        },
        "block2": {
            "MONETARYFUNDS": "货币资金(元)",
            "NOT_FOUND_1": "流动资产合计(元)",
            "FIXED_ASSET": "固定资产合计(元)",
            "NOT_FOUND_2": "非流动资产合计(元)",
            "TOTAL_ASSETS": "资产合计(元)",
            "NOT_FOUND_3": "流动负债合计(元)",
            "NOT_FOUND_4": "非流动负债合计(元)",
            "TOTAL_LIABILITIES": "负债合计(元)",
            "NOT_FOUND_5": "归属于母公司所有者权益合计(元)",
            "TOTAL_EQUITY": "所有者权益（或股东权益）合计(元)",
            "NOT_FOUND_6": "毛利 (营业收入减去营业成本)",
            "NOT_FOUND_7": "自由现金流 (Operating Cashflow Method)",
        },
        "block3": {
            "NOT_FOUND_1": "P/E",
            "BASIC_EPS": "基本每股收益(元)",
            "NOT_FOUND_2": "流动比率",
            "NOT_FOUND_3": "速动比率",
            "DEBT_ASSET_RATIO": "资产负债比率",
            "NOT_FOUND_4": "资产收益率",
            "WEIGHTAVG_ROE": "净资产收益率",
            "XSMLL": "销售毛利率",
            "NOT_FOUND_5": "营业利润率",
            "NOT_FOUND_6": "销售净利率",
            "CCE_ADD_RATIO": "现金流量比率",
            "YSTZ": "营业总收入同比增长率",
            "SJLTZ": "净利润同比增长率",
            "NOT_FOUND_7": "净资产增长率",
            "NOT_FOUND_8": "债务股本比",
        },
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
        logger.debug("Getting data from %s", url)
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
            "reportName": Constants.security_map[type],
        }
        return self._get(Constants.security_url, extra_params, fail_fast)
