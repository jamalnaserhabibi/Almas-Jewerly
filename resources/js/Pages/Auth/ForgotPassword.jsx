import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";

export default function ForgotPassword({ status }) {
    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                    {/* Branding */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Almas Jewelry
                        </h1>
                        <p className="text-sm text-gray-500">
                            Password Recovery
                        </p>
                    </div>

                    <div className="mb-4 text-sm text-gray-600 text-center">
                        Enter your email address and we will send you a password
                        reset link.
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 text-center">
                            {status}
                        </div>
                    )}

                    {/* Button */}
                    <div className="flex items-center justify-center mt-6">
                        <PrimaryButton className="w-full justify-center">
                            Contact Zahin Soft
                        </PrimaryButton>
                    </div>
                    <div className="flex items-center justify-center mt-6">
                        <PrimaryButton className="w-full justify-center">
                            Contact Almas Jewelry
                        </PrimaryButton>
                    </div>

                    {/* Footer / Permission */}
                    <div className="mt-8 text-center text-xs text-gray-400">
                        Access provided with permission from
                        <span className="font-semibold"> Almas Jewelry </span>
                        <br />
                        Powered by{" "}
                        <a
                            href="https://zahinsoft.com"
                            target="_blank"
                            className="text-blue-500 hover:underline"
                        >
                            Zahin Soft
                        </a>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
