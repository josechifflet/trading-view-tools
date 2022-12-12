import _ from "lodash";
import axios from "axios";
import fs from "fs";

const get_coins = (symbols: any) => {
  const coins_usdt: unknown[] = [];
  const coins_btc: unknown[] = [];
  const coins_eth: unknown[] = [];

  symbols.forEach((symbol: any) => {
    if (
      symbol.quoteAsset === "USDT" &&
      !(
        (symbol.baseAsset as string).toUpperCase().includes("BULL") ||
        (symbol.baseAsset as string).toUpperCase().includes("BEAR")
      )
    )
      coins_usdt.push(
        `binance:${symbol.baseAsset}${symbol.quoteAsset}`.toLowerCase()
      );
    if (symbol.quoteAsset === "BTC")
      coins_btc.push(
        `binance:${symbol.baseAsset}${symbol.quoteAsset}`.toLowerCase()
      );
    if (symbol.quoteAsset === "ETH")
      coins_eth.push(
        `binance:${symbol.baseAsset}${symbol.quoteAsset}`.toLowerCase()
      );
  });

  const uniqUsdt = _.uniq(coins_usdt).join("\n");
  const uniqBtc = _.uniq(coins_btc).join("\n");
  const uniqEth = _.uniq(coins_eth).join("\n");
  fs.writeFileSync("uniqUsdt.txt", uniqUsdt);
  fs.writeFileSync("uniqBtc.txt", uniqBtc);
  fs.writeFileSync("uniqEth.txt", uniqEth);
};

const get_coins_futures = (symbols: any) => {
  const coins_usdt: unknown[] = [];
  const coins_usdt_oi: unknown[] = [];

  const coins_busd: unknown[] = [];
  const coins_busd_oi: unknown[] = [];
  symbols.forEach((symbol: any) => {
    if (symbol.quoteAsset === "USDT") {
      coins_usdt.push(
        `binance:${symbol.baseAsset}${symbol.quoteAsset}perp`.toLowerCase()
      );
      coins_usdt_oi.push(
        `binance:${symbol.baseAsset}${symbol.quoteAsset}perp_oi`.toLowerCase()
      );
    }
    if (symbol.quoteAsset === "BUSD") {
      coins_busd.push(
        `binance:${symbol.baseAsset}${symbol.quoteAsset}perp`.toLowerCase()
      );
      coins_busd_oi.push(
        `binance:${symbol.baseAsset}${symbol.quoteAsset}perp_oi`.toLowerCase()
      );
    }
  });

  const uniqUsdtFutures = _.uniq(coins_usdt).join("\n");
  const uniqUsdtOiFutures = _.uniq(coins_usdt_oi).join("\n");
  const uniqBusdFutures = _.uniq(coins_usdt).join("\n");
  const uniqBusdOiFutures = _.uniq(coins_usdt_oi).join("\n");
  fs.writeFileSync("uniqBusdFutures.txt", uniqBusdFutures);
  fs.writeFileSync("uniqBusdOiFutures.txt", uniqBusdOiFutures);
  fs.writeFileSync("uniqUsdtFutures.txt", uniqUsdtFutures);
  fs.writeFileSync("uniqUsdtOiFutures.txt", uniqUsdtOiFutures);
};

(async () => {
  try {
    await axios
      .get("https://api.binance.com/api/v3/exchangeInfo?permissions=SPOT")
      .then((response) => response.data)
      .then((json) => get_coins(json.symbols));
  } catch (error) {
    console.log(error);
  }

  try {
    await axios
      .get("https://fapi.binance.com/fapi/v1/exchangeInfo")
      .then((response) => response.data)
      .then((json) => get_coins_futures(json.symbols));
  } catch (error) {
    console.log(error);
  }
})();
