import { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";

import "./login.css";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => reset("password");
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <div className="login-wrapper">
            <div className="login-frame">
                <div className="login-card">
                    {/* Decorative corner elements with gemstones */}
                    <div className="corner-decoration top-left">
                        <div className="gemstone"></div>
                    </div>
                    <div className="corner-decoration top-right">
                        <div className="gemstone"></div>
                    </div>
                    <div className="corner-decoration bottom-left">
                        <div className="gemstone"></div>
                    </div>
                    <div className="corner-decoration bottom-right">
                        <div className="gemstone"></div>
                    </div>

                    {/* Background pattern overlay */}
                    <div className="pattern-overlay"></div>

                    {/* Logo Section with Jewelry Accent */}
                    <div className="login-header">
                        <div className="logo-wrapper">
                            <div className="gem-sparkle"></div>
                            <img
                                src="/images/logo/almas_logo.png"
                                alt="Almas Jewelry"
                                className="login-logo"
                            />
                            <div className="ring-glow"></div>
                        </div>

                        <h1 className="brand-title">ALMAS</h1>
                        <p className="brand-subtitle">
                            Jewelry Database Management
                        </p>
                        <div className="gold-divider">
                            <span className="divider-icon">✦</span>
                            <span className="divider-line"></span>
                            <span className="divider-icon">💎</span>
                            <span className="divider-line"></span>
                            <span className="divider-icon">✦</span>
                        </div>
                        <p className="login-greeting">
                            Welcome, Enter your credentials
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="login-status">
                            <i className="pi pi-info-circle"></i>
                            <span>{status}</span>
                        </div>
                    )}

                    <form onSubmit={submit} className="login-form">
                        <div className="field">
                            <label className="field-label">
                                <i className="pi pi-envelope"></i> Username
                            </label>
                            <div className="input-wrapper">
                                <InputText
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="name@almas.com"
                                    className={`luxury-input ${errors.email ? "p-invalid" : ""}`}
                                />
                                {errors.email && (
                                    <small className="p-error">
                                        <i className="pi pi-exclamation-circle"></i>
                                        {errors.email}
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className="field">
                            <label className="field-label">
                                <i className="pi pi-lock"></i> Password
                            </label>
                            <div className="input-wrapper">
                                <Password
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    toggleMask
                                    feedback={false}
                                    placeholder="••••••••"
                                    className={`luxury-password ${errors.password ? "p-invalid" : ""}`}
                                />
                                {errors.password && (
                                    <small className="p-error">
                                        <i className="pi pi-exclamation-circle"></i>
                                        {errors.password}
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className="login-options">
                            <label className="remember-checkbox">
                                <Checkbox
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.checked)
                                    }
                                    className="custom-checkbox"
                                />
                                <span className="checkbox-label">
                                    Remember me
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="forgot-link"
                                >
                                    <i className="pi pi-question-circle"></i>
                                    Forgot Password?
                                </Link>
                            )}
                        </div>

                        <Button
                            label={processing ? "Authenticating..." : "Sign In"}
                            className="login-btn"
                            disabled={processing}
                            icon={
                                processing
                                    ? "pi pi-spin pi-spinner"
                                    : "pi pi-sign-in"
                            }
                            iconPos="right"
                        />

                        <div className="login-footer">
                            <div className="security-badge">
                                <i className="pi pi-shield"></i>
                                <span>
                                    Secure Access | Encrypted Connection
                                </span>
                            </div>
                            <div className="support-text">
                                <i className="pi pi-star"></i>
                                <span>
                                    Zahinsoft | Software Development Compnay
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
