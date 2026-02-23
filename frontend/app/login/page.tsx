"use client";
import { useState, Suspense } from 'react';
import toast from "react-hot-toast";
// import { sendEmailVerification } from "firebase/auth";
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Activity } from 'lucide-react';
import React, { useEffect } from 'react';

function LoginForm() {
    const searchParams = useSearchParams();
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState<'PATIENT' | 'DOCTOR'>((searchParams.get('role') as 'DOCTOR') || 'PATIENT');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [mobile, setMobile] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');

    const [hospitalName, setHospitalName] = useState('');
    const [city, setCity] = useState('');
    const [licenseId, setLicenseId] = useState('');
    // const [role, setRole] = useState("PATIENT");

    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();



    // Auto-redirect if already logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists() && userDoc.data().role === 'DOCTOR') {
                    router.push('/doctor');
                } else {
                    router.push('/patient');
                }
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                // LOGIN FLOW
                const userCred = await signInWithEmailAndPassword(auth, email, password);
                
                // if (!userCred.user.emailVerified) {
                //     toast.error("Please verify your email before logging in.");
                //     await signOut(auth);
                //     setLoading(false);
                //     return;
                // }

                // Fetch role from DB
                const userRef = doc(db, "users", userCred.user.uid);
                const userDoc = await getDoc(userRef);
                let dbRole = userDoc.exists() ? userDoc.data().role : null;

                // FIX: If user explicit selects DOCTOR in UI but DB says PATIENT/Null, update DB
                if (role === 'DOCTOR' && dbRole !== 'DOCTOR') {
                    await setDoc(userRef, {
                        uid: userCred.user.uid,
                        email,
                        role: 'DOCTOR',
                        updatedAt: new Date().toISOString()
                    }, { merge: true });
                    dbRole = 'DOCTOR';
                }

                if (dbRole === 'DOCTOR') router.push('/doctor');
                else router.push('/patient');

            } else {
                if (password !== confirmPassword) {
                    // setError("Passwords do not match.");
                    toast.error("Passwords do not match.");

                    setLoading(false);
                    return;
                }
                // if (!fullName || !mobile || !age) {
                //     // setError("Please fill in all fields.");
                //     toast.error("All required fields must be completed.");
                //     setLoading(false);
                //     return;
                // }
                if (!fullName.trim() || !mobile.trim() || !age.trim()) {
                    toast.error("All required fields must be completed.");
                    setLoading(false);
                    return;
                }
                const ageNumber = parseInt(age);
                if (isNaN(ageNumber) || ageNumber < 1 || ageNumber > 120) {
                    toast.error("Please enter a valid age between 1 and 120.");
                    setLoading(false);
                    return;
                }


                // Validation: Gmail Only
                if (!email.toLowerCase().endsWith('@gmail.com')) {
                    toast.error("Only Gmail addresses are permitted for registration.");
                    setLoading(false);
                    return;
                }

                // if (!email.endsWith('@gmail.com')) {
                //     // setError("Only @gmail.com addresses are allowed.");
                //     toast.error("Only Gmail addresses are permitted for registration.");

                //     setLoading(false);
                //     return;
                // }
                // Validation: Mobile 10 Digits
                if (!/^\d{10}$/.test(mobile)) {
                    // setError("Mobile number must be exactly 10 digits.");
                    toast.error("Mobile number must contain exactly 10 digits.");

                    setLoading(false);
                    return;
                }
                // ✅ Doctor validation
                if (role === 'DOCTOR') {
                    if (!hospitalName.trim() || !city.trim() ) {
                        toast.error("All doctor fields are required.");
                        setLoading(false);
                        return;
                    }
                }

                // SIGNUP FLOW
                const userCred = await createUserWithEmailAndPassword(auth, email, password);
                // await sendEmailVerification(userCred.user);

                try {
                    // Upload Photo if exists
                    let photoURL = "";
                    if (profilePhoto) {
                        try {
                            const formData = new FormData();
                            formData.append("file", profilePhoto);
                            const res = await fetch("http://127.0.0.1:8000/upload", {
                                method: "POST",
                                body: formData
                            });
                            if (res.ok) {
                                const data = await res.json();
                                photoURL = data.url;
                            }
                        } catch (err) {
                            console.error("Photo upload failed", err);
                            // Continue signup even if photo fails
                        }
                    }

                    // Create user profile in Firestore
                    // ✅ Save including doctor fields
                    await setDoc(doc(db, "users", userCred.user.uid), {
                        uid: userCred.user.uid,
                        email,
                        role,
                        fullName,
                        mobile,
                        age,
                        gender,
                        photoURL,
                        hospitalName: role === 'DOCTOR' ? hospitalName : null,
                        city: role === 'DOCTOR' ? city : null,
                        licenseId: role === 'DOCTOR' ? licenseId : null,
                        createdAt: new Date().toISOString()
                    });

                } catch (firestoreError) {
                    console.error("Firestore Profile Creation Error:", firestoreError);
                }

                // IMPORTANT: Sign out immediately so they have to log in manually
                await signOut(auth);

                // alert("Account created successfully! Please login.");
                toast.success("Account created successfully! Please login.");
                setIsLogin(true); // Switch to Login view
                setPassword("");  // Clear password for security
            }

        } catch (err: any) {
            console.error("Authentication Error Details:", err);
            let msg = err.message;
            if (err.code === 'auth/invalid-credential') msg = "Invalid email or password. Please check your credentials.";
            else if (err.code === 'auth/email-already-in-use') msg = "This email is already registered. Please login.";
            else if (err.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";

            // setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-1000 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: role === 'DOCTOR'
                    ? "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('https://img.freepik.com/premium-photo/health-care-banner-medical-images-medical-background-images_593195-4.jpg')"
                    : "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSLMQRWe1pVJ89Hmlu1aK8hRZpyViICA1-3g&s')"
            }}
        >
            <div className="mb-8 flex items-center gap-2 text-2xl font-bold">
                <Activity className="text-blue-500" size={32} />
                <span>MediXpert Access</span>
            </div>

            <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>

                {/* Role Toggle */}
                {/* Role Toggle - Always Visible */}
                <div className="flex bg-white/5 rounded-lg p-1 mb-6">
                    <button
                        type="button"
                        onClick={() => setRole('PATIENT')}
                        className={`flex-1 py-2 rounded-md transition ${role === 'PATIENT' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Patient
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('DOCTOR')}
                        className={`flex-1 py-2 rounded-md transition ${role === 'DOCTOR' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Doctor
                    </button>
                </div>

                <form onSubmit={handleAuth} className="flex flex-col gap-4">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Mobile Number</label>
                                <input
                                    type="text"
                                    required
                                    value={mobile}
                                    onChange={(e) => {
                                        // Only allow typing numbers
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 10) setMobile(val);
                                    }}
                                    className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter mobile number"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-400 mb-1">Age</label>
                                    <input
                                        type="number"
                                        required
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 outline-none transition"
                                        placeholder="Enter age"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-400 mb-1">Gender</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white focus:border-blue-500 outline-none transition"
                                    >
                                        <option value="" disabled className="text-gray-500">
                                            Select Gender
                                        </option>
                                        <option value="Male" className="text-black">Male</option>
                                        <option value="Female" className="text-black">Female</option>
                                        <option value="Other" className="text-black">Other</option>
                                    </select>

                                    

                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Profile Photo (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                                />
                            </div>
                        </>
                    )}

                    {!isLogin && role === 'DOCTOR' && (
  <>
    {/* Clinic + City Row */}
    <div className="flex gap-4">
      <div className="flex-1">
        <label className="block text-sm text-gray-400 mb-1">
          Clinic / Hospital Name
        </label>
        <input
          type="text"
          required
          value={hospitalName}
          onChange={(e) => setHospitalName(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white focus:border-emerald-500 outline-none transition"
          placeholder="Hospital Name"
        />
      </div>

      <div className="flex-1">
        <label className="block text-sm text-gray-400 mb-1">
          City / Location
        </label>
        <input
          type="text"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white focus:border-emerald-500 outline-none transition"
          placeholder="City"
        />
      </div>
    </div>

    {/* License Full Width */}
    <div>
      <label className="block text-sm text-gray-400 mb-1">
        Medical License ID(Optional for testing)
      </label>
      <input
      type="text"
      value={licenseId}
      onChange={(e) => setLicenseId(e.target.value)}
      className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white focus:border-emerald-500 outline-none transition"
      placeholder="Enter License / Registration Number (Optional)"
      />
    </div>
  </>
)}

                    <div>
                        
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 outline-none transition"
                            placeholder="Please enter your Email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 outline-none transition"
                            placeholder="Enter password"
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 outline-none transition"
                                placeholder="Please confirm password"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold mt-2 transition ${role === 'DOCTOR' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50`}
                    >
                        {/* {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')} */}
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                Processing...
                                </span>
                            ) : (isLogin ? 'Login' : 'Sign Up')}

                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-gray-400 hover:text-white underline"
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
            <LoginForm />
        </Suspense>
    );
}
