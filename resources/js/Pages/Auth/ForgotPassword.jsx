import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";

import "./forgot-password.css";

export default function ForgotPassword({ status }) {
    return (
        <div className="forgot-wrapper">
            <div className="forgot-frame">
                <div className="forgot-card">
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

                    {/* Logo Section */}
                    <div className="forgot-header">
                        <div className="logo-wrapper">
                            <div className="gem-sparkle"></div>
                            <img
                                src="/images/logo/almas_logo.png"
                                alt="Almas Jewelry"
                                className="forgot-logo"
                            />
                            <div className="ring-glow"></div>
                        </div>

                        <h1 className="brand-title">ALMAS</h1>
                        <p className="brand-subtitle">
                            Fine Jewelry Management
                        </p>
                        <div className="gold-divider">
                            <span className="divider-icon">✦</span>
                            <span className="divider-line"></span>
                            <span className="divider-icon">💎</span>
                            <span className="divider-line"></span>
                            <span className="divider-icon">✦</span>
                        </div>
                        <p className="recovery-title">Password Recovery</p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="success-status">
                            <i className="pi pi-check-circle"></i>
                            <span>{status}</span>
                        </div>
                    )}

                    {/* Info Message */}
                    <div className="info-message">
                        <i className="pi pi-info-circle"></i>
                        <span>
                            Without credentials you can't access the system.
                            Please contact the appropriate department for
                            assistance.
                        </span>
                    </div>

                    {/* Contact Buttons */}
                    <div className="contact-buttons">
                        <button className="contact-btn zahin-btn">
                            <i className="pi pi-building"></i>
                            <span>Contact Zahin Soft</span>
                            <i className="pi pi-arrow-right"></i>
                        </button>

                        <button className="contact-btn almas-btn">
                            <i className="pi pi-star"></i>
                            <span>Contact Almas Jewelry</span>
                            <i className="pi pi-arrow-right"></i>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="forgot-footer">
                        <div className="permission-badge">
                            <i className="pi pi-shield"></i>
                            <span>Access provided with permission from</span>
                            <strong>Almas Jewelry</strong>
                        </div>
                        <div className="powered-by">
                            <span>Powered by</span>
                            <a
                                href="https://zahinsoft.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="zahin-link"
                            >
                                <i className="pi pi-code"></i>
                                Zahin Soft
                            </a>
                        </div>
                    </div>

                    {/* Back to Login Link */}
                    <div className="back-link">
                        <a href="/login" className="back-to-login">
                            <i className="pi pi-arrow-left"></i>
                            <span>Back to Login</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
