import React, { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model = [
        {
            label: "Home",
            items: [
                {
                    label: "Dashboard",
                    icon: "pi pi-fw pi-home",
                    to: "/dashboard",
                },
                // {
                //     label: "Button",
                //     icon: "pi pi-fw pi-id-card",
                //     to: "/uikit/button",
                // },
            ],
        },

        {
            label: "Gold",
            items: [
                {
                    label: "Gold Stock",
                    icon: "pi pi-fw pi-star",
                    to: "/gold-items",
                },

                {
                    label: "Sold Items",
                    icon: "pi pi-shopping-cart",

                    to: "/sales",
                },
                {
                    label: "All Golds",
                    icon: "pi pi-fw pi-list",
                    to: "/all-items",
                },
            ],
        },
        {
            label: "Customers",
            items: [
                {
                    label: "Customers",
                    icon: "pi pi-fw pi-users",
                    to: "/customers",
                },
            ],
        },
        {
            label: "Company Management",
            items: [
                {
                    label: "Companies",
                    icon: "pi pi-fw pi-building",
                    to: "/companies",
                },
            ],
        },
        {
            label: "Cash Balance",
            items: [
                {
                    label: "Cash",
                    icon: "pi pi-fw pi-users",
                    to: "/users",
                },
            ],
        },
        {
            label: "User Management",
            items: [
                {
                    label: "Users",
                    icon: "pi pi-fw pi-users",
                    to: "/users",
                },
            ],
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? (
                        <AppMenuitem
                            item={item}
                            root={true}
                            index={i}
                            key={item.label}
                        />
                    ) : (
                        <li className="menu-separator"></li>
                    );
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
