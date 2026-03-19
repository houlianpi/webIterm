#!/usr/bin/env python3
"""
腾讯控股 (00700.HK) 股价监控脚本
需要先启动 FutuOpenD: /Applications/FutuOpenD.app/Contents/MacOS/FutuOpenD
"""

from futu import *

# 配置
HOST = "127.0.0.1"
PORT = 11111
STOCK_CODE = "00700.HK"  # 腾讯控股

def get_stock_price():
    """获取股票实时行情"""
    quote_ctx = OpenQuoteContext(host=HOST, port=PORT)
    
    try:
        # 获取实时报价
        ret, data = quote_ctx.get_stock_quote([STOCK_CODE])
        
        if ret == RET_OK:
            row = data.iloc[0]
            print(f"\n📈 {STOCK_CODE} 腾讯控股")
            print(f"=" * 30)
            print(f"当前价: {row['last_price']:.2f} HKD")
            print(f"涨跌额: {row['change_val']:+.2f} HKD")
            print(f"涨跌幅: {row['change_pct']:+.2f}%")
            print(f"开盘价: {row['open_price']:.2f} HKD")
            print(f"最高价: {row['high_price']:.2f} HKD")
            print(f"最低价: {row['low_price']:.2f} HKD")
            print(f"成交量: {row['volume']:,}")
            print(f"成交额: {row['turnover']:,.0f} HKD")
            print(f"市 值: {row['market_cap']:,.0f} HKD")
            print(f"=" * 30)
        else:
            print(f"❌ 获取数据失败: {data}")
            
    except Exception as e:
        print(f"❌ 错误: {e}")
    
    finally:
        quote_ctx.close()

if __name__ == "__main__":
    print("🚀 启动富途行情监控...")
    print("💡 确保 FutuOpenD 正在运行!")
    print("💡 如果连接失败，请先打开富途牛牛/富途开源版")
    get_stock_price()