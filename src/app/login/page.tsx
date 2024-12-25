'use client';
import { useState } from 'react';
import Link from 'next/link';
import './styles.scss';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
    };

    return (
        <>
        <main className="mainContent">
            <div className="section">
                <h2>Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                    <div className="checkboxContainer">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.rememberMe}
                                onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                            />
                            Remember me
                        </label>
                        <Link href="/forgot-password">Forgot Password?</Link>
                    </div>
                    <div className="ctaButtonContainer">
                        <button type="submit">Login</button>
                    </div>
                    <p className="registerLink">
                        Don&apos;t have an account? <Link href="/register">Register</Link>
                    </p>
                </form>
            </div>
        </main>
        </>
    );
};

export default Login;