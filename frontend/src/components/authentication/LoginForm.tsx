import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import {
  LoginBody,
  type LoginBodyType,
} from "../../schemaValidations/auth.schema";
import CookieService from "../../services/CookieService";
import UserService from "../../services/UserService";
import CustomLoadingAnimation from "../common/CustomLoadingAnimation";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginBodyType) {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await UserService.login({
        email: values.email,
        password: values.password,
      });
      CookieService.setCookie("token", res.data.data.access_token, 1);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      toast.success("Đăng nhập thành công");
      sessionStorage.setItem("reload_once", "true");
      setTimeout(() => {
        navigate("/");
      }, 2000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.status === 400 || error.response?.status === 401) {
        setError("Tài khoản hoặc mật khẩu không chính xác");
      } else {
        toast.error("Lỗi", {
          description: error.message || "Lỗi không xác định",
          duration: 3000,
        });
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Fragment>
      <CustomLoadingAnimation isLoading={loading} />
      {error && (
        <p className="mt-1 text-center text-[0.75rem] font-medium text-red-600 md:text-sm">
          {error}
        </p>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-[600px] flex-shrink-0 space-y-2"
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    className={cn(
                      "!h-auto !rounded-none border border-solid border-[#333] px-3 py-2 pr-[2.625rem] text-base font-normal focus:outline-none",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Mật khẩu"
                    type="password"
                    className={cn(
                      "!h-auto !rounded-none border border-solid border-[#333] px-3 py-2 pr-[2.625rem] text-base font-normal focus:outline-none",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <a href={"#"} className="float-right hover:underline">
            Quên mật khẩu?
          </a>
          <Button
            type="submit"
            className={cn(
              "h-auto w-full rounded-none border-[2px] border-solid border-[#1250DC] bg-[#1250DC] py-3 text-base font-bold text-white transition-all duration-200",
              "hover:cursor-pointer hover:bg-[#1250DC]/[0.9]",
            )}
          >
            Đăng nhập
          </Button>
        </form>
      </Form>
    </Fragment>
  );
};

export default LoginForm;
