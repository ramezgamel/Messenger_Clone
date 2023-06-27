"use client";
import Button from "@/app/components/Button";
import { Input } from "@/app/components/inputs/Input";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AuthSocialButton } from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
type variant = "LOGIN" | "REGISTER";
const AuthForm = () => {
  const session = useSession();
  const [variant, setVariant] = useState<variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toggleVariant = useCallback(() => {
    if (variant == "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if (variant == "REGISTER") {
      axios
        .post("/api/register", data)
        .catch(() => toast.error("Something went wrong!"))
        .finally(() => setIsLoading(false));
    }
    if (variant == "LOGIN") {
      signIn("credentials", { ...data, redirect: false })
        .then((cb) => {
          if (cb?.error) toast.error("Invalid Credentials");
          if (cb?.ok && !cb?.error) toast.success("Logged in");
        })
        .finally(() => setIsLoading(false));
    }
  };
  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, { redirect: false })
      .then((cb) => {
        if (cb?.error) toast.error("Invalid credentials");
        if (cb?.ok && !cb?.error) toast.success("Success");
      })
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    if (session?.status == "authenticated") {
      router.push("/users");
    }
  }, [session?.status, router]);
  return (
    <div
      className="
      mt-8
      sm:mx-auto
      sm:w-full
      sm:max-w-md
    "
    >
      <div
        className="
          bg-white
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        "
      >
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant == "REGISTER" && (
            <Input
              label="Name"
              id="name"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            label="Email"
            id="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            label="Password"
            id="password"
            register={register}
            errors={errors}
            type="password"
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant == "LOGIN" ? "Sign in" : "Sign Up"}
            </Button>
          </div>
        </form>
        <div className="mt-7">
          <div className="relative ">
            <div
              className="
              absolute
              inset-0
              flex
              item-center
            "
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className="bg-white px-2 text-gray-500"
                style={{ transform: "translateY(-50%)" }}
              >
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
          <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
            {variant == "LOGIN"
              ? "New to Messenger"
              : "Already have an account?"}
            <div className="underline cursor-pointer" onClick={toggleVariant}>
              {variant == "LOGIN" ? "Create an account" : "Login"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
