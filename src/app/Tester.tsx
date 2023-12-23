"use client";

import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";

const endpoint1 = "/api/test/";
const endpoint2 = "/api/test2/";

interface Data {
  path: string;
  globalConnection: string;
  outsideHandler: string;
  insideHandler: string;
}

function removeDuplicates<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export function Tester() {
  const [results, setResults] = useState<Data[]>([]);
  const intervals = useRef<NodeJS.Timeout[]>([]);
  const [state, setState] = useState<"idle" | "running">("idle");

  const call = useCallback((endpoint: string) => {
    const rand = Math.random();

    axios.get(`${endpoint}${rand}`).then((res) => {
      setResults((prev) => [...prev, res.data?.data]);
    });
  }, []);

  useEffect(() => {
    return () => {
      intervals.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  const handleStart = useCallback(() => {
    intervals.current = [
      setInterval(() => call(endpoint1), 200),
      setInterval(() => call(endpoint2), 100),
    ];

    setState("running");
  }, [call]);

  const handleStop = useCallback(() => {
    intervals.current.forEach((interval) => clearInterval(interval));
    setState("idle");
  }, []);

  const requestsLength = results.length;
  const globalConnection = removeDuplicates(
    results.map((r) => r.globalConnection)
  );
  const outsideHandler = removeDuplicates(results.map((r) => r.outsideHandler));

  return (
    <div>
      <h1>Tester</h1>

      <button type="button" onClick={handleStart}>
        Start
      </button>
      <span style={{ paddingInline: "1rem" }}>{state}</span>
      <button type="button" onClick={handleStop}>
        Stop
      </button>

      <p>Total requests: {requestsLength}</p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Result results={results} target="globalConnection" />
        <Result results={results} target="outsideHandler" />
        <Result results={results} target="insideHandler" />
      </div>
    </div>
  );
}

function Result({ results, target }: { results: Data[]; target: keyof Data }) {
  const nonDuplicated = removeDuplicates(results.map((r) => r[target]));

  const count = nonDuplicated.length;
  const requestsCount = results.length;
  const usedVsResults = Math.round((count * 100) / requestsCount);
  const reusedInstances = requestsCount - count;

  return (
    <div>
      <h2>{target}</h2>
      <p>{usedVsResults}% of the total request</p>
      <p>{count} instances created</p>
      <p>{reusedInstances} requests that reused instances</p>
    </div>
  );
}
