import click

from bbb_data.report_scraper import ReportScraper


@click.group()
@click.pass_context
def cli(ctx):
    ctx.obj = ReportScraper()


@cli.command("earning_report")
@click.option("--company", type=str)
@click.option("--date", type=click.DateTime(formats=["%Y-%m-%d"]))
@click.pass_obj
def earning_report(ctx, company, date):
    ctx.get_report_by_date(date.strftime("%Y-%m-%d"))
    ctx.write_summaries(company)


@cli.command("security_report")
@click.option("--company", type=str)
@click.option("--date", type=click.DateTime(formats=["%Y-%m-%d"]))
@click.option("--security_code", type=str, default=None)
@click.pass_obj
def security_report(ctx, company, date, security_code):
    ctx.get_report_by_security(company, date.strftime("%Y-%m-%d"), security_code)
    ctx.write_details(company)


if __name__ == "__main__":
    cli()
