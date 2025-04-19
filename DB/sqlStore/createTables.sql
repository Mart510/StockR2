-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tickers table
CREATE TABLE public.Tickers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker TEXT NOT NULL,
    ticker_name TEXT,
    logo_url TEXT,
    description TEXT,
    api_source TEXT,
    last_called_at TIMESTAMP
);

-- PriceLogs table
CREATE TABLE public.PriceLogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker_id UUID REFERENCES public.Tickers(id) ON DELETE CASCADE,
    price NUMERIC NOT NULL,
    logged_at TIMESTAMP DEFAULT now(),
    logged_at_POSIX NUMERIC
);

-- Index for PriceLogs table
CREATE INDEX idx_pricelogs_ticker_time ON public.PriceLogs (ticker_id, logged_at);

-- DailySummaries table
CREATE TABLE public.DailySummaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker_id UUID REFERENCES public.Tickers(id) ON DELETE CASCADE,
    logged_at TIMESTAMP DEFAULT now(),
    logged_at_POSIX NUMERIC,

    price_change NUMERIC,
    price_change_percent NUMERIC,
    weighted_avg_price NUMERIC,
    prev_close_price NUMERIC,
    last_price NUMERIC,
    last_quantity NUMERIC,
    bid_price NUMERIC,
    ask_price NUMERIC,
    ask_quantity NUMERIC,
    open_price NUMERIC,
    high_price NUMERIC,
    low_price NUMERIC,
    volume NUMERIC,
    quote_volume NUMERIC,

    open_time TIMESTAMP,
    open_time_POSIX NUMERIC,
    close_time TIMESTAMP,
    first_id BIGINT,
    last_id BIGINT,
    count INTEGER,

    source TEXT
);

-- Index for DailySummaries table
CREATE INDEX idx_dailysummaries_ticker_time ON public.DailySummaries (ticker_id, logged_at);

-- Enable Row-Level Security (RLS) on tables
ALTER TABLE public.Tickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.PriceLogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.DailySummaries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the tables
-- Only Alex_Murphy can insert data into the tables, but anyone can select data from them.

-- Policy for Tickers table:
CREATE POLICY tickers_select_policy ON public.Tickers
    FOR SELECT
    USING (true);

CREATE POLICY tickers_insert_policy ON public.Tickers
    FOR INSERT
    TO "Alex_Murphy"
    WITH CHECK (true); 

-- Policy for PriceLogs table:
CREATE POLICY pricelogs_select_policy ON public.PriceLogs
    FOR SELECT
    USING (true);

CREATE POLICY pricelogs_insert_policy ON public.PriceLogs
    FOR INSERT
    TO "Alex_Murphy"
    WITH CHECK (true);

-- Policy for DailySummaries table:
CREATE POLICY dailysummaries_select_policy ON public.DailySummaries
    FOR SELECT
    USING (true);

CREATE POLICY dailysummaries_insert_policy ON public.DailySummaries
    FOR INSERT
    TO "Alex_Murphy"
    WITH CHECK (true);

-- Enable Row-Level Security enforcement
ALTER TABLE public.Tickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.PriceLogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.DailySummaries ENABLE ROW LEVEL SECURITY;
