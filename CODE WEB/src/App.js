import { useEffect, useState, useRef } from "react";
import "./index.css";
import logo from "./image/Logo HCMUTE.png";
import axios from "axios";
//import { HumidityChart, SmokeChart, TemperatureChart } from "./ChartDetail";
import {
  HumidityChart,
  TemperatureChart,
  COChart,
  PMChart,
} from "./ChartDetail";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";

import emailjs from "@emailjs/browser";

import { getDatabase, ref, set, onValue, off } from "firebase/database";

import imgOffline from "./image/OFFLINE.png";
import imgOnline from "./image/ONLINE.png";
import { useAuth } from "./components/AuthContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const listenToFirebaseData = (refName, updateFunction) => {
  const dataRef = ref(getDatabase(), refName);

  const handleValueChange = (snapshot) => {
    updateFunction(snapshot.val());
  };

  onValue(dataRef, handleValueChange);

  return () => off(dataRef, "value", handleValueChange);
};


function App() {
  const navigate = useNavigate();

  const lastSosRef = useRef(0);
  const sendingRef = useRef(false);


  const [isLoading, setIsLoading] = useState(true);

  const [sosData, setsosData] = useState(0);

  // hop 1
  const [humiData, sethumiData] = useState(0);
  const [tempData, settempData] = useState(0);
  const [coData, setcoData] = useState(0);
  const [pmData, setpmData] = useState(0);

  const [status, setstatus] = useState(null);
  const [timestamp, settimestamp] = useState(null);
  const [newtimestamp, setnewtimestamp] = useState(null);

  const { logout } = useAuth();

useEffect(() => {
  const logged = localStorage.getItem("isLoggedIn");
  if (!logged) {
    navigate("/login");
  }
}, []);

  const handleLogout = () => {
    logout();
    localStorage.setItem("isLoggedIn", false);
    navigate("/login"); // Chuyển hướng đến trang login
  };

  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  useEffect(() => {
    const updateTimeAndDate = () => {
      const now = new Date();

      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}:${seconds}`;

      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const dateString = now.toLocaleDateString("vi-VN", options);

      setTime(timeString);
      setDate(dateString);
    };

    updateTimeAndDate();
    const intervalID = setInterval(updateTimeAndDate, 1000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  useEffect(() => {
    getValueData();
    getStatusData();
  }, []);

  const getValueData = async () => {
    try {
      const response = await axios.get(
        "https://datn-a5156-default-rtdb.asia-southeast1.firebasedatabase.app/Room1/read.json"
      );
      const result = response?.data;

      sethumiData(result?.humi);
      settempData(result?.temp);
      setcoData(result?.co);
      setpmData(result?.pm);

      console.log("data", result);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getValueData();
      //  await getValueData2();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const toggleSos = () => {
    // Đảo ngược giá trị sosData
    const newSosData = sosData === 0 ? 1 : 0;
    setsosData(newSosData);
  };

  // Sử dụng hàm sendControlToFirebase để gửi giá trị tốc độ mới lên Firebase mỗi khi nó thay đổi
  useEffect(() => {
    // Tạo một hàm async để gửi dữ liệu lên Firebase
    const sendControlToFirebase = async () => {
      const database = getDatabase();
      const rwRef = ref(database, "rw");

      const data = {
        sos: sosData,
      };

      try {
        // Gửi dữ liệu lên Firebase bằng set
        await set(rwRef, data);
        console.log("Đã cập nhật giá trị tốc độ và sosData lên Firebase.");
      } catch (error) {
        console.error("Lỗi khi cập nhật giá trị lên Firebase:", error);
      }
    };

    // Gọi hàm sendControlToFirebase để gửi dữ liệu lên Firebase khi có sự thay đổi
    sendControlToFirebase();
  }, [sosData]);

  //Sử dụng hàm listenToFirebaseData để lắng nghe và cập nhật dữ liệu cho các biến
  useEffect(() => {
    // hop 1
    const unsub1 = listenToFirebaseData("Room1/read/humi", sethumiData);
    const unsub2 = listenToFirebaseData("Room1/read/temp", settempData);
    const unsub3 = listenToFirebaseData("Room1/read/co", setcoData);
    const unsub4 = listenToFirebaseData("Room1/read/pm", setpmData);
    const unsub5 = listenToFirebaseData("Room1/online/timestamp", settimestamp);
    const unsub6 = listenToFirebaseData("rw/sos", setsosData);

    return () => {
      // Hủy lắng nghe khi component unmount
      unsub1();
      unsub2();
      unsub3();
      unsub4();
      unsub5();
      unsub6();
    };
  }, []);

  // Gửi mail
  useEffect(() => {
    const sendMail = async () => {
      try {
        sendingRef.current = true;

        const emailData = {
          user_name: "Hệ thống IoT cảnh báo SOS",
          user_email: "lenguyennhattruong171101.ltp@gmail.com",
          message: `NODE1: Nhiệt độ: ${tempData}, Độ ẩm: ${humiData}, Khí CO: ${coData}, Bụi Mịn: ${pmData}`,
        };

        const response = await emailjs.send(
          "service_qqhc1o1",
          "template_mkbwd9k",
          emailData,
          "4Zi_dVww7ldHAqFfX"
        );

        console.log("Email sent:", response);
        alert("Đã gửi mail thành công");
      } catch (error) {
        console.error("Error sending email:", error);
        alert("Gửi email thất bại");
      } finally {
        sendingRef.current = false;
        lastSosRef.current = 0;

        // Tự trượt về OFF sau khi gửi xong
        setsosData(0);

        // setTimeout(() => (sendingRef.current = false), 1500);
      }
    };

    const hasAllValues =
      tempData !== undefined &&
      humiData !== undefined &&
      coData !== undefined &&
      pmData !== undefined;

    // chỉ gửi khi SOS chuyển từ 0 -> 1
    const sosRisingEdge = lastSosRef.current === 0 && sosData === 1;
    lastSosRef.current = sosData;

    if (sosRisingEdge && hasAllValues && !sendingRef.current) {
      sendMail();
    }
  }, [sosData, tempData, humiData, coData, pmData]);

  const lastTimestamp = timestamp;

  const getStatusData = async () => {
    try {
      const response = await axios.get(
        "https://datn-a5156-default-rtdb.asia-southeast1.firebasedatabase.app/Room1/online.json"
      );

      const result = response?.data;
      console.log("result", result);

      setnewtimestamp(result?.timestamp);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("newtimestamp:", newtimestamp);

  useEffect(() => {
    const intervalId = setInterval(getStatusData, 30000);

    if (lastTimestamp !== newtimestamp) {
      setstatus(1);
    } else {
      setstatus(0);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [lastTimestamp, newtimestamp]);

  return (
    <div className="content">
      <div className="header-main">
        <div style={{ backgroundColor: "white", borderRadius: "50%" }}>
          <img src={logo} style={{ width: "50px", height: "auto" }} />
        </div>
        <div className="text-header-main">
          <p
            style={{
              marginBottom: "0px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            HỆ THỐNG IOT QUAN TRẮC CHẤT LƯỢNG KHÔNG KHÍ
          </p>
        </div>
        <div className="header-right" style={{ position: "relative" }}>
          <div
            className="dropdown-icon"
            onClick={toggleDropdown}
            style={{
              cursor: "pointer",
              display: "inline-block",
              marginRight: "20px",
              fontSize: "30px",
            }}
          >
            &#9776;
          </div>
          {showDropdown && (
            <div className="dropdown-content">
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "transparent",
                  color: "black",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  padding: "10px",
                  textAlign: "left",
                }}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="header-content">
        <div className="row align-items-center">
          <div className="col-sm-1"></div>
          <div className="col-sm-10">
            <div className="date-time">
              <div style={{ fontSize: "large", fontWeight: "bolder" }}>
                {date}
              </div>
              <div style={{ fontSize: "large" }}>{time}</div>
            </div>
          </div>
          <div className="col-sm-1">
            {status == 1 ? (
              <img src={imgOnline} className="img-status" alt="Sample image" />
            ) : (
              <img src={imgOffline} className="img-status" alt="Sample image" />
            )}
          </div>
        </div>
      </div>

      <div
        className="textStatus"
        style={{ color: status === 1 ? "green" : "red" }}
      >
        Trạng thái: {status === 1 ? "Đang hoạt động" : "Mất kết nối"}
      </div>

      <div className="sos-btn">
        <div
          className={`toggle-switch ${sosData === 1 ? "active" : ""}`}
          style={{ borderColor: "red" }}
          onClick={toggleSos}
        >
          <div className={`text-sos-off ${sosData === 1 ? "hidden" : ""}`}>
            {sosData === 1 ? "Đang báo động" : "Trượt để báo động"}
          </div>
          <div className={`text-sos-on ${sosData === 1 ? "" : "hidden"}`}>
            Đang báo động
          </div>
          <div className={`toggle-slider ${sosData === 1 ? "active" : ""}`}>
            <p style={{ margin: "0px" }}>SOS</p>
          </div>
        </div>
      </div>
      <div className={`content ${status === 0 ? "grayed-out" : ""}`}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="chart">
            <div className="text-box">Thông số node 1</div>
            <HumidityChart humidity={humiData} />
            <TemperatureChart temperature={tempData} />
            <COChart co={coData} />
            <PMChart pm={pmData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
