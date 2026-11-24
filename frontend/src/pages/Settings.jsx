import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    User,
    Lock,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Shield,
    Mail,
    KeyRound,
} from "lucide-react";

import {
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    Input,
    Field,
    Badge,
    Avatar,
    Spinner,
} from "../components/ui";
import { PageHeader } from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { authApi, aiApi } from "../lib/services";
import { shortDate } from "../lib/format";
import { cn } from "../lib/utils";

function SectionIcon({ icon: Icon, className }) {
    return (
        <div
            className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50",
                className,
            )}
        >
            <Icon className="h-4 w-4 text-brand-700" />
        </div>
    );
}

function ProfileCard({ user, updateUser }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    useEffect(() => {
        if (!user) return;
        reset({
            name: user.name || "",
            company: user.company || "",
            avatar: user.avatar || "",
        });
    }, [user, reset]);

    const onSubmit = async (form) => {
        try {
            const res = await authApi.updateProfile(form);
            updateUser(res.user);
            toast.success("Profile Updated");
        } catch (err) {
            toast.error(err.message || "Could Not Update Profile");
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <SectionIcon icon={User} />
                    <div>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>
                            Update Your Personal Information.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-5">
                <div className="mb-6 flex items-center gap-4 rounded-2xl border border-line bg-surface-muted px-4 py-3">
                    <Avatar name={user?.name} src={user?.avatar} size="lg" />
                    <div>
                        <p className="text-sm font-semibold text-ink">
                            {user?.name}
                        </p>
                        <p className="text-xs text-ink-soft">{user?.email}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                            label="Full Name"
                            error={errors.name?.message}
                            className="sm:col-span-2"
                        >
                            <Input
                                placeholder="Your Full Name"
                                {...register("name", {
                                    required: "Name Is Required",
                                })}
                            />
                        </Field>

                        <Field label="Company">
                            <Input
                                placeholder="Your Company"
                                {...register("company")}
                            />
                        </Field>

                        <Field label="Email Address">
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/50" />
                                <Input
                                    value={user?.email || ""}
                                    disabled
                                    className="pl-9"
                                    readOnly
                                />
                            </div>
                            <p className="mt-1 text-xs text-ink-soft">
                                Email Can't Be Changed — Contact Support If
                                Needed.
                            </p>
                        </Field>

                        <Field
                            label="Avatar URL"
                            error={errors.avatar?.message}
                            className="sm:col-span-2"
                        >
                            <Input
                                placeholder="https://example.com/photo.jpg"
                                {...register("avatar")}
                            />
                        </Field>
                    </div>

                    <div className="flex justify-end pt-1">
                        <Button type="submit" loading={isSubmitting}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function SecurityCard() {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const newPassword = watch("password");

    const onSubmit = async ({ password }) => {
        try {
            await authApi.updateProfile({ password });
            toast.success("Password Updated");
            reset();
        } catch (err) {
            toast.error(err.message || "Could Not Update Password");
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <SectionIcon icon={Lock} />
                    <div>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>Change Your Password.</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                            label="New Password"
                            error={errors.password?.message}
                        >
                            <div className="relative">
                                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/50" />
                                <Input
                                    type="password"
                                    placeholder="Min. 6 Characters"
                                    className="pl-9"
                                    {...register("password", {
                                        required: "Password Is Required",
                                        minLength: {
                                            value: 6,
                                            message:
                                                "Must Be At Least 6 Characters",
                                        },
                                    })}
                                />
                            </div>
                        </Field>

                        <Field
                            label="Confirm New Password"
                            error={errors.confirmPassword?.message}
                        >
                            <Input
                                type="password"
                                placeholder="Re-Enter Password"
                                {...register("confirmPassword", {
                                    required: "Please Confirm Your Password",
                                    validate: (v) =>
                                        v === newPassword ||
                                        "Passwords Do Not Match",
                                })}
                            />
                        </Field>
                    </div>

                    <div className="flex justify-end pt-1">
                        <Button type="submit" loading={isSubmitting}>
                            Update Password
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function AiIntegrationCard() {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        aiApi
            .status()
            .then((res) => setStatus(res))
            .catch(() =>
                setStatus({
                    success: false,
                    configured: false,
                    model: null,
                }),
            );
    }, []);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                        <Sparkles className="h-4 w-4 text-brand-600" />
                    </div>
                    <div>
                        <CardTitle>AI Integration</CardTitle>
                        <CardDescription>
                            Groq Powers Summaries, Email Drafts And Insights.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-5">
                {status === null ? (
                    <div className="flex items-center gap-3 py-2">
                        <Spinner className="p-0" />
                        <span className="text-sm text-ink-soft">
                            Checking Status…
                        </span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            {status.configured ? (
                                <Badge className="bg-brand-50 text-brand-700 border border-brand-200/60">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Connected
                                </Badge>
                            ) : (
                                <Badge className="bg-amber-50 text-amber-700 border border-amber-200/60">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    Not Configured
                                </Badge>
                            )}

                            {status.model && (
                                <span className="rounded-lg border border-line bg-surface-muted px-2.5 py-1 font-mono text-xs text-ink-soft">
                                    {status.model}
                                </span>
                            )}
                        </div>

                        {!status.configured && (
                            <div className="rounded-2xl border border-amber-200/60 bg-amber-50/60 px-4 py-3.5 text-sm text-amber-800">
                                <p className="font-medium mb-1">
                                    Connect Your Gemini Key
                                </p>
                                <p className="text-amber-700/80 leading-relaxed">
                                    Add{" "}
                                    <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs text-amber-900">
                                        GROQ_API_KEY=your_key_here
                                    </code>{" "}
                                    To The Backend{" "}
                                    <code className="font-mono text-xs">
                                        .env
                                    </code>{" "}
                                    File And Restart The Server To Enable AI
                                    Features.
                                </p>
                            </div>
                        )}

                        {status.configured && (
                            <p className="text-sm text-ink-soft">
                                AI Features Are Active. Summaries, Email Drafts,
                                And Pipeline Insights Are All Powered By{" "}
                                <span className="font-medium text-ink">
                                    {status.model}
                                </span>
                                .
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function AccountCard({ user, logout }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <SectionIcon icon={Shield} />
                    <div>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>
                            Your Account Details And Session.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-5">
                <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-line bg-surface-muted px-4 py-3">
                        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink-soft">
                            Role
                        </p>
                        <Badge className="bg-brand-50 text-brand-700 border border-brand-200/60 capitalize">
                            {user?.role || "Member"}
                        </Badge>
                    </div>

                    <div className="rounded-2xl border border-line bg-surface-muted px-4 py-3">
                        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink-soft">
                            Member Since
                        </p>
                        <p className="text-sm font-semibold text-ink">
                            {shortDate(user?.createdAt)}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button variant="danger" onClick={logout}>
                        Log Out
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Settings() {
    const { user, updateUser, logout } = useAuth();

    return (
        <div className="space-y-6 max-w-3xl">
            <PageHeader
                title="Settings"
                subtitle="Manage Your Account And Integrations."
            />

            <ProfileCard user={user} updateUser={updateUser} />
            <SecurityCard />
            <AiIntegrationCard />
            <AccountCard user={user} logout={logout} />
        </div>
    );
}
