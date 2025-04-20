interface serverTime {
    serverTime: number;
}

interface tickerAvgprice {
    mins: number;
    price: string;
    closeTime: number;
}

type numberAsString = string;

interface ticker24HrSummary {
    symbol: string,
    priceChange: numberAsString
    priceChangePercent: numberAsString,
    weightedAvgPrice: numberAsString,
    prevClosePrice: numberAsString,
    lastPrice: numberAsString,
    lastQty: numberAsString,
    bidPrice: numberAsString,
    bidQty: numberAsString,
    askPrice: numberAsString,
    askQty: numberAsString,
    openPrice: numberAsString,
    highPrice: numberAsString,
    lowPrice: numberAsString,
    volume: numberAsString,
    quoteVolume: numberAsString,
    openTime: number,
    closeTime: number,
    firstId: number,
    lastId: number,
    count: number
}

interface binanceServerError {
    MethodAttempted: string;
    serverCode: number;
    code: number;
    msg: string;
    isNetworkError?: boolean;
}

class BinanceApi {
    binanceBaseURL: string;

    constructor(baseURl: string) {
        this.binanceBaseURL = baseURl;
    }

    private async request<T>(url: string, methodName: string): Promise<T | binanceServerError> {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                return await this.serverError(methodName, response);
            }
    
            return await response.json();
        } catch (err) {
            console.error(`Error in ${methodName}:`, err);
            return this.networkError(methodName);
        }
    }

    private networkError(method: string): binanceServerError {
        return {
            MethodAttempted: method,
            serverCode: 0,
            code: 0,
            msg: "Network error or failed to reach Binance",
            isNetworkError: true
        };
    }

    private serverError = async (
        methodAttempted: string,
        response: Response
    ): Promise<binanceServerError> => {
        let code = 0;
        let msg = "Unknown error";
    
        try {
            const errorBody = await response.json();
            code = errorBody.code ?? 'unknown error code';
            msg = errorBody.msg ?? "Unknown error msg";
        } catch (_error) {
            msg = "Unable to parse error response";
        }
    
        return {
            MethodAttempted: methodAttempted,
            serverCode: response.status,
            code,
            msg
        };
    };
    
    getPing = async (): Promise<Record<string, never> | binanceServerError> => {
        const result = await this.request<Record<string, never>>(`${this.binanceBaseURL}/ping`, "getPing");
        
        if ("getPing" in result) {
            console.log("Ping response:", result);
        }

        return result;
    };

    getServerTime = async (): Promise<serverTime | binanceServerError> => {
        const result = await this.request<serverTime>(`${this.binanceBaseURL}/time`, "getServerTime");
    
        if ("serverTime" in result) {
            console.log("Server time is:", result.serverTime);
        }
    
        return result;
    };
    

    getTickerAvgprice = async (ticker: string): Promise<tickerAvgprice | binanceServerError> => {
        const symbol = ticker.toUpperCase();

        const result = await this.request<tickerAvgprice>(`${this.binanceBaseURL}/avgPrice?symbol=${symbol}`, "getTickerAvgprice");

        if ("mins" in result) {
            console.log("Ticker avg price is:", result.price);
        }

        return result;
    };

    getTicker24Hr = async (tickersArray: string[]): Promise<ticker24HrSummary[] | binanceServerError> => {
        const symbols = tickersArray.map(ticker => `"${ticker}"`).join(",");
        const url = `${this.binanceBaseURL}/ticker/24hr?symbols=[${symbols}]`;

        const result = await this.request<ticker24HrSummary[]>(url, "getTicker24Hr");

        if (Array.isArray(result)) {
            console.log("Ticker 24hr summary is:", result);
        }

        return result;
    };
}

export { BinanceApi };
export type { numberAsString, tickerAvgprice, ticker24HrSummary, serverTime, binanceServerError };