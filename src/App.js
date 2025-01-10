import './App.css';
import Knob from './components/Knob';
import React, { useState } from 'react';

function App() {
  const [startAngle, setStartAngle] = useState(0);
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);

  //按鈕處理
    const handleDefine = (e) => {
        if (e) e.preventDefault();
        const inputAngle = Number(document.getElementById("beginning").value);
        const inputMin = Number(document.getElementById("min-value").value);
        const inputMax = Number(document.getElementById("max-value").value);

        if (inputAngle) setStartAngle(inputAngle);
        if (inputMin || inputMax) {
            if (!inputMin || !inputMax) return alert("請輸入完整範圍!");
            if (inputMin >= inputMax) return alert("範圍最小值應恆小於最大值!");
            setMin(inputMin);
            setMax(inputMax);
        }
    }

    const handleReset = (e) => {
        if (e) e.preventDefault();
        setStartAngle(0);
        setMin(null);
        setMax(null);
    }

  //Knob自訂控制器
  const Controller = () => {
    return (
      <form className="border border-black inline-block p-4 mt-4 rounded-md w-[280px]">
        <div className="w-full flex flex-col items-start">
          <label htmlFor="beginning" className="mb-2 text-start">
            起始位置(角度):
            <input type="number" id="beginning" className="w-[60px] ml-2 border border-black rounded-md" placeholder="0" />
            <p className="text-sm">(註: 3點鐘方向為0度並逆時針增加角度)</p>
          </label>

          <div className="mb-2">
            範圍:
            <label htmlFor="min-value">
              <input type="number" id="min-value" className="w-[60px] mx-2 border border-black rounded-md" placeholder="無" />
            </label>
            ~
            <label htmlFor="max-value">
              <input type="number" id="max-value" className="w-[60px] ml-2 border border-black rounded-md" placeholder="無" />
            </label>
          </div>
        </div>
        <button className="mx-1 mt-2 p-1 bg-sky-300 text-gray-700 rounded-md" onClick={(e) => handleDefine(e)}>完成</button>
        <button className="mx-1 mt-2 p-1 bg-gray-500 text-white rounded-md" onClick={(e) => handleReset(e)}>重置</button>
      </form>
    )
  }

  return (
    <div className="App w-screen h-screen flex items-center justify-center">
      <Knob startAngle={startAngle} min={min} max={max}/>
      <Controller/>
    </div>
  );
}

export default App;
