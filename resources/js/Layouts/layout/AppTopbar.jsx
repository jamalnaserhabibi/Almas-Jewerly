/* eslint-disable @next/next/no-img-element */

import { classNames } from "primereact/utils";
import React, {
    forwardRef,
    useContext,
    useImperativeHandle,
    useRef,
    useState,
    useEffect,
} from "react";
import { LayoutContext } from "./context/layoutcontext";
import { Link, usePage, router } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";

const AppTopbar = forwardRef((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
        useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const menuRef = useRef(null);

    // Get current user
    const { auth } = usePage().props;
    const user = auth?.user;

    // State for current time
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format English date
    const englishDate = currentTime.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    // Format Afghanistan date (Solar Hijri)
    const formatAfghanistanDate = (date) => {
        const days = [
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

        // Approximate Solar Hijri conversion
        const gregorianYear = date.getFullYear();
        const gregorianMonth = date.getMonth();
        const gregorianDay = date.getDate();

        let solarYear = gregorianYear - 621;
        let solarMonth = gregorianMonth + 1;
        let solarDay = gregorianDay;

        // Adjust for Nowruz (March 21)
        if (gregorianMonth < 2 || (gregorianMonth === 2 && gregorianDay < 21)) {
            solarYear = gregorianYear - 622;
            solarMonth = gregorianMonth + 10;
        } else {
            solarMonth = gregorianMonth - 2;
        }

        // Adjust month range
        if (solarMonth > 12) solarMonth -= 12;
        if (solarMonth < 1) solarMonth += 12;

        const dayName = days[date.getDay()];
        const monthName = months[solarMonth - 1];

        return `${dayName}، ${solarDay} ${monthName} ${solarYear}`;
    };

    const afghanistanDate = formatAfghanistanDate(currentTime);

    // Format time
    const formattedTime = currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    // User menu items
    const userMenuItems = [
        {
            label: user?.name || "User",
            items: [
                {
                    label: "Profile",
                    icon: "pi pi-user",
                    command: () => {
                        window.location.href = route("profile.edit");
                    },
                },
                {
                    label: "Logout",
                    icon: "pi pi-lock",
                    command: () => {
                        router.post(route("logout"));
                    },
                },
            ],
        },
    ];

    return (
        <div className="layout-topbar">
            {/* Logo Section */}
            <Link href="/" className="layout-topbar-logo">
                <img
                    src="/images/logo/almas_logo.png"
                    height={"35px"}
                    alt="logo"
                />
                <span className="ml-2 font-bold">Almas Jewelry</span>
            </Link>

            {/* Menu Toggle Button (Mobile) */}
            <button
                ref={menubuttonRef}
                type="button"
                className="p-link layout-menu-button layout-topbar-button"
                onClick={onMenuToggle}
            >
                <i className="pi pi-bars" />
            </button>

            {/* Right Side Content */}
            <div className="flex align-items-center gap-4 ml-auto">
                {/* Date and Time Display - Both Formats */}
                <div className="hidden md:flex flex-row gap-5 align-items-end">
                    {/* English Date */}
                    <div className="text-sm text-500 font-medium">
                        {englishDate}
                    </div>
                    {/* Afghanistan Date */}
                    <div
                        className="text-md font-bold text-900"
                        style={{
                            fontFamily: "Vazirmatn, system-ui, sans-serif",
                        }}
                    >
                        {afghanistanDate}
                    </div>
                    {/* Time */}
                    <div className="text-lg font-bold text-900 flex align-items-center gap-2 mt-1">
                        <i className="pi pi-clock text-primary"></i>
                        {formattedTime}
                    </div>
                </div>

                {/* User Info and Menu */}
                <div className="flex align-items-center gap-3">
                    {/* User Name (hidden on mobile) */}
                    <span className="hidden lg:inline text-900 font-medium">
                        {user?.name || "User"}
                    </span>

                    {/* User Avatar with Dropdown Menu */}
                    <div className="relative">
                        <Button
                            ref={topbarmenubuttonRef}
                            type="button"
                            className="p-button-rounded p-button-text p-button-plain"
                            onClick={(e) => menuRef.current?.toggle(e)}
                        >
                            <Avatar
                                label={
                                    user?.name?.charAt(0).toUpperCase() || "U"
                                }
                                shape="circle"
                                size="large"
                                className="bg-primary text-white"
                                style={{ width: "40px", height: "40px" }}
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
            />
        </div>
    );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
