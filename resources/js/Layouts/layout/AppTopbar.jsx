/* eslint-disable @next/next/no-img-element */

import { classNames } from "primereact/utils";
import React, {
    forwardRef,
    useContext,
    useImperativeHandle,
    useRef,
    useState,
    useEffect,
    useMemo,
    useCallback,
} from "react";
import { LayoutContext } from "./context/layoutcontext";
import { Link, usePage, router } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { toJalaali } from "jalaali-js"; // Install: npm install jalaali-js

const AppTopbar = forwardRef((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
        useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const menuRef = useRef(null);

    // Get current user with better fallback
    const { auth } = usePage().props;
    const user = auth?.user;
    const displayName = user?.name || "Guest";
    const userInitial = displayName.charAt(0).toUpperCase() || "U";

    // State for current time
    const [currentTime, setCurrentTime] = useState(new Date());

    // Theme configuration
    const THEMES = {
        DARK: {
            id: "vela-blue",
            name: "dark",
            isDark: true,
            logoColor: "white",
            logoSrc: "/images/logo/almas_logo2.png",
        },
        LIGHT: {
            id: "saga-blue",
            name: "light",
            isDark: false,
            logoColor: "#00002D",
            logoSrc: "/images/logo/almas_logo.png",
        },
    };

    // State for theme with proper initialization
    const [currentTheme, setCurrentTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        // Check if saved theme exists and is valid, otherwise default to dark
        if (savedTheme === THEMES.LIGHT.id) {
            return THEMES.LIGHT;
        }
        return THEMES.DARK;
    });

    // Proper Solar Hijri date formatting using jalaali-js
    const formatAfghanistanDate = useCallback((date) => {
        try {
            const { jy, jm, jd } = toJalaali(date);
            const weekdays = [
                "یکشنبه",
                "دوشنبه",
                "سه‌شنبه",
                "چهارشنبه",
                "پنج‌شنبه",
                "جمعه",
                "شنبه",
            ];
            const months = [
                "حمل",
                "ثور",
                "جوزا",
                "سرطان",
                "اسد",
                "سنبله",
                "میزان",
                "عقرب",
                "قوس",
                "جدی",
                "دلو",
                "حوت",
            ];

            const weekdayName = weekdays[date.getDay()];
            const monthName = months[jm - 1];

            return `${weekdayName}، ${jd} ${monthName} ${jy}`;
        } catch (error) {
            console.error("Error formatting Afghanistan date:", error);
            return "تاریخ نامعتبر";
        }
    }, []);

    // Memoized formatted date/time values to optimize performance
    const formattedDateTime = useMemo(() => {
        if (!currentTime)
            return { englishDate: "", afghanistanDate: "", formattedTime: "" };

        try {
            return {
                englishDate: currentTime.toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }),
                afghanistanDate: formatAfghanistanDate(currentTime),
                formattedTime: currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                }),
            };
        } catch (error) {
            console.error("Error formatting date/time:", error);
            return { englishDate: "", afghanistanDate: "", formattedTime: "" };
        }
    }, [currentTime, formatAfghanistanDate]);

    // Update time every second with proper cleanup
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    // Apply theme changes to DOM and localStorage
    const applyTheme = useCallback((theme) => {
        const themeLink = document.getElementById("theme-css");
        if (themeLink) {
            themeLink.href = `/themes/${theme.id}/theme.css`;
            localStorage.setItem("theme", theme.id);
            setCurrentTheme(theme);
        } else {
            console.error("Theme link element not found");
            // Fallback: try to find theme link by selector
            const fallbackThemeLink = document.querySelector(
                'link[href*="theme.css"]',
            );
            if (fallbackThemeLink) {
                fallbackThemeLink.href = `/themes/${theme.id}/theme.css`;
                localStorage.setItem("theme", theme.id);
                setCurrentTheme(theme);
            }
        }
    }, []);

    // Theme switcher function
    const toggleTheme = useCallback(() => {
        const newTheme = currentTheme.isDark ? THEMES.LIGHT : THEMES.DARK;
        applyTheme(newTheme);
    }, [currentTheme, applyTheme]);

    // Handle user logout with error handling
    const handleLogout = useCallback(() => {
        try {
            router.post(
                route("logout"),
                {},
                {
                    onError: (errors) => {
                        console.error("Logout failed:", errors);
                        // Fallback logout if route fails
                        window.location.href = "/logout";
                    },
                },
            );
        } catch (error) {
            console.error("Logout error:", error);
            // Fallback logout
            window.location.href = "/logout";
        }
    }, []);

    // Handle profile navigation with Inertia
    const handleProfileClick = useCallback(() => {
        try {
            const profileRoute = route("profile.edit");
            if (profileRoute) {
                router.get(profileRoute);
            } else {
                console.error("Profile route not found");
                window.location.href = "/profile";
            }
        } catch (error) {
            console.error("Profile navigation error:", error);
            window.location.href = "/profile";
        }
    }, []);

    // User menu items with proper handlers
    const userMenuItems = useMemo(
        () => [
            {
                label: displayName,
                items: [
                    {
                        label: "Profile",
                        icon: "pi pi-user",
                        command: handleProfileClick,
                    },
                    {
                        label: "Logout",
                        icon: "pi pi-lock",
                        command: handleLogout,
                    },
                ],
            },
        ],
        [displayName, handleProfileClick, handleLogout],
    );

    // Sync logo based on current theme
    const logoSrc = currentTheme.logoSrc;
    const logoColor = currentTheme.logoColor;

    return (
        <div className="layout-topbar">
            {/* Logo Section */}
            <Link href="/" className="layout-topbar-logo">
                <img src={logoSrc} alt="Almas Jewelry Logo" />
                <span
                    className="ml-2 font-bold"
                    style={{ color: logoColor, fontSize: "1.8rem" }}
                >
                    Almas Jewelry
                </span>
            </Link>

            {/* Menu Toggle Button (Mobile) */}
            <button
                ref={menubuttonRef}
                type="button"
                className="p-link layout-menu-button layout-topbar-button"
                onClick={onMenuToggle}
                aria-label="Toggle Menu"
            >
                <i className="pi pi-bars" />
            </button>

            {/* Right Side Content */}
            <div className="flex align-items-center gap-4 ml-auto">
                {/* Theme Switcher Button */}
                <Button
                    type="button"
                    className="p-button-rounded p-button-text p-button-plain"
                    onClick={toggleTheme}
                    tooltip={
                        currentTheme.isDark
                            ? "Switch to Light Theme"
                            : "Switch to Dark Theme"
                    }
                    tooltipOptions={{ position: "bottom" }}
                    aria-label={
                        currentTheme.isDark
                            ? "Switch to Light Theme"
                            : "Switch to Dark Theme"
                    }
                >
                    <i
                        className={`pi ${currentTheme.isDark ? "pi-sun" : "pi-moon"} text-xl`}
                        aria-hidden="true"
                    />
                </Button>

                {/* Date and Time Display - Desktop */}
                <div className="hidden md:flex flex-row gap-5 align-items-end">
                    {/* English Date */}
                    <div
                        className="text-md font-bold text-900"
                        aria-label="English Date"
                    >
                        {formattedDateTime.englishDate}
                    </div>

                    {/* Afghanistan Date */}
                    <div
                        className="text-md font-bold text-900"
                        style={{
                            fontFamily: "Vazirmatn, system-ui, sans-serif",
                        }}
                        aria-label="Afghanistan Date"
                        dir="rtl"
                    >
                        {formattedDateTime.afghanistanDate}
                    </div>

                    {/* Time */}
                    <div
                        className="text-lg font-bold text-900 flex align-items-center gap-2 mt-1"
                        aria-label="Current Time"
                    >
                        <i
                            className="pi pi-clock text-primary"
                            aria-hidden="true"
                        ></i>
                        {formattedDateTime.formattedTime}
                    </div>
                </div>

                {/* Mobile Date/Time - Simplified version for mobile */}
                <div className="flex md:hidden flex-row gap-2 align-items-center">
                    <div className="text-sm font-bold text-900">
                        {formattedDateTime.formattedTime}
                    </div>
                </div>

                {/* User Info and Menu */}
                <div className="flex align-items-center gap-3">
                    <span
                        className="hidden lg:inline text-900 flex align-items-center font-bold mt-1"
                        aria-label={`Logged in as ${displayName}`}
                    >
                        {displayName}
                    </span>

                    {/* User Avatar with Dropdown Menu */}
                    <div className="relative">
                        <Button
                            ref={topbarmenubuttonRef}
                            type="button"
                            className="p-button-rounded p-button-text p-button-plain"
                            onClick={(e) => menuRef.current?.toggle(e)}
                            aria-label="User Menu"
                            aria-haspopup="true"
                        >
                            <Avatar
                                label={userInitial}
                                shape="circle"
                                size="large"
                                className="bg-primary text-white"
                                style={{ width: "40px", height: "40px" }}
                                aria-label={`User avatar for ${displayName}`}
                            />
                        </Button>

                        {/* Dropdown Menu */}
                        <Menu
                            model={userMenuItems}
                            popup
                            ref={menuRef}
                            id="user_menu"
                            popupAlignment="right"
                            className="mt-2"
                        />
                    </div>
                </div>
            </div>

            {/* Legacy menu (hidden) */}
            <div
                ref={topbarmenuRef}
                className={classNames("layout-topbar-menu", {
                    "layout-topbar-menu-mobile-active":
                        layoutState.profileSidebarVisible,
                })}
                style={{ display: "none" }}
                aria-hidden="true"
            />
        </div>
    );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
