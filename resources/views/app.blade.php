<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'LaraReact') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

                <!-- Bootstrap Themes -->
                <!-- <link id="theme-css" href={{asset('/themes/bootstrap4-light-blue/theme.css')}} rel="stylesheet">   -->
                <!-- <link id="theme-css" href={{asset('/themes/bootstrap4-light-purple/theme.css')}} rel="stylesheet"> -->
                <!-- <link id="theme-css" href={{asset('/themes/bootstrap4-dark-blue/theme.css')}} rel="stylesheet"> -->
                <!-- <link id="theme-css" href={{asset('/themes/bootstrap4-dark-purple/theme.css')}} rel="stylesheet">  -->

                <!-- Material Design Themes -->
                <!-- <link id="theme-css" href={{asset('/themes/md-light-indigo/theme.css')}} rel="stylesheet">
                <link id="theme-css" href={{asset('/themes/md-light-deeppurple/theme.css')}} rel="stylesheet">
                <link id="theme-css" href={{asset('/themes/md-dark-indigo/theme.css')}} rel="stylesheet">
                <link id="theme-css" href={{asset('/themes/md-dark-deeppurple/theme.css')}} rel="stylesheet"> -->

                <!-- Material Design Compact (MDC) Themes -->
                <!-- <link id="theme-css" href={{asset('/themes/mdc-light-indigo/theme.css')}} rel="stylesheet">
                <link id="theme-css" href={{asset('/themes/mdc-light-deeppurple/theme.css')}} rel="stylesheet">
                <link id="theme-css" href={{asset('/themes/mdc-dark-indigo/theme.css')}} rel="stylesheet">
                <link id="theme-css" href={{asset('/themes/mdc-dark-deeppurple/theme.css')}} rel="stylesheet"> -->

                <!-- Tailwind Theme -->
                <!-- <link id="theme-css" href={{asset('/themes/tailwind-light/theme.css')}} rel="stylesheet"> -->

                <!-- Fluent UI Theme -->
                <!-- <link id="theme-css" href={{asset('/themes/fluent-light/theme.css')}} rel="stylesheet"> -->

                <!-- PrimeOne Design 2022 - Lara Light Themes -->
                <!-- <link id="theme-css" href={{asset('/themes/lara-light-indigo/theme.css')}} rel="stylesheet">
                <link id="theme-css" href={{asset('/themes/lara-light-blue/theme.css')}} rel="stylesheet">
                <link id="theme-css" href={{asset('/themes/lara-light-purple/theme.css')}} rel="stylesheet">
                <link id="theme-css" href={{asset('/themes/lara-light-teal/theme.css')}} rel="stylesheet"> -->

                <!-- PrimeOne Design 2022 - Lara Dark Themes -->
                <!-- <link id="theme-css" href={{asset('/themes/lara-dark-indigo/theme.css')}} rel="stylesheet">
                <link id="theme-css" href={{asset('/themes/lara-dark-blue/theme.css')}} rel="stylesheet">
                <link id="theme-css" href={{asset('/themes/lara-dark-purple/theme.css')}} rel="stylesheet">
                <link id="theme-css" href={{asset('/themes/lara-dark-teal/theme.css')}} rel="stylesheet"> -->

                <!-- PrimeOne Design 2021 - Saga Light Themes -->
                <!-- <link id="theme-css" href={{asset('/themes/saga-blue/theme.css')}} rel="stylesheet"> -->
                <!-- <link id="theme-css" href={{asset('/themes/saga-green/theme.css')}} rel="stylesheet"> -->
                <!-- <link id="theme-css" href={{asset('/themes/saga-orange/theme.css')}} rel="stylesheet"> -->
                <!-- <link id="theme-css" href={{asset('/themes/saga-purple/theme.css')}} rel="stylesheet"> -->

                <!-- PrimeOne Design 2021 - Vela Dark Themes -->
                <link id="theme-css" href={{asset('/themes/vela-blue/theme.css')}} rel="stylesheet">
                <!-- <link id="theme-css" href={{asset('/themes/vela-green/theme.css')}} rel="stylesheet"> -->
                <!-- <link id="theme-css" href={{asset('/themes/vela-orange/theme.css')}} rel="stylesheet"> -->
                <!-- <link id="theme-css" href={{asset('/themes/vela-purple/theme.css')}} rel="stylesheet"> -->

                <!-- PrimeOne Design 2021 - Arya Dark Themes -->
                <!-- <link id="theme-css" href={{asset('/themes/arya-blue/theme.css')}} rel="stylesheet">
                <link id="theme-css" href={{asset('/themes/arya-green/theme.css')}} rel="stylesheet">
                <link id="theme-css" href={{asset('/themes/arya-orange/theme.css')}} rel="stylesheet">
                <link id="theme-css" href={{asset('/themes/arya-purple/theme.css')}} rel="stylesheet"> -->

     </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
