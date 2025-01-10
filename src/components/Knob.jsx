import React, { useState, useRef, useMemo } from 'react';

function Knob({startAngle = 0, min = null, max = null}) {
    const [angle, setAngle] = useState(0); //保存角度
    const [isGrabbing, setIsGrabbing] = useState(false);
    const knobRef = useRef(null);


    //進度值
    const displayValue = useMemo(() => {
        if (!min || !max) {
            return `${Math.round((angle / 360) * 100)}%`; //角度百分比
        }
        else {
            const range = max - min;
            const value = min + (angle / 360) * range;
            return Math.round(value);
        }
        
    }, [angle, min, max]);

    

    //角度計算(思路: 二維座標畫圓)
    const calculateAngle = (e) => {
        //取得元素與viewport距離作出圓心
        const knob = knobRef.current.getBoundingClientRect();
        const centerX = knob.left + knob.width / 2;
        const centerY = knob.top + knob.height / 2;

        //取得圓心與滑鼠間的向量變化
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        //計算與正向x軸夾角
        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI); //弧度轉角度(-180, 180)
        angle = (angle + startAngle + 360) % 360; //+360: 確保負角度被轉回正角度 %360: 確保角度在360以內 startAngle: 比如+90即為校正扇形夾角基準從+x軸改為-y軸(svg坐標系)
        setAngle(angle);
    };

    const handleMouseDown = (e) => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        calculateAngle(e);
        setIsGrabbing(true);
    };

    const handleMouseMove = (e) => {
        calculateAngle(e);
    };

    const handleMouseUp = () => {
        setIsGrabbing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };


    //SVG扇形測繪
    const radius = 100;
    const startX = 100 + radius * Math.cos((0 * Math.PI) / 180); //起點X
    const startY = 100 + radius * Math.sin((0 * Math.PI) / 180); // 起點Y
    const endX = 100 + radius * Math.cos((angle * Math.PI) / 180); //終點X
    const endY = 100 + radius * Math.sin((angle * Math.PI) / 180); //終點Y
    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = `
    M 100,100
    L ${startX},${startY}
    A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY}
    Z
  `;


    return (
        <div className="flex justify-center items-center">
            <div
                ref={knobRef}
                className={`mx-8 w-[200px] h-[200px] rounded-full border-0 border-black bg-gray-300 relative select-none  flex items-center justify-center ${isGrabbing ? "cursor-grabbing" : "cursor-grab"} `}
                onMouseDown={handleMouseDown} //拖動旋鈕
            >
                {/*SVG扇形*/}
                <svg width="200" height="200"
                    className="absolute top-0 left-0 z-10"
                    style={{
                        transform: `rotate(-${startAngle}deg)`, // 旋轉元件使視覺上的扇形起點從(r, 0deg)改為(r, 90deg)，同時校正angle邏輯(+90, 參考前文角度計算思路)
                        transformOrigin: "center",
                    }}>
                    <path d={pathData} fill="skyblue" />
                </svg>

                {/*數值顯示*/}
                <div className="absolute z-20 text-xl font-bold w-[180px] h-[180px] rounded-full bg-white flex items-center justify-center text-gray-800">
                    {displayValue}
                </div>
            </div>
        </div>

    );
}

export default Knob;
