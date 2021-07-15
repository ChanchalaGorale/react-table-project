import "./App.css";
import { Tabs, Table } from 'antd';
import React, { useState, useEffect } from 'react'
import axios from "axios";

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

export default function App() {
  const [transdata, settransdata] = useState()
  const [holdingdata, setholdingdata] = useState()

  const holdingURL = "https://canopy-frontend-task.vercel.app/api/holdings"
  const transURL = "https://canopy-frontend-task.vercel.app/api/transactions"

  useEffect(async () => {
    const transaction = await axios.get(transURL).then(res => res = res.data.transactions)
    const holding = await axios.get(holdingURL).then(res => res = res.data.payload)

    settransdata([...transaction])
    setholdingdata([...holding])

    console.log(holdingdata)
  }, [])

  const transcolumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ticket Ref',
      dataIndex: 'ticketref',
      key: 'ticketref',
    },
    {
      title: 'Traded Date',
      dataIndex: 'traded_on',
      key: 'traded_on',
    },
    {
      title: 'QTY',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
    },
    {
      title: 'Settlement Amount',
      dataIndex: 'settlement_amount',
      key: 'settlement_amount',
    },
  ]

  const holdingcolumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ticker',
      dataIndex: 'ticker',
      key: 'ticker',
    },
    {
      title: 'Asset Class',
      dataIndex: 'asset_class',
      key: 'asset_class',
    },
    {
      title: 'Average Price',
      dataIndex: 'avg_price',
      key: 'avg_price',
    },
    {
      title: 'Market Price',
      dataIndex: 'market_price',
      key: 'market_price',
    },
    {
      title: 'Latest Percentage Change',
      dataIndex: 'latest_chg_pct',
      key: 'latest_chg_pct',
    },
    {
      title: 'Market value CCY',
      dataIndex: 'market_value_ccy',
      key: 'market_value_ccy',
    },
  ]

  return (
    <div className="app text-center">
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Transactions Table" key="1">
          <Table pagination={{ position: ['bottomCenter'] }} columns={transcolumns} dataSource={transdata} bordered />
        </TabPane>
        <TabPane tab="Holding Table" key="2">
          <Table pagination={{ position: ['bottomCenter'] }} columns={holdingcolumns} dataSource={holdingdata} bordered />
        </TabPane>
      </Tabs>
    </div>
  );
}
