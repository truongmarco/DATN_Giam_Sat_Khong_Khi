// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { API_KEY } from "./config/firebase";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Spinner } from "react-bootstrap";
import imgLogin from "./image/LOGO_quantrac.png";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showError, setShowError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      setShowError(true);
      return;
    }

    try {
      setLoading(true);
      setShowError(false);

      await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
        { email, password, returnSecureToken: true }
      );

      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    } catch (e) {
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div className="lg-page">
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Quen mat khau?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Vui long lien he quan tri vien de lay lai mat khau.</div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="lg-btn" onClick={() => setShowModal(false)}>
            Dong
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="lg-wrap">
        <div className="lg-card">
          <div className="lg-grid">
            <div className="lg-left">
              <div className="lg-left-inner">
                <div className="lg-brand">
                  <div className="lg-logoBox">
                    <img src={imgLogin} className="lg-logo" alt="logo" />
                  </div>
                  <div className="lg-brandText">
                    <div className="lg-brandTitle">SMARTAIR IOT</div>
                    <div className="lg-brandSub">
                      He thong quan trac chat luong khong khi
                    </div>
                  </div>
                </div>

                <div className="lg-sep" />

                <div className="lg-bullets">
                  <div className="lg-bullet">
                    <div className="lg-dot" />
                    <div>Xem du lieu realtime</div>
                  </div>
                  <div className="lg-bullet">
                    <div className="lg-dot" />
                    <div>Canh bao khi vuot nguong</div>
                  </div>
                  <div className="lg-bullet">
                    <div className="lg-dot" />
                    <div>Thong ke va xuat bao cao</div>
                  </div>
                </div>

                <div className="lg-leftFooter">
                  Truong Dai hoc Cong nghe Ky thuat TP.HCM
                </div>
              </div>
            </div>

            <div className="lg-right">
              <div className="lg-right-inner">
                <div className="lg-header">
                  <div className="lg-h1">Dang nhap</div>
                  <div className="lg-h2">Nhap thong tin de truy cap he thong</div>
                </div>

                {showError && (
                  <div className="lg-alert" role="alert">
                    Sai email hoac mat khau.
                  </div>
                )}

                <div className="lg-field">
                  <label className="lg-label">Email</label>
                  <input
                    type="email"
                    className="lg-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={onKeyDown}
                    autoComplete="username"
                  />
                </div>

                <div className="lg-field">
                  <label className="lg-label">Mat khau</label>
                  <input
                    type="password"
                    className="lg-input"
                    placeholder="Nhap mat khau"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={onKeyDown}
                    autoComplete="current-password"
                  />
                </div>

                <div className="lg-row">
                  <label className="lg-check">
                    <input type="checkbox" />
                    <span>Ghi nho</span>
                  </label>

                  <button
                    type="button"
                    className="lg-link"
                    onClick={() => setShowModal(true)}
                  >
                    Quen mat khau?
                  </button>
                </div>

                <button
                  type="button"
                  className="lg-btn lg-btnFull"
                  onClick={submit}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="lg-loading">
                      <Spinner size="sm" animation="border" /> Dang xu ly
                    </span>
                  ) : (
                    "Dang nhap"
                  )}
                </button>

                <div className="lg-footNote">
                  Neu khong truy cap duoc, hay kiem tra ket noi Internet.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg-mobileNote">
          SMARTAIR IOT - He thong quan trac chat luong khong khi
        </div>
      </div>
    </div>
  );
}
