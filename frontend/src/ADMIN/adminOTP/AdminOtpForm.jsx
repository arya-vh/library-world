import React, { useState } from "react";
import { backend_server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./adminotpform.css";

const AdminOtpForm = () => {
  const OTP_VERIFY_API = `${backend_server}/api/v1/signup/verifyEmail`;
  const RESEND_OTP_API = `${backend_server}/api/v1/signup/resendOtp`;

  const navigate = useNavigate();
  const [otp_code, setOtp_code] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyFormSubmit = async () => {
    try {
      const response = await axios.post(OTP_VERIFY_API, { otpCode: otp_code });
      toast.success(response.data.message); // Success toast
      navigate("/admin", { replace: true });
    } catch (error) {
      console.log(error.response);
      if (error.response.data.success === false) {
        toast.error(error.response.data.message); // Error toast
      }
    }
  };

  const handleResendFormSubmit = async () => {
    setLoading(true);
    const loadingToastId = toast.loading("Sending OTP..."); // Loading toast
    try {
      const response = await axios.post(RESEND_OTP_API, {});
      toast.dismiss(loadingToastId);
      toast.success(response.data.message); // Success toast
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      toast.error("Failed to resend OTP. Please try again."); // Error toast
    }
  };

  return (
    <div className="otp-form-container">
      <div className="otp-form-card">
        <h1 className="otp-form-title">Email Verification</h1>
        <p className="otp-form-subtitle">
          Enter your <strong>OTP</strong> code:
        </p>

        <form className="otp-form" onSubmit={(e) => e.preventDefault()}>
          <div className="otp-input-container">
            <input
              type="text"
              autoComplete="off"
              required
              className="otp-input"
              name="otpCode"
              value={otp_code}
              onChange={(e) => setOtp_code(e.target.value)}
              placeholder="Enter OTP"
            />
          </div>

          <div className="otp-button-container">
            <button
              type="button"
              className="otp-button otp-button-submit"
              onClick={handleVerifyFormSubmit}
            >
              Submit
            </button>
            <button
              type="button"
              className="otp-button otp-button-resend"
              disabled={loading}
              onClick={handleResendFormSubmit}
            >
              {loading ? "Sending OTP..." : "Resend OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminOtpForm;