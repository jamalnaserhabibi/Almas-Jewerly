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
        <GuestLayout>
            <Head title="Login" />

            <div className="login-wrapper">
                <div className="login-frame">
                    <div className="login-card">
                        {/* Logo */}
                        <div className="login-header">
                            <img
                                src="/images/logo/almas_logo.png"
                                alt="Almas Logo"
                                className="login-logo"
                            />

                            <h2 style={{ marginBottom: "5px" }}>
                                Almas Jewelry
                            </h2>
                            <span>Sign in to continue</span>
                        </div>

                        {status && <div className="login-status">{status}</div>}

                        <form onSubmit={submit} className="login-form">
                            {/* Username */}
                            <div className="field">
                                <label>Username</label>

                                <InputText
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="Username"
                                    className="w-full"
                                />

                                {errors.email && (
                                    <small className="p-error">
                                        {errors.email}
                                    </small>
                                )}
                            </div>

                            {/* Password */}
                            <div className="field">
                                <label>Password</label>

                                <Password
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    toggleMask
                                    feedback={false}
                                    placeholder="Password"
                                    className="w-full"
                                />

                                {errors.password && (
                                    <small className="p-error">
                                        {errors.password}
                                    </small>
                                )}
                            </div>

                            {/* Remember */}
                            <div className="login-options">
                                <div className="remember">
                                    <Checkbox
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData("remember", e.checked)
                                        }
                                    />

                                    <label>Remember me</label>
                                </div>

                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="forgot"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            {/* Login Button */}
                            <Button
                                label="Sign In"
                                className="w-full login-btn"
                                disabled={processing}
                            />
                        </form>
                    </div>{" "}
                </div>
            </div>
        </GuestLayout>
    );
}
