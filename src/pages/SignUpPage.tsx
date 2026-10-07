
import React, { useEffect, useState } from 'react';

import {
 RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';

import type { ConfirmationResult } from 'firebase/auth';

import { useNavigate, Link } from 'react-router-dom';

import {
  Eye,
  EyeOff,
  User,
  AtSign,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { auth } from '../firebase';
import axios from 'axios';
import { toast } from 'sonner';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

// Keep track of the actual DOM element used by Firebase.
let recaptchaContainer: HTMLDivElement | null = null;

export const SignUpPage: React.FC = () => {

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const navigate = useNavigate();

  const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');

  const [otp, setOtp] = useState('');

  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  // =========================================================
  // CLEANUP FIREBASE RECAPTCHA
  // =========================================================

  const cleanupRecaptcha = () => {

    
    if (window.recaptchaVerifier) {

      try {

        window.recaptchaVerifier.clear();
        console.log('Firebase reCAPTCHA verifier cleared');

      } catch (error) {
        
        console.warn('Error clearing Firebase reCAPTCHA:',error);
      }

      window.recaptchaVerifier = undefined;
    }

    // 2. Remove the exact container we created
    if (recaptchaContainer) {
      try {

        recaptchaContainer.remove();

      } catch (error) {

        console.warn('Error removing reCAPTCHA container:',error);

      }

      recaptchaContainer = null;
    }

    // 3. Remove any leftover dynamically created containers
    document.querySelectorAll('[id^="connectx-recaptcha-container-"]').forEach((element) => {
        element.remove();
      });

    // 4. Remove the old static container if an older
    // version of the component left it behind.
    const oldContainer = document.getElementById(
      'recaptcha-container'
    );

    if (oldContainer) {
      oldContainer.remove();
    }

    console.log('reCAPTCHA cleanup completed');
  };

  

  useEffect(() => {
    return () => {
      cleanupRecaptcha();
    };
  }, []);

  // =========================================================
  // CREATE A COMPLETELY NEW RECAPTCHA
  // =========================================================

  const createFreshRecaptcha =
    async (): Promise<RecaptchaVerifier> => {
      console.log('🔄 Creating fresh reCAPTCHA...');

     
      cleanupRecaptcha();

      /*
       * Create a completely NEW DOM element.
       *
       * We do NOT reuse:
       *
       * <div id="recaptcha-container" />
       *
       * because that was causing:
       *
       * "reCAPTCHA has already been rendered in this element"
       */
      const container = document.createElement('div');

      container.id = `connectx-recaptcha-container-${Date.now()}`;

      container.style.position = 'fixed';
      container.style.bottom = '0';
      container.style.left = '0';
      container.style.width = '1px';
      container.style.height = '1px';
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '-1';

      document.body.appendChild(container);

      recaptchaContainer = container;

      console.log(
        '🆕 New reCAPTCHA container:',
        container.id
      );

      /*
       * Create Firebase verifier using the actual
       * newly-created DOM element.
       */
      const verifier = new RecaptchaVerifier(
        auth,
        container,
        {
          size: 'invisible',

          callback: () => {
            console.log(
              'reCAPTCHA verification successful'
            );

            setError('');
          },

          'expired-callback': () => {
            console.log('reCAPTCHA expired');

            setError(
              'reCAPTCHA expired. Please request a new OTP.'
            );
          },
        }
      );

      /*
       * Explicitly render the verifier.
       */
      await verifier.render();

      /*
       * Save it globally so it can be cleaned up later.
       */
      window.recaptchaVerifier = verifier;

      console.log('✅ Fresh reCAPTCHA rendered');

      return verifier;
    };

  // =========================================================
  // HANDLE FORM INPUT
  // =========================================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   
    const {name,value,type,checked} = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }));
  };

  // =========================================================
  // FORMAT INDIAN PHONE NUMBER
  // =========================================================

  const formatPhoneNumber = (rawPhone: string): string => {
    const digitsOnly = rawPhone.replace(/\D/g,'');

   
    if (digitsOnly.length === 10) {
      return `+91${digitsOnly}`;
    }

    
    if (
      digitsOnly.length === 12 &&
      digitsOnly.startsWith('91')
    ) {
      return `+${digitsOnly}`;
    }

    // Already +919876543210
    if (rawPhone.startsWith('+')) {
      return rawPhone;
    }

    return `+${digitsOnly}`;
  };

  // =========================================================
  // STEP 1
  // SEND OTP
  // =========================================================

  const handleSendOtp = async (e: React.FormEvent) => {
    
    e.preventDefault();

    setError('');

    // -------------------------------------------------------
    // Validate fields
    // -------------------------------------------------------

    if (
      !formData.fullName ||
      !formData.username ||
      !formData.email ||
      !formData.mobile ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError(
        'Please fill in all required fields.'
      );

      return;
    }

    // -------------------------------------------------------
    // Validate password
    // -------------------------------------------------------

    if (formData.password.length < 6) {
      setError(
        'Password must be at least 6 characters long.'
      );

      return;
    }

    if ( formData.password !== formData.confirmPassword) {
     
      setError(
        'Passwords do not match.'
      );

      return;
    }

   
    if (!formData.agreeToTerms) {
      setError(
        'You must agree to the Terms and Privacy Policy.'
      );

      return;
    }

    
    const formattedPhone =formatPhoneNumber(formData.mobile);

    if (
      !/^\+91\d{10}$/.test(
        formattedPhone
      )
    ) {
      setError(
        'Please enter a valid 10-digit Indian mobile number.'
      );

      return;
    }

    setLoading(true);

    try {

      console.log(
        'Sending OTP to:',
        formattedPhone
      );

      /*
       * ALWAYS create a fresh reCAPTCHA.
       *
       * This is important when the user:
       *
       * Details
       *   ↓
       * OTP
       *   ↓
       * Back
       *   ↓
       * Change phone
       *   ↓
       * Send OTP again
       */
      const appVerifier = await createFreshRecaptcha();

      /*
       * Send OTP using Firebase Phone Authentication.
       */
      const confirmation =
        await signInWithPhoneNumber(
          auth,
          formattedPhone,
          appVerifier
        );

      console.log(
        '✅ OTP sent successfully'
      );

      /*
       * Save Firebase confirmation result.
       */
      setConfirmationResult(
        confirmation
      );

      /*
       * Clear previous OTP input.
       */
      setOtp('');

      /*
       * Go to OTP screen.
       */
      setStep('OTP');

    } catch (err: any) {
      console.error(
        'Firebase Phone Auth Error:',
        err
      );

      console.error(
        'Firebase Error Code:',
        err?.code
      );

      console.error(
        'Firebase Error Message:',
        err?.message
      );

      /*
       * Firebase verifier may be unusable
       * after a failed OTP request.
       *
       * Completely clean it.
       */
      cleanupRecaptcha();

      // -----------------------------------------------------
      // Firebase error messages
      // -----------------------------------------------------

      if (
        err?.code ===
        'auth/too-many-requests'
      ) {
        
        setError(
          'Too many OTP attempts. Please try again later.'
        );

      } else if (
        err?.code ===
        'auth/captcha-check-failed'
      ) {
        setError(
          'reCAPTCHA verification failed. Please refresh the page and try again.'
        );

      } else if (
        err?.code ===
        'auth/invalid-app-credential'
      ) {
        setError(
          'Invalid Firebase app credential. Please refresh the page and try again.'
        );

      } else if (
        err?.code ===
        'auth/invalid-phone-number'
      ) {
        setError(
          'Invalid phone number. Please enter a valid 10-digit Indian mobile number.'
        );

      } else if (
        err?.code ===
        'auth/quota-exceeded'
      ) {
        setError(
          'SMS service limit reached. Please try again later.'
        );

      } else if (
        err?.code ===
        'auth/operation-not-allowed'
      ) {
        setError(
          'Phone authentication is not enabled.'
        );

      } else if (
        err?.code ===
        'auth/network-request-failed'
      ) {
        setError(
          'Network error. Please check your internet connection and try again.'
        );

      } else {
        /*
         * Avoid directly showing raw Firebase messages
         * to normal users.
         */
        setError(
          'Failed to send OTP. Please try again.'
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // STEP 2
  // VERIFY OTP
  // =========================================================

  const handleVerifyOtp = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError('');

    // -------------------------------------------------------
    // Validate OTP
    // -------------------------------------------------------

    if (!otp) {
      setError(
        'Please enter the OTP.'
      );

      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError(
        'Please enter a valid 6-digit OTP.'
      );

      return;
    }

    if (!confirmationResult) {
      setError(
        'Your OTP session has expired. Please request a new OTP.'
      );

      return;
    }

    setLoading(true);

    try {
      console.log(
        '🔐 Verifying OTP...'
      );

      // -----------------------------------------------------
      // 1. Verify OTP with Firebase
      // -----------------------------------------------------

      const result =
        await confirmationResult.confirm(
          otp
        );

      const user = result.user;

      console.log(
        '✅ Firebase OTP verification successful'
      );

      console.log(
        'Firebase UID:',
        user.uid
      );

      console.log(
        'Firebase phone:',
        user.phoneNumber
      );

      // -----------------------------------------------------
      // 2. Get Firebase ID Token
      // -----------------------------------------------------

      const idToken =await user.getIdToken(true);

      console.log(
        '✅ Firebase ID token generated'
      );

      // -----------------------------------------------------
      // 3. Send Firebase ID token to backend
      // -----------------------------------------------------

      /*
       * This URL is for your local backend.
       *
       * After deploying your backend, replace it
       * with your deployed backend URL.
       */
      const response =
        await axios.post(
          'http://localhost:8080/api/auth/firebase-auth',
          {
            idToken,

            fullname:
              formData.fullName,

            username:
              formData.username,

            email:
              formData.email,

            password:
              formData.password,

            mobile:
              user.phoneNumber,
          },
          {
            withCredentials: true,
          }
        );


        // 1. Clean up reCAPTCHA resources
    cleanupRecaptcha();

    // 2. Extract server payload
  

    const { accessToken } = response.data;

  // 4. Save token to localStorage
  if (accessToken) {
    localStorage.setItem('authToken', accessToken);
  }
    

    toast.success('Signed in successfully! Welcome back.');

    navigate('/app/dashboard', { replace: true });

     

    } catch (err: any) {
      console.error(
        '❌ OTP Verification Error:',
        err
      );

      console.error(
        'Error Code:',
        err?.code
      );

      console.error(
        'Error Message:',
        err?.message
      );

      if (
        err?.code ===
        'auth/invalid-verification-code'
      ) {
        setError(
          'Invalid OTP. Please check the code and try again.'
        );

      } else if (
        err?.code ===
        'auth/code-expired'
      ) {
        setError(
          'This OTP has expired. Please request a new OTP.'
        );

      } else if (
        err?.code ===
        'auth/too-many-requests'
      ) {
        setError(
          'Too many OTP attempts. Please try again later.'
        );

      } else {
        /*
         * If Firebase verification succeeded but
         * your backend is not deployed/running,
         * this will be handled here.
         */
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Unable to complete signup. Please try again.'
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // BACK TO DETAILS
  // =========================================================

  const handleBackToDetails = () => {
    console.log(
      '↩️ Back to signup details'
    );

    /*
     * THIS IS THE IMPORTANT FIX.
     *
     * Completely destroy:
     *
     * 1. Firebase RecaptchaVerifier
     * 2. Its DOM element
     *
     * before returning to the details page.
     */
    cleanupRecaptcha();

    /*
     * Remove the old OTP session.
     */
    setConfirmationResult(
      null
    );

    /*
     * Clear OTP input.
     */
    setOtp('');

    /*
     * Clear error.
     */
    setError('');

    /*
     * Go back to details.
     *
     * Full name, username, email, password etc.
     * remain in formData.
     *
     * The user can simply change the phone number.
     */
    setStep('DETAILS');
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col lg:flex-row text-slate-100 font-sans">

    

      {/* ====================================================
          LEFT COLUMN
          ==================================================== */}

      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 border-r border-slate-800/80 p-12 flex-col justify-between relative overflow-hidden">

        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}

        <div className="flex items-center gap-2.5 z-10">

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/25">
            X
          </div>

          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            ConnectX
          </span>

        </div>

        {/* Hero */}

        <div className="space-y-6 max-w-md z-10">

          <h1 className="text-3xl font-extrabold text-slate-100 leading-tight">
            Connect, Collaborate, and Share in Real Time.
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed">
            Join thousands of developers and creators building high-performance networks, voice channels, and feeds.
          </p>

          <div className="space-y-3 pt-2">

            {[
              'Real-time low-latency audio & video calls',
              'Threaded chat channels & personalized feeds',
              'Modular, high-performance community spaces',
            ].map(
              (feature, idx) => (

                <div
                  key={idx}
                  className="flex items-center gap-3 text-xs text-slate-300 font-medium"
                >

                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />

                  <span>
                    {feature}
                  </span>

                </div>

              )
            )}

          </div>

        </div>

        {/* Footer */}

        <div className="z-10 text-xs text-slate-500 border-t border-slate-800/80 pt-6">
          © {new Date().getFullYear()} ConnectX Platform Inc. All rights reserved.
        </div>

      </div>

      {/* ====================================================
          RIGHT COLUMN
          ==================================================== */}

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">

        <div className="w-full max-w-md space-y-6">

          {/* Mobile Logo */}

          <div className="lg:hidden flex items-center gap-2 mb-2">

            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">

                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/25">
                     X
                </div>

            </div>

            <span className="text-lg font-extrabold text-slate-100">
              ConnectX
            </span>

          </div>

          {/* Heading */}

          <div>

            <h2 className="text-2xl font-bold text-slate-100">

              {step === 'DETAILS'
                ? 'Create your account'
                : 'Verify Mobile OTP'}

            </h2>

            <p className="text-xs text-slate-400 mt-1">

              {step === 'DETAILS'
                ? 'Get started with your free ConnectX account'
                : `Enter the 6-digit code sent to ${formatPhoneNumber(formData.mobile)}`}

            </p>

          </div>

          {/* Error */}

          {error && (

            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-medium">

              {error}

            </div>

          )}

          {/* ==================================================
              DETAILS STEP
              ================================================== */}

          {step === 'DETAILS' ? (

            <form
              onSubmit={handleSendOtp}
              className="space-y-4"
            >

              {/* Full Name + Username */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Full Name */}

                <div>

                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name
                  </label>

                  <div className="relative">

                    <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />

                    <input
                      type="text"
                      name="fullName"
                      required
                      value={
                        formData.fullName
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Alex Mercer"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />

                  </div>

                </div>

                {/* Username */}

                <div>

                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Username
                  </label>

                  <div className="relative">

                    <AtSign className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />

                    <input
                      type="text"
                      name="username"
                      required
                      value={
                        formData.username
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="alexmercer"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />

                  </div>

                </div>

              </div>

              {/* Email */}

              <div>

                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>

                <div className="relative">

                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />

                  <input
                    type="email"
                    name="email"
                    required
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="alex@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />

                </div>

              </div>

              {/* Mobile */}

              <div>

                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Mobile Number (10 Digits)
                </label>

                <div className="relative">

                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />

                  <input
                    type="tel"
                    name="mobile"
                    required
                    value={
                      formData.mobile
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="9876543210"
                    inputMode="numeric"
                    maxLength={10}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Password
                </label>

                <div className="relative">

                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    name="password"
                    required
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >

                    {showPassword
                      ? (
                        <EyeOff className="w-4 h-4" />
                      )
                      : (
                        <Eye className="w-4 h-4" />
                      )}

                  </button>

                </div>

              </div>

              {/* Confirm Password */}

              <div>

                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Confirm Password
                </label>

                <div className="relative">

                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />

                  <input
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    name="confirmPassword"
                    required
                    value={
                      formData.confirmPassword
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >

                    {showConfirmPassword
                      ? (
                        <EyeOff className="w-4 h-4" />
                      )
                      : (
                        <Eye className="w-4 h-4" />
                      )}

                  </button>

                </div>

              </div>

              {/* Terms */}

              <div className="flex items-center gap-2 pt-1">

                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={
                    formData.agreeToTerms
                  }
                  onChange={
                    handleChange
                  }
                  className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
                />

                <label
                  htmlFor="agreeToTerms"
                  className="text-[11px] text-slate-400"
                >

                  I agree to the{' '}

                  <a
                    href="#terms"
                    className="text-indigo-400 hover:underline"
                  >
                    Terms of Service
                  </a>{' '}

                  and{' '}

                  <a
                    href="#privacy"
                    className="text-indigo-400 hover:underline"
                  >
                    Privacy Policy
                  </a>

                </label>

              </div>

              {/* Send OTP */}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-lg shadow-indigo-600/25 mt-2"
              >

                <span>

                  {loading
                    ? 'Sending Verification Code...'
                    : 'Send Verification Code'}

                </span>

                <ArrowRight className="w-4 h-4" />

              </button>

            </form>

          ) : (

            /* ==================================================
               OTP STEP
               ================================================== */

            <form
              onSubmit={handleVerifyOtp}
              className="space-y-4"
            >

              {/* OTP Input */}

              <div>

                <label className="block text-xs font-medium text-slate-300 mb-2 text-center">
                  6-Digit OTP Code
                </label>

                <div className="relative">

                  <ShieldCheck className="w-4 h-4 absolute left-3 top-3 text-slate-500" />

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(
                          /\D/g,
                          ''
                        )
                      )
                    }
                    placeholder="123456"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-lg text-center tracking-widest font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />

                </div>

              </div>

              {/* Verify OTP */}

              <button
                type="submit"
                disabled={
                  loading ||
                  otp.length !== 6
                }
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-lg shadow-indigo-600/25"
              >

                <span>

                  {loading
                    ? 'Verifying...'
                    : 'Verify OTP & Create Account'}

                </span>

                <CheckCircle2 className="w-4 h-4" />

              </button>

              {/* Back */}

              <button
                type="button"
                onClick={
                  handleBackToDetails
                }
                disabled={loading}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-200 mt-2 disabled:opacity-50"
              >

                ← Back to user details

              </button>

            </form>

          )}

          {/* Login */}

          <p className="text-center text-xs text-slate-400 pt-2">

            Already have an account?{' '}

            <a
              href="/login"
              className="text-indigo-400 hover:underline font-semibold"
            >
              Sign in
            </a>

          </p>

        </div>

      </div>

    </div>
  );
};

