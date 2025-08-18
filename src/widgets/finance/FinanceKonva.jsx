import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Text, Rect, Group, Line, Circle, Image } from "react-konva";

const UNSUPPORTED_CURRENCIES = ['PKR', 'SAR', 'BHD', 'KWD', 'QAR'];

const MOCK_BASE_RATES = {
  'USD_PKR': 284.68,
  'USD_SAR': 3.75,
  'USD_BHD': 0.38,
  'USD_KWD': 0.31,
  'USD_QAR': 3.64,
  // Add more as needed
};

function getMockBaseRate(base, target) {
  // Try direct pair
  const key = `${base}_${target}`;
  if (MOCK_BASE_RATES[key]) return MOCK_BASE_RATES[key];
  // Try reverse pair
  const revKey = `${target}_${base}`;
  if (MOCK_BASE_RATES[revKey]) return 1 / MOCK_BASE_RATES[revKey];
  // Fallback
  return 100;
}

function generateMockFinanceData(base, target) {
  const baseRate = getMockBaseRate(base, target);
  const chartData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: baseRate + Math.sin(i) * (Math.random() * 2) + Math.random() * 1.5
  }));
  const today = chartData[6].value;
  const yesterday = chartData[5].value;
  const weekAgo = chartData[0].value;
  const dailyVar = yesterday ? (((today - yesterday) / yesterday) * 100).toFixed(2) : "0.00";
  const weeklyVar = weekAgo ? (((today - weekAgo) / weekAgo) * 100).toFixed(2) : "0.00";
  return {
    rate: today,
    dailyVar,
    weeklyVar,
    chartData,
    base,
    target,
    time: new Date(),
    isMock: true
  };
}

function FinanceKonva({ open, onClose, widget, settings, stageWidth: propStageWidth, stageHeight: propStageHeight }) {
  const [currentData, setCurrentData] = useState(0);
  const [fade, setFade] = useState(1);
  const [slideOffset, setSlideOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState(null);
  const timerRef = useRef();
  
  // Stage dimensions (allow override for mini-preview)
  const stageWidth = propStageWidth || 800;
  const stageHeight = propStageHeight || 600;
  // Scaling for mini-preview
  const scaleX = stageWidth / 800;
  const scaleY = stageHeight / 600;

  // Extract selected currencies
  const baseCurrency = widget?.baseCurrency || "USD";
  const exchangeCurrency = widget?.exchangeCurrency || "EUR";
  const exchangeCurrency1 = widget?.exchangeCurrency1 || null;
  const exchangeCurrency2 = widget?.exchangeCurrency2 || null;
  const exchangeCurrency3 = widget?.exchangeCurrency3 || null;
  const exchangeCurrency4 = widget?.exchangeCurrency4 || null;

  // Add state for multiple rates
  const [multiRates, setMultiRates] = useState([]);
  // Add state for multi-currency chart data
  const [multiChartData, setMultiChartData] = useState([]);
  // Add state for multi-currency table data
  const [multiTableData, setMultiTableData] = useState([]);
  // Add state for mini chart data
  const [miniChartData, setMiniChartData] = useState(null);
  // Add state for multi-currency exchange rate data
  const [multiCurrencyData, setMultiCurrencyData] = useState([]);
  // Add state for single exchange rate data
  const [singleRateData, setSingleRateData] = useState(null);
  // Add state for single exchange rate chart data
  const [singleChartData, setSingleChartData] = useState(null);
  // Add state for single ticker data
  const [singleTickerData, setSingleTickerData] = useState(null);
  // Add state for ticker, symbol info, symbol overview, and ticker tape data
  const [tickerData, setTickerData] = useState(null);
  const [symbolInfoData, setSymbolInfoData] = useState(null);
  const [symbolOverviewData, setSymbolOverviewData] = useState(null);
  const [tickerTapeData, setTickerTapeData] = useState([]);

  // Fetch real-time and historical data when currencies change
  useEffect(() => {
    let didCancel = false;
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      if (!didCancel) {
        setError('Request timed out. Please try again.');
        setLoading(false);
      }
    }, 10000); // 10 seconds

    async function fetchData() {
      // Use mock if unsupported
      if (UNSUPPORTED_CURRENCIES.includes(baseCurrency) || UNSUPPORTED_CURRENCIES.includes(exchangeCurrency)) {
        const mock = generateMockFinanceData(baseCurrency, exchangeCurrency);
        setApiData(mock);
        setLoading(false);
        return;
      }
      try {
        // Fetch latest rate from Frankfurter
        const latestRes = await fetch(`https://api.frankfurter.app/latest?from=${baseCurrency}&to=${exchangeCurrency}`, { signal: controller.signal });
        const latestJson = await latestRes.json();
        if (!latestJson || !latestJson.rates || latestJson.rates[exchangeCurrency] === undefined) {
          console.error('Frankfurter API latest response missing data:', latestJson);
          throw new Error('Exchange rate data not available for selected currencies.');
        }
        const latestRate = latestJson.rates[exchangeCurrency];

        // Fetch last 7 days from Frankfurter
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 6);
        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];
        const histRes = await fetch(`https://api.frankfurter.app/${startStr}..${endStr}?from=${baseCurrency}&to=${exchangeCurrency}`, { signal: controller.signal });
        const histJson = await histRes.json();
        if (!histJson || !histJson.rates) {
          console.error('Frankfurter API history response missing data:', histJson);
          throw new Error('Exchange rate history not available for selected currencies.');
        }
        const rates = histJson.rates;
        const days = Object.keys(rates).sort();
        const today = rates[days[days.length - 1]] && rates[days[days.length - 1]][exchangeCurrency];
        const yesterday = rates[days[days.length - 2]] && rates[days[days.length - 2]][exchangeCurrency];
        const weekAgo = rates[days[0]] && rates[days[0]][exchangeCurrency];
        if (today === undefined) {
          console.error('Frankfurter API timeseries missing today rate:', histJson);
          throw new Error('No exchange rate data for today.');
        }
        // Prepare chart data
        const chartData = days.map(date => ({
          date,
          value: rates[date][exchangeCurrency],
        }));
        // Calculate daily/weekly variation
        const dailyVar = yesterday ? (((today - yesterday) / yesterday) * 100).toFixed(2) : "0.00";
        const weeklyVar = weekAgo ? (((today - weekAgo) / weekAgo) * 100).toFixed(2) : "0.00";
        if (!didCancel) {
          setApiData({
            rate: today,
            dailyVar,
            weeklyVar,
            chartData,
            base: baseCurrency,
            target: exchangeCurrency,
            time: end,
          });
          setLoading(false);
        }
      } catch (e) {
        if (!didCancel) {
          console.error('Frankfurter API error:', e);
          setError(e.message || 'Failed to fetch exchange rates. Please check your connection or try again.');
          setLoading(false);
        }
      } finally {
        clearTimeout(timeout);
      }
    };
    fetchData();
    return () => {
      didCancel = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [baseCurrency, exchangeCurrency]);

  // Fetch multiple exchange rates for Exchange Rate app
  useEffect(() => {
    const widgetName = widget?.name?.toLowerCase() || "";
    if (!(widgetName.includes('exchange rate') && !widgetName.includes('scroller') && !widgetName.includes('7 days'))) {
      setMultiRates([]);
      return;
    }
    const selectedCurrencies = [exchangeCurrency1, exchangeCurrency2, exchangeCurrency3, exchangeCurrency4].filter(Boolean);
    if (!baseCurrency || selectedCurrencies.length === 0) {
      setMultiRates([]);
      return;
    }
    let didCancel = false;
    setLoading(true);
    setError(null);
    async function fetchAllRates() {
      const results = [];
      for (let target of selectedCurrencies) {
        if (UNSUPPORTED_CURRENCIES.includes(baseCurrency) || UNSUPPORTED_CURRENCIES.includes(target)) {
          const mock = generateMockFinanceData(baseCurrency, target);
          results.push({
            from: baseCurrency,
            to: target,
            rate: mock.rate,
            flag: '',
            isMock: true
          });
          continue;
        }
        try {
          const res = await fetch(`https://api.frankfurter.app/latest?from=${baseCurrency}&to=${target}`);
          const json = await res.json();
          if (json && json.rates && json.rates[target] !== undefined) {
            results.push({
              from: baseCurrency,
              to: target,
              rate: json.rates[target],
              flag: '',
              isMock: false
            });
          } else {
            results.push({
              from: baseCurrency,
              to: target,
              rate: 'N/A',
              flag: '',
              isMock: false
            });
          }
        } catch (e) {
          results.push({
            from: baseCurrency,
            to: target,
            rate: 'N/A',
            flag: '',
            isMock: false
          });
        }
      }
      if (!didCancel) {
        setMultiRates(results);
        setLoading(false);
      }
    }
    fetchAllRates();
    return () => { didCancel = true; };
  }, [baseCurrency, exchangeCurrency1, exchangeCurrency2, exchangeCurrency3, exchangeCurrency4, widget?.name]);

  // Fetch 7-day history for each selected currency for Exchange Rate Chart app
  useEffect(() => {
    const widgetName = widget?.name?.toLowerCase() || "";
    if (!(widgetName.includes('exchange rate chart'))) {
      setMultiChartData([]);
      return;
    }
    const selectedCurrencies = [exchangeCurrency1, exchangeCurrency2, exchangeCurrency3, exchangeCurrency4].filter(Boolean);
    if (!baseCurrency || selectedCurrencies.length === 0) {
      setMultiChartData([]);
      return;
    }
    let didCancel = false;
    setLoading(true);
    setError(null);
    async function fetchAllHistories() {
      const results = [];
      for (let i = 0; i < selectedCurrencies.length; i++) {
        const target = selectedCurrencies[i];
        if (UNSUPPORTED_CURRENCIES.includes(baseCurrency) || UNSUPPORTED_CURRENCIES.includes(target)) {
          const mock = generateMockFinanceData(baseCurrency, target);
          results.push({
            target,
            chartData: mock.chartData,
            latest: mock.rate,
            isMock: true
          });
          continue;
        }
        try {
          const end = new Date();
          const start = new Date();
          start.setDate(end.getDate() - 6);
          const startStr = start.toISOString().split('T')[0];
          const endStr = end.toISOString().split('T')[0];
          const histRes = await fetch(`https://api.frankfurter.app/${startStr}..${endStr}?from=${baseCurrency}&to=${target}`);
          const histJson = await histRes.json();
          if (!histJson || !histJson.rates) {
            results.push({ target, chartData: [], latest: 'N/A', isMock: false });
            continue;
          }
          const rates = histJson.rates;
          const days = Object.keys(rates).sort();
          const chartData = days.map(date => ({ date, value: rates[date][target] }));
          const latest = chartData.length > 0 ? chartData[chartData.length - 1].value : 'N/A';
          results.push({ target, chartData, latest, isMock: false });
        } catch (e) {
          results.push({ target, chartData: [], latest: 'N/A', isMock: false });
        }
      }
      if (!didCancel) {
        setMultiChartData(results);
        setLoading(false);
      }
    }
    fetchAllHistories();
    return () => { didCancel = true; };
  }, [baseCurrency, exchangeCurrency1, exchangeCurrency2, exchangeCurrency3, exchangeCurrency4, widget?.name]);

  // Fetch latest rate for each selected currency for Exchange Rate Table app
  useEffect(() => {
    const widgetName = widget?.name?.toLowerCase() || "";
    if (!(widgetName.includes('exchange rate table'))) {
      setMultiTableData([]);
      return;
    }
    const selectedCurrencies = [exchangeCurrency1, exchangeCurrency2, exchangeCurrency3, exchangeCurrency4].filter(Boolean);
    if (!baseCurrency || selectedCurrencies.length === 0) {
      setMultiTableData([]);
      return;
    }
    let didCancel = false;
    setLoading(true);
    setError(null);
    async function fetchAllTableRates() {
      const results = [];
      for (let i = 0; i < selectedCurrencies.length; i++) {
        const target = selectedCurrencies[i];
        if (UNSUPPORTED_CURRENCIES.includes(baseCurrency) || UNSUPPORTED_CURRENCIES.includes(target)) {
          const mock = generateMockFinanceData(baseCurrency, target);
          results.push({
            from: baseCurrency,
            to: target,
            rate: mock.rate,
            isMock: true
          });
          continue;
        }
        try {
          const res = await fetch(`https://api.frankfurter.app/latest?from=${baseCurrency}&to=${target}`);
          const json = await res.json();
          if (json && json.rates && json.rates[target] !== undefined) {
            results.push({
              from: baseCurrency,
              to: target,
              rate: json.rates[target],
              isMock: false
            });
          } else {
            results.push({
              from: baseCurrency,
              to: target,
              rate: 'N/A',
              isMock: false
            });
          }
        } catch (e) {
          results.push({
            from: baseCurrency,
            to: target,
            rate: 'N/A',
            isMock: false
          });
        }
      }
      if (!didCancel) {
        setMultiTableData(results);
        setLoading(false);
      }
    }
    fetchAllTableRates();
    return () => { didCancel = true; };
  }, [baseCurrency, exchangeCurrency1, exchangeCurrency2, exchangeCurrency3, exchangeCurrency4, widget?.name]);

  // Fetch 7-day history for Mini Chart app
  useEffect(() => {
    const widgetName = widget?.name?.toLowerCase() || "";
    if (!(widgetName.includes('mini chart'))) {
      setMiniChartData(null);
      return;
    }
    if (!baseCurrency || !exchangeCurrency) {
      setMiniChartData(null);
      return;
    }
    let didCancel = false;
    setLoading(true);
    setError(null);
    async function fetchMiniChart() {
      if (UNSUPPORTED_CURRENCIES.includes(baseCurrency) || UNSUPPORTED_CURRENCIES.includes(exchangeCurrency)) {
        const mock = generateMockFinanceData(baseCurrency, exchangeCurrency);
        setMiniChartData({
          currency: `${baseCurrency}/${exchangeCurrency}`,
          rate: mock.rate,
          change: mock.dailyVar,
          value: mock.weeklyVar,
          chartData: mock.chartData,
          isMock: true
        });
        setLoading(false);
        return;
      }
      try {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 6);
        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];
        const histRes = await fetch(`https://api.frankfurter.app/${startStr}..${endStr}?from=${baseCurrency}&to=${exchangeCurrency}`);
        const histJson = await histRes.json();
        if (!histJson || !histJson.rates) {
          setMiniChartData(null);
          setLoading(false);
          return;
        }
        const rates = histJson.rates;
        const days = Object.keys(rates).sort();
        const chartData = days.map(date => ({ date, value: rates[date][exchangeCurrency] }));
        const rate = chartData.length > 0 ? chartData[chartData.length - 1].value : 'N/A';
        const yesterday = chartData.length > 1 ? chartData[chartData.length - 2].value : rate;
        const weekAgo = chartData.length > 0 ? chartData[0].value : rate;
        const change = yesterday ? (((rate - yesterday) / yesterday) * 100).toFixed(2) : "0.00";
        const weekly = weekAgo ? (((rate - weekAgo) / weekAgo) * 100).toFixed(2) : "0.00";
        setMiniChartData({
          currency: `${baseCurrency}/${exchangeCurrency}`,
          rate,
          change,
          value: weekly,
          chartData,
          isMock: false
        });
        setLoading(false);
      } catch (e) {
        setMiniChartData(null);
        setLoading(false);
      }
    }
    fetchMiniChart();
    return () => { didCancel = true; };
  }, [baseCurrency, exchangeCurrency, widget?.name]);

  // Fetch latest rate for each selected currency for Multi-currency Exchange Rate app
  useEffect(() => {
    const widgetName = widget?.name?.toLowerCase() || "";
    if (!(widgetName.includes('multi-currency exchange rate'))) {
      setMultiCurrencyData([]);
      return;
    }
    const selectedCurrencies = [exchangeCurrency1, exchangeCurrency2, exchangeCurrency3, exchangeCurrency4].filter(Boolean);
    if (!baseCurrency || selectedCurrencies.length === 0) {
      setMultiCurrencyData([]);
      return;
    }
    let didCancel = false;
    setLoading(true);
    setError(null);
    async function fetchAllMultiRates() {
      const results = [];
      for (let i = 0; i < selectedCurrencies.length; i++) {
        const target = selectedCurrencies[i];
        if (UNSUPPORTED_CURRENCIES.includes(baseCurrency) || UNSUPPORTED_CURRENCIES.includes(target)) {
          const mock = generateMockFinanceData(baseCurrency, target);
          results.push({
            from: baseCurrency,
            to: target,
            rate: mock.rate,
            isMock: true
          });
          continue;
        }
        try {
          const res = await fetch(`https://api.frankfurter.app/latest?from=${baseCurrency}&to=${target}`);
          const json = await res.json();
          if (json && json.rates && json.rates[target] !== undefined) {
            results.push({
              from: baseCurrency,
              to: target,
              rate: json.rates[target],
              isMock: false
            });
          } else {
            results.push({
              from: baseCurrency,
              to: target,
              rate: 'N/A',
              isMock: false
            });
          }
        } catch (e) {
          results.push({
            from: baseCurrency,
            to: target,
            rate: 'N/A',
            isMock: false
          });
        }
      }
      if (!didCancel) {
        setMultiCurrencyData(results);
        setLoading(false);
      }
    }
    fetchAllMultiRates();
    return () => { didCancel = true; };
  }, [baseCurrency, exchangeCurrency1, exchangeCurrency2, exchangeCurrency3, exchangeCurrency4, widget?.name]);

  // Fetch latest rate for Single Exchange Rate app
  useEffect(() => {
    const widgetName = widget?.name?.toLowerCase() || "";
    if (!(widgetName.includes('single exchange rate') && !widgetName.includes('chart'))) {
      setSingleRateData(null);
      return;
    }
    if (!baseCurrency || !exchangeCurrency) {
      setSingleRateData(null);
      return;
    }
    let didCancel = false;
    setLoading(true);
    setError(null);
    async function fetchSingleRate() {
      if (UNSUPPORTED_CURRENCIES.includes(baseCurrency) || UNSUPPORTED_CURRENCIES.includes(exchangeCurrency)) {
        const mock = generateMockFinanceData(baseCurrency, exchangeCurrency);
        setSingleRateData({
          from: baseCurrency,
          to: exchangeCurrency,
          rate: mock.rate,
          change: mock.dailyVar,
          isMock: true
        });
        setLoading(false);
        return;
      }
      try {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);
        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];
        const histRes = await fetch(`https://api.frankfurter.app/${startStr}..${endStr}?from=${baseCurrency}&to=${exchangeCurrency}`);
        const histJson = await histRes.json();
        if (!histJson || !histJson.rates) {
          setSingleRateData(null);
          setLoading(false);
          return;
        }
        const rates = histJson.rates;
        const days = Object.keys(rates).sort();
        const today = rates[days[days.length - 1]] && rates[days[days.length - 1]][exchangeCurrency];
        const yesterday = rates[days[0]] && rates[days[0]][exchangeCurrency];
        const change = yesterday ? (((today - yesterday) / yesterday) * 100).toFixed(2) : "0.00";
        setSingleRateData({
          from: baseCurrency,
          to: exchangeCurrency,
          rate: today,
          change,
          isMock: false
        });
        setLoading(false);
      } catch (e) {
        setSingleRateData(null);
        setLoading(false);
      }
    }
    fetchSingleRate();
    return () => { didCancel = true; };
  }, [baseCurrency, exchangeCurrency, widget?.name]);

  // Fetch 7-day history for Single Exchange Rate Chart app
  useEffect(() => {
    const widgetName = widget?.name?.toLowerCase() || "";
    if (!(widgetName.includes('single exchange rate chart'))) {
      setSingleChartData(null);
      return;
    }
    if (!baseCurrency || !exchangeCurrency) {
      setSingleChartData(null);
      return;
    }
    let didCancel = false;
    setLoading(true);
    setError(null);
    async function fetchSingleChart() {
      if (UNSUPPORTED_CURRENCIES.includes(baseCurrency) || UNSUPPORTED_CURRENCIES.includes(exchangeCurrency)) {
        const mock = generateMockFinanceData(baseCurrency, exchangeCurrency);
        setSingleChartData({
          from: baseCurrency,
          to: exchangeCurrency,
          rate: mock.rate,
          change: mock.dailyVar,
          weekly: mock.weeklyVar,
          chartData: mock.chartData,
          isMock: true
        });
        setLoading(false);
        return;
      }
      try {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 6);
        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];
        const histRes = await fetch(`https://api.frankfurter.app/${startStr}..${endStr}?from=${baseCurrency}&to=${exchangeCurrency}`);
        const histJson = await histRes.json();
        if (!histJson || !histJson.rates) {
          setSingleChartData(null);
          setLoading(false);
          return;
        }
        const rates = histJson.rates;
        const days = Object.keys(rates).sort();
        const chartData = days.map(date => ({ date, value: rates[date][exchangeCurrency] }));
        const rate = chartData.length > 0 ? chartData[chartData.length - 1].value : 'N/A';
        const yesterday = chartData.length > 1 ? chartData[chartData.length - 2].value : rate;
        const weekAgo = chartData.length > 0 ? chartData[0].value : rate;
        const change = yesterday ? (((rate - yesterday) / yesterday) * 100).toFixed(2) : "0.00";
        const weekly = weekAgo ? (((rate - weekAgo) / weekAgo) * 100).toFixed(2) : "0.00";
        setSingleChartData({
          from: baseCurrency,
          to: exchangeCurrency,
          rate,
          change,
          weekly,
          chartData,
          isMock: false
        });
        setLoading(false);
      } catch (e) {
        setSingleChartData(null);
        setLoading(false);
      }
    }
    fetchSingleChart();
    return () => { didCancel = true; };
  }, [baseCurrency, exchangeCurrency, widget?.name]);

  // Fetch latest rate for Single Ticker app
  useEffect(() => {
    const widgetName = widget?.name?.toLowerCase() || "";
    if (!(widgetName.includes('single ticker'))) {
      setSingleTickerData(null);
      return;
    }
    if (!baseCurrency || !exchangeCurrency) {
      setSingleTickerData(null);
      return;
    }
    let didCancel = false;
    setLoading(true);
    setError(null);
    async function fetchSingleTicker() {
      if (UNSUPPORTED_CURRENCIES.includes(baseCurrency) || UNSUPPORTED_CURRENCIES.includes(exchangeCurrency)) {
        const mock = generateMockFinanceData(baseCurrency, exchangeCurrency);
        setSingleTickerData({
          symbol: `${baseCurrency}${exchangeCurrency}`,
          name: `${baseCurrency} / ${exchangeCurrency}`,
          rate: mock.rate,
          change: mock.dailyVar,
          value: mock.weeklyVar,
          isMock: true
        });
        setLoading(false);
        return;
      }
      try {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);
        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];
        const histRes = await fetch(`https://api.frankfurter.app/${startStr}..${endStr}?from=${baseCurrency}&to=${exchangeCurrency}`);
        const histJson = await histRes.json();
        if (!histJson || !histJson.rates) {
          setSingleTickerData(null);
          setLoading(false);
          return;
        }
        const rates = histJson.rates;
        const days = Object.keys(rates).sort();
        const today = rates[days[days.length - 1]] && rates[days[days.length - 1]][exchangeCurrency];
        const yesterday = rates[days[0]] && rates[days[0]][exchangeCurrency];
        const change = yesterday ? (((today - yesterday) / yesterday) * 100).toFixed(2) : "0.00";
        setSingleTickerData({
          symbol: `${baseCurrency}${exchangeCurrency}`,
          name: `${baseCurrency} / ${exchangeCurrency}`,
          rate: today,
          change,
          value: '',
          isMock: false
        });
        setLoading(false);
      } catch (e) {
        setSingleTickerData(null);
        setLoading(false);
      }
    }
    fetchSingleTicker();
    return () => { didCancel = true; };
  }, [baseCurrency, exchangeCurrency, widget?.name]);

  // Fetch latest rate for Ticker app
  useEffect(() => {
    const widgetName = widget?.name?.toLowerCase() || "";
    if (!(widgetName.includes('ticker') && !widgetName.includes('tape') && !widgetName.includes('single'))) {
      setTickerData(null);
      return;
    }
    if (!baseCurrency || !exchangeCurrency) {
      setTickerData(null);
      return;
    }
    let didCancel = false;
    setLoading(true);
    setError(null);
    async function fetchTicker() {
      if (UNSUPPORTED_CURRENCIES.includes(baseCurrency) || UNSUPPORTED_CURRENCIES.includes(exchangeCurrency)) {
        const mock = generateMockFinanceData(baseCurrency, exchangeCurrency);
        setTickerData({
          symbol: `${baseCurrency}/${exchangeCurrency}`,
          rate: mock.rate,
          value: mock.weeklyVar,
          isMock: true
        });
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`https://api.frankfurter.app/latest?from=${baseCurrency}&to=${exchangeCurrency}`);
        const json = await res.json();
        if (json && json.rates && json.rates[exchangeCurrency] !== undefined) {
          setTickerData({
            symbol: `${baseCurrency}/${exchangeCurrency}`,
            rate: json.rates[exchangeCurrency],
            value: '',
            isMock: false
          });
        } else {
          setTickerData({ symbol: `${baseCurrency}/${exchangeCurrency}`, rate: 'N/A', value: '', isMock: false });
        }
        setLoading(false);
      } catch (e) {
        setTickerData({ symbol: `${baseCurrency}/${exchangeCurrency}`, rate: 'N/A', value: '', isMock: false });
        setLoading(false);
      }
    }
    fetchTicker();
    return () => { didCancel = true; };
  }, [baseCurrency, exchangeCurrency, widget?.name]);

  // Fetch latest rate for Symbol Info app
  useEffect(() => {
    const widgetName = widget?.name?.toLowerCase() || "";
    if (!widgetName.includes('symbol info')) {
      setSymbolInfoData(null);
      return;
    }
    if (!baseCurrency || !exchangeCurrency) {
      setSymbolInfoData(null);
      return;
    }
    let didCancel = false;
    setLoading(true);
    setError(null);
    async function fetchSymbolInfo() {
      if (UNSUPPORTED_CURRENCIES.includes(baseCurrency) || UNSUPPORTED_CURRENCIES.includes(exchangeCurrency)) {
        const mock = generateMockFinanceData(baseCurrency, exchangeCurrency);
        setSymbolInfoData({
          name: `${baseCurrency} / ${exchangeCurrency}`,
          rate: mock.rate,
          isMock: true
        });
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`https://api.frankfurter.app/latest?from=${baseCurrency}&to=${exchangeCurrency}`);
        const json = await res.json();
        if (json && json.rates && json.rates[exchangeCurrency] !== undefined) {
          setSymbolInfoData({
            name: `${baseCurrency} / ${exchangeCurrency}`,
            rate: json.rates[exchangeCurrency],
            isMock: false
          });
        } else {
          setSymbolInfoData({ name: `${baseCurrency} / ${exchangeCurrency}`, rate: 'N/A', isMock: false });
        }
        setLoading(false);
      } catch (e) {
        setSymbolInfoData({ name: `${baseCurrency} / ${exchangeCurrency}`, rate: 'N/A', isMock: false });
        setLoading(false);
      }
    }
    fetchSymbolInfo();
    return () => { didCancel = true; };
  }, [baseCurrency, exchangeCurrency, widget?.name]);

  // Fetch latest rate for Symbol Overview app
  useEffect(() => {
    const widgetName = widget?.name?.toLowerCase() || "";
    if (!widgetName.includes('symbol overview')) {
      setSymbolOverviewData(null);
      return;
    }
    if (!baseCurrency || !exchangeCurrency) {
      setSymbolOverviewData(null);
      return;
    }
    let didCancel = false;
    setLoading(true);
    setError(null);
    async function fetchSymbolOverview() {
      if (UNSUPPORTED_CURRENCIES.includes(baseCurrency) || UNSUPPORTED_CURRENCIES.includes(exchangeCurrency)) {
        const mock = generateMockFinanceData(baseCurrency, exchangeCurrency);
        setSymbolOverviewData({
          name: `${baseCurrency} / ${exchangeCurrency}`,
          rate: mock.rate,
          change: mock.dailyVar,
          percent: mock.weeklyVar,
          isMock: true
        });
        setLoading(false);
        return;
      }
      try {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);
        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];
        const histRes = await fetch(`https://api.frankfurter.app/${startStr}..${endStr}?from=${baseCurrency}&to=${exchangeCurrency}`);
        const histJson = await histRes.json();
        if (!histJson || !histJson.rates) {
          setSymbolOverviewData({ name: `${baseCurrency} / ${exchangeCurrency}`, rate: 'N/A', change: '', percent: '', isMock: false });
          setLoading(false);
          return;
        }
        const rates = histJson.rates;
        const days = Object.keys(rates).sort();
        const today = rates[days[days.length - 1]] && rates[days[days.length - 1]][exchangeCurrency];
        const yesterday = rates[days[0]] && rates[days[0]][exchangeCurrency];
        const change = yesterday ? (((today - yesterday) / yesterday) * 100).toFixed(2) : "0.00";
        setSymbolOverviewData({
          name: `${baseCurrency} / ${exchangeCurrency}`,
          rate: today,
          change,
          percent: change,
          isMock: false
        });
        setLoading(false);
      } catch (e) {
        setSymbolOverviewData({ name: `${baseCurrency} / ${exchangeCurrency}`, rate: 'N/A', change: '', percent: '', isMock: false });
        setLoading(false);
      }
    }
    fetchSymbolOverview();
    return () => { didCancel = true; };
  }, [baseCurrency, exchangeCurrency, widget?.name]);

  // Fetch latest rates for Ticker Tape app (up to 4 selected currencies)
  useEffect(() => {
    const widgetName = widget?.name?.toLowerCase() || "";
    if (!widgetName.includes('ticker tape')) {
      setTickerTapeData([]);
      return;
    }
    const selectedCurrencies = [exchangeCurrency1, exchangeCurrency2, exchangeCurrency3, exchangeCurrency4].filter(Boolean);
    if (!baseCurrency || selectedCurrencies.length === 0) {
      setTickerTapeData([]);
      return;
    }
    let didCancel = false;
    setLoading(true);
    setError(null);
    async function fetchAllTickerTape() {
      const results = [];
      for (let i = 0; i < selectedCurrencies.length; i++) {
        const target = selectedCurrencies[i];
        if (UNSUPPORTED_CURRENCIES.includes(baseCurrency) || UNSUPPORTED_CURRENCIES.includes(target)) {
          const mock = generateMockFinanceData(baseCurrency, target);
          results.push({
            symbol: `${baseCurrency}/${target}`,
            rate: mock.rate,
            change: mock.dailyVar,
            isMock: true
          });
          continue;
        }
        try {
          const end = new Date();
          const start = new Date();
          start.setDate(end.getDate() - 1);
          const startStr = start.toISOString().split('T')[0];
          const endStr = end.toISOString().split('T')[0];
          const histRes = await fetch(`https://api.frankfurter.app/${startStr}..${endStr}?from=${baseCurrency}&to=${target}`);
          const histJson = await histRes.json();
          if (!histJson || !histJson.rates) {
            results.push({ symbol: `${baseCurrency}/${target}`, rate: 'N/A', change: '', isMock: false });
            continue;
          }
          const rates = histJson.rates;
          const days = Object.keys(rates).sort();
          const today = rates[days[days.length - 1]] && rates[days[days.length - 1]][target];
          const yesterday = rates[days[0]] && rates[days[0]][target];
          const change = yesterday ? (((today - yesterday) / yesterday) * 100).toFixed(2) : "0.00";
          results.push({
            symbol: `${baseCurrency}/${target}`,
            rate: today,
            change,
            isMock: false
          });
        } catch (e) {
          results.push({ symbol: `${baseCurrency}/${target}`, rate: 'N/A', change: '', isMock: false });
        }
      }
      if (!didCancel) {
        setTickerTapeData(results);
        setLoading(false);
      }
    }
    fetchAllTickerTape();
    return () => { didCancel = true; };
  }, [baseCurrency, exchangeCurrency1, exchangeCurrency2, exchangeCurrency3, exchangeCurrency4, widget?.name]);

  // Sample finance data for different widget types
  const getFinanceData = (widgetName) => {
    const name = widgetName.toLowerCase();
    
    if (name.includes('7 days exchange rate')) {
      return {
        title: "7 Days Exchange Rate",
        data: [
          { currency: "USD", rate: "0.862", dailyVar: "-0.08%", weeklyVar: "-0.11%", time: "8:35 PM November 9, 2017" },
          { currency: "EUR", rate: "1.087", dailyVar: "+0.12%", weeklyVar: "+0.05%", time: "8:35 PM November 9, 2017" },
          { currency: "GBP", rate: "1.233", dailyVar: "-0.03%", weeklyVar: "+0.18%", time: "8:35 PM November 9, 2017" }
        ],
        chartData: [
          { day: "Mon", value: 0.865 },
          { day: "Tue", value: 0.863 },
          { day: "Wed", value: 0.861 },
          { day: "Thu", value: 0.864 },
          { day: "Fri", value: 0.862 },
          { day: "Sat", value: 0.860 },
          { day: "Sun", value: 0.862 }
        ]
      };
    } else if (name.includes('currency exchange scroller')) {
      return {
        title: "Currency Exchange Scroller",
        currencies: [
          { code: "EUR", rate: "1.087", change: "+0.12%" },
          { code: "GBP", rate: "1.233", change: "-0.03%" },
          { code: "JPY", rate: "0.009", change: "+0.05%" },
          { code: "HKD", rate: "0.129", change: "-0.02%" },
          { code: "BRL", rate: "0.173", change: "+0.08%" }
        ]
      };
    } else if (name.includes('exchange rate') && !name.includes('chart') && !name.includes('table')) {
      return {
        title: "Exchange Rate",
        rates: [
          { from: "GBP", to: "USD", rate: "1.200", flag: "🇬🇧" },
          { from: "EUR", to: "USD", rate: "1.007", flag: "🇪🇺" },
          { from: "HKD", to: "USD", rate: "0.129", flag: "🇭🇰" },
          { from: "JPY", to: "USD", rate: "0.009", flag: "🇯🇵" }
        ]
      };
    } else if (name.includes('exchange rate chart')) {
      return {
        title: "Exchange Rate Chart",
        rates: [
          { from: "BRL", to: "USD", rate: "0.173", flag: "🇧🇷" },
          { from: "GBP", to: "USD", rate: "1.233", flag: "🇬🇧" },
          { from: "EUR", to: "USD", rate: "1.087", flag: "🇪🇺" },
          { from: "HKD", to: "USD", rate: "0.129", flag: "🇭🇰" },
          { from: "JPY", to: "USD", rate: "0.009", flag: "🇯🇵" }
        ],
        chartData: [
          { time: "09:00", value: 0.170 },
          { time: "12:00", value: 0.172 },
          { time: "15:00", value: 0.175 },
          { time: "18:00", value: 0.173 }
        ]
      };
    } else if (name.includes('exchange rate table')) {
      return {
        title: "Exchange Rate Table",
        description: "Select and present up to 10 stocks or financial indexes in a fullscreen landscape, or portrait mode.",
        rates: [
          { currency: "USD/EUR", rate: "0.9074", change: "-0.43%", value: "0.0039" },
          { currency: "GBP/USD", rate: "1.233", change: "+0.12%", value: "0.0015" },
          { currency: "EUR/JPY", rate: "120.85", change: "-0.08%", value: "-0.097" },
          { currency: "USD/JPY", rate: "111.23", change: "+0.05%", value: "0.055" }
        ]
      };
    } else if (name.includes('mini chart')) {
      return {
        title: "Mini Chart",
        data: { currency: "USD/EUR", rate: "0.9074", change: "-0.43%", value: "0.0039" },
        chartData: [
          { time: "00:00", value: 0.910 },
          { time: "04:00", value: 0.908 },
          { time: "08:00", value: 0.906 },
          { time: "12:00", value: 0.905 },
          { time: "16:00", value: 0.907 },
          { time: "20:00", value: "0.9074" }
        ]
      };
    } else if (name.includes('multi-currency exchange rate')) {
      return {
        title: "Multi-currency Exchange Rate",
        data: { currency: "EUR", rate: "1.22", change: "-0.03%" }
      };
    } else if (name.includes('single exchange rate') && !name.includes('chart')) {
      return {
        title: "Single Exchange Rate",
        data: { from: "USD", to: "EUR", rate: "0.82", change: "-0.03%" }
      };
    } else if (name.includes('single exchange rate chart')) {
      return {
        title: "Single Exchange Rate Chart",
        data: { from: "EUR", to: "USD", rate: "1.101", change: "-0.00%", weekly: "-0.15%" },
        chartData: [
          { time: "Mon", value: 1.105 },
          { time: "Tue", value: 1.103 },
          { time: "Wed", value: 1.102 },
          { time: "Thu", value: 1.100 },
          { time: "Fri", value: "1.101" }
        ]
      };
    } else if (name.includes('single ticker')) {
      return {
        title: "Single Ticker",
        data: { symbol: "USDEUR", name: "U.S. DOLLAR / EURO", rate: "0.9075", change: "-0.44%", value: "0.0040" }
      };
    } else if (name.includes('ticker') && !name.includes('tape') && !name.includes('single')) {
      return {
        title: "Ticker",
        data: { symbol: "USD/EUR", rate: "0.52%", value: "0.00470000" }
      };
    } else if (name.includes('symbol info')) {
      return {
        title: "Symbol Info",
        data: { name: "U.S. DOLLAR / EURO", rate: "0.9075" }
      };
    } else if (name.includes('symbol overview')) {
      return {
        title: "Symbol Overview",
        data: { name: "U.S. Dollar / Euro", rate: "0.9075", change: "-0.0640", percent: "+7.59%" }
      };
    } else if (name.includes('ticker tape')) {
      return {
        title: "Ticker Tape",
        tickers: [
          { symbol: "USD/EUR", rate: "0.90840000", change: "(-0.62%)" },
          { symbol: "GBP/USD", rate: "1.23300000", change: "(+0.12%)" },
          { symbol: "EUR/JPY", rate: "120.850000", change: "(-0.08%)" },
          { symbol: "USD/JPY", rate: "111.230000", change: "(+0.05%)" }
        ]
      };
    } else {
      return {
        title: "Finance Widget",
        data: { currency: "USD", rate: "1.000", change: "0.00%" }
      };
    }
  };

  const financeData = getFinanceData(widget?.name);
  const showEachDataFor = settings?.showEachDataFor || 10;
  const transitionSpeed = settings?.transitionSpeed || 0.7;
  const backgroundColor = settings?.backgroundColor || '#ffffff';
  const disableAnimations = settings?.disableAnimations || false;
  const highlightColor = settings?.highlightColor || '#1976d2';
  const fontColor = settings?.fontColor || '#333';
  const textFont = settings?.textFont || 'Arial';

  // Animation transitions
  useEffect(() => {
    if (!open) return;
    
    if (disableAnimations) {
      setFade(1);
      setSlideOffset(0);
      setIsTransitioning(false);
    } else {
      setIsTransitioning(true);
      
      // Slide transition
      setFade(0);
      setSlideOffset(800);
      
      setTimeout(() => {
        setFade(1);
        setSlideOffset(0);
        setIsTransitioning(false);
      }, transitionSpeed * 1000);
    }
  }, [currentData, open, disableAnimations, transitionSpeed]);

  // Load background image
  useEffect(() => {
    const backgroundImage = widget?.customBgImage || settings?.customBgImage;
    console.log('Loading background image:', backgroundImage);
    if (backgroundImage) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        console.log('Background image loaded successfully');
        setBackgroundImageLoaded(img);
      };
      img.onerror = () => {
        console.log('Failed to load background image:', backgroundImage);
        setBackgroundImageLoaded(null);
      };
      img.src = backgroundImage;
    } else {
      setBackgroundImageLoaded(null);
    }
  }, [widget?.customBgImage, settings?.customBgImage]);

  // Auto-advance timer
  useEffect(() => {
    if (!open) return;
    
    timerRef.current = setTimeout(() => {
      if (financeData.data && Array.isArray(financeData.data)) {
        setCurrentData((prev) => (prev + 1) % financeData.data.length);
      } else if (financeData.currencies && Array.isArray(financeData.currencies)) {
        setCurrentData((prev) => (prev + 1) % financeData.currencies.length);
      } else if (financeData.rates && Array.isArray(financeData.rates)) {
        setCurrentData((prev) => (prev + 1) % financeData.rates.length);
      } else if (financeData.tickers && Array.isArray(financeData.tickers)) {
        setCurrentData((prev) => (prev + 1) % financeData.tickers.length);
      }
    }, showEachDataFor * 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentData, open, showEachDataFor, financeData]);

  // Cleanup on close
  useEffect(() => {
    if (!open) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setCurrentData(0);
      setFade(1);
      setSlideOffset(0);
      setIsTransitioning(false);
    }
  }, [open]);

  if (!open) return null;

  if (loading) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, color: '#888' }}>
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: 'red', textAlign: 'center' }}>
        {error}
      </div>
    );
  }

  const renderFinanceWidget = () => {
    const widgetName = widget?.name?.toLowerCase();
    
    if (widgetName.includes('7 days exchange rate')) {
      return renderExchangeRate7Days();
    } else if (widgetName.includes('currency exchange scroller')) {
      return renderCurrencyScroller();
    } else if (widgetName.includes('exchange rate') && !widgetName.includes('chart') && !widgetName.includes('table')) {
      return renderExchangeRate();
    } else if (widgetName.includes('exchange rate chart')) {
      return renderExchangeRateChart();
    } else if (widgetName.includes('exchange rate table')) {
      return renderExchangeRateTable();
    } else if (widgetName.includes('mini chart')) {
      return renderMiniChart();
    } else if (widgetName.includes('multi-currency exchange rate')) {
      return renderMultiCurrencyRate();
    } else if (widgetName.includes('single exchange rate') && !widgetName.includes('chart')) {
      return renderSingleExchangeRate();
    } else if (widgetName.includes('single exchange rate chart')) {
      return renderSingleExchangeRateChart();
    } else if (widgetName.includes('single ticker')) {
      return renderSingleTicker();
    } else if (widgetName.includes('ticker') && !widgetName.includes('tape') && !widgetName.includes('single')) {
      return renderTicker();
    } else if (widgetName.includes('symbol info')) {
      return renderSymbolInfo();
    } else if (widgetName.includes('symbol overview')) {
      return renderSymbolOverview();
    } else if (widgetName.includes('ticker tape')) {
      return renderTickerTape();
    } else {
      return renderDefaultFinance();
    }
  };

  // Render for 7 days exchange rate with real data
  const renderExchangeRate7Days = () => {
    if (loading || !apiData) {
      return (
        <Group>
          <Rect x={0} y={0} width={800} height={600} fill="#fff" />
          <Text x={300} y={280} text="Loading..." fontSize={32} fill="#888" />
        </Group>
      );
    }
    const data = apiData;
    const chartWidth = 500;
    const chartHeight = 350;
    const chartX = 400;
    const chartY = 100;
    const leftPanelWidth = 400;
    const now = data.time;
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    // Chart Y axis range
    const minY = Math.min(...data.chartData.map(d => d.value));
    const maxY = Math.max(...data.chartData.map(d => d.value));
    const yRange = maxY - minY || 1;
    // Chart points
    const points = data.chartData.map((point, i) => {
      const x = chartX + 50 + (i * (chartWidth - 100) / (data.chartData.length - 1));
      const y = chartY + chartHeight - 40 - ((point.value - minY) / yRange) * (chartHeight - 80);
      return { x, y, label: point.date, value: point.value };
    });
    // Axis labels
    const yLabels = [maxY, minY + yRange * 0.66, minY + yRange * 0.33, minY];
    return (
      <Group>
        {/* Background */}
        <Rect x={0} y={0} width={800} height={600} fill="#fff" />
        {/* Divider */}
        <Line points={[leftPanelWidth, 40, leftPanelWidth, 560]} stroke="#3a4a4a" strokeWidth={2} />
        {/* Left Panel */}
        <Text x={30} y={40} text="Exchange rate" fontSize={24} fontStyle="bold" fill="#111" />
        <Text x={30} y={70} text={data.target} fontSize={48} fontStyle="bold" fill="#111" />
        <Text x={30} y={130} text={`US$`} fontSize={32} fontStyle="bold" fill="#888" />
        <Text x={110} y={120} text={data.rate?.toFixed(3)} fontSize={64} fontStyle="bold" fill="#111" />
        {/* Variations */}
        <Text x={30} y={210} text="Daily Variation" fontSize={22} fontStyle="bold" fill="#888" />
        <Text x={230} y={210} text={`${data.dailyVar > 0 ? '+' : ''}${data.dailyVar}%`} fontSize={28} fontStyle="bold" fill={parseFloat(data.dailyVar) >= 0 ? '#27ae60' : '#e74c3c'} />
        <Text x={30} y={250} text="Weekly Variation" fontSize={22} fontStyle="bold" fill="#888" />
        <Text x={230} y={250} text={`${data.weeklyVar > 0 ? '+' : ''}${data.weeklyVar}%`} fontSize={28} fontStyle="bold" fill={parseFloat(data.weeklyVar) >= 0 ? '#27ae60' : '#e74c3c'} />
        {/* Time */}
        <Text x={30} y={320} text={timeString} fontSize={38} fontStyle="bold" fill="#111" />
        <Text x={30} y={370} text={dateString} fontSize={24} fontStyle="bold" fill="#888" />
        {/* Chart Panel */}
        {/* Chart axes */}
        <Line points={[chartX + 50, chartY + chartHeight - 40, chartX + chartWidth - 40, chartY + chartHeight - 40]} stroke="#888" strokeWidth={2} />
        <Line points={[chartX + 50, chartY + 30, chartX + 50, chartY + chartHeight - 40]} stroke="#888" strokeWidth={2} />
        {/* Y axis labels */}
        {yLabels.map((yVal, i) => {
          const y = chartY + 30 + i * ((chartHeight - 70) / (yLabels.length - 1));
          return (
            <Text key={i} x={chartX + 10} y={y - 12} text={yVal.toFixed(3)} fontSize={14} fill="#888" />
          );
        })}
        {/* X axis labels */}
        {points.map((pt, i) => (
          <Text key={i} x={pt.x - 15} y={chartY + chartHeight - 20} text={pt.label} fontSize={14} fill="#888" />
        ))}
        {/* Chart line */}
        <Line points={points.flatMap(pt => [pt.x, pt.y])} stroke="#2296a6" strokeWidth={3} lineJoin="round" tension={0.3} />
        {/* Chart area fill */}
        <Line points={[points[0].x, chartY + chartHeight - 40, ...points.flatMap(pt => [pt.x, pt.y]), points[points.length - 1].x, chartY + chartHeight - 40]} fill="#2296a633" closed />
        {/* Chart points */}
        {points.map((pt, i) => (
          <Circle key={i} x={pt.x} y={pt.y} radius={5} fill="#2296a6" />
        ))}
        {/* Legend */}
        <Rect x={chartX + 120} y={chartY + 10} width={160} height={28} fill="#fff" stroke="#2296a6" strokeWidth={2} cornerRadius={8} />
        <Line points={[chartX + 130, chartY + 24, chartX + 170, chartY + 24]} stroke="#2296a6" strokeWidth={4} />
        <Text x={chartX + 175} y={chartY + 12} text="Exchange rate - $" fontSize={16} fill="#2296a6" />
      </Group>
    );
  };

  // --- Currency Exchange Scroller Component ---
  function CurrencyScroller({ base, target, rate }) {
    const scrollText = `${base} 1.00 = ${target} ${rate.toFixed(2)}`;
    const fontSize = 180;
    const textWidthRef = React.useRef(0);
    const [scrollX, setScrollX] = React.useState(800);

    // More accurate text width measurement using Konva.Text
    React.useEffect(() => {
      // Create a temporary Konva.Text to measure width
      const tempStage = document.createElement('canvas');
      const ctx = tempStage.getContext('2d');
      ctx.font = `bold ${fontSize}px Arial`;
      const width = ctx.measureText(scrollText).width;
      textWidthRef.current = width;
      setScrollX(800);
    }, [scrollText]);

    // Animate scroll
    React.useEffect(() => {
      let animId;
      function animate() {
        setScrollX(prev => {
          let next = prev - 3; // faster scroll
          // Only reset after the entire text is fully out of view (add buffer)
          if (next < -textWidthRef.current - 50) {
            next = 800;
          }
          return next;
        });
        animId = requestAnimationFrame(animate);
      }
      animate();
      return () => cancelAnimationFrame(animId);
    }, [scrollText]);

    return (
      <Group>
        <Rect x={0} y={0} width={800} height={600} fill="#222" />
        <Text
          x={scrollX}
          y={200}
          text={scrollText}
          fontSize={fontSize}
          fontStyle="bold"
          fontFamily="Arial"
          fill="#fff"
          align="left"
          verticalAlign="middle"
        />
      </Group>
    );
  }

  // --- Currency Exchange Scroller ---
  const renderCurrencyScroller = () => {
    if (!apiData) return null;
    return <CurrencyScroller base={apiData.base} target={apiData.target} rate={apiData.rate} />;
  };
    
  const renderExchangeRate = () => {
    // If multiRates is populated, use it
    if (multiRates && multiRates.length > 0) {
    return (
      <Group>
          {/* Background with dollar sign */}
          <Rect x={0} y={0} width={800} height={600} fill="#27ae60" />
        <Text
          x={400}
            y={200}
            text="$"
            fontSize={200}
          fontFamily={textFont}
            fill="rgba(255,255,255,0.1)"
          align="center"
        />
          {multiRates.map((rate, index) => (
            <Group key={index} opacity={fade}>
        <Text
                x={50}
                y={100 + (index * 80)}
                text={`1 ${rate.from} = ${rate.rate} ${rate.to}${rate.isMock ? ' (mock)' : ''}`}
                fontSize={32}
          fontFamily={textFont}
                fill="#ffffff"
              />
            </Group>
          ))}
      </Group>
    );
    }
    // fallback to old logic
    return (
      <Group>
        {/* Background with dollar sign */}
        <Rect x={0} y={0} width={800} height={600} fill="#27ae60" />
        <Text
          x={400}
          y={200}
          text="$"
          fontSize={200}
          fontFamily={textFont}
          fill="rgba(255,255,255,0.1)"
          align="center"
        />
        {financeData.rates.map((rate, index) => (
          <Group key={index} opacity={fade}>
            <Text
              x={50}
              y={100 + (index * 80)}
              text={`${rate.flag} 1 ${rate.from} $${rate.rate} ${rate.to}`}
              fontSize={24}
              fontFamily={textFont}
              fill="#ffffff"
            />
          </Group>
        ))}
      </Group>
    );
  };

  const renderExchangeRateChart = () => {
    // If multiChartData is populated, use it
    if (multiChartData && multiChartData.length > 0) {
      // Colors for up to 4 lines
      const lineColors = ["#e74c3c", "#2296a6", "#f1c40f", "#8e44ad"];
      // Find all unique dates
      const allDates = Array.from(new Set(multiChartData.flatMap(d => d.chartData.map(pt => pt.date)))).sort();
      // Y axis range
      const allValues = multiChartData.flatMap(d => d.chartData.map(pt => pt.value)).filter(v => typeof v === 'number');
      const minY = Math.min(...allValues);
      const maxY = Math.max(...allValues);
      const yRange = maxY - minY || 1;
      // Chart dimensions
      const chartWidth = 600;
      const chartHeight = 350;
      const chartX = 120;
      const chartY = 100;
      // X positions for each date
      const xPositions = allDates.map((date, i) => chartX + 40 + (i * (chartWidth - 80) / (allDates.length - 1)));
      return (
        <Group>
          {/* Background with dollar sign */}
          <Rect x={0} y={0} width={800} height={600} fill="#3498db" />
          <Text
            x={400}
            y={200}
            text="$"
            fontSize={200}
            fontFamily={textFont}
            fill="rgba(255,255,255,0.1)"
            align="center"
          />
          {/* Latest rates legend */}
          {multiChartData.map((d, i) => (
            <Text
              key={d.target}
              x={50}
              y={80 + i * 32}
              text={`1 ${baseCurrency} = ${d.latest} ${d.target}${d.isMock ? ' (mock)' : ''}`}
              fontSize={22}
              fontFamily={textFont}
              fill={lineColors[i % lineColors.length]}
            />
          ))}
          {/* Chart lines for each currency */}
          {multiChartData.map((d, i) => {
            // Map points to x/y
            const points = d.chartData.map((pt, j) => [xPositions[j], chartY + chartHeight - 40 - ((pt.value - minY) / yRange) * (chartHeight - 80)]);
            return (
              <>
                <Line
                  key={d.target + "-line"}
                  points={points.flat()}
                  stroke={lineColors[i % lineColors.length]}
                  strokeWidth={4}
                  opacity={fade}
                  lineJoin="round"
                  tension={0.3}
                />
                {/* Chart points */}
                {points.map((pt, j) => (
                  <Circle key={d.target + "-pt-" + j} x={pt[0]} y={pt[1]} radius={6} fill={lineColors[i % lineColors.length]} opacity={fade} />
                ))}
              </>
            );
          })}
          {/* X axis labels */}
          {allDates.map((date, i) => (
            <Text key={date} x={xPositions[i] - 15} y={chartY + chartHeight - 20} text={date.slice(5)} fontSize={14} fill="#fff" />
          ))}
          {/* Y axis labels */}
          {[maxY, minY + yRange * 0.66, minY + yRange * 0.33, minY].map((yVal, i) => {
            const y = chartY + 30 + i * ((chartHeight - 70) / 3);
            return (
              <Text key={i} x={chartX + 10} y={y - 12} text={yVal.toFixed(3)} fontSize={14} fill="#fff" />
            );
          })}
          {/* Chart axes */}
          <Line points={[chartX + 40, chartY + chartHeight - 40, chartX + chartWidth - 40, chartY + chartHeight - 40]} stroke="#fff" strokeWidth={2} />
          <Line points={[chartX + 40, chartY + 30, chartX + 40, chartY + chartHeight - 40]} stroke="#fff" strokeWidth={2} />
          {/* Legend */}
          {multiChartData.map((d, i) => (
            <Group key={d.target + "-legend"}>
              <Rect x={chartX + 60 + i * 120} y={chartY + 10} width={18} height={18} fill={lineColors[i % lineColors.length]} />
              <Text x={chartX + 85 + i * 120} y={chartY + 10} text={d.target} fontSize={16} fill={lineColors[i % lineColors.length]} />
            </Group>
          ))}
        </Group>
      );
    }
    // fallback to old logic
    const chartPoints = financeData.chartData.map((point, index) => ({
      x: 150 + (index * 150),
      y: 400 - (point.value * 200)
    }));

    return (
      <Group>
        {/* Background with dollar sign */}
        <Rect x={0} y={0} width={800} height={600} fill="#3498db" />
        <Text
          x={400}
          y={200}
          text="$"
          fontSize={200}
          fontFamily={textFont}
          fill="rgba(255,255,255,0.1)"
          align="center"
        />
        {/* Exchange rates */}
        {financeData.rates.map((rate, index) => (
          <Group key={index} opacity={fade}>
            <Text
              x={50}
              y={100 + (index * 60)}
              text={`${rate.flag} 1 ${rate.from} $${rate.rate} ${rate.to}`}
              fontSize={20}
              fontFamily={textFont}
              fill="#ffffff"
            />
          </Group>
        ))}
        {/* Chart */}
        <Line
          points={chartPoints.flatMap(point => [point.x, point.y])}
          stroke="#ffffff"
          strokeWidth={4}
          opacity={fade}
        />
        {/* Chart points */}
        {chartPoints.map((point, index) => (
          <Circle
            key={index}
            x={point.x}
            y={point.y}
            radius={6}
            fill="#ffffff"
            opacity={fade}
          />
        ))}
      </Group>
    );
  };

  const renderExchangeRateTable = () => {
    // If multiTableData is populated, use it
    if (multiTableData && multiTableData.length > 0) {
    return (
      <Group>
        {/* Background */}
        <Rect x={0} y={0} width={800} height={600} fill="#95a5a6" />
          {/* Table header */}
          <Text x={100} y={60} text="Base" fontSize={22} fontStyle="bold" fill="#222" />
          <Text x={250} y={60} text="Target" fontSize={22} fontStyle="bold" fill="#222" />
          <Text x={400} y={60} text="Rate" fontSize={22} fontStyle="bold" fill="#222" />
          <Text x={550} y={60} text="Type" fontSize={22} fontStyle="bold" fill="#222" />
          {/* Table rows */}
          {multiTableData.map((row, i) => (
            <Group key={row.to} opacity={fade}>
              <Text x={100} y={110 + i * 60} text={row.from} fontSize={20} fill="#222" />
              <Text x={250} y={110 + i * 60} text={row.to} fontSize={20} fill="#222" />
              <Text x={400} y={110 + i * 60} text={typeof row.rate === 'number' ? row.rate.toFixed(4) : row.rate} fontSize={20} fill="#222" />
              <Text x={550} y={110 + i * 60} text={row.isMock ? 'Mock' : 'Real'} fontSize={20} fill={row.isMock ? '#e67e22' : '#27ae60'} />
            </Group>
          ))}
        </Group>
      );
    }
    // fallback to old logic
    return (
      <Group>
        {/* Background */}
        <Rect x={0} y={0} width={800} height={600} fill="#95a5a6" />
        {/* Description overlay */}
        <Rect x={50} y={200} width={700} height={200} fill="rgba(0,0,0,0.8)" />
        <Text
          x={400}
          y={300}
          text={financeData.description}
          fontSize={18}
          fontFamily={textFont}
          fill="#ffffff"
          align="center"
          width={700}
        />
        {/* Exchange rates in background */}
        {financeData.rates.map((rate, index) => (
          <Group key={index} opacity={0.3}>
            <Text
              x={100}
              y={100 + (index * 80)}
              text={`${rate.currency} ${rate.rate} ${rate.change} (${rate.value})`}
              fontSize={20}
              fontFamily={textFont}
              fill="#2c3e50"
            />
          </Group>
        ))}
      </Group>
    );
  };

  const renderMiniChart = () => {
    // If miniChartData is populated, use it
    if (miniChartData) {
      const chartPoints = miniChartData.chartData.map((point, index) => ({
        x: 100 + (index * 120),
        y: 400 - (point.value * 200)
      }));
      return (
        <Group>
          {/* Background */}
          <Rect x={0} y={0} width={800} height={600} fill="#2c3e50" />
          {/* Main data */}
          <Text
            x={20}
            y={80}
            text={`${miniChartData.currency} ${typeof miniChartData.rate === 'number' ? miniChartData.rate.toFixed(4) : miniChartData.rate} (${miniChartData.isMock ? 'mock' : 'real'})`}
            fontSize={32}
            fontFamily={textFont}
            fill="#ecf0f1"
            opacity={fade}
          />
          <Text
            x={20}
            y={120}
            text={`Daily: ${miniChartData.change}%  Weekly: ${miniChartData.value}%`}
            fontSize={22}
            fontFamily={textFont}
            fill="#ecf0f1"
            opacity={fade}
          />
          {/* Chart */}
          <Line
            points={chartPoints.flatMap(point => [point.x, point.y])}
            stroke="#9b59b6"
            strokeWidth={3}
            opacity={fade}
          />
          {/* Chart points */}
          {chartPoints.map((point, index) => (
            <Circle
              key={index}
              x={point.x}
              y={point.y}
              radius={4}
              fill="#9b59b6"
              opacity={fade}
            />
          ))}
          {/* TradingView attribution */}
          <Text
            x={20}
            y={500}
            text="Mini Chart by TradingView"
            fontSize={16}
            fontFamily={textFont}
            fill="#bdc3c7"
            opacity={fade}
          />
        </Group>
      );
    }
    // fallback to old logic
    const data = financeData.data;
    const chartPoints = financeData.chartData.map((point, index) => ({
      x: 100 + (index * 120),
      y: 400 - (point.value * 200)
    }));
    return (
      <Group>
        {/* Background */}
        <Rect x={0} y={0} width={800} height={600} fill="#2c3e50" />
        {/* Main data */}
        <Text
          x={20}
          y={80}
          text={`${data.currency} ${data.rate} ${data.change} (${data.value})`}
          fontSize={32}
          fontFamily={textFont}
          fill="#ecf0f1"
          opacity={fade}
        />
        {/* Chart */}
        <Line
          points={chartPoints.flatMap(point => [point.x, point.y])}
          stroke="#9b59b6"
          strokeWidth={3}
          opacity={fade}
        />
        {/* Chart points */}
        {chartPoints.map((point, index) => (
          <Circle
            key={index}
            x={point.x}
            y={point.y}
            radius={4}
            fill="#9b59b6"
            opacity={fade}
          />
        ))}
        {/* TradingView attribution */}
        <Text
          x={20}
          y={500}
          text="Mini Chart by TradingView"
          fontSize={16}
          fontFamily={textFont}
          fill="#bdc3c7"
          opacity={fade}
        />
      </Group>
    );
  };

  const renderMultiCurrencyRate = () => {
    // If multiCurrencyData is populated, use it
    if (multiCurrencyData && multiCurrencyData.length > 0) {
      return (
        <Group>
          {/* Background */}
          <Rect x={0} y={0} width={800} height={600} fill="#2c3e50" />
          {/* Green bar on left */}
          <Rect x={0} y={0} width={20} height={600} fill="#27ae60" />
          {/* Main rates */}
          {multiCurrencyData.map((row, i) => (
            <Text
              key={row.to}
              x={50}
              y={100 + i * 80}
              text={`1 ${row.from} = ${typeof row.rate === 'number' ? row.rate.toFixed(4) : row.rate} ${row.to}${row.isMock ? ' (mock)' : ''}`}
              fontSize={48}
              fontFamily={textFont}
              fill="#ecf0f1"
              opacity={fade}
            />
          ))}
        </Group>
      );
    }
    // fallback to old logic
    const data = financeData.data;
    return (
      <Group>
        {/* Background */}
        <Rect x={0} y={0} width={800} height={600} fill="#2c3e50" />
        {/* Green bar on left */}
        <Rect x={0} y={0} width={20} height={600} fill="#27ae60" />
        {/* Main rate */}
        <Text
          x={50}
          y={250}
          text={`${data.currency} $${data.rate} ${data.change}`}
          fontSize={48}
          fontFamily={textFont}
          fill="#ecf0f1"
          opacity={fade}
        />
      </Group>
    );
  };

  const renderSingleExchangeRate = () => {
    // If singleRateData is populated, use it
    if (singleRateData) {
      return (
        <Group>
          {/* Background */}
          <Rect x={0} y={0} width={800} height={600} fill="#2c3e50" />
          {/* Top info */}
          <Text
            x={50}
            y={100}
            text={`1 ${singleRateData.from} = ${typeof singleRateData.rate === 'number' ? singleRateData.rate.toFixed(4) : singleRateData.rate} ${singleRateData.to}`}
            fontSize={32}
            fontFamily={textFont}
            fill="#ecf0f1"
            opacity={fade}
          />
          <Text
            x={50}
            y={160}
            text={`Daily Change: ${singleRateData.change}%${singleRateData.isMock ? ' (mock)' : ' (real)'}`}
            fontSize={28}
            fontFamily={textFont}
            fill={parseFloat(singleRateData.change) >= 0 ? '#27ae60' : '#e74c3c'}
            opacity={fade}
          />
        </Group>
      );
    }
    // fallback to old logic
    const data = financeData.data;
    return (
      <Group>
        {/* Background */}
        <Rect x={0} y={0} width={800} height={600} fill="#2c3e50" />
        {/* Top info */}
        <Text
          x={50}
          y={100}
          text={`${data.from} ${data.change}`}
          fontSize={24}
          fontFamily={textFont}
          fill={data.change.startsWith('+') ? '#27ae60' : '#e74c3c'}
          opacity={fade}
        />
        {/* Main rate */}
        <Text
          x={50}
          y={250}
          text={`€ ${data.rate}`}
          fontSize={72}
          fontFamily={textFont}
          fill="#ecf0f1"
          opacity={fade}
        />
        {/* Background graph */}
        <Line
          points={[50, 400, 750, 380, 750, 420]}
          stroke="#e74c3c"
          strokeWidth={2}
          opacity={0.3}
        />
      </Group>
    );
  };

  const renderSingleExchangeRateChart = () => {
    // If singleChartData is populated, use it
    if (singleChartData) {
      const chartPoints = singleChartData.chartData.map((point, index) => ({
        x: 100 + (index * 150),
        y: 400 - (point.value * 200)
      }));
      return (
        <Group>
          {/* Background */}
          <Rect x={0} y={0} width={800} height={600} fill="#ffffff" />
          {/* Dollar sign background */}
          <Text
            x={400}
            y={200}
            text="$"
            fontSize={200}
            fontFamily={textFont}
            fill="rgba(52, 152, 219, 0.1)"
            align="center"
          />
          {/* Main rate */}
          <Text
            x={400}
            y={100}
            text={`1 ${singleChartData.from} = ${typeof singleChartData.rate === 'number' ? singleChartData.rate.toFixed(4) : singleChartData.rate} ${singleChartData.to}`}
            fontSize={32}
            fontFamily={textFont}
            fill="#2c3e50"
            align="center"
            opacity={fade}
          />
          {/* Changes */}
          <Text
            x={400}
            y={150}
            text={`Daily: ${singleChartData.change}%  Weekly: ${singleChartData.weekly}%${singleChartData.isMock ? ' (mock)' : ' (real)'}`}
            fontSize={20}
            fontFamily={textFont}
            fill="#e74c3c"
            align="center"
            opacity={fade}
          />
          {/* Chart */}
          <Line
            points={chartPoints.flatMap(point => [point.x, point.y])}
            stroke="#3498db"
            strokeWidth={4}
            opacity={fade}
          />
          {/* Chart points */}
          {chartPoints.map((point, index) => (
            <Circle
              key={index}
              x={point.x}
              y={point.y}
              radius={6}
              fill="#3498db"
              opacity={fade}
            />
          ))}
        </Group>
      );
    }
    // fallback to old logic
    const data = financeData.data;
    const chartPoints = financeData.chartData.map((point, index) => ({
      x: 100 + (index * 150),
      y: 400 - (point.value * 200)
    }));
    return (
      <Group>
        {/* Background */}
        <Rect x={0} y={0} width={800} height={600} fill="#ffffff" />
        {/* Dollar sign background */}
        <Text
          x={400}
          y={200}
          text="$"
          fontSize={200}
          fontFamily={textFont}
          fill="rgba(52, 152, 219, 0.1)"
          align="center"
        />
        {/* Main rate */}
        <Text
          x={400}
          y={100}
          text={`1 ${data.from} $${data.rate} ${data.to}`}
          fontSize={32}
          fontFamily={textFont}
          fill="#2c3e50"
          align="center"
          opacity={fade}
        />
        {/* Changes */}
        <Text
          x={400}
          y={150}
          text={`${data.change} ${data.weekly}`}
          fontSize={20}
          fontFamily={textFont}
          fill="#e74c3c"
          align="center"
          opacity={fade}
        />
        {/* Chart */}
        <Line
          points={chartPoints.flatMap(point => [point.x, point.y])}
          stroke="#3498db"
          strokeWidth={4}
          opacity={fade}
        />
        {/* Chart points */}
        {chartPoints.map((point, index) => (
          <Circle
            key={index}
            x={point.x}
            y={point.y}
            radius={6}
            fill="#3498db"
            opacity={fade}
          />
        ))}
      </Group>
    );
  };

  const renderSingleTicker = () => {
    // If singleTickerData is populated, use it
    if (singleTickerData) {
      return (
        <Group>
          {/* Background */}
          <Rect x={0} y={0} width={800} height={600} fill="#2c3e50" />
          {/* Ticker data */}
          <Text
            x={50}
            y={200}
            text={`${singleTickerData.symbol} ${singleTickerData.name}`}
            fontSize={32}
            fontFamily={textFont}
            fill="#ecf0f1"
            opacity={fade}
          />
          {/* Rate */}
          <Text
            x={50}
            y={250}
            text={`${typeof singleTickerData.rate === 'number' ? singleTickerData.rate.toFixed(4) : singleTickerData.rate} (${singleTickerData.isMock ? 'mock' : 'real'})`}
            fontSize={48}
            fontFamily={textFont}
            fill="#ecf0f1"
            opacity={fade}
          />
          {/* Change */}
          <Text
            x={50}
            y={300}
            text={`Change: ${singleTickerData.change}%`}
            fontSize={24}
            fontFamily={textFont}
            fill={parseFloat(singleTickerData.change) >= 0 ? '#27ae60' : '#e74c3c'}
            opacity={fade}
          />
        </Group>
      );
    }
    // fallback to old logic
    const data = financeData.data;
    return (
      <Group>
        {/* Background */}
        <Rect x={0} y={0} width={800} height={600} fill="#2c3e50" />
        {/* Ticker data */}
        <Text
          x={50}
          y={200}
          text={`${data.symbol} ${data.name}`}
          fontSize={32}
          fontFamily={textFont}
          fill="#ecf0f1"
          opacity={fade}
        />
        {/* Rate */}
        <Text
          x={50}
          y={250}
          text={`${data.rate} ${data.change}`}
          fontSize={48}
          fontFamily={textFont}
          fill="#ecf0f1"
          opacity={fade}
        />
        {/* Value */}
        <Text
          x={50}
          y={300}
          text={`${data.value}`}
          fontSize={24}
          fontFamily={textFont}
          fill="#ecf0f1"
          opacity={fade}
        />
      </Group>
    );
  };

  const renderTicker = () => {
    if (tickerData) {
    return (
      <Group>
        {/* Background */}
        <Rect x={0} y={0} width={800} height={600} fill="#2c3e50" />
        {/* Ticker data */}
        <Text
          x={50}
          y={200}
            text={`${tickerData.symbol}`}
            fontSize={32}
          fontFamily={textFont}
          fill="#ecf0f1"
          opacity={fade}
        />
          {/* Rate */}
        <Text
          x={50}
          y={250}
            text={`${typeof tickerData.rate === 'number' ? tickerData.rate.toFixed(4) : tickerData.rate} (${tickerData.isMock ? 'mock' : 'real'})`}
            fontSize={48}
            fontFamily={textFont}
            fill="#ecf0f1"
            opacity={fade}
          />
        </Group>
      );
    }
    // fallback to old logic
    const data = financeData.data;
    return (
      <Group>
        {/* Background */}
        <Rect x={0} y={0} width={800} height={600} fill="#2c3e50" />
        {/* Ticker data */}
        <Text
          x={50}
          y={200}
          text={`${data.symbol} ${data.name}`}
          fontSize={32}
          fontFamily={textFont}
          fill="#ecf0f1"
          opacity={fade}
        />
        {/* Rate */}
        <Text
          x={50}
          y={250}
          text={`${data.rate} ${data.change}`}
          fontSize={48}
          fontFamily={textFont}
          fill="#ecf0f1"
          opacity={fade}
        />
        {/* Value */}
        <Text
          x={50}
          y={300}
          text={`${data.value}`}
          fontSize={24}
          fontFamily={textFont}
          fill="#ecf0f1"
          opacity={fade}
        />
      </Group>
    );
  };

  const renderSymbolInfo = () => {
    if (symbolInfoData) {
    return (
      <Group>
        {/* Background */}
        <Rect x={0} y={0} width={800} height={600} fill="#2c3e50" />
        {/* Symbol info */}
          <Text
            x={50}
            y={200}
            text={`${symbolInfoData.name}`}
            fontSize={32}
            fontFamily={textFont}
            fill="#ecf0f1"
            opacity={fade}
          />
          {/* Rate */}
        <Text
          x={50}
          y={250}
            text={`${typeof symbolInfoData.rate === 'number' ? symbolInfoData.rate.toFixed(4) : symbolInfoData.rate} (${symbolInfoData.isMock ? 'mock' : 'real'})`}
            fontSize={48}
            fontFamily={textFont}
            fill="#ecf0f1"
            opacity={fade}
          />
        </Group>
      );
    }
    // fallback to old logic
    const data = financeData.data;
    return (
      <Group>
        {/* Background */}
        <Rect x={0} y={0} width={800} height={600} fill="#2c3e50" />
        {/* Symbol info */}
        <Text
          x={50}
          y={200}
          text={`${data.name}`}
          fontSize={32}
          fontFamily={textFont}
          fill="#ecf0f1"
          opacity={fade}
        />
        {/* Rate */}
        <Text
          x={50}
          y={250}
          text={`${data.rate}`}
          fontSize={48}
          fontFamily={textFont}
          fill="#ecf0f1"
          opacity={fade}
        />
      </Group>
    );
  };

  const renderSymbolOverview = () => {
    if (symbolOverviewData) {
      return (
        <Group>
          {/* Background */}
          <Rect x={0} y={0} width={800} height={600} fill="#2c3e50" />
          {/* Symbol overview */}
          <Text
            x={50}
            y={200}
            text={`${symbolOverviewData.name}`}
            fontSize={32}
            fontFamily={textFont}
            fill="#ecf0f1"
            opacity={fade}
          />
          {/* Rate */}
          <Text
            x={50}
            y={250}
            text={`${typeof symbolOverviewData.rate === 'number' ? symbolOverviewData.rate.toFixed(4) : symbolOverviewData.rate}`}
            fontSize={48}
            fontFamily={textFont}
            fill="#ecf0f1"
            opacity={fade}
          />
          {/* Change */}
          <Text
            x={50}
            y={300}
            text={`Change: ${symbolOverviewData.change}%`}
            fontSize={24}
            fontFamily={textFont}
            fill={parseFloat(symbolOverviewData.change) >= 0 ? '#27ae60' : '#e74c3c'}
            opacity={fade}
          />
        </Group>
      );
    }
    // fallback to old logic
    const data = financeData.data;
    return (
      <Group>
        {/* Background */}
        <Rect x={0} y={0} width={800} height={600} fill="#2c3e50" />
        {/* Symbol overview */}
        <Text
          x={50}
          y={200}
          text={`${data.name}`}
          fontSize={32}
          fontFamily={textFont}
          fill="#ecf0f1"
          opacity={fade}
        />
        {/* Rate */}
        <Text
          x={50}
          y={250}
          text={`${data.rate}`}
          fontSize={48}
          fontFamily={textFont}
          fill="#ecf0f1"
          opacity={fade}
        />
        {/* Change */}
        <Text
          x={50}
          y={300}
          text={`${data.change} ${data.percent}`}
          fontSize={24}
          fontFamily={textFont}
          fill="#ecf0f1"
          opacity={fade}
        />
      </Group>
    );
  };

  const renderTickerTape = () => {
    if (tickerTapeData && tickerTapeData.length > 0) {
    return (
      <Group>
        {/* Background */}
        <Rect x={0} y={0} width={800} height={600} fill="#2c3e50" />
        {/* Ticker tape */}
          {tickerTapeData.map((ticker, index) => (
            <Group key={index} opacity={fade}>
        <Text
          x={50}
                y={100 + (index * 60)}
                text={`${ticker.symbol} ${typeof ticker.rate === 'number' ? ticker.rate.toFixed(4) : ticker.rate} (${ticker.isMock ? 'mock' : 'real'}) ${ticker.change ? `Change: ${ticker.change}%` : ''}`}
                fontSize={24}
                fontFamily={textFont}
                fill="#ecf0f1"
              />
            </Group>
          ))}
        </Group>
      );
    }
    // fallback to old logic
    const data = financeData.tickers;
    return (
      <Group>
        {/* Background */}
        <Rect x={0} y={0} width={800} height={600} fill="#2c3e50" />
        {/* Ticker tape */}
        {data.map((ticker, index) => (
          <Group key={index} opacity={fade}>
            <Text
              x={50}
              y={100 + (index * 60)}
          text={`${ticker.symbol} ${ticker.rate} ${ticker.change}`}
              fontSize={24}
          fontFamily={textFont}
          fill="#ecf0f1"
        />
          </Group>
        ))}
      </Group>
    );
  };

  const renderDefaultFinance = () => {
    const data = financeData.data;
    
    return (
      <Group>
        {/* Background */}
        <Rect x={0} y={0} width={800} height={600} fill="#2c3e50" />
        
        {/* Default finance data */}
        <Text
          x={50}
          y={200}
          text={`${data.currency} ${data.rate} ${data.change}`}
          fontSize={48}
          fontFamily={textFont}
          fill="#ecf0f1"
          opacity={fade}
        />
      </Group>
    );
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ position: 'relative' }}>
        <button 
          onClick={onClose} 
          style={{ 
            position: 'absolute', 
            top: -40, 
            right: 0, 
            background: 'none', 
            border: 'none', 
            color: '#fff', 
            fontSize: 24, 
            cursor: 'pointer',
            zIndex: 1001
          }}
        >
          ×
        </button>
        <Stage width={stageWidth} height={stageHeight}>
          <Layer scale={{ x: scaleX, y: scaleY }}>
            {renderFinanceWidget()}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

export default FinanceKonva; 