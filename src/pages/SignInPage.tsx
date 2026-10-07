
import React, { useEffect,useRef,useState} from 'react';

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
} from 'firebase/auth';

import type {
  ConfirmationResult,
} from 'firebase/auth';

import {
  Phone,
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';

import { auth } from '../firebase';
import axios from 'axios';
import { toast } from 'sonner';
import {
  useNavigate,
  Link,
} from 'react-router-dom';


// =========================================================
// GLOBAL WINDOW TYPE
// =========================================================

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}


// =========================================================
// COMPONENT
// =========================================================

export const SignInPage: React.FC = () => {

  const navigate = useNavigate();


  const [authMethod, setAuthMethod] = useState<'PASSWORD' | 'OTP'>('PASSWORD');


  const [identifier, setIdentifier] = useState('');

  const [password, setPassword] = useState('');


  // OTP LOGIN STATE


  const [mobile, setMobile] = useState('');

  const [otp, setOtp] = useState('');

  const [otpStep, setOtpStep] = useState<'PHONE' | 'VERIFY'>('PHONE');

  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

   // GENERAL STATE
 
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');


 
  // RECAPTCHA CONTAINER REF

  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);


  // CLEANUP RECAPTCHA
  const cleanupRecaptcha = () => {

    if (window.recaptchaVerifier) {

      try {
        window.recaptchaVerifier.clear();
      } catch (error) {
        console.warn(
          'reCAPTCHA cleanup warning:',
          error
        );
      }

      window.recaptchaVerifier = undefined;
    }

    // 2. Remove currently tracked container
    if (recaptchaContainerRef.current) {

      try {
        recaptchaContainerRef.current.remove();
      } catch (error) {
          console.warn('Error removing reCAPTCHA container:',error);
      }

      recaptchaContainerRef.current = null;
    }


    // -------------------------------------------------------
    // 3. Remove any leftover dynamic containers
    // -------------------------------------------------------

     document.querySelectorAll('[id^="connectx-recaptcha-container-"]').forEach((element) => {
        element.remove();
      });
  };


  // CLEANUP WHEN COMPONENT UNMOUNTS
  
  useEffect(() => {

    return () => {
      cleanupRecaptcha();
    };

  }, []);


 
  // CREATE FRESH RECAPTCHA

  const createRecaptcha = async (): Promise<RecaptchaVerifier> => {

      cleanupRecaptcha();

      const container = document.createElement('div');

      container.id = `connectx-recaptcha-container-${Date.now()}`;

      container.style.position ='fixed';
      container.style.bottom ='0';
      container.style.left ='0';
      container.style.width ='1px';
      container.style.height ='1px';
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';

      document.body.appendChild( container);

      recaptchaContainerRef.current = container;


      // -----------------------------------------------------
      // Create Firebase RecaptchaVerifier
      // -----------------------------------------------------

      const verifier =
        new RecaptchaVerifier(
          auth,
          container,
          {
            size: 'invisible',

            callback: () => {

              console.log(
                '✅ reCAPTCHA verification successful'
              );

              setError('');
            },

            'expired-callback': () => {

              console.log(
                '⚠️ reCAPTCHA expired'
              );

              setError(
                'reCAPTCHA expired. Please request a new OTP.'
              );
            },
          }
        );

      await verifier.render();


      window.recaptchaVerifier = verifier;

      return verifier;
    };


  // =========================================================
  // PASSWORD LOGIN
  // =========================================================

  const handlePasswordLogin = async ( e: React.FormEvent) => {

    e.preventDefault();

    setError('');

    if (!identifier.trim() ||!password) {

      setError(
        'Please enter your username/mobile/email and password.'
      );

      return;
    }


    setLoading(true);


    try {

      const API_BASE_URL = import.meta.env.VITE_API_URL ||'http://localhost:8080';


      const response =await axios.post(`${API_BASE_URL}/api/auth/login/password`,
          {
            identifier:identifier.trim(),
            password,
          },
          {
            withCredentials: true,
          }
        );


      const {accessToken,user } = response.data;


      if (accessToken) {

        localStorage.setItem(
          'authToken',
          accessToken
        );
      }


      toast.success(
        `Welcome back, ${user.fullname}!`
      );


      navigate( '/app/dashboard', { replace: true, } );

    } catch (err: any) {



      setError(
        err?.response?.data?.message ||
        'Login failed. Please check your credentials.'
      );

    } finally {

      setLoading(false);
    }
  };


  // =========================================================
  // SEND OTP
  // =========================================================

  const handleSendOtp = async (e: React.FormEvent) => {

    e.preventDefault();

    setError('');

    const digitsOnly = mobile.replace(/\D/g, '');


    // Validate 10-digit Indian number

    if (!/^\d{10}$/.test(digitsOnly)) {

      setError(
        'Please enter a valid 10-digit mobile number.'
      );

      return;
    }


    const formattedPhone =`+91${digitsOnly}`;

    setLoading(true);


    try {

      const verifier =  await createRecaptcha();


      const confirmation = await signInWithPhoneNumber(
          auth,
          formattedPhone,
          verifier
        );

      setConfirmationResult(
        confirmation
      );


      setOtpStep(
        'VERIFY'
      );


      setOtp('');


      toast.success(
        `OTP sent to ${formattedPhone}`
      );

    } catch (err: any) {


      cleanupRecaptcha();


      const code = err?.code;


      if (
        code ===
        'auth/too-many-requests'
      ) {

        setError(
          'Too many OTP requests. Please try again later.'
        );

      } else if (
        code ===
        'auth/quota-exceeded'
      ) {

        setError(
          'OTP service is temporarily unavailable. Please try again later.'
        );

      } else if (
        code ===
        'auth/captcha-check-failed'
      ) {

        setError(
          'Security verification failed. Please try again.'
        );

      } else if (
        code ===
        'auth/invalid-phone-number'
      ) {

        setError(
          'Please enter a valid mobile number.'
        );

      } else if (
        code ===
        'auth/operation-not-allowed'
      ) {

        setError(
          'Phone authentication is currently unavailable.'
        );

      } else {

        setError(
          'Unable to send OTP. Please try again.'
        );
      }

    } finally {

      setLoading(false);
    }
  };


  const handleVerifyOtp = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError('');


    // -------------------------------------------------------
    // Validate OTP
    // -------------------------------------------------------

    if (
      !otp ||
      !/^\d{6}$/.test(otp)
    ) {

      setError(
        'Please enter a valid 6-digit OTP.'
      );

      return;
    }


    // -------------------------------------------------------
    // Check Firebase confirmation session
    // -------------------------------------------------------

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


      const result =
        await confirmationResult.confirm(
          otp
        );


      const firebaseUser =
        result.user;


      console.log(
        'Firebase UID:',
        firebaseUser.uid
      );

      console.log(
        'Firebase Phone:',
        firebaseUser.phoneNumber
      );


     

      const idToken =
        await firebaseUser.getIdToken(
          true
        );


      console.log(
        '✅ Firebase ID token generated'
      );


      // -----------------------------------------------------
      // 3. Send Firebase ID Token
      //    to YOUR backend
      // -----------------------------------------------------

      const API_BASE_URL =
        import.meta.env.VITE_API_URL ||
        'http://localhost:8080';


      const response =
        await axios.post(
          `${API_BASE_URL}/api/auth/login/otp`,
          {
            idToken,
          },
          {
            withCredentials: true,
          }
        );


      

      cleanupRecaptcha();

      setConfirmationResult(
        null
      );

      setOtp('');


      const {
        accessToken,
        user,
      } = response.data;

      if (accessToken) {

        localStorage.setItem(
          'authToken',
          accessToken
        );
      }


     
      //  Refresh token is already stored by backend
      //    as HTTP-only cookie.
     

      toast.success(
        `Welcome back, ${user.fullname}!`
      );


      navigate(
        '/app/dashboard',
        {
          replace: true,
        }
      );

    } catch (err: any) {

     


      const firebaseErrorCode = err?.code;

      if (
        firebaseErrorCode ===
        'auth/invalid-verification-code'
      ) {

        setError(
          'Invalid OTP. Please check the code and try again.'
        );

      } else if (
        firebaseErrorCode ===
        'auth/code-expired'
      ) {

        setError(
          'This OTP has expired. Please request a new OTP.'
        );

      } else if (
        firebaseErrorCode ===
        'auth/too-many-requests'
      ) {

        setError(
          'Too many OTP attempts. Please try again later.'
        );

      } else {

        

        if (
          err?.response?.status === 404
        ) {

          
          try {
            await signOut(auth);
          } catch {
            // Ignore Firebase sign-out cleanup error
          }


          setError(
            'No registered account found with this phone number. Please sign up first.'
          );

        } else if (
          err?.response?.status === 401
        ) {

          setError(
            'Authentication failed. Please try again.'
          );

        } else if (
          err?.response?.status === 429
        ) {

          setError(
            'Too many login attempts. Please try again later.'
          );

        } else {

          setError(
            err?.response?.data?.message ||
            'Unable to complete OTP login. Please try again.'
          );
        }
      }


      // -----------------------------------------------------
      // Cleanup after error
      // -----------------------------------------------------

      cleanupRecaptcha();

    } finally {

      setLoading(false);
    }
  };


  // =========================================================
  // CHANGE MOBILE NUMBER
  // =========================================================

  const handleChangeMobile =
    () => {

      if (loading) {
        return;
      }


      cleanupRecaptcha();


      setConfirmationResult(
        null
      );


      setOtp('');


      setOtpStep(
        'PHONE'
      );


      setError('');
    };


  // =========================================================
  // SWITCH AUTH METHOD
  // =========================================================

  const handleAuthMethodChange = (
    method:
      'PASSWORD' | 'OTP'
  ) => {

    if (loading) {
      return;
    }


    // -------------------------------------------------------
    // If leaving OTP mode, cleanup Firebase reCAPTCHA
    // -------------------------------------------------------

    if (
      authMethod === 'OTP'
    ) {

      cleanupRecaptcha();

      setConfirmationResult(
        null
      );

      setOtp('');

      setOtpStep(
        'PHONE'
      );
    }


    setAuthMethod(
      method
    );

    setError('');
  };


  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-950 flex">

      

      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-slate-950 border-r border-slate-800">

        <div className="max-w-md">

          <div className="flex items-center gap-3 mb-8">

            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">

              <span className="text-white font-bold">
                X
              </span>

            </div>

            <span className="text-2xl font-bold text-white">
              ConnectX
            </span>

          </div>


          <h1 className="text-4xl font-bold text-slate-100">
            Welcome back!
          </h1>


          <p className="text-slate-400 mt-4 leading-relaxed">
            Access your account securely via
            Password or OTP verification.
          </p>


          <p className="text-xs text-slate-600 mt-12">
            © {new Date().getFullYear()} ConnectX Inc.
          </p>

        </div>

      </div>


      {/* ===================================================
          RIGHT LOGIN AREA
          =================================================== */}

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">

        <div className="w-full max-w-md space-y-6">


         

          <div className="grid grid-cols-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                handleAuthMethodChange(
                  'PASSWORD'
                )
              }
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authMethod === 'PASSWORD'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Password Login
            </button>


            <button
              type="button"
              disabled={loading}
              onClick={() =>
                handleAuthMethodChange(
                  'OTP'
                )
              }
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authMethod === 'OTP'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              OTP Login
            </button>

          </div>


          {/* =================================================
              TITLE
              ================================================= */}

          <div>

            <h2 className="text-2xl font-bold text-slate-100">

              {authMethod === 'PASSWORD'
                ? 'Sign in with Password'
                : 'Sign in with Mobile OTP'}

            </h2>


            <p className="text-xs text-slate-400 mt-1">

              {authMethod === 'PASSWORD'
                ? 'Enter your mobile number, username, or email along with your password.'
                : 'Enter your registered 10-digit phone number to receive a one-time passcode.'}

            </p>

          </div>


          {/* =================================================
              ERROR
              ================================================= */}

          {error && (

            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-medium">

              {error}

            </div>

          )}


          {/* =================================================
              PASSWORD LOGIN
              ================================================= */}

          {authMethod === 'PASSWORD' && (

            <form
              onSubmit={
                handlePasswordLogin
              }
              className="space-y-4"
            >

              {/* Identifier */}

              <div>

                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Mobile Number / Username / Email
                </label>


                <div className="relative">

                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />


                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) =>
                      setIdentifier(
                        e.target.value
                      )
                    }
                    placeholder="9876543210 or username"
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
                    type="password"
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />

                </div>

              </div>


              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-lg shadow-indigo-600/25"
              >

                <span>
                  {loading
                    ? 'Authenticating...'
                    : 'Sign In'}
                </span>

                <KeyRound className="w-4 h-4" />

              </button>

            </form>
          )}


          {/* =================================================
              OTP LOGIN
              ================================================= */}

          {authMethod === 'OTP' && (

            <>

              {/* =================================================
                  PHONE STEP
                  ================================================= */}

              {otpStep === 'PHONE' && (

                <form
                  onSubmit={
                    handleSendOtp
                  }
                  className="space-y-4"
                >

                  <div>

                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Mobile Number (10 Digits)
                    </label>


                    <div className="relative">

                      <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />


                      <input
                        type="tel"
                        required
                        value={mobile}
                        onChange={(e) =>
                          setMobile(
                            e.target.value
                              .replace(
                                /\D/g,
                                ''
                              )
                              .slice(
                                0,
                                10
                              )
                          )
                        }
                        placeholder="9876543210"
                        maxLength={10}
                        inputMode="numeric"
                        className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      />

                    </div>

                  </div>


                  <button
                    type="submit"
                    disabled={
                      loading ||
                      mobile.length !== 10
                    }
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-lg shadow-indigo-600/25"
                  >

                    <span>
                      {loading
                        ? 'Sending Code...'
                        : 'Send Sign-In Code'}
                    </span>

                    <ArrowRight className="w-4 h-4" />

                  </button>

                </form>
              )}


              {/* =================================================
                  OTP VERIFY STEP
                  ================================================= */}

              {otpStep === 'VERIFY' && (

                <form
                  onSubmit={
                    handleVerifyOtp
                  }
                  className="space-y-4"
                >

                  <div>

                    <label className="block text-xs font-medium text-slate-300 mb-2 text-center">
                      6-Digit OTP Code
                    </label>


                    <p className="text-center text-xs text-slate-500 mb-3">
                      Code sent to +91 {mobile}
                    </p>


                    <div className="relative">

                      <ShieldCheck className="w-4 h-4 absolute left-3 top-3 text-slate-500" />


                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        required
                        value={otp}
                        onChange={(e) =>
                          setOtp(
                            e.target.value
                              .replace(
                                /\D/g,
                                ''
                              )
                              .slice(
                                0,
                                6
                              )
                          )
                        }
                        placeholder="123456"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-lg text-center tracking-widest font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                      />

                    </div>

                  </div>


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
                        : 'Verify & Sign In'}
                    </span>

                    <CheckCircle2 className="w-4 h-4" />

                  </button>


                  {/* Change Number */}

                  <button
                    type="button"
                    onClick={
                      handleChangeMobile
                    }
                    disabled={loading}
                    className="w-full text-center text-xs text-slate-400 hover:text-slate-200 mt-2"
                  >
                    ← Change Mobile Number
                  </button>

                </form>
              )}

            </>
          )}


          {/* =================================================
              SIGNUP LINK
              ================================================= */}

          <p className="text-center text-xs text-slate-400 pt-2">

            Don't have an account yet?{' '}

            <Link
              to="/signup"
              className="text-indigo-400 hover:underline font-medium"
            >
              Sign up
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

