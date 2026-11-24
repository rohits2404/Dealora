import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { User, Mail, Lock, Building2 } from "lucide-react";
import { AuthShell } from "./AuthShell";
import { Button, Field, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            await registerUser(data);
            toast.success("Account Created — Welcome To DEALORA! 🎉");
            navigate("/", { replace: true });
        } catch (err) {
            toast.error(err.message || "Registration Failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthShell>
            <h1 className="text-2xl font-bold text-ink">Create Your Account</h1>
            <p className="mt-1.5 text-sm text-ink-soft">
                Start Managing Your Pipeline In Minutes.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                <Field label="Full Name" error={errors.name?.message}>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                        <Input
                            placeholder="Sujon Ahmed"
                            className="pl-9"
                            {...register("name", {
                                required: "Name Is Required",
                            })}
                        />
                    </div>
                </Field>

                <Field label="Company" error={errors.company?.message}>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                        <Input
                            placeholder="Dealora"
                            className="pl-9"
                            {...register("company")}
                        />
                    </div>
                </Field>

                <Field label="Email" error={errors.email?.message}>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                        <Input
                            type="email"
                            placeholder="You@Company.com"
                            className="pl-9"
                            {...register("email", {
                                required: "Email Is Required",
                            })}
                        />
                    </div>
                </Field>

                <Field label="Password" error={errors.password?.message}>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                        <Input
                            type="password"
                            placeholder="At Least 6 Characters"
                            className="pl-9"
                            {...register("password", {
                                required: "Password Is Required",
                                minLength: {
                                    value: 6,
                                    message: "Minimum 6 Characters",
                                },
                            })}
                        />
                    </div>
                </Field>

                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    loading={submitting}
                >
                    Create Account
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-soft">
                Already Have An Account?{" "}
                <Link
                    to="/login"
                    className="font-semibold text-brand-700 hover:underline"
                >
                    Sign In
                </Link>
            </p>
        </AuthShell>
    );
}
